// Echo Communities — discovery-focused, no image URLs
// Phase 4: replace with API calls

export const MOCK_COMMUNITIES = [
  {
    id: "tech-innovators",
    name: "Tech Innovators",
    handle: "c/techinnovators",
    category: "Technology",
    topicId: "topic-technology",
    description: "Discussing emerging tech, AI breakthroughs, quantum computing, and hardware innovations shaping the next decade.",
    membersCount: 142800,
    onlineCount: 2340,
    rules: [
      "Keep technical discussions evidence-based.",
      "No spam or unsolicited promotional links.",
      "Respect differing engineering viewpoints.",
    ],
    tags: ["AI", "Robotics", "Hardware", "Semiconductors"],
  },
  {
    id: "game-dev-hub",
    name: "Game Dev & Design",
    handle: "c/gamedev",
    category: "Gaming",
    topicId: "topic-gamedev",
    description: "A collective of indie developers, 3D artists, Unreal/Unity engineers, and game designers sharing devlogs and feedback.",
    membersCount: 89400,
    onlineCount: 1120,
    rules: [
      "Include engine details in showcase posts.",
      "Credit asset creators when sharing WIPs.",
      "Constructive critique only.",
    ],
    tags: ["Unreal Engine", "Unity", "PixelArt", "GameDesign"],
  },
  {
    id: "fullstack-builders",
    name: "Fullstack Builders",
    handle: "c/fullstack",
    category: "Programming",
    topicId: "topic-programming",
    description: "Modern web architects, React/Next.js developers, distributed systems engineers, and backend performance geeks.",
    membersCount: 215300,
    onlineCount: 4890,
    rules: [
      "Format code snippets with syntax highlighting.",
      "No homework solution requests without attempt.",
      "Share reproducible benchmarks when discussing performance.",
    ],
    tags: ["TypeScript", "Next.js", "Rust", "Architecture"],
  },
  {
    id: "founder-stories",
    name: "Founders & Startups",
    handle: "c/startups",
    category: "Startups",
    topicId: "topic-startups",
    description: "Transparent revenue milestones, fundraising insights, pitch deck tear-downs, and lessons from zero to Series A.",
    membersCount: 76400,
    onlineCount: 940,
    rules: [
      "Provide real context with launch posts.",
      "No deceptive affiliate marketing.",
      "Be respectful to early stage founders.",
    ],
    tags: ["SaaS", "Bootstrapping", "Venture", "ProductMarketFit"],
  },
  {
    id: "ui-ux-craft",
    name: "UI/UX & Product Design",
    handle: "c/designcraft",
    category: "Design",
    topicId: "topic-design",
    description: "Curated design systems, micro-interactions, typography critiques, and Figma tips for elite interface crafters.",
    membersCount: 118200,
    onlineCount: 1670,
    rules: [
      "Provide problem framing with UI redesigns.",
      "Respect accessibility guidelines.",
      "State prototyping tools used.",
    ],
    tags: ["Figma", "DesignSystems", "MicroInteractions", "Motion"],
  },
  {
    id: "cinema-critique",
    name: "Cinema & Narrative",
    handle: "c/cinema",
    category: "Movies",
    topicId: "topic-movies",
    description: "Deep dive discussions on cinematography, auteur directors, screenplays, and international film festivals.",
    membersCount: 64100,
    onlineCount: 730,
    rules: [
      "Always use spoiler tags for plot points.",
      "Cite director/DP when praising visuals.",
      "Engage in civil debate.",
    ],
    tags: ["35mm", "Screenwriting", "IndieCinema", "SciFi"],
  },
  {
    id: "synth-soundscapes",
    name: "Electronic Music & Sound",
    handle: "c/synthwave",
    category: "Music",
    topicId: "topic-music",
    description: "Modular synthesizers, DAW workflows, audio mixing techniques, and ambient sound design explorations.",
    membersCount: 52900,
    onlineCount: 610,
    rules: [
      "List patch chains when posting sound demos.",
      "No copyrighted sample packs.",
      "Include listening timestamps.",
    ],
    tags: ["Ableton", "Modular", "Mixing", "SoundDesign"],
  },
  {
    id: "future-sports",
    name: "Sports & Analytics",
    handle: "c/sportsanalytics",
    category: "Sports",
    topicId: "topic-sports",
    description: "Statistical modeling, performance analytics, tactical breakdowns, and biomechanics in global sports.",
    membersCount: 41200,
    onlineCount: 520,
    rules: [
      "Include data source and metrics model.",
      "Keep club rivalries civil.",
      "No illegal streaming links.",
    ],
    tags: ["Analytics", "Tactics", "Biomechanics", "F1"],
  },
  {
    id: "ai-engineering",
    name: "AI Engineering",
    handle: "c/aiengineering",
    category: "Technology",
    topicId: "topic-ai",
    description: "LLMs, agentic systems, ML engineering, model fine-tuning, and production AI infrastructure.",
    membersCount: 98700,
    onlineCount: 3120,
    rules: [
      "Cite papers and benchmarks.",
      "No hype without substance.",
      "Beginner questions welcome with context.",
    ],
    tags: ["LLMs", "Agentic AI", "ML Ops", "Transformers"],
  },
  {
    id: "cybersec-ops",
    name: "Cybersecurity Ops",
    handle: "c/cybersec",
    category: "Technology",
    topicId: "topic-cybersecurity",
    description: "Offensive security, threat hunting, zero-trust architecture, and enterprise security posture.",
    membersCount: 67300,
    onlineCount: 890,
    rules: [
      "No sharing of exploit code without responsible disclosure.",
      "Stay ethical.",
      "Educational content only.",
    ],
    tags: ["Pentesting", "Zero Trust", "Threat Intel", "SIEM"],
  },
];

export const COMMUNITY_CATEGORIES = [
  "All",
  "Technology",
  "Gaming",
  "Programming",
  "Design",
  "Startups",
  "Movies",
  "Music",
  "Sports",
  "Career",
];

export function getCommunityById(id) {
  return MOCK_COMMUNITIES.find((c) => c.id === id) || null;
}

export function getCommunitiesByTopic(topicId) {
  return MOCK_COMMUNITIES.filter((c) => c.topicId === topicId);
}

export function searchCommunities(query) {
  const q = query.toLowerCase();
  return MOCK_COMMUNITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
  );
}
