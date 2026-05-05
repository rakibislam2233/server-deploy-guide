"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

function classifyBashLine(line: string) {
  const t = line.trimEnd();
  if (t.trim() === "" || t.trim().startsWith("#")) return "comment" as const;
  if (/^echo\s+["']/.test(t.trim())) return "string" as const;
  if (/\s["'][^"']*["']\s*$/.test(t) || /^export\s+\w+=["']/.test(t.trim()))
    return "string" as const;
  return "command" as const;
}

export function CodeBlock({
  file,
  code,
  lang = "bash",
}: {
  file?: string;
  code: string;
  lang?: "bash" | "nginx" | "yaml" | "json" | "ini" | "dockerfile";
}) {
  const { t } = useLanguage();
  const [copied, setCopied] = React.useState(false);
  const lines = code.replace(/\n$/, "").split("\n");

  const lineClass = (line: string) => {
    if (lang !== "bash" && lang !== "dockerfile") {
      if (line.trim().startsWith("#")) return "text-muted-foreground";
      return "text-foreground";
    }
    const k = classifyBashLine(line);
    if (k === "comment") return "text-muted-foreground";
    if (k === "string") return "text-primary";
    return "text-foreground";
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <figure className="mb-6 overflow-hidden rounded-md border border-border bg-muted/30 text-sm">
      {file ? (
        <figcaption className="border-b border-border bg-muted px-4 py-2 font-mono text-xs text-muted-foreground">
          {file}
        </figcaption>
      ) : null}
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          size="sm"
          title={copied ? t.copied : t.copy}
          className="absolute right-2 top-2 z-10 h-8 border-border bg-card px-3 font-mono text-xs text-foreground hover:bg-muted"
          onClick={onCopy}
        >
          {copied ? t.copied : t.copy}
        </Button>
        <pre className="max-h-[min(70vh,720px)] overflow-auto p-4 pr-24 font-mono leading-relaxed">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex gap-3">
                <span className="w-8 shrink-0 select-none text-right text-muted-foreground/80">
                  {i + 1}
                </span>
                <span className={cn("min-w-0 flex-1 whitespace-pre-wrap", lineClass(line))}>
                  {line || " "}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </figure>
  );
}
