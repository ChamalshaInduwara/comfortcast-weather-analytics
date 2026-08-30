import type { TemperatureTrendResponse } from "../types/forecast";

export async function fetchTemperatureTrend(
  cityId: number,
  accessToken: string,
): Promise<TemperatureTrendResponse> {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error("VITE_API_URL is not configured.");
  }

  const response = await fetch(`${apiUrl}/api/weather/trend/${cityId}`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");

    console.error(
      `Forecast request failed: status=${response.status}${message ? `, body=${message}` : ""}`,
    );

    throw new Error(`Forecast request failed: ${response.status}`);
  }

  return response.json();
}
