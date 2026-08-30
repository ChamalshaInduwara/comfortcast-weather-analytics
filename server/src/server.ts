import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { auth } from "express-oauth2-jwt-bearer";

import type { Request, Response, NextFunction } from "express";

import { getWeatherByCityId } from "./services/weather.service.js";
import { getCityCodes } from "./services/city.service.js";
import { calculateComfortIndex } from "./services/comfort.service.js";
import { getCacheStatus } from "./services/cache.service.js";
import { getTemperatureTrend } from "./services/forecast.service.js";

dotenv.config();

/* =========================================================
   ENVIRONMENT VARIABLES
========================================================= */

const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0Audience = process.env.AUTH0_AUDIENCE;
const port = Number(process.env.PORT ?? 5000);
const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
const ANALYTICS_CACHE_TTL = 5 * 60 * 1000;

let analyticsCache: {
  data: object;
  expiresAt: number;
} | null = null;

if (!auth0Domain || !auth0Audience || !process.env.OPENWEATHER_API_KEY) {
  throw new Error(
    "Required AUTH0_DOMAIN, AUTH0_AUDIENCE, and OPENWEATHER_API_KEY environment variables are missing.",
  );
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid integer between 1 and 65535.");
}

try {
  new URL(clientOrigin);
} catch {
  throw new Error("CLIENT_ORIGIN must be a valid URL.");
}

/* =========================================================
   AUTH0 JWT VALIDATION
========================================================= */

const checkJwt = auth({
  audience: auth0Audience,
  issuerBaseURL: `https://${auth0Domain}`,
  tokenSigningAlg: "RS256",
});

/* =========================================================
   EXPRESS APPLICATION
========================================================= */

const app = express();

app.use(
  cors({
    origin: clientOrigin,
    methods: ["GET"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

/* =========================================================
   PUBLIC ROUTES
========================================================= */

/**
 * Health check endpoint.
 * This route intentionally remains public.
 */
app.get("/api/health", (_req, res) => {
  return res.json({
    status: "ok",
    message: "ComfortCast API is running",
  });
});

/* =========================================================
   PROTECTED WEATHER ANALYTICS
========================================================= */

/**
 * Retrieves weather data for all configured cities,
 * calculates the Comfort Index on the backend,
 * sorts the cities by comfort score,
 * and assigns ranking positions.
 */
app.get("/api/weather/analytics", checkJwt, async (_req, res) => {
  try {
    if (analyticsCache && analyticsCache.expiresAt > Date.now()) {
      return res.json(analyticsCache.data);
    }

    const cityCodes = getCityCodes();

    const weatherData = await Promise.all(
      cityCodes.map((cityId) => getWeatherByCityId(cityId)),
    );

    const analytics = weatherData.map((weather) => {
      const comfortScore = calculateComfortIndex(
        weather.main.temp,
        weather.main.humidity,
        weather.wind.speed,
      );

      return {
        cityId: weather.id,
        cityName: weather.name,
        description: weather.weather[0]?.description ?? "Unknown",

        temperature: weather.main.temp,
        humidity: weather.main.humidity,
        pressure: weather.main.pressure,
        windSpeed: weather.wind.speed,
        cloudiness: weather.clouds.all,
        visibility: weather.visibility,

        comfortScore,
      };
    });

    analytics.sort((a, b) => b.comfortScore - a.comfortScore);

    const rankedCities = analytics.map((city, index) => ({
      ...city,
      rank: index + 1,
    }));

    const response = {
      count: rankedCities.length,
      cities: rankedCities,
    };

    analyticsCache = {
      data: response,
      expiresAt: Date.now() + ANALYTICS_CACHE_TTL,
    };

    return res.json(response);
  } catch (error) {
    console.error("Failed to generate weather analytics:", error);

    return res.status(500).json({
      message: "Failed to generate weather analytics",
    });
  }
});

/* =========================================================
   PROTECTED CACHE DEBUG ENDPOINT
========================================================= */

/**
 * Displays cache HIT/MISS and TTL information.
 */
app.get("/api/cache/status", checkJwt, (_req, res) => {
  return res.json(getCacheStatus());
});

app.get("/api/weather/trend/:cityId", checkJwt, async (req, res) => {
  try {
    const cityId = Number(req.params.cityId);

    if (!Number.isInteger(cityId) || cityId <= 0) {
      return res.status(400).json({
        message: "Invalid city ID.",
      });
    }

    const allowedCities = getCityCodes();

    if (!allowedCities.includes(cityId)) {
      return res.status(400).json({
        message: "City is not configured in this application.",
      });
    }

    const trend = await getTemperatureTrend(cityId);

    return res.json(trend);
  } catch (error) {
    console.error("Failed to load temperature trend:", error);

    return res.status(502).json({
      message: "Unable to retrieve temperature trend.",
    });
  }
});

/* =========================================================
   404 HANDLER
========================================================= */

app.use((_req, res) => {
  return res.status(404).json({
    status: 404,
    message: "Route not found",
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const error = err as {
    status?: number;
    statusCode?: number;
    message?: string;
  };

  const requestedStatus = error.statusCode ?? error.status;
  const statusCode = [400, 401, 404, 502].includes(requestedStatus ?? 0)
    ? requestedStatus!
    : 500;

  if (statusCode === 401) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
    });
  }

  console.error("Server error:", err);

  return res.status(statusCode).json({
    status: statusCode,
    message: "Internal server error",
  });
});

/* =========================================================
   START SERVER
========================================================= */

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
