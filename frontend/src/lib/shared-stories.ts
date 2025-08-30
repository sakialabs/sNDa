export interface MediaItem {
  url: string;
  type?: string;
}

export interface PublicStory {
  id: string;
  title: string;
  content: string;
  author_name: string;
  case_title: string;
  story_type: string;
  tags: string[];
  likes_count: number;
  published_at: string;
  media: (string | MediaItem)[];
}

export const SHARED_STORIES: PublicStory[] = [
  {
    id: "seed-1",
    title: "Smiles After Surgery",
    content:
      "Thanks to quick coordination and donor support, Amal received urgent surgery and is recovering well. The medical team worked around the clock to ensure she had the best care possible.",
    author_name: "Jamal Awad",
    case_title: "Post-op Care - Amal",
    story_type: "success",
    tags: ["health", "surgery", "recovery"],
    likes_count: 12,
    published_at: new Date("2024-01-15").toISOString(),
    media: [],
  },
  {
    id: "seed-2",
    title: "School Supplies Delivered",
    content:
      "Volunteer team delivered backpacks and books to 20 students starting the new term with confidence. Each backpack contained notebooks, pencils, and a special note of encouragement.",
    author_name: "Mona Malik",
    case_title: "Education Support",
    story_type: "progress",
    tags: ["education", "supplies"],
    likes_count: 9,
    published_at: new Date("2024-01-12").toISOString(),
    media: [],
  },
  {
    id: "seed-3",
    title: "A New Beginning for Amira",
    content:
      "When I first met Amira, she was struggling with her studies and feeling isolated. Through our mentorship program, we worked together on building her confidence. Today, she's excelling in school and has made wonderful friends. Seeing her smile and enthusiasm for learning reminds me why I volunteer.",
    author_name: "Sarah Ahmed",
    case_title: "Educational Support - Amira K.",
    story_type: "success",
    tags: ["education", "mentorship", "confidence"],
    likes_count: 24,
    published_at: new Date("2024-01-10").toISOString(),
    media: [],
  },
  {
    id: "seed-4",
    title: "Building Bridges Through Art",
    content:
      "Omar came to us withdrawn and struggling to express himself. We introduced him to art therapy, and the transformation has been incredible. His paintings now tell stories of hope and resilience. Art became his voice when words failed him.",
    author_name: "Layla Mahmoud",
    case_title: "Emotional Support - Omar T.",
    story_type: "breakthrough",
    tags: ["art therapy", "emotional support", "creativity"],
    likes_count: 31,
    published_at: new Date("2024-01-08").toISOString(),
    media: [],
  },
  {
    id: "seed-5",
    title: "From Fear to Friendship",
    content:
      "Nour was afraid to interact with other children due to past trauma. Through patient support and group activities, she slowly opened up. Last week, she organized a small party for her new friends. Her journey from isolation to leadership inspires us all.",
    author_name: "Omar Hassan",
    case_title: "Social Integration - Nour M.",
    story_type: "progress",
    tags: ["social skills", "trauma recovery", "leadership"],
    likes_count: 18,
    published_at: new Date("2024-01-05").toISOString(),
    media: [],
  },
];
