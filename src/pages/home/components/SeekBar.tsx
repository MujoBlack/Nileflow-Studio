import { useRef, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";

interface SeekBarProps {
  ready: boolean;
  position: number;
  duration: number;
  onSeek: (seconds: number) => void;
  label: string;
  compact?: boolean;
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Click or drag to scrub within the track. Works with pointer, touch and keys.
 */
export default function SeekBar({
  ready,
  position,
  duration,
  onSeek,
  label,
  compact = false,
}: SeekBarProps) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const [scrub, setScrub] = useState<number | null>(null);

  const shown = scrub ?? position;
  const progress = duration > 0 ? Math.min((shown / duration) * 100, 100) : 0;

  const valueFromX = (clientX: number) => {
    const el = barRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return 0;
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    return ratio * duration;
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!ready || duration <= 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    setScrub(valueFromX(event.clientX));
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    setScrub(valueFromX(event.clientX));
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    onSeek(valueFromX(event.clientX));
    setScrub(null);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!ready || duration <= 0) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 5 : -5;
      onSeek(Math.min(Math.max(position + delta, 0), Math.max(duration - 0.5, 0)));
    }
    if (event.key === "Home") {
      event.preventDefault();
      onSeek(0);
    }
  };

  return (
    <div className="min-w-0 flex-1">
      <div
        ref={barRef}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(shown)}
        aria-valuetext={`${formatTime(shown)} of ${formatTime(duration)}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        className={`group/bar flex cursor-pointer touch-none items-center rounded-pill focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 ${
          compact ? "h-4" : "h-5"
        }`}
      >
        <div className="relative h-1.5 w-full overflow-hidden rounded-pill bg-background-300 transition-[height] duration-150 group-hover/bar:h-2">
          <div className="h-full rounded-pill bg-primary-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
      {!compact && (
        <div className="mt-1 flex items-center justify-between gap-3 text-[11px] tabular-nums text-foreground-600">
          <span>{formatTime(shown)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
}