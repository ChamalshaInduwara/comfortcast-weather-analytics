export interface TemperatureTrendPoint {
  time: string;
  temperature: number;
}

export interface TemperatureTrendResponse {
  cityId: number;
  cityName: string;
  points: TemperatureTrendPoint[];
}
