export const walkInput = {
  fx: 0,
  fy: 0,
  lookX: 0,
  lookY: 0,
  locked: false,
};

export function resetWalkInput() {
  walkInput.fx = 0;
  walkInput.fy = 0;
  walkInput.lookX = 0;
  walkInput.lookY = 0;
  walkInput.locked = false;
}
