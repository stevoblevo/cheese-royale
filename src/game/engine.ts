import { HERO_ORDER } from "./heroes";
import { TILES, nextIndex, wraps } from "./board";
import { freshFold } from "./fold";
import {
  ABILITY_CD,
  BOARD_SIZE,
  CHEESE_WIN,
  CROWN_CHEESE,
  HOME_TILE,
  MAX_CARDS,
  type CardId,
  type ChallengeId,
  type ChipState,
  type GameState,
  type HeroId,
  type LogLine,
  type Player,
} from "./types";

let logSeq = 1;

function line(text: string, tone: LogLine["tone"] = "muted"): LogLine {
  return { id: logSeq++, text, tone };
}

function shuffle<T>(items: T[]): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function freshChip(): ChipState {
  return { position: HOME_TILE, apples: 0, lastFedBy: null, justAte: false };
}

export function makePlayer(id: HeroId, human: HeroId): Player {
  return {
    id,
    cheese: 0,
    hearts: 3,
    position: 0,
    laps: 0,
    skipTurns: 0,
    shield: false,
    bounce: false,
    abilityCd: 0,
    cards: [],
    tricksThisTurn: 0,
    sharedThisTurn: false,
    isHuman: id === human,
  };
}

export function freshGame(human: HeroId): GameState {
  const challenges: ChallengeId[] = ["three_tricks", "share_table", "crown_path"];
  return {
    screen: "play",
    human,
    players: HERO_ORDER.map((id) => makePlayer(id, human)),
    turn: human,
    phase: "ready",
    dice: 0,
    rolling: false,
    log: [
      line("The table is set. First to 20 cheese — or the Crown.", "gold"),
      line("Chip waits at Home. An apple is already there.", "muted"),
    ],
    challenge: challenges[Math.floor(Math.random() * challenges.length)]!,
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
      room: "lantern",
      focus: "none",
    },
    chip: freshChip(),
    fold: freshFold(),
    foldReturn: "title",
    cineOver: true,
    cineTheme: "dream",
    cineEvent: 0,
  };
}

export function playerOf(state: GameState, id: HeroId): Player {
  return state.players.find((p) => p.id === id)!;
}

export function current(state: GameState): Player {
  return playerOf(state, state.turn);
}

function toneFor(id: HeroId): LogLine["tone"] {
  if (id === "princess") return "magenta";
  if (id === "knight") return "cyan";
  if (id === "sae") return "magenta";
  return "mint";
}

function nameOf(id: HeroId) {
  if (id === "princess") return "Princess";
  if (id === "knight") return "Knight";
  if (id === "sae") return "Sae";
  return "Steven";
}

function push(state: GameState, text: string, tone: LogLine["tone"] = "muted") {
  state.log = [...state.log.slice(-5), line(text, tone)];
}

function checkWin(state: GameState, p: Player, how: "cheese" | "crown") {
  if (state.winner) return;
  if (how === "cheese" && p.cheese >= CHEESE_WIN) {
    state.winner = p.id;
    state.winHow = "cheese";
    state.phase = "won";
    state.screen = "won";
    push(state, `${nameOf(p.id)} gathered 20 cheese. The table cheers.`, "gold");
  }
  if (how === "crown") {
    state.winner = p.id;
    state.winHow = "crown";
    state.phase = "won";
    state.screen = "won";
    push(state, `${nameOf(p.id)} lifts the Cheese Crown. Light, not weight.`, "gold");
  }
}

function awardChallenge(state: GameState, p: Player) {
  if (state.challengeDone) return;
  const c = state.challenge;
  const ok =
    (c === "three_tricks" && p.tricksThisTurn >= 3) ||
    (c === "share_table" && p.sharedThisTurn) ||
    (c === "crown_path" && p.laps >= 1 && p.cheese >= CROWN_CHEESE);
  if (!ok) return;
  state.challengeDone = true;
  p.cheese += 3;
  push(state, `Today's challenge complete. +3 cheese for ${nameOf(p.id)}.`, "gold");
  checkWin(state, p, "cheese");
}

function drawCard(): CardId {
  const deck: CardId[] = ["bounce", "giggle", "extra", "heal", "bounce", "extra"];
  return deck[Math.floor(Math.random() * deck.length)]!;
}

function giveCard(p: Player): CardId | null {
  if (p.cards.length >= MAX_CARDS) return null;
  const card = drawCard();
  p.cards = [...p.cards, card];
  return card;
}

export function rollValue() {
  return 1 + Math.floor(Math.random() * 6);
}

export function canFeedChip(state: GameState, id: HeroId) {
  const p = playerOf(state, id);
  if (!p || state.winner) return false;
  return p.position === state.chip.position || p.position === HOME_TILE;
}

