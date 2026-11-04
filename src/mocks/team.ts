export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  asset: string | null;
  icon: string;
  links: { label: string; href: string }[];
  group: "core" | "players";
  instrument?: string;
}

export const team: TeamMember[] = [
  {
    id: "tom",
    name: "Tom Luska (TJ)",
    role: "Founder · Producer & Mix Engineer",
    bio: "Twelve years behind the desk, from hip-hop to indie folk.",
    asset: "team",
    icon: "ri-user-star-line",
    links: [
      { label: "Spotify", href: "https://open.spotify.com/" },
      { label: "Instagram", href: "https://instagram.com/" },
    ],
    group: "core",
  },
  {
    id: "elena",
    name: "Jenva Music",
    role: "Founder · Singer & Songwriter",
    bio: "Writes the hook first, then builds the song around the voice.",
    asset: "teamJenva",
    icon: "ri-user-voice-line",
    links: [{ label: "Instagram", href: "https://instagram.com/" }],
    group: "core",
  },
  {
    id: "player-guitar",
    name: "Sandro Keller",
    role: "Session guitarist",
    bio: "Fingerstyle, ambient textures and tight funk rhythm parts, tracked in-house.",
    asset: null,
    icon: "ri-music-2-line",
    links: [{ label: "Instagram", href: "https://instagram.com/" }],
    group: "players",
    instrument: "Guitar",
  },
  {
    id: "player-keys",
    name: "Nadia Vogel",
    role: "Session keys & strings",
    bio: "Piano, Rhodes and string arrangements for artists who want a warmer record.",
    asset: null,
    icon: "ri-album-line",
    links: [{ label: "Spotify", href: "https://open.spotify.com/" }],
    group: "players",
    instrument: "Keys",
  },
  {
    id: "player-drums",
    name: "Tomas Frei",
    role: "Session drummer",
    bio: "Live drums and percussion, tracked in the room or programmed to match your reference.",
    asset: null,
    icon: "ri-equalizer-line",
    links: [{ label: "YouTube", href: "https://youtube.com/" }],
    group: "players",
    instrument: "Drums",
  },
];