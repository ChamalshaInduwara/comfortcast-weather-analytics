import { useEffect, useState } from "react";

import CityCard from "../components/CityCard";
import { getWeatherAnalytics } from "../services/weatherApi";

import type { WeatherCity } from "../types/weather";

function DashboardPage() {
  const [cities, setCities] = useState<WeatherCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getWeatherAnalytics();

        setCities(data.cities);
      } catch (err) {
        console.error(err);

        setError("Unable to load weather analytics.");
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  if (loading) {
    return (
      <div className="page-message">
        <p>Loading weather analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-message error-message">
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">
            Weather Analytics
          </p>

          <h1>ComfortCast</h1>

          <p className="dashboard-subtitle">
            Compare current weather conditions and discover
            the most comfortable cities.
          </p>
        </div>

        <div className="city-count">
          <strong>{cities.length}</strong>
          <span>Cities analysed</span>
        </div>
      </header>

      <section className="ranking-heading">
        <div>
          <h2>Comfort Ranking</h2>
          <p>
            Ranked from most comfortable to least comfortable.
          </p>
        </div>
      </section>

      <section className="city-grid">
        {cities.map((city) => (
          <CityCard
            key={city.cityId}
            city={city}
          />
        ))}
      </section>
    </main>
  );
}

export default DashboardPage;