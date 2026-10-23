import { useRef, useState } from "react";
import Reveal from "@/components/base/Reveal";
import SectionHeading from "@/components/base/SectionHeading";
import SilkSheen from "@/components/base/SilkSheen";
import ReleasePlayer from "@/pages/home/components/ReleasePlayer";
import { releases } from "@/mocks/work";
import type { Release } from "@/mocks/work";

export default function RecentWork() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [livePlaying, setLivePlaying] = useState(false);
  const toggleRef = useRef<(() => void) | null>(null);

  const active = releases.find((r) => r.id === activeId) ?? null;

  const select = (release: Release) => {
    if (activeId === release.id) {
      toggleRef.current?.();
      return;
    }
    setLivePlaying(false);
    setActiveId(release.id);
  };

  return (
    <section id="work" className="relative scroll-mt-24 overflow-hidden bg-background-50 py-16 md:py-24">
      <SilkSheen />
      <div className="content-shell relative z-10">
        <SectionHeading
          label="Recent work"
          title={
            <>
              Made in <em>this room</em>
            </>
          }
          description="Press play on any cover for a preview."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {releases.map((release, i) => {
            const isActive = activeId === release.id;

            return (
              <Reveal key={release.id} delay={i * 70}>
                <button
                  type="button"
                  onClick={() => select(release)}
                  className="group w-full cursor-pointer text-left"
                  aria-label={`Play ${release.title} by ${release.artist}`}
                >
                  <div
                    className={`photo-tone relative aspect-square w-full overflow-hidden rounded-card border bg-gradient-to-br ${release.coverTone} ${
                      isActive ? "border-primary-500/60" : "border-white/[0.08]"
                    }`}
                  >
                    <img
                      src={release.coverArt}
                      alt={`${release.title} album artwork`}
                      title={`${release.title} by ${release.artist}`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-black/35 backdrop-blur-sm transition-all duration-200 group-hover:scale-105 group-hover:bg-black/50">
                        <i
                          className={`text-2xl text-white ${
                            isActive && livePlaying ? "ri-pause-fill" : "ri-play-fill"
                          }`}
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <span className="absolute left-4 top-4 rounded-pill bg-background-50/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-foreground-800 backdrop-blur-sm">
                      {release.year}
                    </span>
                    <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-pill bg-background-50/70 px-2.5 py-1 text-[11px] font-medium text-foreground-800 backdrop-blur-sm">
                      <i className="ri-spotify-fill text-xs" aria-hidden="true" />
                      Spotify
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="headline text-[1.05rem] leading-[1.05] text-foreground-950">
                      {release.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-foreground-700">{release.artist}</p>
                    <p className="mt-1 text-xs text-foreground-600">
                      {release.role} · {release.runtime}
                    </p>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>

        {active && (
          <ReleasePlayer
            key={active.id}
            release={active}
            onPlayingChange={setLivePlaying}
            toggleRef={toggleRef}
          />
        )}
      </div>
    </section>
  );
}