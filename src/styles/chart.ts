export const GREEN = (a = 1) => `rgba(34, 160, 110, ${a})`;
export const RED = (a = 1) => `rgba(200, 80, 80, ${a})`;

export function getBrushStroke(isDark: boolean) {
  return isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.18)";
}
export function getBrushFill(isDark: boolean) {
  return isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)";
}