export function feedChip(state: GameState, id: HeroId) {
  if (!canFeedChip(state, id)) return false;
  const p = playerOf(state, id);
  state.chip = {
    position: state.chip.position,
    apples: state.chip.apples + 1,
    lastFedBy: id,
    justAte: true,
  };
  p.tricksThisTurn += 1;
  push(
    state,
    `${nameOf(id)} brought Chip an apple. Okay — he ate it.`,
    "gold",
  );
  awardChallenge(state, p);
  return true;
}

export function wanderChip(state: GameState) {
  state.chip.justAte = false;
  if (Math.random() < 0.45) return;
  const step = Math.random() < 0.5 ? 1 : BOARD_SIZE - 1;
  state.chip.position = nextIndex(state.chip.position, step);
}

export function applyMove(state: GameState, steps: number) {
  const p = current(state);
  const from = p.position;
  const wrapped = wraps(from, steps);
  p.position = nextIndex(from, steps);
  if (wrapped) {
    p.laps += 1;
    push(state, `${nameOf(p.id)} completes a lap around Cheese Castle.`, "gold");
    if (p.cheese >= CROWN_CHEESE) {
      checkWin(state, p, "crown");
      awardChallenge(state, p);
      return;
    }
  }
}

export function resolveTile(state: GameState) {
  const p = current(state);
  const kind = TILES[p.position]!;
  const nm = nameOf(p.id);

  if (kind === "home") {
    p.hearts += 1;
    push(state, `${nm} reaches Home. The door was not locked.`, "gold");
  } else if (kind === "cheese") {
    p.cheese += 1;
    push(state, `${nm} finds a wedge. +1 cheese.`, toneFor(p.id));
  } else if (kind === "extra") {
    p.cheese += 2;
    push(state, `${nm} finds extra cheese. +2.`, toneFor(p.id));
  } else if (kind === "heart") {
    p.hearts += 1;
    push(state, `${nm} gathers a heart.`, "magenta");
  } else if (kind === "trap") {
    if (p.bounce) {
      p.bounce = false;
      p.tricksThisTurn += 1;
      push(state, `${nm} bounces over a silly trap!`, "mint");
    } else if (p.shield) {
      p.shield = false;
      push(state, `${nm}'s shield holds. The trap giggles and lets go.`, "cyan");
    } else if (p.hearts > 0) {
      p.hearts -= 1;
      push(state, `Silly trap! ${nm} spends a heart. The ordeal was a teaching.`, "muted");
    } else {
      p.cheese = Math.max(0, p.cheese - 1);
      p.skipTurns += 1;
      push(state, `Silly trap! ${nm} loses 1 cheese and a turn to laugh.`, "muted");
    }
  } else if (kind === "rain") {
    for (const pl of state.players) pl.cheese += 1;
    push(state, "Cheese rain! Everyone gets 1 cheese.", "gold");
  } else if (kind === "card") {
    const card = giveCard(p);
    push(
      state,
      card ? `${nm} draws a card.` : `${nm}'s hand is full — the card smiles and waits.`,
      "gold",
    );
  } else if (kind === "giggle") {
    p.tricksThisTurn += 1;
    p.position = nextIndex(p.position, 2);
    push(state, `${nm} giggles and skips two extra steps.`, "mint");
  } else if (kind === "fold") {
    push(state, `${nm} finds a leftover fold. Lint rustles inside.`, "gold");
  } else if (kind === "crown") {
    if (p.cheese >= 15) {
      checkWin(state, p, "crown");
      return;
    }
    push(state, `${nm} stands on the crown path. Ten cheese and a lap to claim it.`, "gold");
  } else if (kind === "gate") {
    if (p.laps >= 1 && p.cheese >= CROWN_CHEESE) {
      checkWin(state, p, "crown");
      return;
    }
    push(state, `${nm} at the castle gate.`, "gold");
  }

  if (p.position === state.chip.position && !state.chip.justAte) {
    push(state, `${nm} finds Chip on the path. The apple is already there.`, "muted");
  }

  for (const pl of state.players) checkWin(state, pl, "cheese");
  awardChallenge(state, p);
}

