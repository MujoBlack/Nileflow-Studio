import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, TouchEvent } from "react";
import Reveal from "@/components/base/Reveal";
import SectionHeading from "@/components/base/SectionHeading";
import StarLattice from "@/components/base/StarLattice";
import { reviews } from "@/mocks/reviews";
import type { Review } from "@/mocks/reviews";
import { siteInfo } from "@/mocks/site";
import Icon from "@/components/base/Icon";

/** how long a review stays up before the next one comes in */
const DURATION = 7000;

/** what the Google listing actually shows */
const GOOGLE_RATING = "5.0";
const GOOGLE_COUNT = 2;

interface ProgressBarProps {
  /** changing this restarts the fill animation */
  runKey: number;
  paused: boolean;
  visible: boolean;
}

function ProgressBar({ runKey, paused, visible }: ProgressBarProps) {
  return (
    <span className="mt-2 block h-px w-full overflow-hidden bg-white/10">
      {visible && (
        <span
          key={runKey}
          className={`review-progress-fill block h-px w-full ${paused ? "is-paused" : ""}`}
        />
      )}
    </span>
  );
}

interface BoardProps {
  items: Review[];
  active: Review;
  activeIndex: number;
  paused: boolean;
  running: boolean;
  onSelect: (id: string) => void;
  onStep: (delta: number) => void;
}

