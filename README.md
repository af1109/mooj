# Moja Swim Academy | أكاديمية موجة للسباحة

Interactive Next.js (App Router, TypeScript, Tailwind) prototype for a Kuwaiti summer swimming program.
Arabic (Kuwaiti dialect), RTL, mobile-first.

## Run locally

Requires Node.js 18.18+ (20 LTS recommended).

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests (pricing, age/pool, validation, cart, messaging, payment)
npm run typecheck
npm run build
```

## Architecture

| Path | Purpose |
| --- | --- |
| `src/config/program.ts` | Program constants, the four age groups / pools, discount tiers |
| `src/data/periods.ts` | **Demonstration** 14-day periods and availability |
| `src/features/pricing` | Single pricing function (integer fils, no float errors) |
| `src/features/registration` | Age → group → pool rules, Zod child schema (Arabic messages) |
| `src/features/cart` | Reducer, validated localStorage persistence, context store |
| `src/features/booking` | Checkout validation, demo booking reference, booking builder |
| `src/features/messaging` | Templates, consent/eligibility rules, idempotent dispatch, provider interface + demo providers |
| `src/services/payment` | `PaymentGateway` interface + simulated gateway |
| `src/components`, `src/app` | UI and routes: `/`, `/seasons`, `/registration`, `/cart`, `/checkout`, `/confirmation`, `/demo/reminders`, `/usability-test`, `/optional/extended-registration` |
| `docs/` | CODED assignment: UX notes, usability form/report, compliance report, submission checklist |

## Working in this prototype
Season browsing, one daily shift per child (3 two-hour shifts), age-group confirmation, registration, cart (add/edit/remove/change period or shift), automatic group discount, Kuwaiti mobile validation,
channel + consent selection, review, simulated payment states, confirmation, localStorage persistence.

## Simulated (not real)
- **Payment**: demo gateway only. No money moves, no card data is collected.
- **SMS / WhatsApp**: previews only, labeled "simulated". Providers return `simulated`, never delivered.
- **Periods and availability**: sample data, not confirmed capacity.
- **Booking reference**: generated in the browser (`MOJA-DEMO-…`).
- **Abandoned-cart reminders**: rules + previews at `/demo/reminders`; no scheduler.

## Needed for production
Payment gateway with server-side verification; SMS provider and WhatsApp Business Platform adapters
(server-side, credentials via env vars, see `.env.example`); backend booking store with live capacity;
server-side scheduler for reminders; booking reconciliation.