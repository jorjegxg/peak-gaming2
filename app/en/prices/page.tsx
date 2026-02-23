import { getTranslations } from "@/lib/translations";
import { PricesContent } from "@/components/PricesContent";

export const metadata = {
  title: "Prices | Peak Gaming",
  description: "Gaming rates – Classic, Pupil/Student, special offer 12:00–16:00.",
};

export default function PricesPage() {
  const t = getTranslations("en");
  return <PricesContent t={t} basePath="/en" />;
}
