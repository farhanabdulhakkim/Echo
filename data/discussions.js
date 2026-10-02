// Echo Discussions — text-only, discovery-focused
// No images, no votes, no karma. Discussions bridge topics → live rooms.
// Phase 4: replace MOCK_DISCUSSIONS with API fetch

export const MOCK_DISCUSSIONS = [
  {
    id: "disc-1",
    title: "What will AI mean for junior developers in 2026?",
    content: `The conversation around AI tooling has shifted dramatically. A year ago, we were debating whether Copilot was a toy. Now entire sprint cycles at some companies are being accelerated by 40–60% using agentic workflows.

The real question isn't whether AI replaces juniors — it's whether juniors who don't learn to work alongside AI tools will be outcompeted by those who do.

What's your experience? Are companies raising the bar for junior hiring, or opening doors with new tooling?`,
    communityId: "ai-engineering",
    communityName: "AI Engineering",
    topicId: "topic-ai",
    author: { name: "Farhan Vance", username: "farhan" },
    createdAt: "2 hours ago",
    tags: ["AI", "Career", "Junior Developers"],
    comments: [
      {
        id: "c-1",
        author: { name: "Elena Rostova", username: "elena_dev" },
        content: "At our company, we've raised the bar. We now expect juniors to ship production code faster because AI handles the boilerplate. The floor moved up, not the ceiling down.",
        createdAt: "1 hour ago",
        replies: [
          {
            id: "c-1-1",
            author: { name: "Farhan Vance", username: "farhan" },
            content: "That's a really important distinction — the floor moving up. Means entry-level actually needs stronger fundamentals now, not weaker.",
            createdAt: "45m ago",
          },
        ],
      },
      {
        id: "c-2",
        author: { name: "Kenji Sato", username: "kenjigames" },
        content: "Game studios are still very hands-on. AI helps with shader prototyping but the human creative direction is irreplaceable.",
        createdAt: "30m ago",
        replies: [],
      },
    ],
  },
  {
    id: "disc-2",
    title: "Best way to learn system design from scratch?",
    content: `I'm a mid-level backend engineer who's been asked to lead a new microservices migration at work. I've done distributed systems academically but never at scale in production.

What resources, mental models, or first principles would you recommend for someone trying to deeply understand system design — not just for interviews, but for actual engineering?

Books, talks, blogs, real-world war stories all welcome.`,
    communityId: "fullstack-builders",
    communityName: "Fullstack Builders",
    topicId: "topic-programming",
    author: { name: "Mateo Alvarez", username: "mateo_design" },
    createdAt: "4 hours ago",
    tags: ["System Design", "Architecture", "Backend"],
    comments: [
      {
        id: "c-3",
        author: { name: "Samantha Reed", username: "sam_founder" },
        content: "Designing Data-Intensive Applications by Kleppmann is the canonical book. After that, read Stripe's and Cloudflare's engineering blogs. Real production war stories teach faster than theory.",
        createdAt: "3 hours ago",
        replies: [],
      },
    ],
  },
  {
    id: "disc-3",
    title: "Are cloud skills still worth learning or is it all abstracted away?",
    content: `Five years ago, knowing your way around AWS EC2, VPCs, IAM policies was a real differentiator. Now with platforms like Vercel, Railway, Render — you can ship production apps without touching infrastructure.

Is deep cloud knowledge still worth investing in for a developer? Or is the abstraction layer now good enough that most engineers can stay at the platform layer?`,
    communityId: "tech-innovators",
    communityName: "Tech Innovators",
    topicId: "topic-cloud",
    author: { name: "Dr. Aris Thorne", username: "aris_ai" },
    createdAt: "6 hours ago",
    tags: ["Cloud", "AWS", "DevOps", "Career"],
    comments: [],
  },
  {
    id: "disc-4",
    title: "We hit $25k MRR in 8 months — here's what actually worked",
    content: `Early on we obsessed over Product Hunt launch numbers. Big mistake. When 70% of those users dropped off within 3 days, we realized we were filling a leaky bucket.

The real unlock was treating retention as a product feature. We added personal onboarding calls for every team-tier signup, built in-app micro surveys at friction points, and created a private community space where power users could talk directly to our devs.

Net revenue retention went from 82% to 118% in 4 months. Happy to go deeper on any of this in the comments.`,
    communityId: "founder-stories",
    communityName: "Founders & Startups",
    topicId: "topic-startups",
    author: { name: "Samantha Reed", username: "sam_founder" },
    createdAt: "9 hours ago",
    tags: ["Startups", "SaaS", "Growth", "Retention"],
    comments: [],
  },
  {
    id: "disc-5",
    title: "How do you approach code review culture at your company?",
    content: `We're a 12-person engineering team and code review has become a bottleneck. PRs sit for 2-3 days, feedback is inconsistent, and junior engineers are anxious about reviews from certain seniors.

I'm trying to build a healthier review culture. What's worked for teams you've been on? Specific practices, tooling, norms — all welcome.`,
    communityId: "fullstack-builders",
    communityName: "Fullstack Builders",
    topicId: "topic-programming",
    author: { name: "Elena Rostova", username: "elena_dev" },
    createdAt: "1 day ago",
    tags: ["Engineering Culture", "Code Review", "Teams"],
    comments: [],
  },
  {
    id: "disc-6",
    title: "Unreal Engine 5.4 Nanite + Lumen performance deep dive",
    content: `After 6 months of profiling our dark fantasy RPG on mid-range hardware, I've learned a lot about where UE5's Nanite and Lumen eat your frame budget.

Short version: Lumen hardware ray tracing is still very expensive on anything below RTX 3070. Nanite is surprisingly efficient but watch out for overdraw in foliage-heavy scenes.

Detailed breakdown with before/after frame timings in the comments.`,
    communityId: "game-dev-hub",
    communityName: "Game Dev & Design",
    topicId: "topic-gamedev",
    author: { name: "Kenji Sato", username: "kenjigames" },
    createdAt: "12 hours ago",
    tags: ["Unreal Engine", "Performance", "3D Graphics"],
    comments: [],
  },
  {
    id: "disc-7",
    title: "Migrating from monolithic CSS to design tokens — what we learned",
    content: `After scaling our product UI to 40+ features and 3 brand themes, utility class drift became a silent killer of developer velocity.

We spent 6 months migrating to a strict token architecture. Key learnings:

1. Semantic aliasing over primitive scales (surface-primary instead of zinc-800)
2. CSS color-mix() for WCAG AAA compliance automatically across themes  
3. Zero style recalcs on dark mode toggle — changes happen at CSS variable root

Open-source token schema available if anyone wants it.`,
    communityId: "ui-ux-craft",
    communityName: "UI/UX & Product Design",
    topicId: "topic-design",
    author: { name: "Mateo Alvarez", username: "mateo_design" },
    createdAt: "2 days ago",
    tags: ["Design Systems", "CSS", "Frontend", "Architecture"],
    comments: [],
  },
  {
    id: "disc-8",
    title: "Quantum error correction milestone — what it means practically",
    content: `Researchers have demonstrated fault-tolerant surface code where error rates decrease exponentially as code distance increases.

This is the fundamental breakthrough that moves us from NISQ (Noisy Intermediate-Scale Quantum) era toward practical fault tolerance. The implications for cryptography and biochemical simulation are significant.

Key question: how long until this transitions from lab result to production-grade hardware?`,
    communityId: "tech-innovators",
    communityName: "Tech Innovators",
    topicId: "topic-technology",
    author: { name: "Dr. Aris Thorne", username: "aris_ai" },
    createdAt: "12 hours ago",
    tags: ["Quantum", "Computing", "Research"],
    comments: [],
  },
];

export function getDiscussionById(id) {
  return MOCK_DISCUSSIONS.find((d) => d.id === id) || null;
}

export function getDiscussionsByTopic(topicId) {
  return MOCK_DISCUSSIONS.filter((d) => d.topicId === topicId);
}

export function getDiscussionsByCommunity(communityId) {
  return MOCK_DISCUSSIONS.filter((d) => d.communityId === communityId);
}

export function searchDiscussions(query) {
  const q = query.toLowerCase();
  return MOCK_DISCUSSIONS.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      d.content.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q))
  );
}
