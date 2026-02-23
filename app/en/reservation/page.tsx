import { getTranslations } from "@/lib/translations";
import { ReservationContent } from "@/components/ReservationContent";

export const metadata = {
  title: "Reservation | Peak Gaming",
  description: "Book a PS5 or PC station at Peak Gaming.",
};

export default function ReservationPage() {
  const t = getTranslations("en");
  return <ReservationContent t={t} basePath="/en" />;
}
