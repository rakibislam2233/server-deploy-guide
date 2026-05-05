"use client";

import type { SectionTier } from "@/types/guide";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { BadgeCheck, CircleDashed, ShieldAlert } from "lucide-react";

/** Tiny tier marker for dense lists (sidebar, mobile nav). */
export function SectionTierIcon({
  tier,
  className,
}: {
  tier: SectionTier;
  className?: string;
}) {
  const { t } = useLanguage();
  const label =
    tier === "required"
      ? t.tier.badgeRequired
      : tier === "recommended"
        ? t.tier.badgeRecommended
        : t.tier.badgeOptional;

  const Icon =
    tier === "required"
      ? ShieldAlert
      : tier === "recommended"
        ? BadgeCheck
        : CircleDashed;

  return (
    <span
      className={cn("inline-flex shrink-0", className)}
      title={label}
    >
      <Icon
        className={cn(
          "size-3.5 stroke-[2.25]",
          tier === "required" && "text-destructive",
          tier === "recommended" &&
            "text-primary dark:text-primary",
          tier === "optional" && "text-muted-foreground",
        )}
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function SectionTierBadge({ tier }: { tier: SectionTier }) {
  const { t } = useLanguage();
  const label =
    tier === "required"
      ? t.tier.badgeRequired
      : tier === "recommended"
        ? t.tier.badgeRecommended
        : t.tier.badgeOptional;
  return (
    <Badge
      variant="outline"
      className={cn(
        "shrink-0 px-1.5 py-0 font-mono text-[9px] uppercase leading-none tracking-wide",
        tier === "required" &&
          "border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive/40 dark:bg-destructive/15",
        tier === "recommended" &&
          "border-primary/40 bg-primary/10 text-foreground dark:border-primary/30",
        tier === "optional" && "border-muted-foreground/40 text-muted-foreground",
      )}
    >
      {label}
    </Badge>
  );
}

export function SectionTierPanel({ tier }: { tier: SectionTier }) {
  const { lang, t } = useLanguage();
  const body =
    tier === "required"
      ? lang === "bn"
        ? t.tier.bodyRequiredBn
        : t.tier.bodyRequiredEn
      : tier === "recommended"
        ? lang === "bn"
          ? t.tier.bodyRecommendedBn
          : t.tier.bodyRecommendedEn
        : lang === "bn"
          ? t.tier.bodyOptionalBn
          : t.tier.bodyOptionalEn;
  return (
    <div className="mt-4 max-w-3xl rounded-md border border-border bg-muted/30 px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <SectionTierBadge tier={tier} />
        <span className="text-xs font-medium text-muted-foreground">
          {t.tier.panelTitle}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
