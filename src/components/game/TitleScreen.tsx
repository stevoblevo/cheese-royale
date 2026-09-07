import { useState } from "react";
import { Crown, Dices, FoldVertical, Images, MoonStar, Sparkles, Smile, Clover } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { COLOR_AUTHORITY, HEROES } from "@/game/heroes";
import { FRIEND_LIFE } from "@/game/friendLife";
import { unlockAudio, sfx } from "@/game/audio";
import { useGame } from "@/game/store";
import type { HeroId } from "@/game/types";
import { FriendLifeCard } from "./FriendLifeCard";
import { SiteNav } from "./SiteNav";
import { cn } from "@/lib/utils";

const DEST = [
  { cmd: "/play", label: "Table", icon: Dices },
  { cmd: "/listen", label: "Listen", icon: MoonStar },
  { cmd: "/fold", label: "Fold", icon: FoldVertical },
  { cmd: "/bing", label: "Pic for pic", icon: Images, accent: true },
] as const;

const RING: Record<HeroId, string> = {
  princess: "ring-magenta/80",
  knight: "ring-cyan/80",
  sae: "ring-magenta/70",
  steven: "ring-mint/80",
};

function isBing(cmd: string) {
  const c = cmd.trim().toLowerCase().replace(/\s+/g, " ");
  return (
    c === "/bing" ||
    c === "bing" ||
    c === "/pic" ||
    c === "pic" ||
    c === "pic for pic" ||
    c === "/pic for pic" ||
    c === "picforpic"
  );
}

