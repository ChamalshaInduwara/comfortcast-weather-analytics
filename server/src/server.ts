import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

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
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        message: "OpenWeather API key is missing",
      });
    }

    const cityId = 2172797;

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          id: cityId,
          appid: apiKey,
          units: "metric",
        },
      },
    );

    return res.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("OpenWeather API request failed");
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);

      return res.status(error.response?.status || 500).json({
        message: "Failed to fetch weather data",
        status: error.response?.status,
        details: error.response?.data,
      });
    }

    console.error("Unexpected server error:", error);

    return res.status(500).json({
      message: "Unexpected server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
