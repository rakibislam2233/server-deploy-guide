"use client";

import type { ContentNode, Language } from "@/types/guide";
import type { GuideSubsection } from "@/types/guide";
import { CodeBlock } from "./CodeBlock";
import { InfoBox } from "./InfoBox";
import { ComparisonTable } from "./ComparisonTable";
import { useLanguage } from "@/hooks/useLanguage";

export function ContentNodes({
  nodes,
  lang,
}: {
  nodes: ContentNode[];
  lang: Language;
}) {
  return (
    <>
      {nodes.map((node, i) => {
        const key = i;
        switch (node.type) {
          case "p":
            return (
              <p
                key={key}
                className="mb-4 text-base leading-relaxed text-muted-foreground"
              >
                {lang === "bn" ? node.bn : node.en}
              </p>
            );
          case "h3":
            return (
              <h3
                key={key}
                className="mb-3 mt-8 text-lg font-bold text-foreground first:mt-0"
              >
                {lang === "bn" ? node.bn : node.en}
              </h3>
            );
          case "h4":
            return (
              <h4
                key={key}
                className="mb-2 mt-6 text-base font-semibold text-foreground"
              >
                {lang === "bn" ? node.bn : node.en}
              </h4>
            );
          case "code":
            return (
              <CodeBlock
                key={key}
                file={node.file}
                code={node.code}
                lang={node.lang}
              />
            );
          case "infobox":
            return (
              <InfoBox
                key={key}
                variant={node.variant}
                title={lang === "bn" ? node.titleBn : node.titleEn}
              >
                {lang === "bn" ? node.bodyBn : node.bodyEn}
              </InfoBox>
            );
          case "table": {
            const headers =
              lang === "bn" ? node.headers.bn : node.headers.en;
            const rows = node.rows.map((r) => (lang === "bn" ? r.bn : r.en));
            return (
              <ComparisonTable
                key={key}
                headers={headers}
                rows={rows}
                stickyFirstColumn={node.stickyFirstColumn}
              />
            );
          }
          case "ol":
            return (
              <ol
                key={key}
                className="mb-6 list-decimal space-y-2 pl-6 text-base text-muted-foreground"
              >
                {node.items.map((it, j) => (
                  <li key={j}>{lang === "bn" ? it.bn : it.en}</li>
                ))}
              </ol>
            );
          case "ul":
            return (
              <ul
                key={key}
                className="mb-6 list-disc space-y-2 pl-6 text-base text-muted-foreground"
              >
                {node.items.map((it, j) => (
                  <li key={j}>{lang === "bn" ? it.bn : it.en}</li>
                ))}
              </ul>
            );
          case "collapsible":
            return (
              <details
                key={key}
                className="mb-3 rounded-md border border-border bg-card text-card-foreground"
              >
                <summary className="cursor-pointer px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/70">
                  {lang === "bn" ? node.summaryBn : node.summaryEn}
                </summary>
                <div className="border-t border-border px-3 py-3">
                  <ContentNodes nodes={node.body} lang={lang} />
                </div>
              </details>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

export function SubsectionBlock({
  subsection,
  lang,
}: {
  subsection: GuideSubsection;
  lang: Language;
}) {
  const { t } = useLanguage();
  const title =
    (lang === "bn" ? subsection.titleBn : subsection.titleEn) +
    (subsection.optional ? ` ${t.optionalSuffix}` : "");
  const purpose =
    lang === "bn" ? subsection.purposeBn : subsection.purposeEn;
  return (
    <div className="mb-10">
      <h3 className="text-lg font-bold text-foreground">
        <span className="mr-2 font-mono text-muted-foreground">
          {subsection.number}
        </span>
        {title}
      </h3>
      <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">
        {t.sections.subsectionWhy}
      </p>
      <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        {purpose}
      </p>
      <div className="mt-4">
        <ContentNodes nodes={subsection.nodes} lang={lang} />
      </div>
    </div>
  );
}
