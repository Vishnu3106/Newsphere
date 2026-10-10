import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createHandler, handler } from '../src/handlers/articles'
import { articles, FakeRepo } from './fixtures'
const call = (event: Parameters<ReturnType<typeof createHandler>>[0], repo = FakeRepo()) => createHandler(() => repo)(event)
const body = (r: { body?: string }) => JSON.parse(r.body ?? 'null')

describe('GET /articles handler', () => {
  it('returns 200 and Article objects with the exact frontend field names', async () => {
    const r = await call({ queryStringParameters: { source: 'BBC' } })
    assert.equal(r.statusCode, 200)
    assert.equal(r.headers?.['Content-Type'], 'application/json')
    assert.deepEqual(body(r), [articles[1]])
    assert.ok('image' in body(r)[0] && !('imageUrl' in body(r)[0]))
  })
  it('returns 200 with an empty array when nothing matches', async () => {
    const r = await call({ queryStringParameters: { q: 'zzzz' } })
    assert.equal(r.statusCode, 200)
    assert.deepEqual(body(r), [])
  })
  it('handles missing query parameters', async () => assert.equal((await call({})).statusCode, 200))
  it('returns 400 JSON for invalid parameters', async () => {
    const r = await call({ queryStringParameters: { sort: 'popular' } })
    assert.equal(r.statusCode, 400)
    assert.equal(body(r).error, 'BadRequest')
  })
  it('returns 405 for non-GET methods', async () => assert.equal((await call({ requestContext: { http: { method: 'POST' } } })).statusCode, 405))
  it('returns 500 without leaking details when the database fails', async (t) => {
    t.mock.method(console, 'error', () => {})
    const r = await call({}, { listAll: async () => { throw new Error('secret table details') } })
    assert.equal(r.statusCode, 500)
    assert.equal(body(r).message, 'Failed to load articles')
    assert.ok(!(r.body ?? '').includes('secret'))
  })
  it('returns 500 when ARTICLES_TABLE_NAME is not configured', async (t) => {
    t.mock.method(console, 'error', () => {})
    delete process.env.ARTICLES_TABLE_NAME
    assert.equal((await handler({})).statusCode, 500)
  })
})
