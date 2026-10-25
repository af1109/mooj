import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";

export const metadata = { title: "إتمام الحجز | أكاديمية موجة للسباحة" };

export default function CheckoutPage() {
  return (
    <div className="container-x py-8">
      <CheckoutFlow />
    </div>
  );
}