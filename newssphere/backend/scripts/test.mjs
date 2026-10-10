// Test runner. Bundles every tests/*.test.ts with esbuild (no extra TS tooling needed),
// then runs them - plus the plain tests/*.test.cjs files - with Node's built-in test runner.
import { build } from 'esbuild'
import { readdirSync, rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

rmSync('dist-test', { recursive: true, force: true })
const tsTests = readdirSync('tests').filter((f) => f.endsWith('.test.ts')).map((f) => `tests/${f}`)
await build({
  entryPoints: tsTests, outdir: 'dist-test', bundle: true, platform: 'node',
  target: 'node24', format: 'cjs', sourcemap: 'inline', logLevel: 'warning',
})
const files = [
  ...readdirSync('dist-test').filter((f) => f.endsWith('.js')).map((f) => `dist-test/${f}`),
  ...readdirSync('tests').filter((f) => f.endsWith('.test.cjs')).map((f) => `tests/${f}`),
]
const run = spawnSync(process.execPath, ['--test', ...files], { stdio: 'inherit' })
process.exit(run.status ?? 1)
