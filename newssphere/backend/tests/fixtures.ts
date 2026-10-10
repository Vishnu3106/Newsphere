import type { Article } from '../src/models/article'
export const NOW = Date.parse('2026-10-10T12:00:00Z')
const ago = (hours: number) => new Date(NOW - hours * 36e5).toISOString()
const mk = (o: Partial<Article> & { articleId: string }): Article => ({
  title: 'T', description: 'D', source: 'Reuters', category: 'Technology', publishedAt: ago(1),
  image: 'https://img.example/x.jpg', location: 'Mumbai', places: ['Mumbai', 'India'], storyId: 's1', tags: [], url: '#', ...o,
})
export const articles: Article[] = [
  mk({ articleId: 'a1', title: 'AI breakthrough', description: 'new model', category: 'AI', source: 'Reuters', tags: ['Artificial Intelligence'], places: ['San Francisco', 'United States'], publishedAt: ago(2) }),
  mk({ articleId: 'a2', title: 'Chip alliance', description: 'mentions ai in description', source: 'BBC', tags: ['Technology'], places: ['Chennai', 'India', 'Tamil Nadu'], publishedAt: ago(30) }),
  mk({ articleId: 'a3', title: 'Cricket win', description: 'series decider', category: 'Sports', source: 'The Hindu', tags: ['Cricket', 'AI'], places: ['Mumbai', 'India'], publishedAt: ago(240) }),
  mk({ articleId: 'a4', title: 'Markets rise', description: 'rates', category: 'Business', source: 'Reuters', tags: ['Business'], places: ['London', 'United Kingdom'], publishedAt: ago(1) }),
]
export const FakeRepo = (items: Article[] = articles) => ({ listAll: async () => items })
