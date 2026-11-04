// Nile Flow House — single source of truth for design tokens.
// Change colours, fonts, spacing, radii and motion here (and in src/index.css +
// tailwind.config.ts) to re-skin the whole site.

export const tokens = {
  colors: {
    // page canvas -> elevated surface
    background: {
      50: "var(--background-50)",
      100: "var(--background-100)",
      200: "var(--background-200)",
      300: "var(--background-300)",
      hairline: "oklch(1 0 0 / 0.08)",
    },
    // text, 950 = primary, 700 = secondary
    foreground: {
      950: "var(--foreground-950)",
      800: "var(--foreground-800)",
      700: "var(--foreground-700)",
      500: "var(--foreground-500)",
    },
    // soft teal accent
    primary: {
      500: "var(--primary-500)",
      400: "var(--primary-400)",
      600: "var(--primary-600)",
      950: "var(--primary-950)",
    },
    accent: {
      500: "var(--accent-500)",
    },
    secondary: {
      500: "var(--secondary-500)",
    },
  },
  fonts: {
    heading: "var(--font-heading)",
    display: "var(--font-display)",
    body: "var(--font-body)",
    label: "var(--font-label)",
  },
  spacing: {
    contentMax: "1384px",
    sectionY: "6rem",
    mobileBarHeight: "4.75rem",
  },
  radius: {
    card: "16px",
    button: "999px",
  },
  motion: {
    reveal: "720ms",
    hover: "200ms",
  },
  price: {
    currency: "CHF",
    depositRate: 0.3,
    minHours: 2,
    cancellationWindowHours: 48,
  },
} as const;

export type DesignTokens = typeof tokens;