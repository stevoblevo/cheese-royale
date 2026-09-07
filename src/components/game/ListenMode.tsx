import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { LISTEN_COPY } from "@/game/sae";
import { sfx, unlockAudio } from "@/game/audio";
import { useGame } from "@/game/store";
import type { NearSpot } from "./ListenWalk";
import { walkInput, resetWalkInput } from "./listenInput";
import { SiteNav } from "./SiteNav";

export function ListenMode() {
  const listen = useGame((s) => s.listen);
  const listenAt = useGame((s) => s.listenAt);
  const enterDark = useGame((s) => s.enterDark);
  const enterLantern = useGame((s) => s.enterLantern);
  const takeFind = useGame((s) => s.takeFind);
  const send = useGame((s) => s.sendLetter);

  const [Walk, setWalk] = useState<null | typeof import("./ListenWalk").ListenWalk>(null);
  const [locked, setLocked] = useState(false);
  const [near, setNear] = useState<NearSpot>(null);
  const [goalsOpen, setGoalsOpen] = useState(false);
  const lookDrag = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    void import("./ListenWalk").then((m) => setWalk(() => m.ListenWalk));
    return () => resetWalkInput();
  }, []);

  const copy =
    listen.focus === "wall"
      ? LISTEN_COPY.wall
      : listen.focus === "letter"
        ? LISTEN_COPY.letter
        : listen.focus === "window"
          ? LISTEN_COPY.window
          : listen.focus === "lantern"
            ? LISTEN_COPY.lantern
            : listen.focus === "seam"
              ? LISTEN_COPY.seam
              : listen.focus === "find"
                ? LISTEN_COPY.find
                : listen.focus === "knowledge"
                  ? LISTEN_COPY.knowledge
                  : listen.sent
                    ? LISTEN_COPY.sent
                    : null;

  const canSend = listen.heard && listen.read && listen.found && !listen.sent;
  const doneCount = [listen.heard, listen.read, listen.found, listen.sent].filter(Boolean).length;

  function interact(spot: NearSpot) {
    if (!spot) return;
    unlockAudio();
    sfx.whisper();
    if (spot === "find") takeFind();
    else if (spot === "seam") {
      listenAt("seam");
      if (listen.heard) enterDark();
    } else listenAt(spot);
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (!locked) {
      setLocked(true);
      walkInput.locked = true;
      unlockAudio();
    }
    lookDrag.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!lookDrag.current) return;
    walkInput.lookX += e.clientX - lookDrag.current.x;
    walkInput.lookY += e.clientY - lookDrag.current.y;
    lookDrag.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerUp() {
    lookDrag.current = null;
  }

  return (
    <div className="relative h-dvh overflow-hidden bg-night text-ink overscroll-none">
      <div
        className="absolute inset-0 touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {Walk ? (
          <Walk
            heard={listen.heard}
            room={listen.room}
            locked={locked}
            onNear={setNear}
            onCross={(r) => {
              if (r === "dark") enterDark();
              else enterLantern();
            }}
          />
        ) : (
          <img src="/art/bedroom.jpg" alt="" className="h-full w-full object-cover" />
        )}
      </div>

      {!locked && (
        <button
          type="button"
          onClick={() => {
            setLocked(true);
            walkInput.locked = true;
            unlockAudio();
            sfx.click();
          }}
          className="absolute inset-x-4 top-[26%] z-20 mx-auto max-w-xs rounded-[20px] border border-gold/30 bg-night/80 px-5 py-4 text-center backdrop-blur-md"
        >
          <p className="font-display text-sm text-gold">Walk the room</p>
          <p className="mt-1 text-xs text-muted">Drag to look. Hold the stick to walk.</p>
        </button>
      )}

      <header className="pointer-events-none relative z-20 flex items-start justify-end px-3 pt-[max(10px,env(safe-area-inset-top))] sm:px-6">
        <button
          type="button"
          onClick={() => setGoalsOpen((v) => !v)}
          className="pointer-events-auto min-h-11 max-w-44 rounded-[16px] border border-border bg-night/70 px-3 py-2 text-right backdrop-blur-sm"
        >
          <p className="font-display text-[10px] tracking-[0.22em] text-gold uppercase">
            {doneCount}/4 · objective
          </p>
          {goalsOpen && (
            <ul className="mt-2 space-y-1 text-left text-xs text-muted">
              <li className={listen.heard ? "text-mint" : ""}>Listen at the wall</li>
              <li className={listen.read ? "text-mint" : ""}>Read the letter</li>
              <li className={listen.found ? "text-mint" : ""}>One dark find</li>
              <li className={listen.sent ? "text-mint" : ""}>Find a way to send it</li>
            </ul>
          )}
        </button>
      </header>

      <div className="pointer-events-none absolute inset-x-0 z-20 space-y-2 px-3 pt-3 sm:px-6 listen-hud">
        {copy && (
          <aside className="pointer-events-auto mx-auto max-w-lg rounded-[20px] border border-gold/25 bg-night/88 p-4 backdrop-blur-md anim-pop">
            <p className="font-display text-sm text-gold">{copy.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/90">{copy.body}</p>
            {canSend && listen.focus === "lantern" && (
              <button
                type="button"
                onClick={() => {
                  sfx.win();
                  send();
                }}
                className="mt-4 h-12 min-h-11 w-full rounded-[14px] bg-gold px-4 text-sm font-extrabold text-night"
              >
                Send the letter
              </button>
            )}
          </aside>
        )}

        {locked && near && (
          <button
            type="button"
            onClick={() => interact(near)}
            className="pointer-events-auto mx-auto flex h-12 min-h-11 min-w-40 items-center justify-center rounded-full border border-gold/40 bg-night/75 px-6 text-xs font-bold tracking-[0.18em] text-gold uppercase backdrop-blur-sm"
          >
            {near === "wall" ? "Listen" : near === "find" ? "The find" : near}
          </button>
        )}

        <div className="pointer-events-auto mx-auto flex max-w-lg items-end justify-between gap-4">
          <WalkStick />
          <p className="mb-3 hidden text-[10px] tracking-wide text-muted uppercase sm:block">
            Drag scene to look
          </p>
          <button
            type="button"
            onPointerDown={() => {
              walkInput.fy = 1;
            }}
            onPointerUp={() => {
              walkInput.fy = 0;
            }}
            onPointerCancel={() => {
              walkInput.fy = 0;
            }}
            onPointerLeave={() => {
              walkInput.fy = 0;
            }}
            className="h-16 min-h-11 min-w-28 rounded-[18px] bg-gold px-5 text-sm font-extrabold text-night shadow-(--shadow-glow-gold) sm:min-w-36"
          >
            Walk
          </button>
        </div>
      </div>

      <SiteNav className="fixed inset-x-0 bottom-0" />
    </div>
  );
}

