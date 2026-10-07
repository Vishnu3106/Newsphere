# NewsSphere – Handoff for Claude Code

University Agile + DevOps project: real-time multi-source news aggregation, search, and **story evolution** (timeline + change tracking).
Stack: React 18, Vite, TypeScript, Tailwind 3, React Router 6, Lucide. Mock data only. No AWS yet. No secrets in repo.

## Status
The source was written in a sandbox with no network, so **nothing has been installed, linted, built or run**. Expect small type errors/typos.

## Do first
1. `npm install`, then `npm run lint`, `npm test`, `npm run build`, `npm run dev`. Fix every error.
2. Click through every route and check: navigation, search, category/source/date filters, save/unsave (persists on refresh), follow/unfollow (persists), Story Details, login/logout, notification toggle, mobile menu.

## Existing structure
- `src/data/data.ts` – 8 stories x 4 articles (shared storyId), sources, categories, topics
- `src/services/` – newsService, storyService (+ mock `storyGroupingService`, tag-overlap heuristic, NOT AI), authService (mock; Cognito-replaceable interface)
- `src/hooks/useApp.tsx` – context: saved, followed, user, notify, toasts (localStorage)
- `src/components/` – Layout (navbar/footer/mobile menu), NewsCard
- `src/pages/` – Home, Feed (Explore + Search), StoryDetails, Lists (Stories, Saved, Following, ForYou), Auth (Login/Register), Profile
- CI: `.github/workflows/ci.yml` (install, lint, test, build). `lint` is currently only `tsc --noEmit`.

## Still to build (priority order)
1. Extract reusable components: StoryCard, StoryTimeline, StoryComparison, FilterBar, CategoryPill, SourceBadge, SaveButton, FollowButton, NotificationBell, SearchBar, Sidebar.
2. Saved page: "Saved Today" / "Saved This Week" sections with remove button; keep the polished empty state.
3. Skeleton loading states; location filter; sort by latest/relevance.
4. Following: "Latest story" per topic + "Discover topics" section. For You: "Because you follow AI" and "Popular in your interests" sections; add For You to navbar.
5. Profile: editable name/email, preferred categories, location (current vs manual, do NOT request browser geolocation), separate Breaking news / Topic updates toggles.
6. Real ESLint config; more tests (newssphere filters, storyGroupingService).
7. Polish for a professor demo: clean modern news look (Google News / Apple News feel, not copied), one accent color, no heavy gradients/animations, accessible forms and buttons.

## Rules
- Keep UI separate from services; mock data separate from logic; small reusable components.
- Do not implement AWS yet. Future mapping: API Gateway -> Lambda -> DynamoDB/S3/SNS; Cognito for auth; EventBridge -> Lambda ingestion; CloudWatch; IAM.
- Do not present the mock grouping as AI. Future flow: preprocess -> embeddings -> similarity score -> existing story or new story.
