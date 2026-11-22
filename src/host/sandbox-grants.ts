/**
 * LayerFS's additions to the sandbox policy, as additive grants only. The stock
 * `sandbox-policy` row stays enabled and in charge: its mode, its workspace root
 * (the session's own working directory), its network resolver and every guard
 * mounted on it apply unchanged. For a session bound by dsh-layerfs this module
 * calls the stock service's `registerWritableRoot` for the directories the
 * session's own execution needs: its scratch folder, the project mount, the call
 * log directories the managed CLI appends to, and the parts of the private LayerFS
 * home that belong to the session (its project's Store, the Sandbox records folder
 * so it can create Sandboxes of its own, its machine). Other Stores and machines in
 * the same home stay read-only: a session drives them only through the host. A
 * session with no binding gets no grant. Nothing here can lower the mode, move the
 * workspace root, or remove another grant, and a grant ends with its session
 * binding or its agent.
 */
import { existsSync, realpathSync, statSync } from 'node:fs'
import { join, resolve, sep } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'

export const name = 'dsh-layerfs-sandbox-grants'

const isDir = (path: string) => { try { return statSync(path).isDirectory() } catch { return false } }
/** A plain name component (no traversal), as LayerFS names Stores, Sandboxes and machines. */
const component = (value: unknown): string | undefined =>
  typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(value) && value !== '..' ? value : undefined

/**
 * The LayerFS home directories one bound session's managed CLI writes. With
 * `createSandboxes`, the whole `sandbox/` records folder instead of the session
 * Sandbox's alone: an agent may create (and close) Sandboxes of its own for more
 * Workspace room (skill `methods/sandbox.md`), and `sandbox create` makes
 * `sandbox/<name>/`, which needs its parent writable. The skill keeps it to this
 * project's Sandboxes and never the session's own.
 */
export function sessionHomeRoots(home: string | undefined, binding: { project?: string, sandbox?: string, machine?: string }, options: { createSandboxes?: boolean } = {}): string[] {
  if (!home || !existsSync(home)) return []
  const store = component(binding.project?.split('/')[0])
  const sandbox = component(binding.sandbox)
  const machine = component(binding.machine ?? 'native')
  // Directories only: DSH refuses a policy whose extra writable roots are not existing
  // directories (every command then fails), so the home lock `layerfs.lock` that
  // `sandbox create` opens for writing cannot be granted on its own (FIX-LOG F10).
  return [
    store && join(home, 'store', store),
    options.createSandboxes ? join(home, 'sandbox') : sandbox && join(home, 'sandbox', sandbox),
    machine && join(home, 'machine', machine),
  ].filter((dir): dir is string => !!dir && isDir(dir))
}

/**
 * Drop the directories a sandbox that protects a home would refuse: the stock local
 * provider fails every command of a session whose writable roots equal, lie inside or
 * contain its `protectedHome` (`HOME_IN_WRITABLE_ROOT`), so one such grant would stop
 * the session's whole shell. A host that protects no home (`undefined`) keeps all.
 * @param roots - the wanted writable roots.
 * @param protectedHome - the sandbox provider's `protectedHome`, if any.
 * @returns the roots clear of it.
 */
export function outsideProtectedHome(roots: string[], protectedHome: string | undefined): string[] {
  if (!protectedHome) return roots
  const real = (path: string): string => { try { return realpathSync.native(path) } catch { return resolve(path) } }
  const home = real(protectedHome)
  const within = (path: string, base: string): boolean => path === base || path.startsWith(base.endsWith(sep) ? base : base + sep)
  return roots.filter((dir) => { const r = real(dir); return !within(r, home) && !within(home, r) })
}

/** What a binding looks like to the grants; the session service's own record. */
interface Binding { state?: string, kind?: string, parent?: string, scratch?: string, mount?: string, project?: string, sandbox?: string, machine?: string }

