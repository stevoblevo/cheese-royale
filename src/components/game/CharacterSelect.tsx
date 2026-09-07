import { HEROES } from "@/game/heroes";
import type { HeroId } from "@/game/types";
import { sfx, unlockAudio } from "@/game/audio";
import { useGame } from "@/game/store";
import { cn } from "@/lib/utils";
import { SiteNav } from "./SiteNav";

const RING: Record<HeroId, string> = {
  princess: "ring-magenta/80",
  knight: "ring-cyan/80",
  sae: "ring-magenta/70",
  steven: "ring-mint/80",
};

const ACCENT: Record<HeroId, string> = {
  princess: "text-magenta",
  knight: "text-cyan",
  sae: "text-magenta",
  steven: "text-mint",
};

export function CharacterSelect() {
  const human = useGame((s) => s.human);
  const choose = useGame((s) => s.chooseHero);
  const start = useGame((s) => s.startKid);

  return (
    <div className="flex min-h-dvh flex-col bg-night text-ink">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-[max(12px,env(safe-area-inset-top))] pb-nav sm:px-8">
        <p className="font-display text-[11px] tracking-[0.28em] text-gold uppercase">
          Choose your seat
        </p>

        <h1 className="mt-3 font-display text-3xl tracking-[-0.03em] sm:mt-6 sm:text-5xl">
          Who walks first?
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted sm:mt-3">
          The others sit with you. This is a shared table — they will play as
          friends, not foes.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-6 sm:gap-3 lg:grid-cols-4">
          {HEROES.map((h) => {
            const on = human === h.id;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => {
                  unlockAudio();
                  sfx.click();
                  choose(h.id);
                }}
                className={cn(
                  "group overflow-hidden rounded-[20px] border bg-night-2 text-left transition-transform duration-200 active:scale-[0.99] sm:rounded-[22px]",
                  on ? `border-transparent ring-2 ${RING[h.id]}` : "border-border hover:border-ink/25",
                )}
              >
                <div className="relative aspect-square overflow-hidden sm:aspect-3/4">
                  <img
                    src={h.portrait}
                    alt={h.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-night-2 to-transparent sm:h-20" />
                </div>
                <div className="space-y-0.5 px-2.5 pb-2.5 sm:space-y-1 sm:px-3 sm:pb-3">
                  <p className={cn("font-display text-sm sm:text-lg", ACCENT[h.id])}>{h.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{h.title}</p>
                  <p className="hidden text-xs leading-relaxed text-muted sm:block">{h.blurb}</p>
                  <p className="text-[11px] font-bold text-ink sm:text-xs">{h.ability}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={() => {
              unlockAudio();
              sfx.magic();
              start(human);
            }}
            className="h-12 min-h-11 w-full rounded-[18px] bg-gold px-8 text-sm font-extrabold text-night shadow-(--shadow-glow-gold) transition-transform duration-150 active:scale-[0.98] sm:mx-auto sm:block sm:w-auto sm:min-w-48"
          >
            Begin the walk
          </button>
        </div>
      </div>
      <SiteNav className="fixed inset-x-0 bottom-0" />
    </div>
  );
}
