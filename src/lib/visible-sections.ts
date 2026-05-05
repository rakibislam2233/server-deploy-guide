import type { DeployPath, GuideSection } from "@/types/guide";

/** ম্যানুয়াল বা ডকার পথে শুধু সেই সাবসেকশনগুলো রাখে যা ওই পথের জন্য প্রযোজ্য। */
export function getVisibleGuideSections(
  sections: GuideSection[],
  path: DeployPath,
): GuideSection[] {
  return sections
    .filter((section) => {
      if (section.scope === "manual" && path === "docker") return false;
      if (section.scope === "docker" && path === "manual") return false;
      return true;
    })
    .map((section) => ({
      ...section,
      subsections: section.subsections.filter((sub) => {
        const sc = sub.scope ?? "both";
        if (path === "manual") return sc !== "docker";
        return sc !== "manual";
      }),
    }))
    .filter((section) => section.subsections.length > 0);
}
