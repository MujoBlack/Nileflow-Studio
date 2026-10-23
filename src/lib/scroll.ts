/** Sticky header height plus a little breathing room. */
export const SCROLL_OFFSET = 90;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

/**
 * Jumps to a section on the one-page layout, leaving room for the sticky header.
 */
export function scrollToSection(id: string, offset = SCROLL_OFFSET): boolean {
  const el = document.getElementById(id);
  if (!el) return false;

  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({
    top: Math.max(top, 0),
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
  return true;
}