import { Link } from "react-router-dom";

/**
 * Fixed bottom action on mobile only — the fastest route to /book.
 */
export default function MobileBookBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-background-50/95 backdrop-blur-xl lg:hidden">
      <div className="content-shell flex items-center gap-3 py-3">
        <div className="hidden flex-1 sm:block">
          <p className="text-[13px] font-medium text-foreground-950">Ready to record?</p>
          <p className="text-xs text-foreground-600">Book in under a minute</p>
        </div>
        <Link
          to="/book"
          className="inline-flex w-full flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-primary-500 px-5 py-3 font-display text-[12px] uppercase tracking-[0.12em] text-background-50 transition-colors duration-200 hover:bg-primary-400"
        >
          Book a session
          <i className="ri-arrow-right-up-line text-sm" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}