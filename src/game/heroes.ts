import type { HeroDef, HeroId, ChallengeId, CardId } from "./types";

export const HEROES: HeroDef[] = [
  {
    id: "princess",
    name: "Princess",
    title: "Heart mage",
    blurb: "Collect hearts. Use magic.",
    ability: "Magic wand",
    abilityHint: "Heal a friend — clear a skip and give a heart.",
    color: "magenta",
    portrait: "/art/princess.jpg",
    token: "/art/princess.jpg",
  },
  {
    id: "knight",
    name: "Knight",
    title: "Shield of the table",
    blurb: "Defend friends. Block and bash.",
    ability: "Shield bash",
    abilityHint: "Give anyone a shield against the next trap.",
    color: "cyan",
    portrait: "/art/knight.jpg",
    token: "/art/knight.jpg",
  },
  {
    id: "sae",
    name: "Sae",
    title: "Trickster mage",
    blurb: "Teleport and tease.",
    ability: "Teleport",
    abilityHint: "Move anywhere on the path. The way is already there.",
    color: "violet",
    portrait: "/art/sae.jpg",
    token: "/art/sae.jpg",
  },
  {
    id: "steven",
    name: "Steven",
    title: "Cheese gunner",
    blurb: "Aim and splat.",
    ability: "Cheese blaster",
    abilityHint: "Splat! Take two cheese now. No one is hurt.",
    color: "mint",
    portrait: "/art/steven.jpg",
    token: "/art/steven.jpg",
  },
];

export const HERO_ORDER: HeroId[] = ["princess", "knight", "sae", "steven"];

export function heroDef(id: HeroId): HeroDef {
  return HEROES.find((h) => h.id === id)!;
}

export const CARD_INFO: Record<
  CardId,
  { name: string; hint: string; art: string }
> = {
  bounce: {
    name: "Bounce shoes",
    hint: "Jump the next silly trap.",
    art: "/art/boots.jpg",
  },
  giggle: {
    name: "Giggle spell",
    hint: "Everyone giggles and gains 1 cheese.",
    art: "/art/sae.jpg",
  },
  extra: {
    name: "Extra cheese",
    hint: "Take 2 cheese now.",
    art: "/art/cheese.jpg",
  },
  heal: {
    name: "Kind word",
    hint: "Give a friend a heart.",
    art: "/art/princess.jpg",
  },
};

export const CHALLENGES: Record<
  ChallengeId,
  { title: string; hint: string }
> = {
  three_tricks: {
    title: "Three silly tricks",
    hint: "Play cards, use your gift, or bounce a trap — three in one turn.",
  },
  share_table: {
    title: "Share the table",
    hint: "Heal or shield a friend this game.",
  },
  crown_path: {
    title: "Walk the crown path",
    hint: "Finish a lap holding at least 10 cheese.",
  },
};

export const COLOR_AUTHORITY = [
  { name: "Deep night", meaning: "withheld / Knight boundary", swatch: "#071018" },
  { name: "Gold", meaning: "offered authority", swatch: "#e8c36a" },
  { name: "Cyan", meaning: "evidence / visibility", swatch: "#4ad4e8" },
  { name: "Magenta", meaning: "social / consent", swatch: "#f25db8" },
  { name: "Mint", meaning: "active / revocable", swatch: "#4eecc0" },
] as const;
