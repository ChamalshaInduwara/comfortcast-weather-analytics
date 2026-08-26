export interface WeatherCity {
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

export interface WeatherAnalyticsResponse {
  count: number;
  cities: WeatherCity[];
}