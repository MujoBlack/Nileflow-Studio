import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SilkSheen from "@/components/base/SilkSheen";
import { scrollToSection } from "@/lib/scroll";
import { footerPages, legalCopy, openingHours, siteInfo, socialLinks } from "@/mocks/site";

type LegalKey = "privacy" | "terms";

export default function Footer() {
  const year = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();
  const [legal, setLegal] = useState<LegalKey | null>(null);

  useEffect(() => {
    if (!legal) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLegal(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [legal]);

  const go = (hash: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(() => scrollToSection(hash), 90);
      return;
    }
    scrollToSection(hash);
  };

  const copy = legal ? legalCopy[legal] : null;

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-primary-950/40">
      <SilkSheen />

      <div className="content-shell relative z-10 py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-background-100">
                <i className="ri-water-flash-line text-base text-primary-500" aria-hidden="true" />
              </span>
              <span className="font-heading text-[15px] font-semibold text-foreground-950">
                {siteInfo.name}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-foreground-700">
              A small recording and production studio in an attic in {siteInfo.city}.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-foreground-700 transition-colors duration-200 hover:border-primary-500/50 hover:text-primary-500"
                >
                  <i className={`${s.icon} text-lg`} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-[11px] uppercase tracking-[0.18em] text-foreground-950">
              Pages
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 md:grid-cols-1">
              {footerPages.map((p) => (
                <li key={p.hash}>
                  <a
                    href={`#${p.hash}`}
                    onClick={(event) => {
                      event.preventDefault();
                      go(p.hash);
                    }}
                    className="text-sm text-foreground-700 transition-colors duration-200 hover:text-primary-500"
                  >
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-[11px] uppercase tracking-[0.18em] text-foreground-950">
              Opening hours
            </h3>
            <ul className="mt-4 space-y-2.5">
              {openingHours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4 text-sm">
                  <span className="text-foreground-700">{h.day}</span>
                  <span className="text-foreground-950">{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-[11px] uppercase tracking-[0.18em] text-foreground-950">
              Visit &amp; contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="text-foreground-700">
                {siteInfo.addressLine1}
                <br />
                {siteInfo.addressLine2}
              </li>
              <li>
                <a
                  href={`mailto:${siteInfo.email}`}
                  className="text-foreground-700 transition-colors duration-200 hover:text-primary-500"
                >
                  {siteInfo.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteInfo.phoneHref}`}
                  className="text-foreground-700 transition-colors duration-200 hover:text-primary-500"
                >
                  {siteInfo.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${siteInfo.whatsappHref}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-foreground-700 transition-colors duration-200 hover:text-primary-500"
                >
                  <i className="ri-whatsapp-line text-base" aria-hidden="true" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative z-20 mt-12 flex flex-col gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-foreground-600">
            © {year} {siteInfo.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-5">
            <button
              type="button"
              onClick={() => setLegal("privacy")}
              className="cursor-pointer text-xs text-foreground-600 transition-colors duration-200 hover:text-foreground-950"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => setLegal("terms")}
              className="cursor-pointer text-xs text-foreground-600 transition-colors duration-200 hover:text-foreground-950"
            >
              Terms
            </button>
            <Link
              to="/book"
              className="text-xs text-foreground-600 transition-colors duration-200 hover:text-foreground-950"
            >
              Book
            </Link>
          </div>
        </div>
      </div>

      {/* giant faded wordmark closing the page */}
      <div className="relative z-10 w-full overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
          style={{
            background:
              "radial-gradient(ellipse at 50% 130%, oklch(var(--primary-500) / 0.3), transparent 72%)",
          }}
          aria-hidden="true"
        />
        <p
          className="headline relative select-none whitespace-nowrap px-2 text-center text-[clamp(1.9rem,9.6vw,9rem)] leading-[0.78] text-white/[0.04]"
          aria-hidden="true"
        >
          {siteInfo.name}
        </p>
      </div>

      {/* privacy / terms text panel */}
      {legal && copy && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-8">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setLegal(null)}
            className="absolute inset-0 cursor-pointer bg-background-50/85 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={copy.title}
            className="panel-enter relative z-10 max-h-[80vh] w-full max-w-[560px] overflow-y-auto rounded-card border border-white/[0.1] bg-background-100 p-6 md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="headline text-[clamp(1.4rem,3.4vw,2rem)] text-foreground-950">
                {copy.title}
              </h2>
              <button
                type="button"
                onClick={() => setLegal(null)}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 text-foreground-700 transition-colors hover:bg-background-200 hover:text-foreground-950"
              >
                <i className="ri-close-line text-lg" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-5 space-y-3.5">
              {copy.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="text-[13px] leading-relaxed text-foreground-700">
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-6 border-t border-white/[0.08] pt-4 text-[11.5px] text-foreground-500">
              Questions? {siteInfo.email}
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}