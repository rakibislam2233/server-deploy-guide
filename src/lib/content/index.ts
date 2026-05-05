import type { GuideSection } from "@/types/guide";
import { guideSectionsPart0 } from "./part0";
import { guideSectionsPart1 } from "./part1";
import { guideSectionsPart2 } from "./part2";
import { guideSectionsPart3 } from "./part3";
import { guideSectionsPart4 } from "./part4";

export const GUIDE_SECTIONS: GuideSection[] = [
  ...guideSectionsPart0,
  ...guideSectionsPart1,
  ...guideSectionsPart2,
  ...guideSectionsPart3,
  ...guideSectionsPart4,
];
