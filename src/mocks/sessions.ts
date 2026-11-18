export interface SessionType {
  id: string;
  name: string;
  pricePerHour: number;
  blurb: string;
  detail: string;
  asset: string | null;
  icon: string;
  accentNote: string;
}

export const sessions: SessionType[] = [
  {
    id: "recording",
    name: "Recording session",
    pricePerHour: 45,
    blurb: "Record your vocals with an engineer, and leave with a raw mix of the takes.",
    detail: "For singers and rappers with a beat ready. Recording and a raw mix are included.",
    asset: "sessionVocal",
    icon: "ri-mic-line",
    accentNote: "Raw mix included",
  },
  {
    id: "podcast",
    name: "Podcast & voiceover",
    pricePerHour: 60,
    blurb: "Clean spoken word for ads, audiobooks or a two-person podcast.",
    detail: "Podcast episodes, audiobooks, e-learning and commercial voiceover, edited and levelled.",
    asset: "sessionPodcast",
    icon: "ri-mic-2-line",
    accentNote: "Up to 2 people",
  },
  {
    id: "dry-hire",
    name: "Dry hire",
    pricePerHour: 40,
    blurb: "Bring your laptop and run the room yourself.",
    detail: "For producers who know the room. All gear, mics and the desk are set up and ready.",
    asset: "sessionDryHire",
    icon: "ri-computer-line",
    accentNote: "No engineer",
  },
];