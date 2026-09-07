import { Heart, Shield, Sparkles } from "lucide-react";
import { CARD_INFO, heroDef } from "@/game/heroes";
import type { CardId, HeroId, Player } from "@/game/types";
import { cn } from "@/lib/utils";

const EDGE: Record<HeroId, string> = {
  princess: "border-magenta/45",
  knight: "border-cyan/45",
  sae: "border-magenta/35",
  steven: "border-mint/45",
};

const NAME: Record<HeroId, string> = {
  princess: "text-magenta",
  knight: "text-cyan",
  sae: "text-magenta",
  steven: "text-mint",
};

export function HeroDock({
  player,
  active,
  canAct,
  onAbility,
  onCard,
}: {
  player: Player;
  active: boolean;
  canAct: boolean;
  onAbility?: () => void;
  onCard?: (c: CardId) => void;
}) {
  const def = heroDef(player.id);
  const ready = player.abilityCd === 0;

  return (
    <article
      className={cn(
        "flex min-w-[15.5rem] shrink-0 snap-start gap-2.5 rounded-[20px] border bg-night-2/92 p-2.5 backdrop-blur-sm sm:min-w-0",
        EDGE[player.id],
        active && "shadow-(--shadow-glow-gold) ring-1 ring-gold/50",
      )}
    >
      <img
        src={def.portrait}
        alt=""
        className="size-14 shrink-0 rounded-[12px] object-cover sm:size-[4.25rem]"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-1">
          <div>
            <p className={cn("font-display text-sm leading-none", NAME[player.id])}>{def.name}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted">
              {player.isHuman ? "You" : "Friend"}
            </p>
          </div>
          <p className="tabular-nums text-xs font-extrabold text-gold">{player.cheese}</p>
        </div>
        <div className="mt-1.5 flex items-center gap-0.5 text-magenta">
          {Array.from({ length: Math.min(Math.max(player.hearts, 0), 6) }).map((_, i) => (
            <Heart key={i} className="size-3 fill-current" />
          ))}
          {player.shield && <Shield className="ml-1 size-3 text-cyan" />}
        </div>
        {canAct && player.isHuman ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            <button
              type="button"
              disabled={!ready}
              onClick={onAbility}
              className="inline-flex h-11 items-center gap-1 rounded-full bg-gold px-3 text-[11px] font-extrabold text-night disabled:bg-night-3 disabled:text-muted"
            >
              <Sparkles className="size-3.5" />
              {ready ? def.ability : `${player.abilityCd}`}
            </button>
            {player.cards.map((c, i) => (
              <button
                key={`${c}-${i}`}
                type="button"
                onClick={() => onCard?.(c)}
                className="inline-flex h-11 items-center gap-1.5 rounded-full border border-border bg-night/50 px-2 pr-3 text-[11px] font-bold"
              >
                <img
                  src={CARD_INFO[c].art}
                  alt=""
                  className="size-7 rounded-full object-cover"
                />
                {CARD_INFO[c].name}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-1.5 line-clamp-1 text-[10px] text-muted">{def.ability}</p>
        )}
      </div>
    </article>
  );
}
