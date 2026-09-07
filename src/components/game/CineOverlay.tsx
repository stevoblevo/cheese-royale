import { Clover } from "lucide-react";
import { CINE_EVENTS, CINE_THEMES } from "@/game/cine";
import { sfx, unlockAudio } from "@/game/audio";
import { useGame } from "@/game/store";
import { cn } from "@/lib/utils";

export function CineOverlay({ compact = false }: { compact?: boolean }) {
  const theme = useGame((s) => s.cineTheme);
  const over = useGame((s) => s.cineOver);
  const eventI = useGame((s) => s.cineEvent);
  const ev = CINE_EVENTS[eventI] ?? CINE_EVENTS[0];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            unlockAudio();
            sfx.whisper();
            useGame.getState().toggleCine();
          }}
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[11px] font-bold uppercase tracking-wider",
            over ? "border-magenta/40 text-magenta" : "border-border text-muted",
          )}
        >
          <Clover className="size-3.5" />
          {over ? "Cine over" : "Cine"}
        </button>
        {over && (
          <div className="no-scrollbar flex min-w-0 flex-1 gap-1 overflow-x-auto">
            {CINE_THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  sfx.click();
                  useGame.getState().setCineTheme(t.id);
                }}
                className={cn(
                  "h-9 shrink-0 rounded-full border px-2.5 text-[10px] font-bold uppercase tracking-wider",
                  theme === t.id ? "border-gold bg-gold/15 text-gold" : "border-border text-muted",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {over && !compact && (
        <button
          type="button"
          onClick={() => {
            unlockAudio();
            sfx.magic();
            useGame.getState().nextCineEvent();
          }}
          className="w-full rounded-[16px] border border-gold/20 bg-night-2/90 p-3 text-left"
        >
          <p className="font-display text-[10px] tracking-[0.2em] text-gold uppercase">
            Story event
          </p>
          <p className="mt-1 text-sm font-bold text-ink">{ev.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{ev.body}</p>
        </button>
      )}
    </div>
  );
}
