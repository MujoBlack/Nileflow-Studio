export interface Review {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
  rating: number;
  placeholder?: boolean;
}

export const reviews: Review[] = [
  {
    id: "r1",
    quote:
      "As a first time in the studio recording my first song, all I can say is that they are so good. The producer is so calm and he can literally create any type of beat, so I think my musical career begins here 👍",
    name: "Camilla Gonzo",
    role: "Google review",
    initials: "CG",
    rating: 5,
  },
  {
    id: "r2",
    quote:
      "Had a great experience at Nile Flow House! TJ is seriously talented at what he does, and you can tell he knows his craft. Great creative space for anything audio. Definitely recommend checking it out!",
    name: "Calvin",
    role: "Google review",
    initials: "C",
    rating: 5,
  },
  {
    id: "r3",
    quote: "",
    name: "",
    role: "",
    initials: "",
    rating: 5,
    placeholder: true,
  },
];