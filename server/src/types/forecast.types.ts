export interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number;

    main: {
      temp: number;
    };
  }>;

  city: {
    id: number;
    name: string;
    timezone: number;
  };
}

export interface TemperatureTrendPoint {
  time: string;
  temperature: number;
}

export interface TemperatureTrendResponse {
  cityId: number;
  cityName: string;
  points: TemperatureTrendPoint[];
}
