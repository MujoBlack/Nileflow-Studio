import { useEffect, useState } from "react";

/**
 * Which section is currently under the sticky header. Measured on scroll with
 * a single rAF per frame — no observers per section, so anchors can come and go.
 */
export default function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    if (ids.length === 0) return undefined;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const line = 140; // just below the sticky header

      let current = "";
      for (let i = 0; i < ids.length; i += 1) {
        const el = document.getElementById(ids[i]);
        if (!el) continue;
        if (el.getBoundingClientRect().top - line <= 0) current = ids[i];
      }

      // near the very bottom, mark the last section active
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 8;
      if (atBottom && ids.length > 0) current = ids[ids.length - 1];

      setActive(current || ids[0]);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return active;
}