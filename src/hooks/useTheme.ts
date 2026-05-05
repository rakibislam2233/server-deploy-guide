"use client";

import { useGuidePreferences } from "@/contexts/guide-preferences";

export function useTheme() {
  const { theme, setTheme, toggleTheme, mounted } = useGuidePreferences();
  return { theme, setTheme, toggleTheme, mounted };
}
