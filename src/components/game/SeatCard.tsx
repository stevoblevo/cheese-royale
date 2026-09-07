import { cn } from "@/lib/utils";
import {
  TONE_GLOW,
  TONE_RING,
  TONE_SWATCH,
  TONE_TEXT,
  type SeatDef,
} from "@/game/seats";

export function SeatCard({
  seat,
  compact = false,
}: {
  seat: SeatDef;
  compact?: boolean;
}) {
  return (
    <article
      className={cn(
        "flex overflow-hidden rounded-[22px] border bg-night-2 anim-pop",
        compact ? "items-center gap-3 p-3" : "flex-col sm:flex-row sm:items-stretch",
        TONE_RING[seat.tone],
      )}
      style={{ boxShadow: TONE_GLOW[seat.tone] }}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden",
          compact
            ? "size-[5.5rem] rounded-[16px] sm:size-24"
            : "aspect-square w-full sm:w-56 sm:aspect-auto",
        )}
      >
        <img
          src={seat.src}
          alt={seat.name}
          className="h-full w-full object-cover object-top"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-night-2 to-transparent sm:h-16" />
      </div>
      <div className={cn("min-w-0", compact ? "" : "flex flex-1 flex-col justify-center px-4 py-4 sm:px-5")}>
        <p
          className={cn(
            "font-display text-[10px] tracking-[0.22em] uppercase",
            TONE_TEXT[seat.tone],
          )}
        >
          {seat.cmd} · {seat.role}
        </p>
        <h2 className="mt-1 font-display text-2xl leading-none tracking-[-0.03em] text-ink sm:text-3xl">
          {seat.name}
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">{seat.line}</p>
        <p className="mt-3 flex items-center gap-2 text-[11px] text-ink">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{
              background: TONE_SWATCH[seat.tone],
              boxShadow: `0 0 10px ${TONE_SWATCH[seat.tone]}`,
            }}
          />
          <span className="font-display tracking-[0.16em] uppercase text-gold">
            {seat.offer}
          </span>
        </p>
      </div>
    </article>
  );
}
