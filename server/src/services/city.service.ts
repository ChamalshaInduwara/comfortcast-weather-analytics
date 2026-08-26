import fs from "fs";
import path from "path";

import type { CitiesFile } from "../types/city.types.js";

export const getCityCodes = (): number[] => {
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "cities.json"
  );

  console.log("Reading cities from:", filePath);

  const fileContent = fs.readFileSync(filePath, "utf-8");

  const citiesData: CitiesFile = JSON.parse(fileContent);

  return citiesData.List.map((city) => Number(city.CityCode));
};