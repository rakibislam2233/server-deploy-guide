"use client";

import { useGuidePreferences } from "@/contexts/guide-preferences";
export function usePath() {
  const { path, setPath, mounted } = useGuidePreferences();
  return { path, setPath, mounted };
}
