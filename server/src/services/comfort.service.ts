const clamp = (value: number): number => {
  return Math.max(0, Math.min(100, value));
};

const calculateTemperatureScore = (
  temperature: number
): number => {
  const idealTemperature = 22;

  return clamp(
    100 - Math.abs(temperature - idealTemperature) * 6
  );
};

const calculateHumidityScore = (
  humidity: number
): number => {
  const idealHumidity = 50;

  return clamp(
    100 - Math.abs(humidity - idealHumidity) * 2
  );
};

const calculateWindScore = (
  windSpeed: number
): number => {
  const idealWindSpeed = 2;

  return clamp(
    100 - Math.abs(windSpeed - idealWindSpeed) * 15
  );
};

export const calculateComfortIndex = (
  temperature: number,
  humidity: number,
  windSpeed: number
): number => {
  const temperatureScore =
    calculateTemperatureScore(temperature);

  const humidityScore =
    calculateHumidityScore(humidity);

  const windScore =
    calculateWindScore(windSpeed);

  const comfortScore =
    temperatureScore * 0.5 +
    humidityScore * 0.3 +
    windScore * 0.2;

  return Math.round(clamp(comfortScore));
};