import { useState } from "react";
import { Clover, Music, ScrollText } from "lucide-react";
import { sfx, unlockAudio } from "@/game/audio";
import { SEATS, TONE_RING, TONE_TEXT, seatDef } from "@/game/seats";
import { useGame } from "@/game/store";
import { cn } from "@/lib/utils";
import { SeatCard } from "./SeatCard";
import { SiteNav } from "./SiteNav";

const THEMES = [
  { id: "cozy", label: "Cozy", filter: "saturate(1.15) contrast(1.05)" },
  { id: "pixel", label: "Pixel", filter: "contrast(1.35) saturate(0.85) url(#none)" },
  { id: "wash", label: "Watercolor", filter: "saturate(1.2) contrast(0.9) brightness(1.08)" },
  { id: "line", label: "Line", filter: "grayscale(1) contrast(1.4)" },
  { id: "dream", label: "Dreamy", filter: "saturate(1.4) hue-rotate(-8deg) contrast(1.05)" },
] as const;

const EVENTS = [
  {
    title: "A Whisper in the Lint",
    body: "A memory stirs in the magenta glow. Optional. The leftover was never trash.",
    gift: "Gain a clover",
  },
  {
    title: "Fair thee well",
    body: "Hidden, not gone. The table remains. Chip still wants an apple. Go lightly.",
    gift: "A kind word",
  },
  {
    title: "Knowledge seam",
    body: "All ordeals are a teaching. The angel does not punish. Gold is offered.",
    gift: "Listen once more",
  },
];

const PIECES = [
  { id: "freppy", x: 50, y: 46 },
  { id: "princess", x: 48, y: 62 },
  { id: "knight", x: 64, y: 38 },
  { id: "sae", x: 34, y: 40 },
  { id: "steven", x: 72, y: 58 },
  { id: "lint", x: 28, y: 62 },
];

export function CineBoard() {
  const startListen = useGame((s) => s.startListen);
  const goNav = useGame((s) => s.goNav);
  const cinePicked = useGame((s) => s.cinePicked);
  const [theme, setTheme] = useState<(typeof THEMES)[number]["id"]>("cozy");
  const [eventI, setEventI] = useState(0);
  const [farewell, setFarewell] = useState(false);
  const [picked, setPicked] = useState<string>(cinePicked || "freppy");
  const skin = THEMES.find((t) => t.id === theme) ?? THEMES[4];
  const ev = EVENTS[eventI]!;
  const seat = seatDef(picked) ?? SEATS[0]!;

  return (
    <div className="flex min-h-dvh flex-col bg-night text-ink">
      <header className="flex items-center justify-between gap-3 px-3 pt-[max(10px,env(safe-area-inset-top))] pb-2 sm:px-6">
        <p className={cn("font-display text-[11px] tracking-[0.28em] uppercase", TONE_TEXT[seat.tone])}>
          {seat.name} · {seat.role}
        </p>
        <button
          type="button"
          onClick={() => {
            unlockAudio();
            sfx.whisper();
            setFarewell(true);
          }}
          className="grid size-11 place-items-center rounded-full border border-magenta/30 text-magenta"
          aria-label="Fair thee well"
        >
          <Clover className="size-4" />
        </button>
      </header>

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-3 sm:px-6">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              sfx.click();
              setTheme(t.id);
            }}
            className={cn(
              "h-11 shrink-0 rounded-full border px-3 text-[11px] font-bold tracking-wider uppercase",
              theme === t.id
                ? "border-gold bg-gold/15 text-gold"
                : "border-border text-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-3 px-3 pb-nav lg:grid-cols-[1fr_16rem]">
        <section className="space-y-3">
          <SeatCard seat={seat} />
          <div className="relative overflow-hidden rounded-[22px] border border-border">
            <img
              src="/art/cine-board.jpg"
              alt=""
              className="aspect-video w-full object-cover object-[50%_72%]"
              style={{ filter: `${skin.filter} brightness(1.18)` }}
            />
            {PIECES.map((p) => {
              const piece = seatDef(p.id);
              const on = picked === p.id;
              const boosted = piece?.boost;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    sfx.click();
                    setPicked(p.id);
                  }}
                  className={cn(
                    "absolute overflow-hidden rounded-full border-2 shadow-lg",
                    boosted ? "size-16 sm:size-[4.75rem]" : "size-12 sm:size-14",
                    on
                      ? TONE_RING[piece?.tone ?? "gold"]
                      : boosted
                        ? "border-mint/70"
                        : "border-night/40",
                  )}
                  style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -80%)" }}
                >
                  <img src={piece?.src ?? ""} alt={piece?.name ?? p.id} className="h-full w-full object-cover" />
                </button>
              );
            })}
            <p className="absolute bottom-3 left-3 font-display text-[10px] tracking-[0.2em] text-gold uppercase">
              Every roll · every choice · every story
            </p>
          </div>
        </section>

        <aside className="space-y-3">
          <article className="rounded-[20px] border border-gold/25 bg-night-2 p-4">
            <p className="font-display text-[10px] tracking-[0.22em] text-gold uppercase">
              Story event
            </p>
            <h2 className="mt-2 font-display text-lg text-ink">{ev.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{ev.body}</p>
            <button
              type="button"
              onClick={() => {
                unlockAudio();
                sfx.magic();
                setEventI((i) => (i + 1) % EVENTS.length);
              }}
              className="mt-3 inline-flex h-11 items-center text-xs font-bold text-magenta"
            >
              {ev.gift} · next
            </button>
          </article>

          <article className="rounded-[20px] border border-border bg-night-2 p-4">
            <p className="font-display text-[10px] tracking-[0.22em] text-gold uppercase">
              Companions
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {SEATS.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      sfx.click();
                      setPicked(s.id);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 text-left",
                      picked === s.id ? TONE_TEXT[s.tone] : "text-muted",
                    )}
                  >
                    <img src={s.src} alt="" className="size-6 rounded-full object-cover" />
                    {s.name} · {s.role.toLowerCase()}
                  </button>
                </li>
              ))}
            </ul>
          </article>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => startListen()}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-[14px] border border-border text-xs font-bold"
            >
              <Music className="size-3.5" />
              Listen
            </button>
            <button
              type="button"
              onClick={() => goNav("table")}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-[14px] bg-gold text-xs font-extrabold text-night"
            >
              <ScrollText className="size-3.5" />
              Table
            </button>
          </div>
        </aside>
      </div>

      {farewell && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-night/80 p-6 backdrop-blur-sm">
          <aside className="max-w-md rounded-[24px] border border-gold/30 bg-night-2 p-6 text-center anim-pop">
            <p className="font-display text-[11px] tracking-[0.28em] text-gold uppercase">
              Hidden · freppy
            </p>
            <h2 className="mt-3 font-display text-3xl">Fair thee well</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              The clover was never a quest. It was a wave. Go play in the hand you
              already hold. We will keep the lantern low until you come back.
            </p>
            <button
              type="button"
              onClick={() => {
                sfx.whisper();
                setFarewell(false);
                goNav("title");
              }}
              className="mt-6 h-12 rounded-[14px] bg-gold px-6 text-sm font-extrabold text-night"
            >
              Soft close
            </button>
          </aside>
        </div>
      )}

      <SiteNav className="fixed inset-x-0 bottom-0" />
    </div>
  );
}
