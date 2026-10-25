import { Suspense } from "react";
import { ChildRegistrationForm } from "@/components/registration/ChildRegistrationForm";
import { StepIndicator } from "@/components/ui/StepIndicator";

export const metadata = { title: "تسجيل طفل | أكاديمية موجة للسباحة" };

export default function RegistrationPage() {
  return (
    <div className="container-x max-w-3xl py-8">
      <StepIndicator current={1} />
      <Suspense fallback={<div className="card h-64 animate-pulse" />}>
        <ChildRegistrationForm />
      </Suspense>
    </div>
  );
}