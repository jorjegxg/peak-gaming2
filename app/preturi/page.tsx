import { getTranslations } from "@/lib/translations";
import { PricesContent } from "@/components/PricesContent";

export const metadata = {
  title: "Prețuri | Peak Gaming",
  description: "Tarife gaming – Clasic, Elev/Student, ofertă specială 12:00–16:00.",
};

export default function PreturiPage() {
  const t = getTranslations("ro");
  return <PricesContent t={t} />;
}
