import { studioImages } from "@/design/assets";

export interface TourPhoto {
  src: string;
  title: string;
  caption: string;
  alt: string;
}

/** The photo tour shown from "See the room" and the room section, in walking order. */
export const tourPhotos: TourPhoto[] = [
  {
    src: studioImages.path,
    title: "The way in",
    caption: "A quiet tree-lined path up to the studio.",
    alt: "Tree-lined footpath along a stone wall leading to the Nile Flow House studio",
  },
  {
    src: studioImages.guitar,
    title: "The room",
    caption: "One attic room: the desk ahead, the vocal corner to the left.",
    alt: "The studio room seen from the door, with the guitar corner on the left and the control desk ahead",
  },
  {
    src: studioImages.producerDesk,
    title: "The desk",
    caption: "Where the engineer sits with you for the whole session.",
    alt: "Producer working at the control desk between two studio monitors",
  },
  {
    src: studioImages.whyDetail,
    title: "The desk mic",
    caption: "A condenser mic ready for quick ideas at the desk.",
    alt: "Condenser microphone with a pop filter in front of a studio monitor",
  },
  {
    src: studioImages.vocalCorner,
    title: "The vocal corner",
    caption: "Treated walls and a proper vocal mic for takes that sit right.",
    alt: "The treated vocal corner with a microphone, guitar and amp",
  },
  {
    src: studioImages.sessionPodcast,
    title: "The lounge",
    caption: "Sofa, coffee table and two mics for podcasts and listening back.",
    alt: "Warm lounge with a sofa, coffee table and two podcast microphones",
  },
  {
    src: studioImages.sessionDryHire,
    title: "Dry hire",
    caption: "Bring your laptop and run the room yourself.",
    alt: "The empty studio desk with monitors, keyboard and two chairs",
  },
];

export const TOUR_EVENT = "nfh:open-tour";

/** Open the photo tour from anywhere on the page, optionally at a given photo. */
export function openTour(index = 0) {
  window.dispatchEvent(new CustomEvent<number>(TOUR_EVENT, { detail: index }));
}
