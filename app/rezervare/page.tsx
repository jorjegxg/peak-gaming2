import { getTranslations } from "@/lib/translations";
import { ReservationContent } from "@/components/ReservationContent";

export const metadata = {
  title: "Rezervare | Peak Gaming",
  description: "Rezervă o stație PS5 sau PC la Peak Gaming.",
};

export default function RezervarePage() {
  const t = getTranslations("ro");
  return <ReservationContent t={t} />;
}
