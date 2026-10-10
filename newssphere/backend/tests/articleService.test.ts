import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { searchArticles, parseArticleQuery, createArticleService, ValidationError } from '../src/services/articleService'
import { articles, NOW, FakeRepo } from './fixtures'
const ids = (q: Parameters<typeof searchArticles>[1]) => searchArticles(articles, q, NOW).map((a) => a.articleId)

describe('searchArticles', () => {
  it('returns everything, newest first, with no filters', () => assert.deepEqual(ids({}), ['a4', 'a1', 'a2', 'a3']))
  it('matches keywords in title, description and tags, case-insensitively', () => {
    assert.deepEqual(ids({ q: 'BREAKTHROUGH' }), ['a1'])
    assert.deepEqual(ids({ q: 'ai' }), ['a1', 'a2', 'a3'])
  })
  it('matches any of several search terms', () => assert.deepEqual(ids({ q: 'cricket markets' }), ['a4', 'a3']))
  it('filters by category and ignores "All"', () => {
    assert.deepEqual(ids({ category: 'AI' }), ['a1'])
    assert.equal(ids({ category: 'All' }).length, 4)
  })
  it('filters by source', () => assert.deepEqual(ids({ source: 'BBC' }), ['a2']))
  it('filters by location using the places array', () => {
    assert.deepEqual(ids({ location: 'India' }), ['a2', 'a3'])
    assert.deepEqual(ids({ location: 'Tamil Nadu' }), ['a2'])
  })
  it('filters by publication window in days', () => {
    assert.deepEqual(ids({ days: 1 }), ['a4', 'a1'])
    assert.deepEqual(ids({ days: 7 }), ['a4', 'a1', 'a2'])
  })
  it('ranks relevance as title > tags > description', () => assert.deepEqual(ids({ q: 'ai', sort: 'relevance' }), ['a1', 'a3', 'a2']))
  it('falls back to latest when relevance is requested without a keyword', () => assert.deepEqual(ids({ sort: 'relevance' }), ids({ sort: 'latest' })))
  it('combines filters', () => assert.deepEqual(ids({ q: 'ai', source: 'Reuters', days: 7 }), ['a1']))
  it('returns an empty array when nothing matches', () => assert.deepEqual(ids({ q: 'zzzz' }), []))
  it('does not mutate the input list order', () => { const copy = articles.map((a) => a.articleId); ids({ sort: 'latest' }); assert.deepEqual(articles.map((a) => a.articleId), copy) })
})

describe('parseArticleQuery', () => {
  it('parses valid values and ignores blanks', () => {
    assert.deepEqual(parseArticleQuery({ q: ' ai ', days: '7', sort: 'relevance', source: ' ' }), { q: 'ai', category: undefined, source: undefined, location: undefined, days: 7, sort: 'relevance' })
    assert.deepEqual(parseArticleQuery(null), { q: undefined, category: undefined, source: undefined, location: undefined, days: undefined, sort: undefined })
  })
  it('rejects invalid sort, days and over-long q', () => {
    for (const bad of [{ sort: 'popular' }, { days: 'abc' }, { days: '0' }, { days: '-1' }, { days: '5.5' }, { days: '99999' }, { q: 'x'.repeat(201) }]) {
      assert.throws(() => parseArticleQuery(bad), ValidationError)
    }
  })
})

describe('createArticleService', () => {
  it('loads from the repository and applies the query', async () => {
    const out = await createArticleService(FakeRepo()).search({ source: 'BBC' }, NOW)
    assert.deepEqual(out.map((a) => a.articleId), ['a2'])
  })
  it('propagates repository failures', async () => {
    await assert.rejects(createArticleService({ listAll: async () => { throw new Error('boom') } }).search({}), /boom/)
  })
})
