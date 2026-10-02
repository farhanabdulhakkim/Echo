-- =============================================================
-- Echo — Phase 3 Seed Data
-- supabase/seed.sql
-- Idempotent: safe to rerun (ON CONFLICT DO NOTHING)
-- Based on Phase 2 mock data from data/topics.js, communities.js,
-- discussions.js, rooms.js
-- =============================================================

-- NOTE: Run 001_schema.sql and 002_rls.sql FIRST.
-- Topics, communities, discussions and rooms are seeded with
-- deterministic UUIDs so this script is rerunnable.

-- =============================================================
-- TOPICS
-- =============================================================
INSERT INTO public.topics (id, name, slug, description, member_count, category)
VALUES
  ('11111111-0001-0001-0001-000000000001', 'AI',             'ai',              'Artificial intelligence, machine learning, LLMs, and the future of intelligent systems.',         184200, 'Technology'),
  ('11111111-0001-0001-0001-000000000002', 'Programming',    'programming',     'Software engineering, algorithms, code quality, and developer culture.',                          312500, 'Technology'),
  ('11111111-0001-0001-0001-000000000003', 'Technology',     'technology',      'Emerging tech, hardware, semiconductors, and innovation shaping the next decade.',                 428000, 'Technology'),
  ('11111111-0001-0001-0001-000000000004', 'Cybersecurity',  'cybersecurity',   'Offensive security, threat intelligence, privacy, and ethical hacking.',                          89300,  'Technology'),
  ('11111111-0001-0001-0001-000000000005', 'Cloud',          'cloud',           'AWS, GCP, Azure, distributed systems, and cloud-native architecture.',                            143600, 'Technology'),
  ('11111111-0001-0001-0001-000000000006', 'Gaming',         'gaming',          'PC gaming, console gaming, esports, and game culture.',                                           267400, 'Gaming'),
  ('11111111-0001-0001-0001-000000000007', 'Game Development','game-development','Indie dev, Unreal Engine, Unity, game design, and devlogs.',                                    98700,  'Gaming'),
  ('11111111-0001-0001-0001-000000000008', 'Startups',       'startups',        'Founders, bootstrapping, fundraising, SaaS growth, and startup stories.',                        112400, 'Business'),
  ('11111111-0001-0001-0001-000000000009', 'Career',         'career',          'Job hunting, interviews, tech careers, and professional growth.',                                 156800, 'Professional'),
  ('11111111-0001-0001-0001-000000000010', 'Design',         'design',          'UI/UX, design systems, typography, and product craft.',                                           134200, 'Creative'),
  ('11111111-0001-0001-0001-000000000011', 'Education',      'education',       'Learning, teaching, online courses, and knowledge sharing.',                                      201000, 'Learning'),
  ('11111111-0001-0001-0001-000000000012', 'Movies',         'movies',          'Cinema, directors, screenwriting, and film discussion.',                                          78500,  'Entertainment'),
  ('11111111-0001-0001-0001-000000000013', 'Music',          'music',           'Production, listening, genres, artists, and sound design.',                                       93200,  'Entertainment'),
  ('11111111-0001-0001-0001-000000000014', 'Sports',         'sports',          'Athletics, analytics, tactics, and sports culture.',                                              68900,  'Sports')
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- COMMUNITIES
-- =============================================================
INSERT INTO public.communities (id, slug, name, description, topic_id, member_count, online_count, category, tags, rules)
VALUES
  (
    '22222222-0002-0002-0002-000000000001',
    'tech-innovators', 'Tech Innovators',
    'Discussing emerging tech, AI breakthroughs, quantum computing, and hardware innovations shaping the next decade.',
    '11111111-0001-0001-0001-000000000003',
    142800, 2340, 'Technology',
    ARRAY['AI','Robotics','Hardware','Semiconductors'],
    ARRAY['Keep technical discussions evidence-based.','No spam or unsolicited promotional links.','Respect differing engineering viewpoints.']
  ),
  (
    '22222222-0002-0002-0002-000000000002',
    'game-dev-hub', 'Game Dev & Design',
    'A collective of indie developers, 3D artists, Unreal/Unity engineers, and game designers sharing devlogs and feedback.',
    '11111111-0001-0001-0001-000000000007',
    89400, 1120, 'Gaming',
    ARRAY['Unreal Engine','Unity','PixelArt','GameDesign'],
    ARRAY['Include engine details in showcase posts.','Credit asset creators when sharing WIPs.','Constructive critique only.']
  ),
  (
    '22222222-0002-0002-0002-000000000003',
    'fullstack-builders', 'Fullstack Builders',
    'Modern web architects, React/Next.js developers, distributed systems engineers, and backend performance geeks.',
    '11111111-0001-0001-0001-000000000002',
    215300, 4890, 'Programming',
    ARRAY['React','Next.js','TypeScript','Distributed Systems'],
    ARRAY['Format code snippets with syntax highlighting.','No homework solution requests without attempt.','Share reproducible benchmarks when discussing performance.']
  ),
  (
    '22222222-0002-0002-0002-000000000004',
    'ai-engineering', 'AI Engineering',
    'LLM fine-tuning, agentic systems, prompt engineering, and building production AI infrastructure.',
    '11111111-0001-0001-0001-000000000001',
    178600, 3210, 'Technology',
    ARRAY['LLMs','Agents','MLOps','Fine-tuning'],
    ARRAY['Share reproducible experiments.','No hype without substance.','Credit prior work.']
  ),
  (
    '22222222-0002-0002-0002-000000000005',
    'founder-stories', 'Founders & Startups',
    'Honest stories from founders building in public — revenue, churn, pivots, and lessons learned.',
    '11111111-0001-0001-0001-000000000008',
    93200, 1450, 'Startups',
    ARRAY['SaaS','Bootstrapping','Revenue','Fundraising'],
    ARRAY['Share real numbers when possible.','No promotional posts without context.','Provide real context with launch posts.']
  ),
  (
    '22222222-0002-0002-0002-000000000006',
    'ui-ux-craft', 'UI/UX & Product Design',
    'Pixel-perfect design, component systems, accessibility, and the craft of exceptional product experiences.',
    '11111111-0001-0001-0001-000000000010',
    112500, 1780, 'Design',
    ARRAY['Figma','Design Systems','Accessibility','Typography'],
    ARRAY['Include design context in feedback requests.','Constructive critique only.','Credit inspiration sources.']
  ),
  (
    '22222222-0002-0002-0002-000000000007',
    'cybersec-ops', 'Cybersecurity Ops',
    'Offensive security, threat hunting, zero-trust architecture, and enterprise security posture.',
    '11111111-0001-0001-0001-000000000004',
    67300, 890, 'Technology',
    ARRAY['Pentesting','Zero Trust','Threat Intel','SIEM'],
    ARRAY['No sharing of exploit code without responsible disclosure.','Stay ethical.','Educational content only.']
  )
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- DISCUSSIONS
-- NOTE: author_id is NULL for seeded content (no real auth user)
-- =============================================================
INSERT INTO public.discussions (id, title, content, author_id, topic_id, community_id, community_name, tags)
VALUES
  (
    '33333333-0003-0003-0003-000000000001',
    'What will AI mean for junior developers in 2026?',
    'The conversation around AI tooling has shifted dramatically. A year ago, we were debating whether Copilot was a toy. Now entire sprint cycles at some companies are being accelerated by 40–60% using agentic workflows.

The real question isn''t whether AI replaces juniors — it''s whether juniors who don''t learn to work alongside AI tools will be outcompeted by those who do.

What''s your experience? Are companies raising the bar for junior hiring, or opening doors with new tooling?',
    NULL,
    '11111111-0001-0001-0001-000000000001',
    '22222222-0002-0002-0002-000000000004',
    'AI Engineering',
    ARRAY['AI','Career','Junior Developers']
  ),
  (
    '33333333-0003-0003-0003-000000000002',
    'Best way to learn system design from scratch?',
    'I''m a mid-level backend engineer who''s been asked to lead a new microservices migration at work. I''ve done distributed systems academically but never at scale in production.

What resources, mental models, or first principles would you recommend for someone trying to deeply understand system design — not just for interviews, but for actual engineering?

Books, talks, blogs, real-world war stories all welcome.',
    NULL,
    '11111111-0001-0001-0001-000000000002',
    '22222222-0002-0002-0002-000000000003',
    'Fullstack Builders',
    ARRAY['System Design','Architecture','Backend']
  ),
  (
    '33333333-0003-0003-0003-000000000003',
    'Are cloud skills still worth learning or is it all abstracted away?',
    'Five years ago, knowing your way around AWS EC2, VPCs, IAM policies was a real differentiator. Now with platforms like Vercel, Railway, Render — you can ship production apps without touching infrastructure.

Is deep cloud knowledge still worth investing in for a developer? Or is the abstraction layer now good enough that most engineers can stay at the platform layer?',
    NULL,
    '11111111-0001-0001-0001-000000000005',
    '22222222-0002-0002-0002-000000000001',
    'Tech Innovators',
    ARRAY['Cloud','AWS','DevOps','Career']
  ),
  (
    '33333333-0003-0003-0003-000000000004',
    'We hit $25k MRR in 8 months — here''s what actually worked',
    'Early on we obsessed over Product Hunt launch numbers. Big mistake. When 70% of those users dropped off within 3 days, we realized we were filling a leaky bucket.

The real unlock was treating retention as a product feature. We added personal onboarding calls for every team-tier signup, built in-app micro surveys at friction points, and created a private community space where power users could talk directly to our devs.

Net revenue retention went from 82% to 118% in 4 months. Happy to go deeper on any of this in the comments.',
    NULL,
    '11111111-0001-0001-0001-000000000008',
    '22222222-0002-0002-0002-000000000005',
    'Founders & Startups',
    ARRAY['Startups','SaaS','Growth','Retention']
  ),
  (
    '33333333-0003-0003-0003-000000000005',
    'How do you approach code review culture at your company?',
    'We''re a 12-person engineering team and code review has become a bottleneck. PRs sit for 2-3 days, feedback is inconsistent, and junior engineers are anxious about reviews from certain seniors.

I''m trying to build a healthier review culture. What''s worked for teams you''ve been on? Specific practices, tooling, norms — all welcome.',
    NULL,
    '11111111-0001-0001-0001-000000000002',
    '22222222-0002-0002-0002-000000000003',
    'Fullstack Builders',
    ARRAY['Engineering Culture','Code Review','Teams']
  ),
  (
    '33333333-0003-0003-0003-000000000006',
    'Unreal Engine 5.4 Nanite + Lumen performance deep dive',
    'After 6 months of profiling our dark fantasy RPG on mid-range hardware, I''ve learned a lot about where UE5''s Nanite and Lumen eat your frame budget.

Short version: Lumen hardware ray tracing is still very expensive on anything below RTX 3070. Nanite is surprisingly efficient but watch out for overdraw in foliage-heavy scenes.',
    NULL,
    '11111111-0001-0001-0001-000000000007',
    '22222222-0002-0002-0002-000000000002',
    'Game Dev & Design',
    ARRAY['Unreal Engine','Performance','3D Graphics']
  ),
  (
    '33333333-0003-0003-0003-000000000007',
    'Migrating from monolithic CSS to design tokens — what we learned',
    'After scaling our product UI to 40+ features and 3 brand themes, utility class drift became a silent killer of developer velocity.

We spent 6 months migrating to a strict token architecture. Key learnings:

1. Semantic aliasing over primitive scales
2. CSS color-mix() for WCAG AAA compliance automatically across themes
3. Zero style recalcs on dark mode toggle — changes happen at CSS variable root',
    NULL,
    '11111111-0001-0001-0001-000000000010',
    '22222222-0002-0002-0002-000000000006',
    'UI/UX & Product Design',
    ARRAY['Design Systems','CSS','Frontend','Architecture']
  ),
  (
    '33333333-0003-0003-0003-000000000008',
    'Quantum error correction milestone — what it means practically',
    'Researchers have demonstrated fault-tolerant surface code where error rates decrease exponentially as code distance increases.

This is the fundamental breakthrough that moves us from NISQ era toward practical fault tolerance. The implications for cryptography and biochemical simulation are significant.',
    NULL,
    '11111111-0001-0001-0001-000000000003',
    '22222222-0002-0002-0002-000000000001',
    'Tech Innovators',
    ARRAY['Quantum','Computing','Research']
  )
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- ROOMS
-- host_id is NULL for seeded rooms (no real auth user)
-- =============================================================
INSERT INTO public.rooms (id, title, description, topic_id, community_id, community_name, host_id, host_name, status, listener_count, tags, category, started_at, scheduled_for)
VALUES
  (
    '44444444-0004-0004-0004-000000000001',
    'The Future of Web Engines & Edge Runtimes',
    'Deep architectural breakdown of micro-frontends, edge worker latency, and bundling innovations.',
    '11111111-0001-0001-0001-000000000002',
    '22222222-0002-0002-0002-000000000003',
    'Fullstack Builders',
    NULL, 'Elena Rostova',
    'live', 428,
    ARRAY['Next.js','WebAssembly','Serverless'],
    'Programming', '35m ago', NULL
  ),
  (
    '44444444-0004-0004-0004-000000000002',
    'Indie Game Pitch & Art Feedback Live Stage',
    'Developers share live gameplay clips and receive critique on lighting, game feel, and marketing hooks.',
    '11111111-0001-0001-0001-000000000007',
    '22222222-0002-0002-0002-000000000002',
    'Game Dev & Design',
    NULL, 'Kenji Sato',
    'live', 312,
    ARRAY['Unreal Engine 5','Pixel Art','Steam Launch'],
    'Gaming', '1h 10m ago', NULL
  ),
  (
    '44444444-0004-0004-0004-000000000003',
    'Scaling SaaS from $10k to $100k MRR: Honest War Stories',
    'Founders open up their dashboards, discussing churn reduction, sales pipelines, and pricing experiments.',
    '11111111-0001-0001-0001-000000000008',
    '22222222-0002-0002-0002-000000000005',
    'Founders & Startups',
    NULL, 'Samantha Reed',
    'live', 589,
    ARRAY['Bootstrapping','Pricing','Customer Retention'],
    'Startups', '18m ago', NULL
  ),
  (
    '44444444-0004-0004-0004-000000000004',
    'Design Tokens & Variable Typography in 2026',
    'Bridging the gap between Figma design variables and CSS custom properties in multi-brand systems.',
    '11111111-0001-0001-0001-000000000010',
    '22222222-0002-0002-0002-000000000006',
    'UI/UX & Product Design',
    NULL, 'Mateo Alvarez',
    'upcoming', 145,
    ARRAY['Figma Tokens','Design System','CSS Variables'],
    'Design', NULL, 'Today at 6:00 PM EST'
  ),
  (
    '44444444-0004-0004-0004-000000000005',
    'Autonomous Agents & Multi-Modal Foundation Models',
    'Exploring test-time compute, reasoning frameworks, and autonomous multi-agent tool use.',
    '11111111-0001-0001-0001-000000000001',
    '22222222-0002-0002-0002-000000000001',
    'Tech Innovators',
    NULL, 'Dr. Aris Thorne',
    'upcoming', 380,
    ARRAY['LLMs','Agentic Systems','Reinforcement Learning'],
    'Technology', NULL, 'Tomorrow at 2:00 PM EST'
  ),
  (
    '44444444-0004-0004-0004-000000000006',
    'Will AI Replace Junior Developers? Panel Discussion',
    'A nuanced panel on how AI tooling is reshaping entry-level software engineering roles.',
    '11111111-0001-0001-0001-000000000001',
    '22222222-0002-0002-0002-000000000004',
    'AI Engineering',
    NULL, 'Farhan Vance',
    'live', 762,
    ARRAY['AI','Career','Engineering'],
    'Technology', '55m ago', NULL
  ),
  (
    '44444444-0004-0004-0004-000000000007',
    'System Design Interview Prep — Live Mock Session',
    'Live mock system design interviews with real-time feedback. Viewer questions welcome.',
    '11111111-0001-0001-0001-000000000009',
    '22222222-0002-0002-0002-000000000003',
    'Fullstack Builders',
    NULL, 'Marcus Vance',
    'live', 241,
    ARRAY['System Design','Interviews','Career'],
    'Career', '2h ago', NULL
  ),
  (
    '44444444-0004-0004-0004-000000000008',
    'Cybersecurity in 2026: Zero Trust & AI-Driven Threats',
    'How AI-driven phishing, deepfakes, and automated exploits are reshaping enterprise security posture.',
    '11111111-0001-0001-0001-000000000004',
    '22222222-0002-0002-0002-000000000007',
    'Cybersecurity Ops',
    NULL, 'Devon Clark',
    'live', 189,
    ARRAY['Cybersecurity','Zero Trust','AI'],
    'Technology', '28m ago', NULL
  )
ON CONFLICT (id) DO NOTHING;