export function TitleScreen() {
  const startKid = useGame((s) => s.setScreen);
  const startListen = useGame((s) => s.startListen);
  const startFold = useGame((s) => s.startFold);
  const startCine = useGame((s) => s.startCine);
  const startBing = useGame((s) => s.startBing);
  const startTable = useGame((s) => s.startKid);
  const human = useGame((s) => s.human);
  const choose = useGame((s) => s.chooseHero);
  const { isPending } = useCurrentUserState();
  const living = FRIEND_LIFE[0]!;
  const [open, setOpen] = useState(false);
  const [wink, setWink] = useState(false);
  const [typed, setTyped] = useState("");

  function partVeil() {
    unlockAudio();
    sfx.whisper();
    setOpen(true);
  }

  function run(cmd: string) {
    const c = cmd.trim().toLowerCase();
    unlockAudio();
    if (c === "/wink" || c === "wink") {
      sfx.magic();
      setWink(true);
      window.setTimeout(() => setWink(false), 800);
      return;
    }
    if (c === "/dream" || c === "/listen" || c === "listen") {
      sfx.whisper();
      startListen();
      return;
    }
    if (c === "/fold" || c === "fold") {
      sfx.click();
      startFold("title");
      return;
    }
    if (isBing(c)) {
      sfx.whisper();
      startBing();
      return;
    }
    if (c === "/board" || c === "/cine" || c === "/freppy" || c === "freppy" || c === "green" || c === "green player") {
      sfx.whisper();
      startCine();
      return;
    }
    sfx.magic();
    startKid("select");
  }

  function goSelect() {
    unlockAudio();
    sfx.click();
    startKid("select");
  }

  function sitNow() {
    unlockAudio();
    sfx.magic();
    startTable(human);
  }

  return (
    <div className={cn("relative min-h-dvh overflow-x-clip bg-night text-ink", wink && "wink-flash")}>
      {open ? (
        <img
          src="/art/cinematic-open.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : (
        <>
          <video
            className="absolute inset-0 h-full w-full object-cover object-center"
            src="/art/cinematic-veil.mp4"
            poster="/art/cinematic-veil.jpg"
            autoPlay
            muted
            loop
            playsInline
          />
          <img
            src="/art/her-aesthete.jpg"
            alt=""
            className="pointer-events-none absolute right-[-8%] bottom-[-6%] h-[52%] w-auto object-cover opacity-90 sm:right-[6%] sm:bottom-0 sm:h-[78%]"
          />
        </>
      )}
      <div className="absolute inset-0 bg-linear-to-b from-night/30 via-night/25 to-night/88" />

      <header className="site-chrome relative z-40 mx-3 mt-[max(10px,env(safe-area-inset-top))] flex items-center gap-2 rounded-full border border-border bg-night/70 px-3 py-1.5 sm:mx-6">
        <span className="size-2 shrink-0 rounded-full bg-mint shadow-(--shadow-glow-gold)" />
        <p className="min-w-0 flex-1 truncate font-display text-[11px] tracking-[0.18em] text-gold uppercase">
          <span className="sm:hidden">Cheese Royale</span>
          <span className="hidden sm:inline">her.veil / threshold · cheese royale</span>
        </p>
        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="h-7 w-7 animate-pulse rounded-full bg-ink/10" />
          ) : (
            <>
              <SignedOut>
                <a
                  href="/login"
                  className="inline-flex h-11 items-center rounded-full px-3 text-[11px] text-muted hover:text-ink"
                >
                  Sign in
                </a>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </>
          )}
        </div>
      </header>

      {!open ? (
        <main className="relative z-40 flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-center px-5 text-center">
          <p className="font-display text-[11px] tracking-[0.32em] text-gold uppercase">
            Permission veil
          </p>
          <h1 className="mt-4 font-display text-4xl leading-none tracking-[-0.03em] sm:text-6xl">
            She kept
            <br />
            a threshold
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            A site for her, and for the ones who already love her. Part the veil.
            The table is set. Open to all. Cheers.
          </p>
          <button
            type="button"
            onClick={partVeil}
            className="mt-8 inline-flex h-12 min-h-11 min-w-44 items-center justify-center rounded-[18px] bg-gold px-8 text-sm font-extrabold text-night shadow-(--shadow-glow-gold) transition-transform duration-150 active:scale-[0.98]"
          >
            Part the veil
          </button>
          <p className="mt-4 text-[11px] tracking-[0.2em] text-muted uppercase">
            Gold is offered · never taken
          </p>
        </main>
      ) : (
        <>
          <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-4 pb-nav pt-5 sm:min-h-[calc(100dvh-4.5rem)] sm:justify-end sm:px-8 sm:pb-8 sm:pt-10">
            <div className="mb-3 flex items-center gap-2 text-gold anim-pop">
              <Crown className="size-5" strokeWidth={1.6} />
              <span className="font-display text-xs tracking-[0.32em] uppercase">
                Threshold open · her site
              </span>
            </div>
            <h1 className="font-display text-4xl leading-[0.95] tracking-[-0.03em] sm:text-7xl">
              Cheese
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              Royale
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:mt-4 sm:text-base">
              Fun first. Pick a face. Sit the table. Say pic for pic — /bing.
              Freppy, the green player, waits at /freppy. Open to all. Cheers.
            </p>

            <form
              className="mt-4 flex max-w-md gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                run(typed || "/play");
                setTyped("");
              }}
            >
              <input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Say pic for pic · /bing"
                enterKeyHint="go"
                autoCapitalize="none"
                autoCorrect="off"
                className="h-12 min-h-11 min-w-0 flex-1 rounded-[16px] border border-border bg-night-2/80 px-4 text-base text-ink outline-none placeholder:text-muted focus:border-gold/50 sm:text-sm"
              />
              <button
                type="submit"
                className="h-12 min-h-11 shrink-0 rounded-[16px] bg-gold px-4 text-sm font-extrabold text-night active:scale-[0.98]"
              >
                Go
              </button>
            </form>

            <ul className="mt-3 grid grid-cols-2 gap-2 sm:max-w-xl sm:grid-cols-4">
              {DEST.map((d) => {
                const Icon = d.icon;
                const accent = "accent" in d && d.accent;
                return (
                  <li key={d.cmd}>
                    <button
                      type="button"
                      onClick={() => run(d.cmd)}
                      className={cn(
                        "flex min-h-14 w-full items-center gap-2.5 rounded-[16px] border px-3 py-2 text-left backdrop-blur-sm transition-transform duration-150 active:scale-[0.97]",
                        accent
                          ? "border-gold/40 bg-gold/10"
                          : "border-border bg-night-2/75",
                      )}
                    >
                      <Icon
                        className={cn("size-4 shrink-0", accent ? "text-gold" : "text-muted")}
                      />
                      <span className="min-w-0">
                        <span className="block font-display text-[11px] tracking-wider text-gold">
                          {d.cmd}
                        </span>
                        <span className="block truncate text-xs font-bold text-ink">{d.label}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={() => run("/freppy")}
              className="mt-2 flex min-h-14 w-full max-w-md items-center gap-3 rounded-[16px] border border-mint/40 bg-night-2/80 px-3 py-2 text-left backdrop-blur-sm transition-transform duration-150 active:scale-[0.97]"
            >
              <img
                src="/art/freppy.jpg"
                alt=""
                className="size-11 shrink-0 rounded-[12px] object-cover ring-2 ring-mint/70"
              />
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[11px] tracking-wider text-mint">
                  /freppy
                </span>
                <span className="block truncate text-sm font-bold text-ink">
                  Freppy · green player
                </span>
              </span>
              <Clover className="size-4 shrink-0 text-mint" />
            </button>

            <button
              type="button"
              onClick={() => run("/wink")}
              className="mt-2 inline-flex h-11 items-center gap-2 self-start rounded-full border border-magenta/30 bg-night-2/75 px-3.5 text-xs font-bold text-magenta active:scale-[0.97]"
            >
              <Smile className="size-3.5" />
              /wink
            </button>

            <div className="mt-4 grid grid-cols-4 gap-2 sm:hidden">
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
                      "min-h-11 overflow-hidden rounded-[16px] border bg-night-2 text-left transition-transform duration-150 active:scale-[0.97]",
                      on ? `border-transparent ring-2 ${RING[h.id]}` : "border-border",
                    )}
                  >
                    <img src={h.portrait} alt={h.name} className="aspect-square w-full object-cover" />
                    <span className="block truncate px-1.5 py-1 font-display text-[10px] text-ink">
                      {h.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:mt-7 sm:flex-row sm:items-center sm:gap-3">
              <button
                type="button"
                onClick={sitNow}
                className="inline-flex h-12 min-h-11 items-center justify-center gap-2 rounded-[18px] bg-gold px-6 text-sm font-extrabold text-night shadow-(--shadow-glow-gold) transition-transform duration-150 active:scale-[0.98] sm:hidden"
              >
                <Sparkles className="size-4" />
                Sit at the table
              </button>
              <button
                type="button"
                onClick={goSelect}
                className="hidden h-12 min-h-11 items-center justify-center gap-2 rounded-[18px] bg-gold px-6 text-sm font-extrabold text-night shadow-(--shadow-glow-gold) transition-transform duration-150 active:scale-[0.98] sm:inline-flex"
              >
                <Sparkles className="size-4" />
                Sit at the table
              </button>
            </div>

            <div className="mt-5 hidden max-w-md sm:block">
              <FriendLifeCard card={living} compact />
            </div>

            <ul className="mt-6 hidden grid-cols-1 gap-2 sm:grid sm:grid-cols-5">
              {COLOR_AUTHORITY.map((c) => (
                <li
                  key={c.name}
                  className="flex items-center gap-3 rounded-[14px] border border-border bg-night-2/70 px-3 py-2.5 backdrop-blur-sm"
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: c.swatch, boxShadow: `0 0 10px ${c.swatch}` }}
                  />
                  <span>
                    <span className="block text-xs font-bold text-ink">{c.name}</span>
                    <span className="block text-[11px] text-muted">{c.meaning}</span>
                  </span>
                </li>
              ))}
            </ul>
          </main>
          <SiteNav className="fixed inset-x-0 bottom-0 sm:hidden" />
        </>
      )}
    </div>
  );
}
