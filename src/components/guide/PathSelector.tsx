"use client";

import { cn } from "@/lib/utils";
import { usePath } from "@/hooks/usePath";
import { useLanguage } from "@/hooks/useLanguage";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";

export function PathSelector({ className }: { className?: string }) {
  const { path, setPath } = usePath();
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        "w-full rounded-lg border border-border bg-muted/25 px-3 py-2.5 sm:px-4",
        className,
      )}
    >
      <Tabs
        value={path}
        onValueChange={(v) => {
          if (v === "manual" || v === "docker") setPath(v);
        }}
        className="flex flex-col items-center gap-2"
      >
        <TabsList
          variant="line"
          className="inline-flex h-auto w-full shrink-0 gap-5 rounded-md border border-border bg-background/80 p-1"
        >
          <TabsTrigger
            value="manual"
            className={cn(
              "relative h-auto min-h-0 shrink-0 cursor-pointer rounded px-3 py-2 font-mono text-[11px] leading-tight shadow-none ring-offset-1 ring-offset-background after:hidden sm:text-xs",
              "border border-transparent text-muted-foreground",
              "data-active:border-ring data-active:bg-accent data-active:text-foreground data-active:ring-1 data-active:ring-ring",
            )}
          >
            <span className="mr-1 text-[10px]" aria-hidden>
              ⚙️
            </span>
            {t.path.manual}
          </TabsTrigger>
          <TabsTrigger
            value="docker"
            className={cn(
              "relative h-auto min-h-0 shrink-0 cursor-pointer rounded px-3 py-2 font-mono text-[11px] leading-tight shadow-none ring-offset-1 ring-offset-background after:hidden sm:text-xs",
              "border border-transparent text-muted-foreground",
              "data-active:border-ring data-active:bg-accent data-active:text-foreground data-active:ring-1 data-active:ring-ring",
            )}
          >
            <span className="mr-1 text-[10px]" aria-hidden>
              🐳
            </span>
            {t.path.docker}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
