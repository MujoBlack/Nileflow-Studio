import { useEffect, useRef } from "react";

/**
 * Pattern A — engraved flow lines.
 *
 * 70 concentric wavy rings centred just below the section, drawn once onto a
 * canvas and redrawn on resize. Decorative only: sits behind the content,
 * never receives pointer events, hidden from assistive tech.
 */
export default function FlowPattern({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return undefined;

    let frame = 0;

    const draw = () => {
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      if (width === 0 || height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(255,255,255,1)";
      ctx.lineWidth = 0.6;

      const cx = width * 0.5;
      const cy = height * 1.35;
      const diagonal = Math.sqrt(width * width + height * height);
      const base = 0.35 * diagonal;
      const rings = 70;
      const steps = 420;

      for (let i = 0; i < rings; i += 1) {
        const radius = base + i * 7.5;
        const mod = 6 + (i % 7);
        const phase = 0.21 * i;

        ctx.beginPath();
        for (let s = 0; s <= steps; s += 1) {
          const theta = (s / steps) * Math.PI * 2;
          const r =
            radius + mod * Math.sin(28 * theta + phase) + 3 * Math.sin(5 * theta - phase);
          const x = cx + r * Math.cos(theta);
          const y = cy + r * Math.sin(theta) * 0.82;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        draw();
      });
    };

    draw();

    const observer = new ResizeObserver(schedule);
    observer.observe(parent);
    window.addEventListener("resize", schedule);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`flow-pattern pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}