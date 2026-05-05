"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { MobileNav } from "./MobileNav";
import type { GuideSection } from "@/types/guide";
import { cn } from "@/lib/utils";

export function Header({ sections }: { sections: GuideSection[] }) {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4">
        <div className="min-w-0 flex-1">
          <span className="block truncate font-mono text-sm font-bold text-foreground md:text-base">
            {t.meta.title}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="border-border bg-muted/40 text-foreground hover:bg-muted"
            aria-label={t.theme.toggleAria}
            title={t.theme.toggleAria}
            onClick={() => toggleTheme()}
          >
            {theme === "dark" ? (
              <Sun className="size-4" aria-hidden />
            ) : (
              <Moon className="size-4" aria-hidden />
            )}
          </Button>
          <div
            className="flex items-center rounded-md border border-border bg-muted/30 p-0.5"
            role="group"
            aria-label="Language"
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-2.5 font-bengali text-xs text-muted-foreground hover:bg-muted sm:px-3",
                lang === "bn" &&
                  "border border-border bg-accent text-foreground",
              )}
              onClick={() => setLang("bn")}
            >
              {t.langSwitch.bn}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-2.5 font-mono text-xs text-muted-foreground hover:bg-muted sm:px-3",
                lang === "en" &&
                  "border border-border bg-accent text-foreground",
              )}
              onClick={() => setLang("en")}
            >
              {t.langSwitch.en}
            </Button>
          </div>
          <MobileNav sections={sections} />
        </div>
      </div>
    </header>
  );
}
