import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import CityCard from "../components/CityCard";
import { getWeatherAnalytics } from "../services/weatherApi";
import { useTheme } from "../hooks/useTheme";

import type { WeatherCity } from "../types/weather";

const TemperatureTrendSection = lazy(
  () => import("../components/TemperatureTrendSection"),
);

const SORT_OPTIONS = [
  { value: "rank", label: "Comfort ranking" },
  { value: "temperature-high", label: "Temperature: High to Low" },
  { value: "temperature-low", label: "Temperature: Low to High" },
  { value: "name", label: "City name: A–Z" },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]["value"];

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = SORT_OPTIONS.find((option) => option.value === value);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const selectedIndex = SORT_OPTIONS.findIndex(
      (option) => option.value === value,
    );

    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex =
        (selectedIndex + direction + SORT_OPTIONS.length) % SORT_OPTIONS.length;

      onChange(SORT_OPTIONS[nextIndex].value);
      setIsOpen(true);
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();

      const nextIndex = event.key === "Home" ? 0 : SORT_OPTIONS.length - 1;

      onChange(SORT_OPTIONS[nextIndex].value);
      setIsOpen(true);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((open) => !open);
    }
  };

  return (
    <div ref={dropdownRef} className="sort-dropdown">
      <button
        type="button"
        id="city-sort"
        className="sort-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={handleKeyDown}
      >
        <span>{selectedOption?.label}</span>
        <span className="sort-dropdown-chevron" aria-hidden="true">
          ▾
        </span>
      </button>

      {isOpen && (
        <div className="sort-dropdown-menu" role="listbox" aria-label="Sort by">
          {SORT_OPTIONS.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={option.value === value}
              className="sort-dropdown-option"
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardPage() {
  const [cities, setCities] = useState<WeatherCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("rank");
  const { getAccessTokenSilently, logout, user } = useAuth0();
  const { darkMode, toggleTheme } = useTheme();

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

  const displayedCities = useMemo(() => {
    const filteredCities = cities.filter((city) =>
      city.cityName.toLowerCase().includes(searchTerm.trim().toLowerCase()),
    );

    return [...filteredCities].sort((a, b) => {
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
  }, [cities, searchTerm, sortBy]);

  const dashboardSummary = useMemo(() => {
    const topCity = cities.find((city) => city.rank === 1);
    const averageTemperature = cities.length
      ? cities.reduce((total, city) => total + city.temperature, 0) /
        cities.length
      : 0;

    return {
      topCity,
      averageTemperature,
    };
  }, [cities]);

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
              onClick={toggleTheme}
              aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
              aria-pressed={darkMode}
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

      <section className="summary-grid" aria-label="Weather summary">
        <div className="summary-card">
          <span className="summary-label">Cities analysed</span>
          <strong>{cities.length}</strong>
          <span className="summary-note">Live locations</span>
        </div>

        <div className="summary-card summary-card-highlight">
          <span className="summary-label">Most comfortable</span>
          <strong>{dashboardSummary.topCity?.cityName ?? "-"}</strong>
          <span className="summary-note">
            {dashboardSummary.topCity
              ? `Rank #${dashboardSummary.topCity.rank}`
              : "Awaiting data"}
          </span>
        </div>

        <div className="summary-card">
          <span className="summary-label">Top comfort score</span>
          <strong>
            {dashboardSummary.topCity?.comfortScore ?? "-"}
            {dashboardSummary.topCity && <small>/100</small>}
          </strong>
          <span className="summary-note">Backend calculated</span>
        </div>

        <div className="summary-card">
          <span className="summary-label">Average temperature</span>
          <strong>{dashboardSummary.averageTemperature.toFixed(1)}°C</strong>
          <span className="summary-note">Across loaded cities</span>
        </div>
      </section>

      <Suspense
        fallback={<div className="trend-state">Loading forecast...</div>}
      >
        <TemperatureTrendSection cities={cities} />
      </Suspense>

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
            type="search"
            placeholder="Search city..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="control-group">
          <label htmlFor="city-sort">Sort by</label>

          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {cities.length === 0 ? (
        <div className="page-message">
          <p>No weather data available.</p>
        </div>
      ) : displayedCities.length === 0 ? (
        <div className="no-results">
          <h3>No cities found</h3>
          <p>Try searching with a different city name.</p>
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
