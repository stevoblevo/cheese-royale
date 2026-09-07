import { Crown } from "lucide-react";
import { heroDef } from "@/game/heroes";
import { useGame } from "@/game/store";
import { SiteNav } from "./SiteNav";

export function WinScreen() {
  const winner = useGame((s) => s.winner);
  const how = useGame((s) => s.winHow);
  const reset = useGame((s) => s.reset);
  const startKid = useGame((s) => s.startKid);
  const human = useGame((s) => s.human);
  if (!winner) return null;
  const def = heroDef(winner);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-night text-ink">
      <img src="/art/castle.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-night/70" />
      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-6 pb-nav text-center">
        <img
          src={def.portrait}
          alt=""
          className="size-28 rounded-[28px] object-cover ring-2 ring-gold/70 anim-float sm:size-32"
        />
        <Crown className="mt-5 size-8 text-gold" />
        <h1 className="mt-3 font-display text-4xl tracking-[-0.03em]">{def.name}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {how === "crown"
            ? "The Cheese Crown is lifted — light, not a weight. The table remains set for four."
            : "Twenty cheese, shared and counted. No one left hungry at this castle."}
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => startKid(human)}
            className="h-12 flex-1 rounded-[18px] bg-gold text-sm font-extrabold text-night"
          >
            Play again
          </button>
          <button
            type="button"
            onClick={reset}
            className="h-12 flex-1 rounded-[18px] border border-border text-sm font-bold"
          >
            Return home
          </button>
        </div>
      </main>
      <SiteNav className="fixed inset-x-0 bottom-0 z-20" />
    </div>
  );
}
