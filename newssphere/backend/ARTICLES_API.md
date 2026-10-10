# GET /articles

Query parameters (all optional): `q` (keyword, any word matches title/description/tags), `category` (`All` ignored),
`source`, `location` (matched against the article's `places` array), `days` (whole number 1-3650), `sort` (`latest` default | `relevance`).
Category, source and location are exact, case-sensitive matches (same as the frontend). Relevance weights: title 3, tags 2, description 1.

Responses: `200` JSON array of Articles (`[]` if none) | `400 {error,message}` bad parameter | `405` non-GET | `500 {error,message}`.

Config: environment variable `ARTICLES_TABLE_NAME` = the DynamoDB articles table (partition key `articleId`). Region/credentials come from the AWS SDK's default provider chain (Lambda execution role in AWS).

**Limitation:** the repository Scans the whole table (following every page) and the service filters in memory. This is for a small demo dataset only - not a scalable search engine.
