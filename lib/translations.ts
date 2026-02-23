import ro from "@/messages/ro.json";
import en from "@/messages/en.json";

export type Locale = "ro" | "en";

export type Translations = typeof ro;

const messages: Record<Locale, Translations> = { ro, en };

export function getTranslations(locale: Locale): Translations {
  return messages[locale] ?? messages.ro;
}

export function getBasePath(locale: Locale): string {
  return locale === "en" ? "/en" : "";
}
