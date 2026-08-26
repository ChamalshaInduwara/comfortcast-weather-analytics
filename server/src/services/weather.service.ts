import axios from "axios";

const OPENWEATHER_URL =
  "https://api.openweathermap.org/data/2.5/weather";

export const getWeatherByCityId = async (cityId: number) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("OpenWeather API key is missing");
  }

  const response = await axios.get(OPENWEATHER_URL, {
    params: {
      id: cityId,
      appid: apiKey,
      units: "metric",
    },
  });

  return response.data;
};