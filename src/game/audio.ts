let ctx: AudioContext | null = null;

function ac() {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const C =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    return ctx;
  } catch {
    return null;
  }
}

export function unlockAudio() {
  try {
    const c = ac();
    if (c && c.state === "suspended") void c.resume();
  } catch {
    /* headless / locked autoplay */
  }
}

function tone(freq: number, dur: number, type: OscillatorType, gain = 0.05, delay = 0) {
  try {
    const c = ac();
    if (!c) return;
    const t0 = c.currentTime + delay;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  } catch {
    /* ignore */
  }
}

export const sfx = {
  click: () => tone(520, 0.08, "triangle", 0.03),
  dice: () => {
    tone(180, 0.07, "square", 0.03);
    tone(240, 0.08, "square", 0.025, 0.05);
    tone(200, 0.1, "triangle", 0.03, 0.1);
  },
  cheese: () => {
    tone(523, 0.12, "sine", 0.045);
    tone(784, 0.16, "sine", 0.035, 0.08);
  },
  heart: () => {
    tone(392, 0.14, "sine", 0.04);
    tone(523, 0.18, "sine", 0.035, 0.09);
  },
  trap: () => {
    tone(196, 0.18, "sawtooth", 0.03);
    tone(147, 0.22, "triangle", 0.03, 0.05);
  },
  magic: () => {
    tone(659, 0.12, "sine", 0.04);
    tone(880, 0.16, "triangle", 0.03, 0.08);
    tone(1174, 0.2, "sine", 0.025, 0.16);
  },
  win: () => {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.28, "sine", 0.045, i * 0.12));
  },
  whisper: () => {
    tone(330, 0.4, "sine", 0.02);
    tone(495, 0.5, "triangle", 0.015, 0.1);
  },
  neigh: () => {
    try {
      const c = ac();
      if (!c) return;
      const t0 = c.currentTime;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(420, t0);
      o.frequency.exponentialRampToValueAtTime(180, t0 + 0.18);
      o.frequency.exponentialRampToValueAtTime(320, t0 + 0.32);
      o.frequency.exponentialRampToValueAtTime(140, t0 + 0.55);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.055, t0 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
      o.connect(g);
      g.connect(c.destination);
      o.start(t0);
      o.stop(t0 + 0.62);
      tone(260, 0.22, "triangle", 0.02, 0.08);
    } catch {
      /* ignore */
    }
  },
};
