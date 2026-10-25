import { BookingConfirmation } from "@/components/checkout/BookingConfirmation";

export const metadata = { title: "تأكيد الحجز | أكاديمية موجة للسباحة" };

export default function ConfirmationPage() {
  return (
    <div className="container-x py-8">
      <BookingConfirmation />
    </div>
  );
}