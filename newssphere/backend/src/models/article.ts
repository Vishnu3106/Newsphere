// Shared Article type. Field names and types MUST match the React frontend's Article
// interface (frontend/src/types/index.ts) - the API returns exactly this shape.
export interface Article {
  articleId: string
  title: string
  description: string
  source: string
  category: string
  publishedAt: string // ISO 8601 date-time string
  image: string       // NOTE: "image", not "imageUrl" - matches the frontend contract
  location: string
  places: string[]
  storyId: string
  tags: string[]
  url: string
}
