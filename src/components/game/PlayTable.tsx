import { useEffect, useRef, useState } from "react";
import { Crown, Dices } from "lucide-react";
import { TILES } from "@/game/board";
import { CHALLENGES, HERO_ORDER, heroDef } from "@/game/heroes";
import { saeLine } from "@/game/sae";
import { sfx, unlockAudio } from "@/game/audio";
import { useGame, wait, canFeedChip } from "@/game/store";
import type { HeroId } from "@/game/types";
import { FriendLifeCard } from "./FriendLifeCard";
import { FRIEND_LIFE } from "@/game/friendLife";
import { BoardView } from "./BoardView";
import { HeroDock } from "./HeroDock";
import { SiteNav } from "./SiteNav";

let tableGen = 0;

export function PlayTable() {
  const state = useGame();
  const [display, setDisplay] = useState<Record<HeroId, number>>(() => snap(state));
  const walking = useRef(false);
  const me = state.players.find((p) => p.id === state.human);
  const current = state.players.find((p) => p.id === state.turn);
  const humanTurn = Boolean(current?.isHuman && state.phase === "ready" && !state.winner);

  useEffect(() => {
    if (walking.current) return;
    setDisplay(snap(useGame.getState()));
  }, [state.turnIndex, state.phase, state.winner]);

  async function walk(id: HeroId, from: number, steps: number) {
    walking.current = true;
    let pos = from;
    for (let i = 0; i < steps; i++) {
      pos = (pos + 1) % 32;
      setDisplay((d) => ({ ...d, [id]: pos }));
      await wait(140);
    }
    walking.current = false;
  }

  async function resolveRoll(steps: number) {
    const snapState = useGame.getState();
    if (snapState.screen !== "play" || snapState.winner) return;
    const actor = snapState.turn;
    const piece = snapState.players.find((p) => p.id === actor);
    if (!piece) return;
    const from = piece.position;
    await wait(480);
    if (useGame.getState().screen !== "play") return;
    useGame.setState({ rolling: false, phase: "moving" });
    await walk(actor, from, steps);
    if (useGame.getState().screen !== "play") return;
    useGame.getState().finishMove(steps);
    setDisplay(snap(useGame.getState()));
    if (useGame.getState().winner) {
      sfx.win();
      return;
    }
    sfx.cheese();
    await wait(620);
    if (useGame.getState().screen !== "play") return;
    useGame.getState().endTurn();
  }

  async function drainAi(gen: number) {
    while (
      gen === tableGen &&
      useGame.getState().screen === "play" &&
      useGame.getState().phase === "ai" &&
      !useGame.getState().winner
    ) {
      await wait(700);
      if (gen !== tableGen) return;
      const action = useGame.getState().runAiStep();
      if (action.kind === "apple") {
        sfx.neigh();
        await wait(420);
        const n = useGame.getState().beginRoll();
        sfx.dice();
        await resolveRoll(n);
        continue;
      }
      if (action.kind !== "roll") {
        sfx.magic();
        await wait(420);
        if (useGame.getState().winner) {
          sfx.win();
          return;
        }
        const n = useGame.getState().beginRoll();
        sfx.dice();
        await resolveRoll(n);
        continue;
      }
      if (action.steps) {
        sfx.dice();
        await resolveRoll(action.steps);
      }
    }
  }

  async function handleRoll() {
    if (!humanTurn || walking.current) return;
    unlockAudio();
    sfx.dice();
    const n = useGame.getState().beginRoll();
    const gen = ++tableGen;
    await resolveRoll(n);
    await drainAi(gen);
  }

  useEffect(() => {
    if (state.phase !== "ai" || state.winner) return;
    const gen = ++tableGen;
    void drainAi(gen);
    return () => {
      tableGen += 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const challenge = CHALLENGES[state.challenge];
  const lastLog = state.log[state.log.length - 1];

  const extras = (
    <>
      {humanTurn && canFeedChip(state, state.human) && (
        <button
          type="button"
          onClick={() => {
            unlockAudio();
            if (useGame.getState().offerApple()) sfx.neigh();
          }}
          className="inline-flex h-12 items-center gap-2 rounded-[16px] border border-gold/40 bg-night-2 px-4 text-sm font-bold text-gold"
        >
          Offer Chip an apple
        </button>
      )}
      {humanTurn && me && TILES[me.position] === "fold" && (
        <button
          type="button"
          onClick={() => {
            unlockAudio();
            sfx.whisper();
            useGame.getState().startFold("play");
          }}
          className="inline-flex h-12 items-center gap-2 rounded-[16px] border border-gold/40 bg-night-2 px-4 text-sm font-bold text-gold"
        >
          Step into leftover
        </button>
      )}
    </>
  );

  const rollControl = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={!humanTurn}
        onClick={() => void handleRoll()}
        className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-[16px] bg-gold px-4 text-sm font-extrabold text-night shadow-(--shadow-glow-gold) disabled:bg-night-3 disabled:text-muted disabled:shadow-none sm:h-14 sm:min-w-44 sm:flex-none sm:rounded-[18px] sm:px-6"
      >
        <Dices className="size-4" />
        {humanTurn ? "Roll the die" : current ? `${heroDef(current.id).name}'s walk` : "…"}
      </button>
      <div
        className={`grid size-12 shrink-0 place-items-center rounded-[14px] border border-gold/40 bg-night-2 font-display text-xl text-gold sm:size-14 sm:rounded-[16px] sm:text-2xl ${state.rolling ? "anim-dice" : ""}`}
      >
        {state.dice || "–"}
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-night text-ink overscroll-none">
      <header className="flex shrink-0 items-center justify-between gap-2 px-3 pt-[max(10px,env(safe-area-inset-top))] pb-2 lg:px-6">
        <div className="min-w-0">
          <p className="font-display text-[10px] tracking-[0.28em] text-gold uppercase">
            Cheese Royale
          </p>
          <p className="truncate text-[11px] text-muted">
            {challenge.title} · {state.challengeDone ? "done" : "open"}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-gold">
          <Crown className="size-4" />
          <span className="tabular-nums text-xs">{state.turnIndex + 1}</span>
        </div>
      </header>

      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-3 lg:overflow-y-auto lg:px-6">
        <div className="grid min-h-0 flex-1 content-start gap-2 lg:grid-cols-[1fr_260px] lg:items-start lg:gap-3">
          <div className="flex min-h-0 flex-col">
            <div className="board-stage mx-auto w-full">
              <BoardView
                fit
                positions={display}
                turn={state.turn}
                chipAt={state.chip.position}
                chipAte={state.chip.justAte}
                targetingTile={state.targeting === "tile"}
                onPickTile={(i) => {
                  sfx.magic();
                  state.pickTargetTile(i);
                }}
              />
            </div>

            <p className="mt-2 min-h-6 truncate text-center text-xs text-muted sm:min-h-8 sm:text-sm">
              {lastLog?.text}
            </p>

            <div className="mt-1 hidden flex-col items-center gap-3 sm:flex sm:flex-row sm:justify-center">
              {rollControl}
              {extras}
            </div>
          </div>

          <aside className="hidden flex-col gap-2.5 lg:flex">
            <div className="rounded-[20px] border border-gold/25 bg-night-2/85 p-3.5">
              <p className="font-display text-[10px] tracking-[0.22em] text-gold uppercase">
                Today's challenge
              </p>
              <p className="mt-1 text-sm font-bold">{challenge.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{challenge.hint}</p>
              <p className="mt-2 text-[11px] text-mint">
                {state.challengeDone ? "Complete · the table remembers." : "Still open."}
              </p>
            </div>
            <div className="rounded-[20px] border border-border bg-night-2/85 p-3.5">
              <p className="font-display text-[10px] tracking-[0.22em] text-magenta uppercase">
                Sae whispers
              </p>
              <p className="mt-2 text-sm leading-relaxed italic text-ink/90">
                {saeLine(state.turnIndex + (me?.cheese ?? 0))}
              </p>
            </div>
            <div className="flex gap-3 rounded-[20px] border border-gold/20 bg-night-2/85 p-3">
              <img
                src="/art/chip.jpg"
                alt=""
                className="size-16 shrink-0 rounded-[14px] object-cover"
              />
              <div className="min-w-0">
                <p className="font-display text-[10px] tracking-[0.22em] text-gold uppercase">
                  Chip · the horse
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {state.chip.apples === 0
                    ? "Waits at Home. You can bring him an apple."
                    : `Okay — he ate it. Apples: ${state.chip.apples}.`}
                </p>
              </div>
            </div>
            <FriendLifeCard card={FRIEND_LIFE[0]!} compact />
            {state.targeting === "hero" && (
              <div className="rounded-[20px] border border-magenta/40 bg-night-2 p-3">
                <p className="mb-2 text-xs text-muted">Choose a friend</p>
                <div className="flex flex-wrap gap-2">
                  {state.players.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        sfx.heart();
                        state.pickTargetHero(p.id);
                      }}
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-3 text-xs font-bold"
                    >
                      <img src={heroDef(p.id).portrait} alt="" className="size-7 rounded-full object-cover" />
                      {heroDef(p.id).name}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={state.cancelTarget}
                    className="h-11 rounded-full px-3 text-xs text-muted"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {state.targeting === "tile" && (
              <p className="rounded-[20px] border border-magenta/40 bg-night-2 p-3 text-xs text-muted">
                Tap any tile. Sae will meet you there.
                <button type="button" onClick={state.cancelTarget} className="ml-2 h-11 text-ink">
                  Cancel
                </button>
              </p>
            )}
          </aside>
        </div>

        {state.targeting === "hero" && (
          <div className="rounded-[16px] border border-magenta/40 bg-night-2 p-2.5 lg:hidden">
            <p className="mb-2 text-xs text-muted">Choose a friend</p>
            <div className="flex flex-wrap gap-2">
              {state.players.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    sfx.heart();
                    state.pickTargetHero(p.id);
                  }}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-3 text-xs font-bold"
                >
                  <img src={heroDef(p.id).portrait} alt="" className="size-7 rounded-full object-cover" />
                  {heroDef(p.id).name}
                </button>
              ))}
              <button type="button" onClick={state.cancelTarget} className="h-11 rounded-full px-3 text-xs text-muted">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="no-scrollbar flex gap-2 overflow-x-auto snap-x snap-mandatory pb-1 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {HERO_ORDER.map((id) => {
            const p = state.players.find((x) => x.id === id);
            if (!p) return null;
            return (
              <HeroDock
                key={id}
                player={p}
                active={state.turn === id}
                canAct={humanTurn && id === state.human}
                onAbility={() => {
                  sfx.magic();
                  state.startAbility();
                }}
                onCard={(c) => {
                  sfx.click();
                  state.startCard(c);
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-night/95 px-3 py-2 sm:hidden">
        {rollControl}
        {(humanTurn && (canFeedChip(state, state.human) || (me && TILES[me.position] === "fold"))) && (
          <div className="mt-2 flex gap-2 overflow-x-auto">{extras}</div>
        )}
      </div>

      <SiteNav className="shrink-0" />
    </div>
  );
}

function snap(s: { players?: { id: HeroId; position: number }[] }) {
  const base: Record<HeroId, number> = {
    princess: 0,
    knight: 0,
    sae: 0,
    steven: 0,
  };
  for (const p of s.players ?? []) base[p.id] = p.position;
  return base;
}
