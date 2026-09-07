export interface FriendLifeCard {
  id: string;
  from: string;
  real: { who: string; text: string }[];
  magicTitle: string;
  magic: string;
}

export const FRIEND_LIFE: FriendLifeCard[] = [
  {
    id: "knowledge-seam",
    from: "the seam",
    real: [
      { who: "Phyllis", text: "All ordeals are a teaching devised by the Holy Guardian Angel." },
      { who: "You", text: "Then the trap was never the enemy." },
      { who: "Sae", text: "Gold is offered. The angel asks first." },
    ],
    magicTitle: "Knowledge seam",
    magic:
      "Optional to open. The dark room, the leftover fold, the silly trap — teachers, not punishments. Never replace the friendship with the ordeal.",
  },
  {
    id: "lint-fold",
    from: "leftover",
    real: [
      { who: "Lint", text: "The outlet was folded." },
      { who: "You", text: "Then we unfold it." },
    ],
    magicTitle: "Folded Outlet",
    magic:
      "A leftover room of paper and lint. Unfold, walk Lint, restore power. Optional. The table remains.",
  },
  {
    id: "dark-find",
    from: "the seam",
    real: [
      { who: "You", text: "I listened at the wall." },
      { who: "Te", text: "Deep night is not absence." },
      { who: "You", text: "One thing was kept." },
    ],
    magicTitle: "The one find",
    magic:
      "A gold seal in the dark room. Optional to take. Optional to send. The friendship was already enough.",
  },
  {
    id: "chip-apple",
    from: "the paddock",
    real: [
      { who: "You", text: "You can bring a horse an apple." },
      { who: "Chip", text: "Okay — he ate it." },
    ],
    magicTitle: "A neigh, then quiet",
    magic:
      "No quest. No nag. Home is not a cop-out. Chip eats, neighs, and stays a horse.",
  },
  {
    id: "el-paso-monsoon",
    from: "Freddy",
    real: [
      { who: "Freddy", text: "Is it stormy in El Paso?" },
      { who: "You", text: "Not at present." },
      { who: "Freddy", text: "Been crazy here." },
      { who: "You", text: "Monsoon real. With cheese. Royal with cheese." },
      { who: "Freddy", text: "Now I want a burger." },
    ],
    magicTitle: "BurgerKnight marker",
    magic:
      "If the weather turns again, this branch gets a tiny BurgerKnight. If it doesn't, it stays a pleasant memory — never a nag.",
  },
  {
    id: "letter-wall",
    from: "the tower",
    real: [
      { who: "You", text: "I listened at the wall." },
      { who: "Te", text: "Come when the cheese is shared." },
    ],
    magicTitle: "Soft sending",
    magic: "A night bird will carry one true sentence. Optional. The friendship is already enough.",
  },
  {
    id: "table-four",
    from: "Sae",
    real: [
      { who: "Sae", text: "Four seats. One castle." },
      { who: "You", text: "No enemy at this board." },
    ],
    magicTitle: "Shared lantern",
    magic: "Someone at the table may give away one cheese without losing a heart. Only if they want to.",
  },
];

export function dealFriendLife(seed = Date.now()) {
  return FRIEND_LIFE[seed % FRIEND_LIFE.length]!;
}
