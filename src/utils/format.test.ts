import { test, expect } from 'vitest'
import { ago } from './format'
test('ago formats hours',()=>expect(ago(new Date(Date.now()-3*36e5).toISOString())).toBe('3h ago'))
