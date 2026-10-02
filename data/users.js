// Echo Users — no avatar image URLs, initials only
// Phase 4: replace with authenticated user from backend

/**
 * Generate 2-letter initials from a display name.
 * "Farhan Vance" → "FV"
 * "Elena Rostova" → "ER"
 * "Dr. Aris Thorne" → "AT"
 */
export function getInitials(name = "") {
  const words = name.trim().replace(/^Dr\.?\s+/i, "").split(/\s+/);
  if (words.length === 0) return "EC";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * Generate a deterministic background color class from a name string.
 * Returns a Tailwind-compatible color string.
 */
export function getAvatarColor(name = "") {
  const colors = [
    "#6366f1", // echo indigo
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ef4444", // red
    "#ec4899", // pink
    "#14b8a6", // teal
    "#f97316", // orange
    "#64748b", // slate
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export const CURRENT_USER = {
  id: "usr_current",
  name: "Farhan Vance",
  username: "farhan",
  handle: "@farhan",
  bio: "Fullstack engineer building realtime community platforms. Passionate about Next.js, Rust, design systems, and audio tech.",
  joinedDate: "October 2024",
  reputation: 3840,
  topics: ["topic-programming", "topic-ai", "topic-technology", "topic-gamedev"],
};

export const MOCK_USERS = [
  CURRENT_USER,
  {
    id: "usr_1",
    name: "Elena Rostova",
    username: "elena_dev",
    handle: "@elena_dev",
    bio: "Staff Engineer at a Series B startup. TypeScript, distributed systems, and engineering culture.",
    joinedDate: "March 2024",
    reputation: 9420,
    topics: ["topic-programming", "topic-technology"],
  },
  {
    id: "usr_2",
    name: "Kenji Sato",
    username: "kenjigames",
    handle: "@kenjigames",
    bio: "Indie game developer. Unreal Engine enthusiast. Making dark fantasy RPGs solo.",
    joinedDate: "June 2024",
    reputation: 5120,
    topics: ["topic-gamedev", "topic-gaming"],
  },
  {
    id: "usr_3",
    name: "Samantha Reed",
    username: "sam_founder",
    handle: "@sam_founder",
    bio: "Founder & CEO. Bootstrapped to $25k MRR. Building in public.",
    joinedDate: "January 2024",
    reputation: 8710,
    topics: ["topic-startups", "topic-career"],
  },
  {
    id: "usr_4",
    name: "Mateo Alvarez",
    username: "mateo_design",
    handle: "@mateo_design",
    bio: "Product Designer & Design Systems lead. Figma power user.",
    joinedDate: "April 2024",
    reputation: 4360,
    topics: ["topic-design", "topic-technology"],
  },
  {
    id: "usr_5",
    name: "Dr. Aris Thorne",
    username: "aris_ai",
    handle: "@aris_ai",
    bio: "AI researcher. Working on autonomous agents and multi-modal foundation models.",
    joinedDate: "February 2024",
    reputation: 11200,
    topics: ["topic-ai", "topic-technology"],
  },
];

export function getUserByUsername(username) {
  return MOCK_USERS.find((u) => u.username === username) || null;
}
