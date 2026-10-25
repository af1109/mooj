import { ExtendedRegistrationDemo } from "@/components/optional/ExtendedRegistrationDemo";

export const metadata = { title: "تسجيل موسّع (اختياري، تجريبي) | أكاديمية موجة للسباحة" };

export default function ExtendedRegistrationPage() {
  return (
    <div className="container-x max-w-3xl py-8">
      <ExtendedRegistrationDemo />
    </div>
  );
}