import { getTranslations } from "@/lib/translations";
import { HomeContent } from "@/components/HomeContent";

export default function Home() {
  const t = getTranslations("ro");
  return <HomeContent t={t} />;
}
