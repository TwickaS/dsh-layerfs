// The LayerFS home directories a bound session may write: its own Store,
// Sandbox and machine only.  node --test test/sandbox-grants.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = new URL('..', import.meta.url).pathname
mkdirSync(join(root, 'lib'), { recursive: true })
const out = mkdtempSync(join(root, 'lib', '.test-sandbox-grants-'))
await build({ absWorkingDir: root, entryPoints: [join(root, 'src/host/sandbox-grants.ts')], outfile: join(out, 'policy.mjs'), bundle: true, format: 'esm', platform: 'node', target: 'node24', external: ['@deepseek-ai/*'], logLevel: 'warning' })
const { sessionHomeRoots, desiredRoots, apply } = await import(pathToFileURL(join(out, 'policy.mjs')).href)
test.after(() => rmSync(out, { recursive: true, force: true }))

test('a bound session writes only its own Store, Sandbox and machine in the LayerFS home', () => {
  const home = mkdtempSync(join(tmpdir(), 'dsh-policy-home-'))
  try {
    for (const dir of ['store/mine', 'store/other', 'sandbox/dsh-a', 'sandbox/dsh-b', 'machine/native', 'machine/vm']) mkdirSync(join(home, dir), { recursive: true })
    assert.deepEqual(sessionHomeRoots(home, { project: 'mine/app', sandbox: 'dsh-a', machine: 'native' }),
      [join(home, 'store/mine'), join(home, 'sandbox/dsh-a'), join(home, 'machine/native')])
    assert.deepEqual(sessionHomeRoots(home, { project: 'mine/app', sandbox: 'dsh-a' }).at(-1), join(home, 'machine/native'), 'no machine recorded means native')
    assert.deepEqual(sessionHomeRoots(home, { project: 'pg/app', sandbox: 'dsh-missing', machine: 'vm' }), [join(home, 'machine/vm')], 'missing directories are not granted')
    assert.deepEqual(sessionHomeRoots(home, { project: '../x', sandbox: '..', machine: '../../etc' }), [], 'path traversal is never granted')
    assert.deepEqual(sessionHomeRoots(undefined, { project: 'mine/app' }), [])
    assert.deepEqual(sessionHomeRoots(home, { project: 'mine/app', sandbox: 'dsh-a', machine: 'native' }, { createSandboxes: true }),
      [join(home, 'store/mine'), join(home, 'sandbox'), join(home, 'machine/native')], 'a session that may create Sandboxes gets the records folder')
    writeFileSync(join(home, 'layerfs.lock'), '')
    for (const opts of [{}, { createSandboxes: true }]) for (const root of sessionHomeRoots(home, { project: 'mine/app', sandbox: 'dsh-a', machine: 'native' }, opts))
      assert.ok(statSync(root).isDirectory(), `only directories are granted (DSH refuses file roots): ${root}`)
  } finally { rmSync(home, { recursive: true, force: true }) }
})

const fakeCtx = (services) => ({ get: (name) => services[name] })
const scratchHome = () => {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-grants-'))
  const home = join(dir, 'home'), scratch = join(dir, 'scratch'), mount = join(dir, 'mount'), layerRoot = join(dir, 'root')
  for (const d of ['store/mine', 'store/other', 'sandbox/dsh-a', 'machine/native', 'trace', 'scratch', 'mount', 'root/trace']) mkdirSync(join(d.startsWith('scratch') || d.startsWith('mount') || d.startsWith('root') ? dir : home, d), { recursive: true })
  return { dir, home, scratch, mount, layerRoot }
}

