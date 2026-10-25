import type { PaymentMethod } from "@/types";

export type PaymentStatus = "not_started" | "processing" | "successful" | "failed";

export interface PaymentRequest {
  amountFils: number;
  method: PaymentMethod;
}

export interface PaymentResult {
  status: "successful" | "cancelled" | "failed";
  /** True for the demo gateway. A real gateway result must be verified server-side. */
  simulated: boolean;
}

/**
 * Payment gateway boundary. UI code depends only on this interface, so a real
 * Kuwait-supported gateway (with server-side verification) can replace the demo.
 */
export interface PaymentGateway {
  pay(request: PaymentRequest): Promise<PaymentResult>;
}

export type DemoOutcome = "successful" | "cancelled" | "failed";

/** Simulated gateway: charges nothing, collects no card data. */
export function createDemoGateway(outcome: DemoOutcome = "successful", delayMs = 1400): PaymentGateway {
  return {
    pay: () =>
      new Promise((resolve) => {
        setTimeout(() => resolve({ status: outcome, simulated: true }), delayMs);
      }),
  };
}