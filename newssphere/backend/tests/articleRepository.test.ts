import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { ScanCommand, type DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { DynamoArticleRepository, toArticle } from '../src/repositories/articleRepository'
import { articles } from './fixtures'

const senderFor = (pages: object[], calls: ScanCommand[]) =>
  ({ send: async (cmd: unknown) => { calls.push(cmd as ScanCommand); return pages[calls.length - 1] } }) as unknown as Pick<DynamoDBDocumentClient, 'send'>

describe('DynamoArticleRepository', () => {
  it('follows LastEvaluatedKey and returns items from every page', async () => {
    const calls: ScanCommand[] = []
    const repo = new DynamoArticleRepository('articles-test', senderFor([{ Items: [articles[0]], LastEvaluatedKey: { articleId: 'a1' } }, { Items: [articles[1]] }], calls))
    const out = await repo.listAll()
    assert.deepEqual(out.map((a) => a.articleId), ['a1', 'a2'])
    assert.equal(calls.length, 2)
    assert.equal(calls[0].input.TableName, 'articles-test')
    assert.equal(calls[0].input.ExclusiveStartKey, undefined)
    assert.deepEqual(calls[1].input.ExclusiveStartKey, { articleId: 'a1' })
  })
  it('returns an empty array for an empty table', async () => assert.deepEqual(await new DynamoArticleRepository('t', senderFor([{}], [])).listAll(), []))
  it('propagates DynamoDB errors', async () => {
    const failing = { send: async () => { throw new Error('AccessDenied') } } as unknown as Pick<DynamoDBDocumentClient, 'send'>
    await assert.rejects(new DynamoArticleRepository('t', failing).listAll(), /AccessDenied/)
  })
  it('normalizes items: string sets become arrays, missing attributes get defaults', () => {
    const a = toArticle({ articleId: 'x', title: 'T', tags: new Set(['a', 'b']) })
    assert.deepEqual(a.tags, ['a', 'b'])
    assert.deepEqual(a.places, [])
    assert.equal(a.image, '')
  })
})
