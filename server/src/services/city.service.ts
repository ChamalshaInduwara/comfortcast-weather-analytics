import fs from "fs";
import path from "path";

import type { CitiesFile } from "../types/city.types.js";

const filePath = path.join(process.cwd(), "src", "data", "cities.json");

const fileContent = fs.readFileSync(filePath, "utf-8");

const citiesData: CitiesFile = JSON.parse(fileContent);

if (!Array.isArray(citiesData.List)) {
  throw new Error("The cities file must contain a List array.");
}

const cityCodes = [
  ...new Set(
    citiesData.List.map((city) => Number(city.CityCode)).filter(
      (cityId) => Number.isInteger(cityId) && cityId > 0,
    ),
  ),
];

if (cityCodes.length < 10) {
  throw new Error("At least 10 valid city codes are required.");
}

export const getCityCodes = (): number[] => [...cityCodes];
