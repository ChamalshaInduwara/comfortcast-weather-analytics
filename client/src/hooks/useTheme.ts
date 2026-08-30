import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "comfortcast-theme";

export function useTheme() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem(THEME_STORAGE_KEY) === "dark",
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem(THEME_STORAGE_KEY, darkMode ? "dark" : "light");

    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((current) => !current);
  };

  return { darkMode, toggleTheme };
}
