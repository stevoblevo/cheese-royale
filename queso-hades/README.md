# Queso Hades Cheese Royale — wyrd tokens

The Queso Hades Cheese Royale artifact now has a repo home for its design
layer. This folder holds the extracted token snapshot; it does not replace
anything else in this repository (the repo root belongs to an earlier
TypeScript project, so Queso lives under `queso-hades/` to avoid
clobbering it).

## Source of truth

The **artifact is the source of truth**: Queso Hades Cheese Royale, Muse
space slug `queso-hades-cheese-royale`, file `index.html`. Canon and
design intent are recorded in the goal workspace's `WYRD-PLAN.md`.

## What's here

- `queso-wyrd-tokens-v0.1.css` — **Queso Wyrd Tokens v0.1**, the artifact's
  design-token layer (colours, type, spacing, atmosphere/effects, and the
  hard-coded component literals), extracted 2026-11-16. It is a snapshot:
  every value was copied from the artifact and verified against it. If
  the sheet and the artifact disagree, the artifact wins until a new
  snapshot is cut.
- `../site/index.html` — a byte-identical copy of the artifact's
  `index.html` at extraction time, kept so the snapshot can be checked
  against the exact file it came from. (The artifact's WebP assets are
  not included; the page references them relatively.)

## Provenance

- Source file: artifact `index.html`, 70,869 bytes
- Source SHA-256: `8b4e04342465194757585a114738e99d0179404ec7365bc02a3c5cdcfd29b485`
- The copy at `../site/index.html` hashes to the same value.

## Canon note

Battle roster: Brie Beelz, Gouda Grim, Roquefort Reaper, Halloumi Hound,
Unc. Pinky is coach/companion and the initial AI-pilot identity — present
in the companion layer (coach bubble, Pinky chat, AI PILOT state) and
deliberately not part of the battle roster data.
