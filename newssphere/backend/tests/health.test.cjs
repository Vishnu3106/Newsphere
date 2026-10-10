// Real test: loads the BUILT Lambda bundle and calls it. Run via `npm test` (builds first).
const test = require('node:test')
const assert = require('node:assert/strict')
const { handler } = require('../dist/health/index.js')

test('health handler returns 200 and a healthy NewsSphere status', async () => {
  const res = await handler({})
  assert.equal(res.statusCode, 200)
  const body = JSON.parse(res.body)
  assert.equal(body.service, 'NewsSphere')
  assert.equal(body.status, 'healthy')
})
