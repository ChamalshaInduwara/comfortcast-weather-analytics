import type {
  WeatherAnalyticsResponse,
} from "../types/weather";

const API_URL = import.meta.env.VITE_API_URL;

export const getWeatherAnalytics =
  async (): Promise<WeatherAnalyticsResponse> => {
    const response = await fetch(
      `${API_URL}/api/weather/analytics`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch weather analytics"
      );
    }

    return response.json();
  };