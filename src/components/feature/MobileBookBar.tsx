import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/base/Icon";

/**
 * Fixed bottom action on mobile only — the fastest route to /book.
 * It waits until the hero (which has its own Book button) has scrolled away,
 * and steps aside again once the footer is in view.
 */
export default function MobileBookBar() {
  const [pastHero, setPastHero] = useState(false);
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setPastHero(true);
      return undefined;
    }

    const hero = document.getElementById("top");
    const footer = document.querySelector("footer");

    const heroObserver = new IntersectionObserver(([entry]) =>
      setPastHero(!entry.isIntersecting),
    );
    const footerObserver = new IntersectionObserver(([entry]) =>
      setAtFooter(entry.isIntersecting),
    );

    if (hero) heroObserver.observe(hero);
    else setPastHero(true);
    if (footer) footerObserver.observe(footer);

    return () => {
      heroObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

  const visible = pastHero && !atFooter;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-background-50/95 backdrop-blur-xl transition-transform duration-300 ease-out motion-reduce:transition-none lg:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <div className="content-shell flex items-center gap-3 py-3">
        <div className="hidden flex-1 sm:block">
          <p className="text-[13px] font-medium text-foreground-950">Ready to record?</p>
          <p className="text-xs text-foreground-600">Book in under a minute</p>
        </div>
        <Link
          to="/book"
          tabIndex={visible ? 0 : -1}
          className="inline-flex w-full flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-primary-500 px-5 py-3 font-display text-[12px] uppercase tracking-[0.12em] text-background-50 transition-colors duration-200 hover:bg-primary-400"
        >
          Book a session
          <Icon name="ri-arrow-right-up-line" className="text-sm" />
        </Link>
      </div>
    </div>
  );
}
