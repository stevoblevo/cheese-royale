import { TILES, TILE_LABEL, tilePos } from "@/game/board";
import { HERO_ORDER } from "@/game/heroes";
import type { HeroId, TileKind } from "@/game/types";
import { cn } from "@/lib/utils";

const TOKEN_RING: Record<HeroId, string> = {
  princess: "ring-magenta",
  knight: "ring-cyan",
  sae: "ring-magenta",
  steven: "ring-mint",
};

const TOKEN_SRC: Record<HeroId, string> = {
  princess: "/art/princess.jpg",
  knight: "/art/knight.jpg",
  sae: "/art/sae.jpg",
  steven: "/art/steven.jpg",
};

const GEM: Record<TileKind, string> = {
  gate: "#e8c36a",
  home: "#c4a574",
  cheese: "#f0c14a",
  extra: "#ffe08a",
  heart: "#f25db8",
  trap: "#c45b6a",
  rain: "#4ad4e8",
  card: "#c9a6ff",
  giggle: "#4eecc0",
  crown: "#e8c36a",
  fold: "#c4a06a",
};

const TILE_PIC: Partial<Record<TileKind, string>> = {
  cheese: "/art/cheese.jpg",
  extra: "/art/cheese.jpg",
  home: "/art/home.jpg",
  gate: "/art/castle.jpg",
  crown: "/art/crown.jpg",
  fold: "/art/cardboard.jpg",
  card: "/art/boots.jpg",
  heart: "/art/princess.jpg",
};

const MARK: Record<TileKind, string> = {
  gate: "⌂",
  home: "⌂",
  cheese: "●",
  extra: "◆",
  heart: "♥",
  trap: "!",
  rain: "◌",
  card: "?",
  giggle: "~",
  crown: "✦",
  fold: "▤",
};

export function BoardView({
  positions,
  turn,
  chipAt,
  chipAte,
  targetingTile,
  onPickTile,
  fit = false,
}: {
  positions: Record<HeroId, number>;
  turn: HeroId;
  chipAt: number;
  chipAte: boolean;
  targetingTile: boolean;
  onPickTile?: (i: number) => void;
  fit?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full overflow-hidden rounded-[22px] border border-gold/20 p-[2.2%] sm:rounded-[28px]",
        fit ? "max-w-none" : "max-w-[680px]",
      )}
      style={{
        background:
          "radial-gradient(ellipse at 50% 42%, rgba(20,16,12,0.15), rgba(7,10,14,0.55)), linear-gradient(165deg, #4a2e1c 0%, #23150e 48%, #140c08 100%)",
        boxShadow: "inset 0 1px 0 rgba(232,195,106,0.18), 0 24px 50px rgba(0,0,0,0.45)",
      }}
    >
      <div className="absolute inset-[19%] overflow-hidden rounded-[18px] border border-gold/35 shadow-(--shadow-glow-gold) sm:rounded-[22px]">
        <img
          src="/art/castle.jpg"
          alt="Cheese Castle"
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-night/80 to-transparent px-2 py-1.5 text-center sm:py-2">
          <p className="font-display text-[9px] tracking-[0.28em] text-gold uppercase sm:text-[11px]">
            Cheese Castle
          </p>
        </div>
      </div>

      {TILES.map((kind, i) => {
        const { x, y } = tilePos(i);
        const here = HERO_ORDER.filter((id) => positions[id] === i);
        const chipHere = chipAt === i;
        const numbered = i % 4 === 0 || kind === "gate" || kind === "crown" || kind === "home";
        const pic = TILE_PIC[kind];
        return (
          <button
            key={i}
            type="button"
            disabled={!targetingTile}
            onClick={() => onPickTile?.(i)}
            title={`${i + 1}. ${TILE_LABEL[kind]}`}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[4px] border p-0 sm:rounded-[6px]",
              targetingTile ? "border-gold ring-2 ring-gold/70" : "border-black/50",
            )}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: "7.1%",
              height: "7.1%",
              background: pic
                ? `linear-gradient(180deg, rgba(10,8,6,0.15), rgba(10,8,6,0.55)), url(${pic}) center/cover`
                : kind === "home"
                  ? `linear-gradient(180deg, rgba(196,165,116,0.35), #1a140f 80%), url(/art/home.jpg) center/cover`
                  : `linear-gradient(180deg, ${GEM[kind]} 0%, #1a140f 72%)`,
              boxShadow: targetingTile
                ? "0 0 14px rgba(232,195,106,0.55)"
                : "inset 0 1px 0 rgba(255,255,255,0.16)",
            }}
          >
            <span
              className="grid h-full w-full place-items-center font-display text-[8px] leading-none sm:text-[10px]"
              style={{ color: kind === "cheese" || kind === "extra" ? "#fff4d4" : "#f3ead8" }}
            >
              {numbered ? i + 1 : pic ? "" : MARK[kind]}
            </span>
            <span className="sr-only">{TILE_LABEL[kind]}</span>
            {chipHere && (
              <img
                src="/art/chip.jpg"
                alt="Chip"
                className={`absolute -right-1 -top-2 z-20 size-[22px] rounded-full object-cover ring-2 ring-gold sm:size-[26px] ${chipAte ? "scale-110" : ""}`}
              />
            )}
            {here.length > 0 && (
              <span className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-[70%]">
                {here.map((id, idx) => (
                  <img
                    key={id}
                    src={TOKEN_SRC[id]}
                    alt=""
                    className={cn(
                      "size-[18px] rounded-full object-cover ring-2 sm:size-[22px]",
                      TOKEN_RING[id],
                      id === turn && "scale-110",
                    )}
                    style={{ marginLeft: idx === 0 ? 0 : -7, zIndex: 5 - idx }}
                  />
                ))}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
