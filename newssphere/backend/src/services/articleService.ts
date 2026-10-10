// Service = business rules: validating query parameters, filtering, relevance scoring, sorting.
// Mirrors the frontend's newsService.search() so results match what the React app shows.
// LIMITATION: this filters an in-memory list loaded by a table Scan. It is NOT a scalable
// full-text search engine - fine for a small demo dataset only.
import type { Article } from '../models/article'
import type { ArticleRepository } from '../repositories/articleRepository'

export type SortMode = 'latest' | 'relevance'
export interface ArticleQuery {
  q?: string
  category?: string
  source?: string
  location?: string
  days?: number
  sort?: SortMode
}

/** Thrown for bad client input; the handler turns it into HTTP 400. */
export class ValidationError extends Error {}

type Params = Record<string, string | undefined> | null | undefined

export function parseArticleQuery(params: Params): ArticleQuery {
  const get = (key: string) => params?.[key]?.trim() || undefined
  const q = get('q')
  if (q && q.length > 200) throw new ValidationError('q must be at most 200 characters')
  const sort = get('sort')
  if (sort !== undefined && sort !== 'latest' && sort !== 'relevance') {
    throw new ValidationError("sort must be 'latest' or 'relevance'")
  }
  const daysRaw = get('days')
  let days: number | undefined
  if (daysRaw !== undefined) {
    days = Number(daysRaw)
    if (!/^\d+$/.test(daysRaw) || days < 1 || days > 3650) {
      throw new ValidationError('days must be a whole number between 1 and 3650')
    }
  }
  return { q, category: get('category'), source: get('source'), location: get('location'), days, sort: sort as SortMode | undefined }
}

const time = (a: Article) => Date.parse(a.publishedAt) || 0
// Same weights as the frontend: title 3, tags 2, description 1 (per matching search term).
const score = (a: Article, terms: string[]) => {
  const title = a.title.toLowerCase(), desc = a.description.toLowerCase(), tags = a.tags.join().toLowerCase()
  return terms.reduce((n, t) => n + (title.includes(t) ? 3 : 0) + (tags.includes(t) ? 2 : 0) + (desc.includes(t) ? 1 : 0), 0)
}

/** Pure function: no I/O, easy to unit test. `now` is injectable so date tests are deterministic. */
export function searchArticles(list: Article[], f: ArticleQuery = {}, now: number = Date.now()): Article[] {
  const terms = (f.q ?? '').toLowerCase().split(/\s+/).filter(Boolean)
  const out = list.filter(
    (a) =>
      (!terms.length || terms.some((t) => (a.title + a.description + a.tags.join()).toLowerCase().includes(t))) &&
      (!f.category || f.category === 'All' || a.category === f.category) &&
      (!f.source || a.source === f.source) &&
      (!f.location || a.places.includes(f.location)) &&
      (!f.days || now - time(a) < f.days * 864e5),
  )
  return f.sort === 'relevance' && terms.length
    ? out.sort((a, b) => score(b, terms) - score(a, terms) || time(b) - time(a))
    : out.sort((a, b) => time(b) - time(a))
}

export const createArticleService = (repository: ArticleRepository) => ({
  async search(query: ArticleQuery, now: number = Date.now()): Promise<Article[]> {
    return searchArticles(await repository.listAll(), query, now)
  },
})
