"use client";

import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import type { GuideSection } from "@/types/guide";
import { useLanguage } from "@/hooks/useLanguage";
import { PathSelector } from "@/components/guide/PathSelector";
import { SectionTierIcon } from "@/components/guide/SectionTierPanel";
import { cn } from "@/lib/utils";
import type { SectionTier } from "@/types/guide";

export function MobileNav({ sections }: { sections: GuideSection[] }) {
  const [open, setOpen] = React.useState(false);
  const { lang, t } = useLanguage();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "border-border bg-background text-foreground hover:bg-muted sm:hidden",
        )}
        aria-label={t.nav.openMenu}
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[85vh] border-t border-border bg-background p-0"
      >
        <SheetHeader className="border-b border-border px-4 py-3 text-left">
          <SheetTitle className="font-mono text-base text-foreground">
            {t.nav.sections}
          </SheetTitle>
        </SheetHeader>
        <div className="flex h-[calc(85vh-3.5rem)] flex-col">
          <div className="border-b border-border p-4">
            <PathSelector />
          </div>
          <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2">
            <ul className="space-y-1">
              {sections.map((s) => {
                const title = lang === "bn" ? s.titleBn : s.titleEn;
                const tier: SectionTier = s.tier ?? "recommended";
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={() => setOpen(false)}
                      className="flex min-w-0 cursor-pointer items-start gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <span className="shrink-0 font-mono text-xl text-muted-foreground">
                        {s.index}
                      </span>
                      <span className="min-w-0 flex-1 break-words font-medium">
                        {title}
                      </span>
                      <SectionTierIcon tier={tier} className="mt-0.5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
