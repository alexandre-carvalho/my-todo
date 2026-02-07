"use client";

import { useThemeStore } from "@/store/theme";
import { useEffect, useLayoutEffect, useState } from "react";

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, initTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Initialize theme synchronously on mount
  useIsomorphicLayoutEffect(() => {
    initTheme();
    setMounted(true);
  }, [initTheme]);

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const { theme, setTheme } = useThemeStore.getState();
      if (theme === "system") {
        setTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [resolvedTheme, mounted]);

  return <>{children}</>;
}
