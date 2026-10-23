export interface WhyItem {
  id: string;
  icon: string;
  title: string;
  text: string;
}

export const whyUs: WhyItem[] = [
  {
    id: "whole-space",
    icon: "ri-home-smile-line",
    title: "The whole space is yours",
    text: "Nobody shares your slot. For the hours you book, the attic, the vocal corner and the lounge are yours alone.",
  },
  {
    id: "true-room",
    icon: "ri-sound-module-line",
    title: "A room that tells the truth",
    text: "Acoustic panels and well-placed monitors, so your mix sounds the same in the car as it did here.",
  },
  {
    id: "first-timers",
    icon: "ri-user-voice-line",
    title: "Good with first-timers",
    text: "Never recorded before? We'll set up the mic, explain what's happening and take the pressure off.",
  },
  {
    id: "your-files",
    icon: "ri-download-2-line",
    title: "Leave with your files",
    text: "Every session ends with your stems and a rough mix on your drive.",
  },
];