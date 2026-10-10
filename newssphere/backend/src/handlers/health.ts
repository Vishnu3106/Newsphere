// Health-check Lambda. Later: API Gateway  GET /health  ->  dist/health/index.handler
// Handlers stay thin: parse the request, call a service, return a response.
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'

export const handler = async (
  _event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    service: 'NewsSphere',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  }),
})