function WalkStick() {
  const pad = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  function setFrom(e: PointerEvent<HTMLDivElement>) {
    const el = pad.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let dx = (e.clientX - cx) / (r.width / 2);
    let dy = (e.clientY - cy) / (r.height / 2);
    const m = Math.hypot(dx, dy);
    if (m > 1) {
      dx /= m;
      dy /= m;
    }
    walkInput.fx = dx;
    walkInput.fy = -dy;
    setKnob({ x: dx, y: dy });
  }

  function clear() {
    walkInput.fx = 0;
    walkInput.fy = 0;
    setKnob({ x: 0, y: 0 });
  }

  return (
    <div
      ref={pad}
      className="relative size-[5.75rem] shrink-0 touch-none rounded-full border border-border bg-night/65 backdrop-blur-sm"
      onPointerDown={(e) => {
        walkInput.locked = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        setFrom(e);
      }}
      onPointerMove={(e) => {
        if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
        setFrom(e);
      }}
      onPointerUp={clear}
      onPointerCancel={clear}
    >
      <span
        className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/90 shadow-(--shadow-glow-gold)"
        style={{
          transform: `translate(calc(-50% + ${knob.x * 24}px), calc(-50% + ${knob.y * 24}px))`,
        }}
      />
      <span className="sr-only">Move</span>
    </div>
  );
}
