const WORDS = ["Vocals", "Beats", "Podcasts", "Voiceover", "Mixing", "Mastering"];

function Star() {
  return <span className="marquee-star" aria-hidden="true" />;
}

/**
 * The only marquee on the site. Scrolls slowly, pauses on hover, and sits still
 * when the visitor asks for reduced motion.
 */
export default function MarqueeBand() {
  return (
    <section
      aria-label="Vocals, beats, podcasts, voiceover, mixing and mastering"
      className="marquee relative w-full overflow-hidden border-y border-background-50/30 bg-primary-500 py-5 md:py-6"
    >
      <div className="marquee-track relative z-10 flex w-max items-center">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1 ? true : undefined}
          >
            {WORDS.map((word) => (
              <span key={`${copy}-${word}`} className="flex items-center">
                <span className="marquee-word">{word}</span>
                <Star />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}