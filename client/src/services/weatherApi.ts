import type {
  WeatherAnalyticsResponse,
} from "../types/weather";

const API_URL = import.meta.env.VITE_API_URL;

export const getWeatherAnalytics = async (
  accessToken: string
): Promise<WeatherAnalyticsResponse> => {
  const response = await fetch(
    `${API_URL}/api/weather/analytics`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch weather analytics: ${response.status}`
    );
  }

  return response.json();
};