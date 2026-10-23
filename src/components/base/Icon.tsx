import type { ComponentType, SVGProps } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Calendar,
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  CreditCard,
  Disc3,
  Download,
  ExternalLink,
  Film,
  House,
  Images,
  Info,
  Instagram,
  Laptop,
  LayoutDashboard,
  ListChecks,
  LoaderCircle,
  Lock,
  Mail,
  MailCheck,
  Menu,
  Mic,
  MicVocal,
  Minus,
  Music2,
  Pause,
  Play,
  Plus,
  Quote,
  RefreshCw,
  Scissors,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  SlidersVertical,
  Smartphone,
  Star,
  Tag,
  Undo2,
  Unlink,
  UserRound,
  UserRoundCheck,
  Waves,
  X,
  Youtube,
} from "lucide-react";

type SvgIcon = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

/* Brand marks lucide doesn't ship, drawn as filled 24px glyphs. */
function brand(path: string): SvgIcon {
  return function BrandIcon(props) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d={path} />
      </svg>
    );
  };
}

const WhatsApp = brand(
  "M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.5 5.5 5.6-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.3.9.9-3.2-.2-.3a8.2 8.2 0 1 1 7.2 4Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z",
);
const TikTok = brand(
  "M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z",
);
const Spotify = brand(
  "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.6.6 0 0 1-.9.2c-2.3-1.4-5.3-1.8-8.8-1a.6.6 0 1 1-.3-1.2c3.8-.9 7.1-.5 9.7 1.1.3.2.4.6.3.9Zm1.2-2.7a.8.8 0 0 1-1.1.3c-2.7-1.6-6.8-2.1-9.9-1.2a.8.8 0 1 1-.5-1.5c3.6-1.1 8.1-.6 11.2 1.3.4.2.5.7.3 1.1Zm.1-2.8C14.7 9 9.4 8.8 6.3 9.7a1 1 0 1 1-.5-1.8c3.6-1.1 9.4-.9 13.1 1.3a1 1 0 0 1-1 1.7Z",
);

/* Remix Icon names used across the site, mapped to bundled icons so nothing
   depends on an icon-font CDN. Keep the ri-* keys so content files read the same. */
const ICONS: Record<string, SvgIcon> = {
  "ri-add-line": Plus,
  "ri-album-line": Disc3,
  "ri-arrow-down-s-line": ChevronDown,
  "ri-arrow-left-line": ArrowLeft,
  "ri-arrow-left-s-line": ChevronLeft,
  "ri-arrow-right-line": ArrowRight,
  "ri-arrow-right-s-line": ChevronRight,
  "ri-arrow-right-up-line": ArrowUpRight,
  "ri-arrow-up-s-line": ChevronUp,
  "ri-bank-card-line": CreditCard,
  "ri-calendar-2-line": CalendarDays,
  "ri-calendar-check-line": CalendarCheck,
  "ri-calendar-line": Calendar,
  "ri-check-line": Check,
  "ri-close-line": X,
  "ri-computer-line": Laptop,
  "ri-dashboard-line": LayoutDashboard,
  "ri-double-quotes-l": Quote,
  "ri-download-2-line": Download,
  "ri-equalizer-2-line": SlidersVertical,
  "ri-equalizer-line": SlidersHorizontal,
  "ri-external-link-line": ExternalLink,
  "ri-film-line": Film,
  "ri-home-smile-line": House,
  "ri-image-line": Images,
  "ri-information-line": Info,
  "ri-instagram-line": Instagram,
  "ri-link-unlink": Unlink,
  "ri-list-check-2": ListChecks,
  "ri-loader-4-line": LoaderCircle,
  "ri-lock-2-line": Lock,
  "ri-mail-check-line": MailCheck,
  "ri-mail-line": Mail,
  "ri-menu-line": Menu,
  "ri-mic-2-line": MicVocal,
  "ri-mic-line": Mic,
  "ri-music-2-line": Music2,
  "ri-pause-fill": Pause,
  "ri-play-fill": Play,
  "ri-price-tag-3-line": Tag,
  "ri-refresh-line": RefreshCw,
  "ri-refund-2-line": Undo2,
  "ri-scissors-cut-line": Scissors,
  "ri-settings-3-line": Settings,
  "ri-shield-check-line": ShieldCheck,
  "ri-smartphone-line": Smartphone,
  "ri-sound-module-line": AudioLines,
  "ri-spotify-fill": Spotify,
  "ri-spotify-line": Spotify,
  "ri-star-fill": Star,
  "ri-subtract-line": Minus,
  "ri-tiktok-line": TikTok,
  "ri-time-line": Clock,
  "ri-user-star-line": UserRoundCheck,
  "ri-user-voice-line": UserRound,
  "ri-water-flash-line": Waves,
  "ri-whatsapp-line": WhatsApp,
  "ri-youtube-line": Youtube,
};

const FILLED = new Set(["ri-play-fill", "ri-pause-fill", "ri-star-fill"]);

interface IconProps {
  name: string;
  className?: string;
}

/**
 * Inline SVG icon sized by font-size (1em), so existing `text-*` classes keep
 * working. Decorative only: always hidden from assistive tech.
 */
export default function Icon({ name, className = "" }: IconProps) {
  const Glyph = ICONS[name];
  if (!Glyph) return null;
  const filled = FILLED.has(name);
  return (
    <Glyph
      aria-hidden="true"
      focusable="false"
      width="1em"
      height="1em"
      strokeWidth={1.8}
      fill={filled ? "currentColor" : undefined}
      className={`inline-block shrink-0 align-[-0.125em] ${className}`}
    />
  );
}
