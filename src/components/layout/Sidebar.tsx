"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { GuideSection } from "@/types/guide";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { SectionTierIcon } from "@/components/guide/SectionTierPanel";
import type { SectionTier } from "@/types/guide";

export function Sidebar({
  sections,
  activeId,
  completed,
}: {
  sections: GuideSection[];
  activeId: string;
  completed: Record<string, boolean>;
}) {
  const { lang, t } = useLanguage();

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-80 max-w-full shrink-0  border-r border-border bg-sidebar lg:block">
      <ScrollArea className="h-full w-full">
        <nav
          className="min-w-0 max-w-full p-4 pr-3"
          aria-label={t.nav.sections}
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {t.nav.sections}
          </p>
          <ul className="min-w-0 space-y-1">
            {sections.map((s) => {
              const id = s.id;
              const title = lang === "bn" ? s.titleBn : s.titleEn;
              const isActive = activeId === id;
              const done = completed[id];
              const tier: SectionTier = s.tier ?? "recommended";
              return (
                <li key={id} className="min-w-0">
                  <a
                    href={`#${id}`}
                    className={cn(
                      "flex min-w-0 max-w-full cursor-pointer items-start gap-1.5 overflow-hidden rounded-md border-l-4 border-transparent py-2 pl-2 pr-1 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
                      isActive && "border-ring bg-card",
                    )}
                  >
                    <span className="font-mono text-2xl leading-none text-muted-foreground">
                      {s.index}
                    </span>
                    <span className="min-w-0 flex-1 wrap-break-word pt-1 font-medium">
                      {title}
                    </span>
                    <SectionTierIcon tier={tier} className="mt-1" />
                    {done ? (
                      <Check
                        className="mt-1 size-4 shrink-0 text-muted-foreground"
                        aria-label="Seen"
                      />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
          <Separator className="my-4 bg-border" />
          <p className="text-xs text-muted-foreground">
            {t.sidebar.footerHint}
          </p>
        </nav>
      </ScrollArea>
    </aside>
  );
}