/**
 * The directories one session may additionally write, every one an existing
 * directory (DSH refuses a policy naming anything else, and then every command
 * of the session fails).
 * @param ctx - context holding the `layerfs` and `layerfsSessions` services.
 * @param sessionId - the session to compute for.
 * @returns the absolute directories, without duplicates; empty for an unbound session.
 */
export function desiredRoots(ctx: Context, sessionId: string): string[] {
  const sessions = (ctx as any).get?.('layerfsSessions')
  const layerfs = (ctx as any).get?.('layerfs')
  let b: Binding | undefined = sessions?.binding?.(sessionId)
  if (b?.kind === 'shared' && b.parent) b = sessions.binding(b.parent) ?? b
  const home: string | undefined = layerfs?.home
  // An active script also drives its own run's Store, machine and Sandboxes;
  // a planned Sandbox may not exist yet (its scripted `sandbox create` makes it).
  const scope = sessions?.isSimulationManaged?.(sessionId) ? (ctx as any).get?.('layerfsSimulations')?.executionScope?.(sessionId) : undefined
  const scripted = scope && home && existsSync(home)
    ? [...sessionHomeRoots(home, { project: scope.project, machine: scope.machine }), ...(scope.sandboxes as string[]).map(component).filter((n): n is string => !!n).map(n => join(home, 'sandbox', n))]
    : []
  let scratch: string | undefined, mount: string | undefined, owned: string[]
  if (b?.state === 'bound') {
    scratch = b.scratch; mount = b.mount
    owned = [...sessionHomeRoots(home, b, { createSandboxes: true }), ...scripted]
  } else {
    if (!scope) return []
    scratch = b?.scratch ?? sessions?.binding?.(scope.rootSessionId)?.scratch
    owned = scripted
  }
  // Call log lines the managed CLI writes: the stand-in (`<root>/trace`) or LayerFS's own (`<home>/trace`).
  const trace = layerfs?.root ? join(layerfs.root, 'trace') : undefined
  const homeTrace = home ? join(home, 'trace') : undefined
  return [...new Set([scratch, mount, trace, homeTrace, ...owned].filter((dir): dir is string => !!dir && isDir(dir)))]
}

/**
 * Keeps each live session's registered writable roots equal to {@link desiredRoots}.
 * Stock `registerWritableRoot` grants are runtime-only and per live Session, so
 * they are renewed before every tool call (after the session's binding is made) and
 * dropped with the agent. Both calls are idempotent.
 */
export function apply(ctx: Context): void {
  ctx.inject(['sandboxPolicy', 'layerfs', 'layerfsSessions'], (inner) => {
    const held = new Map<string, Map<string, () => void>>()
    const reconcile = (session: any): void => {
      const id = String(session.id)
      const want = new Set(outsideProtectedHome(desiredRoots(inner, id), (inner as any).get?.('sandbox')?.protectedHome))
      const have = held.get(id) ?? new Map<string, () => void>()
      for (const [dir, dispose] of have) if (!want.has(dir)) { dispose(); have.delete(dir) }
      for (const dir of want) if (!have.has(dir)) have.set(dir, (inner as any).get('sandboxPolicy').registerWritableRoot(session, dir))
      if (have.size) held.set(id, have); else held.delete(id)
    }
    const release = (id: string): void => { for (const dispose of held.get(id)?.values() ?? []) dispose(); held.delete(id) }
    inner.on('tools/execute' as any, async (execution: any, next: () => Promise<any>) => {
      const agent = execution.agent
      if (agent) {
        // Idempotent: a bound session is bound already, so this only waits for the binding the session service makes.
        await (inner as any).get('layerfsSessions')?.ensureBound?.(agent, { rebind: false })
        reconcile(agent.session)
      }
      return next()
    })
    inner.on('agent/disposed' as any, ({ agent }: any) => release(String(agent.id)))
    inner.effect(() => () => { for (const id of [...held.keys()]) release(id) }, 'dsh-layerfs: sandbox grants')
  })
}
