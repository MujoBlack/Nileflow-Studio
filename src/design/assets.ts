// Photos uploaded by the studio owner. ONLY these are used on the site.
// If an image is replaced later, update the URL here.
//
// Each photo is used in at most two places on the page. The comment next to
// each one lists where it belongs, so a future swap is a one-line change.

export const studioImages = {
  // 01 — hero background + "Ready when you are" inner left column
  hero: "https://d8j0ntlcm91z4.cloudfront.net/user_3HAwmNr1wDyIvlf27Ibx2ykuA9i/hf_20261023_162814_cb0e9688-38bf-4728-a021-8abccb0cd4e4.png",
  // 02 — "One room, set up properly" only
  studioMain:
    "https://storage.helloreaddy.io/project_files/7f65a54c-4f7a-4c7b-a4c8-4f20c0a8879b/9e94a2f8-95bd-4b6b-a686-f92bcedb00cd_compressed_02-studio-wide-desk-keyboard.webp",
  // 04 — hero tour card + "Ready when you are" inner right column
  guitar:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3HAwmNr1wDyIvlf27Ibx2ykuA9i/hf_20261023_162814_1311f115-6f45-47ad-ab8b-995de4bcb964.png",
  // 05 tidy — "Why here" + "Ready when you are" inner left column
  vocalCorner:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3HAwmNr1wDyIvlf27Ibx2ykuA9i/hf_20261023_152705_96c974a5-560c-4ffd-bbba-36dc029002ec.png",
  // 06 (portrait) — production session card
  production:
    "https://storage.helloreaddy.io/project_files/7f65a54c-4f7a-4c7b-a4c8-4f20c0a8879b/e060cad9-b758-4511-b079-76a7fb4a8f15_compressed_06-producer-at-desk-portrait.webp",
  // 06 tidy — "Ready when you are" inner right column
  producerDesk:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3HAwmNr1wDyIvlf27Ibx2ykuA9i/hf_20261023_162814_5e668fe8-ac48-47ee-94b6-c3369c40f4a5.png",
  // 07 tidy — team page card + one dimmed column in "Ready when you are"
  team: "https://d8j0ntlcm91z4.cloudfront.net/user_3HAwmNr1wDyIvlf27Ibx2ykuA9i/hf_20261023_162814_8ba7ab23-46c3-4abe-84e6-e0eef4bdeaf6.png",
  teamJenva:
    "https://storage.helloreaddy.io/project_files/7f65a54c-4f7a-4c7b-a4c8-4f20c0a8879b/ae4edf3b-dc80-4643-81c7-2208ad957505_compressed_IMG_0609.webp",
  // 09 tidy — one dimmed column in "Ready when you are"
  path: "https://d8j0ntlcm91z4.cloudfront.net/user_3HAwmNr1wDyIvlf27Ibx2ykuA9i/hf_20261023_162814_a6c325d0-b23c-41a2-88e5-a834698ffeb7.png",
  frontDoor:
    "https://storage.helloreaddy.io/project_files/7f65a54c-4f7a-4c7b-a4c8-4f20c0a8879b/64d6e70f-6baa-4ceb-9a0d-fff494f510ef_compressed_13-front-door.webp",
  // session card photos supplied by the studio
  // vocal corner in warm light — vocal session card + one dimmed column in the CTA
  sessionVocal:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3HAwmNr1wDyIvlf27Ibx2ykuA9i/hf_20261023_151049_a881c2b6-0864-43b0-a2e2-cb075b086505.png",
  // podcast lounge — podcast session card + inner left column in the CTA
  sessionPodcast:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3HAwmNr1wDyIvlf27Ibx2ykuA9i/hf_20261023_153840_94966531-dbb7-4e29-873a-1da8aeb93519.png",
  // dry hire, decluttered — dry hire session card + inner right column in the CTA
  sessionDryHire:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3HAwmNr1wDyIvlf27Ibx2ykuA9i/hf_20261023_154436_75be19b7-015d-43e8-a4d9-db1fa88a7d31.png",
};

// key -> image, used to resolve a photo for a card without importing here from mocks
export const imageByKey: Record<string, string> = {
  hero: studioImages.hero,
  studioMain: studioImages.studioMain,
  guitar: studioImages.guitar,
  vocalCorner: studioImages.vocalCorner,
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