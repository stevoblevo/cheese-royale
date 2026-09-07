export const CINE_THEMES = [
  { id: "cozy", label: "Cozy", filter: "saturate(1.12) contrast(1.04)" },
  { id: "pixel", label: "Pixel", filter: "contrast(1.28) saturate(0.8)" },
  { id: "wash", label: "Watercolor", filter: "saturate(1.18) contrast(0.92) brightness(1.06)" },
  { id: "line", label: "Line", filter: "grayscale(0.85) contrast(1.35)" },
  { id: "dream", label: "Dreamy", filter: "saturate(1.35) hue-rotate(-6deg)" },
] as const;

export type CineThemeId = (typeof CINE_THEMES)[number]["id"];

export const CINE_EVENTS = [
  {
    title: "A Whisper in the Lint",
    body: "A memory stirs in the magenta glow. Optional. The leftover was never trash.",
  },
  {
    title: "Fair thee well",
    body: "Hidden, not gone. Chip still wants an apple. The lantern stays low.",
  },
  {
    title: "Knowledge seam",
    body: "All ordeals are a teaching. Gold is offered. The table remains.",
  },
] as const;