export function useAbilityOn(
  state: GameState,
  targetId: HeroId | null,
  tile: number | null,
) {
  const p = current(state);
  if (p.abilityCd > 0 || state.winner) return;
  const nm = nameOf(p.id);

  if (p.id === "princess") {
    const t = targetId ? playerOf(state, targetId) : p;
    t.hearts += 1;
    t.skipTurns = 0;
    p.sharedThisTurn = true;
    p.tricksThisTurn += 1;
    push(state, `${nm} heals ${nameOf(t.id)}. A heart, and the skip dissolves.`, "magenta");
  } else if (p.id === "knight") {
    const t = targetId ? playerOf(state, targetId) : p;
    t.shield = true;
    p.sharedThisTurn = true;
    p.tricksThisTurn += 1;
    push(state, `${nm} raises a shield for ${nameOf(t.id)}.`, "cyan");
  } else if (p.id === "sae") {
    if (tile == null) return;
    p.position = ((tile % BOARD_SIZE) + BOARD_SIZE) % BOARD_SIZE;
    p.tricksThisTurn += 1;
    push(state, `Sae folds space. Now on space ${p.position + 1}.`, "magenta");
    resolveTile(state);
  } else if (p.id === "steven") {
    p.cheese += 2;
    p.tricksThisTurn += 1;
    push(state, "Steven splats! +2 cheese, nobody sticky.", "mint");
    checkWin(state, p, "cheese");
  }

  p.abilityCd = ABILITY_CD;
  state.pendingAbility = false;
  state.targeting = null;
  awardChallenge(state, p);
}

export function playCardOn(
  state: GameState,
  card: CardId,
  targetId: HeroId | null,
) {
  const p = current(state);
  const idx = p.cards.indexOf(card);
  if (idx < 0 || state.winner) return;
  p.cards = p.cards.filter((_, i) => i !== idx);
  p.tricksThisTurn += 1;
  const nm = nameOf(p.id);

  if (card === "bounce") {
    p.bounce = true;
    push(state, `${nm} laces bounce shoes.`, "mint");
  } else if (card === "giggle") {
    for (const pl of state.players) pl.cheese += 1;
    push(state, "Giggle spell! The whole table gains 1 cheese.", "magenta");
    for (const pl of state.players) checkWin(state, pl, "cheese");
  } else if (card === "extra") {
    p.cheese += 2;
    push(state, `${nm} takes extra cheese. +2.`, "gold");
    checkWin(state, p, "cheese");
  } else if (card === "heal") {
    const t = targetId ? playerOf(state, targetId) : p;
    t.hearts += 1;
    t.skipTurns = 0;
    p.sharedThisTurn = true;
    push(state, `${nm} offers a kind word to ${nameOf(t.id)}.`, "magenta");
  }

  state.pendingCard = null;
  state.targeting = null;
  awardChallenge(state, p);
}

export function advanceTurn(state: GameState) {
  if (state.winner) return;
  wanderChip(state);
  const order = HERO_ORDER;
  const here = order.indexOf(state.turn);
  for (let step = 1; step <= order.length; step++) {
    const next = order[(here + step) % order.length]!;
    const p = playerOf(state, next);
    if (p.abilityCd > 0) p.abilityCd -= 1;
    if (p.skipTurns > 0) {
      p.skipTurns -= 1;
      push(state, `${nameOf(p.id)} is still giggling. Turn skipped.`, "muted");
      continue;
    }
    p.tricksThisTurn = 0;
    p.sharedThisTurn = false;
    state.turn = next;
    state.turnIndex += 1;
    state.phase = p.isHuman ? "ready" : "ai";
    state.targeting = null;
    state.pendingAbility = false;
    state.pendingCard = null;
    return;
  }
  state.phase = "ready";
}

export function chooseAiAction(state: GameState): {
  kind: "ability" | "card" | "roll" | "apple";
  card?: CardId;
  target?: HeroId;
  tile?: number;
} {
  const p = current(state);
  if (canFeedChip(state, p.id) && Math.random() < 0.55) return { kind: "apple" };
  if (p.abilityCd === 0) {
    if (p.id === "steven") return { kind: "ability" };
    if (p.id === "princess") {
      const needy = state.players.find((x) => x.skipTurns > 0 || x.hearts <= 1) ?? p;
      return { kind: "ability", target: needy.id };
    }
    if (p.id === "knight") {
      const needy = state.players.find((x) => !x.shield && (x.hearts <= 1 || x.id === p.id)) ?? p;
      return { kind: "ability", target: needy.id };
    }
    if (p.id === "sae") {
      if (p.cheese >= CROWN_CHEESE) return { kind: "ability", tile: 0 };
      const extras = TILES.map((k, i) => (k === "extra" || k === "crown" || k === "home" ? i : -1)).filter(
        (i) => i >= 0,
      );
      return { kind: "ability", tile: extras[Math.floor(Math.random() * extras.length)] ?? 8 };
    }
  }
  if (p.cards.includes("extra")) return { kind: "card", card: "extra" };
  if (p.cards.includes("giggle")) return { kind: "card", card: "giggle" };
  if (p.cards.includes("bounce") && !p.bounce) return { kind: "card", card: "bounce" };
  if (p.cards.includes("heal")) {
    const needy = state.players.find((x) => x.hearts <= 1) ?? p;
    return { kind: "card", card: "heal", target: needy.id };
  }
  return { kind: "roll" };
}
