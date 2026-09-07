export const FOLD_SIZE = 3;
export const FOLD_CELLS = 9;
export const POWER_CELL = 6;
export const OUTLET_CELL = 1;
export const HAZARD_CELL = 5;
export const START_CELL = 4;

export interface FoldState {
  open: boolean;
  yaw: number;
  pitch: number;
  lintAt: number;
  carrying: boolean;
  connected: boolean;
  lit: boolean;
  zaps: number;
}

export function freshFold(): FoldState {
  return {
    open: false,
    yaw: -28,
    pitch: 18,
    lintAt: START_CELL,
    carrying: false,
    connected: false,
    lit: false,
    zaps: 0,
  };
}

export function neighbors(cell: number) {
  const x = cell % FOLD_SIZE;
  const y = Math.floor(cell / FOLD_SIZE);
  const out: number[] = [];
  if (x > 0) out.push(cell - 1);
  if (x < 2) out.push(cell + 1);
  if (y > 0) out.push(cell - 3);
  if (y < 2) out.push(cell + 3);
  return out;
}

export function canStep(from: number, to: number) {
  if (from === to) return false;
  if (to < 0 || to >= FOLD_CELLS) return false;
  return true;
}

export function cellXY(cell: number) {
  return { x: (cell % FOLD_SIZE) - 1, y: Math.floor(cell / FOLD_SIZE) - 1 };
}
