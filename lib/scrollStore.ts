// Tiny mutable store shared between DOM scroll handlers (GSAP) and the
// 3D render loop (R3F). Mutating a plain object avoids React re-renders.
export const scrollStore = {
  progress: 0, // 0..1 across the whole page
  mouse: { x: 0, y: 0 }, // -1..1
};
