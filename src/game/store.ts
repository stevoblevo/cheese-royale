import { create } from "zustand";
import {
  advanceTurn,
  applyMove,
  canFeedChip,
  chooseAiAction,
  feedChip,
  freshChip,
  freshGame,
  playCardOn,
  resolveTile,
  rollValue,
  useAbilityOn,
} from "./engine";
import { freshFold } from "./fold";
import { HAZARD_CELL as HAZARD, OUTLET_CELL as OUTLET, POWER_CELL as POWER, canStep as canWalk } from "./fold";
import type { CardId, GameState, HeroId, NavDest, Screen } from "./types";

type Store = GameState & {
  setScreen: (s: Screen) => void;
  chooseHero: (id: HeroId) => void;
  startKid: (id: HeroId) => void;
  startListen: () => void;
  startCine: (focus?: string) => void;
  startBing: () => void;
  goNav: (dest: NavDest) => void;
  toggleCine: () => void;
  setCineTheme: (id: import("./cine").CineThemeId) => void;
  nextCineEvent: () => void;
  startFold: (from?: "title" | "play") => void;
  foldToggle: () => void;
  foldLook: (yaw: number, pitch: number) => void;
  foldStep: (cell: number) => void;
  foldAct: () => void;
  leaveFold: () => void;
  beginRoll: () => number;
  finishMove: (steps: number) => void;
  startAbility: () => void;
  startCard: (card: CardId) => void;
  pickTargetHero: (id: HeroId) => void;
  pickTargetTile: (i: number) => void;
  cancelTarget: () => void;
  offerApple: () => boolean;
  endTurn: () => void;
  runAiStep: () => { kind: "ability" | "card" | "roll" | "apple"; steps?: number };
  listenAt: (spot: GameState["listen"]["focus"]) => void;
  enterDark: () => void;
  enterLantern: () => void;
  takeFind: () => void;
  sendLetter: () => void;
  reset: () => void;
};

const idleListen = {
  screen: "title" as const,
  human: "steven" as const,
  players: [],
  turn: "steven" as const,
  phase: "ready" as const,
  dice: 0,
  rolling: false,
  log: [],
  challenge: "three_tricks" as const,
  challengeDone: false,
  winner: null,
  winHow: null,
  targeting: null,
  pendingAbility: false,
  pendingCard: null,
  turnIndex: 0,
  listen: {
    heard: false,
    read: false,
    found: false,
    sent: false,
    room: "lantern" as const,
    focus: "none" as const,
  },
  chip: freshChip(),
  fold: freshFold(),
  foldReturn: "title" as const,
  cineOver: false,
  cineTheme: "dream" as const,
  cineEvent: 0,
  cinePicked: "freppy",
};

