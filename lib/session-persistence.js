// src/host/session-persistence.ts
import * as jsonl from "@deepseek-ai/dsh-session-persistence-jsonl";
import { SessionPersistence, SessionPersistenceNotFoundError } from "@deepseek-ai/dsh-session-persistence";
import { randomUUID as randomUUID4 } from "node:crypto";
import { closeSync as closeSync3, cpSync, existsSync as existsSync6, mkdirSync as mkdirSync4, openSync as openSync3, readFileSync as readFileSync5, renameSync as renameSync3, rmSync as rmSync3, statSync as statSync4, unlinkSync as unlinkSync3, writeFileSync as writeFileSync3 } from "node:fs";
import { dirname as dirname4, join as join5, relative, sep } from "node:path";
import { homedir as homedir2 } from "node:os";

// src/host/sessions/catalog.ts
import { createHash as createHash4, randomUUID as randomUUID3 } from "node:crypto";
import { existsSync as existsSync5, mkdirSync as mkdirSync3, readFileSync as readFileSync4, renameSync as renameSync2, writeFileSync as writeFileSync2 } from "node:fs";
import { dirname as dirname3, join as join4 } from "node:path";

// src/host/layerfs/cli.ts
import { AsyncLocalStorage as AsyncLocalStorage2 } from "node:async_hooks";
import { spawn } from "node:child_process";
import { randomUUID as randomUUID2 } from "node:crypto";
import { existsSync as existsSync4 } from "node:fs";
import { isAbsolute, join as join3 } from "node:path";
import { StringDecoder } from "node:string_decoder";

