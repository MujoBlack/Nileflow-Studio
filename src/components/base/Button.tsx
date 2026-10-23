import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/base/Icon";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  to?: string;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
  icon?: string;
  iconRight?: boolean;
  disabled?: boolean;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  /** append the "↗" arrow used across the site */
  arrow?: boolean;
}

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[12px]",
  md: "px-5 py-2.5 text-[13px]",
  lg: "px-6 py-3.5 text-[13px] md:px-7",
};

const variants: Record<Variant, string> = {
  primary: "bg-primary-500 text-background-50 hover:bg-primary-400",
  secondary: "border border-white/15 bg-transparent text-foreground-950 hover:bg-background-200",
  inverse: "bg-background-50 text-foreground-950 hover:bg-background-100",
  ghost: "bg-transparent text-foreground-700 hover:text-foreground-950",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  to,
  href,
  type = "button",
  onClick,
  className = "",
  icon,
  iconRight = false,
  disabled = false,
  target,
  rel,
  ariaLabel,
  arrow = false,
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill font-display uppercase tracking-[0.12em]",
    "transition-colors duration-200 cursor-pointer select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60",
    "disabled:cursor-not-allowed disabled:opacity-50",
    sizes[size],
    variants[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const leadingIcon = arrow ? "ri-arrow-right-up-line" : icon;

  const inner = (
    <>
      {leadingIcon && !iconRight && !arrow && (
        <span className="flex h-4 w-4 items-center justify-center">
          <Icon name={leadingIcon} className="text-base" />
        </span>
      )}
      <span>{children}</span>
      {(arrow || (icon && iconRight)) && (
        <span className="flex h-4 w-4 items-center justify-center">
          <Icon name={arrow ? "ri-arrow-right-up-line" : (icon ?? "")} className="text-base" />
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel}>
        {inner}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        aria-label={ariaLabel}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {inner}
    </button>
  );
}