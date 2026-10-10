// Build script. TypeScript only CHECKS types (tsc --noEmit); esbuild does the real build.
// Every file in src/handlers/ becomes one Lambda bundle: dist/<handler-name>/index.js
import { build } from 'esbuild'
import { readdirSync, rmSync } from 'node:fs'

rmSync('dist', { recursive: true, force: true }) // start clean (works on Windows too)

const entryPoints = readdirSync('src/handlers')
  .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
  .map((f) => `src/handlers/${f}`)

await build({
  entryPoints,
  outdir: 'dist',
  outbase: 'src/handlers',
  entryNames: '[name]/index',
  bundle: true,              // pull our own code into one file per Lambda
  platform: 'node',
  target: 'node24',          // AWS Lambda runtime nodejs24.x
  format: 'cjs',
  sourcemap: true,
  // The AWS SDK is deliberately NOT external: bundling it uses the exact versions locked in
  // package-lock.json instead of whatever the Lambda runtime happens to ship. esbuild
  // tree-shakes it, so only the clients we import end up in the bundle.
  logLevel: 'info',
})
console.log(`Built ${entryPoints.length} handler(s) into dist/`)
