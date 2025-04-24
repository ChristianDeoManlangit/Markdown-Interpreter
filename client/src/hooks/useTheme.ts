import { useEffect } from "react";
import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme();

  // Set initial theme based on user preference or system theme
  useEffect(() => {
    // If no theme is set, use system theme or default to light
    if (!theme || theme === "system") {
      setTheme(systemTheme || "light");
    }
  }, [theme, systemTheme, setTheme]);

  return { theme, setTheme };
}
