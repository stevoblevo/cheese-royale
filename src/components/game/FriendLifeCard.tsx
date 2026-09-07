import { useState } from "react";
import type { FriendLifeCard as Card } from "@/game/friendLife";
import { cn } from "@/lib/utils";

export function FriendLifeCard({
  card,
  compact = false,
}: {
  card: Card;
  compact?: boolean;
}) {
  const [face, setFace] = useState<"real" | "magic">("real");

  return (
    <button
      type="button"
      onClick={() => setFace((f) => (f === "real" ? "magic" : "real"))}
      className={cn(
        "w-full rounded-[22px] border border-border bg-night-2/85 text-left backdrop-blur-sm transition-transform duration-150 active:scale-[0.99]",
        compact ? "p-3" : "p-4",
      )}
    >
      <p className="font-display text-[10px] tracking-[0.22em] text-mint uppercase">
        Friend-life · {face === "real" ? "the warmth" : "optional magic"}
      </p>
      {face === "real" ? (
        <ul className={cn("mt-2 space-y-1.5", compact && "space-y-1")}>
          {(compact ? card.real.slice(0, 2) : card.real).map((line, i) => (
            <li key={i} className="text-xs leading-snug">
              <span className="text-muted">{line.who}: </span>
              <span className="text-ink">{line.text}</span>
            </li>
          ))}
          {compact && card.real.length > 2 && (
            <li className="text-[11px] text-muted">…turn the card</li>
          )}
        </ul>
      ) : (
        <div className="mt-2">
          <p className="text-sm font-bold text-gold">{card.magicTitle}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{card.magic}</p>
        </div>
      )}
      <p className="mt-3 text-[10px] tracking-wide text-muted">
        Tap to turn · Magwena never replaces the friendship
      </p>
    </button>
  );
}
