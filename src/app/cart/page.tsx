import { CartView } from "@/components/cart/CartView";
import { StepIndicator } from "@/components/ui/StepIndicator";

export const metadata = { title: "السلة | أكاديمية موجة للسباحة" };

export default function CartPage() {
  return (
    <div className="container-x py-8 pb-28 lg:pb-8">
      <StepIndicator current={2} />
      <CartView />
    </div>
  );
}