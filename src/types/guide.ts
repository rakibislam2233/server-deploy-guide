export type DeployPath = "manual" | "docker";

export type Language = "bn" | "en";

export type SectionScope = "both" | "manual" | "docker";

/** সেকশন গুরুত্ব — UI তে ব্যাজ ও ব্যাখ্যা */
export type SectionTier = "required" | "recommended" | "optional";

export type InfoBoxVariant = "manual" | "docker" | "skip" | "warning";

export type ContentNode =
  | { type: "p"; bn: string; en: string }
  | { type: "h3"; bn: string; en: string }
  | { type: "h4"; bn: string; en: string }
  | {
      type: "collapsible";
      summaryBn: string;
      summaryEn: string;
      body: ContentNode[];
    }
  | {
      type: "code";
      file?: string;
      code: string;
      /** bash highlighting hints */
      lang?: "bash" | "nginx" | "yaml" | "json" | "ini" | "dockerfile";
    }
  | {
      type: "infobox";
      variant: InfoBoxVariant;
      titleBn: string;
      titleEn: string;
      bodyBn: string;
      bodyEn: string;
    }
  | {
      type: "table";
      headers: { bn: string[]; en: string[] };
      rows: { bn: string[]; en: string[] }[];
      stickyFirstColumn?: boolean;
    }
  | { type: "ol"; items: { bn: string; en: string }[] }
  | { type: "ul"; items: { bn: string; en: string }[] };

export interface GuideSubsection {
  id: string;
  number: string;
  titleBn: string;
  titleEn: string;
  /** এই সাবসেকশন কেন লাগে — বাংলা */
  purposeBn: string;
  /** Why this subsection exists — English */
  purposeEn: string;
  /** ছোট সার্ভারে প্রায়ই লাগে না — UI তে (ঐচ্ছিক) / (Optional) */
  optional?: boolean;
  scope?: SectionScope;
  nodes: ContentNode[];
}

export interface GuideSection {
  id: string;
  index: number;
  scope: SectionScope;
  /** প্রয়োজনীয় / সুপারিশিত / ঐচ্ছিক — না থাকলে UI তে “সুপারিশিত” ধরা হয় */
  tier?: SectionTier;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  /** কেন দরকার, কখন ব্যবহার, ছোট উদাহরণ — বাংলা */
  whyBn: string;
  /** Why it matters, when to use it, short example — English */
  whyEn: string;
  subsections: GuideSubsection[];
}
