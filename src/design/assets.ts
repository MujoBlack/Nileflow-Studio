// Photos uploaded by the studio owner. ONLY these are used on the site.
// They live in public/images as WebP at two widths (-800 and -1600); to
// replace one, drop in both files under the same name.
//
// Each photo is used in at most two places on the page. The comment next to
// each one lists where it belongs, so a future swap is a one-line change.

export const studioImages = {
  // 01 — hero background + "Ready when you are" inner left column
  hero: "/images/hero-1600.webp",
  // 02 — "One room, set up properly" only
  studioMain: "/images/studio-main-1600.webp",
  // 04 — hero tour card + "Ready when you are" inner right column
  guitar: "/images/guitar-1600.webp",
  // detail of the desk microphone and monitor — "Why here" only
  whyDetail: "/images/why-detail-1600.webp",
  // 05 tidy — "Ready when you are" inner left column
  vocalCorner: "/images/vocal-corner-1600.webp",
  // 06 (portrait) — production session card
  production: "/images/production-1600.webp",
  // 06 tidy — "Ready when you are" inner right column
  producerDesk: "/images/producer-desk-1600.webp",
  // 07 tidy — team page card + one dimmed column in "Ready when you are"
  team: "/images/team-1600.webp",
  teamJenva: "/images/team-jenva-1600.webp",
  // 09 tidy — one dimmed column in "Ready when you are"
  path: "/images/path-1600.webp",
  frontDoor: "/images/front-door-1600.webp",
  // session card photos supplied by the studio
  // vocal corner in warm light — vocal session card + one dimmed column in the CTA
  sessionVocal: "/images/session-vocal-1600.webp",
  // podcast lounge — podcast session card + inner left column in the CTA
  sessionPodcast: "/images/session-podcast-1600.webp",
  // dry hire, decluttered — dry hire session card + inner right column in the CTA
  sessionDryHire: "/images/session-dry-hire-1600.webp",
};

// key -> image, used to resolve a photo for a card without importing here from mocks
export const imageByKey: Record<string, string> = {
  hero: studioImages.hero,
  studioMain: studioImages.studioMain,
  guitar: studioImages.guitar,
  vocalCorner: studioImages.vocalCorner,
  whyDetail: studioImages.whyDetail,
  production: studioImages.production,
  producerDesk: studioImages.producerDesk,
  team: studioImages.team,
  teamJenva: studioImages.teamJenva,
  path: studioImages.path,
  frontDoor: studioImages.frontDoor,
  sessionVocal: studioImages.sessionVocal,
  sessionPodcast: studioImages.sessionPodcast,
  sessionDryHire: studioImages.sessionDryHire,
};
/** `srcset` for a local photo: the 800px and 1600px WebP versions. */
export function srcSetFor(src: string): string | undefined {
  if (!src.endsWith("-1600.webp")) return undefined;
  return `${src.replace("-1600.webp", "-800.webp")} 800w, ${src} 1600w`;
}
