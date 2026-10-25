import { SIMULATED_LABEL, CHANNEL_LABEL } from "@/features/messaging/demo-labels";
import type { OutgoingMessage } from "@/features/messaging/types";

/** Shows what a message would look like. Nothing is sent. */
export function NotificationPreview({ message }: { message: OutgoingMessage }) {
  const wa = message.channel === "whatsapp";
  return (
    <figure className="rounded-2xl border-2 border-dashed border-turquoise p-4">
      <figcaption className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm font-bold">
        <span className="text-gulf">{CHANNEL_LABEL[message.channel]}</span>
        <span className="rounded-full bg-sand px-3 py-1 text-xs text-terracotta">{SIMULATED_LABEL}</span>
      </figcaption>
      <div className={`whitespace-pre-line rounded-2xl p-4 text-sm leading-relaxed ${wa ? "bg-[#DCF3E6]" : "bg-sand/70"}`}>
        {message.body}
      </div>
    </figure>
  );
}