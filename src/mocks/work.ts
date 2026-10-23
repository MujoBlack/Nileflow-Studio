export interface Release {
  id: string;
  artist: string;
  title: string;
  role: string;
  year: string;
  runtime: string;
  spotify: string;
  coverTone: string;
  /** Spotify track id used by the in-page player. */
  spotifyTrackId: string;
  /** Album art taken from Spotify. */
  coverArt: string;
}

export const releases: Release[] = [
  {
    id: "nf-01",
    artist: "Selane",
    title: "BOX DYED",
    role: "Recorded & produced",
    year: "2026",
    runtime: "Single",
    spotify: "https://open.spotify.com/track/2Aj00400TrCFDtEL8s1ABb",
    coverTone: "from-primary-950 to-background-100",
    spotifyTrackId: "2Aj00400TrCFDtEL8s1ABb",
    coverArt: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02ba6ac6b183a09a50f22f0336",
  },
  {
    id: "nf-02",
    artist: "MARDO, Tee J",
    title: "TRAUMATIC HABITS",
    role: "Recorded & produced",
    year: "2026",
    runtime: "Single",
    spotify: "https://open.spotify.com/track/17lXzDsAlZDheCMNnYLn9e",
    coverTone: "from-secondary-100 to-background-100",
    spotifyTrackId: "17lXzDsAlZDheCMNnYLn9e",
    coverArt: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02f3bb0cee4464447b2eb3b286",
  },
  {
    id: "nf-03",
    artist: "Jenva, Tee J",
    title: "BE MY LOVER FOR LIFE",
    role: "Recorded & produced",
    year: "2026",
    runtime: "Single",
    spotify: "https://open.spotify.com/track/1iPOy4rAGVMBm3OU6iW7Tz",
    coverTone: "from-accent-100 to-background-100",
    spotifyTrackId: "1iPOy4rAGVMBm3OU6iW7Tz",
    coverArt: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e028acfd4348981c0289fdd7794",
  },
];

