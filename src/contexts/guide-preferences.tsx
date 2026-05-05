"use client";

import * as React from "react";
import type { DeployPath, Language } from "@/types/guide";

export type GuideTheme = "light" | "dark";

type GuidePreferences = {
  path: DeployPath;
  setPath: (p: DeployPath) => void;
  lang: Language;
  setLang: (l: Language) => void;
  theme: GuideTheme;
  setTheme: (t: GuideTheme) => void;
  toggleTheme: () => void;
  mounted: boolean;
};

const GuidePreferencesContext = React.createContext<GuidePreferences | null>(
  null,
);

const LANG_EVENT = "guide-pref-lang";
const PATH_EVENT = "guide-pref-path";

function subscribeLang(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const go = () => onStoreChange();
  window.addEventListener("storage", go);
  window.addEventListener(LANG_EVENT, go);
  return () => {
    window.removeEventListener("storage", go);
    window.removeEventListener(LANG_EVENT, go);
  };
}

function readLangFromStorage(): Language {
  if (typeof window === "undefined") return "bn";
  try {
    const s = window.localStorage.getItem("lang");
    if (s === "en" || s === "bn") return s;
  } catch {
    /* ignore */
  }
  return "bn";
}

function subscribePath(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const go = () => onStoreChange();
  window.addEventListener("storage", go);
  window.addEventListener(PATH_EVENT, go);
  return () => {
    window.removeEventListener("storage", go);
    window.removeEventListener(PATH_EVENT, go);
  };
}

function readPathFromStorage(): DeployPath {
  if (typeof window === "undefined") return "manual";
  try {
    const s = window.localStorage.getItem("deployPath");
    if (s === "docker" || s === "manual") return s;
  } catch {
    /* ignore */
  }
  return "manual";
}

export function GuidePreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = React.useSyncExternalStore(
    subscribeLang,
    readLangFromStorage,
    (): Language => "bn",
  );

  const path = React.useSyncExternalStore(
    subscribePath,
    readPathFromStorage,
    (): DeployPath => "manual",
  );

  const [theme, setThemeState] = React.useState<GuideTheme>("dark");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    try {
      const storedTheme = window.localStorage.getItem("guideTheme");
      if (storedTheme === "light" || storedTheme === "dark") {
        setThemeState(storedTheme);
      }
    } catch {
      /* ignore */
    }
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem("guideTheme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme, mounted]);

  const setLang = React.useCallback((l: Language) => {
    try {
      window.localStorage.setItem("lang", l);
      document.documentElement.setAttribute("lang", l === "bn" ? "bn" : "en");
      window.dispatchEvent(new Event(LANG_EVENT));
    } catch {
      /* ignore */
    }
  }, []);

  const setPath = React.useCallback((p: DeployPath) => {
    try {
      window.localStorage.setItem("deployPath", p);
      document.documentElement.setAttribute("data-deploy-path", p);
      window.dispatchEvent(new Event(PATH_EVENT));
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = React.useCallback((t: GuideTheme) => {
    setThemeState(t);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = React.useMemo(
    () => ({
      path,
      setPath,
      lang,
      setLang,
      theme,
      setTheme,
      toggleTheme,
      mounted,
    }),
    [path, setPath, lang, setLang, theme, setTheme, toggleTheme, mounted],
  );

  return (
    <GuidePreferencesContext.Provider value={value}>
      {children}
    </GuidePreferencesContext.Provider>
  );
}

export function useGuidePreferences() {
  const ctx = React.useContext(GuidePreferencesContext);
  if (!ctx) {
    throw new Error(
      "useGuidePreferences must be used within GuidePreferencesProvider",
    );
  }
  return ctx;
}