// src/host/layerfs/tracing.ts
import { AsyncLocalStorage } from "node:async_hooks";
import { createHash as createHash3, randomUUID } from "node:crypto";
import { chmodSync, existsSync as existsSync3, lstatSync, mkdirSync as mkdirSync2, readFileSync as readFileSync3, readlinkSync, realpathSync, renameSync, statSync as statSync3, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { basename, dirname as dirname2, join as join2, resolve } from "node:path";

// src/shared/logs.ts
var OUTPUT_MAX = 64 * 1024;

// src/host/layerfs/call-log.ts
import { createHash } from "node:crypto";
import * as fs from "node:fs";
var ROTATE_BYTES = 16 * 1024 * 1024;

// src/host/layerfs/call-output.ts
import { createHash as createHash2 } from "node:crypto";
import * as fs2 from "node:fs";
import { dirname, join } from "node:path";
var OUTPUT_BYTES = 64 * 1024 * 1024;
var RAW_BYTES = 256 * 1024 * 1024;

// src/host/layerfs/tracing.ts
var context = new AsyncLocalStorage();

// src/host/layerfs/cli.ts
var CliError = class extends Error {
  code;
  detail;
  transport;
  fix;
  constructor(code, message, detail = null, transport = "refusal", fix = null) {
    super(message);
    this.name = "LayerFSError";
    this.code = code;
    this.detail = detail;
    this.transport = transport;
    this.fix = fix;
  }
};
var holding = new AsyncLocalStorage2();
var PAGE = 1e3;
async function pages(read, most = Infinity) {
  const all = [];
  for (let cursor = void 0; all.length < most; ) {
    const page = await read({ limit: PAGE, ...cursor ? { cursor } : {} });
    all.push(...page.items ?? []);
    cursor = typeof page.next_cursor === "string" && page.next_cursor ? page.next_cursor : null;
    if (!cursor) break;
  }
  return all;
}

// src/host/sessions/catalog.ts
var PROJECT_BRANCH_PREFIX = "dsh.project.";
var UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
var UNCLAIMED = "unclaimed:";
var identityBranch = (id) => `${PROJECT_BRANCH_PREFIX}${id}`;
function uuidOfBranches(names) {
  const ids = names.filter((name2) => name2.startsWith(PROJECT_BRANCH_PREFIX)).map((name2) => name2.slice(PROJECT_BRANCH_PREFIX.length)).filter((id) => UUID.test(id)).sort();
  return ids[0] ?? null;
}
var keyOf = (info) => info.project ?? `${info.store}/${info.name}`;
var viewOf = (info, project) => {
  const key = info?.project ?? project;
  const at = typeof info?.created_at === "string" ? Date.parse(info.created_at) : NaN;
  return { ...info, project: key, name: String(key).split("/")[1], kind: info?.engine ?? null, created: Number.isFinite(at) ? at : null };
};
var GONE_MS = 10 * 6e4;
var UNCLAIMED_MS = 6e4;
var changed = () => new CliError("ProjectIdentityChanged", "This name now refers to another project. The original conversation remains available; recover its original project before continuing.");
var ProjectCatalog = class {
  constructor(lfs, root) {
    this.lfs = lfs;
    this.path = join4(root, "project-catalog.json");
  }
  lfs;
  path;
  /** address -> when and how LayerFS last answered it as removed (GONE_MS) */
  gone = /* @__PURE__ */ new Map();
  /** `<address>\0<created>` -> when a listing last read it as unclaimed (UNCLAIMED_MS) */
  unclaimed = /* @__PURE__ */ new Map();
  read() {
    if (!existsSync5(this.path)) return {};
    const value = JSON.parse(readFileSync4(this.path, "utf8"));
    if (value.version !== 1 || !value.projects || typeof value.projects !== "object" || Array.isArray(value.projects)) throw new Error("Invalid project catalog");
    return value.projects;
  }
  write(projects) {
    mkdirSync3(dirname3(this.path), { recursive: true });
    const temporary = `${this.path}.${randomUUID3()}.tmp`;
    writeFileSync2(temporary, JSON.stringify({ version: 1, projects }, null, 2), { mode: 384 });
    renameSync2(temporary, this.path);
  }
  retained() {
    return Object.values(this.read());
  }
  get(id) {
    return this.read()[id];
  }
  remember(row) {
    const all = this.read();
    all[row.projectId] = row;
    this.write(all);
    return row;
  }
  reading = /* @__PURE__ */ new Map();
  /**
   * The UUID on the project's branches, or null when it has none. Concurrent
   * lookups of one project share one read: parallel subagents all resolve their
   * parent's project as they start.
   */
  uuidOf(project) {
    let read = this.reading.get(project);
    if (!read) {
      read = this.readUuid(project).finally(() => this.reading.delete(project));
      this.reading.set(project, read);
    }
    return read;
  }
  /** One fresh read of the project's identity Branches (`branch list --prefix dsh.project.`); one attempt. */
  async readUuid(project) {
    const branches = await pages((paging) => this.lfs().branch.list(project, { prefix: "dsh.project.", ...paging }));
    return uuidOfBranches(branches.map((b) => String(b?.branch ?? b)));
  }
  /**
   * The project's UUID, minting it (forking `dsh.project.<uuid>` from main) when
   * `claim` and the project has none. A lost race reads back the winner.
   */
  async identify(project, claim) {
    const found = await this.uuidOf(project);
    if (found || !claim) return found;
    const id = randomUUID3();
    try {
      await this.lfs().branch.fork(project, identityBranch(id), "main");
    } catch (error) {
      const winner = await this.readUuid(project).catch(() => null);
      if (winner) return winner;
      throw error;
    }
    return await this.readUuid(project) ?? id;
  }
  observe(info, id) {
    const key = keyOf(info);
    const name2 = info.name ?? key.split("/")[1];
    return this.remember({
      projectId: id,
      identity: { id, name: name2, created: info.created },
      key,
      name: name2,
      store: info.store ?? key.split("/")[0],
      kind: info.kind ?? null,
      machine: info.machine ?? null,
      created: info.created ?? null,
      lastSeen: Date.now()
    });
  }
  /**
   * The live project at `project` with its UUID. `claim` (default) mints one for
   * a project nobody has claimed; without it an unclaimed project is refused.
   */
  async resolve(project, { claim = true } = {}) {
    const info = viewOf(await this.lfs().project.get(project, { detail: true }), project);
    const id = await this.identify(project, claim);
    if (!id) throw changed();
    return this.observe(info, id);
  }
  /**
   * The project at `project` must still be `expected`. An `unclaimed:` id from a
   * listing names its address: reads (`claim` false, the default) accept the live
   * project there as it is, unclaimed or claimed since, and never mint an identity;
   * placing a conversation (`claim`) claims it, unless someone claimed it since.
   */
  async assert(project, expected, { claim = false } = {}) {
    if (expected.startsWith(UNCLAIMED)) {
      if (expected !== `${UNCLAIMED}${project}`) throw changed();
      if (claim) return this.resolve(project);
      const info = viewOf(await this.lfs().project.get(project, { detail: true }), project);
      const id = await this.uuidOf(project);
      if (id) return this.observe(info, id);
      return {
        projectId: expected,
        key: project,
        name: info.name ?? project.split("/")[1],
        store: info.store ?? project.split("/")[0],
        kind: info.kind ?? null,
        machine: info.machine ?? null,
        created: info.created ?? null,
        lastSeen: Date.now()
      };
    }
    const live = await this.resolve(project, { claim: false }).catch((error) => {
      throw error?.code === "ProjectIdentityChanged" ? changed() : error;
    });
    if (live.projectId !== expected) throw changed();
    return live;
  }
  /**
   * Every live project with its UUID, plus remembered projects that are gone,
   * moved or replaced. Listing never claims: a project nobody has attached a
   * conversation to is listed as `unclaimed:<store>/<project>`. A remembered
   * `(address, created)` pair reuses its UUID without reading branches again.
   */
  async list() {
    const retained = this.retained();
    let live;
    try {
      live = (await pages((paging) => this.lfs().project.list({ ...paging, detail: true }))).map((info) => viewOf(info));
    } catch (error) {
      if (!retained.length) throw error;
      return retained.map((row) => ({ ...row, catalogState: "unavailable", catalogError: String(error?.message ?? error), storeState: null }));
    }
    const statuses = /* @__PURE__ */ new Map();
    const listed = /* @__PURE__ */ new Set();
    const rows = [];
    const seen = /* @__PURE__ */ new Map();
    for (const info of live) {
      const key = keyOf(info);
      const store = info.store ?? key.split("/")[0];
      if (!statuses.has(store)) statuses.set(store, this.lfs().store.get(store, { detail: true }).catch(() => null));
      const known = retained.find((row2) => row2.key === key && row2.created === info.created && !row2.projectId.startsWith(UNCLAIMED));
      let id = known?.projectId ?? null;
      let failure;
      const unclaimedKey = `${key}\0${info.created ?? ""}`;
      const checked = this.unclaimed.get(unclaimedKey);
      if (!id && !(checked !== void 0 && Date.now() - checked < UNCLAIMED_MS)) {
        id = await this.uuidOf(key).catch((error) => {
          failure = error;
          return null;
        });
        if (!id && !failure) this.unclaimed.set(unclaimedKey, Date.now());
      }
      if (id) this.unclaimed.delete(unclaimedKey);
      listed.add(unclaimedKey);
      const storeState = (await statuses.get(store))?.state ?? null;
      const base = { key, name: info.name ?? key.split("/")[1], store, kind: info.kind ?? null, machine: info.machine ?? null, created: info.created ?? null, lastSeen: Date.now(), storeState };
      if (!id) {
        rows.push({ ...base, projectId: `${UNCLAIMED}${key}`, catalogState: failure ? "unavailable" : "available", ...failure ? { catalogError: String(failure?.message ?? failure) } : {} });
        continue;
      }
      const row = known && known.projectId === id ? { ...known, ...base } : this.observe(info, id);
      if (seen.has(id)) {
        rows.push({ ...row, ...base, catalogState: "identity-mismatch", catalogError: `This project carries the same identity as ${seen.get(id)} (a restored copy?). Conversations stay with ${seen.get(id)}.` });
        continue;
      }
      seen.set(id, key);
      rows.push({ ...row, ...base, catalogState: "available" });
    }
    for (const key of this.unclaimed.keys()) if (!listed.has(key)) this.unclaimed.delete(key);
    for (const row of retained) {
      if (row.projectId.startsWith(UNCLAIMED) || seen.has(row.projectId)) continue;
      const replaced = live.some((info) => keyOf(info) === row.key);
      if (replaced) {
        rows.push({ ...row, storeState: null, catalogState: "identity-mismatch", catalogError: "This name now refers to a different project." });
        continue;
      }
      const known = this.gone.get(row.key);
      if (known && Date.now() - known.at < GONE_MS) {
        rows.push({ ...row, storeState: null, catalogState: "removed", catalogError: known.message });
        continue;
      }
      try {
        await this.lfs().project.get(row.key);
        this.gone.delete(row.key);
        rows.push({ ...row, storeState: null, catalogState: "identity-mismatch", catalogError: "This name now refers to a different project." });
      } catch (error) {
        const removed = error?.code === "NotFound";
        if (removed) this.gone.set(row.key, { at: Date.now(), message: String(error?.message ?? error) });
        else this.gone.delete(row.key);
        rows.push({ ...row, storeState: null, catalogState: removed ? "removed" : "unavailable", catalogError: String(error?.message ?? error) });
      }
    }
    return rows;
  }
};

// src/host/session-persistence.ts
var name = "dsh-layerfs-session-persistence";
var Config2 = jsonl.Config;
function atomicJson(path, value) {
  mkdirSync4(dirname4(path), { recursive: true });
  const tmp = `${path}.${randomUUID4()}.tmp`;
  writeFileSync3(tmp, `${JSON.stringify(value, null, 2)}
`, { mode: 384 });
  renameSync3(tmp, path);
}
function signatureOf(path) {
  try {
    const s = statSync4(path);
    return `${s.ino}:${s.size}:${s.mtimeMs}`;
  } catch {
    return "missing";
  }
}
var OWNER_KEY = /^(?:[a-f0-9]{64}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;
function readRoutes(path) {
  const routes = existsSync6(path) ? JSON.parse(readFileSync5(path, "utf8")) : { version: 1, sessions: {} };
  if (routes?.version !== 1 || !routes.sessions || typeof routes.sessions !== "object" || Array.isArray(routes.sessions)) throw new Error("Invalid LayerFS session ownership index");
  for (const owner of Object.values(routes.sessions)) {
    if (!owner || !OWNER_KEY.test(owner.key) || typeof owner.project !== "string" || !/^[a-z0-9][a-z0-9_.-]*\/[a-z0-9][a-z0-9_.-]*$/.test(owner.project)) throw new Error("Invalid LayerFS session owner identity");
  }
  return routes;
}
var pause = new Int32Array(new SharedArrayBuffer(4));
function withFileLock(lock, run, { timeoutMs = 1e4, staleMs = 3e4 } = {}) {
  mkdirSync4(dirname4(lock), { recursive: true });
  const deadline = Date.now() + timeoutMs;
  let fd;
  while (fd === void 0) {
    try {
      fd = openSync3(lock, "wx", 384);
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      try {
        if (Date.now() - statSync4(lock).mtimeMs > staleMs) {
          unlinkSync3(lock);
          continue;
        }
      } catch {
        continue;
      }
      if (Date.now() > deadline) throw new Error(`Timed out waiting for ${lock}`);
      Atomics.wait(pause, 0, 0, 10);
    }
  }
  try {
    return run();
  } finally {
    closeSync3(fd);
    try {
      unlinkSync3(lock);
    } catch {
    }
  }
}
var RoutedHandle = class {
  constructor(current) {
    this.current = current;
  }
  current;
  get id() {
    return this.current.id;
  }
  get header() {
    return this.current.header;
  }
  get access() {
    return this.current.access;
  }
  get inheritedEventCount() {
    return this.current.inheritedEventCount;
  }
  read(...args) {
    return this.current.read(...args);
  }
  append(...args) {
    return this.current.append(...args);
  }
  flush(...args) {
    return this.current.flush(...args);
  }
  close() {
    return this.current.close();
  }
  [Symbol.asyncDispose]() {
    return this.close();
  }
};
function deletedHandle(previous) {
  const header = previous.header;
  const access = previous.access;
  return {
    id: previous.id,
    header,
    access,
    inheritedEventCount: previous.inheritedEventCount,
    read: async () => ({ events: [] }),
    append: async () => {
    },
    flush: async () => {
    },
    close: async () => {
    }
  };
}
var LayerfsSessionPersistence = class extends SessionPersistence {
  backends = /* @__PURE__ */ new Map();
  catalogInstance;
  handles = /* @__PURE__ */ new Map();
  migrations = /* @__PURE__ */ new Map();
  routes;
  routesPath;
  routesSignature;
  stock;
  /** Non-importing facade for the archive store; routes to the owner's backend. */
  local;
  constructor(ctx, stock) {
    super(ctx);
    this.stock = stock;
    this.local = {
      create: (header, options) => this.create(header, options),
      open: (id, access, options) => this.openLocal(id, access, options),
      stat: (id, options) => this.statLocal(id, options),
      list: (options) => this.list(options),
      flush: () => this.flush()
    };
  }
  get service() {
    return this.ctx.get("layerfs");
  }
  get sessions() {
    return this.ctx.get("layerfsSessions");
  }
  get store() {
    return this.sessions?.store;
  }
  get projectHome() {
    return this.service?.projectSessionHome ?? process.env.DSH_LAYERFS_SESSION_HOME ?? join5(process.env.DSH_HOME ?? join5(homedir2(), ".dsh"), "layerfs", "project-sessions");
  }
  /**
   * `owners.json` is shared by every DSH using this project-session home (it can
   * be configured to one per user, not per DSH home). Reads reload it when
   * another process replaced it; writes change one entry under a lock against
   * the file's current contents, so concurrent writers never drop each other's routes.
   */
  get owners() {
    const path = join5(this.projectHome, "owners.json");
    const signature = signatureOf(path);
    if (!this.routes || this.routesPath !== path || this.routesSignature !== signature) {
      this.routes = readRoutes(path);
      this.routesPath = path;
      this.routesSignature = signature;
    }
    return this.routes;
  }
  /** Set (or with `undefined`, remove) one session's owner route. */
  setOwner(id, owner) {
    const path = join5(this.projectHome, "owners.json");
    withFileLock(`${path}.lock`, () => {
      const routes = readRoutes(path);
      if (owner) routes.sessions[id] = owner;
      else delete routes.sessions[id];
      atomicJson(path, routes);
      this.routes = routes;
      this.routesPath = path;
      this.routesSignature = signatureOf(path);
    });
  }
  /** Ownership is local durable metadata, readable without reaching LayerFS. */
  ownerOf(id) {
    if (!this.stock || !this.service) return void 0;
    const owner = this.owners.sessions[id];
    return owner ? { project: owner.project } : void 0;
  }
  /** The Store ID recorded with a conversation's owner, when its identity is known. */
  storeIdOf(id) {
    return this.owners.sessions[id]?.identity?.storeId;
  }
  ownedSessionIds(project, projectId) {
    if (!this.stock || !this.service) return [];
    return Object.entries(this.owners.sessions).filter(([, owner]) => (!project || owner.project === project) && (!projectId || (owner.identity?.id ?? owner.key) === projectId)).map(([id]) => id);
  }
  get catalog() {
    if (this.catalogInstance?.root !== this.projectHome) this.catalogInstance = { root: this.projectHome, catalog: new ProjectCatalog(() => this.service.lfs, this.projectHome) };
    return this.catalogInstance.catalog;
  }
  projectIdOf(id) {
    const owner = this.owners.sessions[id];
    return owner?.identity?.id ?? owner?.key;
  }
  /** Reading local logs requires no Store. Execution and archive writes must
   * freshly find the owner's project UUID at its address, including on an
   * already mounted session; a missing or different UUID blocks them. */
  async assertSessionIdentity(id) {
    const owner = this.owners.sessions[id];
    if (!owner) return void 0;
    const expected = owner.identity?.id ?? owner.key;
    const row = await this.catalog.resolve(owner.project, { claim: false }).catch((error) => {
      if (error?.code === "ProjectIdentityChanged") throw new CliError("ProjectIdentityChanged", "The project identity changed. Conversation history was retained and execution is blocked.");
      throw error;
    });
    if (row.projectId !== expected) throw new CliError("ProjectIdentityChanged", "The project identity changed. Conversation history was retained and execution is blocked.");
    return row;
  }
  async catalogProjects() {
    const rows = await this.catalog.list();
    for (const owner of Object.values(this.owners.sessions)) {
      const id = owner.identity?.id ?? owner.key;
      if (rows.some((row2) => row2.projectId === id)) continue;
      const [store, name2] = owner.project.split("/");
      const row = {
        projectId: id,
        identity: owner.identity,
        key: owner.project,
        name: name2,
        store,
        kind: null,
        machine: null,
        created: owner.identity?.created ?? null,
        lastSeen: 0,
        catalogState: "unavailable",
        catalogError: "The original project identity cannot currently be verified.",
        storeState: null
      };
      this.catalog.remember(row);
      rows.push(row);
    }
    return rows;
  }
  async backend(owner) {
    let pending = this.backends.get(owner.key);
    if (!pending) {
      pending = (async () => {
        const inner = this.ctx.isolate("sessionPersistence");
        await inner.plugin(jsonl, { root: join5(this.projectHome, "projects", owner.key, "sessions"), compression: "none" }).await();
        return inner.get("sessionPersistence");
      })();
      this.backends.set(owner.key, pending);
      pending.catch(() => this.backends.delete(owner.key));
    }
    return pending;
  }
  async projectBackend(project) {
    const row = await this.catalog.resolve(project);
    return this.backend({ project, key: row.projectId, identity: row.identity });
  }
  async target(id, header) {
    if (!this.stock) return this.local;
    if (!this.service) return this.stock;
    const owner = this.owners.sessions[id];
    if (owner) return this.backend(owner);
    const state = this.sessions?.state.read();
    const project = state?.sessions[id]?.project ?? state?.pending[id]?.project ?? (header?.parentSession ? this.owners.sessions[header.parentSession]?.project : void 0);
    if (project) {
      if (await this.stock.stat(id)) return this.stock;
      const row = await this.catalog.resolve(project);
      const next = { project, key: row.projectId, identity: row.identity };
      this.setOwner(id, next);
      return this.backend(next);
    }
    return this.stock;
  }
  wrap(handle) {
    if (!this.stock) return handle;
    const wrapped = new RoutedHandle(handle);
    if (handle.access === "write") {
      this.handles.set(String(handle.id), wrapped);
      const close = wrapped.close.bind(wrapped);
      wrapped.close = () => {
        if (this.handles.get(String(handle.id)) === wrapped) this.handles.delete(String(handle.id));
        return close();
      };
    }
    return wrapped;
  }
  readDeleted() {
    const path = join5(this.projectHome, "deleted.json");
    try {
      const value = JSON.parse(readFileSync5(path, "utf8"));
      if (value?.version === 1 && value.sessions && typeof value.sessions === "object" && !Array.isArray(value.sessions)) return value;
    } catch {
    }
    return { version: 1, sessions: {} };
  }
  /** Whether this conversation was deleted here (a Presets Reset). Only an explicit import brings it back. */
  isDeleted(id) {
    return !!this.readDeleted().sessions[id];
  }
  /** An explicit import of a deleted conversation lifts its deletion record. */
  undelete(id) {
    if (!this.isDeleted(id)) return;
    const path = join5(this.projectHome, "deleted.json");
    withFileLock(`${path}.lock`, () => {
      const value = this.readDeleted();
      delete value.sessions[id];
      atomicJson(path, value);
    });
  }
  /**
   * Delete owner-routed project conversations: the unpacked log folder (with
   * its `layerfs.json` sidecar) and the owner route, plus a deletion record so
   * store sync and open-by-id never import them back implicitly. A loaded
   * session's writer is retired first; later writes go nowhere. Logs outside
   * this project-session home (stock or legacy) are never touched.
   * @returns the ids whose route or log was removed.
   */
  async deleteSessions(ids) {
    if (!this.stock || !this.service) return [];
    const removed = [];
    const records = {};
    for (const id of ids) {
      const owner = this.owners.sessions[id];
      if (!owner) continue;
      records[id] = { project: owner.project, at: Date.now() };
      const writer = this.handles.get(id);
      if (writer) {
        this.handles.delete(id);
        const previous = writer.current;
        writer.current = deletedHandle(previous);
        await previous.close().catch(() => {
        });
      }
      const backend = await this.backend(owner);
      await backend.flush().catch(() => {
      });
      const snapshot = await backend.stat(id).catch(() => void 0);
      const root = join5(this.projectHome, "projects", owner.key, "sessions");
      const dir = snapshot?.location?.path ? dirname4(snapshot.location.path) : void 0;
      const inside = dir ? relative(root, dir) : "";
      if (dir && inside && !inside.startsWith("..") && !inside.startsWith(sep)) rmSync3(dir, { recursive: true, force: true });
      this.setOwner(id, void 0);
      removed.push(id);
    }
    if (Object.keys(records).length) {
      const path = join5(this.projectHome, "deleted.json");
      withFileLock(`${path}.lock`, () => {
        const value = this.readDeleted();
        Object.assign(value.sessions, records);
        atomicJson(path, value);
      });
    }
    return removed;
  }
  /** Move a session only when its owner changes before work starts, or as an
   * explicit legacy migration. Copy and validate first; retain source as backup. */
  async migrateProject(session, project) {
    const id = typeof session === "string" ? session : String(session.id);
    const previous = this.migrations.get(id) ?? Promise.resolve();
    const run = previous.then(() => this.migrateNow(id, project));
    this.migrations.set(id, run);
    try {
      await run;
    } finally {
      if (this.migrations.get(id) === run) this.migrations.delete(id);
    }
  }
  async migrateNow(id, project) {
    const oldOwner = this.owners.sessions[id];
    const row = project ? await this.catalog.resolve(project) : void 0;
    if (oldOwner && row && oldOwner.project === project) await this.assertSessionIdentity(id);
    const newOwner = row ? { project, key: oldOwner?.project === project ? oldOwner.key : row.projectId, identity: row.identity } : void 0;
    const source = oldOwner ? await this.backend(oldOwner) : this.stock;
    const destination = newOwner ? await this.backend(newOwner) : this.stock;
    if (source === destination) return;
    const writer = this.handles.get(id);
    await source.flush();
    const sourceStat = await source.stat(id);
    if (!sourceStat) {
      this.setOwner(id, newOwner);
      return;
    }
    const reader = await source.open(id, "read");
    let events, inheritedEventCount;
    try {
      events = (await reader.read()).events;
      inheritedEventCount = reader.inheritedEventCount;
    } finally {
      await reader.close();
    }
    let target = await destination.stat(id);
    if (target) {
      const existing = await destination.open(id, "read");
      try {
        if (JSON.stringify(existing.header) !== JSON.stringify(sourceStat.header) || JSON.stringify((await existing.read()).events) !== JSON.stringify(events) || existing.inheritedEventCount !== inheritedEventCount) throw new Error(`Session ${id} has divergent histories; ownership was not changed`);
      } finally {
        await existing.close();
      }
    } else {
      const created = await destination.create(sourceStat.header, inheritedEventCount ? { inheritedEventCount } : void 0);
      try {
        if (events.length) await created.append(events);
        await created.flush();
      } finally {
        await created.close();
      }
      target = await destination.stat(id);
      const verify = await destination.open(id, "read");
      try {
        if (JSON.stringify((await verify.read()).events) !== JSON.stringify(events)) throw new Error(`Session ${id} migration validation failed`);
      } finally {
        await verify.close();
      }
    }
    if (writer) await writer.current.close();
    let migratedWriter;
    try {
      if (writer) {
        const after = await source.open(id, "read");
        let drained;
        try {
          drained = (await after.read()).events;
        } finally {
          await after.close();
        }
        if (drained.length > events.length) {
          if (JSON.stringify(drained.slice(0, events.length)) !== JSON.stringify(events)) throw new Error(`Session ${id} changed during migration; ownership was not changed`);
          const tail = await destination.open(id, "write");
          try {
            await tail.append(drained.slice(events.length));
            await tail.flush();
          } finally {
            await tail.close();
          }
        }
        migratedWriter = await destination.open(id, "write");
      }
      this.setOwner(id, newOwner);
    } catch (error) {
      await migratedWriter?.close();
      if (writer) writer.current = await source.open(id, "write");
      throw error;
    }
    if (writer) writer.current = migratedWriter;
    if (sourceStat.location?.path) {
      const sourceDir = dirname4(sourceStat.location.path);
      const sourceSidecar = join5(sourceDir, "layerfs.json");
      if (target?.location?.path && existsSync6(sourceSidecar)) {
        const sidecar = JSON.parse(readFileSync5(sourceSidecar, "utf8"));
        atomicJson(join5(dirname4(target.location.path), "layerfs.json"), { ...sidecar, ...project ? { project } : {} });
      }
      const backup = join5(this.projectHome, "migration-backups", randomUUID4());
      mkdirSync4(dirname4(backup), { recursive: true });
      try {
        renameSync3(sourceDir, backup);
      } catch (error) {
        try {
          cpSync(sourceDir, backup, { recursive: true, errorOnExist: true, force: false });
        } catch {
        }
        ;
        this.ctx.logger("layerfs").warn("session %s moved; original migration source retained at %s: %s", id, sourceDir, error?.message ?? error);
      }
    }
    if (project) await this.updateSidecar(id, () => {
    });
  }
  async create(header, options) {
    return this.wrap(await (await this.target(String(header.id), header)).create(header, options));
  }
  async flush() {
    if (!this.stock) return this.local.flush();
    await this.stock.flush();
    for (const backend of this.backends.values()) await (await backend).flush();
  }
  async list(options) {
    if (!this.stock) return this.local.list(options);
    if (!this.service) return this.stock.list(options);
    const all = /* @__PURE__ */ new Map();
    for (const snapshot of await this.stock.list(options)) if (!this.owners.sessions[snapshot.header.id]) all.set(snapshot.header.id, snapshot);
    for (const owner of new Map(Object.values(this.owners.sessions).map((owner2) => [owner2.key, owner2])).values()) {
      for (const snapshot of await (await this.backend(owner)).list(options)) {
        if (this.owners.sessions[snapshot.header.id]?.key === owner.key) all.set(snapshot.header.id, snapshot);
      }
    }
    return [...all.values()];
  }
  async statLocal(id, options) {
    return (await this.target(id)).stat(id, options);
  }
  async openLocal(id, access, options) {
    return this.wrap(await (await this.target(id)).open(id, access, options));
  }
  async restore(id) {
    if (!this.store || this.stock && this.service && this.isDeleted(id)) return false;
    try {
      const project = await this.store.locate(id);
      return !!project && (await this.store.import(project, id)).imported;
    } catch (error) {
      ;
      this.ctx.logger("layerfs").warn("session %s: import from LayerFS failed: %s", id, error?.message ?? error);
      return false;
    }
  }
  async stat(id, options) {
    const snapshot = await this.statLocal(String(id), options);
    if (snapshot || !await this.restore(String(id))) return snapshot;
    return this.statLocal(String(id), options);
  }
  async open(id, access, options) {
    try {
      return await this.openLocal(String(id), access, options);
    } catch (error) {
      if (!(error instanceof SessionPersistenceNotFoundError) || !await this.restore(String(id))) throw error;
      return this.openLocal(String(id), access, options);
    }
  }
  async sidecarPath(id) {
    let snapshot = await this.statLocal(id);
    if (snapshot && !snapshot.location?.path) {
      await (await this.target(id)).flush();
      snapshot = await this.statLocal(id);
    }
    if (!snapshot?.location?.path) throw new Error(`Session ${id} has no durable log for LayerFS metadata`);
    return join5(dirname4(snapshot.location.path), "layerfs.json");
  }
  async readSidecar(id) {
    const path = await this.sidecarPath(id);
    return existsSync6(path) ? JSON.parse(readFileSync5(path, "utf8")) : void 0;
  }
  async updateSidecar(id, fn) {
    const path = await this.sidecarPath(id);
    const project = this.owners.sessions[id]?.project;
    if (!project) return;
    const value = existsSync6(path) ? JSON.parse(readFileSync5(path, "utf8")) : { version: 1, sessionId: id, project, invocations: [] };
    fn(value);
    value.projectId = this.projectIdOf(id);
    value.projectIdentity = this.owners.sessions[id]?.identity;
    atomicJson(path, value);
  }
  async recordInvocation(invocation) {
    await this.updateSidecar(String(invocation.sessionId), (sidecar) => {
      sidecar.invocations ??= [];
      const index = sidecar.invocations.findIndex((item) => item.id === invocation.id);
      if (index < 0) sidecar.invocations.push(invocation);
      else sidecar.invocations[index] = invocation;
    });
  }
};
async function apply(ctx, config) {
  const inner = ctx.isolate("sessionPersistence");
  await inner.plugin(jsonl, config).await();
  const local = inner.get("sessionPersistence");
  if (!local) throw new Error("dsh-layerfs: the inner JSONL session persistence did not start");
  await ctx.plugin({ name: "dsh-layerfs-session-persistence-service", apply(serviceCtx) {
    new LayerfsSessionPersistence(serviceCtx, local);
  } }).await();
  ctx.logger("layerfs").info("session persistence: stock JSONL at %s; project conversations use owner-routed unpacked JSONL", config.root);
}
export {
  Config2 as Config,
  LayerfsSessionPersistence,
  apply,
  name,
  withFileLock
};
//# sourceMappingURL=session-persistence.js.map
