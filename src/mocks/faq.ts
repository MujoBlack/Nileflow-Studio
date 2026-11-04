export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    id: "first-time",
    question: "Never been in a studio. Is that okay?",
    answer:
      "Yes. Most of our sessions are with people recording for the first time. We'll show you around, set the levels and guide every take.",
  },
  {
    id: "bring",
    question: "What should I bring?",
    answer:
      "Your lyrics, your reference tracks on your phone, and any instrument you want to play. Drinks and all studio gear are here.",
  },
  {
    id: "payment",
    question: "How does payment work?",
    answer:
      "You pay a 30% deposit when you book. The rest is due at the end of the session by card or TWINT.",
  },
  {
    id: "reschedule",
    question: "Can I move or cancel my booking?",
    answer:
      "Yes. It's free up to 48 hours before your start time. Inside 48 hours the deposit is kept.",
  },
  {
    id: "find-us",
    question: "How do I find you?",
    answer:
      "Dolderstrasse 71, 8032 Zürich. The studio is in the attic — follow the path to the door and ring the bell.",
  },
];