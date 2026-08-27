import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import CityCard from "../components/CityCard";
import { getWeatherAnalytics } from "../services/weatherApi";

import type { WeatherCity } from "../types/weather";

function DashboardPage() {
  const [cities, setCities] = useState<WeatherCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { getAccessTokenSilently, logout, user } = useAuth0();

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);
        setError("");

        // Get Auth0 access token
        const accessToken = await getAccessTokenSilently();

        // Send token to protected backend API
        const data = await getWeatherAnalytics(accessToken);

        setCities(data.cities);
      } catch (err) {
        console.error("Failed to load weather analytics:", err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, [getAccessTokenSilently]);

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

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
        <div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Weather Analytics</p>

          <h1>ComfortCast</h1>

          <p className="dashboard-subtitle">
            Compare current weather conditions and discover the most comfortable
            cities.
          </p>
        </div>

        <div className="dashboard-user-section">
          <div className="city-count">
            <strong>{cities.length}</strong>
            <span>Cities analysed</span>
          </div>

          <div className="dashboard-actions">
            {user?.email && <span className="user-email">{user.email}</span>}

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <section className="ranking-heading">
        <div>
          <h2>Comfort Ranking</h2>

          <p>Ranked from most comfortable to least comfortable.</p>
        </div>
      </section>

      {cities.length === 0 ? (
        <div className="page-message">
          <p>No weather data available.</p>
        </div>
      ) : (
        <section className="city-grid">
          {cities.map((city) => (
            <CityCard key={city.cityId} city={city} />
          ))}
        </section>
      )}
    </main>
  );
}

export default DashboardPage;
