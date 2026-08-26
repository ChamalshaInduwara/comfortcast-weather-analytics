import { useEffect, useState } from "react";

import {
  getWeatherAnalytics,
} from "../services/weatherApi";

import type {
  WeatherCity,
} from "../types/weather";

function DashboardPage() {
  const [cities, setCities] = useState<WeatherCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);

        const data = await getWeatherAnalytics();

        setCities(data.cities);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load weather analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  if (loading) {
    return <p>Loading weather analytics...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <h1>ComfortCast</h1>

      <p>Weather Comfort Analytics</p>

      <p>Total cities: {cities.length}</p>

      {cities.map((city) => (
        <div key={city.cityId}>
          <h2>
            #{city.rank} {city.cityName}
          </h2>

          <p>
            {city.description}
          </p>

          <p>
            Temperature: {city.temperature}°C
          </p>

          <p>
            Comfort Score: {city.comfortScore}/100
          </p>

          <hr />
        </div>
      ))}
    </main>
  );
}

export default DashboardPage;