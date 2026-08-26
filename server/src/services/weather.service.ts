import axios from "axios";

import type { OpenWeatherResponse } from "../types/weather.types.js";
import {
  getFromCache,
  setCache,
} from "./cache.service.js";

const OPENWEATHER_URL =
  "https://api.openweathermap.org/data/2.5/weather";

export const getWeatherByCityId = async (
  cityId: number
): Promise<OpenWeatherResponse> => {

  // 1. Check cache first
  const cachedWeather =
    getFromCache<OpenWeatherResponse>(cityId);

  if (cachedWeather) {
    console.log(`Cache HIT for city ${cityId}`);

    return cachedWeather;
  }

  console.log(`Cache MISS for city ${cityId}`);

  // 2. Get API key
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OpenWeather API key is missing"
    );
  }

  // 3. Fetch fresh data from OpenWeather
  const response =
    await axios.get<OpenWeatherResponse>(
      OPENWEATHER_URL,
      {
        params: {
          id: cityId,
          appid: apiKey,
          units: "metric",
        },
      }
    );

  // 4. Store RAW OpenWeather response
  setCache(cityId, response.data);

  return response.data;
};