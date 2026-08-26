import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import type { CitiesFile } from "../types/city.types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getCityCodes = (): number[] => {
  const filePath = path.join(__dirname, "../data/cities.json");

  const fileContent = fs.readFileSync(filePath, "utf-8");

  const citiesData: CitiesFile = JSON.parse(fileContent);

  return citiesData.List.map((city) => Number(city.CityCode));
};