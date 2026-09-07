import { useState } from "react";
import { Images } from "lucide-react";
import { sfx, unlockAudio } from "@/game/audio";
import { useGame } from "@/game/store";
import { cn } from "@/lib/utils";
import { SiteNav } from "./SiteNav";

const FACES = [
  { id: "freppy", src: "/art/freppy.jpg", name: "Freppy", offer: "A clover, and cheese." },
  { id: "princess", src: "/art/princess.jpg", name: "Princess", offer: "A bloom, held out." },
  { id: "knight", src: "/art/knight.jpg", name: "Knight", offer: "A watch, not a wall." },
  { id: "sae", src: "/art/sae.jpg", name: "Sae", offer: "A wink, then the way." },
  { id: "steven", src: "/art/steven.jpg", name: "Steven", offer: "Cheese first. Always." },
  { id: "chip", src: "/art/chip.jpg", name: "Chip", offer: "An apple, then quiet." },
  { id: "lint", src: "/art/lint.jpg", name: "Lint", offer: "A leftover, unfolded." },
  { id: "cheese", src: "/art/cheese.jpg", name: "Cheese", offer: "Shared is still cheese." },
] as const;

const REPLY: Record<string, string> = {
  freppy: "steven",
  steven: "freppy",
  princess: "knight",
  knight: "princess",
  sae: "lint",
  chip: "cheese",
  lint: "sae",
  cheese: "chip",
};

export function PicBing() {
  const [offered, setOffered] = useState<string | null>(null);
  const [reply, setReply] = useState<string | null>(null);
  const startKid = useGame((s) => s.startKid);
  const startCine = useGame((s) => s.startCine);
  const human = useGame((s) => s.human);

  const offerFace = FACES.find((f) => f.id === offered);
  const replyFace = FACES.find((f) => f.id === reply);

  function give(id: string) {
    unlockAudio();
    sfx.click();
    setOffered(id);
    setReply(null);
    window.setTimeout(() => {
      sfx.whisper();
      setReply(REPLY[id] ?? "sae");
    }, 380);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-night text-ink">
      <header className="flex items-start justify-between gap-3 px-4 pt-[max(12px,env(safe-area-inset-top))] pb-1 sm:px-6">
        <div className="min-w-0">
          <p className="font-display text-[11px] tracking-[0.28em] text-gold uppercase">
            /bing
          </p>
          <h1 className="mt-1 font-display text-[1.75rem] leading-none tracking-[-0.03em] sm:text-3xl">
            Pic for pic
          </h1>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold/30 bg-night-2 text-gold">
          <Images className="size-5" />
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pt-2 pb-nav sm:px-6">
        <p className="text-sm leading-relaxed text-muted">
          Say <span className="text-gold">pic for pic</span>. You show one. Sae
          shows one back. Nothing taken.
        </p>

        {offerFace && replyFace ? (
          <div className="mt-4 grid grid-cols-2 gap-3 anim-pop">
            <figure className="overflow-hidden rounded-[22px] border border-gold/35 bg-night-2">
              <img
                src={offerFace.src}
                alt={offerFace.name}
                className="aspect-square w-full object-cover"
              />
              <figcaption className="px-3 py-2.5">
                <p className="font-display text-sm text-gold">You · {offerFace.name}</p>
                <p className="mt-0.5 text-xs leading-snug text-muted">{offerFace.offer}</p>
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-[22px] border border-magenta/35 bg-night-2">
              <img
                src={replyFace.src}
                alt={replyFace.name}
                className="aspect-square w-full object-cover"
              />
              <figcaption className="px-3 py-2.5">
                <p className="font-display text-sm text-magenta">Sae · {replyFace.name}</p>
                <p className="mt-0.5 text-xs leading-snug text-muted">{replyFace.offer}</p>
              </figcaption>
            </figure>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {FACES.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => give(f.id)}
                className={cn(
                  "min-h-11 overflow-hidden rounded-[18px] border bg-night-2 text-left transition-transform duration-150 active:scale-[0.97]",
                  offered === f.id ? "border-gold ring-2 ring-gold/60" : "border-border",
                )}
              >
                <img src={f.src} alt="" className="aspect-square w-full object-cover" />
                <span className="block px-2 py-1.5 font-display text-xs text-ink">
                  {f.name}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2 pt-6">
          {reply && (
            <button
              type="button"
              onClick={() => {
                setOffered(null);
                setReply(null);
              }}
              className="h-12 min-h-11 rounded-[16px] border border-border text-sm font-bold active:scale-[0.98]"
            >
              Offer another
            </button>
          )}
          {(offered === "freppy" || reply === "freppy") && (
            <button
              type="button"
              onClick={() => {
                unlockAudio();
                sfx.whisper();
                startCine();
              }}
              className="h-12 min-h-11 rounded-[16px] border border-mint/40 text-sm font-bold text-mint active:scale-[0.98]"
            >
              Find Freppy
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              unlockAudio();
              sfx.magic();
              startKid(human);
            }}
            className="h-12 min-h-11 rounded-[16px] bg-gold text-sm font-extrabold text-night shadow-(--shadow-glow-gold) active:scale-[0.98]"
          >
            Sit at the table
          </button>
        </div>
      </main>

      <SiteNav className="fixed inset-x-0 bottom-0" />
    </div>
  );
}
