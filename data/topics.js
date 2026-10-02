// Echo Topic System — centralized topic data
// Designed so Phase 4 can replace this with API calls

export const MOCK_TOPICS = [
  {
    id: "topic-ai",
    name: "AI",
    slug: "ai",
    description: "Artificial intelligence, machine learning, LLMs, and the future of intelligent systems.",
    memberCount: 184200,
    category: "Technology",
  },
  {
    id: "topic-programming",
    name: "Programming",
    slug: "programming",
    description: "Software engineering, algorithms, code quality, and developer culture.",
    memberCount: 312500,
    category: "Technology",
  },
  {
    id: "topic-technology",
    name: "Technology",
    slug: "technology",
    description: "Emerging tech, hardware, semiconductors, and innovation shaping the next decade.",
    memberCount: 428000,
    category: "Technology",
  },
  {
    id: "topic-cybersecurity",
    name: "Cybersecurity",
    slug: "cybersecurity",
    description: "Offensive security, threat intelligence, privacy, and ethical hacking.",
    memberCount: 89300,
    category: "Technology",
  },
  {
    id: "topic-cloud",
    name: "Cloud",
    slug: "cloud",
    description: "AWS, GCP, Azure, distributed systems, and cloud-native architecture.",
    memberCount: 143600,
    category: "Technology",
  },
  {
    id: "topic-gaming",
    name: "Gaming",
    slug: "gaming",
    description: "PC gaming, console gaming, esports, and game culture.",
    memberCount: 267400,
    category: "Gaming",
  },
  {
    id: "topic-gamedev",
    name: "Game Development",
    slug: "game-development",
    description: "Indie dev, Unreal Engine, Unity, game design, and devlogs.",
    memberCount: 98700,
    category: "Gaming",
  },
  {
    id: "topic-startups",
    name: "Startups",
    slug: "startups",
    description: "Founders, bootstrapping, fundraising, SaaS growth, and startup stories.",
    memberCount: 112400,
    category: "Business",
  },
  {
    id: "topic-career",
    name: "Career",
    slug: "career",
    description: "Job hunting, interviews, tech careers, and professional growth.",
    memberCount: 156800,
    category: "Professional",
  },
  {
    id: "topic-design",
    name: "Design",
    slug: "design",
    description: "UI/UX, design systems, typography, and product craft.",
    memberCount: 134200,
    category: "Creative",
  },
  {
    id: "topic-education",
    name: "Education",
    slug: "education",
    description: "Learning, teaching, online courses, and knowledge sharing.",
    memberCount: 201000,
    category: "Learning",
  },
  {
    id: "topic-movies",
    name: "Movies",
    slug: "movies",
    description: "Cinema, directors, screenwriting, and film discussion.",
    memberCount: 78500,
    category: "Entertainment",
  },
  {
    id: "topic-music",
    name: "Music",
    slug: "music",
    description: "Production, listening, genres, artists, and sound design.",
    memberCount: 93200,
    category: "Entertainment",
  },
  {
    id: "topic-sports",
    name: "Sports",
    slug: "sports",
    description: "Athletics, analytics, tactics, and sports culture.",
    memberCount: 68900,
    category: "Sports",
  },
];

export const TOPIC_CATEGORIES = [
  "All",
  "Technology",
  "Gaming",
  "Business",
  "Professional",
  "Creative",
  "Learning",
  "Entertainment",
  "Sports",
];

export function getTopicById(id) {
  return MOCK_TOPICS.find((t) => t.id === id) || null;
}

export function getTopicBySlug(slug) {
  return MOCK_TOPICS.find((t) => t.slug === slug) || null;
}

export function getTopicsByCategory(category) {
  if (category === "All") return MOCK_TOPICS;
  return MOCK_TOPICS.filter((t) => t.category === category);
}
