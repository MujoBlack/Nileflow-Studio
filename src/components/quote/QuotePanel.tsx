import { useRef, useState } from "react";
import type { FormEvent } from "react";
import usePanelBehavior from "@/hooks/usePanelBehavior";
import { services } from "@/mocks/services";
import { siteInfo } from "@/mocks/site";

const SUBMIT_ADDR = "https://readdy.ai/api/form/dbdmdtr0h265e6qa8s4g";

const SERVICE_OPTIONS = [...services.map((s) => s.name), "Something else"];

const BUDGETS = [
  "Under CHF 250",
  "CHF 250 – 500",
  "CHF 500 – 1,000",
  "CHF 1,000 – 2,500",
  "Over CHF 2,500",
  "Not sure yet",
];

const inputClass =
  "w-full box-border rounded-[10px] border border-white/[0.12] bg-background-100 px-3.5 py-3 text-sm text-foreground-950 placeholder:text-foreground-500 transition-colors duration-200 focus:border-primary-500 focus:outline-none";

interface QuotePanelProps {
  open: boolean;
  initialService?: string | null;
  onClose: () => void;
}

type Status = "idle" | "sending" | "sent" | "error";

export default function QuotePanel({ open, initialService, onClose }: QuotePanelProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  usePanelBehavior(open, onClose, panelRef);

  if (!open) return null;

  const preselected =
    initialService && SERVICE_OPTIONS.includes(initialService) ? initialService : "";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    // honeypot: a real visitor never fills this in
    const trap = String(data.get("company_alt") ?? "").trim();
    if (trap) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    const body = new URLSearchParams();
    data.forEach((value, key) => {
      if (key === "company_alt") return;
      if (typeof value === "string" && value.trim() === "") return;
      body.append(key, String(value));
    });

    try {
      const response = await fetch(SUBMIT_ADDR, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      const responseText = await response.text();

      let parsed: {
        code?: string;
        message?: string;
        meta?: { message?: string; detail?: string };
      } | null = null;
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = null;
      }

      const serverMessage =
        parsed?.meta?.message || parsed?.message || parsed?.meta?.detail || "";
      const isSpam = /spam/i.test(serverMessage) || /spam/i.test(responseText);
      const ok = response.ok && parsed?.code === "OK" && !isSpam;

      if (!ok) {
        setStatus("error");
        setErrorMessage(
          serverMessage ||
            "We couldn't send that just now. Please email us directly and we'll pick it up.",
        );
        return;
      }

      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage(
        "The connection dropped before we got your message. Try again, or email us directly.",
      );
    }
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Ask about a project"
      tabIndex={-1}
      className="panel-enter fixed inset-0 z-[100] overflow-y-auto bg-background-50 outline-none"
    >
      <div className="sticky top-0 z-30 border-b border-white/[0.08] bg-background-50/95 backdrop-blur-xl">
        <div className="content-shell flex items-center justify-between gap-4 py-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary-500">Project work</p>
            <h2 className="headline mt-1 text-[clamp(1.1rem,2.4vw,1.5rem)] text-foreground-950">
              Ask about a project
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close the quote panel"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 text-foreground-700 transition-colors duration-200 hover:bg-background-100 hover:text-foreground-950"
          >
            <i className="ri-close-line text-xl" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="content-shell py-8 md:py-12">
        {status === "sent" ? (
          <div className="mx-auto max-w-[560px] text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-background-50">
              <i className="ri-check-line text-3xl" aria-hidden="true" />
            </span>
            <h3 className="headline mt-6 text-[clamp(1.9rem,4.6vw,3rem)] text-foreground-950">
              Thanks, we&apos;ll <em>be in touch.</em>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-foreground-700">
              Expect a fixed price by email within one working day.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-primary-500 px-6 py-3 font-display text-[12px] uppercase tracking-[0.12em] text-background-50 transition-colors duration-200 hover:bg-primary-400"
            >
              Back to the site
              <i className="ri-arrow-right-up-line text-sm" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
            <div className="min-w-0">
              <h3 className="headline text-[clamp(1.5rem,3.2vw,2.2rem)] text-foreground-950">
                Tell us about <em>the song.</em>
              </h3>
              <p className="mt-3 max-w-[560px] text-sm leading-relaxed text-foreground-700">
                Send the files and a reference or two. We listen first, then reply with a fixed
                price — no hourly guesswork.
              </p>

              <form
                id="quote-panel-form"
                data-readdy-form
                onSubmit={handleSubmit}
                className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2"
                noValidate
              >
                <div className="min-w-0">
                  <label htmlFor="qy-name" className="block text-[11px] uppercase tracking-[0.14em] text-foreground-600">
                    Name
                  </label>
                  <input
                    id="qy-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Camilla Gonzo"
                    className={`mt-2 ${inputClass}`}
                  />
                </div>

                <div className="min-w-0">
                  <label htmlFor="qy-email" className="block text-[11px] uppercase tracking-[0.14em] text-foreground-600">
                    Email
                  </label>
                  <input
                    id="qy-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`mt-2 ${inputClass}`}
                  />
                </div>

                <div className="min-w-0">
                  <label htmlFor="qy-phone" className="block text-[11px] uppercase tracking-[0.14em] text-foreground-600">
                    Phone
                  </label>
                  <input
                    id="qy-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    defaultValue="+41 "
                    placeholder="+41 79 000 00 00"
                    className={`mt-2 ${inputClass}`}
                  />
                </div>

                <div className="min-w-0">
                  <label htmlFor="qy-service" className="block text-[11px] uppercase tracking-[0.14em] text-foreground-600">
                    Service
                  </label>
                  <select
                    id="qy-service"
                    name="service"
                    defaultValue={preselected}
                    className={`mt-2 cursor-pointer ${inputClass}`}
                  >
                    <option value="">Choose a service</option>
                    {SERVICE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0">
                  <label htmlFor="qy-scope" className="block text-[11px] uppercase tracking-[0.14em] text-foreground-600">
                    Songs or minutes
                  </label>
                  <input
                    id="qy-scope"
                    name="scope"
                    type="text"
                    placeholder="2 songs, or about 12 minutes"
                    className={`mt-2 ${inputClass}`}
                  />
                </div>

                <div className="min-w-0">
                  <label htmlFor="qy-deadline" className="block text-[11px] uppercase tracking-[0.14em] text-foreground-600">
                    Deadline
                  </label>
                  <input
                    id="qy-deadline"
                    name="deadline"
                    type="date"
                    className={`mt-2 ${inputClass}`}
                  />
                </div>

                <div className="min-w-0 sm:col-span-2">
                  <label htmlFor="qy-files" className="block text-[11px] uppercase tracking-[0.14em] text-foreground-600">
                    Link to your files
                  </label>
                  <input
                    id="qy-files"
                    name="file_link"
                    type="url"
                    placeholder="Google Drive, WeTransfer or Dropbox link"
                    className={`mt-2 ${inputClass}`}
                  />
                </div>

                <div className="min-w-0 sm:col-span-2">
                  <label htmlFor="qy-references" className="block text-[11px] uppercase tracking-[0.14em] text-foreground-600">
                    Reference tracks
                  </label>
                  <input
                    id="qy-references"
                    name="references"
                    type="text"
                    placeholder="Two or three songs you want it to sit next to"
                    className={`mt-2 ${inputClass}`}
                  />
                </div>

                <div className="min-w-0 sm:col-span-2">
                  <label htmlFor="qy-budget" className="block text-[11px] uppercase tracking-[0.14em] text-foreground-600">
                    Budget
                  </label>
                  <select
                    id="qy-budget"
                    name="budget"
                    defaultValue=""
                    className={`mt-2 cursor-pointer ${inputClass}`}
                  >
                    <option value="">Choose a range</option>
                    {BUDGETS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0 sm:col-span-2">
                  <label htmlFor="qy-message" className="block text-[11px] uppercase tracking-[0.14em] text-foreground-600">
                    Message
                  </label>
                  <textarea
                    id="qy-message"
                    name="message"
                    rows={4}
                    maxLength={500}
                    placeholder="What are you making, and what do you need from us?"
                    className={`mt-2 resize-y ${inputClass}`}
                  />
                </div>

                <input
                  type="text"
                  name="company_alt"
                  className="field-anti-spam"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  readOnly
                />

                {status === "error" && (
                  <div
                    role="alert"
                    className="sm:col-span-2 rounded-[10px] border border-accent-500/40 bg-accent-500/[0.08] px-4 py-3 text-[13px] text-accent-500"
                  >
                    {errorMessage}{" "}
                    <a
                      href={`mailto:${siteInfo.email}`}
                      className="underline underline-offset-2"
                    >
                      {siteInfo.email}
                    </a>
                  </div>
                )}

                <div className="sm:col-span-2 mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-primary-500 px-6 py-3.5 font-display text-[12px] uppercase tracking-[0.12em] text-background-50 transition-colors duration-200 hover:bg-primary-400 disabled:cursor-wait disabled:opacity-70"
                  >
                    {status === "sending" ? "Sending…" : "Send the request"}
                    <i className="ri-arrow-right-up-line text-sm" aria-hidden="true" />
                  </button>
                  <p className="text-[11.5px] leading-relaxed text-foreground-500">
                    We reply within one working day.
                  </p>
                </div>
              </form>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-32 rounded-card border border-white/[0.08] bg-background-100 p-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-foreground-600">
                  How it works
                </p>
                <ol className="mt-3 space-y-3">
                  {[
                    "You send the files and a reference.",
                    "We listen and reply with a fixed price.",
                    "You approve, we start — no hourly surprises.",
                  ].map((line, i) => (
                    <li key={line} className="flex gap-3 text-[12.5px] text-foreground-700">
                      <span className="font-display text-[11px] text-primary-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {line}
                    </li>
                  ))}
                </ol>
                <p className="mt-5 border-t border-white/[0.08] pt-4 text-[12px] text-foreground-600">
                  Prefer email?{" "}
                  <a
                    href={`mailto:${siteInfo.email}`}
                    className="text-primary-500 underline underline-offset-2"
                  >
                    {siteInfo.email}
                  </a>
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}