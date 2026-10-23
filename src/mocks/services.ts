export interface ServiceItem {
  id: string;
  name: string;
  from?: string;
  blurb: string;
  icon: string;
  included: string[];
}

export const services: ServiceItem[] = [
  {
    id: "mixing-mastering",
    name: "Mixing & Mastering",
    from: "From CHF 250",
    blurb: "Balanced, release-ready mixes and masters for streaming.",
    icon: "ri-equalizer-2-line",
    included: ["2 rounds of changes", "Stems and streaming master", "Delivered in 5–7 days"],
  },
  {
    id: "beats-composition",
    name: "Beats & Composition",
    from: "From CHF 300",
    blurb: "Original instrumentals and toplines written for your project.",
    icon: "ri-music-2-line",
    included: ["Custom beat, not a lease", "Full stems and MIDI", "One revision included"],
  },
  {
    id: "editing",
    name: "Editing & Clean-up",
    from: "From CHF 120",
    blurb: "Vocal tuning, timing, drum editing and noise removal on tracks you recorded elsewhere.",
    icon: "ri-scissors-cut-line",
    included: ["Pitch and timing fixed", "Noise and clicks removed", "Delivered in 3–5 days"],
  },
  {
    id: "audio-film",
    name: "Audio for Film & Video",
    from: "From CHF 300",
    blurb: "Clean, synced sound for ads, short films and social video.",
    icon: "ri-film-line",
    included: ["Dialogue clean-up", "Voiceover recording", "Sound synced to picture"],
  },
];