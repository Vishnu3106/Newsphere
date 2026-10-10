// GET /articles Lambda. Later: API Gateway GET /articles -> dist/articles/index.handler
// Thin handler: parse request -> call service -> shape the HTTP response.
import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import { DynamoArticleRepository, type ArticleRepository } from '../repositories/articleRepository'
import { createArticleService, parseArticleQuery, ValidationError } from '../services/articleService'

export interface HttpEvent {
  queryStringParameters?: Record<string, string | undefined> | null
  requestContext?: { http?: { method?: string } }
}

const json = (statusCode: number, body: unknown): APIGatewayProxyStructuredResultV2 => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

/** Builds a handler around any repository, so tests can inject a fake one. */
export const createHandler = (getRepository: () => ArticleRepository) => async (event: HttpEvent) => {
  const method = event.requestContext?.http?.method
  if (method && method !== 'GET') return json(405, { error: 'MethodNotAllowed', message: 'Only GET is supported' })
  try {
    const query = parseArticleQuery(event.queryStringParameters)
    return json(200, await createArticleService(getRepository()).search(query))
  } catch (err) {
    if (err instanceof ValidationError) return json(400, { error: 'BadRequest', message: err.message })
    console.error('GET /articles failed', err) // full detail goes to CloudWatch, not to the client
    return json(500, { error: 'InternalServerError', message: 'Failed to load articles' })
  }
}

let repository: ArticleRepository | undefined
export const handler = createHandler(() => {
  if (!repository) {
    const table = process.env.ARTICLES_TABLE_NAME
    if (!table) throw new Error('ARTICLES_TABLE_NAME is not set')
    repository = new DynamoArticleRepository(table)
  }
  return repository
})
