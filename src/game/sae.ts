export const SAE_LINES = [
  "The way is already under your feet. Walk lighter.",
  "Te is the virtue of the sending — not the keeping.",
  "A shield that never lowers is a wall. A wall is not a table.",
  "Cheese shared is still cheese. That is the joke and the law.",
  "Do not force the crown. Let it hover until the table is ready.",
  "Magenta is consent. Ask, then glow.",
  "Deep night is not absence. It is the withheld, kept kind.",
  "Mint is revocable. You may put the blaster down.",
  "Cyan shows what is. Do not paint over a friend's no.",
  "Gold is offered, never taken. Authority that asks first.",
  "Wu wei: roll, then let the tiles speak.",
  "A silly trap is a teacher who giggles.",
  "All ordeals are a teaching. The angel does not punish; the angel shows.",
  "I teleport because standing still is also a choice.",
  "The letter leaves. The table remains. Both are true.",
  "The game is a lantern, not a substitute. The friendship was already here.",
  "Wish, and hope. Do not clutch. Almighty does the keeping.",
  "A burger wanted is a kind of prayer. Feed the friend first.",
];

export function saeLine(seed: number) {
  return SAE_LINES[((seed % SAE_LINES.length) + SAE_LINES.length) % SAE_LINES.length]!;
}

export const LISTEN_COPY = {
  wall: {
    title: "Listen",
    body: "A voice like water in stone. Someone is waiting — not for a fight, for a word. You press your palm to the masonry and the castle breathes back.",
  },
  letter: {
    title: "The letter",
    body: "Beloved — I kept the crown light so it would not weigh the table. Come when the cheese is shared. Come as you are. — Te",
  },
  window: {
    title: "The night bird",
    body: "A dark bird waits on the sill, patient as Dao. You may tie the letter to its foot. Sending is the virtue. Keeping is the ache.",
  },
  lantern: {
    title: "Warm wax",
    body: "The lantern is enough to seal. You do not need a throne to send a true thing. Light, then let go.",
  },
  seam: {
    title: "The knowledge seam",
    body: "The wall keeps a teaching, not a trial. Phyllis: the aspirant learns that all ordeals are a teaching devised by the Holy Guardian Angel. You may step through. One thing waits.",
  },
  find: {
    title: "The one find",
    body: "A gold seal in the dark — offered, never taken. The ordeal was the teacher. Come as you are. The table is already set.",
  },
  knowledge: {
    title: "Knowledge seam",
    body: "“The Aspirant eventually learns that all ordeals are a teaching devised for him by the Holy Guardian Angel.” — Phyllis Seckler (Soror Meral). In this house: the trap giggles, the fold rustles, the dark keeps one thing. None of them are enemies.",
  },
  sent: {
    title: "Gone, and still here",
    body: "The letter leaves the tower. Wu wei. Nothing forced, nothing clutched. The table downstairs is still set for four.",
  },
} as const;
