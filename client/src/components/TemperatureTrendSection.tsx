import { useEffect, useState } from "react";

import { useAuth0 } from "@auth0/auth0-react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { fetchTemperatureTrend } from "../services/forecastApi";

import type { TemperatureTrendResponse } from "../types/forecast";

interface CityOption {
  cityId: number;
  cityName: string;
}

interface TemperatureTrendSectionProps {
  cities: CityOption[];
}

function TemperatureTrendSection({ cities }: TemperatureTrendSectionProps) {
  const { getAccessTokenSilently } = useAuth0();

  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

  const [trend, setTrend] = useState<TemperatureTrendResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /*
   * Automatically select the first city
   * after dashboard data becomes available.
   */
  useEffect(() => {
    if (cities.length > 0 && selectedCityId === null) {
      setSelectedCityId(cities[0].cityId);
    }
  }, [cities, selectedCityId]);

  /*
   * Fetch only the selected city's forecast.
   *
   * A graph error is handled inside this
   * component and does NOT break the dashboard.
   */
  useEffect(() => {
    if (selectedCityId === null) {
      return;
    }

    let cancelled = false;

    const loadTrend = async () => {
      try {
        setLoading(true);
        setError(null);

        const accessToken = await getAccessTokenSilently();

        const result = await fetchTemperatureTrend(selectedCityId, accessToken);

        if (!cancelled) {
          setTrend(result);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown forecast error";

        console.error(
          `Temperature trend error for city ${selectedCityId}: ${message}`,
        );

        if (!cancelled) {
          setTrend(null);

          setError("Temperature trend is temporarily unavailable.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadTrend();

    return () => {
      cancelled = true;
    };
  }, [selectedCityId, getAccessTokenSilently]);

  if (cities.length === 0) {
    return null;
  }

  return (
    <section className="trend-card">
      <div className="trend-header">
        <div>
          <p className="eyebrow">Weather Forecast</p>

          <h2>24-Hour Temperature Trend</h2>

          <p>View the expected temperature changes for each city.</p>
        </div>

        <div className="trend-selector">
          <label htmlFor="trend-city">City</label>

          <select
            id="trend-city"
            value={selectedCityId ?? ""}
            onChange={(event) => setSelectedCityId(Number(event.target.value))}
          >
            {cities.map((city) => (
              <option key={city.cityId} value={city.cityId}>
                {city.cityName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="trend-state">Loading temperature trend...</div>
      )}

      {!loading && error && <div className="trend-error">{error}</div>}

      {!loading && !error && trend && trend.points.length > 0 && (
        <>
          <div className="trend-city-name">{trend.cityName}</div>

          <div className="trend-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trend.points}
                margin={{
                  top: 10,
                  right: 15,
                  bottom: 10,
                  left: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

                <XAxis
                  dataKey="time"
                  tick={{
                    fontSize: 11,
                  }}
                  minTickGap={15}
                />

                <YAxis
                  unit="°C"
                  width={50}
                  tick={{
                    fontSize: 11,
                  }}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature"
                  unit=" °C"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  );
}

export default TemperatureTrendSection;
