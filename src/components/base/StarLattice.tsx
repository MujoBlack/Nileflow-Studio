const ARM = 14;
const CURVE = 2.1;

function star(cx: number, cy: number): string {
  return [
    `M${cx} ${cy - ARM}`,
    `Q${cx + CURVE} ${cy - CURVE} ${cx + ARM} ${cy}`,
    `Q${cx + CURVE} ${cy + CURVE} ${cx} ${cy + ARM}`,
    `Q${cx - CURVE} ${cy + CURVE} ${cx - ARM} ${cy}`,
    `Q${cx - CURVE} ${cy - CURVE} ${cx} ${cy - ARM}`,
    "Z",
  ].join(" ");
}

const CENTRES: [number, number][] = [
  [28, 28],
  [0, 0],
  [56, 0],
  [0, 56],
  [56, 56],
];

const SVG = [
  `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'>`,
  `<g fill='none' stroke='%23ffffff' stroke-width='0.9'>`,
  ...CENTRES.map(([x, y]) => `<path d='${star(x, y)}'/>`),
  `</g>`,
  `<g fill='%23ffffff'>`,
  ...CENTRES.map(([x, y]) => `<circle cx='${x}' cy='${y}' r='1.3'/>`),
  `</g>`,
  `</svg>`,
].join("");

const TILE = `url("data:image/svg+xml,${encodeURIComponent(SVG)}")`;

/**
 * Pattern B — star lattice. A 56px repeating tile of concave four-point stars
 * whose arms meet, so the tile reads as one continuous grid. Decorative only.
 */
export default function StarLattice({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`star-lattice pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: TILE,
        backgroundSize: "56px 56px",
        backgroundRepeat: "repeat",
      }}
    />
  );
}