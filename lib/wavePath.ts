/**
 * Generates a smooth SVG path for a panel with one wavy edge — used by the
 * auth cover-reveal panel instead of a straight divider. Built from sampled
 * sine points connected by short line segments (enough samples reads as a
 * smooth curve at normal viewing size) rather than hand-tuned bezier control
 * points, so the wave shape is exact and easy to tune via three numbers.
 *
 * @param width      viewBox width
 * @param height     viewBox height
 * @param edge       which edge is wavy — 'right' (panel fills left of the
 *                   wave, e.g. a left-side cover) or 'bottom' (panel fills
 *                   above the wave, e.g. a mobile top banner)
 * @param baseFrac   where the wave centers, as a fraction of width/height
 * @param amplitude  how far the wave swings from baseFrac, in viewBox units
 * @param waves      number of full sine cycles along the wavy edge
 */
export function wavePanelPath(
  width: number,
  height: number,
  edge: "right" | "bottom",
  baseFrac: number,
  amplitude: number,
  waves: number,
  steps = 80
): string {
  if (edge === "right") {
    const baseX = width * baseFrac;
    let d = `M 0 0 L ${baseX.toFixed(2)} 0 `;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const y = t * height;
      const x = baseX + amplitude * Math.sin(t * waves * Math.PI * 2);
      d += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    d += `L 0 ${height.toFixed(2)} Z`;
    return d;
  }

  const baseY = height * baseFrac;
  let d = `M 0 0 L ${width.toFixed(2)} 0 L ${width.toFixed(2)} ${baseY.toFixed(2)} `;
  for (let i = steps; i >= 0; i--) {
    const t = i / steps;
    const x = t * width;
    const y = baseY + amplitude * Math.sin(t * waves * Math.PI * 2);
    d += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  d += `L 0 0 Z`;
  return d;
}
