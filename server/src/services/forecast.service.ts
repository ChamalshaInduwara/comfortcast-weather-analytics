import axios from "axios";

import type {
  OpenWeatherForecastResponse,
  TemperatureTrendResponse,
} from "../types/forecast.types.js";

const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const FORECAST_TIMEOUT_MS = 10_000;

const FORECAST_CACHE_TTL = 5 * 60 * 1000;

interface ForecastCacheEntry {
  data: OpenWeatherForecastResponse;
  expiresAt: number;
}

const forecastCache = new Map<number, ForecastCacheEntry>();

async function getRawForecast(
  cityId: number,
): Promise<OpenWeatherForecastResponse> {
  const cached = forecastCache.get(cityId);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENWEATHER_API_KEY is not configured.");
  }

  try {
    const response = await axios.get<OpenWeatherForecastResponse>(
      FORECAST_URL,
      {
        params: {
          id: cityId,
          appid: apiKey,
          units: "metric",
        },
        timeout: FORECAST_TIMEOUT_MS,
      },
    );

    forecastCache.set(cityId, {
      data: response.data,
      expiresAt: Date.now() + FORECAST_CACHE_TTL,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const backendMessage =
        typeof error.response?.data === "string"
          ? error.response.data
          : (error.response?.data?.message ?? error.message);

      console.error(
        `OpenWeather forecast request failed for city ${cityId}: status=${status ?? "unknown"}, message=${backendMessage}`,
      );
    } else {
      console.error(`Unexpected forecast error for city ${cityId}:`, error);
    }

    throw error;
  }
}

export async function getTemperatureTrend(
  cityId: number,
): Promise<TemperatureTrendResponse> {
  const forecast = await getRawForecast(cityId);

  /*
   * OpenWeather's forecast API returns
   * weather in approximately 3-hour intervals.
   *
   * 8 points ≈ 24 hours.
   */
  const points = forecast.list.slice(0, 8).map((item) => {
    /*
     * OpenWeather provides the city's
     * timezone offset in seconds.
     */
    const cityLocalTime = new Date((item.dt + forecast.city.timezone) * 1000);

    const time = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(cityLocalTime);

    return {
      time,
      temperature: Math.round(item.main.temp * 10) / 10,
    };
  });

  if (points.length < 8) {
    throw new Error("OpenWeather returned fewer than 8 forecast points.");
  }

  return {
    cityId: forecast.city.id,
    cityName: forecast.city.name,
    points,
  };
}
