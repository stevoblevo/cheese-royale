import type { CineThemeId } from "./cine";
import type { FoldState } from "./fold";

export type HeroId = "princess" | "knight" | "sae" | "steven";

export type TileKind =
  | "gate"
  | "home"
  | "cheese"
  | "extra"
  | "heart"
  | "trap"
  | "rain"
  | "card"
  | "giggle"
  | "crown"
  | "fold";

export type CardId = "bounce" | "giggle" | "extra" | "heal";

export type Screen = "title" | "select" | "play" | "listen" | "fold" | "cine" | "won" | "bing";

export type NavDest = "title" | "table" | "listen" | "fold" | "bing";

export type Phase =
  | "ready"
  | "rolling"
  | "moving"
  | "resolving"
  | "targeting"
  | "ai"
  | "won";

export type TargetKind = "hero" | "tile" | null;

export type ChallengeId = "three_tricks" | "share_table" | "crown_path";

export interface HeroDef {
  id: HeroId;
  name: string;
  title: string;
  blurb: string;
  ability: string;
  abilityHint: string;
  color: "magenta" | "cyan" | "violet" | "mint";
  portrait: string;
  token: string;
}

export interface Player {
  id: HeroId;
  cheese: number;
  hearts: number;
  position: number;
  laps: number;
  skipTurns: number;
  shield: boolean;
  bounce: boolean;
  abilityCd: number;
  cards: CardId[];
  tricksThisTurn: number;
  sharedThisTurn: boolean;
  isHuman: boolean;
}

export interface ChipState {
  position: number;
  apples: number;
  lastFedBy: HeroId | null;
  justAte: boolean;
}

export interface LogLine {
  id: number;
  text: string;
  tone: "gold" | "magenta" | "cyan" | "mint" | "muted";
}

export interface GameState {
  screen: Screen;
  human: HeroId;
  players: Player[];
  turn: HeroId;
  phase: Phase;
  dice: number;
  rolling: boolean;
  log: LogLine[];
  challenge: ChallengeId;
  challengeDone: boolean;
  winner: HeroId | null;
  winHow: "cheese" | "crown" | null;
  targeting: TargetKind;
  pendingAbility: boolean;
  pendingCard: CardId | null;
  turnIndex: number;
  listen: ListenState;
  chip: ChipState;
  fold: FoldState;
  foldReturn: "title" | "play";
  cineOver: boolean;
  cineTheme: CineThemeId;
  cineEvent: number;
  cinePicked: string;
}

export interface ListenState {
  heard: boolean;
  read: boolean;
  found: boolean;
  sent: boolean;
  room: "lantern" | "dark";
  focus: "none" | "wall" | "letter" | "window" | "lantern" | "seam" | "find" | "knowledge";
}

export const BOARD_SIZE = 32;
export const HOME_TILE = 17;
export const CHEESE_WIN = 20;
export const CROWN_CHEESE = 10;
export const MAX_CARDS = 2;
export const ABILITY_CD = 3;