function ReviewBoard({
  items,
  active,
  activeIndex,
  paused,
  running,
  onSelect,
  onStep,
}: BoardProps) {
  const touchStart = useRef<number | null>(null);

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      onStep(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onStep(-1);
    }
  };

  const onTouchStart = (event: TouchEvent<HTMLElement>) => {
    touchStart.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (start === null) return;
    const delta = (event.changedTouches[0]?.clientX ?? start) - start;
    if (Math.abs(delta) < 50) return;
    onStep(delta < 0 ? 1 : -1);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.75fr_1.45fr_0.8fr] lg:gap-5">
      {/* desktop: names as tabs on the left */}
      <div className="hidden lg:block">
        <div className="flex flex-col divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {items.map((review) => {
            const isActive = review.id === active.id;
            return (
              <button
                key={review.id}
                type="button"
                onClick={() => onSelect(review.id)}
                onKeyDown={onTabKey}
                aria-pressed={isActive}
                className="group flex cursor-pointer flex-col py-4 text-left transition-colors duration-200"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="min-w-0">
                    <span
                      className={`block truncate text-[13px] font-medium transition-colors duration-300 ${
                        isActive ? "text-primary-500" : "text-foreground-800 group-hover:text-foreground-950"
                      }`}
                    >
                      {review.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] uppercase tracking-[0.14em] text-foreground-500">
                      {review.role}
                    </span>
                  </span>
                  <Icon
                    name={isActive ? "ri-arrow-right-up-line" : "ri-arrow-right-line"}
                    className={`text-base transition-colors duration-300 ${
                      isActive ? "text-primary-500" : "text-foreground-500"
                    }`}
                  />
                </span>
                <ProgressBar
                  runKey={activeIndex}
                  paused={paused}
                  visible={isActive && running}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* phones: names become a row of pills above the card */}
      <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {items.map((review) => {
          const isActive = review.id === active.id;
          return (
            <button
              key={review.id}
              type="button"
              onClick={() => onSelect(review.id)}
              onKeyDown={onTabKey}
              aria-pressed={isActive}
              className={`shrink-0 cursor-pointer whitespace-nowrap rounded-pill border px-4 py-2 text-[12px] transition-colors duration-200 ${
                isActive
                  ? "border-primary-500/60 bg-primary-500/10 text-primary-500"
                  : "border-white/[0.1] text-foreground-700"
              }`}
            >
              {review.name}
            </button>
          );
        })}
      </div>

      <figure
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-card border border-white/[0.08] bg-background-100 p-7 md:p-9"
      >
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
          style={{
            background:
              "radial-gradient(ellipse at 50% 130%, oklch(var(--primary-500) / 0.32), transparent 70%)",
          }}
          aria-hidden="true"
        />
        <Icon name="ri-double-quotes-l" className="text-2xl text-primary-500" />

        {/* all quotes share one grid cell, so the card is as tall as the longest */}
        <div className="relative z-10 mt-5 grid flex-1">
          {items.map((review) => {
            const isActive = review.id === active.id;
            return (
              <blockquote
                key={review.id}
                aria-hidden={!isActive}
                className={`quote-fade headline [grid-area:1/1] text-[clamp(1.15rem,1.85vw,1.6rem)] leading-[1.18] text-foreground-950 ${
                  isActive ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                “{review.quote}”
              </blockquote>
            );
          })}
        </div>

        <figcaption className="relative z-10 mt-7 flex items-end justify-between gap-4 border-t border-white/[0.08] pt-5">
          <span>
            <span className="block text-[13px] font-medium text-foreground-950">{active.name}</span>
            <span className="mt-0.5 block text-[11px] uppercase tracking-[0.14em] text-foreground-500">
              {active.role}
            </span>
          </span>
          <span className="font-display text-lg font-bold leading-none text-primary-500">
            {active.rating.toFixed(1)} / 5.0
          </span>
        </figcaption>

        <div className="relative z-10 mt-5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onStep(-1)}
            aria-label="Previous review"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 text-foreground-700 transition-colors duration-200 hover:border-primary-500/50 hover:text-primary-500"
          >
            <Icon name="ri-arrow-left-line" className="text-base" />
          </button>
          <span className="font-display text-[12px] uppercase tracking-[0.18em] text-foreground-600">
            {activeIndex + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={() => onStep(1)}
            aria-label="Next review"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 text-foreground-700 transition-colors duration-200 hover:border-primary-500/50 hover:text-primary-500"
          >
            <Icon name="ri-arrow-right-line" className="text-base" />
          </button>
        </div>
      </figure>

      {/* Google proof instead of a third photo of the same corner */}
      <div className="flex h-full min-h-[320px] flex-col justify-center rounded-card border border-white/[0.08] bg-background-100 p-7 md:p-9">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[clamp(2.8rem,5vw,4rem)] font-bold leading-none text-foreground-950">
            {GOOGLE_RATING}
          </span>
          <span className="text-[13px] uppercase tracking-[0.16em] text-foreground-600">/ 5</span>
        </div>

        <div className="mt-3 flex items-center gap-1" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon key={i} name="ri-star-fill" className="text-[15px] text-primary-500" />
          ))}
        </div>

        <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-foreground-500">
          on Google
        </p>
        <p className="mt-1 text-[13px] text-foreground-700">
          {GOOGLE_COUNT} reviews
        </p>

        <a
          href={siteInfo.googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-fit items-center gap-1.5 whitespace-nowrap border-b border-primary-500/40 pb-1 text-[11px] font-medium uppercase tracking-[0.16em] text-primary-500 transition-colors duration-200 hover:border-primary-500"
        >
          Read on Google
          <Icon name="ri-arrow-right-up-line" className="text-sm" />
        </a>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const items = reviews.filter((r) => !r.placeholder);
  const count = Math.max(items.length, 1);

  const [index, setIndex] = useState(0);
  const [manual, setManual] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  /** how much of the current dwell time has already passed, in ms */
  const elapsed = useRef(0);

  // reduced motion: no auto-advance at all
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  const running = !manual && !reduced && items.length > 1;

  // dwell timer. Pausing freezes it where it is; resuming carries on from there.
  useEffect(() => {
    if (!running || paused) return undefined;

    const startedAt = performance.now() - elapsed.current;
    let frame = 0;

    const tick = (now: number) => {
      elapsed.current = now - startedAt;
      if (elapsed.current >= DURATION) {
        elapsed.current = 0;
        setIndex((current) => (current + 1) % count);
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [running, paused, index, count]);

  const activeIndex = Math.min(index, items.length - 1);
  const active = items[activeIndex];

  const goTo = (next: number) => {
    elapsed.current = 0;
    setManual(true);
    setIndex(((next % count) + count) % count);
  };

  const step = (delta: number) => goTo(activeIndex + delta);

  return (
    <section
      id="reviews"
      aria-label="Reviews"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative scroll-mt-24 overflow-hidden bg-background-50 py-16 md:py-24"
    >
      <StarLattice />
      <div className="content-shell relative z-10">
        <SectionHeading
          label="Reviews"
          title={
            <>
              From artists who&apos;ve <em>recorded here</em>
            </>
          }
        />

        <Reveal className="mt-12 lg:mt-14">
          <ReviewBoard
            items={items}
            active={active}
            activeIndex={activeIndex}
            paused={paused}
            running={running}
            onSelect={(id) => {
              const next = items.findIndex((review) => review.id === id);
              if (next >= 0) goTo(next);
            }}
            onStep={step}
          />
        </Reveal>
      </div>
    </section>
  );
}