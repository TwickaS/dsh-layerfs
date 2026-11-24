// src/host/sandbox-grants.ts
import { existsSync, realpathSync, statSync } from "node:fs";
import { join, resolve, sep } from "node:path";
var name = "dsh-layerfs-sandbox-grants";
var isDir = (path) => {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
};
var component = (value) => typeof value === "string" && /^[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(value) && value !== ".." ? value : void 0;
function sessionHomeRoots(home, binding, options = {}) {
  if (!home || !existsSync(home)) return [];
  const store = component(binding.project?.split("/")[0]);
  const sandbox = component(binding.sandbox);
  const machine = component(binding.machine ?? "native");
  return [
    store && join(home, "store", store),
    options.createSandboxes ? join(home, "sandbox") : sandbox && join(home, "sandbox", sandbox),
    machine && join(home, "machine", machine)
  ].filter((dir) => !!dir && isDir(dir));
}
function outsideProtectedHome(roots, protectedHome) {
  if (!protectedHome) return roots;
  const real = (path) => {
    try {
      return realpathSync.native(path);
    } catch {
      return resolve(path);
    }
  };
  const home = real(protectedHome);
  const within = (path, base) => path === base || path.startsWith(base.endsWith(sep) ? base : base + sep);
  return roots.filter((dir) => {
    const r = real(dir);
    return !within(r, home) && !within(home, r);
  });
}
function desiredRoots(ctx, sessionId) {
  const sessions = ctx.get?.("layerfsSessions");
  const layerfs = ctx.get?.("layerfs");
  let b = sessions?.binding?.(sessionId);
  if (b?.kind === "shared" && b.parent) b = sessions.binding(b.parent) ?? b;
  const home = layerfs?.home;
  const scope = sessions?.isSimulationManaged?.(sessionId) ? ctx.get?.("layerfsSimulations")?.executionScope?.(sessionId) : void 0;
  const scripted = scope && home && existsSync(home) ? [...sessionHomeRoots(home, { project: scope.project, machine: scope.machine }), ...scope.sandboxes.map(component).filter((n) => !!n).map((n) => join(home, "sandbox", n))] : [];
  let scratch, mount, owned;
  if (b?.state === "bound") {
    scratch = b.scratch;
    mount = b.mount;
    owned = [...sessionHomeRoots(home, b, { createSandboxes: true }), ...scripted];
  } else {
    if (!scope) return [];
    scratch = b?.scratch ?? sessions?.binding?.(scope.rootSessionId)?.scratch;
    owned = scripted;
  }
  const trace = layerfs?.root ? join(layerfs.root, "trace") : void 0;
  const homeTrace = home ? join(home, "trace") : void 0;
  return [...new Set([scratch, mount, trace, homeTrace, ...owned].filter((dir) => !!dir && isDir(dir)))];
}
function apply(ctx) {
  ctx.inject(["sandboxPolicy", "layerfs", "layerfsSessions"], (inner) => {
    const held = /* @__PURE__ */ new Map();
    const reconcile = (session) => {
      const id = String(session.id);
      const want = new Set(outsideProtectedHome(desiredRoots(inner, id), inner.get?.("sandbox")?.protectedHome));
      const have = held.get(id) ?? /* @__PURE__ */ new Map();
      for (const [dir, dispose] of have) if (!want.has(dir)) {
        dispose();
        have.delete(dir);
      }
      for (const dir of want) if (!have.has(dir)) have.set(dir, inner.get("sandboxPolicy").registerWritableRoot(session, dir));
      if (have.size) held.set(id, have);
      else held.delete(id);
    };
    const release = (id) => {
      for (const dispose of held.get(id)?.values() ?? []) dispose();
      held.delete(id);
    };
    inner.on("tools/execute", async (execution, next) => {
      const agent = execution.agent;
      if (agent) {
        await inner.get("layerfsSessions")?.ensureBound?.(agent, { rebind: false });
        reconcile(agent.session);
      }
      return next();
    });
    inner.on("agent/disposed", ({ agent }) => release(String(agent.id)));
    inner.effect(() => () => {
      for (const id of [...held.keys()]) release(id);
    }, "dsh-layerfs: sandbox grants");
  });
}
export {
  apply,
  desiredRoots,
  name,
  outsideProtectedHome,
  sessionHomeRoots
};
//# sourceMappingURL=sandbox-grants.js.map
