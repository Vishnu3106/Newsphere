# NewsSphere
Real-time multi-source news aggregation with evolving stories. Frontend prototype (React + Vite + TS + Tailwind) on mock data.

    npm install
    npm run dev

`npm run lint` (type-check), `npm test`, `npm run build`. Demo login: any email/password.

## Layout
`src/services/*` is the only layer touching data/auth; swap mocks for API Gateway/Lambda/DynamoDB and Cognito later. `storyGroupingService` is a mock tag-overlap heuristic (not AI); future: embeddings -> similarity -> existing/new story.
