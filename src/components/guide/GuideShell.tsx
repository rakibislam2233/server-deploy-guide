"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { PathSelector } from "@/components/guide/PathSelector";
import { GuideSections } from "@/components/guide/GuideSections";
import { getVisibleGuideSections } from "@/lib/visible-sections";
import { useProgress, useSectionObserver } from "@/hooks/useProgress";
import { useLanguage } from "@/hooks/useLanguage";
import { usePath } from "@/hooks/usePath";
import { GUIDE_SECTIONS } from "@/lib/content";

export function GuideShell() {
  const progress = useProgress();
  const { path } = usePath();
  const visibleSections = React.useMemo(
    () => getVisibleGuideSections(GUIDE_SECTIONS, path),
    [path],
  );
  const sectionIds = React.useMemo(
    () => visibleSections.map((s) => s.id),
    [visibleSections],
  );
  const { activeId, completed } = useSectionObserver(sectionIds);
  const { t, lang } = useLanguage();

  React.useEffect(() => {
    document.title = t.meta.title;
  }, [lang, t.meta.title]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        className="fixed left-0 right-0 top-14 z-[45] h-0.5 bg-muted"
        aria-hidden
      >
        <div
          className="h-full bg-primary transition-[width] duration-150"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <span className="sr-only" aria-live="polite">
        {t.progress}: {Math.round(progress * 100)}%
      </span>
      <Header sections={visibleSections} />
      <div className="mx-auto flex max-w-6xl">
        <Sidebar
          sections={visibleSections}
          activeId={activeId}
          completed={completed}
        />
        <main className="min-w-0 flex-1 overflow-x-hidden px-4 pb-24 pt-4 lg:px-8">
          <div className="mx-auto max-w-3xl py-8">
            <PathSelector />
            <GuideSections sections={visibleSections} />
          </div>
        </main>
      </div>
    </div>
  );
}
