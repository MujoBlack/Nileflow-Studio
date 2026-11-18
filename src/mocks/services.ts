export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  blurb: string;
  icon: string;
  included: string[];
  cta: string;
  featured?: boolean;
}

/** Fixed-price packages, shown under "Packages" and offered in the quote form. */
export const services: ServiceItem[] = [
  {
    id: "full-song",
    name: "Full Song Bundle",
    price: 400,
    unit: "per song",
    blurb: "One song from start to finish, all made here.",
    icon: "ri-music-2-line",
    included: ["Beat production", "Recording", "Mix and master"],
    cta: "Book this bundle",
    featured: true,
  },
  {
    id: "recording-mix",
    name: "Recording + Mix/Master",
    price: 200,
    unit: "per song",
    blurb: "Bring your own beat and we record your vocals over it.",
    icon: "ri-mic-line",
    included: [
      "Bring your own beat (stems give the best result)",
      "Vocal recording",
      "Mix and master included",
    ],
    cta: "Book this bundle",
  },
  {
    id: "mix-master",
    name: "Mix/Master Bundle",
    price: 150,
    unit: "per song",
    blurb: "Recorded somewhere else? Send us the stems.",
    icon: "ri-equalizer-2-line",
    included: ["Send stems of vocals and beat", "Clean-up", "Mix and master"],
    cta: "Send your files",
  },
];
