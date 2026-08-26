import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getWeatherByCityId } from "./services/weather.service.js";
import { getCityCodes } from "./services/city.service.js";

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});