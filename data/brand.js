// Centralized Brand Configuration for Echo
export const BRAND = {
  name: "Echo",
  tagline: "Find your people. Join the conversation.",
  description: "A lightweight community discovery and live audio platform.",
  // Core navigation — the four primary features
  navItems: [
    { label: "Discover", href: "/discover", icon: "Compass" },
    { label: "Search", href: "/search", icon: "Search" },
    { label: "Live Rooms", href: "/rooms", icon: "Radio", isLiveHighlight: true },
    { label: "Popular Rooms", href: "/popular-rooms", icon: "TrendingUp" },
  ],
  footerLinks: [
    { label: "About", href: "/about" },
    { label: "Communities", href: "/communities" },
    { label: "Guidelines", href: "/guidelines" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  version: "2.0.0-phase2",
};
