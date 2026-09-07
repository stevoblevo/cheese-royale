import type { HeroId } from "./types";

export type SeatTone = "mint" | "cyan" | "magenta" | "gold" | "violet";

export interface SeatDef {
  id: string;
  name: string;
  role: string;
  line: string;
  offer: string;
  cmd: string;
  aliases: string[];
  tone: SeatTone;
  src: string;
  door: boolean;
  meet: boolean;
  boost: boolean;
  clover: boolean;
  hero?: HeroId;
}

export const SEATS: SeatDef[] = [
  {
    id: "freppy",
    name: "Freppy",
    role: "Green player",
    line: "Hidden, not gone. A clover, and cheese. Tap the mint face on the board — or say /freppy.",
    offer: "A clover, and cheese.",
    cmd: "/freppy",
    aliases: ["freppy", "green", "green player"],
    tone: "mint",
    src: "/art/freppy.jpg",
    door: true,
    meet: true,
    boost: true,
    clover: true,
  },
  {
    id: "knight",
    name: "Knight",
    role: "Shield of the table",
    line: "Bound by honor. Defend friends. Block and bash. A watch, not a wall.",
    offer: "A watch, not a wall.",
    cmd: "/knight",
    aliases: ["knight", "shield", "shield of the table"],
    tone: "cyan",
    src: "/art/knight.jpg",
    door: true,
    meet: true,
    boost: false,
    clover: false,
    hero: "knight",
  },
  {
    id: "princess",
    name: "Princess",
    role: "Heart mage",
    line: "Collect hearts. Use magic. A bloom, held out.",
    offer: "A bloom, held out.",
    cmd: "/princess",
    aliases: ["princess"],
    tone: "magenta",
    src: "/art/princess.jpg",
    door: false,
    meet: false,
    boost: false,
    clover: false,
    hero: "princess",
  },
  {
    id: "sae",
    name: "Sae",
    role: "Trickster mage",
    line: "Teleport and tease. A wink, then the way.",
    offer: "A wink, then the way.",
    cmd: "/sae",
    aliases: ["sae"],
    tone: "magenta",
    src: "/art/sae.jpg",
    door: false,
    meet: false,
    boost: false,
    clover: false,
    hero: "sae",
  },
  {
    id: "steven",
    name: "Steven",
    role: "Cheese gunner",
    line: "Aim and splat. Cheese first. Always.",
    offer: "Cheese first. Always.",
    cmd: "/steven",
    aliases: ["steven"],
    tone: "mint",
    src: "/art/steven.jpg",
    door: false,
    meet: false,
    boost: false,
    clover: false,
    hero: "steven",
  },
  {
    id: "lint",
    name: "Lint",
    role: "Leftover light",
    line: "A leftover, unfolded.",
    offer: "A leftover, unfolded.",
    cmd: "/lint",
    aliases: ["lint"],
    tone: "gold",
    src: "/art/lint.jpg",
    door: false,
    meet: false,
    boost: false,
    clover: false,
  },
];

export function seatDef(id: string | null | undefined): SeatDef | undefined {
  if (!id) return undefined;
  const key = id.trim().toLowerCase();
  return SEATS.find((s) => s.id === key || s.cmd === key || s.aliases.includes(key));
}

export function seatFromCommand(raw: string): SeatDef | undefined {
  const c = raw.trim().toLowerCase().replace(/^\//, "");
  return SEATS.find(
    (s) => s.id === c || s.aliases.includes(c) || s.aliases.includes(raw.trim().toLowerCase()),
  );
}

export const TONE_RING: Record<SeatTone, string> = {
  mint: "border-mint/40 ring-mint/70",
  cyan: "border-cyan/40 ring-cyan/70",
  magenta: "border-magenta/40 ring-magenta/70",
  gold: "border-gold/35 ring-gold/60",
  violet: "border-magenta/30 ring-magenta/50",
};

export const TONE_TEXT: Record<SeatTone, string> = {
  mint: "text-mint",
  cyan: "text-cyan",
  magenta: "text-magenta",
  gold: "text-gold",
  violet: "text-magenta",
};

export const TONE_GLOW: Record<SeatTone, string> = {
  mint: "0 0 28px rgb(78 236 192 / 0.28)",
  cyan: "0 0 28px rgb(74 212 232 / 0.28)",
  magenta: "0 0 28px rgb(242 93 184 / 0.28)",
  gold: "0 0 28px rgb(232 195 106 / 0.28)",
  violet: "0 0 28px rgb(242 93 184 / 0.22)",
};

export const TONE_SWATCH: Record<SeatTone, string> = {
  mint: "#4eecc0",
  cyan: "#4ad4e8",
  magenta: "#f25db8",
  gold: "#e8c36a",
  violet: "#f25db8",
};
