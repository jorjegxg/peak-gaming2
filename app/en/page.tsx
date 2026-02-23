import type { Metadata } from "next";
import { getTranslations } from "@/lib/translations";
import { HomeContent } from "@/components/HomeContent";

export const metadata: Metadata = {
  title: "Peak Gaming | Net Café",
  description: "Peak Gaming net café — PS5, gaming PCs, great prices. Your spot to play.",
};

export default function EnHome() {
  const t = getTranslations("en");
  return <HomeContent t={t} basePath="/en" />;
}
