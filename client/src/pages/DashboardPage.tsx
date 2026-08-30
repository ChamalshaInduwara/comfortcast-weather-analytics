import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import CityCard from "../components/CityCard";
import TemperatureTrendSection from "../components/TemperatureTrendSection";
import { getWeatherAnalytics } from "../services/weatherApi";

import type { WeatherCity } from "../types/weather";

function DashboardPage() {
  const [cities, setCities] = useState<WeatherCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "rank" | "temperature-high" | "temperature-low" | "name"
  >("rank");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("comfortcast-theme") === "dark";
  });

  const { getAccessTokenSilently, logout, user } = useAuth0();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);

    localStorage.setItem("comfortcast-theme", darkMode ? "dark" : "light");

    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, [darkMode]);

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

  const displayedCities = [...cities]
    .filter((city) =>
      city.cityName.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "temperature-high":
          return b.temperature - a.temperature;

        case "temperature-low":
          return a.temperature - b.temperature;

        case "name":
          return a.cityName.localeCompare(b.cityName);

        case "rank":
        default:
          return a.rank - b.rank;
      }
    });

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
              className="theme-button"
              onClick={() => setDarkMode((current) => !current)}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

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

      <TemperatureTrendSection cities={cities} />

      <section className="ranking-heading">
        <div>
          <h2>Comfort Ranking</h2>

          <p>Ranked from most comfortable to least comfortable.</p>
        </div>
      </section>

      <div className="dashboard-controls">
        <div className="control-group">
          <label htmlFor="city-search">Filter cities</label>

          <input
            id="city-search"
            type="text"
            placeholder="Search by city..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="control-group">
          <label htmlFor="city-sort">Sort by</label>

          <select
            id="city-sort"
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target.value as
                  | "rank"
                  | "temperature-high"
                  | "temperature-low"
                  | "name",
              )
            }
          >
            <option value="rank">Comfort ranking</option>

            <option value="temperature-high">Temperature: High to Low</option>

            <option value="temperature-low">Temperature: Low to High</option>

            <option value="name">City name: A–Z</option>
          </select>
        </div>
      </div>

      {cities.length === 0 ? (
        <div className="page-message">
          <p>No weather data available.</p>
        </div>
      ) : (
        <section className="city-grid">
          {displayedCities.map((city) => (
            <CityCard key={city.cityId} city={city} />
          ))}
        </section>
      )}
    </main>
  );
}

export default DashboardPage;
