"use client";

import { Separator } from "@/components/ui/separator";
import type { GuideSection } from "@/types/guide";
import { useLanguage } from "@/hooks/useLanguage";
import { StepBadge } from "./StepBadge";
import { SectionTierPanel } from "./SectionTierPanel";
import { SubsectionBlock } from "./ContentNodes";
import type { SectionTier } from "@/types/guide";

export function GuideSections({ sections }: { sections: GuideSection[] }) {
  const { lang, t } = useLanguage();

  return (
    <div>
      {sections.map((section) => {
        const tier: SectionTier = section.tier ?? "recommended";
        return (
          <article
            key={section.id}
            id={section.id}
            className="scroll-mt-32 border-b border-border py-16"
          >
            <div className="flex flex-wrap items-baseline gap-3 gap-y-2">
              <span className="font-mono text-4xl text-muted-foreground/70">
                {section.index}
              </span>
              <h2 className="min-w-0 flex-1 text-2xl font-bold text-foreground wrap-break-word">
                {lang === "bn" ? section.titleBn : section.titleEn}
              </h2>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StepBadge scope={section.scope} />
            </div>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
              {lang === "bn" ? section.descriptionBn : section.descriptionEn}
            </p>
            <SectionTierPanel tier={tier} />
            <aside className="mt-6 max-w-3xl rounded-lg border border-border bg-card px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t.sections.purpose}
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-card-foreground">
                {lang === "bn" ? section.whyBn : section.whyEn}
              </p>
            </aside>
            <div className="mt-10">
              {section.subsections.map((sub) => (
                <SubsectionBlock
                  key={sub.id}
                  subsection={sub}
                  lang={lang}
                />
              ))}
            </div>
            <Separator className="mt-8 bg-border" />
          </article>
        );
      })}
    </div>
  );
}
