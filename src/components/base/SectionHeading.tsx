import type { ReactNode } from "react";
import Reveal from "@/components/base/Reveal";

interface SectionHeadingProps {
  label: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
  aside?: ReactNode;
}

export default function SectionHeading({
  label,
  title,
  description,
  align = "center",
  className = "",
  aside,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <Reveal className={className}>
      <div className={`flex w-full flex-col gap-6 ${centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
        <div className={centered ? "mx-auto max-w-3xl" : "max-w-2xl"}>
          <span className="label-eyebrow block">{label}</span>
          <h2 className="headline mt-3.5 text-[clamp(1.9rem,4.6vw,3.4rem)] text-foreground-950">
            {title}
          </h2>
          {description && (
            <p
              className={`mt-5 max-w-[640px] text-[15px] leading-relaxed text-foreground-700 ${
                centered ? "mx-auto" : ""
              }`}
            >
              {description}
            </p>
          )}
        </div>
        {aside && <div className={centered ? "" : "shrink-0"}>{aside}</div>}
      </div>
    </Reveal>
  );
}