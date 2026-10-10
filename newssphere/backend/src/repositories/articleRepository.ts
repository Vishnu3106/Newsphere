// Repository = the ONLY layer that talks to DynamoDB. It knows nothing about HTTP or search rules.
// Credentials and region come from the AWS SDK's normal provider chain (never hardcoded).
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'
import type { Article } from '../models/article'

/** What the service layer needs. Tests provide a fake implementation (no AWS required). */
export interface ArticleRepository {
  listAll(): Promise<Article[]>
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '')
// DocumentClient returns DynamoDB lists as arrays but string sets as JS Set objects; accept both.
const strings = (v: unknown): string[] =>
  (Array.isArray(v) ? v : v instanceof Set ? [...v] : []).filter((x): x is string => typeof x === 'string')

/** Converts a raw DynamoDB item into an Article, filling safe defaults for missing attributes. */
export const toArticle = (item: Record<string, unknown>): Article => ({
  articleId: str(item.articleId),
  title: str(item.title),
  description: str(item.description),
  source: str(item.source),
  category: str(item.category),
  publishedAt: str(item.publishedAt),
  image: str(item.image),
  location: str(item.location),
  places: strings(item.places),
  storyId: str(item.storyId),
  tags: strings(item.tags),
  url: str(item.url),
})

export class DynamoArticleRepository implements ArticleRepository {
  private readonly tableName: string
  private readonly client: Pick<DynamoDBDocumentClient, 'send'>

  constructor(
    tableName: string,
    client: Pick<DynamoDBDocumentClient, 'send'> = DynamoDBDocumentClient.from(new DynamoDBClient({})),
  ) {
    this.tableName = tableName
    this.client = client
  }

  /**
   * Full-table Scan. A single Scan returns at most 1 MB, so we keep following
   * LastEvaluatedKey until DynamoDB says there are no more pages.
   * Fine for a small demo dataset; a Scan reads every item, so it does not scale.
   */
  async listAll(): Promise<Article[]> {
    const articles: Article[] = []
    let startKey: Record<string, unknown> | undefined
    do {
      const page = await this.client.send(
        new ScanCommand({ TableName: this.tableName, ExclusiveStartKey: startKey }),
      )
      for (const item of page.Items ?? []) articles.push(toArticle(item))
      startKey = page.LastEvaluatedKey
    } while (startKey)
    return articles
  }
}