test('denial: an unbound session, or one with no live binding, gets no grant', () => {
  const { dir, home, layerRoot } = scratchHome()
  try {
    const sessions = { binding: () => undefined, isSimulationManaged: () => false }
    assert.deepEqual(desiredRoots(fakeCtx({ layerfsSessions: sessions, layerfs: { home, root: layerRoot } }), 's1'), [])
    const closed = { binding: () => ({ state: 'closed', scratch: join(dir, 'scratch'), project: 'mine/app' }), isSimulationManaged: () => false }
    assert.deepEqual(desiredRoots(fakeCtx({ layerfsSessions: closed, layerfs: { home, root: layerRoot } }), 's1'), [])
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

test('a bound session is granted its scratch, mount, trace and own Store/Sandbox/machine, and nothing else', () => {
  const { dir, home, scratch, mount, layerRoot } = scratchHome()
  try {
    const binding = { state: 'bound', scratch, mount, project: 'mine/app', sandbox: 'dsh-a', machine: 'native' }
    const sessions = { binding: () => binding, isSimulationManaged: () => false }
    const roots = desiredRoots(fakeCtx({ layerfsSessions: sessions, layerfs: { home, root: layerRoot } }), 's1')
    assert.deepEqual(new Set(roots), new Set([scratch, mount, join(layerRoot, 'trace'), join(home, 'trace'), join(home, 'store/mine'), join(home, 'sandbox'), join(home, 'machine/native')]))
    for (const forbidden of [home, dir, join(home, 'store/other'), join(home, 'store'), join(home, 'secrets'), join(home, 'runtime'), join(layerRoot)]) assert.ok(!roots.includes(forbidden), `must not grant ${forbidden}`)
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

test('denial: a binding that names a missing mount or a file as scratch grants only existing directories', () => {
  const { dir, home, layerRoot } = scratchHome()
  try {
    writeFileSync(join(dir, 'file'), '')
    const sessions = { binding: () => ({ state: 'bound', scratch: join(dir, 'file'), mount: join(dir, 'gone'), project: '../x', sandbox: '..', machine: '../../etc' }), isSimulationManaged: () => false }
    const roots = desiredRoots(fakeCtx({ layerfsSessions: sessions, layerfs: { home, root: layerRoot } }), 's1')
    assert.deepEqual(new Set(roots), new Set([join(layerRoot, 'trace'), join(home, 'trace'), join(home, 'sandbox')]), 'traversal names and non-directories grant nothing; only the Sandbox records folder remains')
    assert.ok(!roots.includes(join(home, 'machine/native')), 'a traversing machine name does not fall back to native')
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

test('the stock policy is only asked for additive writable roots; grants end with the agent', async () => {
  const { dir, home, scratch, mount, layerRoot } = scratchHome()
  try {
    const registered = [], disposed = []
    const policy = { registerWritableRoot: (session, directory) => { registered.push([session.id, directory]); return () => disposed.push(directory) } }
    const binding = { state: 'bound', scratch, mount, project: 'mine/app', sandbox: 'dsh-a', machine: 'native' }
    const handlers = {}
    const services = { sandboxPolicy: policy, layerfs: { home, root: layerRoot }, layerfsSessions: { binding: () => binding, isSimulationManaged: () => false, ensureBound: async () => {} } }
    const inner = { ...fakeCtx(services), on: (event, fn) => { handlers[event] = fn }, effect: () => {}, inject: (_names, fn) => fn(inner) }
    apply(inner)
    const agent = { id: 's1', session: { id: 's1' } }
    let ran = 0
    await handlers['tools/execute']({ agent }, async () => { ran++ })
    await handlers['tools/execute']({ agent }, async () => { ran++ })
    assert.equal(ran, 2, 'the tool call always proceeds')
    assert.ok(registered.every(([id]) => id === 's1'))
    assert.equal(registered.length, new Set(registered.map(([, d]) => d)).size, 'a second call registers nothing twice')
    assert.ok(registered.some(([, d]) => d === scratch))
    handlers['agent/disposed']({ agent })
    assert.equal(disposed.length, registered.length, 'every grant is released with the agent')
    await handlers['tools/execute']({ agent: undefined }, async () => { ran++ })
    assert.equal(ran, 3)
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

test('the bundle patch leaves the stock sandbox-policy and its guards enabled', async () => {
  const { readFileSync } = await import('node:fs')
  const patch = readFileSync(new URL('../cordis.patch.yml', import.meta.url), 'utf8')
  assert.ok(!/id: sandbox-policy[\s\S]{0,40}disabled: true/.test(patch), 'sandbox-policy is never disabled')
  assert.ok(!/@deepseek-ai\/dsh-sandbox-policy/.test(patch.replace(/#.*$/gm, '')), 'no row replaces the sandbox policy service')
  assert.ok(/name: dsh-layerfs\/sandbox-grants/.test(patch))
})
