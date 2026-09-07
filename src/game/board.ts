import type { TileKind } from "./types";
import { BOARD_SIZE } from "./types";

export const TILES: TileKind[] = [
  "gate",
  "cheese",
  "cheese",
  "heart",
  "cheese",
  "trap",
  "cheese",
  "card",
  "extra",
  "cheese",
  "rain",
  "cheese",
  "giggle",
  "cheese",
  "trap",
  "card",
  "fold",
  "home",
  "heart",
  "extra",
  "trap",
  "cheese",
  "card",
  "cheese",
  "rain",
  "cheese",
  "heart",
  "trap",
  "cheese",
  "extra",
  "giggle",
  "crown",
];

if (TILES.length !== BOARD_SIZE) {
  throw new Error("Board length mismatch");
}

export const TILE_LABEL: Record<TileKind, string> = {
  gate: "Castle gate",
  home: "Home",
  cheese: "Cheese",
  extra: "Extra cheese",
  heart: "Heart",
  trap: "Silly trap",
  rain: "Cheese rain",
  card: "Draw a card",
  giggle: "Giggle",
  crown: "Crown path",
  fold: "Leftover fold",
};

export const TILE_TINT: Record<TileKind, string> = {
  gate: "var(--color-gold)",
  home: "#c4a574",
  cheese: "#f0c14a",
  extra: "#f6d56b",
  heart: "var(--color-magenta)",
  trap: "var(--color-trap)",
  rain: "var(--color-cyan)",
  card: "#c9a6ff",
  giggle: "var(--color-mint)",
  crown: "var(--color-gold)",
  fold: "#c4a06a",
};

/** Square path, 8 tiles per side. Percentages inside a square board. */
export function tilePos(index: number): { x: number; y: number } {
  const side = 8;
  const inset = 6.5;
  const span = 87;
  const t = ((index % BOARD_SIZE) + BOARD_SIZE) % BOARD_SIZE;
  const s = Math.floor(t / side);
  const k = t % side;
  const p = k / (side - 1);
  if (s === 0) return { x: inset + p * span, y: inset + span };
  if (s === 1) return { x: inset + span, y: inset + span - p * span };
  if (s === 2) return { x: inset + span - p * span, y: inset };
  return { x: inset, y: inset + p * span };
}

export function nextIndex(from: number, steps: number) {
  return (((from + steps) % BOARD_SIZE) + BOARD_SIZE) % BOARD_SIZE;
}

export function wraps(from: number, steps: number) {
  return from + steps >= BOARD_SIZE;
}
