"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeValue = "light" | "dark" | "system";

interface ThemeStore {
  theme: ThemeValue;
  resolvedTheme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: ThemeValue) => void;
  initTheme: () => void;
}

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "system",
      resolvedTheme: "light",
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.resolvedTheme === "light" ? "dark" : "light";
          return {
            theme: newTheme,
            resolvedTheme: newTheme,
          };
        }),
      setTheme: (theme) => {
        const resolved = theme === "system" ? getSystemTheme() : theme;
        set({ theme, resolvedTheme: resolved });
      },
      initTheme: () => {
        const { theme } = get();
        const resolved = theme === "system" ? getSystemTheme() : theme;
        set({ resolvedTheme: resolved });
      },
    }),
    {
      name: "theme-storage",
    },
  ),
);
