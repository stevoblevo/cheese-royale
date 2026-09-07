import { Dices, FoldVertical, Home, Images, MoonStar } from "lucide-react";
import { unlockAudio, sfx } from "@/game/audio";
import { useGame } from "@/game/store";
import type { NavDest } from "@/game/types";
import { cn } from "@/lib/utils";

const TABS: {
  dest: NavDest;
  label: string;
  aria: string;
  icon: typeof Home;
  active: (screen: string) => boolean;
}[] = [
  {
    dest: "title",
    label: "Home",
    aria: "Home",
    icon: Home,
    active: (s) => s === "title" || s === "won",
  },
  {
    dest: "table",
    label: "Table",
    aria: "Table",
    icon: Dices,
    active: (s) => s === "select" || s === "play",
  },
  {
    dest: "listen",
    label: "Listen",
    aria: "Listen",
    icon: MoonStar,
    active: (s) => s === "listen",
  },
  {
    dest: "fold",
    label: "Fold",
    aria: "Fold",
    icon: FoldVertical,
    active: (s) => s === "fold",
  },
  {
    dest: "bing",
    label: "Pic",
    aria: "Pic for pic, slash bing",
    icon: Images,
    active: (s) => s === "bing",
  },
];

export function SiteNav({ className }: { className?: string }) {
  const screen = useGame((s) => s.screen);
  const goNav = useGame((s) => s.goNav);

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "site-nav z-40 border-t border-border bg-night/96 backdrop-blur-md",
        className,
      )}
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5 px-1">
        {TABS.map((tab) => {
          const on = tab.active(screen);
          const Icon = tab.icon;
          return (
            <li key={tab.dest}>
              <button
                type="button"
                aria-label={tab.aria}
                aria-current={on ? "page" : undefined}
                onClick={() => {
                  unlockAudio();
                  sfx.click();
                  goNav(tab.dest);
                }}
                className={cn(
                  "relative flex h-14 w-full min-h-11 flex-col items-center justify-center gap-0.5 text-[10px] font-bold tracking-wide uppercase transition-colors duration-150 active:scale-[0.96]",
                  on ? "text-gold" : "text-muted",
                )}
              >
                {on && (
                  <span
                    aria-hidden
                    className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-gold"
                  />
                )}
                <Icon className="size-5" strokeWidth={on ? 2.3 : 1.7} />
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
