export interface OpenWeatherResponse {
  id: number;
  name: string;

  weather: {
    main: string;
    description: string;
  }[];

  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };

  wind: {
    speed: number;
  };

  clouds: {
    all: number;
  };

  visibility: number;
}
export interface WeatherAnalytics {
  cityId: number;
  cityName: string;
  description: string;

  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  cloudiness: number;
  visibility: number;

  comfortScore: number;
  rank: number;
}