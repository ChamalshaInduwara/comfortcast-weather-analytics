import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { getWeatherByCityId } from "./services/weather.service.js";
import { getCityCodes } from "./services/city.service.js";
import { calculateComfortIndex } from "./services/comfort.service.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  return res.json({
    status: "ok",
    message: "Fidenz Weather Analytics API is running",
  });
});

app.get("/api/cities", (req, res) => {
  try {
    const cityCodes = getCityCodes();

    return res.json({
      count: cityCodes.length,
      cityCodes,
    });
  } catch (error) {
    console.error("Failed to read cities:", error);

    return res.status(500).json({
      message: "Failed to read cities.json",
    });
  }
});

app.get("/api/weather/test", async (req, res) => {
  try {
    const cityId = 2172797;

    const weather = await getWeatherByCityId(cityId);

    return res.json(weather);
  } catch (error) {
    console.error("Weather API error:", error);

    return res.status(500).json({
      message: "Failed to fetch weather data",
    });
  }
});

app.get("/api/weather/all", async (req, res) => {
  try {
    const cityCodes = getCityCodes();

    const weatherData = await Promise.all(
      cityCodes.map((cityId) => getWeatherByCityId(cityId)),
    );

    return res.json({
      count: weatherData.length,
      cities: weatherData,
    });
  } catch (error) {
    console.error("Failed to fetch weather data:", error);

    return res.status(500).json({
      message: "Failed to fetch weather data for cities",
    });
  }
});

app.get("/api/weather/analytics", async (req, res) => {
  try {
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

    return res.json({
      count: rankedCities.length,
      cities: rankedCities,
    });
  } catch (error) {
    console.error("Failed to generate weather analytics:", error);

    return res.status(500).json({
      message: "Failed to generate weather analytics",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
