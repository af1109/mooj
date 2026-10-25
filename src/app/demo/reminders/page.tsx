import { AbandonedCartDemo } from "@/components/notifications/AbandonedCartDemo";

export const metadata = { title: "معاينة تذكيرات السلة | أكاديمية موجة للسباحة" };

export default function RemindersDemoPage() {
  return (
    <div className="container-x max-w-3xl py-8">
      <AbandonedCartDemo />
    </div>
  );
}