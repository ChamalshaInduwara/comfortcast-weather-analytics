import type { WeatherAnalyticsResponse } from "../types/weather";

const API_URL = import.meta.env.VITE_API_URL;

export const getWeatherAnalytics = async (
  accessToken: string,
): Promise<WeatherAnalyticsResponse> => {
  const response = await fetch(`${API_URL}/api/weather/analytics`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error(
      `Weather analytics request failed: status=${response.status}`,
    );

    throw new Error(
      "Weather analytics are temporarily unavailable. Please try again.",
    );
  }

  return response.json();
};
