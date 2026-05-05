"use client";

import * as React from "react";

export function useProgress() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop;
      const height = el.scrollHeight - el.clientHeight;
      const p = height <= 0 ? 1 : Math.min(1, Math.max(0, scrollTop / height));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

export function useSectionObserver(sectionIds: string[]) {
  const [activeId, setActiveId] = React.useState<string>(sectionIds[0] ?? "");
  const [completed, setCompleted] = React.useState<Record<string, boolean>>({});

  const idsKey = sectionIds.join("\0");
  React.useEffect(() => {
    setCompleted({});
    setActiveId((prev) =>
      sectionIds.includes(prev) ? prev : (sectionIds[0] ?? ""),
    );
  }, [idsKey, sectionIds]);

  React.useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
        setCompleted((prev) => {
          const next = { ...prev };
          for (const e of entries) {
            if (!e.target.id) continue;
            if (e.boundingClientRect.top < window.innerHeight * 0.35) {
              next[e.target.id] = true;
            }
          }
          return next;
        });
      },
      { root: null, rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5, 1] },
    );

    for (const el of elements) io.observe(el);
    return () => io.disconnect();
  }, [idsKey, sectionIds]);

  return { activeId, completed };
}
