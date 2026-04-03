export function CrosshairCursor({ points, height, top }: any) {
  if (!points || points.length === 0) return null;
  const { x, y } = points[0];
  const stroke = "rgba(150,150,150,0.5)";
  const dash = "4 3";
  return (
    <g>
      <line
        x1={x}
        y1={top}
        x2={x}
        y2={top + height}
        stroke={stroke}
        strokeWidth={1}
        strokeDasharray={dash}
      />
    </g>
  );
}
