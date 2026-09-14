"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const defaultTheme = process.env.NEXT_PUBLIC_DEFAULT_THEME || "system";
  const [theme, setTheme] = useState(defaultTheme);

  // Load theme from localStorage or system
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || defaultTheme;
    if (savedTheme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    } else {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme class to <html>
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      document.documentElement.classList.add(prefersDark ? "dark" : "light");
    } else {
      document.documentElement.classList.add(theme);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 3-way toggle: light → dark → system → light...
  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "system";
      return "light";
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
