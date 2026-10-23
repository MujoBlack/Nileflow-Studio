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
    id: "vocal",
    name: "Vocal session",
    pricePerHour: 70,
    blurb: "Record vocals or an overdub, with tuning and editing done as we go.",
    detail: "Ideal for singers, rappers and top-liners who want to leave with a finished vocal take.",
    asset: "sessionVocal",
    icon: "ri-mic-line",
    accentNote: "Engineer included",
  },
  {
    id: "production",
    name: "Production session",
    pricePerHour: 90,
    blurb: "Build a beat or arrangement with a producer at the desk.",
    detail: "Bring an idea, a voice memo or a reference — we shape it into a full production.",
    asset: "production",
    icon: "ri-equalizer-line",
    accentNote: "Producer included",
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