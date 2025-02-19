"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme as "light" | "dark");
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-circle btn-ghost swap swap-rotate"
    >
      {/* Sun icon */}
      <Sun className={`w-5 h-5 ${theme === "dark" ? "swap-on" : "swap-off"}`} />
      {/* Moon icon */}
      <Moon
        className={`w-5 h-5 ${theme === "light" ? "swap-on" : "swap-off"}`}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
