import axios from "axios";

import type { OpenWeatherResponse } from "../types/weather.types.js";

const OPENWEATHER_URL =
  "https://api.openweathermap.org/data/2.5/weather";

export const getWeatherByCityId = async (
  cityId: number
): Promise<OpenWeatherResponse> => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("OpenWeather API key is missing");
  }

  const response = await axios.get<OpenWeatherResponse>(
    OPENWEATHER_URL,
    {
      params: {
        id: cityId,
        appid: apiKey,
        units: "metric",
      },
    }
  );

  return response.data;
};