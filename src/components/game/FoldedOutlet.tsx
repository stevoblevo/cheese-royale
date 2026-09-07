import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Cable, FoldVertical, Lightbulb, RotateCw } from "lucide-react";
import { HAZARD_CELL, OUTLET_CELL, POWER_CELL, cellXY } from "@/game/fold";
import { sfx, unlockAudio } from "@/game/audio";
import { useGame } from "@/game/store";
import { SiteNav } from "./SiteNav";

const CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export function FoldedOutlet() {
  const fold = useGame((s) => s.fold);
  const drag = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(null);
  const [floorReady, setFloorReady] = useState(false);
  const openTimer = useRef<number>(0);

  useEffect(() => {
    window.clearTimeout(openTimer.current);
    if (fold.open) {
      openTimer.current = window.setTimeout(() => setFloorReady(true), 760);
    } else {
      setFloorReady(false);
    }
    return () => window.clearTimeout(openTimer.current);
  }, [fold.open]);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, yaw: fold.yaw, pitch: fold.pitch };
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    useGame.getState().foldLook(drag.current.yaw + dx * 0.4, drag.current.pitch - dy * 0.25);
  }
  function onPointerUp() {
    drag.current = null;
  }

  async function handleUnfold() {
    unlockAudio();
    sfx.whisper();
    const wasOpen = useGame.getState().fold.open;
    useGame.getState().foldToggle();
    if (!wasOpen) {
      const start = useGame.getState().fold.yaw;
      const dest = start + 46;
      const t0 = performance.now();
      const spin = (now: number) => {
        const u = Math.min(1, (now - t0) / 720);
        const eased = 1 - (1 - u) ** 3;
        useGame.getState().foldLook(start + (dest - start) * eased, 22);
        if (u < 1) requestAnimationFrame(spin);
      };
      requestAnimationFrame(spin);
    }
  }

  const lint = cellXY(fold.lintAt);
  const opening = fold.open && !floorReady;
  const hint = fold.lit
    ? "Power holds. The leftover is a room again."
    : opening
      ? "The leftover is opening…"
      : !fold.open
        ? "The outlet is folded. Unfold first — then the floor."
        : fold.carrying
          ? "Cable in hand. Walk Lint to the back wall. Connect."
          : "Walk Lint to the power box. Pick up the cable.";

  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip bg-night text-ink">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(232,195,106,0.16), transparent 55%), #071018",
        }}
      />

      <header className="relative z-20 flex items-center justify-between gap-3 px-4 pt-[max(10px,env(safe-area-inset-top))] sm:px-8">
        <div>
          <p className="font-display text-[10px] tracking-[0.22em] text-gold uppercase">
            Folded Outlet
          </p>
          <p className="text-xs text-muted">Bedroom leftover · Lint</p>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-3 pb-nav">
        <p className="mb-2 max-w-md text-center text-sm text-muted">{hint}</p>

        <div
          className="fold-scene touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="fold-scale">
            <div
              className="fold-room"
              style={{
                transform: `rotateX(${fold.pitch}deg) rotateY(${fold.yaw}deg)`,
              }}
            >
              <Face
                name="floor"
                transform={
                  fold.open
                    ? "rotateX(90deg) translateZ(-140px)"
                    : "rotateX(90deg) translateZ(-28px) scale(0.42)"
                }
              >
                <div className="grid h-full w-full grid-cols-3 grid-rows-3">
                  {CELLS.map((i) => (
                    <div
                      key={i}
                      className="relative border border-night/20"
                      style={{
                        background:
                          i === HAZARD_CELL
                            ? "rgba(196,91,106,0.45)"
                            : i % 2
                              ? "rgba(196,160,106,0.28)"
                              : "rgba(90,62,36,0.35)",
                      }}
                    >
                      {i === POWER_CELL && (
                        <span className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-[4px] bg-gold/80 shadow-(--shadow-glow-gold)" />
                      )}
                    </div>
                  ))}
                </div>
                {(fold.carrying || fold.connected) && (
                  <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100">
                    <path
                      className={fold.connected ? "cable-draw" : ""}
                      d="M22 78 C 28 60, 48 52, 50 22"
                      fill="none"
                      stroke={fold.connected ? "#e8c36a" : "#8a6a3a"}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                <img
                  src="/art/lint.jpg"
                  alt="Lint"
                  className="lint-walk pointer-events-none absolute size-16 rounded-[8px] object-cover shadow-lg"
                  style={{
                    left: `calc(50% + ${lint.x * 33}%)`,
                    top: `calc(50% + ${lint.y * 33}%)`,
                    transform: "translate(-50%, -70%)",
                    opacity: fold.open ? 1 : 0.35,
                  }}
                />
              </Face>
              <Face
                name="back"
                transform={
                  fold.open ? "translateZ(-140px)" : "translateZ(-28px) rotateY(180deg) scale(0.42)"
                }
              >
                <OutletLit on={fold.lit} />
              </Face>
              <Face
                name="front"
                transform={
                  fold.open
                    ? "rotateY(180deg) translateZ(-140px)"
                    : "translateZ(28px) scale(0.42)"
                }
              />
              <Face
                name="left"
                transform={
                  fold.open
                    ? "rotateY(-90deg) translateZ(-140px)"
                    : "rotateY(-90deg) translateZ(-28px) scale(0.42)"
                }
              />
              <Face
                name="right"
                transform={
                  fold.open
                    ? "rotateY(90deg) translateZ(-140px)"
                    : "rotateY(90deg) translateZ(-28px) scale(0.42)"
                }
              >
                <span className="absolute right-6 top-8 rotate-6 rounded-[4px] border border-night/40 bg-[#c9a24a] px-2 py-1 font-display text-[10px] tracking-widest text-night">
                  CAUTION
                </span>
              </Face>
              {fold.lit && (
                <div
                  className="absolute left-1/2 top-0 size-8 -translate-x-1/2 -translate-y-10 rounded-full bg-gold blur-[1px]"
                  style={{
                    transform: "translateZ(20px)",
                    boxShadow: "0 0 40px rgba(232,195,106,0.8)",
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {floorReady && !fold.lit && (
          <div className="mt-3 grid w-full max-w-xs grid-cols-3 gap-2 anim-pop">
            {CELLS.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  unlockAudio();
                  useGame.getState().foldStep(i);
                  if (i === HAZARD_CELL) sfx.trap();
                  else sfx.click();
                }}
                className="grid aspect-square min-h-14 w-full place-items-center rounded-[14px] border text-[11px] font-bold uppercase tracking-wider"
                style={{
                  borderColor:
                    fold.lintAt === i
                      ? "var(--color-gold)"
                      : i === HAZARD_CELL
                        ? "var(--color-trap)"
                        : "var(--color-border)",
                  background:
                    fold.lintAt === i
                      ? "rgba(232,195,106,0.2)"
                      : i === POWER_CELL
                        ? "rgba(232,195,106,0.12)"
                        : i === OUTLET_CELL
                          ? "rgba(74,212,232,0.12)"
                          : "rgba(13,24,36,0.8)",
                  color: "var(--color-ink)",
                }}
              >
                {i === fold.lintAt
                  ? "Lint"
                  : i === POWER_CELL
                    ? "Box"
                    : i === OUTLET_CELL
                      ? "Out"
                      : i === HAZARD_CELL
                        ? "Zap"
                        : ""}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex w-full max-w-md flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => void handleUnfold()}
            className="inline-flex h-12 min-w-28 flex-1 items-center justify-center gap-2 rounded-[16px] border border-gold/30 bg-night-2 px-4 text-sm font-bold"
          >
            <FoldVertical className="size-4 text-gold" />
            {fold.open ? "Fold" : "Unfold"}
          </button>
          <button
            type="button"
            onClick={() => useGame.getState().foldLook(fold.yaw + 28, fold.pitch)}
            className="inline-flex h-12 min-w-24 items-center justify-center gap-2 rounded-[16px] border border-border bg-night-2 px-4 text-sm font-bold"
          >
            <RotateCw className="size-4" />
            Turn
          </button>
          <button
            type="button"
            disabled={!floorReady || fold.lit}
            onClick={() => {
              unlockAudio();
              const before = useGame.getState().fold;
              useGame.getState().foldAct();
              const after = useGame.getState().fold;
              if (after.lit && !before.lit) sfx.win();
              else if (after.carrying && !before.carrying) sfx.magic();
              else sfx.click();
            }}
            className="inline-flex h-12 min-w-32 flex-1 items-center justify-center gap-2 rounded-[16px] bg-gold px-4 text-sm font-extrabold text-night disabled:bg-night-3 disabled:text-muted"
          >
            {fold.carrying ? <Cable className="size-4" /> : <Lightbulb className="size-4" />}
            {fold.carrying ? "Connect" : fold.lit ? "Lit" : "Take cable"}
          </button>
        </div>

        {fold.lit && (
          <aside className="mt-4 max-w-md rounded-[20px] border border-gold/30 bg-night-2/90 p-4 text-left anim-pop">
            <p className="font-display text-[10px] tracking-[0.22em] text-gold uppercase">
              Knowledge seam
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/90">
              The leftover was the teaching. All ordeals are devised as such —
              Phyllis said the angel does not punish; the angel shows. Power
              holds. Proceed when you wish.
            </p>
          </aside>
        )}

        {fold.lit && (
          <button
            type="button"
            onClick={() => useGame.getState().leaveFold()}
            className="mt-4 h-12 w-full max-w-md rounded-[16px] border border-gold/40 px-6 text-sm font-bold text-gold anim-pop"
          >
            Proceed
          </button>
        )}
      </div>

      <SiteNav className="fixed inset-x-0 bottom-0 z-30" />
    </div>
  );
}

function Face({
  name,
  transform,
  children,
}: {
  name: string;
  transform: string;
  children?: ReactNode;
}) {
  return (
    <div
      data-face={name}
      className="fold-face"
      style={{
        transform,
        backgroundImage: "url(/art/cardboard.jpg)",
        backgroundSize: "cover",
      }}
    >
      {children}
    </div>
  );
}

function OutletLit({ on }: { on: boolean }) {
  return (
    <div className="absolute left-1/2 top-1/3 flex -translate-x-1/2 flex-col items-center gap-2">
      <div
        className="h-14 w-12 rounded-[6px] border-2 border-night/50 bg-[#d8c29a]"
        style={{ boxShadow: on ? "0 0 24px rgba(232,195,106,0.7)" : "none" }}
      >
        <div className="mx-auto mt-2 h-3 w-5 rounded-sm bg-night/50" />
        <div className="mx-auto mt-2 h-3 w-5 rounded-sm bg-night/50" />
        <div className="mx-auto mt-2 h-2 w-2 rounded-full bg-night/40" />
      </div>
      {on && <span className="font-display text-[10px] tracking-[0.2em] text-gold">ON</span>}
    </div>
  );
}
