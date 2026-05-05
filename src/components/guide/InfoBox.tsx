import { cn } from "@/lib/utils";
import type { InfoBoxVariant } from "@/types/guide";
import { AlertTriangle } from "lucide-react";

const variantStyles: Record<
  InfoBoxVariant,
  { box: string; icon: string; title: string }
> = {
  manual: {
    box: "border-l-4 border-muted-foreground bg-muted/50 text-muted-foreground",
    icon: "⚙️",
    title: "font-semibold text-foreground",
  },
  docker: {
    box: "border border-dashed border-border bg-muted/30 text-foreground",
    icon: "🐳",
    title: "font-semibold text-foreground",
  },
  skip: {
    box: "border-l-4 border-border bg-muted/40 text-muted-foreground",
    icon: "⏭️",
    title: "font-medium text-muted-foreground",
  },
  warning: {
    box: "border-l-4 border-foreground/40 bg-card text-foreground",
    icon: "",
    title: "font-bold text-foreground",
  },
};

export function InfoBox({
  variant,
  title,
  children,
  className,
}: {
  variant: InfoBoxVariant;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const s = variantStyles[variant];
  return (
    <aside
      className={cn(
        "my-6 rounded-r-md px-4 py-3 text-base leading-relaxed",
        s.box,
        variant === "skip" && "italic",
        className,
      )}
    >
      <div className="mb-1 flex items-center gap-2">
        {variant === "warning" ? (
          <AlertTriangle
            className="size-5 shrink-0 text-muted-foreground"
            aria-hidden
          />
        ) : (
          <span aria-hidden>{s.icon}</span>
        )}
        <p className={s.title}>{title}</p>
      </div>
      <div
        className={cn(
          "text-sm",
          variant === "manual" && "text-muted-foreground",
          variant === "docker" && "text-muted-foreground",
          variant === "skip" &&
            "text-muted-foreground decoration-border",
          variant === "warning" && "font-bold text-foreground",
        )}
      >
        {children}
      </div>
    </aside>
  );
}
