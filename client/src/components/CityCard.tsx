import type { WeatherCity } from "../types/weather";

interface CityCardProps {
  city: WeatherCity;
}

function CityCard({ city }: CityCardProps) {
  const comfortLabel =
    city.comfortScore >= 80
      ? "High comfort"
      : city.comfortScore >= 60
        ? "Good comfort"
        : city.comfortScore >= 40
          ? "Moderate comfort"
          : "Low comfort";

  return (
    <article className="city-card">
      <div className="city-card-header">
        <div>
          <span className="rank-badge">#{city.rank}</span>

          <h2>{city.cityName}</h2>

          <p className="weather-description">{city.description}</p>
        </div>

        <div className="comfort-score">
          <strong>{city.comfortScore}</strong>
          <span>/100</span>
          <small>{comfortLabel}</small>
        </div>
      </div>

      <div className="weather-details">
        <div className="weather-detail">
          <span>Temperature</span>
          <strong>{city.temperature.toFixed(1)}°C</strong>
        </div>

        <div className="weather-detail">
          <span>Humidity</span>
          <strong>{city.humidity}%</strong>
        </div>

        <div className="weather-detail">
          <span>Wind</span>
          <strong>{city.windSpeed.toFixed(1)} m/s</strong>
        </div>

        <div className="weather-detail">
          <span>Pressure</span>
          <strong>{city.pressure} hPa</strong>
        </div>
      </div>
    </article>
  );
}

export default CityCard;
