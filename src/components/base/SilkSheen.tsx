const NOISE_SVG = [
  "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'>",
  "<filter id='grain'>",
  "<feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/>",
  "<feColorMatrix type='saturate' values='0'/>",
  "</filter>",
  "<rect width='220' height='220' filter='url(%23grain)'/>",
  "</svg>",
].join("");

const GRAIN = `url("data:image/svg+xml,${NOISE_SVG}")`;

/**
 * Pattern 02 — silk sheen and grain.
 *
 * One soft diagonal light band, a second faint teal band, a teal glow in the
 * top-right corner, and a fine film-grain layer on top. Never repeats.
 * Decorative only: sits behind the content, no pointer events, hidden from
 * assistive tech.
 */
export default function SilkSheen({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`silk-sheen pointer-events-none absolute inset-0 ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            // soft teal glow, top-right corner
            "radial-gradient(ellipse 62% 58% at 100% 0%, oklch(var(--primary-500) / 0.06), transparent 68%)",
            // soft diagonal light band
            "linear-gradient(118deg, transparent 18%, oklch(1 0 0 / 0.05) 30%, oklch(1 0 0 / 0.05) 50%, transparent 64%)",
            // faint teal band
            "linear-gradient(118deg, transparent 55%, oklch(var(--primary-500) / 0.05) 68%, oklch(var(--primary-500) / 0.05) 86%, transparent 100%)",
          ].join(", "),
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: GRAIN,
          backgroundRepeat: "repeat",
          backgroundSize: "220px 220px",
        }}
      />
    </div>
  );
}