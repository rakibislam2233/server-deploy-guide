"use client";

import { useGuidePreferences } from "@/contexts/guide-preferences";
import type { Language } from "@/types/guide";
import { getMessages } from "@/lib/i18n";

export function useLanguage() {
  const { lang, setLang, mounted } = useGuidePreferences();
  const t = getMessages(lang);
  return { lang, setLang, t, mounted } satisfies {
    lang: Language;
    setLang: (l: Language) => void;
    t: ReturnType<typeof getMessages>;
    mounted: boolean;
  };
}
