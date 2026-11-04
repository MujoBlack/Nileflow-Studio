import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useActiveSection from "@/hooks/useActiveSection";
import { scrollToSection } from "@/lib/scroll";
import { siteInfo, siteNav } from "@/mocks/site";
import Icon from "@/components/base/Icon";

const SECTION_IDS = siteNav.map((item) => item.hash);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const go = (hash: string) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(() => scrollToSection(hash), 90);
      return;
    }
    window.setTimeout(() => scrollToSection(hash), 20);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-white/[0.08] bg-background-50/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="content-shell flex h-16 items-center justify-between md:h-[72px]">
        <Link
          to="/"
          onClick={(event) => {
            event.preventDefault();
            setOpen(false);
            if (location.pathname !== "/") navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2.5"
          aria-label={`${siteInfo.name} home`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-background-100">
            <Icon name="ri-water-flash-line" className="text-base text-primary-500" />
          </span>
          <span className="font-heading text-[15px] font-semibold tracking-tight text-foreground-950">
            {siteInfo.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {siteNav.map((item) => {
            const isActive = active === item.hash;
            return (
              <a
                key={item.hash}
                href={`#${item.hash}`}
                onClick={(event) => {
                  event.preventDefault();
                  go(item.hash);
                }}
                aria-current={isActive ? "true" : undefined}
                className={`text-sm transition-colors duration-200 ${
                  isActive ? "text-primary-500" : "text-foreground-700 hover:text-foreground-950"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center lg:flex">
          <Link
            to="/book"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-pill bg-primary-500 px-5 py-2.5 font-display text-[12px] uppercase tracking-[0.12em] text-background-50 transition-colors duration-200 hover:bg-primary-400"
          >
            Book a session
            <Icon name="ri-arrow-right-up-line" className="text-sm" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-foreground-950 lg:hidden"
        >
          <Icon name={open ? "ri-close-line" : "ri-menu-line"} className="text-xl" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-[45] flex flex-col bg-background-50 md:top-[72px] lg:hidden">
          <nav
            aria-label="Mobile"
            className="content-shell flex flex-1 flex-col justify-center gap-1 overflow-y-auto py-8"
          >
            {siteNav.map((item, i) => (
              <a
                key={item.hash}
                href={`#${item.hash}`}
                onClick={(event) => {
                  event.preventDefault();
                  go(item.hash);
                }}
                className="group flex items-baseline gap-4 border-b border-white/[0.06] py-3.5"
              >
                <span className="font-display text-[10px] uppercase tracking-[0.16em] text-foreground-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`headline text-[clamp(1.7rem,7vw,2.4rem)] transition-colors duration-200 ${
                    active === item.hash
                      ? "text-primary-500"
                      : "text-foreground-950 group-hover:text-primary-500"
                  }`}
                >
                  {item.label}
                </span>
              </a>
            ))}
          </nav>

          <div className="content-shell pb-8 pt-4">
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-primary-500 px-6 py-4 font-display text-[13px] uppercase tracking-[0.12em] text-background-50 transition-colors duration-200 hover:bg-primary-400"
            >
              Book a session
              <Icon name="ri-arrow-right-up-line" className="text-base" />
            </Link>
            <p className="mt-3 text-center text-[11px] uppercase tracking-[0.14em] text-foreground-600">
              {siteInfo.phone} · {siteInfo.email}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}