// Echo Rooms — mock live room data
// No image URLs for speakers/hosts — use InitialsAvatar from name
// Phase 4: replace with real-time room data from backend

export const MOCK_ROOMS = [
  {
    id: "room-101",
    title: "The Future of Web Engines & Edge Runtimes",
    communityId: "fullstack-builders",
    communityName: "Fullstack Builders",
    topicId: "topic-programming",
    category: "Programming",
    status: "live",
    startedAt: "35m ago",
    listenersCount: 428,
    host: { name: "Elena Rostova", username: "elena_dev" },
    speakers: [
      { name: "Elena Rostova", username: "elena_dev", isSpeaking: true },
      { name: "Marcus Vance", username: "marcus_v", isSpeaking: false },
      { name: "Aisha Patel", username: "aisha_p", isSpeaking: true },
      { name: "Devon Clark", username: "devon_c", isSpeaking: false },
    ],
    tags: ["Next.js", "WebAssembly", "Serverless"],
    summary: "Deep architectural breakdown of micro-frontends, edge worker latency, and bundling innovations.",
  },
  {
    id: "room-102",
    title: "Indie Game Pitch & Art Feedback Live Stage",
    communityId: "game-dev-hub",
    communityName: "Game Dev & Design",
    topicId: "topic-gamedev",
    category: "Gaming",
    status: "live",
    startedAt: "1h 10m ago",
    listenersCount: 312,
    host: { name: "Kenji Sato", username: "kenjigames" },
    speakers: [
      { name: "Kenji Sato", username: "kenjigames", isSpeaking: false },
      { name: "Chloe Dupont", username: "chloe_d", isSpeaking: true },
      { name: "Liam O'Connor", username: "liam_oc", isSpeaking: false },
    ],
    tags: ["Unreal Engine 5", "Pixel Art", "Steam Launch"],
    summary: "Developers share live gameplay clips and receive critique on lighting, game feel, and marketing hooks.",
  },
  {
    id: "room-103",
    title: "Scaling SaaS from $10k to $100k MRR: Honest War Stories",
    communityId: "founder-stories",
    communityName: "Founders & Startups",
    topicId: "topic-startups",
    category: "Startups",
    status: "live",
    startedAt: "18m ago",
    listenersCount: 589,
    host: { name: "Samantha Reed", username: "sam_founder" },
    speakers: [
      { name: "Samantha Reed", username: "sam_founder", isSpeaking: true },
      { name: "Tariq Mansoor", username: "tariq_m", isSpeaking: false },
      { name: "Jessica Wu", username: "jessica_w", isSpeaking: false },
    ],
    tags: ["Bootstrapping", "Pricing", "Customer Retention"],
    summary: "Founders open up their dashboards, discussing churn reduction, sales pipelines, and pricing experiments.",
  },
  {
    id: "room-104",
    title: "Design Tokens & Variable Typography in 2026",
    communityId: "ui-ux-craft",
    communityName: "UI/UX & Product Design",
    topicId: "topic-design",
    category: "Design",
    status: "upcoming",
    scheduledFor: "Today at 6:00 PM EST",
    listenersCount: 145,
    host: { name: "Mateo Alvarez", username: "mateo_design" },
    speakers: [
      { name: "Mateo Alvarez", username: "mateo_design", isSpeaking: false },
      { name: "Nadia Silva", username: "nadia_s", isSpeaking: false },
    ],
    tags: ["Figma Tokens", "Design System", "CSS Variables"],
    summary: "Bridging the gap between Figma design variables and CSS custom properties in multi-brand systems.",
  },
  {
    id: "room-105",
    title: "Autonomous Agents & Multi-Modal Foundation Models",
    communityId: "tech-innovators",
    communityName: "Tech Innovators",
    topicId: "topic-ai",
    category: "Technology",
    status: "upcoming",
    scheduledFor: "Tomorrow at 2:00 PM EST",
    listenersCount: 380,
    host: { name: "Dr. Aris Thorne", username: "aris_ai" },
    speakers: [
      { name: "Dr. Aris Thorne", username: "aris_ai", isSpeaking: false },
    ],
    tags: ["LLMs", "Agentic Systems", "Reinforcement Learning"],
    summary: "Exploring test-time compute, reasoning frameworks, and autonomous multi-agent tool use.",
  },
  {
    id: "room-106",
    title: "Will AI Replace Junior Developers? Panel Discussion",
    communityId: "ai-engineering",
    communityName: "AI Engineering",
    topicId: "topic-ai",
    category: "Technology",
    status: "live",
    startedAt: "55m ago",
    listenersCount: 762,
    host: { name: "Farhan Vance", username: "farhan" },
    speakers: [
      { name: "Farhan Vance", username: "farhan", isSpeaking: true },
      { name: "Elena Rostova", username: "elena_dev", isSpeaking: false },
      { name: "Dr. Aris Thorne", username: "aris_ai", isSpeaking: true },
      { name: "Priya Nair", username: "priya_n", isSpeaking: false },
    ],
    tags: ["AI", "Career", "Engineering"],
    summary: "A nuanced panel on how AI tooling is reshaping entry-level software engineering roles.",
  },
  {
    id: "room-107",
    title: "System Design Interview Prep — Live Mock Session",
    communityId: "fullstack-builders",
    communityName: "Fullstack Builders",
    topicId: "topic-career",
    category: "Career",
    status: "live",
    startedAt: "2h ago",
    listenersCount: 241,
    host: { name: "Marcus Vance", username: "marcus_v" },
    speakers: [
      { name: "Marcus Vance", username: "marcus_v", isSpeaking: true },
      { name: "Aisha Patel", username: "aisha_p", isSpeaking: false },
    ],
    tags: ["System Design", "Interviews", "Career"],
    summary: "Live mock system design interviews with real-time feedback. Viewer questions welcome.",
  },
  {
    id: "room-108",
    title: "Cybersecurity in 2026: Zero Trust & AI-Driven Threats",
    communityId: "tech-innovators",
    communityName: "Tech Innovators",
    topicId: "topic-cybersecurity",
    category: "Technology",
    status: "live",
    startedAt: "28m ago",
    listenersCount: 189,
    host: { name: "Devon Clark", username: "devon_c" },
    speakers: [
      { name: "Devon Clark", username: "devon_c", isSpeaking: true },
      { name: "Priya Nair", username: "priya_n", isSpeaking: true },
    ],
    tags: ["Cybersecurity", "Zero Trust", "AI"],
    summary: "How AI-driven phishing, deepfakes, and automated exploits are reshaping enterprise security posture.",
  },
];

export function getRoomsByTopic(topicId) {
  return MOCK_ROOMS.filter((r) => r.topicId === topicId);
}

export function getRoomsByCommunity(communityId) {
  return MOCK_ROOMS.filter((r) => r.communityId === communityId);
}

export function getLiveRooms() {
  return MOCK_ROOMS.filter((r) => r.status === "live").sort(
    (a, b) => b.listenersCount - a.listenersCount
  );
}

export function getPopularRooms() {
  return [...MOCK_ROOMS].sort((a, b) => b.listenersCount - a.listenersCount);
}

export function searchRooms(query) {
  const q = query.toLowerCase();
  return MOCK_ROOMS.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.communityName.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q))
  );
}