export const useGame = create<Store>((set, get) => ({
  ...idleListen,

  setScreen: (screen) => set({ screen }),

  chooseHero: (human) => set({ human }),

  startKid: (human) => set({ ...freshGame(human), human, screen: "play" }),

  startListen: () =>
    set({
      screen: "listen",
      listen: {
        heard: false,
        read: false,
        found: false,
        sent: false,
        room: "lantern",
        focus: "none",
      },
    }),

  startCine: (focus) =>
    set({
      screen: "cine",
      cineOver: true,
      cinePicked: focus || "freppy",
    }),

  startBing: () => set({ screen: "bing" }),

  goNav: (dest) => {
    const s = get();
    if (dest === "title") {
      set({ screen: "title" });
      return;
    }
    if (dest === "table") {
      if (s.players.length > 0 && !s.winner) set({ screen: "play" });
      else set({ screen: "select" });
      return;
    }
    if (dest === "listen") {
      get().startListen();
      return;
    }
    if (dest === "fold") {
      get().startFold(s.screen === "play" || s.foldReturn === "play" ? "play" : "title");
      return;
    }
    set({ screen: "bing" });
  },

  toggleCine: () => set((s) => ({ cineOver: !s.cineOver })),

  setCineTheme: (cineTheme) => set({ cineTheme }),

  nextCineEvent: () =>
    set((s) => ({ cineEvent: (s.cineEvent + 1) % 3 })),

  beginRoll: () => {
    const n = rollValue();
    set({ dice: n, rolling: true, phase: "rolling" });
    return n;
  },

  finishMove: (steps) => {
    set((s) => {
      const next = clone(s);
      applyMove(next, steps);
      if (!next.winner) {
        next.phase = "resolving";
        resolveTile(next);
      }
      next.rolling = false;
      if (!next.winner) next.phase = "ready";
      return next;
    });
  },

  startAbility: () => {
    const s = get();
    const me = s.players.find((p) => p.id === s.turn);
    if (!me || me.abilityCd > 0 || s.phase !== "ready") return;
    if (me.id === "steven") {
      set((cur) => {
        const next = clone(cur);
        useAbilityOn(next, null, null);
        return next;
      });
      return;
    }
    set({
      pendingAbility: true,
      targeting: me.id === "sae" ? "tile" : "hero",
      phase: "targeting",
    });
  },

  startCard: (card) => {
    const s = get();
    if (s.phase !== "ready") return;
    if (card === "heal") {
      set({ pendingCard: card, targeting: "hero", phase: "targeting" });
      return;
    }
    set((cur) => {
      const next = clone(cur);
      playCardOn(next, card, null);
      return next;
    });
  },

  pickTargetHero: (id) => {
    set((cur) => {
      const next = clone(cur);
      if (next.pendingAbility) useAbilityOn(next, id, null);
      else if (next.pendingCard) playCardOn(next, next.pendingCard, id);
      next.phase = next.winner ? "won" : "ready";
      return next;
    });
  },

  pickTargetTile: (i) => {
    set((cur) => {
      const next = clone(cur);
      if (next.pendingAbility) useAbilityOn(next, null, i);
      next.phase = next.winner ? "won" : "ready";
      return next;
    });
  },

  cancelTarget: () =>
    set({
      targeting: null,
      pendingAbility: false,
      pendingCard: null,
      phase: "ready",
    }),

  offerApple: () => {
    const s = get();
    if (s.phase !== "ready" && s.phase !== "ai") return false;
    if (!canFeedChip(s, s.turn)) return false;
    let ok = false;
    set((cur) => {
      const next = clone(cur);
      ok = feedChip(next, next.turn);
      return next;
    });
    return ok;
  },

  endTurn: () => {
    set((cur) => {
      const next = clone(cur);
      advanceTurn(next);
      return next;
    });
  },

  runAiStep: () => {
    const action = chooseAiAction(get());
    if (action.kind === "apple") {
      set((cur) => {
        const next = clone(cur);
        feedChip(next, next.turn);
        return next;
      });
      return action;
    }
    if (action.kind === "ability") {
      set((cur) => {
        const next = clone(cur);
        useAbilityOn(next, action.target ?? null, action.tile ?? null);
        return next;
      });
      return action;
    }
    if (action.kind === "card" && action.card) {
      set((cur) => {
        const next = clone(cur);
        playCardOn(next, action.card!, action.target ?? null);
        return next;
      });
      return action;
    }
    const steps = rollValue();
    set({ dice: steps, rolling: true, phase: "rolling" });
    return { kind: "roll", steps };
  },

  listenAt: (spot) =>
    set((s) => {
      const listen = { ...s.listen, focus: spot };
      if (spot === "wall") listen.heard = true;
      if (spot === "letter") listen.read = true;
      if (spot === "find") listen.found = true;
      return { listen };
    }),

  enterDark: () =>
    set((s) => ({
      listen: { ...s.listen, room: "dark", focus: s.listen.found ? "find" : "seam" },
    })),

  enterLantern: () =>
    set((s) => ({
      listen: { ...s.listen, room: "lantern", focus: s.listen.found ? "letter" : "wall" },
    })),

  takeFind: () =>
    set((s) => ({
      listen: { ...s.listen, found: true, focus: "find" },
    })),

  sendLetter: () =>
    set((s) => ({
      listen: { ...s.listen, sent: true, focus: "none", room: "lantern" },
    })),

  startFold: (from = "title") =>
    set({
      screen: "fold",
      fold: freshFold(),
      foldReturn: from,
    }),

  foldToggle: () =>
    set((s) => ({
      fold: { ...s.fold, open: !s.fold.open },
    })),

  foldLook: (yaw, pitch) =>
    set((s) => ({
      fold: {
        ...s.fold,
        yaw,
        pitch: Math.max(-12, Math.min(42, pitch)),
      },
    })),

  foldStep: (cell) =>
    set((s) => {
      const f = s.fold;
      if (!f.open || f.lit) return s;
      if (!canWalk(f.lintAt, cell)) return s;
      const next = { ...f, lintAt: cell, zaps: f.zaps };
      if (cell === HAZARD) {
        next.carrying = false;
        next.zaps = f.zaps + 1;
      }
      return { fold: next };
    }),

  foldAct: () =>
    set((s) => {
      const f = s.fold;
      if (!f.open) return s;
      if (f.lintAt === POWER && !f.carrying && !f.connected) {
        return { fold: { ...f, carrying: true } };
      }
      if (f.lintAt === OUTLET && f.carrying && !f.connected) {
        return { fold: { ...f, carrying: false, connected: true, lit: true } };
      }
      return s;
    }),

  leaveFold: () =>
    set((s) => {
      const dest = s.foldReturn === "play" && s.players.length > 0 ? "play" : "title";
      if (s.fold.lit && dest === "play") {
        const next = clone(s);
        const me = next.players.find((p) => p.id === next.human);
        if (me) {
          me.hearts += 1;
          if (me.cards.length < 2 && !me.cards.includes("heal")) me.cards = [...me.cards, "heal"];
        }
        next.screen = "play";
        next.log = [
          ...next.log.slice(-5),
          { id: Date.now(), text: "Lint restored a leftover. A heart, and a kind word.", tone: "gold" },
        ];
        return next;
      }
      return { screen: dest };
    }),

  reset: () => set({ ...idleListen, chip: freshChip(), fold: freshFold() }),
}));

function clone(s: GameState): GameState {
  return {
    ...s,
    players: s.players.map((p) => ({ ...p, cards: [...p.cards] })),
    log: [...s.log],
    listen: { ...s.listen },
    chip: { ...s.chip },
    fold: { ...s.fold },
  };
}

export function wait(ms: number) {
  return new Promise<void>((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = reduced ? Math.min(ms, 80) : ms;
    const start = performance.now();
    const tick = (now: number) => {
      if (now - start >= t) resolve();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

export { canFeedChip };
