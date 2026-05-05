import { bn } from "./bn";
import { en } from "./en";
import type { Language } from "@/types/guide";

export type Messages = typeof en;

const messages: Record<Language, Messages> = {
  bn: bn as unknown as Messages,
  en,
};

export function getMessages(lang: Language): Messages {
  return messages[lang];
}
