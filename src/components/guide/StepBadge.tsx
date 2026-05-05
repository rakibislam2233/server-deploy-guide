"use client";

import { Badge } from "@/components/ui/badge";
import type { SectionScope } from "@/types/guide";
import { useLanguage } from "@/hooks/useLanguage";

export function StepBadge({ scope }: { scope: SectionScope }) {
  const { t } = useLanguage();
  const label =
    scope === "both"
      ? t.badges.both
      : scope === "manual"
        ? t.badges.manual
        : t.badges.docker;
  return (
    <Badge
      variant="outline"
      className="mt-2 border-border bg-transparent font-mono text-xs uppercase tracking-wide text-muted-foreground"
    >
      {label}
    </Badge>
  );
}
