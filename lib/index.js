var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __knownSymbol = (name6, symbol) => (symbol = Symbol[name6]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name6);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name6 in all)
    __defProp(target, name6, { get: all[name6], enumerable: true });
};
var __decoratorStart = (base) => [, , , __create(base?.[__knownSymbol("metadata")] ?? null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name6, done, metadata, fns) => ({ kind: __decoratorStrings[kind], name: name6, metadata, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
var __runInitializers = (array, flags, self, value) => {
  for (var i = 0, fns = array[flags >> 1], n = fns && fns.length; i < n; i++) flags & 1 ? fns[i].call(self) : value = fns[i].call(self, value);
  return value;
};
var __decorateElement = (array, flags, name6, decorators, target, extra) => {
  var fn, it, done, ctx, access, k = flags & 7, s = !!(flags & 8), p = !!(flags & 16);
  var j = k > 3 ? array.length + 1 : k ? s ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
  var initializers = k > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
  var desc = k && (!p && !s && (target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(k < 4 ? target : { get [name6]() {
    return __privateGet(this, extra);
  }, set [name6](x) {
    return __privateSet(this, extra, x);
  } }, name6));
  k ? p && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name6) : __name(target, name6);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name6, done = {}, array[3], extraInitializers);
    if (k) {
      ctx.static = s, ctx.private = p, access = ctx.access = { has: p ? (x) => __privateIn(target, x) : (x) => name6 in x };
      if (k ^ 3) access.get = p ? (x) => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : (x) => x[name6];
      if (k > 2) access.set = p ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name6] = y;
    }
    it = (0, decorators[i])(k ? k < 4 ? p ? extra : desc[key] : k > 4 ? void 0 : { get: desc.get, set: desc.set } : target, ctx), done._ = 1;
    if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p ? extra = it : desc[key] = it : target = it);
    else if (typeof it !== "object" || it === null) __typeError("Object expected");
    else __expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn);
  }
  return k || __decoratorMetadata(array, target), desc && __defProp(target, name6, desc), p ? k ^ 4 ? extra : desc : target;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// src/host/remote.ts
import { Remote, RemoteError, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { createTypertRemoteInfo } from "@deepseek-ai/dsh-typert-protocol/remote-info";
import { z } from "zod";

// src/shared/remote-spec.ts
var PACKAGE = "dsh-layerfs";
var NAMESPACE = "layerfs";
var SERVICE = "layerfsRemote";
var callJson = {
  type: "object",
  properties: { op: { type: "string" }, args: {} },
  required: ["op"]
};
function remoteSpec(z2) {
  const call = () => z2.object({ op: z2.string().min(1), args: z2.unknown().optional() });
  const strictCall = () => z2.object({ op: z2.string().min(1), args: z2.unknown().optional() }).strict();
  const anyValue = () => z2.unknown();
  return {
    package: PACKAGE,
    methods: {
      [`${NAMESPACE}/call`]: {
        service: SERVICE,
        description: "Run one dsh-layerfs operation.",
        invocation: { kind: "direct" },
        parameters: [{
          name: "request",
          description: "The operation name and its JSON arguments.",
          source: "json",
          codec: { mode: "strict", typeSymbol: `${PACKAGE}/shared#LayerfsCall`, create: call, jsonSchema: { ...callJson, additionalProperties: true } },
          strictCodec: { mode: "strict", typeSymbol: `${PACKAGE}/shared#LayerfsCall`, create: strictCall, jsonSchema: { ...callJson, additionalProperties: false } }
        }],
        cancellation: { parameter: "signal" },
        result: { mode: "strict", typeSymbol: `${PACKAGE}/shared#LayerfsResult`, create: anyValue, description: "The operation result.", jsonSchema: {} },
        sourceLocation: { file: "src/host/remote.ts", line: 1, column: 1 }
      },
      [`${NAMESPACE}/events`]: {
        service: SERVICE,
        description: "Observe dsh-layerfs host events until cancellation.",
        mode: "stream",
        invocation: { kind: "direct" },
        parameters: [],
        cancellation: { parameter: "signal" },
        result: { mode: "strict", typeSymbol: `${PACKAGE}/shared#LayerfsEvent`, create: anyValue, description: "One host event.", jsonSchema: {} },
        sourceLocation: { file: "src/host/remote.ts", line: 1, column: 1 }
      }
    }
  };
}

// src/host/remote.ts
var info = createTypertRemoteInfo(remoteSpec(z), z);
var _events_dec, _call_dec, _a, _init;
var LayerfsRemote = class extends (_a = TypertRemoteService, _call_dec = [Remote("call")], _events_dec = [Remote({ name: "events", mode: "stream" })], _a) {
  constructor(ctx) {
    super(ctx, SERVICE, { namespace: NAMESPACE });
    __runInitializers(_init, 5, this);
    __publicField(this, "operations", /* @__PURE__ */ new Map());
    __publicField(this, "listeners", /* @__PURE__ */ new Set());
    ctx.effect(() => ctx.typert.register({
      package: PACKAGE,
      face: "host",
      schemas: [],
      model: { services: [], events: [], objects: [] },
      get invocations() {
        return info.descriptors;
      }
    }), "dsh-layerfs: typert");
  }
  /**
   * Register operations for the caller's lifetime.
   * @param ctx - owning context; its disposal removes the operations.
   * @param table - operation name to handler.
   */
  operate(ctx, table) {
    ctx.effect(() => {
      for (const [name6, fn] of Object.entries(table)) {
        if (this.operations.has(name6)) throw new Error(`dsh-layerfs: duplicate operation ${name6}`);
        this.operations.set(name6, fn);
      }
      return () => {
        for (const name6 of Object.keys(table)) this.operations.delete(name6);
      };
    }, "dsh-layerfs: operations");
  }
  /** Publish one event to every open `events` stream. */
  emit(type, data) {
    for (const listener of this.listeners) listener({ type, data });
  }
  async call(request3, signal) {
    const fn = this.operations.get(request3.op);
    if (!fn) throw new RemoteError("layerfs/unknown-op", `no dsh-layerfs operation "${request3.op}"`, { op: request3.op });
    try {
      const value = await fn(request3.args ?? {}, signal);
      return value === void 0 ? null : value;
    } catch (error2) {
      if (error2?.isDSHRemoteError) throw error2;
      throw new RemoteError("layerfs/failed", String(error2?.message ?? error2), {
        op: request3.op,
        ...typeof error2?.code === "string" ? { code: error2.code } : {},
        ...error2?.detail !== void 0 ? { detail: error2.detail } : {},
        ...typeof error2?.fix === "string" && error2.fix ? { fix: error2.fix } : {}
      }, { cause: error2 });
    }
  }
  async *events(signal) {
    const queue = [];
    let wake;
    const listener = (event) => {
      queue.push(event);
      wake?.();
    };
    const aborted = () => wake?.();
    this.listeners.add(listener);
    signal.addEventListener("abort", aborted, { once: true });
    try {
      yield { type: "ready" };
      while (!signal.aborted) {
        if (!queue.length) await new Promise((resolve11) => {
          wake = resolve11;
        });
        wake = void 0;
        while (queue.length) yield queue.shift();
      }
    } finally {
      this.listeners.delete(listener);
      signal.removeEventListener("abort", aborted);
    }
  }
};
_init = __decoratorStart(_a);
__decorateElement(_init, 1, "call", _call_dec, LayerfsRemote);
__decorateElement(_init, 1, "events", _events_dec, LayerfsRemote);
__decoratorMetadata(_init, LayerfsRemote);
__publicField(LayerfsRemote, "inject", ["typert"]);

// src/host/service.ts
import { Service } from "@deepseek-ai/cordis";
import { existsSync as existsSync7, mkdirSync as mkdirSync5, readdirSync as readdirSync3, readFileSync as readFileSync6, renameSync as renameSync4, statSync as statSync5, watch, writeFileSync as writeFileSync4 } from "node:fs";
import { homedir as homedir2 } from "node:os";
import { dirname as dirname5, isAbsolute as isAbsolute3, join as join6 } from "node:path";

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
var LOGS_EVENT = "logs";
var TAG_PREFIX = "dsh:";
var TAG_MAX = 128;
function sessionTag(sessionId, receiptId) {
  return `${TAG_PREFIX}${sessionId}:${receiptId}`;
}
var HOST_SESSION = "-";
function hostTag(callId) {
  return `${TAG_PREFIX}${HOST_SESSION}:${callId}`;
}
var SIM_TAG_PREFIX = "dsh-sim:";
function simTag(runId, stepKey2) {
  const tag = `${SIM_TAG_PREFIX}${runId}:${stepKey2}`;
  return !!runId && !!stepKey2 && !runId.includes(":") && new TextEncoder().encode(tag).length <= TAG_MAX && !/[\u0000-\u001f\u007f]/.test(tag) ? tag : void 0;
}
function parseSimTag(tag) {
  if (!tag?.startsWith(SIM_TAG_PREFIX)) return void 0;
  const rest = tag.slice(SIM_TAG_PREFIX.length), at = rest.indexOf(":");
  if (at <= 0 || at === rest.length - 1) return void 0;
  return { runId: rest.slice(0, at), stepKey: rest.slice(at + 1) };
}
function isDshTag(tag) {
  return !!tag?.startsWith(TAG_PREFIX) || !!tag?.startsWith(SIM_TAG_PREFIX);
}
function parseTag(tag) {
  if (!tag?.startsWith(TAG_PREFIX)) return void 0;
  const rest = tag.slice(TAG_PREFIX.length), at = rest.lastIndexOf(":");
  if (at <= 0 || at === rest.length - 1) return void 0;
  const sessionId = rest.slice(0, at);
  if (sessionId === HOST_SESSION) return void 0;
  return { sessionId, receiptId: rest.slice(at + 1) };
}
var OUTPUT_MAX = 64 * 1024;
function operationOf(argv) {
  return `${argv[0] ?? ""}.${(argv[1] ?? "").replaceAll("-", "_")}`;
}
var READ_CALLS = /* @__PURE__ */ new Set(["list", "get", "status", "read", "stat", "diff", "commits", "blame", "revision", "images", "search", "glob", "grep", "log", "platforms", "show", "tree", "history", "stats", "info", "check", "capabilities", "files", "space", "doctor", "auths"]);
var READ_FAMILIES = /* @__PURE__ */ new Set(["logs", "doctor", "help"]);
function isWrite(argv) {
  const call = (argv[1] ?? "").replaceAll("-", "_");
  if (argv[0] === "doctor" && call === "fix") return true;
  if (READ_FAMILIES.has(argv[0] ?? "") || argv[0]?.startsWith("-")) return false;
  return !READ_CALLS.has(call) && !call.startsWith("get_") && !call.startsWith("list_");
}

// src/host/layerfs/call-log.ts
import { createHash } from "node:crypto";
import * as fs from "node:fs";
var ROTATE_BYTES = 16 * 1024 * 1024;
function renderCall(argv, inputBytes, bools) {
  const SWITCHES = ["--json", "--progress", "--events", "--text", "-h", "--help"];
  const BOOLS = ["allow-missing", "discard", "force", "include-attribution", "include-encoding", "include-storage", "paths-only", "stream", "quick", "write-test", ...(bools ?? []).map((name6) => name6.replaceAll("_", "-"))];
  const SECRET = ["message", "old", "new", "password", "url", "command", "key"];
  const table = !!bools && bools.length > 0;
  const size = (value) => `<${Buffer.byteLength(value, "utf8")} bytes>`;
  const cut = (value) => {
    const chars = Array.from(value);
    return chars.length > 200 ? `${chars.slice(0, 200).join("")}\u2026` : value;
  };
  const family = String(argv[0] ?? ""), call = String(argv[1] ?? "").replaceAll("_", "-");
  const positionals = [], options = [];
  let rest = false;
  for (let at = 2; at < argv.length; at++) {
    const word2 = String(argv[at]);
    if (rest || word2 === "-" || !word2.startsWith("-")) {
      positionals.push(word2);
      continue;
    }
    if (word2 === "--") {
      rest = true;
      continue;
    }
    if (SWITCHES.includes(word2)) continue;
    let name6, value, explicit = false;
    if (word2 === "-m") name6 = "message";
    else if (word2.startsWith("--")) {
      const equal = word2.indexOf("=");
      name6 = equal < 0 ? word2.slice(2) : word2.slice(2, equal);
      if (equal >= 0) {
        value = word2.slice(equal + 1);
        explicit = true;
      }
    } else {
      options.push(cut(word2));
      continue;
    }
    name6 = name6.replaceAll("_", "-");
    if (value === void 0) {
      if (BOOLS.includes(name6) || at + 1 >= argv.length || String(argv[at + 1]).startsWith("--") && !table && !SECRET.includes(name6)) {
        options.push(`--${name6}`);
        continue;
      }
      value = String(argv[++at]);
    }
    if ((explicit || BOOLS.includes(name6)) && (value === "true" || value === "false")) {
      if (value === "true") options.push(`--${name6}`);
      continue;
    }
    options.push(`--${name6}`, SECRET.includes(name6) ? size(value) : cut(value));
  }
  const secretAt = family === "workspace" && call === "exec" || (family === "store" || family === "backup") && call === "connect" ? 1 : -1;
  const words = positionals.map((word2, index) => index === secretAt ? size(word2) : cut(word2));
  if (typeof inputBytes === "number" && inputBytes >= 0) words.push(`<${inputBytes} bytes>`);
  return [family, call, ...words, ...options];
}
function savedFields(argv, result) {
  const out = {};
  if (!result || typeof result !== "object" || Array.isArray(result)) return out;
  const id = typeof result.commit === "string" && /^[a-f0-9]{66}$/.test(result.commit) ? result.commit : void 0;
  if (!id) return out;
  const operation = `${argv[0] ?? ""}.${String(argv[1] ?? "").replaceAll("-", "_")}`;
  const unchanged = result.unchanged === true;
  const saves = ["file.write", "file.edit", "file.apply", "file.rm", "file.mkdir", "file.mv", "file.cp", "workspace.commit"];
  if (saves.includes(operation)) return { kind: unchanged ? "UpToDate" : "Committed", commit: id };
  if (operation === "branch.fork") return { kind: "Forked", commit: id };
  if (operation === "branch.merge") return { kind: unchanged ? "UpToDate" : "Merged", commit: id };
  if (operation === "branch.publish") return { kind: unchanged ? "UpToDate" : "Added", layer: id };
  return out;
}
function makeReceipt(sessionId, scope, random) {
  const prefix = `dsh:${sessionId}:${scope ? `${scope}.` : ""}`;
  const room = 128 - Buffer.byteLength(prefix, "utf8");
  const id = `${scope ? `${scope}.` : ""}${random.slice(0, Math.max(8, Math.min(random.length, room)))}`;
  const tag = `dsh:${sessionId}:${id}`;
  return Buffer.byteLength(tag, "utf8") <= 128 && !/[\u0000-\u001f\u007f]/.test(tag) ? { id, tag } : { id };
}
function appendCallLine(fsm, path2, line, max = 16 * 1024 * 1024) {
  try {
    const cut = Math.max(path2.lastIndexOf("/"), path2.lastIndexOf("\\"));
    fsm.mkdirSync(path2.slice(0, cut), { recursive: true, mode: 448 });
    let text6 = JSON.stringify(line);
    if (Buffer.byteLength(text6, "utf8") > 4e3 && Array.isArray(line.argv)) {
      text6 = JSON.stringify({ ...line, argv: line.argv.map((word2, index) => index < 2 || word2.length <= 40 ? word2 : `${Array.from(word2).slice(0, 40).join("")}\u2026`) });
    }
    const fd = fsm.openSync(path2, "a", 384);
    let size = 0;
    try {
      fsm.writeSync(fd, `${text6}
`);
      size = fsm.fstatSync(fd).size;
    } finally {
      fsm.closeSync(fd);
    }
    if (size > max) {
      const base = path2.replace(/\.jsonl$/, ""), lock = `${base}.lock`;
      let held;
      try {
        held = fsm.openSync(lock, "wx", 384);
      } catch (error2) {
        if (error2?.code === "EEXIST") {
          try {
            if (Date.now() - fsm.statSync(lock).mtimeMs > 3e4) fsm.unlinkSync(lock);
          } catch {
          }
        }
      }
      if (held !== void 0) {
        try {
          if (fsm.statSync(path2).size > max) fsm.renameSync(path2, `${base}.1.jsonl`);
        } catch {
        } finally {
          fsm.closeSync(held);
          try {
            fsm.unlinkSync(lock);
          } catch {
          }
        }
      }
    }
    return true;
  } catch {
    return false;
  }
}
function callLine(o) {
  const inputBytes = o.input === void 0 || o.input === null ? null : Buffer.byteLength(o.input);
  const argv = renderCall(o.argv, inputBytes, o.bools);
  return {
    v: 1,
    at: o.at,
    ms: Math.max(0, Math.round(o.ms)),
    client: "cli",
    argv,
    outcome: o.outcome,
    ...o.outcome === "ok" ? savedFields(argv, o.result) : {},
    ...o.tag ? { tag: o.tag } : {}
  };
}
function loggable(argv) {
  if (!(argv.length >= 2 && /^[a-z][a-z_]*$/.test(argv[0] ?? "") && /^[a-z][a-z_-]*$/.test(argv[1] ?? ""))) return false;
  if (argv[0] === "help" || argv[0] === "logs") return false;
  if (argv[0] === "home" && ["log", "clear-log", "clear_log"].includes(argv[1] ?? "")) return false;
  if (argv[0] === "machine" && ["stats", "log"].includes(argv[1] ?? "")) return false;
  return !((argv[0] === "sandbox" || argv[0] === "machine") && argv[1] === "files");
}
var listeners = /* @__PURE__ */ new Map();
function onCallLogAppend(path2, fn) {
  let set = listeners.get(path2);
  if (!set) listeners.set(path2, set = /* @__PURE__ */ new Set());
  set.add(fn);
  return () => {
    set.delete(fn);
    if (!set.size) listeners.delete(path2);
  };
}
function notifyCallLog(path2) {
  for (const fn of listeners.get(path2) ?? []) {
    try {
      fn();
    } catch {
    }
  }
}
function appendCall(path2, line, max = ROTATE_BYTES) {
  if (appendCallLine(fs, path2, line, max)) notifyCallLog(path2);
}
var rotatedOf = (path2) => `${path2.replace(/\.jsonl$/, "")}.1.jsonl`;
var lockOf = (path2) => `${path2.replace(/\.jsonl$/, "")}.lock`;
var invalid = (message) => Object.assign(new Error(message), { code: "InvalidInput" });
function identity(path2) {
  try {
    const stat2 = fs.statSync(path2);
    const fd = fs.openSync(path2, "r"), buffer = Buffer.alloc(Math.min(256, stat2.size));
    try {
      fs.readSync(fd, buffer, 0, buffer.length, 0);
    } finally {
      fs.closeSync(fd);
    }
    return { ino: stat2.ino, size: stat2.size, head: createHash("sha1").update(buffer).digest("hex").slice(0, 16) };
  } catch {
    return { ino: 0, size: 0, head: "" };
  }
}
function parseLine(text6) {
  try {
    const line = JSON.parse(text6);
    if (!line || typeof line !== "object" || line.v !== 1 || typeof line.at !== "number" || typeof line.ms !== "number" || typeof line.client !== "string" || !Array.isArray(line.argv) || !line.argv.every((w) => typeof w === "string") || typeof line.outcome !== "string") return void 0;
    return line;
  } catch {
    return void 0;
  }
}
function projectOf(argv) {
  return argv.slice(2).find((word2) => /^[A-Za-z0-9][\w.-]*\/[A-Za-z0-9][\w.-]*$/.test(word2));
}
function matches(line, args) {
  if (args.op) {
    const op = args.op.replaceAll("-", "_");
    if (op.includes(".") ? operationOf(line.argv) !== op : line.argv[0] !== op) return false;
  }
  if (args.project) {
    const project = projectOf(line.argv);
    if (!project || !project.toLowerCase().includes(args.project.toLowerCase())) return false;
  }
  if (args.client && line.client !== args.client) return false;
  if (args.tag && !(args.tag.endsWith(":") ? line.tag?.startsWith(args.tag) : line.tag === args.tag)) return false;
  if (args.outcome && line.outcome !== args.outcome) return false;
  if (typeof args.since === "number" && line.at < args.since) return false;
  if (args.writes && !isWrite(line.argv)) return false;
  return true;
}
var parsedFiles = /* @__PURE__ */ new Map();
function parsedOf(file, id) {
  if (!id.ino) {
    parsedFiles.delete(file);
    return void 0;
  }
  let p = parsedFiles.get(file);
  if (!p || p.ino !== id.ino || p.head !== id.head || id.size < p.parsedTo) p = { ino: id.ino, head: id.head, entries: [], parsedTo: 0 };
  parsedFiles.set(file, p);
  if (id.size <= p.parsedTo) return { entries: p.entries };
  const buffer = Buffer.alloc(id.size - p.parsedTo);
  try {
    const fd = fs.openSync(file, "r");
    try {
      fs.readSync(fd, buffer, 0, buffer.length, p.parsedTo);
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    return { entries: p.entries };
  }
  let at = 0;
  for (let nl = buffer.indexOf(10, at); nl >= 0; nl = buffer.indexOf(10, at)) {
    const text6 = buffer.toString("utf8", at, nl);
    if (text6.trim()) p.entries.push({ start: p.parsedTo + at, line: parseLine(text6) });
    at = nl + 1;
  }
  const base = p.parsedTo;
  p.parsedTo += at;
  const rest = at < buffer.length ? buffer.toString("utf8", at) : "";
  return rest.trim() ? { entries: p.entries, tail: { start: base + at, line: parseLine(rest) } } : { entries: p.entries };
}
function lastBelow(entries2, end) {
  let lo = 0, hi = entries2.length;
  while (lo < hi) {
    const mid = lo + hi >> 1;
    if (entries2[mid].start < end) lo = mid + 1;
    else hi = mid;
  }
  return lo - 1;
}
function listCalls(path2, args = {}) {
  const limit = Math.max(1, Math.min(1e3, Math.floor(Number(args.limit ?? 100)) || 100));
  const files = [path2, rotatedOf(path2)];
  const ids = files.map(identity);
  let from;
  if (args.cursor) {
    try {
      from = JSON.parse(Buffer.from(args.cursor, "base64url").toString("utf8"));
    } catch {
      throw invalid("The log cursor is not valid; list from the start");
    }
    const ok = from && from.v === 1 && (from.f === 0 || from.f === 1) && Number.isInteger(from.o) && from.a === ids[0].ino && from.b === ids[1].ino && from.h === (ids[0].head || ids[1].head) && (from.f !== 0 || from.o <= ids[0].size);
    if (!ok) throw invalid("The log changed since this cursor (rotated or reset); list from the start");
  }
  const lines2 = [];
  let skipped = 0, pending2 = 0, next, more = false;
  scan: for (let f = from?.f ?? 0; f < 2; f++) {
    const parsed = parsedOf(files[f], ids[f]);
    if (!parsed) continue;
    const end = f === from?.f ? from.o : Infinity;
    const { entries: entries2, tail } = parsed;
    for (let i = lastBelow(entries2, end) + (tail && tail.start < end ? 1 : 0); i >= 0; i--) {
      const { start, line } = i === entries2.length ? tail : entries2[i];
      if (!line) {
        pending2++;
        continue;
      }
      if (!matches(line, args)) continue;
      if (lines2.length === limit) {
        more = true;
        break scan;
      }
      lines2.push(line);
      skipped += pending2;
      pending2 = 0;
      next = { v: 1, f, o: start, a: ids[0].ino, b: ids[1].ino, h: ids[0].head || ids[1].head };
    }
  }
  if (!more) skipped += pending2;
  return { lines: lines2, ...more && next ? { next: Buffer.from(JSON.stringify(next)).toString("base64url") } : {}, has_more: more, skipped };
}
function resetCalls(path2) {
  const lock = lockOf(path2);
  fs.mkdirSync(path2.slice(0, Math.max(path2.lastIndexOf("/"), path2.lastIndexOf("\\"))), { recursive: true, mode: 448 });
  const deadline = Date.now() + 1e4, pause2 = new Int32Array(new SharedArrayBuffer(4));
  let held;
  while (held === void 0) {
    try {
      held = fs.openSync(lock, "wx", 384);
    } catch (error2) {
      if (error2?.code !== "EEXIST") throw error2;
      try {
        if (Date.now() - fs.statSync(lock).mtimeMs > 3e4) {
          fs.unlinkSync(lock);
          continue;
        }
      } catch {
        continue;
      }
      if (Date.now() > deadline) throw Object.assign(new Error("The call log is busy; try again"), { code: "Busy" });
      Atomics.wait(pause2, 0, 0, 10);
    }
  }
  try {
    let removed = 0;
    for (const file of [path2, rotatedOf(path2)]) {
      try {
        removed += fs.readFileSync(file, "utf8").split("\n").filter((line) => line.trim()).length;
      } catch {
      }
    }
    if (fs.existsSync(path2)) fs.truncateSync(path2, 0);
    fs.rmSync(rotatedOf(path2), { force: true });
    notifyCallLog(path2);
    return { removed };
  } finally {
    fs.closeSync(held);
    try {
      fs.unlinkSync(lock);
    } catch {
    }
  }
}

// src/host/layerfs/call-output.ts
import { createHash as createHash2 } from "node:crypto";
import * as fs2 from "node:fs";
import { dirname, join } from "node:path";
var OUTPUT_FILES = 2e3;
var OUTPUT_BYTES = 64 * 1024 * 1024;
var PRUNE_EVERY = 50;
function outputSink(max, keep2) {
  const chunks = [];
  let held = 0, total = 0;
  return {
    push(chunk) {
      const data = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
      total += data.length;
      if (keep2 === "head") {
        if (held >= max) return;
        const part = Buffer.from(data.subarray(0, max - held));
        chunks.push(part);
        held += part.length;
        return;
      }
      chunks.push(Buffer.from(data));
      held += data.length;
      while (chunks.length > 1 && held - chunks[0].length >= max) held -= chunks.shift().length;
    },
    total: () => total,
    bytes() {
      const all = Buffer.concat(chunks);
      return keep2 === "head" ? all.subarray(0, max) : all.subarray(Math.max(0, all.length - max));
    }
  };
}
function outputRecord(o) {
  const head = (buffer) => {
    let at = buffer.length - 1, back = 0;
    while (at >= 0 && back < 3 && (buffer[at] & 192) === 128) {
      at--;
      back++;
    }
    if (at < 0) return buffer;
    const lead = buffer[at], need2 = lead >= 240 ? 4 : lead >= 224 ? 3 : lead >= 192 ? 2 : 1;
    return buffer.length - at < need2 ? buffer.subarray(0, at) : buffer;
  };
  const tail = (buffer) => {
    let at = 0;
    while (at < 3 && at < buffer.length && (buffer[at] & 192) === 128) at++;
    return buffer.subarray(at);
  };
  const out = head(o.stdout.bytes()), outTotal = o.stdout.total();
  const err = tail(o.stderr.bytes()), errTotal = o.stderr.total();
  const truncated = { ...out.length < outTotal ? { stdout: true } : {}, ...err.length < errTotal ? { stderr: true } : {} };
  const code2 = o.refusal && typeof o.refusal.error === "string" ? o.refusal.error : null;
  const refusal2 = o.exit === 125 && code2 !== null ? {
    code: code2.slice(0, 64),
    ...typeof o.refusal.message === "string" ? { message: o.refusal.message } : {},
    ...typeof o.refusal.fix === "string" && o.refusal.fix ? { fix: o.refusal.fix } : {},
    ...o.refusal.detail !== void 0 && o.refusal.detail !== null ? { detail: o.refusal.detail } : {}
  } : void 0;
  return {
    tag: o.tag,
    ...o.exit !== void 0 ? { exit: o.exit } : {},
    ...out.length ? { stdout: out.toString("utf8") } : {},
    ...err.length ? { stderr: err.toString("utf8") } : {},
    bytes: { stdout: outTotal, stderr: errTotal },
    ...Object.keys(truncated).length ? { truncated } : {},
    ...refusal2 ? { refusal: refusal2 } : {}
  };
}
function outputName(hash2, tag) {
  return `${hash2("sha256").update(tag, "utf8").digest("hex").slice(0, 40)}.json`;
}
function writeOutput(fsm, dir, name6, record, bounds) {
  try {
    fsm.mkdirSync(dir, { recursive: true, mode: 448 });
    const path2 = `${dir}/${name6}`, tmp = `${path2}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
    fsm.writeFileSync(tmp, JSON.stringify(record), { mode: 384 });
    try {
      fsm.renameSync(tmp, path2);
    } catch (error2) {
      try {
        fsm.unlinkSync(tmp);
      } catch {
      }
      throw error2;
    }
    if (Math.random() * Math.max(1, bounds.every) < 1) {
      const files = [];
      for (const entry of fsm.readdirSync(dir)) {
        const file = `${dir}/${entry}`;
        try {
          const stat2 = fsm.statSync(file);
          if (entry.endsWith(".tmp")) {
            if (Date.now() - stat2.mtimeMs > 6e4) fsm.unlinkSync(file);
            continue;
          }
          if (entry.endsWith(".json")) files.push({ path: file, size: stat2.size, at: stat2.mtimeMs });
        } catch {
        }
      }
      files.sort((a, b) => a.at - b.at);
      let count4 = files.length, bytes = files.reduce((sum, file) => sum + file.size, 0);
      for (const file of files) {
        if (count4 <= bounds.files && bytes <= bounds.bytes) break;
        try {
          fsm.unlinkSync(file.path);
        } catch {
        }
        count4--;
        bytes -= file.size;
      }
    }
    return true;
  } catch {
    return false;
  }
}
var DEFAULT_BOUNDS = { files: OUTPUT_FILES, bytes: OUTPUT_BYTES, every: PRUNE_EVERY };
var outputsDir = (callLog) => join(dirname(callLog), "outputs");
function validOutputTag(tag) {
  return typeof tag === "string" && isDshTag(tag) && Buffer.byteLength(tag, "utf8") <= TAG_MAX && !/[\u0000-\u001f\u007f]/.test(tag);
}
function saveOutput(dir, record, bounds = DEFAULT_BOUNDS) {
  return validOutputTag(record.tag) && writeOutput(fs2, dir, outputName(createHash2, record.tag), record, bounds);
}
function hasOutput(dir, tag) {
  return validOutputTag(tag) && (fs2.existsSync(join(dir, outputName(createHash2, tag))) || fs2.existsSync(`${rawBase(dir, tag)}.out`));
}
function readOutput(dir, tag) {
  try {
    const record = JSON.parse(fs2.readFileSync(join(dir, outputName(createHash2, tag)), "utf8"));
    if (record && typeof record === "object" && record.tag === tag && record.bytes && typeof record.bytes === "object") return record;
  } catch {
  }
  return readRaw(dir, tag) ?? { missing: true };
}
var RAW_DIR = "raw";
var RAW_SETTLE_MS = 5e3;
var RAW_BYTES = 256 * 1024 * 1024;
var rawBase = (dir, tag) => join(dir, RAW_DIR, tag.replace(/[^A-Za-z0-9._-]/g, "_"));
function readPart(path2, max, keep2) {
  let fd;
  try {
    fd = fs2.openSync(path2, "r");
    const total = fs2.fstatSync(fd).size, length = Math.min(total, max), buffer = Buffer.alloc(length);
    fs2.readSync(fd, buffer, 0, length, keep2 === "head" ? 0 : total - length);
    return { bytes: buffer, total };
  } catch {
    return void 0;
  } finally {
    if (fd !== void 0) try {
      fs2.closeSync(fd);
    } catch {
    }
  }
}
function readRaw(dir, tag, max = OUTPUT_MAX) {
  if (!validOutputTag(tag)) return void 0;
  const base = rawBase(dir, tag);
  const out = readPart(`${base}.out`, max, "head"), err = readPart(`${base}.err`, max, "tail");
  if (!out && !err) return void 0;
  let exit;
  try {
    const text6 = fs2.readFileSync(`${base}.exit`, "utf8").trim();
    if (/^\d{1,3}$/.test(text6)) exit = Number(text6);
  } catch {
  }
  const sink = (part) => ({ push() {
  }, total: () => part?.total ?? 0, bytes: () => part?.bytes ?? Buffer.alloc(0) });
  let refusal2;
  if (exit === 125 && err) for (const line of err.bytes.toString("utf8").trim().split("\n").reverse()) {
    try {
      const frame = JSON.parse(line);
      if (frame && typeof frame.error === "string") {
        refusal2 = frame;
        break;
      }
    } catch {
    }
  }
  return outputRecord({ tag, exit, stdout: sink(out), stderr: sink(err), refusal: refusal2, max });
}
function compactRaw(dir, bounds = DEFAULT_BOUNDS, now = Date.now()) {
  const folder = join(dir, RAW_DIR);
  let entries2;
  try {
    entries2 = fs2.readdirSync(folder);
  } catch {
    return 0;
  }
  const calls = /* @__PURE__ */ new Map();
  for (const entry of entries2) {
    if (/\.(po|pe)$/.test(entry)) {
      try {
        const path2 = join(folder, entry);
        if (now - fs2.statSync(path2).mtimeMs > 36e5) fs2.unlinkSync(path2);
      } catch {
      }
      continue;
    }
    const match = /^(.+)\.(out|err|exit)$/.exec(entry);
    if (!match) continue;
    try {
      const path2 = join(folder, entry), stat2 = fs2.statSync(path2);
      const call = calls.get(match[1]) ?? { files: [] };
      call.files.push({ path: path2, size: stat2.size, at: stat2.mtimeMs });
      if (match[2] === "exit") call.exitAt = stat2.mtimeMs;
      calls.set(match[1], call);
    } catch {
    }
  }
  let compacted = 0;
  const remove = (call) => {
    for (const file of call.files) try {
      fs2.unlinkSync(file.path);
    } catch {
    }
  };
  for (const [safe, call] of [...calls]) {
    if (call.exitAt === void 0 || now - call.exitAt < RAW_SETTLE_MS) continue;
    const tag = rawTag(safe);
    const record = tag ? readRaw(dir, tag) : void 0;
    if (record && tag) {
      if (saveOutput(dir, record, bounds)) compacted++;
    }
    remove(call);
    calls.delete(safe);
  }
  const live = [...calls.values()].map((call) => ({ call, at: Math.min(...call.files.map((f) => f.at)), size: call.files.reduce((s, f) => s + f.size, 0) })).sort((a, b) => a.at - b.at);
  let bytes = live.reduce((s, c) => s + c.size, 0);
  for (const entry of live) {
    if (bytes <= RAW_BYTES) break;
    remove(entry.call);
    bytes -= entry.size;
  }
  return compacted;
}
function rawTag(safe) {
  const match = /^dsh_([A-Za-z0-9.-]+)_([A-Za-z0-9.-]+)$/.exec(safe);
  if (!match) return void 0;
  const tag = `dsh:${match[1]}:${match[2]}`;
  return validOutputTag(tag) ? tag : void 0;
}
function clearOutputs(dir) {
  let removed = 0;
  let entries2;
  try {
    entries2 = fs2.readdirSync(dir);
  } catch {
    return 0;
  }
  for (const entry of entries2) {
    try {
      fs2.rmSync(join(dir, entry), { force: true, recursive: true });
      if (entry.endsWith(".json")) removed++;
    } catch {
    }
  }
  return removed;
}

// src/host/layerfs/tracing.ts
var context = new AsyncLocalStorage();
var withTraceContext = (value, run2) => context.run(value, run2);
var withoutTraceContext = (run2) => context.exit(run2);
var CHECKPOINT_OPERATIONS = ["file.write", "file.edit", "file.apply", "file.rm", "file.mkdir", "file.mv", "file.cp", "workspace.commit", "branch.fork", "branch.merge", "branch.publish"];
function toolScope(sessionId, callId) {
  return createHash3("sha256").update(`${sessionId}\0${callId}`).digest("hex").slice(0, 8);
}
function savedVersions(operation, result) {
  const allowed = CHECKPOINT_OPERATIONS;
  if (!allowed.includes(operation) || !result || typeof result !== "object") return [];
  const id = result.commit;
  if (typeof id !== "string" || !/^[a-f0-9]{66}$/.test(id)) return [];
  const unchanged = result.unchanged === true;
  if (operation === "branch.publish") return [{ kind: "Layer", id, effect: unchanged ? "unchanged" : "created" }];
  if (operation === "branch.fork") return [{ kind: "Commit", id, effect: "referenced" }];
  if (operation === "branch.merge") return [{ kind: "Commit", id, effect: unchanged || result.fast_forward === true ? "referenced" : "created" }];
  return [{ kind: "Commit", id, effect: unchanged ? "unchanged" : "created" }];
}
function lineVersions(line, fastForward) {
  const allowed = CHECKPOINT_OPERATIONS;
  if (!allowed.includes(operationOf(line.argv))) return [];
  const effects = { Committed: "created", Added: "created", UpToDate: "unchanged", NoChanges: "unchanged", Forked: "referenced", Merged: fastForward === false ? "created" : "referenced" };
  const effect = line.kind ? effects[line.kind] : void 0;
  const hex = (value) => typeof value === "string" && /^[a-f0-9]{66}$/.test(value);
  if (!effect) return [];
  if (hex(line.commit)) return [{ kind: "Commit", id: line.commit, effect }];
  if (hex(line.layer)) return [{ kind: "Layer", id: line.layer, effect }];
  return [];
}
var portable = (identity2, id, project) => ({
  id,
  origin: identity2.origin === "tool" ? "tool" : "host",
  sessionId: identity2.sessionId,
  project,
  ...Number.isInteger(identity2.turn) ? { turn: identity2.turn } : {},
  ...typeof identity2.toolCallId === "string" ? { toolCallId: identity2.toolCallId } : {},
  ...typeof identity2.step?.runId === "string" && typeof identity2.step?.stepKey === "string" ? { step: { runId: identity2.step.runId, stepKey: identity2.step.stepKey } } : {}
});
var RECEIPT_ARGV_WORDS = 32;
var RECEIPT_ARGV_BYTES = 1024;
var LOCAL_OPTIONS = ["from", "source", "dir", "path", "file", "out", "output", "cwd", "root"];
var LOCAL_PATH = "<local path>";
var localRoots;
function isLocalPath(word2) {
  if (word2.startsWith("~/") || word2.startsWith("file://")) return true;
  if (!word2.startsWith("/")) return false;
  localRoots ??= [...new Set([homedir(), tmpdir(), (() => {
    try {
      return realpathSync(tmpdir());
    } catch {
      return tmpdir();
    }
  })(), "/private/", "/tmp/", "/var/folders/", "/Users/", "/home/", "/Volumes/", "/root/"].filter((root) => root && root !== "/").map((root) => root.endsWith("/") ? root : `${root}/`))];
  return localRoots.some((root) => word2.startsWith(root) || `${word2}/` === root);
}
function portableArgv(words) {
  const kept2 = words.slice(0, RECEIPT_ARGV_WORDS).map((raw, index, all) => {
    const word2 = String(raw);
    if (index < 2 || /^<\d+ bytes>$/.test(word2)) return word2;
    const option = index > 2 && all[index - 1].startsWith("--") && !word2.startsWith("--") ? all[index - 1].slice(2) : void 0;
    const source = all[0] === "project" && (all[1] === "init" || all[1] === "import") && index === 3 && !word2.startsWith("--");
    return option && LOCAL_OPTIONS.includes(option) || source || isLocalPath(word2) ? LOCAL_PATH : word2;
  });
  if (words.length > RECEIPT_ARGV_WORDS) kept2.push(`<${words.length - RECEIPT_ARGV_WORDS} more>`);
  return Buffer.byteLength(JSON.stringify(kept2), "utf8") <= RECEIPT_ARGV_BYTES ? kept2 : kept2.map((word2, index) => index < 2 || Array.from(word2).length <= 40 ? word2 : `${Array.from(word2).slice(0, 40).join("")}\u2026`);
}
var shortText = (value) => typeof value === "string" && value && value.length <= 64 ? value : void 0;
function execFacts(operation, exit, execId) {
  if (operation !== "workspace.exec") return {};
  return {
    ...exit === null || typeof exit === "number" && Number.isInteger(exit) ? { exit } : {},
    ...shortText(execId) ? { execId } : {}
  };
}
function exitOfOutput(output2, streamed = false) {
  if (!output2 || "missing" in output2) return void 0;
  if (!streamed && typeof output2.stdout === "string") {
    const last = output2.stdout.trimEnd().split("\n").at(-1);
    try {
      const code2 = JSON.parse(last ?? "")?.exit_code;
      if (Number.isInteger(code2)) return code2;
    } catch {
    }
  }
  return streamed && Number.isInteger(output2.exit) && (output2.exit !== 125 || !output2.refusal) ? output2.exit : void 0;
}
function fastForwardOfOutput(output2) {
  if (!output2 || "missing" in output2 || typeof output2.stdout !== "string") return void 0;
  if (!output2.truncated?.stdout) {
    try {
      const value = JSON.parse(output2.stdout)?.fast_forward;
      return typeof value === "boolean" ? value : void 0;
    } catch {
      return void 0;
    }
  }
  const match = /^\s*\{[^{}]*?"fast_forward"\s*:\s*(true|false)/.exec(output2.stdout.slice(0, 4096));
  return match ? match[1] === "true" : void 0;
}
function receiptFromLine(line, identity2, id, exit, fastForward) {
  const operation = operationOf(line.argv);
  const targetKnown = operation !== "workspace.commit" || !!identity2.workspace && line.argv[2] === identity2.workspace;
  const project = !targetKnown ? "" : ["file", "branch"].includes(line.argv[0]) && line.argv[2] ? line.argv[2] : identity2.project;
  const outcome2 = line.outcome === "ok" ? "success" : line.outcome === "Unknown" ? "unknown" : "refusal";
  const allowed = CHECKPOINT_OPERATIONS;
  const captureGap = !targetKnown ? "target-workspace-unconfirmed" : outcome2 === "success" && allowed.includes(operation) && !line.kind ? "structured-result-unavailable" : void 0;
  const code2 = line.outcome === "ok" ? void 0 : shortText(line.outcome), kind = shortText(line.kind);
  return {
    ...portable(identity2, id, project),
    operation,
    outcome: outcome2,
    versions: outcome2 === "success" && targetKnown && !identity2.internal ? lineVersions(line, fastForward) : [],
    ...captureGap ? { captureGap } : {},
    at: line.at,
    ms: line.ms,
    argv: portableArgv(line.argv),
    ...line.tag ? { tag: line.tag } : {},
    ...code2 ? { code: code2 } : {},
    ...kind ? { kind } : {},
    ...execFacts(operation, exit)
  };
}
async function traceInvocation(operation, run2, targetProject, targetWorkspace, describe) {
  const trace = context.getStore();
  if (!trace) return run2(void 0);
  const { id, tag } = makeReceipt(trace.sessionId, trace.scope, randomUUID().replaceAll("-", ""));
  const at = Date.now(), started = performance.now();
  let result, error2;
  try {
    result = await run2(tag);
    return result;
  } catch (e) {
    error2 = e;
    throw e;
  } finally {
    const targetKnown = operation !== "workspace.commit" || !!trace.workspace && targetWorkspace === trace.workspace;
    let words, call;
    try {
      call = describe?.();
      if (call) words = renderCall(call.argv, call.input === void 0 || call.input === null ? null : Buffer.byteLength(call.input), call.bools);
    } catch {
    }
    const code2 = error2 ? shortText(error2.code) ?? "Failed" : void 0;
    const kind = error2 ? void 0 : savedFields(words ?? operation.split("."), result).kind ?? shortText(result?.kind);
    const receipt = {
      ...portable(trace, id, !targetKnown ? "" : targetProject ?? trace.project),
      operation,
      outcome: error2 ? error2.transport === "refusal" ? "refusal" : "unknown" : "success",
      versions: error2 || trace.internal || !targetKnown ? [] : savedVersions(operation, result),
      ...!targetKnown ? { captureGap: "target-workspace-unconfirmed" } : {},
      at: Number.isFinite(call?.at) ? call.at : at,
      ms: Number.isFinite(call?.ms) ? call.ms : Math.max(0, Math.round(performance.now() - started)),
      ...words ? { argv: portableArgv(words) } : {},
      ...tag ? { tag } : {},
      ...code2 ? { code: code2 } : {},
      ...kind ? { kind } : {},
      ...execFacts(operation, error2 ? void 0 : result?.exit_code, error2 ? void 0 : result?.exec)
    };
    try {
      await trace.record(receipt);
    } catch (recordError) {
      trace.onError?.(recordError);
    }
  }
}
function mergeInvocations(local, incoming) {
  const out = Array.isArray(local) ? local.filter((row) => row && typeof row === "object") : [];
  const index = /* @__PURE__ */ new Map();
  out.forEach((row, at) => {
    if (typeof row.id === "string") index.set(row.id, at);
  });
  for (const row of Array.isArray(incoming) ? incoming : []) {
    if (!row || typeof row !== "object" || typeof row.id !== "string") continue;
    const at = index.get(row.id);
    if (at === void 0) {
      index.set(row.id, out.length);
      out.push({ ...row, imported: true });
    } else out[at] = { ...out[at], ...row };
  }
  return out;
}
function traceEnvironment(identity2) {
  return JSON.stringify(identity2);
}
var CONTENT_CALLS = ["file.write", "file.apply", "project.storage_report", "store.storage_report"];
function managedCli(options) {
  const file = join2(options.root, "agent-bin", "layerfs");
  const implementation = `${file}.mjs`;
  const pinned = canonicalPath(options.cli);
  for (const output2 of [file, implementation]) {
    const samePath = canonicalPath(output2) === pinned;
    const sameInode = existsSync3(options.cli) && existsSync3(output2) && (() => {
      const source = statSync3(options.cli), destination = statSync3(output2);
      return source.dev === destination.dev && source.ino === destination.ino;
    })();
    if (samePath || sameInode) throw new Error("Managed CLI self-reference: select the installed LayerFS binary instead of the managed CLI entry point");
  }
  const standIn = !!options.callLog && !options.native;
  const outputs = options.callLog ? outputsDir(options.callLog) : null;
  mkdirSync2(join2(options.root, "agent-bin"), { recursive: true });
  if (options.callLog) mkdirSync2(dirname2(options.callLog), { recursive: true, mode: 448 });
  if (options.native) {
    writeIfChanged(file, nativeWrapper({ cli: options.cli, home: options.home, bundle: options.bundle ?? null, cacheHome: options.cacheHome ?? null, raw: outputs ? join2(outputs, RAW_DIR) : null }));
    chmodSync(file, 448);
    return file;
  }
  const config = {
    cli: options.cli,
    home: options.home,
    bundle: options.bundle ?? null,
    cacheHome: options.cacheHome ?? null,
    callLog: standIn ? options.callLog : null,
    bools: options.bools ?? [],
    content: options.content ?? CONTENT_CALLS,
    rotate: options.rotateBytes ?? ROTATE_BYTES,
    outputs,
    max: OUTPUT_MAX,
    bounds: options.outputBounds ?? DEFAULT_BOUNDS
  };
  const prelude = [
    `#!${process.execPath}`,
    `import {spawn} from 'node:child_process';`,
    `import * as fs from 'node:fs';`,
    `import {randomUUID,createHash} from 'node:crypto';`,
    `const makeReceipt = ${makeReceipt.toString()};`,
    `const config=${JSON.stringify(config)};`,
    `let identity; try { identity=JSON.parse(process.env.DSH_LAYERFS_TRACE_CONTEXT || 'null') } catch {}`,
    `const argv=process.argv.slice(2);`,
    `const receipt=identity&&typeof identity.sessionId==='string'&&identity.sessionId?makeReceipt(identity.sessionId,typeof identity.scope==='string'&&/^[a-f0-9]{1,16}$/.test(identity.scope)?identity.scope:undefined,randomUUID().replaceAll('-','')):undefined;`,
    `const env={...process.env,LAYERFS_HOME:config.home,...(config.bundle?{LAYERFS_BUNDLE:config.bundle}:{}),...(config.cacheHome?{XDG_CACHE_HOME:config.cacheHome}:{})};`,
    `delete env.LAYERFS_LOGS_TAG; if(receipt&&receipt.tag)env.LAYERFS_LOGS_TAG=receipt.tag;`,
    `const finish=(code,signal)=>{if(signal){process.removeAllListeners(signal);process.kill(process.pid,signal)}else process.exitCode=code??1};`,
    `const logged=argv.length>=2&&/^[a-z][a-z_]*$/.test(argv[0])&&/^[a-z][a-z_-]*$/.test(argv[1])&&argv[0]!=='help'&&argv[0]!=='logs';`,
    `const capture=!!(config.outputs&&logged&&receipt&&receipt.tag);`
  ];
  const passthrough = [
    `const child=spawn(config.cli,argv,{stdio:'inherit',env});`,
    `for(const signal of ['SIGINT','SIGTERM','SIGHUP'])process.on(signal,()=>child.kill(signal));`,
    `child.on('error',()=>{process.stderr.write('The LayerFS CLI could not be started\\n');process.exitCode=127});`,
    `child.on('close',finish);`
  ];
  const piping = [
    `const renderCall = ${renderCall.toString()};`,
    `const savedFields = ${savedFields.toString()};`,
    `const appendCallLine = ${appendCallLine.toString()};`,
    `const outputSink = ${outputSink.toString()};`,
    `const outputRecord = ${outputRecord.toString()};`,
    `const outputName = ${outputName.toString()};`,
    `const writeOutput = ${writeOutput.toString()};`,
    `const operation=(argv[0]??'')+'.'+(argv[1]??'').replaceAll('-','_');`,
    // 2.0 `workspace exec` exits with the command's own code (125 with a refusal JSON on
    // stderr means LayerFS refused; 125 with a result and no refusal is the command's own):
    // a non-zero exit is the command's result, not an
    // unknown outcome; the line keeps it as `kind: "exit:<code>"` (FIX-LOG F13). With `--stream`
    // stdout is the command's own output, not the result JSON.
    `const execCall=operation==='workspace.exec',streamedExec=execCall&&argv.includes('--stream');`,
    `const piped=logged&&config.content.includes(operation)&&!argv.some(word=>word==='--from'||word.startsWith('--from='));`,
    `const at=Date.now(),started=performance.now();`,
    `let stdout='',stderr='',overflow=false,spawnError=false,inputBytes=0;`,
    `const sinks=capture?{stdout:outputSink(config.max,'head'),stderr:outputSink(config.max,'tail')}:undefined;`,
    `const child=spawn(config.cli,argv,{stdio:[piped?'pipe':'inherit','pipe','pipe'],env});`,
    `if(piped){child.stdin.on('error',()=>{});process.stdin.on('data',chunk=>{inputBytes+=chunk.length;if(!child.stdin.write(chunk))process.stdin.pause()});child.stdin.on('drain',()=>process.stdin.resume());process.stdin.on('end',()=>child.stdin.end());process.stdin.on('error',()=>child.stdin.end())}`,
    `child.stdout.on('data',chunk=>{if(!process.stdout.write(chunk))child.stdout.pause();if(sinks)sinks.stdout.push(chunk);if(!config.callLog)return;if(stdout.length+chunk.length<4194304)stdout+=chunk.toString();else overflow=true});`,
    `process.stdout.on('drain',()=>child.stdout.resume());`,
    `child.stderr.on('data',chunk=>{if(!process.stderr.write(chunk))child.stderr.pause();if(sinks)sinks.stderr.push(chunk);if(stderr.length<65536)stderr+=chunk.toString()});`,
    `process.stderr.on('drain',()=>child.stderr.resume());`,
    `for(const signal of ['SIGINT','SIGTERM','SIGHUP'])process.on(signal,()=>child.kill(signal));`,
    `child.on('error',()=>{spawnError=true;process.stderr.write('The LayerFS CLI could not be started\\n');process.exitCode=127});`,
    `child.on('close',(code,signal)=>{`,
    ` if(piped)process.stdin.destroy();`,
    ` if(spawnError){process.exitCode=127;return}`,
    ` if(logged&&(code!==2||execCall)&&(capture||config.callLog)){`,
    `  let result,valid=false,refusal;`,
    `  if(config.callLog&&!overflow&&!streamedExec)try{const frames=stdout.trim().split('\\n').filter(Boolean).map(line=>JSON.parse(line));`,
    `   if(frames.length===1){result=frames[0];valid=true}`,
    `  }catch{}`,
    `  if(!refusal)for(const line of stderr.trim().split('\\n').reverse()){try{const frame=JSON.parse(line);if(frame&&typeof frame.error==='string'){refusal=frame;break}}catch{}}`,
    // The output first, so a page reloading on the new line already sees it.
    `  if(capture)writeOutput(fs,config.outputs,outputName(createHash,receipt.tag),outputRecord({tag:receipt.tag,exit:signal?null:code,stdout:sinks.stdout,stderr:sinks.stderr,refusal,max:config.max}),config.bounds);`,
    `  if(config.callLog){`,
    `   const own125=execCall&&code===125&&!refusal&&(streamedExec||(valid&&result&&result.exit_code===125));`,
    `   const outcome=signal?'Unknown':code===125&&!own125?((c=>typeof c==='string'&&c.length<=64?c:'Failed')(refusal&&(typeof refusal.error==='string'?refusal.error:refusal.code))):code===0||execCall?'ok':'Unknown';`,
    `   const words=renderCall(argv,piped?inputBytes:null,config.bools);`,
    `   appendCallLine(fs,config.callLog,{v:1,at,ms:Math.max(0,Math.round(performance.now()-started)),client:'cli',argv:words,outcome,...(outcome==='ok'&&execCall?{kind:'exit:'+code}:outcome==='ok'&&valid?savedFields(words,result):{}),...(receipt&&receipt.tag?{tag:receipt.tag}:{})},config.rotate);`,
    `  }`,
    ` }`,
    ` finish(code,signal);`,
    `});`
  ];
  const body = [...prelude, `if(config.callLog||capture){`, ...piping, `}else{`, ...passthrough, `}`, ""].join("\n");
  const script = `#!/bin/sh
exec ${shellQuote(process.execPath)} ${shellQuote(implementation)} "$@"
`;
  writeIfChanged(implementation, body);
  writeIfChanged(file, script);
  chmodSync(file, 448);
  return file;
}
function writeIfChanged(path2, text6) {
  if (existsSync3(path2) && readFileSync3(path2, "utf8") === text6) return;
  const tmp = `${path2}.${process.pid}.tmp`;
  writeFileSync(tmp, text6, { mode: 448 });
  renameSync(tmp, path2);
}
function nativeWrapper(o) {
  return [
    "#!/bin/bash",
    "# dsh-layerfs managed LayerFS CLI (native call log). Generated; do not edit.",
    "umask 077",
    `export LAYERFS_HOME=${shellQuote(o.home)}`,
    ...o.bundle ? [`export LAYERFS_BUNDLE=${shellQuote(o.bundle)}`] : [],
    ...o.cacheHome ? [`export XDG_CACHE_HOME=${shellQuote(o.cacheHome)}`] : [],
    "unset LAYERFS_LOGS_TAG",
    `cli=${shellQuote(o.cli)}`,
    `raw=${shellQuote(o.raw ?? "")}`,
    "ctx=${DSH_LAYERFS_TRACE_CONTEXT-}",
    `case "\${1-}" in ''|-*|help|logs) exec "$cli" "$@" ;; esac`,
    `case "\${2-}" in ''|-*) exec "$cli" "$@" ;; esac`,
    '[[ $1 =~ ^[a-z][a-z_]*$ && $2 =~ ^[a-z][a-z_-]*$ ]] || exec "$cli" "$@"',
    '[[ $ctx =~ \\"sessionId\\":\\"([A-Za-z0-9.-]{1,100})\\" ]] || exec "$cli" "$@"',
    'tag="dsh:${BASH_REMATCH[1]}:"',
    '[[ $ctx =~ \\"scope\\":\\"([a-f0-9]{1,16})\\" ]] && tag="$tag${BASH_REMATCH[1]}."',
    "id=$(LC_ALL=C od -An -N16 -tx1 /dev/urandom 2>/dev/null); id=${id//[^0-9a-f]/}",
    'room=$((128 - ${#tag})); [ "$room" -gt 32 ] && room=32',
    '[ "$room" -ge 8 ] && [ ${#id} -ge 8 ] || exec "$cli" "$@"',
    'export LAYERFS_LOGS_TAG="$tag${id:0:$room}"',
    '[ -n "$raw" ] || exec "$cli" "$@"',
    '[ -d "$raw" ] || mkdir -p "$raw" 2>/dev/null || exec "$cli" "$@"',
    'out="$raw/${LAYERFS_LOGS_TAG//[^A-Za-z0-9._-]/_}"',
    // Named pipes, not `>(…)`: DSH's command sandbox denies /dev/fd. The CLI runs in the
    // background with stdin given explicitly (an async command's stdin is /dev/null
    // otherwise), so signals can be forwarded to it.
    'mkfifo "$out.po" "$out.pe" 2>/dev/null || exec "$cli" "$@"',
    'tee "$out.out" < "$out.po" &',
    'tee "$out.err" < "$out.pe" >&2 &',
    '"$cli" "$@" <&0 > "$out.po" 2> "$out.pe" &',
    "pid=$!",
    'for s in INT TERM HUP; do trap "kill -$s $pid 2>/dev/null" $s; done',
    'while :; do wait "$pid"; code=$?; kill -0 "$pid" 2>/dev/null || break; done',
    "wait",
    'rm -f "$out.po" "$out.pe"',
    `printf '%s\\n' "$code" > "$out.exit" 2>/dev/null`,
    'if [ "$code" -gt 128 ] && [ "$code" -lt 160 ]; then trap - INT TERM HUP; kill -$((code - 128)) $$; fi',
    'exit "$code"',
    ""
  ].join("\n");
}
function canonicalPath(value, depth = 0) {
  if (depth > 40) throw new Error("The managed CLI path contains a symlink cycle");
  const path2 = resolve(value);
  try {
    return realpathSync(path2);
  } catch (error2) {
    if (error2?.code !== "ENOENT") throw error2;
    try {
      if (lstatSync(path2).isSymbolicLink()) return canonicalPath(resolve(dirname2(path2), readlinkSync(path2)), depth + 1);
    } catch (linkError) {
      if (linkError?.code !== "ENOENT") throw linkError;
    }
    const parent = dirname2(path2);
    return parent === path2 ? path2 : join2(canonicalPath(parent, depth + 1), basename(path2));
  }
}
function shellQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`;
}

// src/host/layerfs/cli.ts
var CliError = class extends Error {
  code;
  detail;
  transport;
  fix;
  constructor(code2, message, detail = null, transport = "refusal", fix = null) {
    super(message);
    this.name = "LayerFSError";
    this.code = code2;
    this.detail = detail;
    this.transport = transport;
    this.fix = fix;
  }
};
function refusalOf(frame) {
  const r = frame;
  if (!r || typeof r !== "object" || typeof r.error !== "string" || typeof r.message !== "string") return null;
  const { error: error2, message, fix, detail, ...extra } = r;
  const own = detail && typeof detail === "object" && !Array.isArray(detail) ? detail : null;
  const merged = Object.keys(extra).length ? { ...extra, ...own ?? (detail != null ? { detail } : {}) } : detail ?? null;
  return { error: error2, message, fix: typeof fix === "string" && fix ? fix : null, detail: merged };
}
var fixOf = (error2) => {
  const fix = error2?.fix;
  return typeof fix === "string" && fix ? { fix } : {};
};
function progressOf(frame) {
  const p = frame;
  if (!p || typeof p !== "object" || typeof p.phase !== "string" || "error" in p) return null;
  const n = (v) => typeof v === "number" && Number.isFinite(v) ? v : typeof v === "bigint" ? Number(v) : 0;
  return { phase: p.phase, done: n(p.done), total: n(p.total), ...p.node !== void 0 ? { node: p.node } : {}, ...typeof p.exec === "string" ? { exec: p.exec } : {} };
}
var withValues = (entry) => Object.keys(entry?.form?.with ?? {});
var REQUIRED_CALLS = [
  "project.init",
  "project.list",
  "project.get",
  "project.export",
  "branch.fork",
  "branch.list",
  "commit.list",
  "commit.diff",
  "file.read",
  "file.list",
  "file.apply",
  "sandbox.create",
  "sandbox.list",
  "sandbox.get",
  "sandbox.remove",
  "workspace.mount",
  "workspace.commit",
  "workspace.status",
  "workspace.unmount",
  "workspace.exec",
  "workspace.cancel",
  "store.list",
  "store.get",
  "store.create",
  "home.get",
  "machine.list",
  "machine.get"
];
var REQUIRED_WITH = { "home.get": ["platforms"] };
function parse(text6) {
  return JSON.parse(text6, function(_key, value, context2) {
    if (typeof value === "number" && Number.isInteger(value) && !Number.isSafeInteger(value)) {
      if (!context2?.source || !/^-?\d+$/.test(context2.source)) throw new Error("CLI integers require Node 24 JSON source support");
      return BigInt(context2.source);
    }
    return value;
  });
}
function plain(value) {
  return JSON.parse(JSON.stringify(value, (_k, v) => typeof v === "bigint" ? Number.isSafeInteger(Number(v)) ? Number(v) : String(v) : v));
}
function lines(onLine) {
  const decoder = new StringDecoder("utf8");
  let pending2 = "";
  const consume = (text6) => {
    pending2 += text6;
    let end;
    while ((end = pending2.indexOf("\n")) >= 0) {
      const line = pending2.slice(0, end);
      pending2 = pending2.slice(end + 1);
      if (line.trim()) onLine(line);
    }
  };
  return {
    write: (chunk) => consume(decoder.write(chunk)),
    end: () => {
      consume(decoder.end());
      if (pending2.trim()) onLine(pending2);
      pending2 = "";
    }
  };
}
function outcome(o) {
  if (o.error) throw new CliError("CliUnavailable", "The configured LayerFS CLI could not be started", null, "unavailable");
  if (o.signal || o.malformed) throw new CliError("Unknown", "LayerFS ended without a complete result; inspect state before another action", { signal: o.signal }, "transport-unknown");
  if (o.code === 0 && o.result !== void 0 && !o.refusal) return o.result;
  if (o.exec && !o.refusal && o.result?.exit_code === o.code) return o.result;
  const refusal2 = o.code === 125 ? refusalOf(o.refusal) : null;
  if (refusal2) throw new CliError(refusal2.error, refusal2.message, refusal2.detail, "refusal", refusal2.fix);
  if (o.code === 2) throw new CliError("CliIncompatible", "LayerFS rejected the command syntax; check the selected binary and capabilities", null, "usage-incompatible");
  throw new CliError("Unknown", "LayerFS returned no valid final result; inspect state before another action", { exit: o.code }, "transport-unknown");
}
var lanes = /* @__PURE__ */ new Map();
var holding = new AsyncLocalStorage2();
async function admit(key, limit, run2, signal, queue) {
  const outer = holding.getStore()?.filter((hold2) => hold2.live) ?? [];
  if (limit === 1 && outer.some((hold2) => hold2.key === key)) return run2();
  signal?.throwIfAborted();
  let lane = lanes.get(key);
  if (queue && lane && lane.active >= limit && lane.waiting.length >= queue.most) throw queue.full();
  if (!lane) lanes.set(key, lane = { active: 0, waiting: [] });
  if (lane.active >= limit) {
    const current = lane;
    await new Promise((resolve11, reject) => {
      const abort = () => {
        const index = current.waiting.indexOf(wake);
        if (index < 0) return;
        current.waiting.splice(index, 1);
        reject(signal.reason);
      };
      const wake = () => {
        signal?.removeEventListener("abort", abort);
        resolve11();
      };
      current.waiting.push(wake);
      signal?.addEventListener("abort", abort, { once: true });
    });
  } else lane.active++;
  const hold = { key, live: true };
  try {
    return await (limit === 1 ? holding.run([...outer, hold], run2) : run2());
  } finally {
    hold.live = false;
    const next = lane.waiting.shift();
    if (next) next();
    else if (--lane.active === 0) lanes.delete(key);
  }
}
function admitStore(home, store, run2, signal) {
  return admit(JSON.stringify(["store", home, store]), 1, run2, signal);
}
function storeOfCall(argv) {
  const [family, call] = argv;
  const at = argv.indexOf("--with");
  const stats = family === "store" && call === "get" && at >= 0 && String(argv[at + 1] ?? "").split(",").includes("stats");
  if (!(["file", "branch", "commit", "project"].includes(family) || stats)) return void 0;
  const dash = argv.indexOf("--");
  const first = dash >= 0 ? argv[dash + 1] : argv[2];
  if (!first || first.startsWith("--")) return void 0;
  return first.split("/")[0] || void 0;
}
var children = /* @__PURE__ */ new Set();
var KILL_GRACE_MS = 2e3;
var EXIT_GRACE_MS = 2e3;
var READ_TIMEOUT_MS = 12e4;
var PROBE_TIMEOUT_MS = 15e3;
var PROBES = /* @__PURE__ */ new Set(["machine.get", "machine.list", "machine.images"]);
var KEPT_READS = /* @__PURE__ */ new Map([
  ["store.get", 2e3],
  ["store.list", 2e3],
  ["project.get", 2e3],
  ["project.list", 2e3],
  ["branch.list", 2e3],
  ["machine.get", 2e3],
  ["machine.list", 5e3],
  ["machine.images", 5e3],
  ["home.get", 2e3]
]);
var INSPECT_CALLS = /* @__PURE__ */ new Set(["machine.log", "sandbox.log", "sandbox.files", "machine.files", "machine.stats"]);
var INSPECT_LANE = { name: "inspect", limit: 2, queue: 4 };
var INSPECT_TIMEOUT_MS = 15e3;
function laneOf(argv) {
  const family = argv[0] ?? "", call = String(argv[1] ?? "").replaceAll("-", "_");
  if (INSPECT_CALLS.has(`${family}.${call}`)) return INSPECT_LANE;
  if (family === "workspace" && call === "cancel") return { name: "cancel", limit: 4 };
  if (family === "workspace" && call === "exec") return { name: "exec", limit: 8 };
  if (family === "doctor" || LONG_CALLS.has(`${family}.${call}`)) return { name: "jobs", limit: 4 };
  if (PROBES.has(`${family}.${call}`)) return { name: "probes", limit: 4 };
  return { name: "calls", limit: 4 };
}
var LONG_CALLS = /* @__PURE__ */ new Set([
  "project.init",
  "project.export",
  "machine.create",
  "machine.start",
  "machine.stop",
  "machine.update",
  "machine.remove",
  "machine.load_image",
  "machine.prune",
  "store.move",
  "store.connect",
  "store.update",
  "store.compact",
  "backup.connect",
  "backup.create",
  "backup.restore",
  "sandbox.create",
  "sandbox.remove"
]);
function signalGroup(child, kill, signal) {
  if (child.pid) {
    try {
      process.kill(-child.pid, signal);
      return true;
    } catch {
    }
  }
  try {
    return kill(signal);
  } catch {
    return false;
  }
}
var exitHook = false;
function killOnExit() {
  if (exitHook) return;
  exitHook = true;
  process.on("exit", () => {
    for (const child of children) {
      try {
        child.kill("SIGTERM");
      } catch {
      }
    }
  });
}
function execute(spec, argv, options = {}) {
  if (options.discovery) return executeRaw(spec, argv, options);
  const target = ["file", "branch"].includes(argv[0]) || argv[0] === "workspace" && argv[1] === "commit" ? renderCall(argv)[2] : void 0;
  const timing = {};
  return traceInvocation(
    argv.slice(0, 2).join(".").replaceAll("-", "_"),
    (tag) => logged(spec, argv, { ...options, tag: tag ?? callerTag(options.tag), timing }),
    argv[0] === "workspace" ? void 0 : target,
    argv[0] === "workspace" ? target : void 0,
    () => ({ argv, input: options.input ?? null, bools: boolOptions(spec.cli), ...timing })
  );
}
function callerTag(tag) {
  const sim = parseSimTag(tag);
  return sim && simTag(sim.runId, sim.stepKey) === tag ? tag : void 0;
}
async function logged(spec, argv, options) {
  if (!spec.callLog || !loggable(argv)) return executeRaw(spec, argv, options);
  const tag = options.tag ?? hostTag(randomUUID2().replaceAll("-", ""));
  const capture = { stdout: outputSink(OUTPUT_MAX, "head"), stderr: outputSink(OUTPUT_MAX, "tail") };
  const at = Date.now(), started = performance.now();
  let result, error2, spawned = false;
  const onSpawn = (child) => {
    spawned = true;
    options.onSpawn?.(child);
  };
  try {
    result = await executeRaw(spec, argv, { ...options, tag, capture, onSpawn });
    return result;
  } catch (e) {
    error2 = e;
    throw e;
  } finally {
    const ran = spawned && (!error2 || !["unavailable", "usage-incompatible"].includes(error2?.transport));
    if (ran) {
      try {
        saveOutput(outputsDir(spec.callLog), outputRecord({ tag, exit: capture.exit, stdout: capture.stdout, stderr: capture.stderr, refusal: capture.refusal, max: OUTPUT_MAX }));
      } catch {
      }
      const ms = performance.now() - started;
      if (options.timing) Object.assign(options.timing, { at, ms: Math.max(0, Math.round(ms)) });
      if (!(spec.nativeLogs ?? await hasNativeLogs(spec.cli))) {
        appendCall(spec.callLog, callLine({
          at,
          ms,
          argv,
          input: options.input ?? null,
          result,
          tag,
          outcome: error2 ? typeof error2.code === "string" && error2.code.length <= 64 ? error2.code : "Failed" : "ok",
          bools: boolOptions(spec.cli)
        }));
      }
    }
  }
}
var uninitialized = (home, message) => new CliError(
  "Uninitialized",
  message ?? `The LayerFS folder ${home} is not set up yet; open Set up LayerFS (Center) to create it`,
  { missing: [`home:${home}`] }
);
function gateOf(spec, argv, options) {
  if (options.gated || options.discovery || !spec.home || argv[0] === "home") return null;
  if (spec.gate) return spec.gate({ family: argv[0] ?? "", call: argv[1] ?? "", read: !!options.read });
  if (options.read && !existsSync4(join3(spec.home, "layerfs.json"))) return Promise.reject(uninitialized(spec.home));
  return null;
}
function executeRaw(spec, argv, options) {
  if (!spec.cli || !isAbsolute(spec.cli) || !existsSync4(spec.cli)) {
    return Promise.reject(new CliError("CliUnavailable", "No LayerFS runtime is chosen yet. Open Set up LayerFS in Center, or set DSH_LAYERFS_CLI", null, "unavailable"));
  }
  const own = laneOf(argv);
  const chosen = own.name === "cancel" || own.name === "inspect" ? own : options.lane ?? own;
  const signal = options.signal;
  const full2 = chosen.queue === void 0 ? void 0 : {
    most: chosen.queue,
    full: () => new CliError("Busy", `${chosen.limit} ${chosen.name} reads are running and ${chosen.queue} are waiting on this host; read again in a moment`, { lane: chosen.name, running: chosen.limit, queued: chosen.queue })
  };
  const cancelled2 = () => new CliError("Cancelled", "The read was dropped: nobody waits for its answer");
  const gated = gateOf(spec, argv, options);
  if (gated) return gated.then(() => executeRaw(spec, argv, { ...options, gated: true }));
  const launch = () => admit(`${spec.cli}:${chosen.name}`, chosen.limit, () => new Promise((resolve11, reject) => {
    if (!options.discovery && !spec.home) return reject(new CliError("InvalidInput", "LayerFS requires an explicit home"));
    let result, refusal2, spawnError, malformed = false, finals = 0;
    const capture = options.capture;
    const stdout = lines((line) => {
      try {
        const frame = parse(line);
        if (++finals !== 1) throw new Error("Extra result");
        result = frame;
      } catch {
        malformed = true;
      }
    });
    const stderr = lines((line) => {
      try {
        const frame = parse(line);
        const progress = progressOf(frame);
        if (progress) options.onProgress?.(progress);
        else if (refusalOf(frame)) {
          if (refusal2) malformed = true;
          refusal2 ??= frame;
        } else malformed = true;
      } catch {
      }
    });
    try {
      options.beforeSpawn?.();
    } catch (error2) {
      reject(error2);
      return;
    }
    if (signal?.aborted) {
      reject(cancelled2());
      return;
    }
    const child = spawn(spec.cli, [...argv], {
      shell: false,
      stdio: ["pipe", "pipe", "pipe"],
      detached: true,
      env: { ...tagged(options), ...spec.home ? { LAYERFS_HOME: spec.home } : {}, ...spec.bundle ? { LAYERFS_BUNDLE: spec.bundle } : {}, ...spec.cacheHome ? { XDG_CACHE_HOME: spec.cacheHome } : {}, LAYERFS_PROGRESS_JSON: "1" }
    });
    const kill = child.kill.bind(child);
    child.kill = ((signal2 = "SIGTERM") => signalGroup(child, kill, signal2));
    children.add(child);
    killOnExit();
    child.once("error", (error2) => {
      spawnError = error2;
    });
    child.stdin?.on("error", () => {
    });
    child.stdout?.on("data", (data) => {
      capture?.stdout.push(data);
      stdout.write(data);
    });
    child.stderr?.on("data", (data) => {
      capture?.stderr.push(data);
      stderr.write(data);
    });
    let deadline, exitGrace, giveUp;
    let timedOut = false, dropped = false, exited = false, done = false;
    const unclose = () => {
      child.stdout?.destroy();
      child.stderr?.destroy();
    };
    const stop = () => {
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), KILL_GRACE_MS).unref();
      giveUp = setTimeout(() => {
        unclose();
        settle(null, null);
      }, 2 * KILL_GRACE_MS);
    };
    const drop = () => {
      if (done || timedOut || dropped) return;
      dropped = true;
      clearTimeout(deadline);
      stop();
    };
    const settle = (code2, signal2) => {
      if (done) return;
      done = true;
      clearTimeout(deadline);
      clearTimeout(exitGrace);
      clearTimeout(giveUp);
      options.signal?.removeEventListener("abort", drop);
      if (exited || !(timedOut || dropped)) children.delete(child);
      stdout.end();
      stderr.end();
      if (capture) {
        capture.exit = code2;
        capture.refusal = refusal2;
      }
      if (dropped) {
        reject(cancelled2());
        return;
      }
      if (timedOut) {
        reject(new CliError("Unknown", "LayerFS did not answer in time and was stopped; inspect state before another action", { signal: signal2, timeout: options.timeout }, "transport-unknown"));
        return;
      }
      try {
        resolve11(outcome({ code: code2, signal: signal2, result, refusal: refusal2, error: spawnError, malformed, exec: argv[0] === "workspace" && argv[1] === "exec" }));
      } catch (error2) {
        reject(error2);
      }
    };
    if (options.timeout) {
      deadline = setTimeout(() => {
        if (dropped) return;
        timedOut = true;
        stop();
      }, options.timeout);
    }
    signal?.addEventListener("abort", drop, { once: true });
    child.once("exit", (code2, signal2) => {
      exited = true;
      clearTimeout(deadline);
      if (done) {
        children.delete(child);
        return;
      }
      exitGrace = setTimeout(() => {
        unclose();
        settle(code2, signal2);
      }, EXIT_GRACE_MS);
    });
    child.once("close", (code2, signal2) => settle(code2, signal2));
    try {
      options.onSpawn?.(child);
    } catch {
      malformed = true;
      child.kill("SIGTERM");
    }
    child.stdin?.end(options.input);
  }), signal, full2).catch((error2) => {
    if (signal?.aborted && !(error2 instanceof CliError)) throw cancelled2();
    throw error2;
  });
  const store = options.storeRead ?? storeOfCall(argv);
  return store ? admit(JSON.stringify(["store", spec.home, store]), 1, launch) : launch();
}
function tagged(options) {
  const env = { ...process.env };
  delete env.LAYERFS_LOGS_TAG;
  Object.assign(env, options.env);
  if (options.tag) env.LAYERFS_LOGS_TAG = options.tag;
  return env;
}
var known = /* @__PURE__ */ new Map();
var settled = /* @__PURE__ */ new Map();
var nativeLogs = /* @__PURE__ */ new Map();
var nativeKnown = /* @__PURE__ */ new Map();
var tableHasLogs = (calls) => calls.some((c) => c.family === "home" && c.call === "log") && calls.some((c) => c.family === "home" && c.call === "clear_log");
function hasNativeLogs(cli) {
  let pending2 = nativeLogs.get(cli);
  if (!pending2) {
    pending2 = discover({ cli }).then((d) => tableHasLogs(d.calls), () => {
      setTimeout(() => {
        if (nativeLogs.get(cli) === pending2) nativeLogs.delete(cli);
      }, 6e4).unref();
      return false;
    });
    nativeLogs.set(cli, pending2);
    void pending2.then((value) => {
      if (nativeLogs.get(cli) === pending2) nativeKnown.set(cli, value);
    });
  }
  return pending2;
}
function knownNativeLogs(cli) {
  return nativeKnown.get(cli);
}
function knownIdentity(cli) {
  return settled.get(cli)?.identity;
}
function boolOptions(cli) {
  const d = settled.get(cli);
  return d ? [...new Set(d.calls.flatMap((c) => c.options.filter((o) => o.kind === "bool").map((o) => o.name)))] : void 0;
}
function discover(spec, fresh = false) {
  if (fresh) {
    known.delete(spec.cli);
    settled.delete(spec.cli);
    nativeLogs.delete(spec.cli);
    nativeKnown.delete(spec.cli);
  }
  if (!known.has(spec.cli)) {
    const pending2 = (async () => {
      const s = { cli: spec.cli, home: "" };
      const identity2 = await execute(s, ["--version", "--json"], { discovery: true, timeout: 15e3 });
      const help = await execute(s, ["help", "--json"], { discovery: true, timeout: 15e3 });
      if (!identity2 || !/^[a-f0-9]{40}$/.test(identity2.commit ?? "") || !Array.isArray(help?.calls)) {
        throw new CliError("CliIncompatible", "The selected LayerFS CLI has no compatible JSON discovery", null, "usage-incompatible");
      }
      for (const name6 of REQUIRED_CALLS) {
        if (!help.calls.some((c) => `${c.family}.${c.call}` === name6)) throw new CliError("CliIncompatible", `The selected LayerFS CLI lacks ${name6}`, null, "usage-incompatible");
      }
      for (const [name6, values] of Object.entries(REQUIRED_WITH)) {
        const have = withValues(help.calls.find((c) => `${c.family}.${c.call}` === name6));
        for (const v of values) if (!have.includes(v)) throw new CliError("CliIncompatible", `The selected LayerFS CLI lacks ${name6} --with ${v} (a LayerFS 2.0 runtime is needed)`, null, "usage-incompatible");
      }
      return { identity: identity2, calls: help.calls, commands: help.commands ?? [], switches: help.switches ?? [] };
    })();
    pending2.then((d) => {
      if (known.get(spec.cli) === pending2) settled.set(spec.cli, d);
    }, () => known.delete(spec.cli));
    known.set(spec.cli, pending2);
  }
  return known.get(spec.cli);
}
function inspectRead(spec, argv, options = {}) {
  const timeout = Math.min(options.timeout && options.timeout > 0 ? options.timeout : INSPECT_TIMEOUT_MS, INSPECT_TIMEOUT_MS);
  return executeRaw(spec, argv, { read: true, timeout, signal: options.signal, onSpawn: options.onSpawn }).catch((error2) => {
    if (error2 instanceof CliError && error2.transport === "transport-unknown" && error2.detail?.timeout) {
      throw new CliError("Timeout", `LayerFS did not answer the read in ${Math.round(timeout / 1e3)} s; it was stopped`, { timeout }, "transport-unknown");
    }
    throw error2;
  });
}
var READS = /* @__PURE__ */ new Set(["list", "get", "status", "images", "stats", "read", "stat", "glob", "grep", "blame", "diff", "history", "log", "auths"]);
var invalid2 = (message) => new CliError("InvalidInput", message);
var isPlain = (v) => v !== null && typeof v === "object" && !Array.isArray(v) && !ArrayBuffer.isView(v);
function client(spec) {
  const flying = /* @__PURE__ */ new Map();
  const recent = /* @__PURE__ */ new Map();
  let writes = 0;
  const families = /* @__PURE__ */ new Map();
  return new Proxy({ spec }, {
    get(target, family) {
      if (family in target) return target[family];
      if (typeof family !== "string" || family === "then") return void 0;
      if (!families.has(family)) families.set(family, new Proxy({}, {
        get(_unused, call) {
          if (typeof call !== "string" || call === "then") return void 0;
          return async (...given) => {
            const help = await discover(spec);
            const entry = help.calls.find((c) => c.family === family && c.call === call);
            if (!entry) throw invalid2(`No LayerFS call ${family}.${call}`);
            const args = [...given];
            let options = {};
            const last = args.at(-1), slot = entry.args[args.length - 1];
            if (args.length > entry.args.length || isPlain(last) && slot?.kind !== "json") options = args.pop() ?? {};
            if (!isPlain(options) || args.length > entry.args.length) throw invalid2("Invalid LayerFS arguments");
            const inspect = INSPECT_CALLS.has(`${family}.${call}`);
            const local = new Set(inspect ? ["on_spawn", "timeout_ms", "signal"] : ["on_spawn", "timeout_ms"]);
            const { detail, with: sections, ...own } = options;
            options = own;
            if (detail != null && typeof detail !== "boolean") throw invalid2("detail must be true or false");
            const withList = sections == null ? [] : Array.isArray(sections) ? sections.map(String) : [String(sections)];
            const offered = withValues(entry);
            for (const v of withList) if (!offered.includes(v)) throw invalid2(`${family}.${call} takes no --with ${v}${offered.length ? ` (it takes ${offered.join(", ")})` : ""}`);
            for (const name6 of Object.keys(options)) {
              if (!local.has(name6) && !entry.options.some((o) => o.name === name6)) throw invalid2(`${family}.${call}: unknown option ${name6}`);
            }
            for (const o of entry.options) if ((o.required === true || o.optional === false) && o.kind !== "function" && (options[o.name] === void 0 || options[o.name] === null)) throw invalid2(`${family}.${call}: ${o.name} is required`);
            for (const [name6, value] of Object.entries(options)) {
              const option = entry.options.find((o) => o.name === name6);
              if (option?.kind === "bool" && value != null && typeof value !== "boolean") throw invalid2(`${name6} must be true or false`);
              if (name6 === "timeout_ms") {
                if (value != null && (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0)) throw invalid2("timeout_ms must be a nonnegative integer");
                continue;
              }
              if (name6 === "signal" && inspect) {
                if (value != null && !(value instanceof AbortSignal)) throw invalid2("signal must be an AbortSignal");
                continue;
              }
              if ((option?.kind === "function" || local.has(name6)) && value != null && typeof value !== "function") throw invalid2(`${name6} must be a function`);
              if (typeof value === "number" && (!Number.isFinite(value) || Number.isInteger(value) && !Number.isSafeInteger(value))) throw invalid2(`${name6} must preserve exact numeric values`);
              if (family === "workspace" && call === "exec" && name6 === "env" && value != null && (!isPlain(value) || !Object.values(value).every((v) => typeof v === "string"))) throw invalid2("env is an object of names to text");
            }
            const words = [family, call.replaceAll("_", "-")];
            const positionals = [];
            let input;
            let omitted;
            for (let i = 0; i < entry.args.length; i++) {
              const arg = entry.args[i], value = args[i];
              if (value === void 0 || value === null) {
                if (!arg.optional) throw invalid2(`${arg.name} is required`);
                if (arg.kind !== "content" && arg.kind !== "json") omitted ??= arg.name;
                continue;
              }
              if (arg.kind === "content" || arg.kind === "json") input = arg.kind === "json" ? JSON.stringify(value) : String(value);
              else if (omitted) throw invalid2(`${arg.name} cannot be given without ${omitted}`);
              else positionals.push(String(value));
            }
            for (const [name6, value] of Object.entries(options)) {
              if (value === void 0 || value === null || local.has(name6) || typeof value === "function") continue;
              const option = entry.options.find((o) => o.name === name6);
              const flag = `--${name6.replaceAll("_", "-")}`;
              if (option?.kind === "content") {
                if (input !== void 0) throw invalid2(`${family}.${call}: one stdin input per call`);
                if (typeof value !== "string" || !value) throw invalid2(`${name6} must be a non-empty string`);
                input = value;
                words.push(option.shell ?? `${flag}-stdin`);
              } else if (option?.kind === "bool") words.push(`${flag}=${value}`);
              else if (option?.repeat && isPlain(value)) for (const [k, v] of Object.entries(value)) words.push(flag, `${k}=${v}`);
              else if (option?.repeat && Array.isArray(value)) for (const v of value) words.push(flag, String(v));
              else words.push(flag, typeof value === "object" ? JSON.stringify(value) : String(value));
            }
            if (detail) words.push("--detail");
            if (withList.length) words.push("--with", [...new Set(withList)].join(","));
            if (options.on_progress || (family === "machine" && ["start", "create"].includes(call) || family === "sandbox" && call === "create") && entry.options.some((o) => o.name === "on_progress")) words.push("--progress");
            if (spec.scope) words.push("--scope", spec.scope.folder, "--scope-project", spec.scope.project, ...spec.scope.branch ? ["--scope-branch", spec.scope.branch] : []);
            words.push("--", ...positionals);
            if (inspect) return inspectRead(spec, words, { timeout: options.timeout_ms || void 0, signal: options.signal ?? void 0, onSpawn: (child) => options.on_spawn?.(child.pid) });
            const read2 = READS.has(call);
            const opts = options;
            const timeout = opts.timeout_ms ?? (!read2 ? void 0 : PROBES.has(`${family}.${call}`) ? PROBE_TIMEOUT_MS : READ_TIMEOUT_MS);
            const storeRead = read2 && args[0] && (entry.args[0]?.kind === "project" || family === "store") ? String(args[0]).split("/")[0] : void 0;
            const invoke = () => execute(spec, words, {
              input,
              read: read2,
              storeRead,
              timeout: timeout || void 0,
              onProgress: opts.on_progress,
              onSpawn: (child) => opts.on_spawn?.(child.pid)
            });
            if (!read2) {
              writes++;
              recent.clear();
              return invoke().finally(() => {
                writes++;
                recent.clear();
              });
            }
            const key = JSON.stringify([words, input ?? null]);
            const started = writes;
            const keep2 = opts.timeout_ms === void 0 && spec.keepReads !== false ? KEPT_READS.get(`${family}.${call}`) : void 0;
            const kept2 = keep2 ? recent.get(key) : void 0;
            if (kept2 && kept2.until > Date.now()) return Promise.resolve(kept2.value);
            const share = JSON.stringify([started, key]);
            if (!flying.has(share)) {
              const pending2 = invoke();
              flying.set(share, pending2);
              pending2.then((value) => {
                if (!keep2 || writes !== started) return;
                if (recent.size > 500) recent.clear();
                recent.set(key, { until: Date.now() + keep2, value });
              }, () => {
              }).finally(() => flying.delete(share)).catch(() => {
              });
            }
            return flying.get(share);
          };
        }
      }));
      return families.get(family);
    }
  });
}
var PAGE = 1e3;
async function pages(read2, most = Infinity) {
  const all = [];
  for (let cursor = void 0; all.length < most; ) {
    const page = await read2({ limit: PAGE, ...cursor ? { cursor } : {} });
    all.push(...page.items ?? []);
    cursor = typeof page.next_cursor === "string" && page.next_cursor ? page.next_cursor : null;
    if (!cursor) break;
  }
  return all;
}
function sandboxWorkspaces(lfs, sandbox) {
  return lfs.sandbox.get(sandbox, { detail: true });
}

// src/host/layerfs/machine-records.ts
var text = (value) => typeof value === "string" && value ? value : null;
var num = (value) => typeof value === "number" && Number.isFinite(value) ? value : null;
var list = (value) => Array.isArray(value) ? value : [];
var STATES = /* @__PURE__ */ new Set(["ready", "busy", "stopped", "blocked", "broken", "unknown"]);
var opOf = (o) => {
  if (!o || typeof o !== "object" || typeof o.name !== "string") return null;
  const at = typeof o.started_at === "string" ? Date.parse(o.started_at) : NaN;
  return { id: "", name: o.name, phase: text(o.phase) ?? "", started: Number.isFinite(at) ? at : null, uncertain: false };
};
var msAt = (v) => {
  if (typeof v !== "string") return null;
  const at = Date.parse(v);
  return Number.isFinite(at) ? at : null;
};
function companionsOf(s) {
  const out = {};
  const b = s?.blocked_by;
  if (b && typeof b === "object") out.blockedBy = { ...typeof b.machine === "string" ? { machine: b.machine } : {}, ...typeof b.store === "string" ? { store: b.store } : {}, ...typeof b.sandbox === "string" ? { sandbox: b.sandbox } : {}, reason: String(b.reason ?? "") };
  if (typeof s?.reason === "string" && s.reason) out.reason = s.reason;
  if (typeof s?.fix === "string" && s.fix) out.fix = s.fix;
  if (typeof s?.message === "string" && s.message) out.message = s.message;
  const seen = msAt(s?.observed_at);
  if (seen !== null) out.observedAt = seen;
  return out;
}
function machineOf(m) {
  const state = text(m.state) ?? "ready";
  return {
    name: String(m.machine),
    // empty for a record LayerFS could not read (it lists the machine `broken`/`failed` with no platform)
    platform: text(m.platform) ?? "",
    backend: text(m.backend),
    // the SDK's state, as it is (#537 U4)
    state: STATES.has(state) ? state : "unknown",
    op: opOf(m.op),
    reason: text(m.reason),
    fix: text(m.fix),
    message: text(m.message),
    observedAt: text(m.observed_at),
    // `sqlite`, `postgresql_sandbox`, `log` (the machine has a worker log to read)
    supports: list(m.supports).map(String),
    cpus: num(m.cpus),
    memory: num(m.memory_bytes),
    disk: num(m.disk_bytes),
    // the first 20 names; `stores_count` / `sandboxes_count` sit beside a cut list
    stores: list(m.stores).map(String),
    sandboxes: list(m.sandboxes).map(String),
    storesCount: num(m.stores_count) ?? list(m.stores).length,
    sandboxesCount: num(m.sandboxes_count) ?? list(m.sandboxes).length,
    ...text(m.image) ? { image: m.image } : {},
    ...text(m.os_image) ? { osImage: m.os_image } : {},
    ...text(m.docker) ? { docker: m.docker } : {},
    ...text(m.wsl) ? { wsl: m.wsl } : {},
    ...text(m.daemon) ? { daemon: m.daemon } : {}
  };
}
var unreadableRecord = (m) => m.state === "broken" && m.reason === "failed" && !m.platform;
function probedRecord(record, got) {
  if (!got || typeof got !== "object") return record;
  const merged = { ...record, ...got, machine: record?.machine ?? got.machine };
  if (record?.state !== "broken") return merged;
  for (const key of ["state", "reason", "fix", "message", "op"]) {
    if (record[key] === void 0 || record[key] === null) delete merged[key];
    else merged[key] = record[key];
  }
  return merged;
}
async function machineRows(lfs, options = {}) {
  return list((await lfs.machine.list({ detail: true, ...options }))?.items).map(machineOf);
}
var runsPostgresql = (m) => !m.supports || m.supports.includes("postgresql_sandbox");

// src/host/layerfs/agent-sdk.ts
import { createHash as createHash4 } from "node:crypto";
import { chmodSync as chmodSync2, existsSync as existsSync5, mkdirSync as mkdirSync3, readFileSync as readFileSync4, renameSync as renameSync2, writeFileSync as writeFileSync2 } from "node:fs";
import { dirname as dirname3, join as join4, resolve as resolve2 } from "node:path";
import { pathToFileURL } from "node:url";
var SDK_FAMILIES = ["project", "branch", "commit", "file", "sandbox", "workspace"];
function findSdk(dir, commit) {
  if (!dir || !commit) return null;
  dir = resolve2(dir);
  if (!existsSync5(join4(dir, "sdk.json"))) dir = join4(dir, commit);
  try {
    const meta = JSON.parse(readFileSync4(join4(dir, "sdk.json"), "utf8"));
    const entry = join4(dir, "api", "node", "src", "index.js"), addon = join4(dir, "layerfs.node");
    if (meta?.commit !== commit || !existsSync5(entry) || !existsSync5(addon)) return null;
    return { dir, commit, entry, addon };
  } catch {
    return null;
  }
}
function managedSdk(options) {
  const file = join4(options.root, "agent-bin", "sdk.mjs");
  const outputs = options.callLog ? outputsDir(options.callLog) : null;
  const config = {
    entry: pathToFileURL(options.sdk.entry).href,
    addon: options.sdk.addon,
    commit: options.sdk.commit,
    home: options.home,
    bundle: options.bundle ?? null,
    cacheHome: options.cacheHome ?? null,
    // The stand-in log stays known in native mode: an SDK that refuses `log_tag` falls back to it.
    callLog: options.callLog ?? null,
    native: !!options.native,
    outputs,
    families: SDK_FAMILIES,
    bools: options.bools ?? [],
    rotate: options.rotateBytes ?? ROTATE_BYTES,
    max: OUTPUT_MAX,
    bounds: options.outputBounds ?? DEFAULT_BOUNDS
  };
  const text6 = [
    `// Generated by dsh-layerfs (src/host/layerfs/agent-sdk.ts). Do not edit.`,
    `// The LayerFS Node SDK (@layerfs/node ${options.sdk.commit.slice(0, 10)}) bound to this app's LayerFS home.`,
    `//   const { default: layerfs } = await import(process.env.DSH_LAYERFS_SDK);`,
    `import * as fs from 'node:fs';`,
    `import {randomUUID,createHash} from 'node:crypto';`,
    `const config=${JSON.stringify(config)};`,
    `const makeReceipt = ${makeReceipt.toString()};`,
    `const renderCall = ${renderCall.toString()};`,
    `const savedFields = ${savedFields.toString()};`,
    `const appendCallLine = ${appendCallLine.toString()};`,
    `const outputSink = ${outputSink.toString()};`,
    `const outputRecord = ${outputRecord.toString()};`,
    `const outputName = ${outputName.toString()};`,
    `const writeOutput = ${writeOutput.toString()};`,
    BODY
  ].join("\n");
  mkdirSync3(dirname3(file), { recursive: true });
  if (!existsSync5(file) || readFileSync4(file, "utf8") !== text6) {
    const tmp = `${file}.${process.pid}.tmp`;
    writeFileSync2(tmp, text6, { mode: 384 });
    renameSync2(tmp, file);
  }
  chmodSync2(file, 384);
  return file;
}
var BODY = String.raw`
if (Number(process.versions.node.split('.')[0]) < 22) throw new Error('The LayerFS Node SDK needs Node 22 or later; this is Node ' + process.versions.node);
// The library reads its home, bundle and addon from the environment.
process.env.LAYERFS_HOME = config.home;
process.env.LAYERFS_NATIVE = config.addon;
if (config.bundle) process.env.LAYERFS_BUNDLE = config.bundle;
if (config.cacheHome) process.env.XDG_CACHE_HOME = config.cacheHome;
delete process.env.LAYERFS_LOGS_TAG;
const sdk = await import(config.entry);
const LayerFSError = sdk.LayerFSError;
const inner = sdk.client({ home: config.home });
let identity; try { identity = JSON.parse(process.env.DSH_LAYERFS_TRACE_CONTEXT || 'null') } catch {}
const isPlain = (value) => value !== null && typeof value === 'object' && !Array.isArray(value) && !ArrayBuffer.isView(value);
// JSON for records: bigints as numbers' text, bytes by size (never their whole content).
const json = (value) => JSON.stringify(value, (key, item) => typeof item === 'bigint' ? item.toString() : (item && typeof item === 'object' && (ArrayBuffer.isView(item) || item.type === 'Buffer' && Array.isArray(item.data))) ? '<' + (item.byteLength ?? item.data.length) + ' bytes>' : item);
let tagWorks = config.native;

// Split given arguments as @layerfs/node does: positionals, then an options object.
function split(spec, given) {
  const args = [...given];
  let options = {};
  const last = args[args.length - 1], slot = spec.args[args.length - 1];
  if (args.length > spec.args.length || (isPlain(last) && slot && slot.kind !== 'json')) options = args.pop() ?? {};
  return { args, options };
}

// The call as CLI words (family, call, --flags, --, positionals) and its stdin size.
function words(spec, args, options) {
  const out = [spec.family, spec.call.replaceAll('_', '-')], positionals = [];
  let input = null, skipped = 0;
  spec.args.forEach((arg, i) => {
    const value = args[i];
    if (value === undefined || value === null) { if (arg.kind !== 'content' && arg.kind !== 'json') skipped++; return }
    if (arg.kind === 'content') input = typeof value === 'string' ? Buffer.byteLength(value) : (value.byteLength ?? Buffer.byteLength(String(value)));
    else if (arg.kind === 'json') input = Buffer.byteLength(json(value));
    else { for (; skipped > 0; skipped--) positionals.push('-'); positionals.push(String(value)) }
  });
  for (const [name, value] of Object.entries(isPlain(options) ? options : {})) {
    if (value === undefined || value === null || typeof value === 'function' || name === 'log_tag') continue;
    const flag = '--' + name.replaceAll('_', '-');
    if (spec.options.find((o) => o.name === name)?.kind === 'bool') out.push(flag + '=' + value);
    else out.push(flag, typeof value === 'object' ? json(value) : String(value));
  }
  out.push('--', ...positionals);
  return { argv: out, input };
}

function record(spec, args, options, o) {
  const call = words(spec, args, options);
  const exec = spec.family === 'workspace' && spec.call === 'exec';
  if (o.tag && config.outputs) {
    const stdout = outputSink(config.max, 'head'), stderr = outputSink(config.max, 'tail');
    if (o.outcome === 'ok') stdout.push(json(o.value) + '\n');
    if (o.refusal) stderr.push(json(o.refusal) + '\n');
    // As the 2.0 CLI: \`workspace exec\` prints its one result JSON and exits with the command's own code.
    const code = exec && o.outcome === 'ok' && Number.isInteger(o.value?.exit_code) ? o.value.exit_code : 0;
    writeOutput(fs, config.outputs, outputName(createHash, o.tag), outputRecord({ tag: o.tag, exit: o.outcome === 'ok' ? code : o.refusal ? 125 : null, stdout, stderr, refusal: o.refusal, max: config.max }), config.bounds);
  }
  if (config.callLog && !o.native) {
    const rendered = renderCall(call.argv, call.input, config.bools);
    appendCallLine(fs, config.callLog, { v: 1, at: o.at, ms: Math.max(0, Math.round(o.ms)), client: 'node', argv: rendered, outcome: o.outcome, ...(o.outcome === 'ok' ? savedFields(rendered, o.value) : {}), ...(o.tag ? { tag: o.tag } : {}) }, config.rotate);
  }
}

function traced(spec, call) {
  const name = spec.family + '.' + spec.call;
  return async function (...given) {
    const scope = identity && typeof identity.scope === 'string' && /^[a-f0-9]{1,16}$/.test(identity.scope) ? identity.scope : undefined;
    const receipt = identity && typeof identity.sessionId === 'string' && identity.sessionId ? makeReceipt(identity.sessionId, scope, randomUUID().replaceAll('-', '')) : undefined;
    const tag = receipt && receipt.tag;
    const { args, options } = split(spec, given);
    let native = tagWorks && !!tag && isPlain(options);
    const at = Date.now(), started = performance.now();
    let value, refusal, outcome = 'ok', thrown, checked = true;
    try {
      try { value = await call(...(native ? [...args, { ...options, log_tag: tag }] : given)) } catch (error) {
        // A build without #659 refuses the tag before calling: use the stand-in log from now on.
        if (!native || error?.code !== 'InvalidInput' || !String(error.message ?? '').includes('"log_tag"')) throw error;
        tagWorks = native = false;
        value = await call(...given);
      }
    } catch (error) {
      thrown = error;
      if (error && typeof error.code === 'string') {
        refusal = { code: error.code, message: String(error.message ?? ''), detail: error.detail ?? null };
        outcome = error.code.length <= 64 ? error.code : 'Failed';
        // The SDK refused the arguments before calling the library: no call, no line (as the CLI's exit 2).
        if (error.code === 'InvalidInput' && String(error.message ?? '').startsWith(name + ':')) checked = false;
      } else outcome = 'Unknown';
    }
    if (checked) { try { record(spec, args, options, { tag, at, ms: performance.now() - started, outcome, value, refusal, native }) } catch {} }
    if (thrown) throw thrown;
    return value;
  };
}

const families = {};
for (const spec of sdk.table) {
  if (!config.families.includes(spec.family)) continue;
  (families[spec.family] ??= {})[spec.call] = traced(spec, inner[spec.family][spec.call]);
}
for (const family of Object.keys(families)) Object.freeze(families[family]);

/** Close the Stores this process holds, releasing their leases. Runs by itself when the script ends. */
export function close() { return sdk.close() }
process.once('beforeExit', () => { try { sdk.close() } catch {} });
process.once('exit', () => { try { sdk.close() } catch {} });

export const { project, branch, commit, file, sandbox, workspace } = families;
export { LayerFSError };
/** The call table rows of the exposed families: { family, call, args, options, help }. */
export const table = sdk.table.filter((spec) => config.families.includes(spec.family));
export default Object.freeze({ ...families, close, LayerFSError, table, commit_id: config.commit });
`;

// src/host/service.ts
import { fileURLToPath } from "node:url";

// src/host/layerfs/runtime-home.ts
import { createHash as createHash5, randomUUID as randomUUID3 } from "node:crypto";
import { execFileSync } from "node:child_process";
import { chmodSync as chmodSync3, cpSync, existsSync as existsSync6, lstatSync as lstatSync2, mkdirSync as mkdirSync4, readFileSync as readFileSync5, readdirSync as readdirSync2, realpathSync as realpathSync2, renameSync as renameSync3, rmSync as rmSync3, statSync as statSync4, writeFileSync as writeFileSync3 } from "node:fs";
import { basename as basename2, dirname as dirname4, isAbsolute as isAbsolute2, join as join5, relative } from "node:path";
var runtimeRoot = (home) => join5(home, "runtime");
function inside(dir, path2) {
  const r = relative(dir, path2);
  return r !== "" && !r.startsWith("..") && !isAbsolute2(r);
}
var sha256 = (file) => createHash5("sha256").update(readFileSync5(file)).digest("hex");
function installedRuntimes(home) {
  const root = runtimeRoot(home);
  let names;
  try {
    names = readdirSync2(root);
  } catch {
    return [];
  }
  const found = [];
  for (const id of names) {
    const dir = join5(root, id);
    const cli = join5(dir, "bin", "layerfs");
    if (id.includes(".tmp-") || !existsSync6(cli)) continue;
    const daemon = join5(dir, "bin", "layerfs-daemon");
    let bundle = null;
    try {
      bundle = readdirSync2(join5(dir, "bundle")).map((p) => join5(dir, "bundle", p)).find((p) => existsSync6(join5(p, "bundle.json"))) ?? null;
    } catch {
    }
    found.push({ id, dir, cli, daemon: existsSync6(daemon) ? daemon : null, bundle, at: statSync4(cli).mtimeMs });
  }
  return found.sort((a, b) => b.at - a.at || b.id.localeCompare(a.id));
}
function runtimeId(cli, version2) {
  const v = String(version2 || "unknown").replace(/[^0-9A-Za-z_.+-]/g, "-");
  return `${v}-${sha256(cli).slice(0, 12)}`;
}
function refusal(message) {
  return Object.assign(new Error(message), { code: "InvalidInput", transport: "refusal" });
}
function place(src, dest, folder) {
  mkdirSync4(dirname4(dest), { recursive: true, mode: 448 });
  const tmp = `${dest}.tmp-${randomUUID3().slice(0, 8)}`;
  const from = realpathSync2(src);
  try {
    let cloned = false;
    if (process.platform === "darwin") {
      try {
        execFileSync("/bin/cp", ["-c", ...folder ? ["-R"] : [], "-p", from, tmp], { stdio: "ignore" });
        cloned = true;
      } catch {
        rmSync3(tmp, { recursive: true, force: true });
      }
    }
    if (!cloned) cpSync(from, tmp, { recursive: folder, preserveTimestamps: true });
    renameSync3(tmp, dest);
  } finally {
    rmSync3(tmp, { recursive: true, force: true });
  }
}
function placeFile(src, dest, what) {
  if (src === dest) return dest;
  if (existsSync6(dest)) {
    if (sha256(src) !== sha256(dest)) throw refusal(`This runtime (${basename2(dirname4(dirname4(dest)))}) already has a different ${what}; install the matching one, or a different CLI build`);
    return dest;
  }
  place(src, dest, false);
  chmodSync3(dest, 493);
  return dest;
}
function placeBundle(src, dir, replace = false) {
  const dest = join5(dir, "bundle", basename2(src));
  if (src === dest) return dest;
  if (existsSync6(dest)) {
    if (readFileSync5(join5(src, "bundle.json"), "utf8") === readFileSync5(join5(dest, "bundle.json"), "utf8")) return dest;
    if (!replace) throw refusal(`This runtime (${basename2(dir)}) already has a different Linux bundle for ${basename2(src)}; stop the docker and VM machines to replace it`);
    const old = `${dest}.tmp-rm-${randomUUID3().slice(0, 8)}`;
    renameSync3(dest, old);
    try {
      place(src, dest, true);
    } catch (error2) {
      renameSync3(old, dest);
      throw error2;
    }
    rmSync3(old, { recursive: true, force: true });
    return dest;
  }
  place(src, dest, true);
  return dest;
}
function installRuntime(home, version2, given, options = {}) {
  if (!existsSync6(home)) mkdirSync4(home, { recursive: true, mode: 448 });
  const root = runtimeRoot(home);
  mkdirSync4(root, { recursive: true, mode: 448 });
  const id = runtimeId(given.cli, version2);
  const dir = join5(root, id);
  mkdirSync4(join5(dir, "bin"), { recursive: true, mode: 448 });
  const cli = placeFile(given.cli, join5(dir, "bin", "layerfs"), "CLI");
  const present = installedRuntimes(home).find((r) => r.id === id);
  const daemon = given.daemon ? placeFile(given.daemon, join5(dir, "bin", "layerfs-daemon"), "daemon") : present?.daemon ?? null;
  const bundle = given.bundle ? placeBundle(given.bundle, dir, options.replaceBundle === true) : present?.bundle ?? null;
  return { id, cli, daemon, bundle };
}
var hostId = (root) => createHash5("sha256").update(root).digest("hex").slice(0, 16);
function runtimeOf(home, path2) {
  if (!path2) return null;
  const root = runtimeRoot(home);
  if (!inside(root, path2)) return null;
  const id = relative(root, path2).split(/[\\/]/)[0];
  return id ? join5(root, id) : null;
}
function leasePin(home, root, cli) {
  const id = hostId(root);
  const held = runtimeOf(home, cli);
  for (const r of installedRuntimes(home)) {
    const lease = join5(r.dir, "pins", id);
    try {
      if (r.dir === held) {
        mkdirSync4(join5(r.dir, "pins"), { recursive: true, mode: 448 });
        writeFileSync3(lease, `${JSON.stringify({ root, at: (/* @__PURE__ */ new Date()).toISOString() })}
`, { mode: 384 });
      } else if (existsSync6(lease)) rmSync3(lease, { force: true });
    } catch {
    }
  }
}
function leased(dir) {
  let names;
  try {
    names = readdirSync2(join5(dir, "pins")).filter((n) => !n.startsWith("."));
  } catch {
    return false;
  }
  return names.some((n) => {
    try {
      const root = JSON.parse(readFileSync5(join5(dir, "pins", n), "utf8"))?.root;
      return typeof root !== "string" || existsSync6(root);
    } catch {
      return true;
    }
  });
}
function verdictOf(cli, piece) {
  if (!piece) return "missing";
  if (!cli?.commit || !piece.commit) return "unknown";
  if (cli.commit !== piece.commit) return "other";
  return cli.dirty === false && piece.dirty === false ? "matches" : "unknown";
}
function bundleStamp(dir) {
  if (!dir) return null;
  try {
    const b = JSON.parse(readFileSync5(join5(dir, "bundle.json"), "utf8"));
    const head = typeof b?.source?.head === "string" && /^[0-9a-f]{40}$/.test(b.source.head) ? b.source.head : null;
    return { commit: head, dirty: typeof b?.source?.dirty === "boolean" ? b.source.dirty : null };
  } catch {
    return null;
  }
}
var stamps = /* @__PURE__ */ new Map();
var MARK = Buffer.from("layerfs-build-identity:");
function daemonStamp(path2) {
  if (!path2) return null;
  let st;
  try {
    st = statSync4(path2);
  } catch {
    return null;
  }
  const key = `${st.size}:${st.mtimeMs}`;
  const kept2 = stamps.get(path2);
  if (kept2?.key === key) return kept2.stamp;
  let stamp = { commit: null, dirty: null };
  try {
    const data = readFileSync5(path2);
    for (let at = data.indexOf(MARK); at >= 0; at = data.indexOf(MARK, at + 1)) {
      const m = /^([0-9a-f]{40}):(clean|dirty)/.exec(data.subarray(at + MARK.length, at + MARK.length + 48).toString("latin1"));
      if (m) {
        stamp = { commit: m[1], dirty: m[2] === "dirty" };
        break;
      }
    }
  } catch {
  }
  stamps.set(path2, { key, stamp });
  return stamp;
}
var KEEP_NEWEST = 3;
var real = (path2) => {
  try {
    return realpathSync2(path2);
  } catch {
    return path2;
  }
};
var within = (dir, path2) => path2 === dir || inside(dir, path2);
function strings(value, out = [], depth = 0) {
  if (typeof value === "string") out.push(value);
  else if (value && typeof value === "object" && depth < 12) for (const v of Array.isArray(value) ? value : Object.values(value)) strings(v, out, depth + 1);
  return out;
}
function workersMayRun(machines) {
  return machines.some((m) => !(m && typeof m === "object" && (m.platform === "native" || m.state === "stopped")));
}
function planRuntimeCleanup(runtimes, facts3) {
  const keep2 = /* @__PURE__ */ new Map();
  const remove = [];
  const list4 = facts3.machines?.items;
  const known4 = Array.isArray(list4) && Array.isArray(facts3.processes);
  const pinned = facts3.pinned.filter((p) => typeof p === "string" && !!p).flatMap((p) => [p, real(p)]);
  const named = known4 ? strings(list4).filter((s) => s.startsWith("/")).flatMap((p) => [p, real(p)]) : [];
  const mayRun = known4 ? workersMayRun(list4) : true;
  const newest = Math.max(0, facts3.newest ?? KEEP_NEWEST);
  runtimes.forEach((r, index) => {
    const dirs = [r.dir, real(r.dir)];
    const holds = (paths) => paths.some((p) => dirs.some((d) => within(d, p)));
    const why = holds(pinned) ? "pinned" : leased(r.dir) ? "lease" : index < newest ? "newest" : !known4 ? "unknown" : holds(named) ? "machine" : facts3.processes.some((line) => dirs.some((d) => line.includes(`${d}/`))) ? "process" : mayRun && existsSync6(join5(r.dir, "bundle")) ? "worker" : null;
    if (why) keep2.set(r.id, why);
    else remove.push(r);
  });
  return { keep: keep2, remove };
}
function runningCommands() {
  try {
    const out = execFileSync("/bin/ps", ["-axww", "-o", "command="], { encoding: "utf8", timeout: 5e3, maxBuffer: 32 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
    const lines2 = out.split("\n").filter(Boolean);
    return lines2.length ? lines2 : null;
  } catch {
    return null;
  }
}
function cleanRuntimes(home, facts3) {
  const result = { kept: [], removed: [], failed: [] };
  const root = runtimeRoot(home);
  let plan;
  try {
    plan = planRuntimeCleanup(installedRuntimes(home), facts3);
  } catch (error2) {
    result.failed.push({ id: "*", message: String(error2?.message ?? error2) });
    return result;
  }
  for (const [id, why] of plan.keep) result.kept.push({ id, why });
  for (const r of plan.remove) {
    try {
      const st = lstatSync2(r.dir);
      if (!st.isDirectory() || dirname4(r.dir) !== root || real(r.dir) !== join5(real(root), r.id)) {
        result.kept.push({ id: r.id, why: "unknown" });
        continue;
      }
      const gone = `${r.dir}.tmp-rm-${randomUUID3().slice(0, 8)}`;
      renameSync3(r.dir, gone);
      result.removed.push(r.id);
      rmSync3(gone, { recursive: true, force: true });
    } catch (error2) {
      result.failed.push({ id: r.id, message: String(error2?.message ?? error2) });
    }
  }
  if (plan.remove.length || result.removed.length) {
    try {
      for (const name6 of readdirSync2(root)) {
        if (!/\.tmp-rm-[0-9a-f]{8}$/.test(name6)) continue;
        const path2 = join5(root, name6);
        try {
          if (lstatSync2(path2).isDirectory()) rmSync3(path2, { recursive: true, force: true });
        } catch {
        }
      }
    } catch {
    }
  }
  return result;
}

// src/host/service.ts
function packageRoot() {
  let dir = dirname5(fileURLToPath(import.meta.url));
  for (; ; ) {
    try {
      if (JSON.parse(readFileSync6(join6(dir, "package.json"), "utf8")).name === "dsh-layerfs") return dir;
    } catch {
    }
    const up = dirname5(dir);
    if (up === dir) return process.cwd();
    dir = up;
  }
}
function homeStateOf(got) {
  if (!got) return "unknown";
  if (got.state === "ready") return "current";
  if (got.state === "broken" && got.reason === "missing") return "missing";
  if (got.state === "broken" && got.reason === "outdated") return "outdated";
  return "unknown";
}
var modeOk = (mode) => typeof mode === "string" && /^0?[0-7]{3,4}$/.test(mode) ? (parseInt(mode, 8) & 63) === 0 : null;
var failedDiscovery = /* @__PURE__ */ new Map();
var mixedAllowed = () => process.env.DSH_LAYERFS_ALLOW_MIXED === "1";
var hasCall = (d, name6) => d.calls.some((c) => `${c.family}.${c.call}` === name6);
function pieceOf(path2, stamp, cli) {
  if (!path2) return null;
  return { path: path2, commit: stamp?.commit ?? null, dirty: stamp?.dirty ?? null, verdict: verdictOf(cli, stamp) };
}
var JsonFile = class {
  constructor(path2, initial) {
    this.path = path2;
    this.initial = initial;
  }
  path;
  initial;
  value;
  read() {
    if (this.value === void 0) {
      try {
        this.value = JSON.parse(readFileSync6(this.path, "utf8"));
      } catch {
        this.value = this.initial();
      }
    }
    return this.value;
  }
  write(next) {
    this.value = next;
    mkdirSync5(dirname5(this.path), { recursive: true });
    const tmp = `${this.path}.${process.pid}.tmp`;
    writeFileSync4(tmp, `${JSON.stringify(next, null, 2)}
`, { mode: 384 });
    renameSync4(tmp, this.path);
  }
  update(fn) {
    const draft = structuredClone(this.read());
    const next = fn(draft) ?? draft;
    this.write(next);
    return next;
  }
};
var abs = (v) => typeof v === "string" && isAbsolute3(v) ? v : void 0;
var LayerfsService = class extends Service {
  constructor(ctx, config = {}) {
    super(ctx, "layerfs");
    this.config = config;
    const dshHome = process.env.DSH_HOME ?? join6(homedir2(), ".dsh");
    this.root = abs(config.root) ?? join6(dshHome, "layerfs");
    this.callLog = join6(this.root, "trace", "calls.jsonl");
    this.projectSessionHome = abs(config.projectSessionHome) ?? abs(process.env.DSH_LAYERFS_SESSION_HOME) ?? join6(this.root, "project-sessions");
    this.home = abs(config.home) ?? abs(process.env.DSH_LAYERFS_HOME) ?? abs(process.env.LAYERFS_HOME) ?? join6(homedir2(), ".layerfs");
    this.secrets = abs(config.secrets) ?? abs(process.env.DSH_LAYERFS_SECRETS) ?? join6(this.home, "secret");
    this.jobDir = join6(this.home, "job");
    this.statDir = join6(this.home, "stat");
    this.scratchProject = config.scratchProject ?? "dsh-scratch/scratch";
    if (!/^[a-z0-9](?:[a-z0-9_.-]{0,61}[a-z0-9])?\/[a-z0-9](?:[a-z0-9_.-]{0,61}[a-z0-9])?$/.test(this.scratchProject)) {
      throw new Error(`dsh-layerfs: scratchProject must be "<store>/<name>" in LayerFS names, not ${JSON.stringify(this.scratchProject)}`);
    }
    this.checkpoints = config.checkpoints === "off" ? "off" : "turn";
    this.idleMinutes = Number.isFinite(config.idleMinutes) ? Math.max(0, Number(config.idleMinutes)) : 30;
    this.settings = new JsonFile(join6(this.root, "runtime.json"), () => ({}));
    this.resolvePin();
  }
  config;
  static inject = ["layerfsRemote"];
  root;
  /** The stand-in call log, `<root>/trace/calls.jsonl` (docs/specs/layerfs-logs.md §3). */
  callLog;
  projectSessionHome;
  home;
  /** The folder entered keys and passwords are saved in (see LayerfsConfig.secrets). */
  secrets;
  /** Storage job tables in the LayerFS home, named for no client: `<home>/job` (storage-jobs.json, doctor-jobs.json). */
  jobDir;
  /** Storage statistics in the LayerFS home: `<home>/stat` (storage-observations/, project-storage/). */
  statDir;
  scratchProject;
  checkpoints;
  idleMinutes;
  /** `<root>/runtime.json`: the CLI/daemon chosen in the UI (wins over env). */
  settings;
  pin;
  sdk;
  nativeRecorded;
  /** Set while an operation holds the whole home (a preset build or reset): why new Sandboxes must wait, or null. */
  exclusive;
  /** The LayerFS folder's last known state (the setup check); `outdated` closes the home gate. */
  homeState = null;
  /** Goes up when the folder changes under a running check (set up, moved aside) or the pin moves: older answers are stale. */
  homeGeneration = 0;
  /** The background parts run (startSetup): lease, watch, first check. */
  started = false;
  watcher;
  watchTimer;
  /** The `home get` in flight that tells the gate the folder's state. */
  homeLearn = null;
  /** The home set up in flight (one `home init`, or one `machine list` for an older CLI). */
  homeInit = null;
  /** What the setup check did to the folder while this host runs. */
  homeDid = null;
  /** The setup check in flight, shared by concurrent callers. */
  setupRead = null;
  lastSetup = null;
  /**
   * Starts the setup check's background parts (index.ts, once the plugin
   * runs; a service built in a test starts none of them): this host's pin
   * lease, the watch on `<home>/runtime`, and the first setup check, which
   * creates a missing LayerFS folder without asking.
   */
  startSetup() {
    if (this.started) return;
    this.started = true;
    leasePin(this.home, this.root, this.pin.cli);
    this.ctx.effect(() => () => {
      clearTimeout(this.watchTimer);
      this.watcher?.close();
      this.watcher = void 0;
    }, "dsh-layerfs: runtime watch");
    this.armWatch();
    const first = setTimeout(() => {
      void this.setup().catch(() => {
      });
    }, 0);
    first.unref();
    this.ctx.effect(() => () => clearTimeout(first), "dsh-layerfs: first setup check");
  }
  /**
   * Watches `<home>/runtime`, so a runtime the LayerFS app installs later is
   * picked up without a restart (when nothing else is pinned). Until that
   * folder exists (a first run) the setup check arms it again each time.
   */
  armWatch() {
    if (!this.started || this.watcher) return;
    try {
      const watcher = watch(runtimeRoot(this.home), () => {
        clearTimeout(this.watchTimer);
        this.watchTimer = setTimeout(() => {
          if (this.rescan()) void this.setup().catch(() => {
          });
        }, 1e3);
        this.watchTimer.unref();
      });
      watcher.unref();
      watcher.on("error", () => {
        watcher.close();
        if (this.watcher === watcher) this.watcher = void 0;
      });
      this.watcher = watcher;
    } catch {
    }
  }
  /**
   * When nothing pins a runtime but the home (or nothing at all), take the
   * newest runtime installed in the home now. Answers whether the pin moved.
   */
  rescan() {
    if (this.pin.source !== "home" && this.pin.source !== "none") return false;
    const newest = installedRuntimes(this.home)[0]?.cli ?? null;
    if (newest === this.pin.cli) return false;
    this.resolvePin();
    this.emit("runtime-changed");
    this.emit("setup-changed");
    return true;
  }
  resolvePin() {
    const saved = this.settings.read();
    const c = abs(this.config.cli), s = abs(saved.cli), e = abs(process.env.DSH_LAYERFS_CLI);
    const h = c || s || e ? void 0 : installedRuntimes(this.home)[0];
    const cli = c ?? s ?? e ?? h?.cli ?? null;
    const source = c ? "config" : s ? "settings" : e ? "env" : h ? "home" : "none";
    const daemon = (c ? abs(this.config.daemon) : s ? abs(saved.daemon) : e ? abs(process.env.DSH_LAYERFS_DAEMON) : h?.daemon) ?? null;
    const bundle = (c ? abs(this.config.bundle) : s ? abs(saved.bundle) : h ? h.bundle ?? void 0 : void 0) ?? abs(process.env.DSH_LAYERFS_BUNDLE) ?? abs(process.env.LAYERFS_BUNDLE) ?? null;
    const cc = abs(this.config.cacheHome), cs = abs(saved.cacheHome), ce = abs(process.env.DSH_LAYERFS_CACHE_HOME);
    const cacheHome = cc ?? cs ?? ce ?? null;
    const cacheHomeSource = cc ? "config" : cs ? "settings" : ce ? "env" : abs(process.env.XDG_CACHE_HOME) ? "inherited" : "default";
    this.pin = { cli, daemon, bundle, cacheHome, cacheHomeSource, source };
    this.sdk = void 0;
    this.homeState = null;
    this.homeGeneration = (this.homeGeneration ?? 0) + 1;
    this.nativeRecorded = void 0;
    if (this.started) leasePin(this.home, this.root, cli);
    if (cli) void hasNativeLogs(cli);
  }
  /** The SDK over the pinned CLI. Throws `CliUnavailable` when nothing is pinned. */
  get lfs() {
    if (!this.pin.cli) throw new CliError("CliUnavailable", "No LayerFS runtime is chosen yet. Open Set up LayerFS in Center, or set DSH_LAYERFS_CLI.", null, "unavailable");
    return this.sdk ??= client({ cli: this.pin.cli, home: this.home, bundle: this.pin.bundle, cacheHome: this.pin.cacheHome, callLog: this.callLog, gate: (call) => this.gate(call) });
  }
  /** The gate's refusal for a folder this LayerFS can't use as it is. */
  closed() {
    if (this.homeState === "outdated") return uninitialized(this.home, `The LayerFS folder ${this.home} was made by an older LayerFS, which this LayerFS does not convert: move it aside and make a new one (Set up LayerFS in Center shows how).`);
    if (this.homeState === "unknown") return uninitialized(this.home, `This LayerFS can't read the folder ${this.home}. Open Set up LayerFS in Center.`);
    return null;
  }
  /**
   * The home gate (cli.ts `CliSpec.gate`): an older LayerFS's folder (or one
   * that `home get` could not read) refuses every call `Uninitialized` until
   * the user moves it aside; a read on a missing folder sets it up first
   * (`home init`, or one `machine list` for an older CLI) and is refused
   * `Uninitialized` if it is still missing.
   */
  async gate(call) {
    if (this.homeState === null) await this.learnHome();
    const refused = this.closed();
    if (refused) {
      this.recheck();
      throw refused;
    }
    if (!call.read || existsSync7(join6(this.home, "layerfs.json"))) return;
    try {
      await this.ensureHome();
    } catch {
    }
    if (!existsSync7(join6(this.home, "layerfs.json"))) {
      this.recheck();
      throw this.closed() ?? uninitialized(this.home);
    }
  }
  /** After an `Uninitialized` refusal: the setup check again, at most every 2 s (the folder may have been set up elsewhere). */
  recheck() {
    if (this.setupRead || this.lastSetup && Date.now() - this.lastSetup.at < 2e3) return;
    void this.setup().catch(() => {
    });
  }
  /**
   * The folder's state from `home get` (one read shared by every caller).
   * A CLI with the home family whose `home get` fails leaves it `unknown`
   * (the gate refuses; nothing writes it by accident); an older CLI says
   * only whether `layerfs.json` is there. Never throws.
   */
  learnHome() {
    return this.homeLearn ??= (async () => {
      const generation = this.homeGeneration;
      let state = null;
      try {
        if (await this.homeCalls()) {
          try {
            state = homeStateOf(await this.lfs.home.get({ detail: true }));
          } catch {
            state = "unknown";
          }
        } else state = existsSync7(join6(this.home, "layerfs.json")) ? "current" : "missing";
      } catch {
      } finally {
        this.homeLearn = null;
      }
      if (generation === this.homeGeneration && this.homeState === null) this.homeState = state;
    })();
  }
  /** Whether the pinned CLI has `home init` and `home get`. */
  async homeCalls() {
    const d = await this.discovery();
    return hasCall(d, "home.get") && hasCall(d, "home.init");
  }
  /**
   * Sets a missing LayerFS folder up, once at a time: `home get` first (an
   * older LayerFS's folder is left alone), then `home init`; an
   * older CLI runs one `machine list` (outside the SDK's shared and kept
   * reads, which a gated poll may hold), which creates it as before.
   */
  ensureHome() {
    return this.homeInit ??= (async () => {
      try {
        if (await this.homeCalls()) {
          const got = await this.lfs.home.get({ detail: true });
          this.homeState = homeStateOf(got);
          if (this.homeState !== "missing") return;
          const did = await this.lfs.home.init({ detail: true });
          this.homeDid = { created: did?.outcome === "created", at: Date.now() };
        } else if (!existsSync7(join6(this.home, "layerfs.json"))) {
          await execute(this.lfs.spec, ["machine", "list", "--"], { read: true, gated: true, timeout: 3e4 });
          this.homeDid = { created: existsSync7(join6(this.home, "layerfs.json")), at: Date.now() };
        } else return;
        this.homeGeneration++;
        this.homeState = existsSync7(join6(this.home, "layerfs.json")) ? "current" : this.homeState;
        this.ctx.logger("layerfs").info("LayerFS folder %s set up", this.home);
        this.emit("setup-changed");
      } finally {
        this.homeInit = null;
      }
    })();
  }
  /**
   * `home init` (a refusal's `layerfs home init` fix): makes a missing
   * folder; LayerFS refuses an older LayerFS's folder (`Unsupported`, with
   * the fix that moves it aside), which this never touches. A check already
   * running read the folder before: it is waited for and a fresh one answers.
   */
  async initHome() {
    if (!await this.homeCalls()) throw new CliError("Unsupported", "This LayerFS runtime has no `home init`; choose a newer runtime");
    const did = await this.lfs.home.init({ detail: true });
    this.homeDid = { created: did?.outcome === "created", at: Date.now() };
    this.homeGeneration++;
    this.homeState = null;
    await this.setupRead?.catch(() => {
    });
    this.emit("setup-changed");
    return await this.setup();
  }
  /** Re-records this runtime's daemon on the native machine (the setup modal's fix for a daemon from another build). */
  async recordDaemon() {
    if (!this.pin.daemon) throw new CliError("InvalidInput", "This runtime has no native daemon to record");
    this.nativeRecorded = void 0;
    await this.ensureNative(true);
    this.emit("setup-changed");
    return await this.setup();
  }
  /**
   * The setup check (docs/specs/layerfs-setup.md §3): rescans the home's
   * runtimes, reads `home get` (creating a missing folder without asking),
   * and judges the pinned pieces against the CLI's build. Concurrent callers
   * share one check; a check that raced a conversion, a set up or a pin
   * change reads again. Never throws.
   */
  setup() {
    return this.setupRead ??= (async () => {
      for (let attempt = 0; ; attempt++) {
        const generation = this.homeGeneration;
        const answer = await this.readSetup(generation);
        if (generation === this.homeGeneration || attempt >= 2) return answer;
      }
    })().finally(() => {
      this.setupRead = null;
    });
  }
  /** The last setup check's answer, if any (no CLI call). */
  get lastSetupStatus() {
    return this.lastSetup;
  }
  async readSetup(generation) {
    this.rescan();
    this.armWatch();
    const runtime = await this.status();
    let homeCalls = false, got = null, error2 = null;
    if (runtime.ok) {
      try {
        homeCalls = await this.homeCalls();
        if (homeCalls) {
          got = await this.lfs.home.get({ detail: true });
          if (homeStateOf(got) === "missing") {
            await this.ensureHome();
            got = await this.lfs.home.get({ detail: true });
          }
        } else if (!existsSync7(join6(this.home, "layerfs.json"))) await this.ensureHome();
      } catch (e) {
        error2 = { code: e?.code ?? "Failed", message: String(e?.message ?? e) };
      }
    }
    const state = got ? homeStateOf(got) : homeCalls || runtime.ok && error2 ? "unknown" : existsSync7(join6(this.home, "layerfs.json")) ? "current" : "missing";
    if (generation === this.homeGeneration) this.homeState = runtime.ok ? state : null;
    const identity2 = runtime.ok && this.pin.cli ? knownIdentity(this.pin.cli) : null;
    const cliStamp = identity2 ? { commit: identity2.commit, dirty: identity2.dirty } : null;
    const cli = this.pin.cli ? { path: this.pin.cli, commit: cliStamp?.commit ?? null, dirty: cliStamp?.dirty ?? null, verdict: !cliStamp ? "unknown" : cliStamp.dirty === false ? "matches" : "unknown" } : null;
    const judged = (matches2) => matches2 === true ? "matches" : matches2 === false ? "other" : "unknown";
    const bundle = got?.bundle ? got.bundle.present ? { path: got.bundle.path, commit: got.bundle.commit, dirty: got.bundle.dirty, verdict: judged(got.bundle.matches) } : { path: got.bundle.path, commit: null, dirty: null, verdict: "missing" } : pieceOf(this.pin.bundle, bundleStamp(this.pin.bundle), cliStamp);
    const daemon = process.platform !== "darwin" ? null : got?.daemon ? got.daemon.present === false ? { path: got.daemon.path, commit: null, dirty: null, verdict: "missing" } : { path: got.daemon.path, commit: got.daemon.commit, dirty: got.daemon.dirty ?? null, verdict: judged(got.daemon.matches) } : this.pin.daemon ? pieceOf(this.pin.daemon, daemonStamp(this.pin.daemon), cliStamp) : { path: null, commit: null, dirty: null, verdict: "missing" };
    const needs = [];
    if (!runtime.ok) needs.push("runtime");
    else if (state !== "current") needs.push("folder");
    if (runtime.ok && !mixedAllowed() && [bundle, daemon].some((p) => p?.verdict === "other")) needs.push("build");
    const answer = {
      at: Date.now(),
      runtime,
      homeCalls,
      folder: {
        path: this.home,
        state,
        layout: got?.layout ?? null,
        mode: got?.mode ?? null,
        modeOk: modeOk(got?.mode),
        did: this.homeDid,
        ...got && got.state !== "ready" ? { message: got.message ?? null, fix: got.fix ?? null } : {}
      },
      pieces: { cli, daemon, bundle },
      // a home that is not ready: LayerFS's sentence and its fix (2.0 has no warnings list; `home doctor` reports the rest)
      warnings: got && got.state !== "ready" && got.message ? [{ code: got.reason ?? got.state, message: got.fix ? `${got.message} (${got.fix})` : got.message }] : [],
      needs,
      mixedAllowed: mixedAllowed(),
      error: error2,
      // only when the recorded one is gone or from another build (a same-build copy elsewhere is fine), and ours is not
      daemonRecordable: process.platform === "darwin" && !!this.pin.daemon && !!daemon?.path && daemon.path !== this.pin.daemon && (daemon.verdict === "other" || daemon.verdict === "missing") && verdictOf(cliStamp, daemonStamp(this.pin.daemon)) !== "other"
    };
    this.lastSetup = answer;
    return answer;
  }
  /** The runtimes installed in the LayerFS home, newest first, each judged (`runtime.installed`). */
  async installed() {
    const sdkDir = this.sdkDir();
    const runtimes = await Promise.all(installedRuntimes(this.home).map(async (r) => {
      let d = null, error2 = null;
      const failedKey = `${r.cli}:${r.at}`;
      if (failedDiscovery.has(failedKey)) error2 = failedDiscovery.get(failedKey);
      else try {
        d = await discover({ cli: r.cli });
      } catch (e) {
        error2 = String(e?.message ?? e);
        failedDiscovery.set(failedKey, error2);
      }
      const stamp = d ? { commit: d.identity.commit, dirty: d.identity.dirty } : null;
      return {
        id: r.id,
        cli: r.cli,
        daemon: r.daemon,
        bundle: r.bundle,
        at: r.at,
        version: d?.identity.version ?? null,
        commit: stamp?.commit ?? null,
        dirty: stamp?.dirty ?? null,
        homeCalls: !!d && hasCall(d, "home.get") && hasCall(d, "home.init"),
        pieces: {
          daemon: process.platform === "darwin" ? pieceOf(r.daemon, daemonStamp(r.daemon), stamp) ?? { path: null, commit: null, dirty: null, verdict: "missing" } : null,
          bundle: pieceOf(r.bundle, bundleStamp(r.bundle), stamp) ?? { path: null, commit: null, dirty: null, verdict: "missing" }
        },
        sdk: !!(stamp?.commit && findSdk(sdkDir, stamp.commit)),
        active: r.cli === this.pin.cli,
        error: error2
      };
    }));
    return { runtimes, pinned: this.pin.cli, source: this.pin.source, root: runtimeRoot(this.home) };
  }
  /** Whether every worker machine (docker, Lima, Apple Container) is stopped, so none has a bundle mounted; false when unknown. */
  async workersIdle() {
    try {
      if (!this.pin.cli || !existsSync7(join6(this.home, "layerfs.json"))) return true;
      return (await machineRows(this.lfs, { timeout_ms: 15e3 })).every((m) => m.platform === "native" || m.state === "stopped");
    } catch {
      return false;
    }
  }
  /**
   * `<root>/agent-bin/layerfs`, the managed CLI agent shells run (rewritten when
   * the pin or the call log source changes), or null when nothing is pinned.
   */
  agentCli() {
    const cli = this.pin.cli;
    if (!cli) return null;
    const native = knownNativeLogs(cli);
    if (native === void 0) void hasNativeLogs(cli);
    return managedCli({ root: this.root, cli, home: this.home, bundle: this.pin.bundle, cacheHome: this.pin.cacheHome, callLog: this.callLog, native: native ?? false, bools: boolOptions(cli) });
  }
  /**
   * `<root>/agent-bin/sdk.mjs`, the LayerFS Node SDK agent shells import as
   * `$DSH_LAYERFS_SDK`, or null when no SDK built from the pinned CLI's commit is
   * installed (`DSH_LAYERFS_SDK_DIR`, else `.layerfs-sdk/<commit>/` in this
   * package; `scripts/install-sdk.mjs`) or the CLI is not discovered yet.
   */
  agentSdk() {
    const cli = this.pin.cli;
    if (!cli) return null;
    const commit = knownIdentity(cli)?.commit;
    if (!commit) {
      void discover({ cli }).catch(() => {
      });
      return null;
    }
    const sdk = findSdk(this.sdkDir(), commit);
    if (!sdk) return null;
    const native = knownNativeLogs(cli);
    if (native === void 0) void hasNativeLogs(cli);
    return managedSdk({ root: this.root, sdk, home: this.home, bundle: this.pin.bundle, cacheHome: this.pin.cacheHome, callLog: this.callLog, native: native ?? false, bools: boolOptions(cli) });
  }
  /** Where Node SDK installs are looked for (`<dir>/<commit>/`, or `<dir>` itself): `DSH_LAYERFS_SDK_DIR`, else `.layerfs-sdk/` in this package. */
  sdkDir() {
    return process.env.DSH_LAYERFS_SDK_DIR || join6(packageRoot(), ".layerfs-sdk");
  }
  /** Whether the pinned CLI keeps LayerFS's own call log (else the plugin's stand-in). */
  async nativeLogs() {
    return !!this.pin.cli && await hasNativeLogs(this.pin.cli);
  }
  /** The pinned CLI path, if any. */
  get cli() {
    return this.pin.cli;
  }
  /** The pinned daemon path, if any. */
  get daemon() {
    return this.pin.daemon;
  }
  /** The pinned Linux bundle folder, if any. */
  get bundle() {
    return this.pin.bundle;
  }
  /** The pinned XDG cache home for prepared machine images, if any (else the CLI inherits the host's). */
  get cacheHome() {
    return this.pin.cacheHome;
  }
  /** The cache home the CLI actually reads: the pin, else the host's XDG_CACHE_HOME, else `~/.cache`. */
  effectiveCacheHome() {
    return this.pin.cacheHome ?? abs(process.env.XDG_CACHE_HOME) ?? join6(homedir2(), ".cache");
  }
  /** How many prepared VM OS images the effective cache home holds. */
  preparedImages() {
    const root = join6(this.effectiveCacheHome(), "layerfs", "machine-images");
    const dirs = (p) => {
      try {
        return readdirSync3(p).filter((n2) => statSync5(join6(p, n2)).isDirectory());
      } catch {
        return [];
      }
    };
    let n = 0;
    for (const provider of dirs(root)) {
      if (provider === "objects" || provider === "builds") continue;
      for (const platform2 of dirs(join6(root, provider))) for (const image of dirs(join6(root, provider, platform2))) if (existsSync7(join6(root, provider, platform2, image, "current.json"))) n++;
    }
    return n;
  }
  bundleInfo() {
    if (!this.pin.bundle) return null;
    try {
      const b = JSON.parse(readFileSync6(join6(this.pin.bundle, "bundle.json"), "utf8"));
      return { hash: typeof b.hash === "string" ? b.hash : null, source: typeof b.source?.head === "string" ? b.source.head : null };
    } catch {
      return { hash: null, source: null };
    }
  }
  /** Discovery for the pinned CLI. */
  async discovery(fresh = false) {
    return await discover({ cli: this.lfs.spec.cli }, fresh);
  }
  /**
   * Before calls that need the native machine (macOS): record the pinned daemon
   * on `native` when none, or a missing one, is recorded; after a runtime
   * change (`moved`), whenever another one is recorded. Never throws.
   */
  ensureNative(moved = false) {
    if (this.nativeRecorded) return this.nativeRecorded;
    let failed = false;
    const attempt = (async () => {
      if (process.platform !== "darwin" || !this.pin.cli || !this.pin.daemon) return;
      try {
        const recorded = existsSync7(join6(this.home, "layerfs.json")) ? (await this.lfs.machine.get("native", { detail: true })).daemon ?? null : null;
        if (recorded && existsSync7(recorded) && (!moved || recorded === this.pin.daemon)) return;
        await this.lfs.machine.update("native", { daemon: this.pin.daemon });
      } catch (error2) {
        failed = true;
        this.ctx.logger("layerfs").warn("native daemon not recorded: %s", error2?.message ?? error2);
      }
    })();
    this.nativeRecorded = attempt;
    void attempt.then(() => {
      if (failed && this.nativeRecorded === attempt) this.nativeRecorded = void 0;
    });
    return attempt;
  }
  persistenceKind() {
    const persistence = this.ctx.get("sessionPersistence");
    return !persistence ? "none" : persistence.local ? "layerfs" : "stock";
  }
  /** Runtime facts for the UI. */
  async status() {
    const base = {
      cli: this.pin.cli,
      daemon: this.pin.daemon,
      bundle: this.pin.bundle,
      bundleInfo: this.bundleInfo(),
      cacheHome: this.effectiveCacheHome(),
      cacheHomeSource: this.pin.cacheHomeSource,
      preparedImages: this.preparedImages(),
      home: this.home,
      root: this.root,
      projectSessionHome: this.projectSessionHome,
      source: this.pin.source,
      scratchProject: this.scratchProject,
      checkpoints: this.checkpoints,
      sessionPersistence: this.persistenceKind()
    };
    try {
      const d = await this.discovery();
      const sdkDir = this.sdkDir(), sdk = findSdk(sdkDir, d.identity.commit);
      return { ...base, ok: true, version: d.identity.version, commit: d.identity.commit, features: d.identity.features, sdk: sdk && { dir: sdk.dir, commit: sdk.commit }, sdkDir, error: null };
    } catch (error2) {
      return { ...base, ok: false, version: null, commit: null, features: [], sdk: null, sdkDir: null, error: { code: error2?.code ?? "Failed", message: String(error2?.message ?? error2) } };
    }
  }
  /**
   * Save a new CLI/daemon pin (or clear it with nulls) and switch to it.
   * The new CLI is discovered first; an incompatible one is refused unchanged.
   * The CLI, daemon and bundle are installed into the LayerFS home
   * (`<home>/runtime/<version>-<sha>`) and the pin names those copies.
   * `cacheHome` (the prepared machine image cache) is saved as given; left out,
   * the saved one is kept, except when the pin is cleared.
   */
  async savePin(given) {
    let next = given;
    if (given.runtime) {
      const r = installedRuntimes(this.home).find((x) => x.id === given.runtime);
      if (!r) throw new CliError("InvalidInput", `No runtime ${given.runtime} is installed in ${runtimeRoot(this.home)}`);
      next = { cli: r.cli, daemon: r.daemon, bundle: r.bundle, ...given.cacheHome !== void 0 ? { cacheHome: given.cacheHome } : {} };
    }
    if (next.cacheHome && (!abs(next.cacheHome) || !existsSync7(next.cacheHome) || !statSync5(next.cacheHome).isDirectory())) throw new CliError("InvalidInput", "The machine image cache must be an absolute path to an existing folder");
    const cacheHome = next.cacheHome !== void 0 ? next.cacheHome : next.cli === null ? null : this.settings.read().cacheHome ?? null;
    let pin = next;
    if (next.cli !== null) {
      if (!abs(next.cli) || !existsSync7(next.cli)) throw new CliError("InvalidInput", "The CLI must be an absolute path to an existing file");
      if (next.daemon !== null && (!abs(next.daemon) || !existsSync7(next.daemon))) throw new CliError("InvalidInput", "The daemon must be an absolute path to an existing file");
      if (next.bundle && (!abs(next.bundle) || !existsSync7(join6(next.bundle, "bundle.json")))) throw new CliError("InvalidInput", "The Linux bundle must be an absolute folder holding bundle.json");
      const found = await discover({ cli: next.cli }, true);
      const stamp = { commit: found.identity.commit, dirty: found.identity.dirty };
      const other = [
        ...next.daemon && verdictOf(stamp, daemonStamp(next.daemon)) === "other" ? [`the daemon (${daemonStamp(next.daemon)?.commit?.slice(0, 8)})`] : [],
        ...next.bundle && verdictOf(stamp, bundleStamp(next.bundle)) === "other" ? [`the Linux bundle (${bundleStamp(next.bundle)?.commit?.slice(0, 8)})`] : []
      ];
      if (other.length && !mixedAllowed()) {
        throw new CliError("MixedBuild", `The CLI was built from ${found.identity.commit.slice(0, 8)}, but ${other.join(" and ")} from another commit. Choose pieces from one build (DSH_LAYERFS_ALLOW_MIXED=1 allows this in development).`, { cli: found.identity.commit, other });
      }
      try {
        pin = installRuntime(this.home, found.identity.version, { cli: next.cli, daemon: next.daemon, bundle: next.bundle ?? null }, { replaceBundle: !!next.bundle && await this.workersIdle() });
      } catch (error2) {
        throw new CliError(error2?.code === "InvalidInput" ? "InvalidInput" : "Failed", `Could not install the runtime into the LayerFS home: ${error2?.message ?? error2}`);
      }
    }
    this.settings.write({ ...pin.cli === null ? {} : { cli: pin.cli, ...pin.daemon ? { daemon: pin.daemon } : {}, ...pin.bundle ? { bundle: pin.bundle } : {} }, ...cacheHome ? { cacheHome } : {} });
    this.resolvePin();
    if (pin.daemon) await this.ensureNative(true);
    this.emit("runtime-changed");
    this.emit("setup-changed");
    if (pin.cli !== null) void this.cleanRuntimes();
    return await this.status();
  }
  /**
   * Removes old runtime folders from `<home>/runtime` (layerfs-project#180).
   * Kept: the pinned one (this host's pin, its saved pin and the environment's),
   * the newest few, any a machine record names (`machine.list()`), any a running
   * process was started from, and every one with a Linux bundle unless all
   * worker machines are stopped (LayerFS does not report which bundle folder a
   * running docker worker has mounted). When `machine.list()` or the process
   * list cannot be read nothing is removed. Never throws.
   */
  async cleanRuntimes() {
    const saved = this.settings.read();
    const pinned = [
      this.pin.cli,
      this.pin.daemon,
      this.pin.bundle,
      saved.cli,
      saved.daemon,
      saved.bundle,
      this.config.cli,
      this.config.daemon,
      this.config.bundle,
      process.env.DSH_LAYERFS_CLI,
      process.env.DSH_LAYERFS_DAEMON,
      process.env.DSH_LAYERFS_BUNDLE,
      process.env.LAYERFS_BUNDLE
    ];
    let machines = null;
    try {
      if (this.pin.cli && existsSync7(join6(this.home, "layerfs.json"))) machines = await this.lfs.machine.list({ timeout_ms: 15e3, detail: true });
    } catch {
      machines = null;
    }
    const result = cleanRuntimes(this.home, { pinned, machines, processes: runningCommands() });
    const logger = this.ctx.logger("layerfs");
    if (result.removed.length) logger.info("removed %d unused LayerFS runtime folder(s): %s", result.removed.length, result.removed.join(", "));
    for (const f of result.failed) logger.warn("runtime folder %s not removed: %s", f.id, f.message);
    return result;
  }
  /** Publish a host event to connected clients (the `layerfs/events` stream). */
  emit(type, data) {
    this.ctx.get("layerfsRemote")?.emit(type, data === void 0 ? void 0 : plain(data));
  }
  /** The `layerfs` Remote, for modules registering operations. */
  get remote() {
    return this.ctx.layerfsRemote;
  }
};

// src/host/routes/index.ts
var routes_exports = {};
__export(routes_exports, {
  apply: () => apply2,
  inject: () => inject2,
  name: () => name2
});

// src/host/logs/index.ts
var logs_exports = {};
__export(logs_exports, {
  apply: () => apply,
  inject: () => inject,
  label: () => label,
  listPage: () => listPage,
  name: () => name,
  receiptLine: () => receiptLine,
  sessionOfTag: () => sessionOfTag
});
import { mkdirSync as mkdirSync6, watch as watch2 } from "node:fs";
import { dirname as dirname6, join as join7 } from "node:path";

// src/host/logs/source.ts
function listArgs(raw) {
  const text6 = (v) => typeof v === "string" && v ? v : void 0;
  const args = {};
  for (const key of ["cursor", "op", "project", "tag", "outcome"]) {
    const v = text6(raw?.[key]);
    if (v) args[key] = v;
  }
  if (["cli", "node", "python", "rust"].includes(raw?.client)) args.client = raw.client;
  if (Number.isFinite(raw?.limit)) args.limit = Math.max(1, Math.min(1e3, Math.floor(raw.limit)));
  if (Number.isFinite(raw?.since)) args.since = Math.floor(raw.since);
  if (raw?.writes === true) args.writes = true;
  return args;
}
function lineOfItem(item) {
  const at = typeof item?.logged_at === "string" ? Date.parse(item.logged_at) : NaN;
  if (!Number.isFinite(at) || !Array.isArray(item?.argv)) return null;
  const word2 = typeof item.outcome === "string" ? item.outcome : "ok";
  const refused = word2 === "refused" || typeof item.error === "string" && item.error;
  return {
    v: 1,
    at,
    ms: Number.isFinite(item.duration_ms) ? Number(item.duration_ms) : 0,
    client: ["cli", "node", "python", "rust"].includes(item.client) ? item.client : "cli",
    argv: item.argv.map(String),
    outcome: refused ? String(item.error ?? "Failed") : "ok",
    ...!refused && word2 !== "ok" ? { kind: word2 } : {},
    ...typeof item.commit === "string" && item.commit ? { commit: item.commit } : {},
    ...typeof item.tag === "string" && item.tag ? { tag: item.tag } : {}
  };
}
async function readCalls(layerfs, args) {
  if (!await layerfs.nativeLogs()) return { ...listCalls(layerfs.callLog, args), source: "plugin" };
  const entry = (await layerfs.discovery()).calls.find((c) => c.family === "home" && c.call === "log");
  const accepted = new Set(entry?.options.map((o) => o.name) ?? []);
  const limit = args.limit ?? 100;
  const local = { ...args.project ? { project: args.project } : {}, ...args.writes ? { writes: true } : {} };
  const native = {};
  for (const [key, option] of [["op", "call"], ["client", "client"], ["tag", "tag"], ["outcome", "outcome"], ["since", "since"]]) {
    if (args[key] === void 0) continue;
    if (accepted.has(option)) native[option] = args[key];
    else local[key] = args[key];
  }
  const filtered = Object.keys(local).length > 0;
  const lines2 = [];
  let cursor = args.cursor, has_more = false, skipped = 0;
  for (let round = 0; round < 50; round++) {
    let page;
    try {
      page = await layerfs.lfs.home.log({ ...native, ...cursor ? { cursor } : {}, limit: limit - lines2.length, detail: true });
    } catch (error2) {
      if ((error2?.code === "Unavailable" || error2?.code === "Uninitialized" || error2?.code === "NotFound") && !cursor) return { lines: [], has_more: false, skipped: 0, source: "layerfs" };
      throw error2;
    }
    skipped += Number(page?.skipped ?? 0);
    for (const item of page?.items ?? []) {
      const line = lineOfItem(item);
      if (!line) {
        skipped++;
        continue;
      }
      if (!filtered || matches(line, local)) lines2.push(line);
    }
    has_more = typeof page?.next_cursor === "string" && !!page.next_cursor;
    cursor = has_more ? page.next_cursor : void 0;
    if (!has_more || lines2.length >= limit) break;
  }
  return { lines: lines2, ...has_more && cursor ? { next: cursor } : {}, has_more, skipped, source: "layerfs" };
}
async function resetCalls2(layerfs) {
  if (!await layerfs.nativeLogs()) {
    const answer2 = resetCalls(layerfs.callLog);
    clearOutputs(outputsDir(layerfs.callLog));
    return answer2;
  }
  const answer = await layerfs.lfs.home.clear_log({ detail: true });
  clearOutputs(outputsDir(layerfs.callLog));
  return { removed: Number(answer?.line_count ?? 0) };
}
async function callsSince(layerfs, prefix, since) {
  const all = [];
  let cursor;
  for (let round = 0; round < 20; round++) {
    const page = await readCalls(layerfs, { tag: prefix, since, limit: 1e3, ...cursor ? { cursor } : {} });
    all.push(...page.lines);
    if (!page.has_more || !page.next) break;
    cursor = page.next;
  }
  return all;
}
var PROJECT_SCAN = 1e4;
async function projectCalls(layerfs, project, known4, limit = 500, scan = PROJECT_SCAN) {
  const sandboxes = new Set(known4);
  const lines2 = [];
  let cursor, scanned = 0, has_more = false, source = "plugin";
  const sandboxOf3 = (argv) => {
    if (argv[0] !== "workspace" && argv[0] !== "sandbox") return void 0;
    const first = argv[2];
    if (!first || first.includes("/")) return void 0;
    const colon = first.indexOf(":");
    return colon > 0 ? first.slice(0, colon) : first;
  };
  const candidates = [];
  while (scanned < scan) {
    const page = await readCalls(layerfs, { limit: Math.min(1e3, scan - scanned), ...cursor ? { cursor } : {} });
    source = page.source;
    scanned += page.lines.length;
    for (const line of page.lines) {
      const argv = line.argv;
      if (!parseTag(line.tag) && !isWrite(argv)) continue;
      if (argv[0] === "sandbox" && argv[1] === "create" && argv[2] === project && argv[3]) sandboxes.add(argv[3]);
      if (projectOf(argv) === project) candidates.push({ line });
      else {
        const sandbox = sandboxOf3(argv);
        if (sandbox) candidates.push({ line, sandbox });
      }
    }
    has_more = page.has_more && !!page.next;
    if (!has_more) break;
    cursor = page.next;
  }
  for (const c of candidates) {
    if (c.sandbox && !sandboxes.has(c.sandbox)) continue;
    lines2.push(c.line);
    if (lines2.length >= limit) break;
  }
  return { lines: lines2, source, scanned, has_more };
}

// src/host/logs/index.ts
var COMPACT_MS = 1e4;
var name = "dsh-layerfs-logs";
var inject = ["layerfs", "layerfsRemote"];
async function facts(ctx, sessionId) {
  const persistence = ctx.get("sessionPersistence");
  const sessions = ctx.get("layerfsSessions");
  const sidecar = await Promise.resolve(persistence?.readSidecar?.(sessionId)).catch(() => void 0);
  const local = sessions?.checkpoints?.(sessionId);
  const live = ctx.get("sessions")?.get?.(sessionId);
  let title;
  try {
    const titles = live?.snapshotEvents?.(0)?.filter((e) => e.type === "session/title" && typeof e.data?.title === "string") ?? [];
    title = titles.at(-1)?.data.title;
  } catch {
  }
  title ??= typeof sidecar?.title === "string" ? sidecar.title : void 0;
  return {
    ...title ? { title } : {},
    invocations: Array.isArray(sidecar?.invocations) ? sidecar.invocations : [],
    checkpoints: local?.length ? local : Array.isArray(sidecar?.checkpoints) ? sidecar.checkpoints : []
  };
}
var checkpointLabel = (c, saved) => ({ kind: c.kind, turn: c.turn, changed: c.changed, saved });
async function label(ctx, lines2, outputs) {
  const cache = /* @__PURE__ */ new Map();
  const of = (id) => {
    let f = cache.get(id);
    if (!f) cache.set(id, f = facts(ctx, id));
    return f;
  };
  let byVersion;
  const versions = () => {
    if (byVersion) return byVersion;
    byVersion = /* @__PURE__ */ new Map();
    const all = ctx.get("layerfsSessions")?.state?.read?.().checkpoints ?? {};
    for (const [sessionId, list4] of Object.entries(all)) {
      for (const checkpoint of list4 ?? []) {
        if (!checkpoint?.commit) continue;
        const known4 = byVersion.get(checkpoint.commit);
        if (!known4 || known4.checkpoint.changed <= 0 && checkpoint.changed > 0) byVersion.set(checkpoint.commit, { sessionId, checkpoint });
      }
    }
    return byVersion;
  };
  const out = [];
  const stored = (line) => outputs && isDshTag(line.tag) && hasOutput(outputs, line.tag) ? { output: true } : {};
  for (const line of lines2) {
    const tag = parseTag(line.tag);
    if (tag) {
      const f = await of(tag.sessionId);
      const receipt = f.invocations.find((i) => i?.id === tag.receiptId);
      const checkpoint = f.checkpoints.find((c) => c.receipt === tag.receiptId);
      const turn = Number.isInteger(receipt?.turn) ? receipt.turn : checkpoint?.turn;
      const dsh = {
        sessionId: tag.sessionId,
        match: "tag",
        ...f.title ? { title: f.title } : {},
        ...receipt?.origin === "tool" || receipt?.origin === "host" ? { origin: receipt.origin } : checkpoint ? { origin: "host" } : {},
        ...Number.isInteger(turn) ? { turn } : {},
        ...typeof receipt?.toolCallId === "string" ? { toolCallId: receipt.toolCallId } : {},
        ...typeof receipt?.step?.runId === "string" && typeof receipt?.step?.stepKey === "string" ? { step: { runId: receipt.step.runId, stepKey: receipt.step.stepKey } } : {},
        ...checkpoint ? { checkpoint: checkpointLabel(checkpoint, !!checkpoint.commit && checkpoint.changed > 0) } : {}
      };
      out.push({ ...line, dsh, ...stored(line) });
      continue;
    }
    const sim = parseSimTag(line.tag);
    if (sim) {
      const sessionId = simulationRoot(ctx, sim.runId);
      out.push({ ...line, sim: { ...sim, ...sessionId ? { sessionId } : {} }, ...stored(line) });
      continue;
    }
    const version2 = line.commit ?? line.layer;
    const hit = version2 ? versions().get(version2) : void 0;
    if (hit) {
      const f = await of(hit.sessionId);
      out.push({ ...line, dsh: { sessionId: hit.sessionId, match: "commit", ...f.title ? { title: f.title } : {}, turn: hit.checkpoint.turn, checkpoint: checkpointLabel(hit.checkpoint, false) }, ...stored(line) });
      continue;
    }
    out.push({ ...line, ...stored(line) });
  }
  return out;
}
function simulationRoot(ctx, runId) {
  try {
    const state = ctx.get("layerfsSessions")?.state?.read?.();
    for (const [id, binding] of Object.entries(state?.sessions ?? {})) {
      if (binding?.simulation?.runId === runId && !binding.simulation.rootSessionId) return id;
    }
  } catch {
  }
  return void 0;
}
function sessionOfTag(tag) {
  if (tag?.startsWith(TAG_PREFIX) && tag.endsWith(":")) {
    const id = tag.slice(TAG_PREFIX.length, -1);
    return id && id !== HOST_SESSION && !id.includes(":") ? id : void 0;
  }
  return parseTag(tag)?.sessionId;
}
function receiptLine(receipt) {
  if (!receipt || typeof receipt !== "object" || typeof receipt.id !== "string" || typeof receipt.sessionId !== "string" || !Number.isFinite(receipt.at)) return void 0;
  const words = Array.isArray(receipt.argv) && receipt.argv.length >= 2 && receipt.argv.every((w) => typeof w === "string") ? receipt.argv : void 0;
  const [family, call] = String(receipt.operation ?? "").split(".");
  const argv = words ?? (family && call ? [family, call.replaceAll("_", "-")] : void 0);
  if (!argv) return void 0;
  const version2 = Array.isArray(receipt.versions) ? receipt.versions.find((v) => v && typeof v.id === "string") : void 0;
  const outcome2 = receipt.outcome === "success" ? "ok" : typeof receipt.code === "string" && receipt.code ? receipt.code : receipt.outcome === "unknown" ? "Unknown" : "Failed";
  return {
    v: 1,
    at: receipt.at,
    ms: Number.isFinite(receipt.ms) ? Math.max(0, receipt.ms) : 0,
    client: "cli",
    argv,
    outcome: outcome2,
    ...typeof receipt.kind === "string" ? { kind: receipt.kind } : {},
    ...version2?.kind === "Commit" ? { commit: version2.id } : version2?.kind === "Layer" ? { layer: version2.id } : {},
    tag: typeof receipt.tag === "string" && receipt.tag ? receipt.tag : sessionTag(receipt.sessionId, receipt.id)
  };
}
var RECEIPT_CURSOR = "receipt:";
async function importedLines(ctx, sessionId, args) {
  const persistence = ctx.get("sessionPersistence");
  const sidecar = await Promise.resolve(persistence?.readSidecar?.(sessionId)).catch(() => void 0);
  const rows2 = (Array.isArray(sidecar?.invocations) ? sidecar.invocations : []).filter((r) => r?.imported === true && r.sessionId === sessionId);
  if (!rows2.length) return [];
  const { cursor: _cursor, limit: _limit, ...filters } = args;
  const lines2 = rows2.map(receiptLine).filter((line) => !!line && matches(line, filters));
  if (!lines2.length) return [];
  const local = new Set((await callsSince(ctx.layerfs, `${TAG_PREFIX}${sessionId}:`, 0).catch(() => [])).map((line) => line.tag));
  return lines2.filter((line) => !local.has(line.tag)).sort((a, b) => b.at - a.at);
}
async function listPage(ctx, args) {
  const sessionId = sessionOfTag(args.tag);
  const limit = args.limit ?? 100;
  if (args.cursor?.startsWith(RECEIPT_CURSOR)) {
    const from = Number(args.cursor.slice(RECEIPT_CURSOR.length));
    if (!sessionId || !Number.isInteger(from) || from < 0) throw Object.assign(new Error("The log cursor is not valid; list from the start"), { code: "InvalidInput" });
    const all2 = await importedLines(ctx, sessionId, args);
    const lines3 = all2.slice(from, from + limit), more2 = from + lines3.length < all2.length;
    const source = await ctx.layerfs.nativeLogs() ? "layerfs" : "plugin";
    return { page: { lines: lines3, ...more2 ? { next: `${RECEIPT_CURSOR}${from + lines3.length}` } : {}, has_more: more2, skipped: 0, source }, receipts: lines3.length };
  }
  const page = await readCalls(ctx.layerfs, args);
  if (!sessionId || page.has_more) return { page, receipts: 0 };
  const all = await importedLines(ctx, sessionId, args);
  if (!all.length) return { page, receipts: 0 };
  const lines2 = all.slice(0, Math.max(0, limit - page.lines.length)), more = lines2.length < all.length;
  return { page: { ...page, lines: [...page.lines, ...lines2], ...more ? { next: `${RECEIPT_CURSOR}${lines2.length}` } : {}, has_more: more }, receipts: lines2.length };
}
function apply(ctx) {
  let timer, dirty = false;
  const fire = () => {
    if (timer) {
      dirty = true;
      return;
    }
    ctx.layerfs.emit(LOGS_EVENT, { at: Date.now() });
    timer = setTimeout(() => {
      timer = void 0;
      if (dirty) {
        dirty = false;
        fire();
      }
    }, 1e3);
    timer.unref?.();
  };
  ctx.effect(() => () => {
    clearTimeout(timer);
    timer = void 0;
  }, "dsh-layerfs: logs event");
  ctx.effect(() => onCallLogAppend(ctx.layerfs.callLog, fire), "dsh-layerfs: logs appends");
  ctx.effect(() => {
    try {
      mkdirSync6(dirname6(ctx.layerfs.callLog), { recursive: true, mode: 448 });
      const watcher = watch2(dirname6(ctx.layerfs.callLog), (_event, file) => {
        if (!file || String(file).startsWith("calls")) fire();
      });
      watcher.on("error", () => {
      });
      watcher.unref?.();
      return () => watcher.close();
    } catch {
      return () => {
      };
    }
  }, "dsh-layerfs: logs watch");
  const outputs = outputsDir(ctx.layerfs.callLog);
  let compactedAt = 0;
  let pending2;
  const ended = (file) => {
    const name6 = String(file ?? "");
    if (name6 && !name6.endsWith(".exit") && !name6.endsWith(".json")) return;
    fire();
    if (name6.endsWith(".json") || pending2) return;
    const wait = Math.max(RAW_SETTLE_MS + 500, compactedAt + COMPACT_MS - Date.now());
    pending2 = setTimeout(() => {
      pending2 = void 0;
      compactedAt = Date.now();
      compactRaw(outputs);
    }, wait);
    pending2.unref?.();
  };
  ctx.effect(() => {
    const watchers = [];
    for (const dir of [outputs, join7(outputs, RAW_DIR)]) {
      try {
        mkdirSync6(dir, { recursive: true, mode: 448 });
        const watcher = watch2(dir, (_event, file) => ended(file));
        watcher.on("error", () => {
        });
        watcher.unref?.();
        watchers.push(watcher);
      } catch {
      }
    }
    compactRaw(outputs);
    return () => {
      for (const watcher of watchers) watcher.close();
      clearTimeout(pending2);
      pending2 = void 0;
    };
  }, "dsh-layerfs: outputs watch");
  ctx.layerfsRemote.operate(ctx, {
    "logs.list": async (args) => {
      const { page, receipts } = await listPage(ctx, listArgs(args));
      const lines2 = await label(ctx, page.lines, outputsDir(ctx.layerfs.callLog));
      const from = lines2.length - receipts;
      return { ...page, lines: lines2.map((line, index) => index >= from ? { ...line, source: "receipt" } : line) };
    },
    "logs.project": async (args) => {
      const project = typeof args?.project === "string" ? args.project : "";
      if (!/^[^/\s]+\/[^/\s]+$/.test(project)) throw Object.assign(new Error("logs.project needs a project, <store>/<project>"), { code: "InvalidInput" });
      const known4 = Array.isArray(args?.sandboxes) ? args.sandboxes.filter((s) => typeof s === "string" && !!s) : [];
      const limit = Number.isFinite(args?.limit) ? Math.max(1, Math.min(2e3, Math.floor(args.limit))) : 500;
      const page = await projectCalls(ctx.layerfs, project, known4, limit);
      return { ...page, lines: await label(ctx, page.lines, outputsDir(ctx.layerfs.callLog)) };
    },
    "logs.output": async (args) => {
      const tag = args?.tag;
      if (!validOutputTag(tag)) throw Object.assign(new Error("logs.output needs the dsh: tag of a call made through DSH"), { code: "InvalidInput" });
      return readOutput(outputsDir(ctx.layerfs.callLog), tag);
    },
    "logs.reset": async () => {
      const answer = await resetCalls2(ctx.layerfs);
      ctx.layerfs.emit(LOGS_EVENT, { at: Date.now() });
      return answer;
    }
  });
}

// src/host/presets/manager.ts
import { randomUUID as randomUUID7 } from "node:crypto";
import { existsSync as existsSync12, mkdirSync as mkdirSync11, readFileSync as readFileSync13, renameSync as renameSync9, unlinkSync as unlinkSync6, writeFileSync as writeFileSync11 } from "node:fs";
import { join as join13 } from "node:path";

// src/shared/presets.ts
var LOG_LINES = 200;

// src/host/presets/driver.ts
var PRESET_TIMEOUT_MS = 12e4;
var PRESET_LONG_TIMEOUT_MS = 30 * 6e4;
var presetTimeout = (argv, read2) => !read2 && laneOf(argv).name !== "calls" ? PRESET_LONG_TIMEOUT_MS : PRESET_TIMEOUT_MS;
var CliDriver = class {
  constructor(spec, report = () => {
  }) {
    this.spec = spec;
    this.report = report;
  }
  spec;
  report;
  /** Raised by the history scheduler while it runs (at most 16). */
  concurrency;
  discover() {
    return discover({ cli: this.spec.cli });
  }
  invoke(argv, { input, read: read2 = false } = {}) {
    this.report(`CLI: layerfs ${argv.join(" ")}`);
    const call = `${argv[0]}.${argv[1]}`;
    const storeRead = read2 && ["file", "branch", "commit", "project"].includes(argv[0]) ? argv[2]?.split("/")[0] : void 0;
    return execute(this.spec, argv, {
      input,
      read: read2,
      storeRead,
      timeout: presetTimeout(argv, read2),
      lane: { name: "presets", limit: Math.max(4, this.concurrency ?? 4) },
      onProgress: (progress) => {
        if (progress?.phase) this.report(`  ${call}: ${progress.phase}`);
      }
    });
  }
};

// src/host/presets/build.js
var build_exports = {};
__export(build_exports, {
  buildPreset: () => buildPreset,
  prepareBuild: () => prepareBuild,
  presetScript: () => presetScript
});
import { existsSync as existsSync11, readFileSync as readFileSync11, writeFileSync as writeFileSync9, renameSync as renameSync7 } from "node:fs";
import { join as join11 } from "node:path";

// src/host/presets/runner.js
var runner_exports = {};
__export(runner_exports, {
  DemoRunner: () => DemoRunner,
  PRESET_HISTORY_LIMITS: () => PRESET_HISTORY_LIMITS,
  TOOL: () => TOOL
});

// src/host/presets/recipe/mixed-recipe.js
var mixed_recipe_exports = {};
__export(mixed_recipe_exports, {
  MIXED_CAPACITY: () => MIXED_CAPACITY,
  MIXED_RECIPE_VERSION: () => MIXED_RECIPE_VERSION,
  MIXED_REVISIONS_PER_SESSION: () => MIXED_REVISIONS_PER_SESSION,
  MixedSandboxPool: () => MixedSandboxPool,
  mixedHistorySteps: () => mixedHistorySteps,
  mixedSandboxName: () => mixedSandboxName
});
var MIXED_RECIPE_VERSION = 3;
var MIXED_REVISIONS_PER_SESSION = 2;
var MIXED_CAPACITY = Object.freeze({ sandboxLimit: 3, workspaceLimit: 16 });
var quote = (value) => `'${String(value).replaceAll("'", "'\\''")}'`;
var mixedSandboxName = (name6) => `demo-mix-${name6}-1`;
function mixedHistorySteps(steps, name6) {
  const sandbox = mixedSandboxName(name6), project = steps[0].argv[2];
  const result = [], unmounts = /* @__PURE__ */ new Map();
  const createKey = "mixed.sandbox.create";
  const create = { key: createKey, argv: ["sandbox", "create", project, sandbox], dependsOn: [steps.filter((step) => !step.key.startsWith("dense.")).at(-1).key], lane: "sandbox", resource: { family: "sandbox", name: sandbox } };
  const selected = (step) => /^dense\.\d+\.a\.write\./.test(step.key) || /^dense\.\d+\.b\.write\./.test(step.key) && Number(step.key.split(".").at(-1)) <= 16;
  const sessions = /* @__PURE__ */ new Map();
  let created = false;
  for (const step of steps) {
    if (!created && step.key.startsWith("dense.")) {
      result.push(create);
      created = true;
    }
    if (!selected(step)) {
      result.push({ ...step, dependsOn: [...step.dependsOn ?? []] });
      continue;
    }
    const [prefix, cycle, lane, , indexText] = step.key.split("."), index = Number(indexText);
    const batch = String(Math.ceil(index / MIXED_REVISIONS_PER_SESSION)).padStart(3, "0");
    const session = `${prefix}.${cycle}.${lane}.session.${batch}`, workspace = `${lane}-${cycle}-${batch}`;
    const ws = `${sandbox}:${workspace}`;
    if (!sessions.has(session)) {
      const mount = `${session}.mount`;
      sessions.set(session, mount);
      result.push({ key: mount, argv: ["workspace", "mount", sandbox, step.argv[3], "--name", workspace], lane, dependsOn: [...step.dependsOn, createKey] });
    }
    const execKey = `${step.key}.exec`;
    const body = `printf '%s' ${quote(step.input)} > ${quote(step.argv[4].replace(/^\//, ""))}`;
    result.push({ key: execKey, argv: ["workspace", "exec", ws, body], lane, dependsOn: (index - 1) % MIXED_REVISIONS_PER_SESSION === 0 ? [sessions.get(session)] : step.dependsOn, expect: { exitCode: 0 } });
    result.push({ ...step, argv: ["workspace", "commit", ws, "--message", step.argv[step.argv.indexOf("--message") + 1]], input: void 0, historyArgv: step.argv, workspaceRevision: true, dependsOn: [execKey] });
    if (index % MIXED_REVISIONS_PER_SESSION === 0) {
      const unmount = `${session}.unmount`;
      result.push({ key: unmount, argv: ["workspace", "unmount", ws], lane, dependsOn: [step.key], expect: { ok: true } });
      unmounts.set(step.key, unmount);
    }
  }
  for (const step of result) if (step.argv[1] !== "unmount") step.dependsOn = (step.dependsOn ?? []).map((key) => unmounts.get(key) ?? key);
  return result;
}
var MixedSandboxPool = class {
  constructor(project, { sandboxLimit = 3, workspaceLimit = 16 } = {}) {
    if (!Number.isInteger(sandboxLimit) || sandboxLimit < 1 || sandboxLimit > 3 || !Number.isInteger(workspaceLimit) || workspaceLimit < 1 || workspaceLimit > 16) throw new Error("Mixed pool exceeds 3 sandboxes or 16 workspaces per sandbox.");
    this.project = project;
    this.sandboxLimit = sandboxLimit;
    this.workspaceLimit = workspaceLimit;
    this.boxes = /* @__PURE__ */ new Map();
  }
  acquire(workspace) {
    for (const [sandbox, leases] of this.boxes) if (leases.has(workspace)) return sandbox;
    let entry = [...this.boxes].find(([, leases]) => leases.size < this.workspaceLimit);
    if (!entry) {
      if (this.boxes.size >= this.sandboxLimit) throw Object.assign(new Error("All mixed sandbox workspace slots are occupied."), { code: "Capacity" });
      const sandbox = `demo-mix-${this.project.split("/").at(-1)}-${this.boxes.size + 1}`;
      entry = [sandbox, /* @__PURE__ */ new Set()];
      this.boxes.set(...entry);
    }
    entry[1].add(workspace);
    return entry[0];
  }
  release(sandbox, workspace) {
    this.boxes.get(sandbox)?.delete(workspace);
  }
};

// src/host/presets/runner.js
import { randomUUID as randomUUID4 } from "node:crypto";
import { chmodSync as chmodSync4, closeSync as closeSync3, existsSync as existsSync10, lstatSync as lstatSync4, mkdirSync as mkdirSync8, openSync as openSync3, readFileSync as readFileSync9, readdirSync as readdirSync4, realpathSync as realpathSync3, renameSync as renameSync5, unlinkSync as unlinkSync3, writeFileSync as writeFileSync7 } from "node:fs";
import { dirname as dirname7, join as join9, resolve as resolve3 } from "node:path";

// src/host/routes/util.ts
var refuse = (status, code2, message) => Object.assign(new Error(message), status === null ? { code: code2 } : { status, code: code2 });
function projectRef(key) {
  const text6 = String(key ?? "");
  const at = text6.indexOf("/");
  const store = text6.slice(0, at);
  const name6 = text6.slice(at + 1);
  if (at <= 0 || !name6 || name6.includes("/") || text6.includes("\0")) {
    throw refuse(400, "InvalidInput", `${JSON.stringify(text6)} is not a project key: write it as <store>/<project>`);
  }
  return { store, name: name6, key: `${store}/${name6}` };
}
var keyOf = (p) => p.project ?? `${p.store}/${p.name}`;
function featuresOf(discovery) {
  const table = Array.isArray(discovery?.calls) ? discovery.calls : [];
  const tokens = Array.isArray(discovery?.identity?.features) ? discovery.identity.features : [];
  const call = (family, name6) => table.find((c) => c.family === family && c.call === name6);
  const optionOf = (family, name6, opt) => call(family, name6)?.options?.find((o) => o.name === opt);
  const option = (family, name6, opt) => !!optionOf(family, name6, opt);
  const images = !!call("machine", "images"), imageLoad = !!call("machine", "load_image"), imagePrune = !!call("machine", "prune");
  const imageRefs = optionOf("sandbox", "create", "image")?.kind === "image";
  const sandboxRuntime = tokens.includes("sandbox-runtime");
  return {
    forceStop: option("machine", "stop", "force"),
    images,
    imageLoad,
    imagePrune,
    imageRefs,
    createProgress: option("sandbox", "create", "on_progress"),
    sandboxRuntime,
    imageStage: images && imageLoad && imagePrune && imageRefs && sandboxRuntime ? 1 : 0,
    inspect: { machineLog: !!call("machine", "log"), sandboxLog: !!call("sandbox", "log"), files: !!call("sandbox", "files"), machineFiles: !!call("machine", "files"), machineStats: !!call("machine", "stats") },
    machineSpace: withValues(call("machine", "stats")).includes("space")
  };
}
async function cliFeatures(host) {
  try {
    return featuresOf(await host.discover());
  } catch {
    return featuresOf(null);
  }
}
var Answer = class {
  constructor(status, body) {
    this.status = status;
    this.body = body;
  }
  status;
  body;
};
var BUSY_MS = 3e4;
var SANDBOX_KEEP_MS = 1e4;
var reads = /* @__PURE__ */ new WeakMap();
function invalidateSandbox(lfs, sandbox) {
  const state = reads.get(lfs);
  if (!state) return;
  state.busy.delete(sandbox);
  state.flying.delete(sandbox);
  state.kept.delete(sandbox);
}
function sandboxObservation(lfs, sandbox, { wait = null } = {}) {
  if (!reads.has(lfs)) reads.set(lfs, { flying: /* @__PURE__ */ new Map(), busy: /* @__PURE__ */ new Map(), kept: /* @__PURE__ */ new Map() });
  const { flying, busy: busy2, kept: kept2 } = reads.get(lfs);
  const refused = busy2.get(sandbox);
  if (refused && Date.now() - refused.at < BUSY_MS) return Promise.reject(refused.error);
  const good = kept2.get(sandbox);
  if (good && Date.now() - good.at < SANDBOX_KEEP_MS) return Promise.resolve(good.value);
  let read2 = flying.get(sandbox);
  if (!read2) {
    const began = Date.now();
    const current = () => flying.get(sandbox) === read2;
    read2 = lfs.sandbox.get(sandbox, { detail: true, with: ["stats"] }).then(
      (all) => {
        if (current()) {
          busy2.delete(sandbox);
          if (kept2.size >= 256) kept2.delete(kept2.keys().next().value);
          kept2.set(sandbox, { at: began, value: all });
        }
        return all;
      },
      (error2) => {
        if (current()) kept2.delete(sandbox);
        if (error2?.code === "Busy" && current()) busy2.set(sandbox, { at: Date.now(), error: error2 });
        throw error2;
      }
    ).finally(() => {
      if (current()) flying.delete(sandbox);
    });
    read2.started = began;
    flying.set(sandbox, read2);
  }
  if (!wait) return read2;
  const left = wait - (Date.now() - (read2.started ?? Date.now()));
  let timer;
  const late = new Promise((_, reject) => {
    timer = setTimeout(() => reject(refuse(null, "Timeout", `Sandbox ${sandbox} did not answer in ${wait / 1e3} s`)), Math.max(0, left));
  });
  return Promise.race([read2, late]).finally(() => clearTimeout(timer));
}
function wire(value) {
  if (value === void 0) return value;
  return JSON.parse(JSON.stringify(value, (_k, v) => typeof v === "bigint" ? { $layerfs: "i64-v1", decimal: String(v) } : v));
}
var stringify = (value) => JSON.stringify(value, (_k, v) => typeof v === "bigint" ? { $layerfs: "i64-v1", decimal: String(v) } : v);

// src/host/presets/recipe/presets.js
var presets_exports = {};
__export(presets_exports, {
  CONTENT_VERSION: () => CONTENT_VERSION,
  presetOf: () => presetOf,
  presets: () => presets,
  sourceFiles: () => sourceFiles
});

// src/host/presets/recipe/projects.js
var projects_exports = {};
__export(projects_exports, {
  projectDefinition: () => projectDefinition
});
var json = (value) => JSON.stringify(value, null, 2) + "\n";
var write = (path2, content, message) => ({ path: path2, content: content.endsWith("\n") ? content : content + "\n", message });
var markdown = (title, body) => `# ${title}

${body}
`;
var packageFile = (name6) => json({ name: `preset-${name6}`, private: true, type: "module", description: "Browsable source example; no dependency installation required." });
var profiles = {
  bookshelf: {
    title: "Neighborhood library on SQLite",
    description: "A small lending-library API: one SQLite schema, numbered migrations, seed rows and the queries behind each endpoint.",
    purpose: "Follow a SQLite-backed app through schema changes, features and releases on many Branches.",
    files: {
      "db/schema.sql": "CREATE TABLE books (\n  id INTEGER PRIMARY KEY,\n  title TEXT NOT NULL,\n  author TEXT NOT NULL,\n  year INTEGER\n);\n\nCREATE TABLE members (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  joined TEXT NOT NULL\n);\n",
      "db/migrations/001_init.sql": "-- Initial tables. Applied once, in order, by src/migrate.js.\nCREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL, author TEXT NOT NULL, year INTEGER);\nCREATE TABLE members (id INTEGER PRIMARY KEY, name TEXT NOT NULL, joined TEXT NOT NULL);\n",
      "db/seed.sql": "INSERT INTO books (id, title, author, year) VALUES\n  (1, 'The Trail Atlas', 'R. Ortega', 2019),\n  (2, 'Small Gardens', 'M. Chen', 2021),\n  (3, 'Repairing Things', 'A. Novak', 2017);\nINSERT INTO members (id, name, joined) VALUES\n  (1, 'Sample Reader', '2024-01-15'),\n  (2, 'Example Neighbor', '2024-03-02');\n",
      "src/db.js": 'import { DatabaseSync } from "node:sqlite"\nexport function open(path = "library.db") { const db = new DatabaseSync(path); db.exec("PRAGMA foreign_keys = ON"); return db }\n',
      "src/migrate.js": 'import { readdirSync, readFileSync } from "node:fs"\nexport function migrate(db, dir = "db/migrations") { db.exec("CREATE TABLE IF NOT EXISTS migrations (name TEXT PRIMARY KEY)"); const done = new Set(db.prepare("SELECT name FROM migrations").all().map(r => r.name)); for (const name of readdirSync(dir).sort()) { if (done.has(name)) continue; db.exec(readFileSync(`${dir}/${name}`, "utf8")); db.prepare("INSERT INTO migrations (name) VALUES (?)").run(name) } }\n',
      "src/books.js": 'export function listBooks(db) { return db.prepare("SELECT id, title, author, year FROM books ORDER BY title").all() }\nexport function getBook(db, id) { return db.prepare("SELECT id, title, author, year FROM books WHERE id = ?").get(id) ?? null }\n',
      "docs/api.md": markdown("API", "GET /books lists books by title. GET /books/:id returns one book or 404. Responses are JSON. This fixture describes the contract; it does not run a server."),
      "docs/database.md": markdown("Database", "One SQLite file. Schema changes are numbered migrations under db/migrations and never edited after release. db/schema.sql is the current shape for reading."),
      "package.json": packageFile("bookshelf")
    },
    features: [
      { name: "feature-loans", title: "Loans", commits: [
        ["db/migrations/002_loans.sql", "-- Who has which book, and until when.\nCREATE TABLE loans (id INTEGER PRIMARY KEY, book INTEGER NOT NULL REFERENCES books(id), member INTEGER NOT NULL REFERENCES members(id), due TEXT NOT NULL, returned TEXT);\n", "Add the loans table"],
        ["src/loans.js", 'export function lend(db, book, member, due) { const open = db.prepare("SELECT 1 FROM loans WHERE book = ? AND returned IS NULL").get(book); if (open) throw new Error("Book is already on loan"); return db.prepare("INSERT INTO loans (book, member, due) VALUES (?, ?, ?)").run(book, member, due).lastInsertRowid }\nexport function giveBack(db, loan, on) { db.prepare("UPDATE loans SET returned = ? WHERE id = ? AND returned IS NULL").run(on, loan) }\n', "Lend and return books"],
        ["docs/api.md", markdown("API", "GET /books lists books by title. GET /books/:id returns one book or 404.\n\nPOST /loans {book, member, due} lends a book; 409 when it is already out. POST /loans/:id/return marks it returned."), "Document the loan endpoints"],
        ["db/schema.sql", "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL, author TEXT NOT NULL, year INTEGER);\nCREATE TABLE members (id INTEGER PRIMARY KEY, name TEXT NOT NULL, joined TEXT NOT NULL);\nCREATE TABLE loans (id INTEGER PRIMARY KEY, book INTEGER NOT NULL REFERENCES books(id), member INTEGER NOT NULL REFERENCES members(id), due TEXT NOT NULL, returned TEXT);\n", "Show loans in the current schema"]
      ] },
      { name: "feature-search", title: "Search", commits: [
        ["db/migrations/003_search.sql", "-- Full-text index over titles and authors (SQLite FTS5).\nCREATE VIRTUAL TABLE books_fts USING fts5(title, author, content='books', content_rowid='id');\nINSERT INTO books_fts (rowid, title, author) SELECT id, title, author FROM books;\n", "Index titles and authors with FTS5"],
        ["src/search.js", 'export function search(db, query) { return db.prepare("SELECT b.id, b.title, b.author FROM books_fts f JOIN books b ON b.id = f.rowid WHERE books_fts MATCH ? ORDER BY rank LIMIT 20").all(query) }\n', "Search books by title or author"],
        ["docs/search.md", markdown("Search", "GET /search?q= matches words in titles and authors, best match first, at most 20 rows. The index is rebuilt by migration 003; later inserts must update books_fts too."), "Explain search ranking and the index"]
      ] },
      { name: "feature-holds", title: "Holds", commits: [
        ["db/migrations/004_holds.sql", "-- A queue of members waiting for a book that is out.\nCREATE TABLE holds (id INTEGER PRIMARY KEY, book INTEGER NOT NULL REFERENCES books(id), member INTEGER NOT NULL REFERENCES members(id), placed TEXT NOT NULL);\n", "Add a holds queue"],
        ["src/holds.js", 'export function place(db, book, member, at) { return db.prepare("INSERT INTO holds (book, member, placed) VALUES (?, ?, ?)").run(book, member, at).lastInsertRowid }\nexport function next(db, book) { return db.prepare("SELECT member FROM holds WHERE book = ? ORDER BY placed, id LIMIT 1").get(book)?.member ?? null }\n', "Place holds and find who is next"],
        ["docs/api.md", markdown("API", "GET /books, GET /books/:id, POST /loans, POST /loans/:id/return.\n\nPOST /holds {book, member} joins the queue for a book. When a loan is returned, the earliest hold is next in line."), "Document holds next to loans"]
      ] }
    ],
    maintenance: { name: "fix-due-dates", title: "Due-date checks", commits: [
      ["src/dates.js", "export function isDate(text) { return /^\\d{4}-\\d{2}-\\d{2}$/.test(text) && !Number.isNaN(Date.parse(`${text}T00:00:00Z`)) }\n", "Validate ISO due dates"],
      ["db/migrations/005_due_check.sql", "-- Reject loans whose due date is not YYYY-MM-DD.\nCREATE TRIGGER loans_due_check BEFORE INSERT ON loans WHEN NEW.due NOT GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' BEGIN SELECT RAISE(ABORT, 'invalid due date'); END;\n", "Check due dates in the database too"],
      ["docs/database.md", markdown("Database", "One SQLite file. Schema changes are numbered migrations and never edited after release. Dates are TEXT in YYYY-MM-DD; a trigger rejects anything else so bad rows cannot slip in from another client."), "Record the date format rule"]
    ] },
    explorations: [
      { name: "explore-postgres", title: "Moving to PostgreSQL", files: [["proposals/postgres.md", markdown("PostgreSQL proposal", "Draft: keep SQLite for single-branch libraries; consider PostgreSQL only when several branches share one catalog.")], ["proposals/postgres.json", json({ status: "proposal", blockers: ["FTS5 has no direct equivalent", "migration tooling"] })]] },
      { name: "explore-fines", title: "Late fines", files: [["proposals/fines.md", markdown("Late fines proposal", "Draft: many libraries dropped fines. If added, store amounts in integer cents and cap them per loan.")], ["proposals/fines.json", json({ status: "proposal", perDayCents: 10, capCents: 500 })]] }
    ]
  },
  embeddings: {
    title: "Field guide search collection",
    description: "A tiny document corpus, transparent keyword vectors and a local similarity helper; no model or network is required.",
    purpose: "Make document retrieval inspectable from source text through rankings.",
    files: {
      "corpus/water.md": markdown("Carry and refill water", "Carry a water bottle. Refill at a safe water source. Plan water stops before a long trail."),
      "corpus/layers.md": markdown("Pack a warm layer", "Weather changes on a trail. Carry a warm layer and a rain shell in your pack."),
      "corpus/repair.md": markdown("Repair a loose buckle", "Inspect the pack buckle before a walk. Replace a damaged buckle rather than replacing the whole pack."),
      "corpus/navigation.md": markdown("Find the route", "Carry a map and check trail junctions. A paper map remains useful when a phone battery is empty."),
      "data/vocabulary.json": json(["water", "pack", "trail", "map", "repair"]),
      "data/documents.json": json([{ id: "water", path: "corpus/water.md" }, { id: "layers", path: "corpus/layers.md" }, { id: "repair", path: "corpus/repair.md" }, { id: "navigation", path: "corpus/navigation.md" }]),
      "data/example-vectors.json": json({ illustrative: true, method: "Hand-authored keyword-presence examples, not model output", dimensions: ["water", "pack", "trail", "map", "repair"], vectors: { water: [1, 0, 1, 0, 0], layers: [0, 1, 1, 0, 0], repair: [0, 1, 0, 0, 1], navigation: [0, 0, 1, 1, 0] } }),
      "src/vectorize.js": "export function vectorize(text, vocabulary) { const tokens = new Set(text.toLowerCase().match(/[a-z]+/g) ?? []); return vocabulary.map(word => Number(tokens.has(word))) }\n",
      "src/similarity.js": 'export function cosine(a, b) { if (a.length !== b.length) throw new RangeError("Vector dimensions differ"); const dot = a.reduce((sum, n, i) => sum + n * b[i], 0), lengthA = Math.hypot(...a), lengthB = Math.hypot(...b); return lengthA && lengthB ? dot / (lengthA * lengthB) : 0 }\n',
      "docs/data-card.md": markdown("Data card", "Four fictional field-guide passages written for this fixture. No personal information, external corpus or model-generated vector is included. Keyword vectors explain mechanics, not semantic search quality."),
      "docs/retrieval.md": markdown("Retrieval pipeline", "Tokenize the query with the same vocabulary, compute cosine similarity, then rank documents. The corpus is intentionally small enough to inspect by hand."),
      "package.json": packageFile("embeddings")
    },
    features: [
      { name: "feature-chunk-manifest", title: "Traceable chunks", commits: [
        ["data/chunks.json", json([{ id: "water:1", document: "water", heading: "Carry and refill water", path: "corpus/water.md" }]), "Link the first retrieval chunk to its document"],
        ["docs/chunking.md", markdown("Chunking policy", "Keep each short passage as one chunk. Preserve its document ID, source path and heading so a result can explain where it came from."), "Specify source-preserving chunk metadata"],
        ["data/chunks.json", json([{ id: "water:1", document: "water", path: "corpus/water.md" }, { id: "layers:1", document: "layers", path: "corpus/layers.md" }, { id: "repair:1", document: "repair", path: "corpus/repair.md" }, { id: "navigation:1", document: "navigation", path: "corpus/navigation.md" }]), "Cover all four source documents in the manifest"],
        ["docs/chunking.md", markdown("Chunking policy", "Each short passage is one chunk. Keep a stable document ID and source path. A chunk ID changes only when segmentation changes. Do not silently compare scores across different vocabulary or chunking versions."), "Document version boundaries for retrieval comparisons"]
      ] },
      { name: "feature-ranked-results", title: "Stable ranking", commits: [
        ["src/rank.js", 'import { cosine } from "./similarity.js"\nexport function rank(query, documents) { return documents.map(document => ({ id: document.id, score: cosine(query, document.vector) })).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)) }\n', "Rank vectors with an explicit tie-breaker"],
        ["examples/query.json", json({ illustrative: true, query: "water trail", vocabulary: ["water", "pack", "trail", "map", "repair"], expectedQueryVector: [1, 0, 1, 0, 0], expectedFirstDocument: "water" }), "Add a hand-worked retrieval query"],
        ["docs/ranking.md", markdown("Ranking", "Use descending cosine score and ascending document ID for ties. Scores are similarities, not probabilities. The worked query is an expectation, not an executed result."), "Explain ranking scores without overstating confidence"]
      ] },
      { name: "feature-corpus-provenance", title: "Corpus provenance", commits: [
        ["data/provenance.json", json({ author: "LayerFS Connect AI-assisted sample content", source: "Fictional passages stored in this fixture", licenseNote: "Part of the project fixture", vectorMethod: "Deterministic keyword presence; no embedding model or remote API" }), "Record the deliberately local corpus provenance"],
        ["docs/maintenance.md", markdown("Corpus maintenance", "When a passage changes, rebuild its vector with the same vocabulary version and review linked relevance judgments."), "Connect source edits to retrieval maintenance"],
        ["docs/maintenance.md", markdown("Corpus maintenance", "Edit source passages, regenerate vectors with the declared vocabulary version, then review relevance judgments. Record both corpus and vocabulary versions with real evaluation output. This fixture does not preclaim a completed evaluation."), "Define evidence needed for a later real evaluation"]
      ] }
    ],
    maintenance: { name: "fix-empty-query", title: "Empty-query handling", commits: [
      ["src/vectorize.js", 'export function vectorize(text, vocabulary) { if (typeof text !== "string") throw new TypeError("Expected text"); const tokens = new Set(text.toLowerCase().match(/[a-z]+/g) ?? []); return vocabulary.map(word => Number(tokens.has(word))) }\nexport function hasSignal(vector) { return vector.some(value => value !== 0) }\n', "Expose whether a query contains known vocabulary"],
      ["examples/empty-query.json", json({ illustrative: true, cases: [{ text: "", vector: [0, 0, 0, 0, 0], expectedBehavior: "Ask for a more specific query" }, { text: "???", vector: [0, 0, 0, 0, 0], expectedBehavior: "Ask for a more specific query" }] }), "Describe empty and punctuation-only query expectations"],
      ["docs/retrieval.md", markdown("Retrieval pipeline", "Tokenize query and corpus using the same vocabulary. If the query has no known terms, ask for a more specific query instead of presenting tied zero scores as relevant results. Otherwise compute cosine similarity and rank by score, then stable document ID."), "Prevent zero-signal queries from appearing meaningful"]
    ] },
    explorations: [
      { name: "explore-multilingual", title: "Multilingual vocabulary", files: [["proposals/multilingual.md", markdown("Multilingual proposal", "Draft: keep original language metadata and evaluate a language-specific vocabulary before mixing scores.")], ["proposals/languages.json", json({ status: "proposal", languages: ["en", "es"], translatedCorpusAvailable: false })]] },
      { name: "explore-term-frequency", title: "Term-frequency vectors", files: [["proposals/term-frequency.md", markdown("Term frequency proposal", "Draft: compare binary keyword presence with normalized term frequency on the same corpus and relevance labels.")], ["proposals/comparison.json", json({ status: "proposal", baseline: "binary-keyword-presence", candidate: "normalized-term-frequency", measured: false })]] }
    ]
  },
  evaluation: {
    title: "Search quality review book",
    description: "Human-readable retrieval cases, relevance judgments, rubrics and metric definitions, without invented run results.",
    purpose: "Separate expected behavior and reviewer judgments from measured execution results.",
    files: {
      "data/queries.jsonl": '{"id":"q-water","query":"water refill","relevant":["water"]}\n{"id":"q-map","query":"paper map","relevant":["navigation"]}\n{"id":"q-pack","query":"repair pack buckle","relevant":["repair"]}\n',
      "data/documents.json": json([{ id: "water", title: "Carry and refill water" }, { id: "navigation", title: "Find the route" }, { id: "repair", title: "Repair a loose buckle" }, { id: "layers", title: "Pack a warm layer" }]),
      "data/judgments.csv": "query,document,relevance,reason\nq-water,water,2,Directly explains refills\nq-map,navigation,2,Directly discusses paper maps\nq-pack,repair,2,Directly discusses buckle repairs\nq-pack,layers,0,Pack is mentioned but repair is not\n",
      "rubrics/relevance.md": markdown("Relevance rubric", "2: directly answers the query.\n1: provides useful supporting context.\n0: unrelated or only shares a word.\n\nThese are fixture judgments, not a model assessment."),
      "rubrics/review.md": markdown("Review process", "Read query and source document before assigning relevance. Record a short reason. Resolve disagreement without looking at a system\u2019s rank."),
      "src/metrics.js": 'export function precisionAtK(ranked, relevant, k) { if (!Number.isInteger(k) || k < 1) throw new RangeError("k must be positive"); const truth = new Set(relevant); return ranked.slice(0, k).filter(id => truth.has(id)).length / k }\n',
      "examples/worked-precision.json": json({ illustrative: true, ranked: ["water", "layers", "navigation"], relevant: ["water"], k: 3, expectedPrecision: 1 / 3, note: "Hand-worked arithmetic, not a recorded system run." }),
      "docs/metrics.md": markdown("Metric definitions", "Precision@k is relevant retrieved items divided by k. Keep the denominator policy fixed when comparing systems."),
      "docs/dataset-card.md": markdown("Dataset card", "Fictional field-guide search queries and authored relevance judgments. Tiny illustrative coverage; unsuitable for claims about general search quality."),
      "docs/report-template.md": markdown("Future run report template", "Run ID: pending\nCorpus revision: pending\nQuery revision: pending\nRanking configuration: pending\nMeasured metrics: pending\n\nNo evaluation run has been executed by importing this fixture."),
      "data/splits.json": json({ development: ["q-water", "q-map"], review: ["q-pack"], note: "Illustrative split; no training process is included." }),
      "package.json": packageFile("evaluation")
    },
    features: [
      { name: "feature-query-coverage", title: "Query coverage", commits: [
        ["data/coverage.json", json({ intents: ["hydration", "navigation", "repair"], missing: ["weather", "empty-query"] }), "Make gaps in query coverage explicit"],
        ["data/queries.jsonl", '{"id":"q-water","query":"water refill","relevant":["water"]}\n{"id":"q-map","query":"paper map","relevant":["navigation"]}\n{"id":"q-pack","query":"repair pack buckle","relevant":["repair"]}\n{"id":"q-weather","query":"warm layer rain","relevant":["layers"]}\n', "Add a weather-preparation relevance case"],
        ["data/coverage.json", json({ intents: ["hydration", "navigation", "repair", "weather"], missing: ["empty-query", "unknown-terms"] }), "Update the coverage inventory after adding weather"],
        ["docs/coverage.md", markdown("Coverage boundaries", "Include direct lookup, ambiguous terms and no-signal queries. Adding examples improves inspectability but does not establish statistical representativeness."), "Explain the limits of a tiny review collection"]
      ] },
      { name: "feature-recall-definition", title: "Recall metric", commits: [
        ["src/recall.js", 'export function recallAtK(ranked, relevant, k) { if (!Number.isInteger(k) || k < 1) throw new RangeError("k must be positive"); const truth = new Set(relevant); if (!truth.size) return null; return new Set(ranked.slice(0, k).filter(id => truth.has(id))).size / truth.size }\n', "Define recall with an explicit no-judgments result"],
        ["examples/worked-recall.json", json({ illustrative: true, ranked: ["water", "layers"], relevant: ["water", "navigation"], k: 2, expectedRecall: 0.5, note: "Hand-worked metric example; not an executed search result." }), "Add a transparent recall calculation"],
        ["docs/metrics.md", markdown("Metric definitions", "Precision@k divides relevant retrieved items by k. Recall@k divides distinct relevant retrieved items by the number of known relevant items. A query with no relevance labels has undefined recall (null), not zero."), "Distinguish recall from precision and missing labels"]
      ] },
      { name: "feature-review-provenance", title: "Judgment provenance", commits: [
        ["data/review-policy.json", json({ version: "1", blindToRanking: true, relevanceScale: [0, 1, 2], disputeResolution: "Discuss source evidence and record rationale" }), "Record a ranking-blind review policy"],
        ["docs/disagreements.md", markdown("Reviewer disagreement", "Keep both initial judgments and a final rationale. A disagreement is useful information about an ambiguous query."), "Document how reviewers preserve disagreement"],
        ["docs/disagreements.md", markdown("Reviewer disagreement", "Keep initial judgments, evidence excerpts and a final rationale. Do not overwrite the original annotation silently. Flag ambiguous queries for a revised wording rather than forcing agreement. No inter-reviewer agreement statistic is claimed here."), "Separate a review procedure from measured agreement"]
      ] }
    ],
    maintenance: { name: "fix-duplicate-results", title: "Duplicate-result scoring", commits: [
      ["src/metrics.js", 'export function precisionAtK(ranked, relevant, k) { if (!Number.isInteger(k) || k < 1) throw new RangeError("k must be positive"); const truth = new Set(relevant); return new Set(ranked.slice(0, k).filter(id => truth.has(id))).size / k }\n', "Count each relevant document once in precision"],
      ["examples/duplicate-results.json", json({ illustrative: true, ranked: ["water", "water", "layers"], relevant: ["water"], k: 3, expectedPrecision: 1 / 3, reason: "Repeated retrieval does not earn relevance credit twice." }), "Capture the duplicate-document scoring boundary"],
      ["rubrics/relevance.md", markdown("Relevance rubric", "2: directly answers the query.\n1: useful context.\n0: unrelated or keyword-only overlap.\n\nJudge document relevance once per query. Duplicate results do not create additional relevant documents. These are authored fixture judgments, not a model assessment."), "Align reviewer guidance with distinct-document scoring"]
    ] },
    explorations: [
      { name: "explore-adversarial-queries", title: "Hard negatives", files: [["proposals/adversarial.md", markdown("Hard-negative proposal", "Draft queries that share words with irrelevant documents to reveal keyword shortcuts.")], ["proposals/hard-negatives.jsonl", '{"status":"proposal","query":"pack a repair kit","candidate":"layers","concern":"Word overlap without repair guidance"}\n']] },
      { name: "explore-graded-ranking", title: "Graded ranking metrics", files: [["proposals/graded-metrics.md", markdown("Graded metrics proposal", "Draft an NDCG metric only after deciding gains, discounting and unjudged-document policy.")], ["proposals/gains.json", json({ status: "proposal", relevanceToGain: { 0: 0, 1: 1, 2: 3 }, discount: "log2(rank+1)", measured: false })]] }
    ]
  },
  website: {
    title: "Trail Supply storefront",
    description: "A small outdoor shop with a static storefront, product data and clear shopping policies.",
    purpose: "Browse lightweight outdoor equipment and understand delivery before ordering.",
    files: {
      "index.html": '<!doctype html>\n<html lang="en"><meta charset="utf-8"><title>Trail Supply</title><link rel="stylesheet" href="styles.css"><main><h1>Less weight. More trail.</h1><p>Thoughtful equipment for a day outdoors.</p><nav><a href="products.html">Browse equipment</a> \xB7 <a href="shipping.html">Delivery</a></nav><section><h2>Start with the essentials</h2><p>A day pack, a bottle and a reliable trail map.</p></section></main></html>\n',
      "products.html": '<!doctype html>\n<html lang="en"><meta charset="utf-8"><title>Equipment \xB7 Trail Supply</title><link rel="stylesheet" href="styles.css"><main><a href="index.html">Trail Supply</a><h1>Equipment</h1><article><h2>Ridge day pack</h2><p>18 L \xB7 recycled fabric \xB7 $48.00</p></article><article><h2>Steel bottle</h2><p>750 ml \xB7 replaceable cap \xB7 $24.00</p></article></main></html>\n',
      "styles.css": ":root { font-family: system-ui, sans-serif; line-height: 1.6; color-scheme: light dark; } body { margin: 0; } main { max-width: 56rem; margin: auto; padding: 2rem 1.25rem; } article { border-block-end: 1px solid; padding-block: 1rem; } a { text-underline-offset: .2em; }\n",
      "data/products.json": json([{ id: "pack-ridge", name: "Ridge day pack", priceCents: 4800, stock: 12 }, { id: "bottle-steel", name: "Steel bottle", priceCents: 2400, stock: 30 }]),
      "data/categories.json": json([{ id: "carry", label: "Carry", products: ["pack-ridge"] }, { id: "drink", label: "Hydration", products: ["bottle-steel"] }]),
      "shipping.html": '<!doctype html>\n<html lang="en"><meta charset="utf-8"><title>Delivery \xB7 Trail Supply</title><main><h1>Delivery</h1><p>Dispatch within two business days. Standard delivery is $5.00; orders from $75.00 ship free.</p><p>These are sample shop policies, not an operating checkout.</p></main></html>\n',
      "returns.md": markdown("Returns", "Unused equipment can be returned within 30 days. Keep the packaging and include the order reference. This fixture contains no real orders."),
      "src/cart.js": "export function subtotal(items) { return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0) }\nexport function formatMoney(cents) { return `$${(cents / 100).toFixed(2)}` }\n",
      "examples/cart.json": json({ currency: "USD", items: [{ product: "pack-ridge", priceCents: 4800, quantity: 1 }, { product: "bottle-steel", priceCents: 2400, quantity: 2 }] }),
      "docs/content-guide.md": markdown("Writing for Trail Supply", "Lead with practical use. State capacity and material. Keep prices in integer cents in data; format them only for display."),
      "docs/accessibility.md": markdown("Storefront accessibility checklist", "- Use one page heading.\n- Keep descriptive link labels.\n- Pair product images with useful text alternatives.\n- Check keyboard focus before publishing.\n\nThis is a review checklist, not a completed audit."),
      "package.json": packageFile("website")
    },
    features: [
      { name: "feature-product-guide", title: "Product guide", commits: [
        ["docs/product-guide.md", markdown("Choose a day pack", "For a short walk, start with 12\u201318 L. Carry water, a warm layer and a map."), "Explain day-pack capacity"],
        ["data/products.json", json([{ id: "pack-ridge", name: "Ridge day pack", priceCents: 4800, stock: 12, capacityLitres: 18 }, { id: "bottle-steel", name: "Steel bottle", priceCents: 2400, stock: 30, capacityMl: 750 }]), "Add useful product capacities"],
        ["docs/product-guide.md", markdown("Choose your essentials", "## Day pack\nFor a short walk, start with 12\u201318 L.\n\n## Water\nCarry at least 750 ml and plan a refill stop.\n\n## Fit\nKeep the heaviest items close to your back."), "Extend the guide with hydration and fit"],
        ["products.html", '<!doctype html>\n<html lang="en"><meta charset="utf-8"><title>Equipment \xB7 Trail Supply</title><link rel="stylesheet" href="styles.css"><main><a href="index.html">Trail Supply</a><h1>Equipment</h1><article><h2>Ridge day pack</h2><p>18 L \xB7 recycled fabric \xB7 $48.00</p></article><article><h2>Steel bottle</h2><p>750 ml \xB7 replaceable cap \xB7 $24.00</p></article><p>Choose capacity for your route, not for the longest trip you can imagine.</p></main></html>\n', "Connect the catalog to practical buying advice"]
      ] },
      { name: "feature-delivery-guide", title: "Delivery guide", commits: [
        ["data/delivery.json", json({ currency: "USD", standardCents: 500, freeFromCents: 7500, dispatchBusinessDays: 2 }), "Describe delivery thresholds as data"],
        ["docs/checkout.md", markdown("Checkout handoff", "Collect item IDs and quantities. Reprice against catalog data. Show delivery before asking for payment. No payment credentials belong in this fixture."), "Document a transparent checkout handoff"],
        ["shipping.html", '<!doctype html>\n<html lang="en"><meta charset="utf-8"><title>Delivery \xB7 Trail Supply</title><main><h1>Delivery without surprises</h1><p>Dispatch within two business days. Standard delivery is $5.00. Orders with a merchandise subtotal of $75.00 or more ship free.</p><p>Delivery is shown before payment. This is a sample storefront.</p></main></html>\n', "Clarify the free-delivery boundary"]
      ] },
      { name: "feature-care-notes", title: "Equipment care", commits: [
        ["docs/care.md", markdown("Keep equipment in use", "Brush dirt from a dry pack. Wash bottles with warm soapy water and leave the cap off to dry."), "Add practical care instructions"],
        ["data/care.json", json({ "pack-ridge": ["Brush when dry", "Air dry away from direct heat"], "bottle-steel": ["Hand wash", "Dry with cap removed"] }), "Link care guidance to catalog IDs"],
        ["docs/care.md", markdown("Keep equipment in use", "## Pack\nBrush dirt when dry; air dry away from direct heat.\n\n## Bottle\nHand wash; dry with cap removed.\n\n## Repair first\nA worn cap or buckle is a replacement part, not a reason to replace the product."), "Add a repair-first recommendation"]
      ] }
    ],
    maintenance: { name: "fix-money-display", title: "Consistent price display", commits: [
      ["src/cart.js", 'export function subtotal(items) { return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0) }\nexport function formatMoney(cents) { if (!Number.isSafeInteger(cents)) throw new TypeError("Expected integer cents"); return `$${(cents / 100).toFixed(2)}` }\n', "Reject fractional cents at the display boundary"],
      ["examples/cart.json", json({ currency: "USD", items: [{ product: "pack-ridge", priceCents: 4800, quantity: 1 }, { product: "bottle-steel", priceCents: 2400, quantity: 2 }], expectedSubtotalCents: 9600, expectedDisplay: "$96.00" }), "Document a hand-worked cart example"],
      ["docs/content-guide.md", markdown("Writing for Trail Supply", "Lead with practical use. State capacity and material. Keep prices in integer cents; reject fractional cents at formatting boundaries. Display two decimal places consistently: $24.00, not $24."), "Record the price-formatting rule"]
    ] },
    explorations: [
      { name: "explore-loyalty", title: "Loyalty concept", files: [["proposals/loyalty.md", markdown("Loyalty proposal", "Draft: reward repairs and repeat use before purchase frequency. No points are issued.")], ["proposals/loyalty-rules.json", json({ status: "proposal", actions: ["repair", "return-packaging"], openQuestion: "Can rewards avoid encouraging unnecessary purchases?" })]] },
      { name: "explore-rental", title: "Rental concept", files: [["proposals/rental.md", markdown("Rental proposal", "Draft weekend day-pack rental with a return inspection and transparent damage policy.")], ["proposals/rental-inventory.json", json({ status: "proposal", products: ["pack-ridge"], minimumDays: 2 })]] }
    ]
  },
  compiler: {
    title: "Pocket expression language",
    description: "A small arithmetic language with a readable grammar, tokenizer, parser, examples and design notes.",
    purpose: "Explain a language front end through tiny source files and hand-worked examples.",
    files: {
      "grammar.ebnf": 'expression = term, { ("+" | "-"), term };\nterm = factor, { ("*" | "/"), factor };\nfactor = number | "(", expression, ")";\nnumber = digit, { digit };\n',
      "src/tokenize.js": 'export function tokenize(source) { const tokens = []; let offset = 0; while (offset < source.length) { if (/\\s/.test(source[offset])) { offset++; continue } const number = source.slice(offset).match(/^\\d+/); if (number) { tokens.push({ kind: "number", value: Number(number[0]), offset }); offset += number[0].length; continue } const value = source[offset]; if (!"+-*/()".includes(value)) throw new SyntaxError(`Unexpected character at ${offset}`); tokens.push({ kind: value, value, offset }); offset++ } return tokens }\n',
      "src/parse.js": 'export function parse(tokens) { let i = 0; function factor() { const token = tokens[i++]; if (token?.kind === "number") return { kind: "number", value: token.value }; if (token?.kind === "(") { const node = expression(); if (tokens[i++]?.kind !== ")") throw new SyntaxError("Expected closing parenthesis"); return node } throw new SyntaxError("Expected number or parenthesis") } function term() { let node = factor(); while (["*", "/"].includes(tokens[i]?.kind)) { const op = tokens[i++].kind; node = { kind: "binary", op, left: node, right: factor() } } return node } function expression() { let node = term(); while (["+", "-"].includes(tokens[i]?.kind)) { const op = tokens[i++].kind; node = { kind: "binary", op, left: node, right: term() } } return node } const result = expression(); if (i !== tokens.length) throw new SyntaxError("Unexpected trailing token"); return result }\n',
      "src/evaluate.js": 'export function evaluate(node) { if (node.kind === "number") return node.value; const a = evaluate(node.left), b = evaluate(node.right); if (node.op === "+") return a + b; if (node.op === "-") return a - b; if (node.op === "*") return a * b; if (node.op === "/") return a / b; throw new Error("Unknown operator") }\n',
      "examples/arithmetic.expr": "2 + 3 * 4\n",
      "examples/grouping.expr": "(2 + 3) * 4\n",
      "fixtures/expressions.json": json([{ source: "2 + 3 * 4", expected: 14 }, { source: "(2 + 3) * 4", expected: 20 }, { source: "9 - 3 - 1", expected: 5 }]),
      "docs/ast.md": markdown("Abstract syntax tree", "Numbers have kind=number and a value. Binary nodes have an operator, left child and right child. Grouping controls tree shape; parentheses are not retained."),
      "docs/pipeline.md": markdown("Pipeline", "Source text \u2192 tokens with offsets \u2192 syntax tree \u2192 recursive evaluation. Keep lexical errors separate from syntax errors."),
      "docs/limits.md": markdown("Deliberate limits", "Only integer literals and arithmetic are accepted. Results use JavaScript numbers. There are no variables, loops, imports or filesystem access."),
      "decisions/001-precedence.md": markdown("Decision 001: arithmetic precedence", "Multiplication and division bind more tightly than addition and subtraction. Operators at the same level associate left."),
      "package.json": packageFile("compiler")
    },
    features: [
      { name: "feature-tree-printer", title: "Tree inspection", commits: [
        ["src/print.js", 'export function print(node) { return node.kind === "number" ? String(node.value) : `(${print(node.left)} ${node.op} ${print(node.right)})` }\n', "Add an explicitly parenthesized tree printer"],
        ["fixtures/printed.json", json([{ source: "2 + 3 * 4", expected: "(2 + (3 * 4))" }]), "Show the printed precedence structure"],
        ["docs/printing.md", markdown("Tree printing", "The printer emits every binary operation in parentheses. It is an inspection tool, not a source formatter."), "Explain why inspection output keeps parentheses"],
        ["fixtures/printed.json", json([{ source: "2 + 3 * 4", expected: "(2 + (3 * 4))" }, { source: "9 - 3 - 1", expected: "((9 - 3) - 1)" }]), "Document left-associative tree output"]
      ] },
      { name: "feature-diagnostics-guide", title: "Diagnostic examples", commits: [
        ["fixtures/errors.json", json([{ source: "2 @ 3", stage: "tokenize", expectedMessage: "Unexpected character at 2" }]), "Capture an invalid-character example"],
        ["docs/diagnostics.md", markdown("Diagnostics", "Report the stage, a stable summary and an offset where one is known. Offsets refer to JavaScript string indices in this small example."), "Define the diagnostic vocabulary"],
        ["fixtures/errors.json", json([{ source: "2 @ 3", stage: "tokenize", expectedMessage: "Unexpected character at 2" }, { source: "(2 + 3", stage: "parse", expectedMessage: "Expected closing parenthesis" }, { source: "2 3", stage: "parse", expectedMessage: "Unexpected trailing token" }]), "Add missing-delimiter and trailing-token cases"]
      ] },
      { name: "feature-postfix-format", title: "Postfix output", commits: [
        ["src/postfix.js", 'export function postfix(node) { return node.kind === "number" ? [String(node.value)] : [...postfix(node.left), ...postfix(node.right), node.op] }\n', "Emit postfix instructions from the tree"],
        ["fixtures/postfix.json", json([{ source: "2 + 3 * 4", expected: ["2", "3", "4", "*", "+"] }]), "Add a worked stack-order example"],
        ["docs/postfix.md", markdown("Postfix output", "Visit left, visit right, emit the operator. For 2 + 3 * 4 the output is 2 3 4 * +. This representation needs no parentheses."), "Explain the relation between trees and stack order"]
      ] }
    ],
    maintenance: { name: "fix-nonfinite-evaluation", title: "Finite arithmetic", commits: [
      ["src/evaluate.js", 'export function evaluate(node) { if (node.kind === "number") return node.value; const a = evaluate(node.left), b = evaluate(node.right); if (node.op === "/" && b === 0) throw new RangeError("Division by zero"); const result = node.op === "+" ? a + b : node.op === "-" ? a - b : node.op === "*" ? a * b : node.op === "/" ? a / b : NaN; if (!Number.isFinite(result)) throw new RangeError("Non-finite arithmetic result"); return result }\n', "Refuse division by zero and non-finite results"],
      ["fixtures/arithmetic-errors.json", json([{ source: "4 / 0", expectedMessage: "Division by zero" }, { source: "0 / 0", expectedMessage: "Division by zero" }]), "Document the division boundary examples"],
      ["docs/limits.md", markdown("Deliberate limits", "Only integer literals and arithmetic are accepted. Results use finite JavaScript numbers; division by zero is refused. Precision is not arbitrary. There are no variables, loops, imports or filesystem access."), "State finite-result and precision limitations"]
    ] },
    explorations: [
      { name: "explore-variables", title: "Named values", files: [["proposals/variables.md", markdown("Variables proposal", "Draft: resolve names against an explicitly provided environment; never read process globals.")], ["proposals/environment.json", json({ status: "proposal", bindings: { width: 12, height: 8 }, example: "width * height" })]] },
      { name: "explore-constant-folding", title: "Constant folding", files: [["proposals/folding.md", markdown("Constant folding proposal", "Draft: replace a binary subtree with a number only when both children are constants and evaluation succeeds.")], ["proposals/folding-cases.json", json([{ before: "(2 + (3 * 4))", proposedAfter: "14", status: "proposal" }])]] }
    ]
  },
  sdk: {
    title: "Collection client cookbook",
    description: "A dependency-free JavaScript client and integration recipes for the museum collection contract.",
    purpose: "Make HTTP client behavior explicit without requiring an online service.",
    files: {
      "src/client.js": "export function createClient({ baseUrl, fetch: request = globalThis.fetch }) { const base = new URL(baseUrl); return { async getObject(id) { const response = await request(new URL(`objects/${encodeURIComponent(id)}`, base)); if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json() } } }\n",
      "src/query.js": "export function queryString(values) { const params = new URLSearchParams(); for (const [key, value] of Object.entries(values)) if (value !== undefined && value !== null) params.set(key, String(value)); return params.toString() }\n",
      "examples/get-object.mjs": 'import { createClient } from "../src/client.js"\nconst fetch = async () => ({ ok: true, json: async () => ({ id: "obj-101", title: "Coastal sketch" }) })\nconst client = createClient({ baseUrl: "https://museum.example.invalid/", fetch })\nconsole.log(await client.getObject("obj-101"))\n',
      "examples/object.json": json({ id: "obj-101", title: "Coastal sketch", year: 1912 }),
      "types/index.d.ts": "export interface CollectionObject { id: string; title: string; year?: number }\nexport interface CollectionClient { getObject(id: string): Promise<CollectionObject> }\n",
      "docs/quickstart.md": markdown("Quick start", "Import createClient, supply a base URL ending with /, then request an object by stable ID. The included example injects a local fake response; it sends no network request."),
      "docs/transport.md": markdown("Transport injection", "Pass a fetch-compatible function to control transport. Keep test doubles local; production callers can use the platform fetch implementation."),
      "docs/security.md": markdown("Client security", "Use HTTPS for remote services. Do not put credentials in query parameters. Treat server error messages as data, not executable markup."),
      "docs/compatibility.md": markdown("Compatibility", "Source uses JavaScript modules, URL and URLSearchParams. A caller provides a fetch implementation if the runtime lacks one."),
      "fixtures/responses.json": json({ object: { status: 200, body: { id: "obj-101", title: "Coastal sketch" } }, missing: { status: 404, body: { error: { code: "OBJECT_NOT_FOUND", message: "Not found", requestId: "example-001" } } } }),
      "decisions/001-injection.md": markdown("Decision 001: inject transport", "Keep client logic independent of network availability so examples can remain deterministic and inspectable."),
      "package.json": packageFile("sdk")
    },
    features: [
      { name: "feature-page-iterator", title: "Pagination helper", commits: [
        ["src/pages.js", "export async function* pages(load) { let cursor; do { const page = await load(cursor); yield page.items; cursor = page.nextCursor } while (cursor != null) }\n", "Add an async iterator for collection pages"],
        ["examples/pages.mjs", 'import { pages } from "../src/pages.js"\nconst load = async cursor => cursor == null ? { items: ["obj-101"], nextCursor: "second" } : { items: ["obj-102"], nextCursor: null }\nfor await (const items of pages(load)) console.log(items)\n', "Demonstrate pagination using local data"],
        ["docs/pagination.md", markdown("Pagination", "The iterator yields one item array per page. It requests pages lazily and stops when nextCursor is null or absent."), "Document lazy page consumption"],
        ["types/pages.d.ts", "export interface Page<T> { items: T[]; nextCursor: string | null }\nexport declare function pages<T>(load: (cursor?: string) => Promise<Page<T>>): AsyncGenerator<T[]>;\n", "Describe the page helper contract in types"]
      ] },
      { name: "feature-error-type", title: "Structured errors", commits: [
        ["src/errors.js", 'export class ApiError extends Error { constructor(status, { code, message, requestId }) { super(message); this.name = "ApiError"; this.status = status; this.code = code; this.requestId = requestId } }\n', "Represent API errors without parsing message text"],
        ["docs/errors.md", markdown("Error handling", "Use status for HTTP behavior, code for application handling and requestId for support. Avoid retrying every error automatically."), "Explain the three error identifiers"],
        ["examples/error.mjs", 'import { ApiError } from "../src/errors.js"\nconst error = new ApiError(404, { code: "OBJECT_NOT_FOUND", message: "Not found", requestId: "example-001" })\nconsole.log({ status: error.status, code: error.code, requestId: error.requestId })\n', "Add an offline structured-error example"]
      ] },
      { name: "feature-abort-guide", title: "Cancellation recipe", commits: [
        ["src/signals.js", 'export function timeoutSignal(milliseconds) { if (!Number.isSafeInteger(milliseconds) || milliseconds < 0) throw new RangeError("Expected nonnegative integer milliseconds"); return AbortSignal.timeout(milliseconds) }\n', "Provide an explicit request deadline signal"],
        ["docs/cancellation.md", markdown("Cancellation", "Pass a caller-owned AbortSignal to the transport. Cancellation belongs to the request; it should not destroy a shared client."), "Explain request-scoped cancellation"],
        ["docs/cancellation.md", markdown("Cancellation", "Pass a caller-owned AbortSignal to transport. Cancellation belongs to one request. AbortSignal.timeout supplies a deadline on supported runtimes. An abort does not prove a remote mutation was rolled back; reconcile uncertain results before retrying."), "Document uncertain outcomes after cancellation"]
      ] }
    ],
    maintenance: { name: "fix-base-url", title: "Safe base URL joining", commits: [
      ["src/client.js", 'export function createClient({ baseUrl, fetch: request = globalThis.fetch }) { const base = new URL(baseUrl); if (!["http:", "https:"].includes(base.protocol)) throw new TypeError("Expected HTTP base URL"); if (!base.pathname.endsWith("/")) base.pathname += "/"; return { async getObject(id) { if (!id || id === "." || id === "..") throw new TypeError("Expected object ID"); const response = await request(new URL(`objects/${encodeURIComponent(id)}`, base)); if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json() } } }\n', "Preserve a base path when the trailing slash is omitted"],
      ["fixtures/url-cases.json", json([{ base: "https://museum.example.invalid/api", id: "obj-101", expected: "https://museum.example.invalid/api/objects/obj-101" }, { base: "https://museum.example.invalid/api/", id: "a/b", expected: "https://museum.example.invalid/api/objects/a%2Fb" }]), "Record path-preserving URL examples"],
      ["docs/quickstart.md", markdown("Quick start", "Import createClient and supply an HTTP(S) base URL. The client preserves a base path with or without its final slash. Stable object IDs are encoded as one path segment. The bundled example injects a local response and sends no network request."), "Update quick start for normalized base paths"]
    ] },
    explorations: [
      { name: "explore-python-client", title: "Python API sketch", files: [["proposals/python.md", markdown("Python client proposal", "Draft an equivalent synchronous API with injectable transport and matching error fields.")], ["proposals/python-example.py", '# API sketch only; no implementation is shipped.\n# client = CollectionClient(base_url="https://museum.example.invalid/")\n# object = client.get_object("obj-101")\n']] },
      { name: "explore-retry-policy", title: "Retry boundaries", files: [["proposals/retries.md", markdown("Retry proposal", "Draft: retry bounded idempotent reads on transient errors. Never replay an uncertain write without an idempotency contract.")], ["proposals/retries.json", json({ status: "proposal", maximumAttempts: 3, retryableStatuses: [429, 503], mutations: "disabled" })]] }
    ]
  },
  design: {
    title: "Field Notes design kit",
    description: "A compact visual language with tokens, SVG assets and browsable component specimens.",
    purpose: "Make a consistent, readable interface without a framework dependency.",
    files: {
      "tokens/base.json": json({ spacing: { small: 8, medium: 16, large: 24 }, radius: 6, type: { body: 16, heading: 28 }, colors: { ink: "#17212b", paper: "#ffffff", accent: "#145c38" } }),
      "styles/tokens.css": ":root { --space: 1rem; --radius: .375rem; --ink: #17212b; --paper: #fff; --accent: #145c38; font: 1rem/1.5 system-ui, sans-serif; color: var(--ink); background: var(--paper); }\n",
      "styles/components.css": "button, input { font: inherit; padding: .5rem .75rem; border: 1px solid currentColor; border-radius: var(--radius); } button { background: var(--accent); color: white; } :focus-visible { outline: 3px solid currentColor; outline-offset: 3px; }\n",
      "gallery.html": '<!doctype html>\n<html lang="en"><meta charset="utf-8"><title>Field Notes components</title><link rel="stylesheet" href="styles/tokens.css"><link rel="stylesheet" href="styles/components.css"><main><h1>Field Notes</h1><p>A small component specimen.</p><button>Save note</button><p><label>Notebook <input placeholder="Trail observations"></label></p></main></html>\n',
      "icons/notebook.svg": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="3" width="15" height="18" rx="2"/><path d="M9 3v18M3 7h4M3 12h4M3 17h4"/></svg>\n',
      "icons/check.svg": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 4 4L19 6"/></svg>\n',
      "docs/typography.md": markdown("Typography", "Use the system font. Body text starts at 16 px with 1.5 line height. Keep prose near 65 characters per line."),
      "docs/interaction.md": markdown("Interaction states", "Every control needs default, hover, focus and disabled states. Label the action with a verb and its object."),
      "docs/accessibility.md": markdown("Accessibility review", "Review keyboard navigation, visible focus, text contrast and labels. These are review criteria, not audit results."),
      "docs/iconography.md": markdown("Iconography", "Use a 24 \xD7 24 viewBox and currentColor. Icons supplement text; label icon-only controls in their containing interface."),
      "examples/spacing.json": json([{ name: "control-gap", token: "small", pixels: 8 }, { name: "section-gap", token: "large", pixels: 24 }]),
      "decisions/001-system-font.md": markdown("Decision 001: system font", "Accepted for this example: use the platform font to avoid downloads and preserve legibility.")
    },
    features: [
      { name: "feature-type-scale", title: "Type scale", commits: [
        ["tokens/type.json", json({ caption: 13, body: 16, subtitle: 20, title: 28 }), "Define a four-level type scale"],
        ["docs/typography.md", markdown("Typography", "Use the system font. Caption 13 px, body 16 px, subtitle 20 px, title 28 px. Use size and spacing before font weight to establish hierarchy."), "Explain the hierarchy behind the scale"],
        ["tokens/type.json", json({ caption: { size: 13, lineHeight: 1.4 }, body: { size: 16, lineHeight: 1.5 }, subtitle: { size: 20, lineHeight: 1.35 }, title: { size: 28, lineHeight: 1.2 } }), "Pair type sizes with line heights"],
        ["examples/type.html", '<!doctype html>\n<html lang="en"><meta charset="utf-8"><title>Type specimen</title><h1>Notes from the field</h1><h2>A clear place to begin</h2><p>Record observations while the details are fresh.</p><small>Updated by the notebook owner.</small></html>\n', "Add a readable type specimen"]
      ] },
      { name: "feature-form-language", title: "Form language", commits: [
        ["docs/forms.md", markdown("Forms", "Place a persistent label above each field. Explain constraints before submission."), "Define persistent field labels"],
        ["examples/form.html", '<!doctype html>\n<html lang="en"><meta charset="utf-8"><title>Form specimen</title><form><label for="name">Notebook name</label><p id="hint">Choose a short, recognizable title.</p><input id="name" aria-describedby="hint" required><button>Save notebook</button></form></html>\n', "Add an accessible notebook form specimen"],
        ["docs/forms.md", markdown("Forms", "Place persistent labels above fields. Explain constraints before submission. Place errors next to the field and preserve entered values. Disable submission only while work is in progress."), "Specify error recovery and pending states"]
      ] },
      { name: "feature-empty-states", title: "Empty states", commits: [
        ["docs/empty-states.md", markdown("Empty states", "Say what belongs here and provide one next action. A new notebook is empty, not broken."), "Describe useful empty-state language"],
        ["examples/empty-state.html", '<!doctype html>\n<html lang="en"><meta charset="utf-8"><title>Empty notebook</title><main><h1>No notes yet</h1><p>Keep observations, sketches and small discoveries together.</p><button>Add your first note</button></main></html>\n', "Add a first-use empty notebook specimen"],
        ["docs/empty-states.md", markdown("Empty states", "## First use\nExplain what belongs here and offer one next action.\n\n## No matches\nShow the current filter and a clear-filters action.\n\n## Failure\nExplain what failed and how to retry; keep saved content visible."), "Distinguish empty, filtered and failed views"]
      ] }
    ],
    maintenance: { name: "fix-focus-guidance", title: "Focus visibility", commits: [
      ["styles/components.css", "button, input { font: inherit; padding: .5rem .75rem; border: 1px solid currentColor; border-radius: var(--radius); } button { background: var(--accent); color: white; } :focus-visible { outline: 3px solid #145c38; outline-offset: 3px; } button:focus-visible { outline-color: var(--ink); }\n", "Keep button focus rings visible on paper"],
      ["docs/accessibility.md", markdown("Accessibility review", "Review keyboard navigation, labels and contrast. Focus must remain visible outside filled controls. Check the 3 px outline on paper and alternate surfaces. No audit has been executed by this fixture."), "Make the focus review criteria concrete"],
      ["decisions/002-focus-ring.md", markdown("Decision 002: external focus ring", "Use a 3 px outline with 3 px offset so focus does not depend on a filled button\u2019s text color. Validate against each surface during actual review."), "Record why focus rings sit outside controls"]
    ] },
    explorations: [
      { name: "explore-night-mode", title: "Night palette", files: [["proposals/night-mode.md", markdown("Night mode proposal", "Draft: use a warm near-black surface, preserve semantic contrast and respect the system preference.")], ["proposals/night-tokens.json", json({ status: "proposal", paper: "#171b19", ink: "#f4f5f2", accent: "#9bd7b0" })]] },
      { name: "explore-density", title: "Compact density", files: [["proposals/density.md", markdown("Compact density proposal", "Draft: reduce list spacing while preserving control hit areas and readable text.")], ["proposals/density-tokens.json", json({ status: "proposal", listGap: 4, controlMinHeight: 40 })]] }
    ]
  },
  gateway: {
    title: "Museum collection API handbook",
    description: "An API contract and request cookbook for a small museum collection; no server is required.",
    purpose: "Help an integrator browse exhibits, plan visits and understand errors.",
    files: {
      "openapi.yaml": 'openapi: 3.1.0\ninfo:\n  title: Collection API\n  version: 0.1.0\npaths:\n  /objects:\n    get:\n      summary: List collection objects\n      responses:\n        "200":\n          description: A page of collection objects\n',
      "requests/list.http": "GET https://museum.example.invalid/objects?limit=2\nAccept: application/json\n",
      "examples/objects.json": json({ items: [{ id: "obj-101", title: "Coastal sketch", year: 1912 }, { id: "obj-102", title: "Clay vessel", year: 1880 }], nextCursor: null }),
      "examples/object.json": json({ id: "obj-101", title: "Coastal sketch", artist: "M. Chen", year: 1912, medium: "Graphite on paper", gallery: "East room" }),
      "examples/error.json": json({ error: { code: "OBJECT_NOT_FOUND", message: "The requested object does not exist." } }),
      "routes.json": json([{ method: "GET", path: "/objects", operation: "listObjects" }, { method: "GET", path: "/objects/{id}", operation: "getObject" }]),
      "docs/authentication.md": markdown("Authentication", "Collection reads are public in this example. Private annotations would require a scoped token. Never include tokens in a URL."),
      "docs/errors.md": markdown("Error contract", "Errors use an error object with code and message. Clients should switch on code, not parse prose."),
      "docs/versioning.md": markdown("Versioning", "Add optional fields compatibly. Rename or remove fields only in a documented major version."),
      "docs/privacy.md": markdown("Privacy", "Object examples are fictional. Requests use example.invalid and do not point at a live collection."),
      "schemas/object.json": json({ type: "object", required: ["id", "title"], properties: { id: { type: "string" }, title: { type: "string" }, year: { type: "integer" } } }),
      "decisions/001-identifiers.md": markdown("Decision 001: stable object IDs", "Use opaque stable identifiers. Titles and room assignments can change without breaking links.")
    },
    features: [
      { name: "feature-pagination-contract", title: "Cursor pagination", commits: [
        ["docs/pagination.md", markdown("Cursor pagination", "Use limit from 1 to 100. Supply nextCursor unchanged to request the next page."), "Introduce opaque cursor pagination"],
        ["examples/page.json", json({ items: [{ id: "obj-101", title: "Coastal sketch" }], nextCursor: "page-2-example" }), "Provide a page with a continuation cursor"],
        ["requests/list.http", "GET https://museum.example.invalid/objects?limit=1&cursor=page-2-example\nAccept: application/json\n", "Demonstrate a follow-up collection request"],
        ["docs/pagination.md", markdown("Cursor pagination", "Use limit from 1 to 100. Pass nextCursor unchanged. Stop when it is null. Cursors are opaque and may expire; restart listing rather than decoding one."), "Specify completion and expired-cursor behavior"]
      ] },
      { name: "feature-visit-contract", title: "Visit planning", commits: [
        ["examples/visit.json", json({ date: "2026-06-15", open: true, hours: { from: "10:00", to: "17:00", zone: "Asia/Singapore" } }), "Model opening hours with an explicit time zone"],
        ["requests/visit.http", "GET https://museum.example.invalid/visits/2026-06-15\nAccept: application/json\n", "Add a visit-planning request example"],
        ["docs/visits.md", markdown("Visit planning", "Treat dates as local museum dates. Hours include an IANA time zone. A closed date has open=false and hours=null. This is a contract example, not a current opening-hours announcement."), "Explain closed days and local date boundaries"]
      ] },
      { name: "feature-conditional-reads", title: "Conditional reads", commits: [
        ["docs/caching.md", markdown("Conditional reads", "Collection responses may provide an ETag. Send If-None-Match to avoid downloading unchanged data."), "Describe conditional collection requests"],
        ["requests/conditional.http", 'GET https://museum.example.invalid/objects/obj-101\nIf-None-Match: "object-101-rev-2"\n', "Show an opaque entity-tag request"],
        ["docs/caching.md", markdown("Conditional reads", "Keep ETags opaque and send them in If-None-Match. A 304 response has no JSON body. Cache public collection data; never share-cache private annotations."), "Define the no-body and privacy boundaries"]
      ] }
    ],
    maintenance: { name: "fix-error-shape", title: "Consistent errors", commits: [
      ["examples/error.json", json({ error: { code: "OBJECT_NOT_FOUND", message: "The requested object does not exist.", requestId: "example-request-001" } }), "Include a support-safe request identifier"],
      ["docs/errors.md", markdown("Error contract", "Every error uses {error:{code,message,requestId}}. Clients switch on code. requestId is safe to share for support; response messages must not echo tokens or database internals."), "Specify one error envelope for every endpoint"],
      ["schemas/error.json", json({ type: "object", required: ["error"], properties: { error: { type: "object", required: ["code", "message", "requestId"], properties: { code: { type: "string" }, message: { type: "string" }, requestId: { type: "string" } } } } }), "Add a machine-readable error envelope schema"]
    ] },
    explorations: [
      { name: "explore-bulk-export", title: "Bulk export", files: [["proposals/export.md", markdown("Bulk export proposal", "Draft: asynchronous exports with an expiring download link and stable schema version.")], ["proposals/export.json", json({ status: "proposal", formats: ["jsonl", "csv"], expiryHours: 24 })]] },
      { name: "explore-private-notes", title: "Private annotations", files: [["proposals/annotations.md", markdown("Annotations proposal", "Draft: collection-owner notes require authentication and are excluded from public caches.")], ["proposals/scopes.json", json({ status: "proposal", scopes: ["annotations:read", "annotations:write"] })]] }
    ]
  },
  billing: {
    title: "Workshop invoice notebook",
    description: "A small invoice ledger with explicit integer-cent calculations, sample payments and reconciliation notes.",
    purpose: "Explain a maker workshop\u2019s invoices and payment boundaries with inspectable examples.",
    files: {
      "data/invoices.csv": "invoice,customer,currency,subtotal_cents,tax_cents,total_cents\nINV-101,Sample Studio,USD,12500,1000,13500\nINV-102,Example Workshop,USD,8000,640,8640\n",
      "data/payments.csv": "payment,invoice,amount_cents,method\nPAY-101,INV-101,13500,bank\nPAY-102,INV-102,4000,bank\n",
      "data/items.json": json([{ sku: "class-pottery", description: "Introductory pottery class", unitCents: 12500 }, { sku: "repair-session", description: "Guided repair session", unitCents: 8e3 }]),
      "src/money.js": 'export function lineTotal(unitCents, quantity) { if (!Number.isSafeInteger(unitCents) || !Number.isSafeInteger(quantity) || unitCents < 0 || quantity < 0) throw new RangeError("Nonnegative integer amounts required"); return unitCents * quantity }\nexport function balance(totalCents, payments) { return totalCents - payments.reduce((sum, cents) => sum + cents, 0) }\n',
      "examples/invoice.json": json({ id: "INV-101", currency: "USD", lines: [{ sku: "class-pottery", unitCents: 12500, quantity: 1 }], subtotalCents: 12500, taxCents: 1e3, totalCents: 13500 }),
      "docs/currency.md": markdown("Currency rules", "This example handles USD with two decimal places. Store amounts in integer cents and do not add amounts from different currencies."),
      "docs/reconciliation.md": markdown("Reconciliation", "Match payments by invoice ID. INV-101 is fully matched; INV-102 has 4640 cents outstanding. These are fictional worked examples."),
      "docs/invoice-lifecycle.md": markdown("Invoice lifecycle", "Draft \u2192 issued \u2192 partially paid \u2192 paid. A correction references the original invoice; issued records are not silently rewritten."),
      "policies/refunds.md": markdown("Refund policy example", "Record refunds as separate negative adjustments linked to a payment. This is a demonstration policy, not legal or tax guidance."),
      "templates/invoice.md": markdown("Invoice template", "Invoice: {{id}}\nCustomer: {{customer}}\nCurrency: {{currency}}\nSubtotal: {{subtotal}}\nTax: {{tax}}\nTotal due: {{total}}"),
      "data/customers.json": json([{ id: "sample-studio", displayName: "Sample Studio" }, { id: "example-workshop", displayName: "Example Workshop" }]),
      "package.json": packageFile("billing")
    },
    features: [
      { name: "feature-tax-policy", title: "Worked tax policy", commits: [
        ["policies/tax.md", markdown("Example tax calculation", "Use an illustrative 8% rate. This is invented sample data, not a jurisdiction\u2019s tax rule."), "Label the illustrative tax rate"],
        ["data/tax.json", json({ illustrative: true, rateBasisPoints: 800, currency: "USD", rounding: "nearest-cent-half-up" }), "Represent the sample rate in basis points"],
        ["src/tax.js", 'export function taxCents(subtotalCents, basisPoints = 800) { if (!Number.isSafeInteger(subtotalCents) || subtotalCents < 0 || !Number.isSafeInteger(basisPoints) || basisPoints < 0) throw new RangeError("Nonnegative integer inputs required"); return Math.floor((subtotalCents * basisPoints + 5000) / 10000) }\n', "Implement the stated integer rounding example"],
        ["policies/tax.md", markdown("Example tax calculation", "Illustrative rate: 800 basis points (8%). For a 12,500-cent subtotal, tax is 1,000 cents. Round half up once at invoice subtotal. No claim is made about a real tax jurisdiction."), "Document a complete hand-worked tax example"]
      ] },
      { name: "feature-discounts", title: "Discount rules", commits: [
        ["data/discounts.json", json([{ code: "WELCOME10", basisPoints: 1e3, maximumCents: 2e3 }]), "Add a capped welcome discount example"],
        ["src/discount.js", 'export function discountCents(subtotalCents, { basisPoints, maximumCents }) { if (![subtotalCents, basisPoints, maximumCents].every(n => Number.isSafeInteger(n) && n >= 0) || basisPoints > 10000) throw new RangeError("Invalid discount inputs"); return Math.min(subtotalCents, maximumCents, Math.floor(subtotalCents * basisPoints / 10000)) }\n', "Calculate capped discounts without floating-point currency"],
        ["docs/discounts.md", markdown("Discount order", "Apply at most one coupon to the merchandise subtotal, cap it, then compute sample tax on the discounted subtotal. 12,500 cents with WELCOME10 receives a 1,250-cent discount."), "Make discount and tax ordering explicit"]
      ] },
      { name: "feature-adjustments", title: "Adjustment ledger", commits: [
        ["data/adjustments.csv", "adjustment,invoice,amount_cents,reason\nADJ-101,INV-101,-1000,Example goodwill credit\n", "Add a separate credit adjustment example"],
        ["docs/adjustments.md", markdown("Adjustment records", "An adjustment references an issued invoice and has a signed integer-cent amount. Preserve the original invoice."), "Explain immutable invoice corrections"],
        ["docs/adjustments.md", markdown("Adjustment records", "An adjustment references an issued invoice, a signed integer-cent amount and a reason. Preserve the original invoice. A credit note changes receivables; a refund records actual returned money. They are different records."), "Separate credit notes from cash refunds"]
      ] }
    ],
    maintenance: { name: "fix-payment-validation", title: "Payment validation", commits: [
      ["src/money.js", 'const valid = n => Number.isSafeInteger(n) && n >= 0\nexport function lineTotal(unitCents, quantity) { if (!valid(unitCents) || !valid(quantity) || !Number.isSafeInteger(unitCents * quantity)) throw new RangeError("Safe nonnegative integer amounts required"); return unitCents * quantity }\nexport function balance(totalCents, payments) { if (!valid(totalCents) || !payments.every(valid)) throw new RangeError("Safe nonnegative payment amounts required"); return totalCents - payments.reduce((sum, cents) => sum + cents, 0) }\n', "Validate payment amounts and line-total overflow"],
      ["examples/payment-boundaries.json", json({ illustrative: true, cases: [{ totalCents: 8640, payments: [4e3], expectedBalanceCents: 4640 }, { totalCents: 8640, payments: [9e3], expectedBalanceCents: -360 }], negativeBalanceMeaning: "Customer credit; not automatically a refund." }), "Record partial payment and overpayment examples"],
      ["docs/reconciliation.md", markdown("Reconciliation", "Match payments by invoice ID. INV-101 is paid; INV-102 has 4,640 cents outstanding. Reject fractional or negative payment inputs. A negative balance means customer credit and does not itself issue a refund. Figures are fictional worked examples."), "Clarify overpayment and invalid payment handling"]
    ] },
    explorations: [
      { name: "explore-subscriptions", title: "Recurring invoices", files: [["proposals/subscriptions.md", markdown("Recurring invoices proposal", "Draft monthly class passes. Generate separate issued invoices; never edit a prior period\u2019s ledger.")], ["proposals/subscription.json", json({ status: "proposal", cadence: "monthly", prorating: "undecided" })]] },
      { name: "explore-multi-currency", title: "Currency boundaries", files: [["proposals/currencies.md", markdown("Multi-currency proposal", "Draft: maintain independent currency ledgers and record explicit conversion transactions.")], ["proposals/currencies.json", json({ status: "proposal", currencies: ["USD", "EUR"], exchangeRateSource: null })]] }
    ]
  }
};
function projectDefinition(name6) {
  const profile = profiles[name6];
  if (!profile) throw new Error(`Unknown preset project: ${name6}`);
  const readme = markdown(profile.title, `${profile.description}

## Purpose
${profile.purpose}

## Explore
Browse the source, examples and documentation. The branch history records small file changes, merges into new release branches and publications to main. Exploration branches remain proposals.

## Execution
This preset imports files and creates history through LayerFS CLI calls. It does not run this project's code, install dependencies or produce benchmark results.`);
  const architecture = markdown("Project map", `${profile.purpose}

- Source and structured data describe the example.
- Documentation explains contracts and decisions.
- Examples contain expected behavior or hand-worked values.
- No file is evidence of an executed check unless a later real operation records it.

## History
A release publication makes the selected Branch head the next main Layer. Merge creates a separate Branch and keeps both input Branches.`);
  const features = profile.features.map((feature) => ({ name: feature.name, title: feature.title, commits: feature.commits.map(([path2, content, message]) => write(path2, content, message)) }));
  return {
    name: name6,
    title: profile.title,
    description: profile.description,
    files: {
      "README.md": readme,
      "docs/architecture.md": architecture,
      "examples/README.md": markdown("Reading examples", "Examples are fictional inputs, expected behavior or hand-worked calculations. They are not evidence of executed checks. Compare their assumptions with the source and documentation."),
      "proposals/README.md": markdown("Exploration branches", "Unfinished ideas live on the project\u2019s explore-* Branches. Browse those Branches to inspect proposal documents and data. A proposal is not part of a published release merely because its Branch exists."),
      ...profile.files
    },
    foundation: [
      write("docs/project-map.md", markdown("Where to begin", `${profile.purpose}

Start with README.md, then inspect docs/architecture.md and the example data.`), "Add an orientation map for the project"),
      write("docs/decisions.md", markdown("Working decisions", `Keep ${profile.title} self-contained and inspectable. Prefer explicit contracts, fictional data and small readable examples. State assumptions beside the relevant artifact.`), "Record the scope and assumptions of the example"),
      write("CHANGELOG.md", markdown("Changes", `## 0.1
Initial ${profile.title} content, source examples and project documentation. No execution results are claimed.`), "Describe the first browsable release")
    ],
    features,
    maintenance: { name: profile.maintenance.name, title: profile.maintenance.title, commits: profile.maintenance.commits.map(([path2, content, message]) => write(path2, content, message)) },
    releases: [
      write("CHANGELOG.md", markdown("Changes", `## 0.2
Combine ${features[0].title.toLowerCase()} and ${features[1].title.toLowerCase()} in a new release Branch.

## 0.1
Initial browsable project content.`), `Document the ${features[0].title.toLowerCase()} and ${features[1].title.toLowerCase()} release`),
      write("CHANGELOG.md", markdown("Changes", `## 0.3
Add ${features[2].title.toLowerCase()} and incorporate ${profile.maintenance.title.toLowerCase()} from current main.

## 0.2
Combine ${features[0].title.toLowerCase()} and ${features[1].title.toLowerCase()}.

## 0.1
Initial browsable project content.

These entries describe committed file changes, not executed application checks.`), `Document the ${features[2].title.toLowerCase()} release and maintenance integration`)
    ],
    explorations: profile.explorations.map((exploration) => ({ name: exploration.name, title: exploration.title, commits: exploration.files.map(([path2, content], index) => write(path2, content, `${index ? "Sketch" : "Propose"} ${exploration.title.toLowerCase()}${index ? " data and examples" : ""}`)) }))
  };
}

// src/host/presets/recipe/presets.js
var CONTENT_VERSION = 4;
var stores = [
  { name: "demo-studio", machine: "native", projects: ["website", "design"] },
  { name: "demo-services", kind: "postgresql", database: "demo_services", machine: "docker", projects: ["gateway", "billing"] },
  { name: "demo-build-cache", machine: "demo-build", projects: ["compiler", "sdk"] },
  { name: "demo-experiments", kind: "postgresql", database: "demo_experiments", machine: "demo-research", projects: ["embeddings", "evaluation"] }
];
var vms = [
  { name: "demo-build", platform: "lima", cpus: 2, memory: "4G", disk: "20G" },
  { name: "demo-research", platform: "lima", cpus: 2, memory: "4G", disk: "20G" }
];
var starterStores = [{ name: "demo-starter", machine: "docker", projects: ["bookshelf"] }];
var presets = {
  quickstart: { description: "One SQLite Store on the Docker machine with one project and a deep history of feature Branches, merges and releases. No virtual machines.", machines: ["docker"], stores: starterStores, sandboxes: false, concurrentHistory: true },
  studio: { concurrentHistory: true, description: "Four machines; two SQLite Stores and two PostgreSQL Stores (a Docker PostgreSQL server the preset runs) with eight unequal project workloads and dense real commit, branch and publication histories. No sandboxes or workspaces.", machines: ["native", "docker", ...vms], stores, sandboxes: false }
};
var legacyPresets = {
  starter: { description: "Native + Docker, three stores and six projects; no new VMs.", machines: ["native", "docker"], stores: [...stores.slice(0, 2), { ...stores[2], machine: "native" }] },
  native: { description: "One native machine, one store and two projects; useful for quick checks.", machines: ["native"], stores: stores.slice(0, 1) },
  empty: { description: "An initialized real home with built-in machines and no fixture stores.", machines: ["native", "docker"], stores: [] }
};
function presetOf(name6) {
  if (!Object.hasOwn(presets, name6) && !Object.hasOwn(legacyPresets, name6)) throw new Error(`Unknown preset ${name6}.`);
  return structuredClone(presets[name6] ?? legacyPresets[name6]);
}
function sourceFiles(name6) {
  return structuredClone(projectDefinition(name6).files);
}

// src/host/presets/recipe/recipe.js
var recipe_exports = {};
__export(recipe_exports, {
  assertProjectStep: () => assertProjectStep,
  baseProjectHistoryPlan: () => baseProjectHistoryPlan,
  baseProjectHistorySteps: () => baseProjectHistorySteps,
  machineCreateArgs: () => machineCreateArgs,
  projectHistoryPlan: () => projectHistoryPlan,
  projectHistorySteps: () => projectHistorySteps,
  resolveHistoryStep: () => resolveHistoryStep,
  stepEffect: () => stepEffect
});

// src/host/presets/recipe/dense-recipe.js
var DENSE_TIERS = Object.freeze({
  design: { tier: 1, cycles: 9, topics: ["tokens", "components", "accessibility"] },
  billing: { tier: 2, cycles: 10, topics: ["invoices", "pricing", "rounding"] },
  sdk: { tier: 3, cycles: 12, topics: ["requests", "pagination", "validation"] },
  evaluation: { tier: 4, cycles: 15, topics: ["queries", "rubrics", "judgments"] },
  embeddings: { tier: 5, cycles: 19, topics: ["corpus", "chunking", "provenance"] },
  compiler: { tier: 6, cycles: 24, topics: ["grammar", "diagnostics", "arithmetic"] },
  gateway: { tier: 7, cycles: 30, topics: ["routes", "policies", "limits"] },
  website: { tier: 8, cycles: 38, topics: ["catalog", "delivery", "care"] }
});
var TIERS = Object.freeze({ ...DENSE_TIERS, bookshelf: { tier: 0, cycles: 2, topics: ["catalog", "loans", "search"] } });
var padded = (n) => String(n).padStart(3, "0");
function denseCycleBranches(name6, cycle) {
  const { topics } = TIERS[name6], suffix = padded(cycle);
  return { a: `${topics[0]}-${suffix}`, b: `${topics[1]}-${suffix}`, maintenance: `${topics[2]}-${suffix}`, integration: `integration-${suffix}`, release: `release-${suffix}` };
}
function revision(definition, name6, cycle, lane, index) {
  const topic = TIERS[name6].topics[{ a: 0, b: 1, maintenance: 2 }[lane]];
  const artifact = ["specification", "examples", "policy", "review"][(index - 1) % 4];
  const path2 = `docs/revision-${topic}-${artifact}.${artifact === "review" ? "md" : "json"}`;
  const revision2 = (cycle - 1) * { a: 80, b: 80, maintenance: 49 }[lane] + index;
  const content = artifact === "review" ? `# ${definition.title}: ${topic} review

Release cycle ${cycle}; authored revision ${revision2}.

Review ${topic} against its specification, examples and boundary policy. Preserve source identifiers, reject invalid values and explain ambiguous cases before publishing. These are fixture review instructions; no application test or evaluation was executed.
` : JSON.stringify({ project: name6, topic, artifact, releaseCycle: cycle, revision: revision2, fixture: true, execution: "not-run", cases: Array.from({ length: 4 }, (_, i) => ({ id: `${topic}-${i + 1}`, order: i + 1, enabled: (revision2 + i) % 3 !== 0, boundary: revision2 * (i + 1) % 97, policy: ["accept-valid", "reject-invalid", "request-clarification"][(revision2 + i) % 3] })) }, null, 2) + "\n";
  return { path: path2, content, message: `Revise ${topic} ${artifact}: cycle ${cycle}, revision ${revision2}` };
}
function releaseRevision(definition, cycle, lane, index) {
  return { path: `docs/history-${lane}.md`, content: `# ${definition.title}: ${lane}

Release cycle ${cycle}; publication revision ${index}.

${lane === "integration" ? "Integrates the two feature streams while preserving both histories." : "Integrates the published features and the maintenance stream from its earlier main base."}

This authored fixture release records source changes. It does not claim an application build, test or evaluation was executed.
`, message: `Prepare ${lane} publication ${cycle}.${index}` };
}
function denseHistoryExtension(name6, definition, { cycles } = {}) {
  const original = TIERS[name6];
  const profile = original && { ...original, cycles: cycles ?? original.cycles };
  if (!profile) throw new Error(`No dense history tier for ${name6}`);
  if (!Number.isInteger(profile.cycles) || profile.cycles < 1 || profile.cycles > original.cycles) throw new Error(`Invalid cycle limit ${profile.cycles} for ${name6}`);
  const branches = [], expectedMain = {};
  for (let cycle = 1; cycle <= profile.cycles; cycle++) branches.push(...Object.values(denseCycleBranches(name6, cycle)));
  for (const [lane, count4] of [["a", 80], ["b", 80], ["maintenance", 49]]) for (let index = 1; index <= count4; index++) {
    const change = revision(definition, name6, profile.cycles, lane, index);
    expectedMain[change.path] = change.content;
  }
  for (const [lane, count4] of [["integration", 26], ["release", 27]]) {
    const change = releaseRevision(definition, profile.cycles, lane, count4);
    expectedMain[change.path] = change.content;
  }
  return { tier: profile.tier, cycles: profile.cycles, branches, expectedMain };
}
function denseHistorySteps(store, name6, definition, { cycles = TIERS[name6].cycles } = {}) {
  const steps = [], project = `${store}/${name6}`;
  const fork = (key, branch) => steps.push({ key, argv: ["branch", "fork", project, branch, "main"], expect: { commit: true } });
  const write2 = (key, branch, change) => steps.push({ key, argv: ["file", "write", project, branch, `/${change.path}`, "--message", change.message], input: change.content, expect: { commit: true } });
  const merge = (key, branch, left, right) => steps.push({ key, argv: ["branch", "merge", project, left, right, "--into", branch, "--message", `Integrate ${left} and ${right}`], expect: { commit: true, divergent: true } });
  const publish = (key, branch) => steps.push({ key, argv: ["branch", "publish", project, branch], expect: { commit: true, notForced: true } });
  for (let cycle = 1; cycle <= cycles; cycle++) {
    const key = `dense.${padded(cycle)}`, branch = denseCycleBranches(name6, cycle);
    for (const lane of ["a", "b", "maintenance"]) fork(`${key}.${lane}.fork`, branch[lane]);
    for (const lane of ["a", "b"]) for (let index = 1; index <= 80; index++) write2(`${key}.${lane}.write.${index}`, branch[lane], revision(definition, name6, cycle, lane, index));
    merge(`${key}.integration.merge`, branch.integration, branch.a, branch.b);
    publish(`${key}.integration.publish.0`, branch.integration);
    for (let index = 1; index <= 26; index++) {
      write2(`${key}.integration.write.${index}`, branch.integration, releaseRevision(definition, cycle, "integration", index));
      publish(`${key}.integration.publish.${index}`, branch.integration);
    }
    for (let index = 1; index <= 49; index++) write2(`${key}.maintenance.write.${index}`, branch.maintenance, revision(definition, name6, cycle, "maintenance", index));
    merge(`${key}.release.merge`, branch.release, "main", branch.maintenance);
    publish(`${key}.release.publish.0`, branch.release);
    for (let index = 1; index <= 27; index++) {
      write2(`${key}.release.write.${index}`, branch.release, releaseRevision(definition, cycle, "release", index));
      publish(`${key}.release.publish.${index}`, branch.release);
    }
  }
  for (const step of steps) {
    const [, cycleText, lane, operation, indexText] = step.key.split(".");
    const cycle = Number(cycleText), key = `dense.${cycleText}`, index = Number(indexText);
    const forks = ["a", "b", "maintenance"].map((value) => `${key}.${value}.fork`);
    step.lane = lane;
    if (operation === "fork") step.dependsOn = cycle === 1 ? [] : [`dense.${padded(cycle - 1)}.release.publish.27`];
    else if (["a", "b", "maintenance"].includes(lane)) step.dependsOn = index === 1 ? forks : [`${key}.${lane}.write.${index - 1}`];
    else if (operation === "merge") step.dependsOn = lane === "integration" ? [`${key}.a.write.80`, `${key}.b.write.80`] : [`${key}.integration.publish.26`, `${key}.maintenance.write.49`];
    else if (operation === "write") {
      step.dependsOn = [`${key}.${lane}.publish.${index - 1}`];
    } else if (operation === "publish") {
      step.commitFrom = index === 0 ? `${key}.${lane}.merge` : `${key}.${lane}.write.${index}`;
      step.dependsOn = [step.commitFrom, ...index > 0 ? [`${key}.${lane}.publish.${index - 1}`] : []];
      step.argv.push("--at", `<commit:${step.commitFrom}>`);
    }
  }
  return steps;
}

// src/host/presets/recipe/recipe.js
function baseProjectHistoryPlan(name6) {
  const definition = projectDefinition(name6);
  const [a, b, c] = definition.features;
  const branches = ["release-0.1", a.name, b.name, "release-0.2", definition.maintenance.name, c.name, "release-0.3", ...definition.explorations.map((item) => item.name)];
  const expectedMain = { ...definition.files };
  for (const writes of [definition.foundation, a.commits, b.commits, [definition.releases[0]], definition.maintenance.commits, c.commits, [definition.releases[1]]]) {
    for (const write2 of writes) expectedMain[write2.path] = write2.content;
  }
  return { definition, branches, expectedMain, commits: 24, writes: 22, merges: 2, publications: 4, layers: 5, cliCalls: 35, commands: 35, density: "base", tier: null, cycles: 0, history: { commits: 24, branches: 9, merges: 2, publishes: 4, layers: 5 } };
}
var plans = /* @__PURE__ */ new Map();
function projectHistoryPlan(name6, { density = "dense", cycles, executionMode = "filesystem" } = {}) {
  if (!["dense", "base"].includes(density)) throw new Error(`Unknown project density ${density}`);
  if (!["filesystem", "mixed"].includes(executionMode)) throw new Error(`Unknown execution mode ${executionMode}`);
  if (executionMode === "mixed" && density !== "dense") throw new Error("Mixed mode requires dense project history.");
  const key = `${executionMode}:${density}:${name6}:${cycles ?? "full"}`;
  if (plans.has(key)) return plans.get(key);
  const base = baseProjectHistoryPlan(name6);
  if (density === "base") {
    Object.assign(base, { executionMode, authoredRevisions: base.writes, workspaceRevisions: 0, ...MIXED_CAPACITY });
    plans.set(key, base);
    return base;
  }
  const extension = denseHistoryExtension(name6, base.definition, { cycles }), n = extension.cycles;
  const counts = { commits: base.commits + 264 * n, writes: base.writes + 262 * n, merges: base.merges + 2 * n, publications: base.publications + 55 * n, layers: base.layers + 55 * n, cliCalls: base.cliCalls + 322 * n };
  const plan = { ...base, ...counts, density, tier: extension.tier, cycles: n, branches: [...base.branches, ...extension.branches], expectedMain: { ...base.expectedMain, ...extension.expectedMain } };
  plan.executionMode = executionMode;
  plan.authoredRevisions = plan.writes;
  plan.workspaceRevisions = executionMode === "mixed" ? 96 * n : 0;
  plan.workspaceSessions = executionMode === "mixed" ? plan.workspaceRevisions / MIXED_REVISIONS_PER_SESSION : 0;
  plan.revisionsPerWorkspace = executionMode === "mixed" ? MIXED_REVISIONS_PER_SESSION : null;
  plan.mixedRecipeVersion = executionMode === "mixed" ? MIXED_RECIPE_VERSION : null;
  Object.assign(plan, MIXED_CAPACITY);
  if (executionMode === "mixed") plan.cliCalls += 192 * n + 1;
  plan.commands = plan.cliCalls;
  plan.history = { commits: plan.commits, branches: plan.branches.length, merges: plan.merges, publishes: plan.publications, layers: plan.layers };
  plans.set(key, plan);
  return plan;
}
function projectHistorySteps(store, name6, { density = "dense", cycles, executionMode = "filesystem" } = {}) {
  const base = baseProjectHistorySteps(store, name6);
  if (density === "base") return base;
  if (density !== "dense") throw new Error(`Unknown project density ${density}`);
  const extension = denseHistorySteps(store, name6, projectHistoryPlan(name6, { density, cycles }).definition, { cycles });
  for (const step of extension) if (!step.dependsOn.length) step.dependsOn = [base.at(-1).key];
  const steps = [...base, ...extension];
  return executionMode === "mixed" ? mixedHistorySteps(steps, name6) : steps;
}
function baseProjectHistorySteps(store, name6) {
  const { definition } = baseProjectHistoryPlan(name6);
  const project = `${store}/${name6}`, steps = [];
  const fork = (key, branch, from = "main") => steps.push({ key, argv: ["branch", "fork", project, branch, from], expect: { commit: true } });
  const writes = (key, branch, changes) => changes.forEach((change, index) => steps.push({ key: `${key}.${index + 1}`, argv: ["file", "write", project, branch, `/${change.path}`, "--message", change.message], input: change.content, expect: { commit: true } }));
  const merge = (key, branch, left, right, message) => steps.push({ key, argv: ["branch", "merge", project, left, right, "--into", branch, "--message", message], expect: { commit: true, divergent: true } });
  const publish = (key, branch) => steps.push({ key, argv: ["branch", "publish", project, branch], expect: { commit: true, notForced: true } });
  const [a, b, c] = definition.features;
  fork("foundation.fork", "release-0.1");
  writes("foundation.write", "release-0.1", definition.foundation);
  publish("foundation.publish", "release-0.1");
  fork("feature-a.fork", a.name);
  writes("feature-a.write", a.name, a.commits);
  fork("feature-b.fork", b.name);
  writes("feature-b.write", b.name, b.commits);
  merge("release-a.merge", "release-0.2", a.name, b.name, `Integrate ${a.title} and ${b.title}`);
  writes("release-a.write", "release-0.2", [definition.releases[0]]);
  publish("release-a.publish", "release-0.2");
  fork("maintenance.fork", definition.maintenance.name);
  fork("feature-c.fork", c.name);
  writes("maintenance.write", definition.maintenance.name, definition.maintenance.commits);
  publish("maintenance.publish", definition.maintenance.name);
  writes("feature-c.write", c.name, c.commits);
  merge("release-b.merge", "release-0.3", "main", c.name, `Integrate ${c.title} with the maintenance release`);
  writes("release-b.write", "release-0.3", [definition.releases[1]]);
  publish("release-b.publish", "release-0.3");
  definition.explorations.forEach((item, index) => {
    fork(`exploration-${index + 1}.fork`, item.name);
    writes(`exploration-${index + 1}.write`, item.name, item.commits);
  });
  for (const [index, step] of steps.entries()) {
    step.dependsOn = index ? [steps[index - 1].key] : [];
    step.lane = step.argv[3];
  }
  return steps;
}
function assertProjectStep(step, result) {
  const expected = step.expect;
  if (!expected) return;
  const fail6 = (reason) => {
    throw Object.assign(new Error(`Preset step ${step.key}: ${reason}`), { code: "PresetVerificationFailed" });
  };
  if (expected.exitCode !== void 0 && result?.exit_code !== expected.exitCode) fail6(`expected exit code ${expected.exitCode}, received ${result?.exit_code}`);
  if (expected.commit && (typeof result?.commit !== "string" || !result.commit)) fail6("expected a Commit, LayerFS answered none");
  if (expected.commit && result.unchanged === true) fail6("expected a new Commit, LayerFS answered unchanged");
  if (expected.ok && result?.ok !== true) fail6("expected ok");
  if (expected.divergent && result.fast_forward === true) fail6("expected a divergent merge with a new Commit");
  if (expected.notForced && result.previous != null) fail6("publication replaced a newer main head");
}
function stepEffect(step, result) {
  const call = `${step.argv[0]}.${step.argv[1]}`;
  const commit = typeof result?.commit === "string" && result.commit && result.unchanged !== true ? result.commit : null;
  return {
    commit: ["file.write", "workspace.commit", "branch.merge"].includes(call) ? commit : null,
    branch: !!commit && ["branch.fork", "branch.merge"].includes(call),
    layer: !!commit && call === "branch.publish",
    workspaceRevision: !!step.workspaceRevision && call === "workspace.commit" && !!commit
  };
}
function machineCreateArgs(machine) {
  return ["machine", "create", machine.name, machine.platform, "--cpus", String(machine.cpus), "--memory", machine.memory, "--disk", machine.disk];
}
function resolveHistoryStep(step, receipts) {
  if (!step.commitFrom) return step.argv;
  const head = receipts[step.commitFrom]?.commit;
  if (typeof head !== "string" || !head) throw new Error(`Missing immutable Commit receipt for ${step.key}; no publication was attempted.`);
  return [...step.argv.slice(0, -1), head];
}

// src/host/presets/recipe/project-verification.js
var fail = (message) => {
  throw Object.assign(new Error(message), { code: "PresetVerificationFailed" });
};
var PAGE_SIZE = 20;
var idOf = (value) => typeof value === "string" ? value : value?.id;
async function savedHistory(query, project, branch) {
  const items = [], ids = /* @__PURE__ */ new Set();
  let cursor = null;
  do {
    const result = await query(["commit", "list", project, branch, "--detail", "--limit", String(PAGE_SIZE), ...cursor ? ["--cursor", cursor] : []]);
    if (!Array.isArray(result?.items)) fail(`${project}/${branch}: incomplete saved history page`);
    for (const item of result.items) {
      const id = item.commit;
      if (!id || ids.has(id)) fail(`${project}/${branch}: duplicate or missing saved history ID`);
      ids.add(id);
      items.push({ ...item, id });
    }
    const next = result.next_cursor ?? null;
    if (next !== null && (next === cursor || !result.items.length)) fail(`${project}/${branch}: saved history pagination did not advance`);
    cursor = next;
  } while (cursor !== null);
  return items;
}
function stepBranches(argv) {
  const [, call, , a, b] = argv;
  if (call === "merge") return { branch: argv[argv.indexOf("--into") + 1], left: a, right: b };
  return { branch: a, left: b, right: argv[5] };
}
async function verifyProject(query, store, name6, receipt, options = {}) {
  const project = `${store}/${name6}`, plan = projectHistoryPlan(name6, options), receipts = receipt?.steps ?? receipt;
  const list4 = async (argv) => {
    const items = [];
    let cursor = null;
    do {
      const result = await query([...argv, "--limit", String(PAGE_SIZE), ...cursor ? ["--cursor", cursor] : []]);
      if (!Array.isArray(result?.items)) fail(`${project}: invalid list response for ${argv.join(" ")}`);
      items.push(...result.items);
      const next = result.next_cursor ?? null;
      if (next !== null && (next === cursor || !result.items.length)) fail(`${project}: resource pagination did not advance`);
      cursor = next;
    } while (cursor !== null);
    return items;
  };
  const branches = [];
  for (let cursor = null, first = true; first || cursor !== null; first = false) {
    const result = await query(["branch", "list", project, "--limit", String(PAGE_SIZE), ...cursor ? ["--cursor", cursor] : []]);
    if (!Array.isArray(result?.items)) fail(`${project}: invalid list response for branch list`);
    branches.push(...result.items);
    const next = result.next_cursor ?? null;
    if (next !== null && (next === cursor || !result.items.length)) fail(`${project}: resource pagination did not advance`);
    cursor = next;
  }
  const byName = new Map(branches.map((branch) => [branch.branch, branch]));
  const expectedNames = ["main", ...plan.branches];
  if (branches.length !== expectedNames.length || byName.size !== expectedNames.length || expectedNames.some((branch) => !byName.has(branch))) fail(`${project}: expected ${expectedNames.length} retained branches`);
  const histories = /* @__PURE__ */ new Map(), unique2 = /* @__PURE__ */ new Map();
  for (const branch of plan.branches) {
    const commits = await savedHistory(query, project, branch);
    histories.set(branch, commits);
    for (const commit of commits) unique2.set(commit.id, commit);
    if (commits[0]?.id !== byName.get(branch).commit) fail(`${project}/${branch}: saved head does not match history`);
  }
  if (unique2.size !== plan.commits) fail(`${project}: expected ${plan.commits} distinct Commits, found ${unique2.size}`);
  const main = await savedHistory(query, project, "main");
  if (main.length !== plan.layers) fail(`${project}: expected ${plan.layers} complete main publication Layers, found ${main.length}`);
  const steps = projectHistorySteps(store, name6, options).map((step) => step.historyArgv ? { ...step, argv: step.historyArgv } : step), ownCounts = /* @__PURE__ */ new Map();
  for (const step of steps) if (step.argv[1] === "write" || step.argv[1] === "merge") {
    const { branch } = stepBranches(step.argv);
    ownCounts.set(branch, (ownCounts.get(branch) ?? 0) + 1);
  }
  const own = /* @__PURE__ */ new Map(), assignedIds = /* @__PURE__ */ new Set();
  for (const [branch, count4] of ownCounts) {
    const history = histories.get(branch);
    if (history.length < count4) fail(`${project}/${branch}: missing own-branch saved Commits`);
    const records = history.slice(0, count4).reverse();
    own.set(branch, { records, index: 0 });
    for (const record of records) {
      if (assignedIds.has(record.id)) fail(`${project}: distinct recipe mutations share a saved Commit`);
      assignedIds.add(record.id);
    }
  }
  if (assignedIds.size !== plan.commits || [...unique2.keys()].some((id) => !assignedIds.has(id))) fail(`${project}: saved graph does not match unique recipe mutations`);
  const heads = /* @__PURE__ */ new Map(), bases = /* @__PURE__ */ new Map(), publicationRows = [...main].reverse();
  let mainLayer = publicationRows.shift()?.id, publications = 0, merges = 0, writes = 0;
  const receiptIds = /* @__PURE__ */ new Set();
  for (const step of steps) {
    const call = step.argv[1], { branch, left, right } = stepBranches(step.argv), result = receipts?.[step.key];
    if (receipts) assertProjectStep(step, result);
    if (call === "fork") {
      heads.set(branch, left === "main" ? null : heads.get(left));
      bases.set(branch, left === "main" ? mainLayer : bases.get(left));
      continue;
    }
    if (call === "write" || call === "merge") {
      const sequence = own.get(branch), record = sequence.records[sequence.index++];
      if (call === "merge") {
        merges++;
        const expectedParent = left === "main" ? null : heads.get(left);
        if ((idOf(record.parent) ?? null) !== (expectedParent ?? null) || idOf(record.second_parent) !== heads.get(right)) fail(`${project}/${branch}: merge did not preserve both expected parents`);
        bases.set(branch, left === "main" ? mainLayer : bases.get(left));
      } else {
        writes++;
        if ((idOf(record.parent) ?? null) !== (heads.get(branch) ?? null) || record.second_parent != null) fail(`${project}/${branch}: write Commit has unexpected ancestry`);
      }
      if (record.base && idOf(record.base) !== bases.get(branch)) fail(`${project}/${branch}: saved Commit has an unexpected base Layer`);
      heads.set(branch, record.id);
      if (receipts) {
        if (result.commit !== record.id) fail(`${project}/${branch}: successful mutation receipt does not match saved Commit history`);
        receiptIds.add(result.commit);
      }
      continue;
    }
    if (call === "publish") {
      const layer = publicationRows.shift(), source = heads.get(branch);
      if (!layer || layer.source_branch !== branch || layer.source_commit !== source) fail(`${project}/${branch}: publication provenance does not match the recipe`);
      if (layer.parent != null && idOf(layer.parent) !== mainLayer) fail(`${project}: main publication Layer chain is broken`);
      if (receipts && result.commit !== layer.id) fail(`${project}/${branch}: publication receipt has a different main Commit`);
      mainLayer = layer.id;
      publications++;
    }
  }
  if (publicationRows.length || publications !== plan.publications || merges !== plan.merges || writes !== plan.writes) fail(`${project}: saved graph operation counts do not match the recipe`);
  if (receipts && receiptIds.size !== unique2.size) fail(`${project}: successful mutation receipts do not match all saved Commits`);
  let files = 0;
  const readExact = async (branch, path2, content) => {
    const result = await query(["file", "read", project, branch, `/${path2}`, "--detail"]);
    if (result.text !== content || result.next_line != null || result.line_truncated) fail(`${project}/${branch}/${path2}: saved content does not match the recipe`);
    files++;
  };
  for (const [path2, content] of Object.entries(plan.expectedMain)) await readExact("main", path2, content);
  const mainPaths = new Set((await list4(["file", "glob", project, "main", "**", "/"])).map((path2) => String(path2).replace(/^\//, "")));
  const expectedPaths = new Set(Object.keys(plan.expectedMain));
  for (const path2 of Object.keys(plan.expectedMain)) {
    const parts = path2.split("/");
    for (let depth = 1; depth < parts.length; depth++) expectedPaths.add(parts.slice(0, depth).join("/"));
  }
  if (mainPaths.size !== expectedPaths.size || [...mainPaths].some((path2) => !expectedPaths.has(path2))) fail(`${project}: main file and directory inventory does not match the recipe`);
  for (const item of plan.definition.explorations) {
    const expected = new Map(item.commits.map((commit) => [commit.path, commit.content]));
    for (const [path2, content] of expected) await readExact(item.name, path2, content);
    for (const path2 of expected.keys()) if (!Object.hasOwn(plan.expectedMain, path2) && mainPaths.has(path2)) fail(`${project}: unfinished ${item.name}/${path2} was unexpectedly published`);
  }
  return { project, tier: plan.tier, cycles: plan.cycles, branches: branches.length, commits: unique2.size, merges, publications, layers: main.length, filesVerified: files, publicationReceiptsVerified: !!receipts };
}
function projectVerificationSteps(store, name6, options = {}) {
  const project = `${store}/${name6}`, plan = projectHistoryPlan(name6, options), commands = [];
  const add = (argv) => commands.push({ argv });
  add(["branch", "list", project, "--limit", String(PAGE_SIZE)]);
  for (const branch of [...plan.branches, "main"]) add(["commit", "list", project, branch, "--detail", "--limit", String(PAGE_SIZE)]);
  for (const path2 of Object.keys(plan.expectedMain)) add(["file", "read", project, "main", `/${path2}`, "--detail"]);
  add(["file", "glob", project, "main", "**", "/", "--limit", String(PAGE_SIZE)]);
  for (const item of plan.definition.explorations) for (const path2 of new Set(item.commits.map((commit) => commit.path))) add(["file", "read", project, item.name, `/${path2}`, "--detail"]);
  return commands;
}

// src/host/presets/recipe/scheduler.js
async function runBounded(items, concurrency, run2) {
  let next = 0, failure;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (!failure && next < items.length) {
      const item = items[next++];
      try {
        await run2(item, { shouldStop: () => !!failure });
      } catch (error2) {
        failure ??= error2;
      }
    }
  });
  await Promise.all(workers);
  if (failure) throw failure;
}

// src/host/presets/recipe/history-scheduler.js
var DEFAULT_HISTORY_LIMITS = Object.freeze({ concurrency: 12, perStore: 3, perProject: 3 });
async function runHistoryDAG(tasks, execute2, { concurrency = DEFAULT_HISTORY_LIMITS.concurrency, perStore = DEFAULT_HISTORY_LIMITS.perStore, perProject = DEFAULT_HISTORY_LIMITS.perProject } = {}) {
  for (const [name6, value] of Object.entries({ concurrency, perStore, perProject })) if (!Number.isInteger(value) || value < 1) throw new Error(`Invalid history ${name6}: ${value}`);
  const projects = tasks.map((task) => {
    const nodes = new Map(task.steps.map((step) => [step.key, { step, waiting: step.dependsOn.length, children: [] }]));
    if (nodes.size !== task.steps.length) throw new Error(`Duplicate history step in ${task.project}`);
    for (const node of nodes.values()) for (const dependency of node.step.dependsOn) {
      const parent = nodes.get(dependency);
      if (!parent) throw new Error(`Missing history dependency ${dependency}`);
      parent.children.push(node);
    }
    const counts = new Map([...nodes.values()].map((node) => [node, node.waiting]));
    const roots = [...nodes.values()].filter((node) => !node.waiting), queue = [...roots];
    for (let index = 0; index < queue.length; index++) for (const child of queue[index].children) {
      counts.set(child, counts.get(child) - 1);
      if (!counts.get(child)) queue.push(child);
    }
    if (queue.length !== nodes.size) throw new Error(`Cyclic history dependencies in ${task.project}`);
    return { task, ready: roots, running: 0 };
  });
  const active = /* @__PURE__ */ new Set(), stores2 = /* @__PURE__ */ new Map();
  let cursor = 0, failure;
  while (true) {
    let launched = false;
    if (!failure && active.size < concurrency) {
      for (let inspected = 0; inspected < projects.length; inspected++) {
        const index = (cursor + inspected) % projects.length, project = projects[index];
        if (!project.ready.length || project.running >= perProject || (stores2.get(project.task.store) ?? 0) >= perStore) continue;
        const node = project.ready.shift(), store = project.task.store;
        project.running++;
        stores2.set(store, (stores2.get(store) ?? 0) + 1);
        const pending2 = Promise.resolve().then(() => execute2(project.task, node.step)).then(() => {
          for (const child of node.children) if (--child.waiting === 0) project.ready.push(child);
        }, (error2) => {
          failure ??= error2;
        }).finally(() => {
          project.running--;
          stores2.set(store, stores2.get(store) - 1);
          active.delete(pending2);
        });
        active.add(pending2);
        cursor = (index + 1) % projects.length;
        launched = true;
        break;
      }
    }
    if (launched) continue;
    if (!active.size) break;
    await Promise.race(active);
  }
  if (failure) throw failure;
}

// src/host/presets/recipe/step-journal.js
var step_journal_exports = {};
__export(step_journal_exports, {
  StepJournal: () => StepJournal
});
import { appendFileSync, existsSync as existsSync8, lstatSync as lstatSync3, readFileSync as readFileSync7, writeFileSync as writeFileSync5 } from "node:fs";
var StepJournal = class {
  constructor(path2) {
    this.path = path2;
    this.records = 0;
  }
  load(legacy = {}) {
    const steps = { ...legacy }, journalKeys = /* @__PURE__ */ new Set();
    if (existsSync8(this.path)) {
      if (lstatSync3(this.path).isSymbolicLink()) throw new Error("The preset step journal must not be a symlink.");
      const text6 = readFileSync7(this.path, "utf8");
      if (text6 && !text6.endsWith("\n")) throw new Error("The preset step journal ends with an incomplete receipt. Inspect the journal and the LayerFS inventory; mutations will not be replayed.");
      for (const line of text6.split("\n")) {
        if (!line) continue;
        const record = JSON.parse(line);
        if (record.v !== 1 || typeof record.key !== "string" || !record.step?.status) throw new Error("The preset step journal is malformed. Inspect it before continuing.");
        steps[record.key] = record.step;
        journalKeys.add(record.key);
        this.records++;
      }
    } else {
      writeFileSync5(this.path, "", { mode: 384, flag: "wx" });
    }
    for (const [key, step] of Object.entries(legacy)) if (!journalKeys.has(key)) this.append(key, step);
    return steps;
  }
  append(key, step) {
    appendFileSync(this.path, `${stringify({ v: 1, key, step })}
`, { mode: 384 });
    this.records++;
  }
  clear() {
    writeFileSync5(this.path, "", { mode: 384 });
    this.records = 0;
  }
  metadata() {
    return { version: 1, file: this.path.split("/").at(-1), records: this.records };
  }
};

// src/host/presets/inventory.js
var fail2 = (message) => {
  throw new Error(message);
};
var KEY = { machine: "machine", store: "store", sandbox: "sandbox" };
var rowOf = (family, row) => ({ ...row, name: row[KEY[family]] ?? row.name, ...family === "store" ? { kind: row.engine ?? row.kind } : {} });
var CliInventory = class {
  constructor(driver) {
    this.driver = driver;
  }
  async query(argv) {
    return this.driver.invoke(argv, { read: true });
  }
  /** Every row of `machine`, `store` or `sandbox list --detail`, by cursor (store and machine lists are not paged). */
  async inventory(family) {
    const items = [];
    let cursor = null;
    do {
      const paged = family === "sandbox";
      const result = await this.query([family, "list", "--detail", ...paged ? ["--limit", "1000", ...cursor ? ["--cursor", cursor] : []] : []]);
      const values = result?.items;
      if (!Array.isArray(values)) fail2(`Cannot verify cleanup: invalid ${family} inventory.`);
      items.push(...values.map((row) => rowOf(family, row)));
      const next = paged ? result.next_cursor ?? null : null;
      if (next !== null && (typeof next !== "string" || next === cursor)) fail2(`Cannot verify cleanup: invalid ${family} pagination.`);
      cursor = next;
    } while (cursor !== null);
    return items;
  }
  /**
   * `sandbox get <name> --detail` (unpaged: at most 16 Workspaces), each
   * Workspace with `ws` (its handle) and `name`. A blocked or broken Sandbox
   * answers no Workspaces: `incomplete` with `allowDown`, else a failure.
   */
  async sandboxDetails(name6, { allowDown = false } = {}) {
    const result = await this.query(["sandbox", "get", name6, "--detail"]);
    const down = result?.state === "blocked" || result?.state === "broken" ? result.reason ?? result.blocked_by?.reason ?? result.state : null;
    if (down && allowDown) return { ...result, workspaces: [], incomplete: true };
    if (down || !Array.isArray(result?.workspaces)) fail2(`Sandbox ${name6} cannot be fully inspected: ${down ?? "invalid workspace inventory"}.`);
    const workspaces = result.workspaces.map((w) => ({ ...w, ws: w.workspace, name: String(w.workspace).slice(String(w.workspace).indexOf(":") + 1) }));
    return { ...result, workspaces };
  }
};

// src/host/presets/postgresql.js
import { execFile } from "node:child_process";
import { createHash as createHash6, randomBytes } from "node:crypto";
import { existsSync as existsSync9, mkdirSync as mkdirSync7, readFileSync as readFileSync8, writeFileSync as writeFileSync6 } from "node:fs";
import { createServer } from "node:net";
import { join as join8 } from "node:path";
var POSTGRES_IMAGE = "postgres:17";
var RESTART_POLICY = "unless-stopped";
var isPostgresql = (store) => store?.kind === "postgresql";
var storeMachines = (store) => [store.machine];
var usesMachine = (store, name6) => storeMachines(store).includes(name6);
var fail3 = (message, code2 = "Failed") => {
  throw Object.assign(new Error(message), { code: code2 });
};
var DATABASE = /^[a-z_][a-z0-9_]{0,62}$/;
function dockerCli(env = process.env) {
  if (env.DSH_LAYERFS_DOCKER) return env.DSH_LAYERFS_DOCKER;
  const home = env.HOME ?? "";
  return ["/usr/local/bin/docker", "/opt/homebrew/bin/docker", join8(home, ".docker/bin/docker")].find((path2) => existsSync9(path2)) ?? "docker";
}
function run(file, args, { timeout = 12e4 } = {}) {
  return new Promise((resolve11, reject) => {
    const PATH = [process.env.PATH, "/usr/local/bin", "/opt/homebrew/bin"].filter(Boolean).join(":");
    execFile(file, args, { timeout, env: { ...process.env, PATH }, maxBuffer: 4 << 20 }, (error2, stdout, stderr) => {
      if (error2) reject(Object.assign(new Error(`${String(stderr || error2.message).trim()}`), { code: "Failed", exitCode: error2.code }));
      else resolve11(String(stdout));
    });
  });
}
var freePort = () => new Promise((resolve11, reject) => {
  const server = createServer();
  server.once("error", reject);
  server.listen(0, "127.0.0.1", () => {
    const { port } = server.address();
    server.close(() => resolve11(port));
  });
});
var PresetPostgres = class {
  constructor({ state, docker = dockerCli(), exec = run, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) }) {
    this.dir = join8(state, "postgresql");
    this.container = `dsh-layerfs-preset-pg-${createHash6("sha256").update(state).digest("hex").slice(0, 10)}`;
    this.docker = docker;
    this.exec = exec;
    this.sleep = sleep;
  }
  get passwordFile() {
    return join8(this.dir, "password");
  }
  /** The saved LayerFS login the preset's Stores share (2.0 `store save-auth`). */
  get authName() {
    return "dsh-preset-postgres";
  }
  /** The password LayerFS gets on stdin when the login is saved. */
  password() {
    return readFileSync8(this.passwordFile, "utf8").trim();
  }
  /** A Store's address: 2.0 keeps the user in the saved login, never in the URL. */
  url(port, database) {
    if (!DATABASE.test(database)) fail3(`Invalid preset database name ${database}.`, "InvalidInput");
    return `postgresql://127.0.0.1:${port}/${database}`;
  }
  /** The server this state folder recorded, without touching Docker (for the command plan). */
  recorded() {
    try {
      return JSON.parse(readFileSync8(join8(this.dir, "server.json"), "utf8"));
    } catch {
      return null;
    }
  }
  async available() {
    try {
      await this.exec(this.docker, ["info", "--format", "{{.ServerVersion}}"], { timeout: 2e4 });
      return null;
    } catch (error2) {
      return error2.message || "Docker is not running";
    }
  }
  dockerRun(args, options) {
    return this.exec(this.docker, args, options);
  }
  /** The container exists, runs and accepts connections; answers `{ container, port }`. */
  async ensure() {
    if (this.ready) return this.ready;
    mkdirSync7(this.dir, { recursive: true, mode: 448 });
    if (!existsSync9(this.passwordFile)) writeFileSync6(this.passwordFile, randomBytes(18).toString("base64url"), { mode: 384 });
    const password = readFileSync8(this.passwordFile, "utf8").trim();
    let state = null, policy = null;
    try {
      [state = null, policy = null] = (await this.dockerRun(["inspect", "--format", "{{.State.Status}} {{.HostConfig.RestartPolicy.Name}}", this.container])).trim().split(/\s+/);
    } catch {
      state = null;
    }
    if (state === null) {
      const envFile = join8(this.dir, "container.env");
      writeFileSync6(envFile, `POSTGRES_PASSWORD=${password}
`, { mode: 384 });
      const port2 = await freePort();
      await this.dockerRun(["run", "-d", "--name", this.container, "--label", "dsh-layerfs.preset=postgresql", "--env-file", envFile, "--restart", RESTART_POLICY, "-p", `127.0.0.1:${port2}:5432`, POSTGRES_IMAGE], { timeout: 6e5 });
    } else {
      if (policy !== RESTART_POLICY) await this.dockerRun(["update", "--restart", RESTART_POLICY, this.container]);
      if (state !== "running") await this.dockerRun(["start", this.container]);
    }
    const published = (await this.dockerRun(["port", this.container, "5432/tcp"])).split("\n").map((line) => /127\.0\.0\.1:(\d+)/.exec(line)?.[1]).find(Boolean);
    if (!published) fail3(`PostgreSQL container ${this.container} publishes no 127.0.0.1 port. Remove it and build again.`);
    const port = Number(published);
    for (let tries = 0; ; tries++) {
      try {
        await this.dockerRun(["exec", this.container, "pg_isready", "-U", "postgres", "-h", "127.0.0.1"], { timeout: 1e4 });
        break;
      } catch (error2) {
        if (tries >= 90) fail3(`PostgreSQL container ${this.container} did not become ready: ${error2.message}`);
        await this.sleep(1e3);
      }
    }
    writeFileSync6(join8(this.dir, "server.json"), JSON.stringify({ container: this.container, port, image: POSTGRES_IMAGE }), { mode: 384 });
    this.ready = { container: this.container, port };
    return this.ready;
  }
  /** An empty database `name`, dropping one left by an earlier build (only on the preset's own server). */
  async freshDatabase(name6) {
    if (!DATABASE.test(name6)) fail3(`Invalid preset database name ${name6}.`, "InvalidInput");
    await this.ensure();
    await this.dockerRun(["exec", this.container, "psql", "-U", "postgres", "-v", "ON_ERROR_STOP=1", "-c", `DROP DATABASE IF EXISTS "${name6}" WITH (FORCE)`, "-c", `CREATE DATABASE "${name6}"`]);
  }
};

// src/host/presets/runner.js
var TOOL = "dsh-layerfs-presets";
var missing = (error2) => ["NotFound", "NoSuchProject", "NoSuchStore", "NoSuchBranch", "NoSuchSandbox"].includes(error2.code);
var rows = (value, field = "items") => Array.isArray(value) ? value : value?.[field] ?? [];
var fail4 = (message) => {
  throw new Error(message);
};
var uncertain = (error2) => error2.code === "Unknown" || error2.transport === "transport-unknown" || error2.detail?.attempted === true;
var PRESET_HISTORY_LIMITS = Object.freeze({ ...DEFAULT_HISTORY_LIMITS, perStore: 1 });
var DemoRunner = class extends CliInventory {
  constructor({ state, home, adoptHome = false, preset = "studio", driver, sandboxes, report = console.log, progress = () => {
  }, historyDensity = "dense", historyCycles, executionMode = "filesystem", historySchedule = "parallel", historyConcurrency = PRESET_HISTORY_LIMITS.concurrency, historyStoreConcurrency = PRESET_HISTORY_LIMITS.perStore, historyProjectConcurrency = PRESET_HISTORY_LIMITS.perProject, postgres }) {
    super(driver);
    this.state = resolve3(state);
    this.home = home ? resolve3(home) : join9(this.state, "home-2");
    this.adoptHome = adoptHome;
    this.file = join9(this.state, "demo-fixtures.json");
    this.journalFile = join9(this.state, "demo-steps.ndjson");
    this.lock = join9(this.state, "demo-fixtures.lock");
    this.presetName = preset;
    this.preset = presetOf(preset);
    this.driver = driver;
    this.postgres = postgres ?? new PresetPostgres({ state: this.state });
    if (!["filesystem", "mixed"].includes(executionMode)) throw new Error(`Unknown execution mode ${executionMode}`);
    this.executionMode = executionMode;
    this.mixedPools = /* @__PURE__ */ new Map();
    this.historyOptions = { density: historyDensity, cycles: historyCycles, executionMode };
    if (!["parallel", "serial"].includes(historySchedule)) throw new Error(`Unknown history schedule ${historySchedule}`);
    this.historySchedule = historySchedule;
    this.historyLimits = { concurrency: historyConcurrency, perStore: historyStoreConcurrency, perProject: historyProjectConcurrency };
    for (const [name6, value] of Object.entries(this.historyLimits)) if (!Number.isInteger(value) || value < 1) throw new Error(`Invalid history ${name6}: ${value}`);
    if (historyConcurrency > 16) throw new Error("History concurrency cannot exceed 16 CLI processes.");
    this.sandboxesExplicit = sandboxes !== void 0;
    this.sandboxes = this.preset.sandboxes === false ? false : sandboxes ?? true;
    this.report = report;
    this.progress = (value, force = false) => {
      const now = Date.now();
      if (!force && value.stage === this.lastProgressStage && value.completed !== value.total && now - (this.lastProgressAt ?? 0) < 250) return;
      this.lastProgressAt = now;
      this.lastProgressStage = value.stage;
      if (value.stage === "verifying" && this.historyTasks && !value.tasks) value = { ...value, tasks: this.historyTasks };
      progress(value);
      if (this.manifest?.presetOperation?.state === "running") {
        this.manifest.presetOperation.progress = value;
        this.save();
      }
    };
  }
  plan() {
    return { preset: this.presetName, description: this.preset.description, executionMode: this.executionMode, sandboxLimit: 3, workspaceLimit: 16, state: this.state, home: this.home, machines: this.preset.machines, stores: this.preset.stores, projects: this.preset.stores.reduce((n, s) => n + s.projects.length, 0), sandboxes: this.executionMode === "mixed" ? this.preset.stores.reduce((n, store) => n + store.projects.length, 0) : this.sandboxes ? this.preset.stores.length : 0, workspaces: this.executionMode === "mixed" ? this.preset.stores.reduce((n, store) => n + store.projects.length * 2, 0) : this.sandboxes ? this.preset.stores.length * 2 : 0, journal: this.journalFile };
  }
  save() {
    const temporary = `${this.file}.${process.pid}.tmp`;
    const { steps, ...snapshot } = this.manifest;
    writeFileSync7(temporary, stringify({ ...snapshot, steps: {}, ...this.journal ? { stepJournal: this.journal.metadata() } : {} }), { mode: 384 });
    renameSync5(temporary, this.file);
  }
  acquire() {
    mkdirSync8(this.state, { recursive: true, mode: 448 });
    if (lstatSync4(this.state).isSymbolicLink()) fail4("The demo state must be a real directory, not a symlink.");
    let fd;
    try {
      fd = openSync3(this.lock, "wx", 384);
    } catch (error2) {
      if (error2.code !== "EEXIST") throw error2;
      const previous = readFileSync9(this.lock, "utf8");
      let owner;
      try {
        owner = JSON.parse(previous);
      } catch {
        fail4("The demo lock is malformed; inspect it before continuing.");
      }
      try {
        process.kill(owner.pid, 0);
        fail4(`Another demo operation is running (PID ${owner.pid}).`);
      } catch (e) {
        if (e.code !== "ESRCH") throw e;
      }
      if (readFileSync9(this.lock, "utf8") !== previous) fail4("The demo lock changed; try the command again.");
      unlinkSync3(this.lock);
      fd = openSync3(this.lock, "wx", 384);
    }
    writeFileSync7(fd, JSON.stringify({ pid: process.pid, at: Date.now() }));
    closeSync3(fd);
    this.locked = true;
  }
  release() {
    if (this.locked) {
      unlinkSync3(this.lock);
      this.locked = false;
    }
  }
  load(create = false) {
    if (existsSync10(this.home) && lstatSync4(this.home).isSymbolicLink()) fail4("The demo home must not be a symlink.");
    if (existsSync10(this.file)) {
      this.manifest = JSON.parse(readFileSync9(this.file, "utf8"));
      if (this.manifest.tool !== TOOL || this.manifest.version !== 1 || this.manifest.preset !== this.presetName && this.command !== "reset" || this.manifest.state !== realpathSync3(this.state)) fail4("The demo ownership manifest does not match this state and preset. Use a separate state directory for each preset.");
      if (this.preset.sandboxes !== false && !this.sandboxesExplicit && typeof this.manifest.sandboxes === "boolean") this.sandboxes = this.manifest.sandboxes;
      if (this.sandboxesExplicit && this.manifest.sandboxes !== void 0 && this.preset.sandboxes !== false && this.manifest.sandboxes !== this.sandboxes && this.command !== "reset") fail4("Changing sandbox configuration requires reset; setup does not silently remove existing sandboxes.");
    } else {
      if (!create) fail4("No demo ownership manifest. Run setup or preview first; an existing LayerFS home will not be adopted.");
      if (!this.adoptHome && existsSync10(this.home) && readdirSync4(this.home).length) fail4("Refusing to adopt a nonempty LayerFS home without a demo ownership manifest. Choose a fresh --state directory.");
      this.manifest = { tool: TOOL, version: 1, id: randomUUID4(), preset: this.presetName, contentVersion: CONTENT_VERSION, executionMode: this.executionMode, ...this.executionMode === "mixed" ? { mixedRecipeVersion: MIXED_RECIPE_VERSION } : {}, sandboxes: this.sandboxes, state: realpathSync3(this.state), homeId: null, created: Date.now(), resources: { machine: {}, store: {}, sandbox: {} }, projects: {}, borrowed: {}, steps: {} };
      this.save();
    }
    if (this.manifest.stepJournal && !existsSync10(this.journalFile)) fail4("The preset step journal is missing. Inspect the state directory; mutations will not be replayed.");
    this.journal = new StepJournal(this.journalFile);
    this.manifest.steps = this.journal.load(this.manifest.steps);
    const homeFile = join9(this.home, "layerfs.json");
    if (existsSync10(homeFile)) {
      const homeId = JSON.parse(readFileSync9(homeFile, "utf8")).id;
      if (this.manifest.homeId && this.manifest.homeId !== homeId) fail4("The LayerFS home identity changed. The ownership manifest cannot authorize cleanup of this home.");
      if (!homeId) fail4("The demo home has no valid LayerFS identity.");
      this.manifest.homeId = homeId;
    } else if (this.manifest.homeId) fail4("The owned LayerFS home is missing. Preserve its manifest and inspect the state directory.");
  }
  async query(argv) {
    return this.driver.invoke(argv, { read: true });
  }
  async maybe(argv) {
    const [family, call, name6] = argv;
    if (call === "get" && ["machine", "store", "sandbox"].includes(family)) {
      if (!(await new CliInventory({ invoke: (argv2) => this.query(argv2) }).inventory(family)).some((row) => row.name === name6)) return null;
    } else if (call === "get" && family === "project") {
      let cursor = null, found = false;
      do {
        const list4 = await this.query(["project", "list", "--store", name6.split("/")[0], "--limit", "1000", ...cursor ? ["--cursor", cursor] : []]);
        found = rows(list4, "items").some((row) => row.project === name6);
        if (found) break;
        const next = list4.next_cursor ?? null;
        if (next !== null && next === cursor) fail4("Cannot read projects: pagination did not advance.");
        cursor = next;
      } while (cursor !== null);
      if (!found) return null;
    }
    try {
      return await this.query(family === "machine" && call === "get" ? [...argv, "--detail"] : argv);
    } catch (error2) {
      if (missing(error2)) return null;
      throw error2;
    }
  }
  recordStep(key, step) {
    this.journal ??= new StepJournal(this.journalFile);
    try {
      this.journal.append(key, step);
    } catch (error2) {
      error2.presetJournalFailure = true;
      throw error2;
    }
    this.manifest.steps[key] = step;
  }
  async once(key, argv, options) {
    const previous = this.manifest.steps[key];
    if (previous?.status === "done") {
      if (stringify(previous.argv) !== stringify(argv)) fail4(`Step ${key} no longer matches its recorded command. Reset before changing the recipe.`);
      return previous.result;
    }
    if (previous && ["running", "uncertain"].includes(previous.status)) fail4(`Step ${key} has no certain final result. Run status and inspect LayerFS; reset/teardown perform cleanup rather than replaying this step.`);
    this.recordStep(key, { status: "running", argv, ...options?.dependencies ? { dependencies: options.dependencies } : {}, at: Date.now(), actionId: this.action?.id });
    try {
      const result = await this.driver.invoke(argv, { ...options, onInvocation: (identity2) => {
        this.recordStep(key, { ...this.manifest.steps[key], invocationId: identity2.id, actionId: identity2.actionId });
      } });
      this.recordStep(key, { ...this.manifest.steps[key], status: "done", ended: Date.now(), result });
      return result;
    } catch (error2) {
      this.recordStep(key, { ...this.manifest.steps[key], status: uncertain(error2) || error2.presetJournalFailure || argv[0] === "project" && argv[1] === "init" && error2.code === "Failed" ? "uncertain" : "failed", code: error2.code ?? "Failed", ended: Date.now() });
      throw error2;
    }
  }
  assertSetupSettled() {
    const pending2 = Object.entries(this.manifest.steps).find(([, s]) => ["running", "uncertain"].includes(s.status));
    if (pending2) fail4(`Setup cannot replay ${pending2[0]} after an interrupted/uncertain outcome. Run status, inspect the named resource, then use reset or teardown for owned cleanup.`);
  }
  async ensureResource(family, name6, argv, { before } = {}) {
    const current = await this.maybe([family, "get", name6]);
    const owned2 = this.manifest.resources[family][name6];
    if (current) {
      if (!owned2?.owned) fail4(`${family} ${name6} already exists but is not confirmed as created by this fixture. It will not be adopted or removed.`);
      const created = current.created_at ?? current.created ?? null;
      if (owned2.created != null && created != null && owned2.created !== created) fail4(`${family} ${name6} was replaced outside the fixture. Cleanup authority is no longer certain.`);
      if (current.state === "broken" || current.state === "busy") fail4(`${family} ${name6} needs inspection (${current.state}${current.reason ? `: ${current.reason}` : current.op?.name ? `: ${current.op.name}` : ""}); no operation will be replayed.`);
      return current;
    }
    if (owned2?.owned) fail4(`Owned ${family} ${name6} is missing. Run reset to rebuild the fixture.`);
    this.manifest.resources[family][name6] = { owned: false, status: "creating" };
    this.save();
    await before?.();
    try {
      await this.once(`${family}.create:${name6}`, argv);
    } catch (error2) {
      if (family === "machine" && error2.detail?.vm_exists === true && !uncertain(error2)) {
        this.manifest.resources[family][name6] = { owned: true, created: null, status: "failed" };
        this.save();
      }
      throw error2;
    }
    this.manifest.resources[family][name6] = { owned: true, created: null, status: "ready" };
    this.save();
    const made = await this.query([family, "get", name6, ...family === "machine" ? ["--detail"] : []]);
    this.manifest.resources[family][name6] = { owned: true, created: made.created_at ?? made.created ?? null, status: "ready" };
    this.save();
    return made;
  }
  async initialize() {
    mkdirSync8(this.home, { recursive: true, mode: 448 });
    chmodSync4(this.home, 448);
    if (!existsSync10(join9(this.home, "layerfs.json"))) await this.driver.invoke(["machine", "list"]);
    this.load();
    this.save();
  }
  async preflight() {
    if (this.preset.stores.some(isPostgresql)) {
      const features = (await this.driver.discover?.())?.identity?.features;
      if (Array.isArray(features) && !features.includes("postgresql")) fail4(`This preset has PostgreSQL Stores, and the pinned LayerFS CLI was built without PostgreSQL (features: ${features.join(", ") || "none"}). Pin a runtime built with the postgresql feature (CLI and Linux bundle) in Center \u2192 Settings \u2192 Change\u2026, then build again.`);
    }
    const supported = rows((await this.query(["home", "get", "--detail", "--with", "platforms"]))?.platforms, "items");
    for (const machine of this.preset.machines) {
      const name6 = typeof machine === "string" ? machine : machine.name;
      if (!this.preset.stores.some((store) => usesMachine(store, name6))) continue;
      const platform2 = typeof machine === "string" ? machine : machine.platform;
      const row = supported.find((row2) => row2.platform === platform2);
      const needsSqlite = this.preset.stores.some((store) => !isPostgresql(store) && store.machine === name6);
      const needsPostgresql = this.preset.stores.some((store) => isPostgresql(store) && usesMachine(store, name6));
      if (row?.ready && needsPostgresql && row.postgresql?.sandbox !== true) fail4(`${platform2} cannot run PostgreSQL Store work on this host: ${row.postgresql?.reason ?? "unsupported"}. Nothing will be fabricated.`);
      if (!row?.ready || needsSqlite && !row.sqlite) fail4(`${platform2} is not ready for this preset: ${(row?.missing ?? ["unsupported on this host"]).join(", ")}. Fix the prerequisite or select a smaller preset; nothing will be fabricated.`);
    }
    if (this.preset.stores.some(isPostgresql)) {
      const problem = await this.postgres.available();
      if (problem) fail4(`This preset's PostgreSQL Stores live on a PostgreSQL server it runs in Docker, and Docker is not available: ${problem}`);
    }
    if ((this.sandboxes || this.executionMode === "mixed") && this.preset.stores.some((store) => store.machine === "native") && !this.driver.spec.daemon) fail4("Native sandboxes need a matching layerfs-daemon. Choose it in Center \u2192 Settings \u2192 Change\u2026 (or DSH_LAYERFS_DAEMON), or use Filesystem mode.");
  }
  async startMachine(name6) {
    const current = await this.query(["machine", "get", name6, "--detail"]);
    if (current.op || current.state === "busy" || current.state === "broken" && current.reason === "unresolved") fail4(`Machine ${name6} has an operation in flight or unresolved. Inspect it first.`);
    if (current.state === "ready") return;
    if (name6 === "docker" && !this.manifest.borrowed.docker) {
      this.manifest.borrowed.docker = { initially: current.state, started: true };
      this.save();
    }
    await this.once(`machine.start:${name6}:${this.commandId}`, ["machine", "start", name6]);
  }
  /** A SQLite Store created at home, or a PostgreSQL Store connected to a fresh database on the preset's server. */
  async ensureStore(store) {
    if (!isPostgresql(store)) return this.ensureResource("store", store.name, ["store", "create", store.name]);
    if (!this.manifest.resources.store[store.name]?.owned) {
      const { port } = await this.postgres.ensure();
      await this.once(`store.save-auth:${this.postgres.authName}:${this.commandId}`, ["store", "save-auth", this.postgres.authName, "--user", "postgres", "--password-stdin"], { input: this.postgres.password() });
      const argv = ["store", "connect", store.name, this.postgres.url(port, store.database), "--auth", this.postgres.authName];
      return this.ensureResource("store", store.name, argv, { before: () => this.postgres.freshDatabase(store.database) });
    }
    return this.ensureResource("store", store.name, null);
  }
  /** A SQLite Store pushed to its machine; a PostgreSQL Store is on none (its Sandboxes name their machine when they are made). */
  async placeStore(store, reportProgress = () => {
  }) {
    const placed = await this.query(["store", "get", store.name, "--detail"]);
    if (placed.op || placed.state === "busy" || placed.state === "broken") fail4(`Store ${store.name} has an operation that needs inspection.`);
    if (isPostgresql(store)) return;
    if (placed.machine !== store.machine) {
      if (placed.machine !== "native") fail4(`Store ${store.name} moved outside the fixture plan. Inspect it or reset.`);
      reportProgress(`Moving ${store.name} to ${store.machine}`);
      await this.once(`store.move:${store.name}`, ["store", "move", store.name, store.machine, "--progress"]);
    }
  }
  source(store, name6) {
    const root = join9(this.state, "demo-sources"), storeRoot = join9(root, store), folder = join9(storeRoot, name6);
    for (const path2 of [root, storeRoot, folder]) {
      if (existsSync10(path2) && lstatSync4(path2).isSymbolicLink()) fail4("Demo source paths must not be symlinks.");
      mkdirSync8(path2, { recursive: true, mode: 448 });
    }
    for (const [path2, content] of Object.entries(sourceFiles(name6))) {
      const file = join9(folder, path2);
      if (existsSync10(dirname7(file)) && lstatSync4(dirname7(file)).isSymbolicLink() || existsSync10(file) && lstatSync4(file).isSymbolicLink()) fail4("Demo source files must not be symlinks.");
      mkdirSync8(dirname7(file), { recursive: true });
      writeFileSync7(file, content);
    }
    return folder;
  }
  async ensureProject(store, name6) {
    const key = `${store}/${name6}`;
    const current = await this.maybe(["project", "get", key]);
    if (!current) {
      if (this.manifest.projects[key]) fail4(`Owned project ${key} is missing. Run reset to rebuild it.`);
      await this.once(`project.init:${key}`, ["project", "init", key, this.source(store, name6), "--progress"]);
      this.manifest.projects[key] = { seeded: false };
      this.save();
    } else if (!this.manifest.projects[key]) fail4(`Project ${key} was not created by this fixture; it will not be overwritten.`);
  }
  historyArgv(step, project) {
    if (!step.commitFrom) return step.argv;
    const dependency = this.manifest.steps[`${step.commitFrom}:${project}`];
    if (dependency?.status !== "done" || typeof dependency.result?.commit !== "string" || !dependency.result.commit) fail4(`Missing immutable Commit receipt for ${step.key}; no publication was attempted.`);
    return resolveHistoryStep(step, { [step.commitFrom]: dependency.result });
  }
  async executeHistoryStep(project, step) {
    for (const key2 of step.dependsOn ?? []) if (this.manifest.steps[`${key2}:${project}`]?.status !== "done") fail4(`Unconfirmed dependency ${key2} for ${step.key}; no mutation was attempted.`);
    const key = `${step.key}:${project}`;
    if (step.resource?.family === "sandbox") {
      const made = await this.ensureResource("sandbox", step.resource.name, step.argv);
      if (!this.manifest.steps[key]) this.recordStep(key, { status: "done", argv: step.argv, result: made, resourceReceipt: `sandbox.create:${step.resource.name}`, at: Date.now() });
      return made;
    }
    let pool, sandbox, workspace;
    if (step.argv[0] === "workspace" && step.argv[1] === "mount") {
      pool = this.mixedPools.get(project);
      if (!pool) {
        pool = new MixedSandboxPool(project);
        this.mixedPools.set(project, pool);
      }
      workspace = step.argv[step.argv.indexOf("--name") + 1];
      sandbox = pool.acquire(workspace);
      if (sandbox !== step.argv[2]) fail4("Mixed workspace allocation does not match its recorded script.");
    }
    await this.once(key, this.historyArgv(step, project), { ...step.input === void 0 ? {} : { input: step.input }, dependencies: step.dependsOn });
    const result = this.manifest.steps[key]?.result;
    assertProjectStep(step, result);
    if (step.argv[0] === "workspace" && step.argv[1] === "unmount") {
      const [box, ws] = step.argv[2].split(":");
      this.mixedPools.get(project)?.release(box, ws);
    }
    return result;
  }
  async seedProjectHistory(store, name6, onStep = () => {
  }, shouldStop = () => false) {
    const key = `${store}/${name6}`;
    if (!this.manifest.projects[key]) fail4(`Project ${key} has not been imported.`);
    const steps = projectHistorySteps(store, name6, this.historyOptions);
    if (this.manifest.projects[key].seeded) {
      for (const [index, step] of steps.entries()) onStep(index + 1, step, this.manifest.steps[`${step.key}:${key}`]?.result);
      return;
    }
    for (const [index, step] of steps.entries()) {
      if (shouldStop()) throw Object.assign(new Error("Stopped before the next CLI step because another project failed. Inspect the failed project before rebuilding."), { code: "PresetStopped" });
      const result = await this.executeHistoryStep(key, step);
      onStep(index + 1, step, result);
    }
    this.manifest.projects[key].seeded = true;
    this.save();
  }
  async seedProject(store, name6) {
    await this.ensureProject(store, name6);
    await this.seedProjectHistory(store, name6);
  }
  async setupConcurrentProjects({ advance, reportProgress }) {
    await runBounded(this.preset.stores, 2, async (store, { shouldStop }) => {
      const stopIfFailed = () => {
        if (shouldStop()) throw Object.assign(new Error("Preparation stopped because another store failed."), { code: "PresetStopped" });
      };
      reportProgress(`Preparing store ${store.name} for ${store.machine}`);
      await this.ensureStore(store);
      for (const name6 of store.projects) {
        stopIfFailed();
        reportProgress(`Importing project ${store.name}/${name6}`);
        await this.ensureProject(store.name, name6);
      }
      stopIfFailed();
      await this.placeStore(store, reportProgress);
      advance(isPostgresql(store) ? `Store ${store.name} runs on ${store.machine}` : `Store ${store.name} is placed on ${store.machine}`);
    });
    const tasks = this.preset.stores.flatMap((store) => store.projects.map((name6) => {
      const plan = projectHistoryPlan(name6, this.historyOptions);
      return { id: `${store.name}/${name6}`, project: `${store.name}/${name6}`, machine: store.machine, store: store.name, name: name6, tier: plan.tier, state: "waiting", completed: 0, total: projectHistorySteps(store.name, name6, this.historyOptions).length, commits: 0, branches: 1, layers: 1, targetCommits: plan.commits, targetBranches: plan.branches.length + 1, targetLayers: plan.layers };
    }));
    const workspaceRequired = tasks.reduce((n, task) => n + projectHistoryPlan(task.name, this.historyOptions).workspaceRevisions, 0);
    const authoredTotal = tasks.reduce((n, task) => n + projectHistoryPlan(task.name, this.historyOptions).authoredRevisions, 0);
    let workspaceCompleted = 0;
    let lastTaskProgress = 0;
    const preparation = this.preset.machines.length + this.preset.stores.length;
    const total = preparation + tasks.reduce((sum, task) => sum + task.total, 0);
    const publish = (label2, immediate = false) => {
      const now = Date.now();
      if (!immediate && now - lastTaskProgress < 250) return;
      lastTaskProgress = now;
      this.historyTasks = tasks.map(({ store, name: name6, ...task }) => ({ ...task }));
      const historyCompleted = tasks.reduce((sum, task) => sum + task.completed, 0);
      this.progress({ stage: "building", completed: preparation + historyCompleted, total, historyCompleted, historyTotal: total - preparation, workspaceCoverage: { completed: workspaceCompleted, required: workspaceRequired, total: authoredTotal }, label: label2, tasks: this.historyTasks }, true);
    };
    publish(`All stores are placed. Preparing ${tasks.length} project histories concurrently`);
    const previousConcurrency = this.driver.concurrency;
    this.driver.concurrency = this.historyLimits.concurrency;
    try {
      if (this.historySchedule === "parallel") {
        const scheduled = tasks.map((task) => ({ ...task, seeded: this.manifest.projects[task.project]?.seeded === true, steps: projectHistorySteps(task.store, task.name, this.historyOptions), commitIds: /* @__PURE__ */ new Set() }));
        try {
          await runHistoryDAG(scheduled, async (item, step) => {
            const task = tasks.find((task2) => task2.id === item.id);
            if (!task.started) {
              task.started = Date.now();
              task.state = "running";
              publish(`Building ${task.project} on ${task.machine}`, true);
            }
            try {
              let result;
              if (item.seeded) {
                const receipt = this.manifest.steps[`${step.key}:${task.project}`];
                if (receipt?.status !== "done") fail4(`Seeded project ${task.project} has no confirmed receipt for ${step.key}; inspect its journal before reset.`);
                result = receipt.result;
                assertProjectStep(step, result);
              } else result = await this.executeHistoryStep(task.project, step);
              task.completed++;
              const made = stepEffect(step, result);
              if (made.workspaceRevision) workspaceCompleted++;
              if (made.commit) item.commitIds.add(made.commit);
              task.commits = item.commitIds.size;
              if (made.branch) task.branches++;
              if (made.layer) task.layers++;
              if (task.completed === task.total) {
                this.manifest.projects[task.project].seeded = true;
                this.save();
                task.ended = Date.now();
                task.state = "completed";
              }
              publish(`Building ${task.project} on ${task.machine}`, task.completed === task.total);
            } catch (error2) {
              task.ended = Date.now();
              task.state = "failed";
              task.error = error2.message;
              task.errorCode = error2.code ?? "Failed";
              publish(`${task.project} history stopped`, true);
              throw error2;
            }
          }, this.historyLimits);
        } catch (error2) {
          for (const task of tasks) if (!["failed", "completed"].includes(task.state)) {
            task.state = "stopped";
            task.ended = Date.now();
          }
          publish("History scheduling stopped; all dispatched commands have settled", true);
          throw error2;
        }
        return;
      }
      await runBounded(tasks, 8, async (task, { shouldStop }) => {
        task.started = Date.now();
        task.state = "running";
        publish(`Building ${task.project} on ${task.machine}`, true);
        const commitIds = /* @__PURE__ */ new Set();
        try {
          await this.seedProjectHistory(task.store, task.name, (completed, step, result) => {
            task.completed = completed;
            if (step && result) {
              const made = stepEffect(step, result);
              if (made.workspaceRevision) workspaceCompleted++;
              if (made.commit) commitIds.add(made.commit);
              task.commits = commitIds.size;
              if (made.branch) task.branches++;
              if (made.layer) task.layers++;
            }
            publish(`Building ${task.project} on ${task.machine}`);
          }, shouldStop);
          task.ended = Date.now();
          task.state = "completed";
          publish(`${task.project} history is ready`, true);
        } catch (error2) {
          task.ended = Date.now();
          task.state = error2.code === "PresetStopped" ? "stopped" : "failed";
          task.error = error2.message;
          task.errorCode = error2.code ?? "Failed";
          publish(`${task.project} history stopped`, true);
          throw error2;
        }
      });
    } finally {
      this.driver.concurrency = previousConcurrency;
    }
  }
  async setup() {
    this.assertSetupSettled();
    if (Object.keys(this.manifest.projects).length && (this.manifest.executionMode ?? "filesystem") !== this.executionMode) fail4("Changing execution mode requires Build projects to reset the existing library first.");
    if (Object.keys(this.manifest.projects).length && this.executionMode === "mixed" && this.manifest.mixedRecipeVersion !== MIXED_RECIPE_VERSION) fail4("Mixed workspace sessions have changed. Use Build projects to reset and build the current two-revision workspace sessions.");
    this.manifest.executionMode = this.executionMode;
    if (this.executionMode === "mixed") this.manifest.mixedRecipeVersion = MIXED_RECIPE_VERSION;
    if (Object.keys(this.manifest.projects).length && this.manifest.contentVersion !== CONTENT_VERSION) fail4("Preset content has changed. Use Build preset to reset and prepare the new project library; existing data has been preserved.");
    await this.preflight();
    let completed = 0;
    const total = this.preset.machines.length + this.preset.stores.length + this.preset.stores.reduce((n, store) => n + (this.preset.concurrentHistory ? store.projects.reduce((sum, name6) => sum + projectHistorySteps(store.name, name6, this.historyOptions).length, 0) : store.projects.length), 0);
    const reportProgress = (label2, tasks) => this.progress({ stage: "building", completed, total, label: label2, ...tasks ? { tasks } : {} });
    const advance = (label2, tasks) => {
      completed++;
      reportProgress(label2, tasks);
    };
    this.progress({ stage: "building", completed, total, label: "Preparing preset resources" });
    for (const machine of this.preset.machines) {
      const name6 = typeof machine === "string" ? machine : machine.name;
      if (typeof machine !== "string") await this.ensureResource("machine", name6, machineCreateArgs(machine));
      if (this.preset.stores.some((store) => usesMachine(store, name6))) await this.startMachine(name6);
      advance(`Machine ${name6} ready`);
    }
    if ((this.sandboxes || this.executionMode === "mixed") && this.preset.stores.some((store) => store.machine === "native")) {
      const native = await this.query(["machine", "get", "native", "--detail"]);
      if (native.daemon !== this.driver.spec.daemon) await this.once(`native.daemon:${this.driver.spec.daemon}`, ["machine", "update", "native", "--daemon", this.driver.spec.daemon]);
    }
    if (this.preset.concurrentHistory) {
      await this.setupConcurrentProjects({ advance, reportProgress });
      return;
    }
    await runBounded(this.preset.stores, 2, async (store) => {
      await this.ensureStore(store);
      for (const project2 of store.projects) {
        this.progress({ stage: "building", completed, total, label: `Building project ${store.name}/${project2}` });
        await this.seedProject(store.name, project2);
        advance(`Project ${store.name}/${project2} ready`);
      }
      await this.placeStore(store);
      if (!this.sandboxes) {
        advance(`Store ${store.name} ready`);
        return;
      }
      const sandbox = `demo-${store.projects[0]}`, project = `${store.name}/${store.projects[0]}`;
      await this.ensureResource("sandbox", sandbox, ["sandbox", "create", project, sandbox, ...isPostgresql(store) ? ["--machine", store.machine] : []]);
      const detail = await new CliInventory({ invoke: (argv) => this.query(argv) }).sandboxDetails(sandbox);
      for (const [name6, branch] of [["feature", projectHistoryPlan(store.projects[0], this.historyOptions).definition.features[0].name], ["fix", projectHistoryPlan(store.projects[0], this.historyOptions).definition.features[1].name]]) {
        if (!detail.workspaces?.some((ws) => ws.name === name6)) await this.once(`workspace.mount:${sandbox}:${name6}`, ["workspace", "mount", sandbox, branch, "--name", name6]);
      }
      advance(`Store ${store.name} and workspaces ready`);
    });
  }
  async verify() {
    if (this.executionMode === "mixed" && this.manifest.mixedRecipeVersion !== MIXED_RECIPE_VERSION) fail4("This environment uses older Mixed workspace sessions. Build the current two-revision workspace recipe before verifying it.");
    if (this.manifest.contentVersion !== CONTENT_VERSION) fail4("This environment has older preset content. Build the current project library before verifying it.");
    let projects = 0;
    const projectTotal = this.preset.stores.reduce((sum, store) => sum + store.projects.length, 0);
    this.progress({ stage: "verifying", completed: 0, total: projectTotal, label: "Verifying saved project files and histories" }, true);
    for (const machine of this.preset.machines) await this.query(["machine", "get", typeof machine === "string" ? machine : machine.name]);
    await runBounded(this.preset.stores, 4, async (store, { shouldStop }) => {
      const query = (argv) => {
        if (shouldStop()) throw Object.assign(new Error("Verification stopped because another Store failed; all dispatched reads have settled."), { code: "PresetStopped" });
        return this.query(argv);
      };
      const current = await query(["store", "get", store.name]);
      const placedRight = isPostgresql(store) ? current.engine === "postgresql" : current.machine === store.machine;
      if (!placedRight || current.op) fail4(`Store ${store.name} does not match its intended placement or has an operation in flight.`);
      for (const name6 of store.projects) {
        const key = `${store.name}/${name6}`;
        await query(["project", "get", key]);
        const receipt = { steps: Object.fromEntries(projectHistorySteps(store.name, name6, this.historyOptions).map((step) => [step.key, this.manifest.steps[`${step.key}:${key}`]?.result])) };
        const verified = await verifyProject(query, store.name, name6, receipt, this.historyOptions);
        if (this.executionMode === "mixed") {
          const box = await query(["sandbox", "get", mixedSandboxName(name6), "--detail"]);
          if (box.project !== key || !storeMachines(store).includes(box.machine) || (box.state ?? "ready") !== "ready" || box.op || !Array.isArray(box.workspaces) || box.workspaces.length) fail4(`Mixed sandbox for ${key} is unreachable, misplaced or still mounted.`);
          const plan = projectHistoryPlan(name6, this.historyOptions);
          const completed = projectHistorySteps(store.name, name6, this.historyOptions).filter((step) => step.workspaceRevision && stepEffect(step, this.manifest.steps[`${step.key}:${key}`]?.result).workspaceRevision).length;
          if (completed !== plan.workspaceRevisions || completed / plan.authoredRevisions < 0.3) fail4(`Mixed workspace coverage is incomplete for ${key}.`);
          verified.workspaceRevisions = completed;
          verified.authoredRevisions = plan.authoredRevisions;
        }
        this.manifest.projects[key].verification = verified;
        this.save();
        projects++;
        this.progress({ stage: "verifying", completed: projects, total: projectTotal, label: `Verified ${projects} of ${projectTotal} projects: ${key}` }, true);
      }
      if (this.sandboxes) {
        const inspector = new CliInventory({ invoke: query });
        const box = await inspector.sandboxDetails(`demo-${store.projects[0]}`);
        if (!["feature", "fix"].every((name6) => box.workspaces?.some((ws) => ws.name === name6))) fail4(`Sandbox ${box.sandbox} is missing its workspaces or is unreachable.`);
      }
    });
    const journal = this.journalSummary();
    return { presetVerified: true, projects, journal };
  }
  /** Every completed step has its recorded final result; nothing is pending or uncertain. */
  journalSummary() {
    const steps = Object.values(this.manifest.steps);
    const unsettled = steps.filter((step) => step.status !== "done");
    if (unsettled.length) fail4(`The preset step journal has ${unsettled.length} step(s) without a confirmed final result. Inspect the LayerFS inventory before rebuilding.`);
    return { verifiedAt: Date.now(), steps: steps.length, mutations: steps.filter((step) => !["get", "list"].includes(step.argv?.[1])).length };
  }
  /** Setup under the lock the environment reset holds (`inheritedLock`), or under a fresh one. */
  async run(command2, { actionId, onReady, inheritedLock } = {}) {
    if (command2 !== "setup") fail4(`Unknown preset command ${command2}`);
    this.command = command2;
    if (inheritedLock) {
      const lease = JSON.parse(readFileSync9(this.lock, "utf8"));
      if (lease.pid !== process.pid || lease.actionId !== inheritedLock) fail4("The inherited build lock does not belong to this operation.");
    } else this.acquire();
    try {
      this.load(true);
      this.commandId = actionId ?? randomUUID4();
      this.action = { id: this.commandId, name: `demo.${command2}`, label: `Build ${this.presetName} preset`, target: this.presetName };
      if (!inheritedLock) writeFileSync7(this.lock, JSON.stringify({ pid: process.pid, at: Date.now(), actionId: this.action.id }), { mode: 384 });
      try {
        this.manifest.presetOperation = { id: this.action.id, actionId: this.action.id, command: command2, preset: this.presetName, pid: process.pid, created: Date.now(), state: "running", phase: "Building preset through the CLI" };
        this.save();
        await onReady?.(this.action);
        await this.driver.discover();
        await this.initialize();
        await this.setup();
        const verificationLabel = this.sandboxes ? "Verifying preset files, history and workspaces" : "Verifying project files, branches and main Layers";
        this.progress({ stage: "verifying", completed: 0, total: this.preset.stores.reduce((sum, store) => sum + store.projects.length, 0), label: verificationLabel }, true);
        this.report(verificationLabel);
        const verification = await this.verify();
        this.progress({ stage: "verifying", completed: verification.projects, total: verification.projects, label: "Preset verified" }, true);
        this.manifest.lastSetupActionId = this.action.id;
        this.manifest.sandboxes = this.sandboxes;
        this.manifest.last = { command: command2, at: Date.now(), actionId: this.action.id };
        Object.assign(this.manifest.presetOperation, { state: "completed", ended: Date.now(), presetVerified: verification.presetVerified, phase: "Preset is ready and verified" });
        this.save();
        return { preset: this.presetName, state: this.state, home: this.home, actionId: this.action.id, ...verification };
      } catch (error2) {
        if (this.manifest.presetOperation) {
          Object.assign(this.manifest.presetOperation, { state: "failed", ended: Date.now(), phase: error2.message, error: { code: error2.code ?? "Failed", message: error2.message } });
          this.save();
        }
        throw error2;
      }
    } finally {
      if (!inheritedLock) this.release();
    }
  }
};

// src/host/presets/environment-reset.js
var environment_reset_exports = {};
__export(environment_reset_exports, {
  EnvironmentReset: () => EnvironmentReset,
  fixtureBusy: () => fixtureBusy,
  liveReceipt: () => liveReceipt
});
import { createHash as createHash7, randomUUID as randomUUID5 } from "node:crypto";
import { mkdirSync as mkdirSync9, openSync as openSync4, closeSync as closeSync4, readFileSync as readFileSync10, writeFileSync as writeFileSync8, renameSync as renameSync6, unlinkSync as unlinkSync4 } from "node:fs";
import { join as join10 } from "node:path";
var sorted = (items) => [...items].sort((a, b) => a.name.localeCompare(b.name));
var builtIn = (name6) => ["native", "docker"].includes(name6);
var save = (file, value) => {
  const tmp = `${file}.${process.pid}.tmp`;
  writeFileSync8(tmp, JSON.stringify(value), { mode: 384 });
  renameSync6(tmp, file);
};
var fixtureBusy = (message) => Object.assign(new Error(message), { status: 409, code: "ConnectBusy" });
function liveReceipt(file) {
  let receipt;
  try {
    receipt = JSON.parse(readFileSync10(file, "utf8"));
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw fixtureBusy("The preset lock is unreadable. Inspect the presets state folder.");
  }
  if (!Number.isInteger(receipt.pid) || receipt.pid <= 0) throw fixtureBusy("The preset lock has an invalid process ID. Inspect the presets state folder.");
  try {
    process.kill(receipt.pid, 0);
  } catch (e) {
    if (e.code === "ESRCH") return null;
    throw e;
  }
  return receipt;
}
var EnvironmentReset = class extends CliInventory {
  constructor({ spec, driver, report = () => {
  }, progress = () => {
  } }) {
    super(driver);
    this.spec = spec;
    this.report = report;
    this.progress = progress;
    this.lock = join10(spec.state, "demo-fixtures.lock");
  }
  identity() {
    const id = JSON.parse(readFileSync10(join10(this.spec.home, "layerfs.json"), "utf8")).id;
    if (!id) throw new Error("The selected environment has no valid LayerFS home identity.");
    return id;
  }
  async plan() {
    const homeId = this.identity();
    const [machines, stores2, sandboxes] = (await Promise.all(["machine", "store", "sandbox"].map((family) => this.inventory(family)))).map(sorted);
    for (const row of [...machines, ...stores2, ...sandboxes]) if (row.op || row.reason === "unresolved") throw fixtureBusy(`${row.name} has an active or unresolved operation. Inspect its status before resetting.`);
    const workspaces = [], unknownSandboxes = sandboxes.map((box) => box.name), workspaceGroups = [];
    const remove = { stores: stores2.filter((s) => s.kind !== "postgresql").map((s) => s.name), sandboxes: sandboxes.map((s) => s.name), machines: machines.filter((m) => !builtIn(m.name)).map((m) => m.name), workspaces: workspaces.sort() };
    const disconnect = stores2.filter((s) => s.kind === "postgresql").map((s) => s.name);
    const startMachines = [...new Set([...stores2, ...sandboxes].map((r) => r.machine).filter((name6) => name6 && name6 !== "native"))].filter((name6) => machines.find((m) => m.name === name6)?.state !== "ready").sort();
    const detectedMachines = machines.map(({ name: name6, state, platform: platform2 }) => ({ name: name6, state, platform: platform2 }));
    const projectKeys = stores2.flatMap((s) => (s.projects ?? []).map((p) => `${s.name}/${p}`)).sort();
    const plan = { home: this.spec.home, homeId, remove, disconnect, unknownSandboxes, workspaceGroups, startMachines, detectedMachines, projects: projectKeys.length, projectKeys, stopDocker: machines.some((m) => m.name === "docker" && m.state !== "stopped"), scope: "environment" };
    const identities = [machines, stores2, sandboxes].map((rows2) => rows2.map(({ name: name6, id, created_at, machine, kind, projects }) => ({ name: name6, id, created_at, machine, kind, projects })));
    const signature = createHash7("sha256").update(JSON.stringify({ ...plan, identities })).digest("hex");
    return { ...plan, signature };
  }
  async remaining() {
    const stores2 = await this.inventory("store"), sandboxes = await this.inventory("sandbox"), machines = await this.inventory("machine");
    return [...stores2.map((r) => `store ${r.name}`), ...sandboxes.map((r) => `sandbox ${r.name}`), ...machines.filter((m) => !builtIn(m.name)).map((r) => `machine ${r.name}`), ...machines.filter((m) => m.name === "docker" && m.state !== "stopped").map(() => "running Docker worker")];
  }
  async run({ expectedPlan, onReady, assertIdle, beforeRemove, afterCleanup }) {
    mkdirSync9(this.spec.state, { recursive: true, mode: 448 });
    let fd;
    try {
      fd = openSync4(this.lock, "wx", 384);
    } catch (e) {
      if (e.code !== "EEXIST") throw e;
      if (liveReceipt(this.lock)) throw fixtureBusy("Another preset build or reset is running.");
      throw fixtureBusy("A previous operation left a stale lock. Inspect its status and receipt before removing the lock and resetting.");
    }
    const action = { id: randomUUID5(), name: "environment.reset", label: "Reset LayerFS environment", target: this.spec.home };
    writeFileSync8(fd, JSON.stringify({ pid: process.pid, actionId: action.id }));
    closeSync4(fd);
    let receipt;
    try {
      this.progress({ stage: "checking", completed: 0, total: null, label: "Checking environment inventory" });
      await assertIdle();
      await this.driver.discover();
      const plan = await this.plan();
      if (plan.signature !== expectedPlan) throw Object.assign(new Error("The environment changed since confirmation. Review the reset plan again."), { code: "Conflict", status: 409 });
      receipt = { ...plan, actionId: action.id, verified: false, completed: [], remaining: [], warnings: [], at: Date.now() };
      const file = join10(this.spec.state, "environment-reset.json");
      save(file, receipt);
      let cleanup;
      try {
        await onReady?.(action);
        await beforeRemove?.(plan);
        let completed = 0;
        const total = plan.unknownSandboxes.length ? null : plan.startMachines.length + Object.values(plan.remove).reduce((n, rows2) => n + rows2.length, 0) + plan.disconnect.length + Number(plan.stopDocker || plan.startMachines.includes("docker"));
        this.progress({ stage: "resetting", completed, total, label: "Removing detected resources" });
        const mutate = async (argv) => {
          this.progress({ stage: "resetting", completed, total, label: `layerfs ${argv.join(" ")}` });
          const result = await this.driver.invoke(argv);
          receipt.completed.push(argv);
          completed++;
          this.progress({ stage: "resetting", completed, total, label: `Completed: layerfs ${argv.join(" ")}` });
          if (result?.note || result?.left) receipt.warnings.push(result.note ?? result.left);
          save(file, receipt);
          return result;
        };
        this.report("Starting machines needed to reach their resources");
        for (const machine of plan.startMachines) await mutate(["machine", "start", machine]);
        this.report("Unmounting workspaces and removing sandboxes");
        const workspaces = [];
        for (const name6 of plan.remove.sandboxes) {
          const box = await this.sandboxDetails(name6);
          for (const workspace of box.workspaces) {
            workspaces.push(workspace.ws);
            await mutate(["workspace", "unmount", workspace.ws, "--discard"]);
          }
          await mutate(["sandbox", "remove", name6]);
        }
        receipt.remove.workspaces = workspaces;
        this.report("Removing stores and disconnecting PostgreSQL stores");
        for (const name6 of plan.remove.stores) await mutate(["store", "remove", name6]);
        for (const name6 of plan.disconnect) await mutate(["store", "disconnect", name6]);
        this.report("Removing custom machines and stopping Docker");
        for (const name6 of plan.remove.machines) await mutate(["machine", "remove", name6]);
        const docker = (await this.inventory("machine")).find((m) => m.name === "docker");
        if (docker && docker.state !== "stopped") await mutate(["machine", "stop", "docker"]);
        this.progress({ stage: "verifying", completed: 0, total: 1, label: "Verifying empty environment" });
        this.report("Verifying empty environment against LayerFS inventory");
        if (this.identity() !== plan.homeId) throw new Error("The LayerFS home identity changed during reset.");
        receipt.remaining = await this.remaining();
        if (receipt.remaining.length) throw new Error(`Environment reset verification failed: ${receipt.remaining.join(", ")}. Inspect the remaining resources before continuing.`);
        this.progress({ stage: "verifying", completed: 1, total: 1, label: "Empty environment verified" });
        receipt.verified = true;
        receipt.ended = Date.now();
        save(file, receipt);
        cleanup = receipt;
      } catch (e) {
        try {
          receipt.remaining = await this.remaining();
        } catch (readError) {
          receipt.warnings.push(`Remaining inventory could not be read: ${readError.message}`);
        }
        receipt.error = { code: e.code ?? "Failed", message: e.message };
        receipt.ended = Date.now();
        save(file, receipt);
        throw e;
      }
      return afterCleanup ? await afterCleanup(cleanup, action.id) : cleanup;
    } finally {
      unlinkSync4(this.lock);
    }
  }
};

// src/host/presets/build.js
var runnerFor = (spec, options) => new DemoRunner({ state: spec.state, home: spec.home, adoptHome: true, ...options });
async function prepareBuild({ spec, preset, driver, sandboxes, executionMode = "filesystem", report = () => {
}, progress = () => {
} }) {
  progress({ stage: "checking", completed: 0, total: null, label: "Checking preset requirements" });
  const runner = runnerFor(spec, { preset, driver, sandboxes, executionMode, report, progress });
  runner.acquire();
  try {
    runner.command = "reset";
    runner.load(true);
    await driver.discover();
    await runner.initialize();
    await runner.preflight();
  } finally {
    runner.release();
  }
  const plan = await new EnvironmentReset({ spec, driver, report, progress }).plan();
  return { ...plan, executionMode, signature: executionMode === "mixed" ? `mixed:${plan.signature}` : plan.signature };
}
async function buildPreset({ spec, preset, driver, sandboxes = true, executionMode = "filesystem", expectedPlan, assertIdle, onReady, beforeRemove, onBuildReady, onCleanup, report = () => {
}, progress = () => {
} }) {
  if (!["filesystem", "mixed"].includes(executionMode)) throw new Error("Unknown preset execution mode.");
  if (executionMode === "mixed") {
    if (!expectedPlan?.startsWith("mixed:")) throw Object.assign(new Error("The build mode changed since confirmation. Review the build plan again."), { code: "Conflict", status: 409 });
    expectedPlan = expectedPlan.slice(6);
  }
  if (presetOf(preset).sandboxes === false) sandboxes = false;
  const runner = runnerFor(spec, { preset, driver, sandboxes, executionMode, report, progress });
  runner.command = "reset";
  runner.load();
  await driver.discover();
  await runner.preflight();
  let resetSteps = { completed: 0, total: null };
  const resetProgress = (value) => {
    if (value.stage === "resetting") {
      resetSteps = value;
      progress({ ...value, total: value.total === null ? null : value.total + 1 });
    } else if (value.stage === "verifying") {
      progress({ ...value, stage: "resetting", completed: resetSteps.completed + value.completed, total: resetSteps.total === null ? null : resetSteps.total + 1 });
    } else progress(value);
  };
  return new EnvironmentReset({ spec, driver, report, progress: resetProgress }).run({
    expectedPlan,
    assertIdle,
    onReady,
    beforeRemove,
    afterCleanup: async (cleanup, inheritedLock) => {
      await onCleanup?.(cleanup);
      const file = join11(spec.state, "demo-fixtures.json");
      const manifest = existsSync11(file) ? JSON.parse(readFileSync11(file, "utf8")) : null;
      if (!manifest || manifest.tool !== TOOL || manifest.homeId !== cleanup.homeId) throw new Error("Preset manifest does not match the cleaned home. Inspect the environment before building.");
      manifest.preset = preset;
      if (!cleanup.verified) throw new Error("Cleanup was not verified; history receipts are retained.");
      const journal = new StepJournal(join11(spec.state, "demo-steps.ndjson"));
      journal.clear();
      manifest.stepJournal = journal.metadata();
      delete manifest.activityCapture;
      Object.assign(manifest, { resources: { machine: {}, store: {}, sandbox: {} }, projects: {}, steps: {}, borrowed: {}, lastSetupActionId: null, contentVersion: CONTENT_VERSION, sandboxes, executionMode, mixedRecipeVersion: executionMode === "mixed" ? MIXED_RECIPE_VERSION : null });
      const tmp = `${file}.${process.pid}.tmp`;
      writeFileSync9(tmp, JSON.stringify(manifest), { mode: 384 });
      renameSync7(tmp, file);
      report("Building selected preset");
      const result = await runner.run("setup", { onReady: onBuildReady, inheritedLock });
      return { ...result, cleanup, resetActionId: cleanup.actionId, actionIds: [cleanup.actionId, result.actionId] };
    }
  });
}
function presetScript({ preset, spec, sandboxes = true, resetPlan, resetNote, historyDensity = "dense", executionMode = "filesystem" }) {
  if (presetOf(preset).sandboxes === false) sandboxes = false;
  const configuration = { ...presetOf(preset), preset, historyDensity, executionMode, mixedSandboxCapacity: executionMode === "mixed" ? { perProject: 3, workspacesPerSandbox: 16 } : null, historySchedule: "parallel", historyLimits: { ...PRESET_HISTORY_LIMITS }, sandboxes, state: spec.state, home: spec.home, cli: spec.cli ?? null, daemon: spec.daemon ?? null };
  const commands = presetCommandPlan({ configuration, spec, sandboxes, resetPlan, resetNote });
  return { preset, command: null, configuration, commands, dynamicReset: !resetPlan || resetPlan.unknownSandboxes.length > 0, files: [] };
}
function presetCommandPlan({ configuration, spec, sandboxes, resetPlan, resetNote }) {
  const commands = [], add = (phase, argv, extra = {}) => commands.push({ phase, argv, ...extra });
  add("reset", ["machine", "list"], { note: resetNote || "Read the environment inventory. Cleanup targets are rechecked when Build starts." });
  add("reset", ["store", "list", "--detail"]);
  add("reset", ["sandbox", "list", "--detail", "--limit", "1000"], { note: "Further pages are read by cursor when present." });
  if (resetPlan) {
    for (const name6 of resetPlan.startMachines) add("reset", ["machine", "start", name6]);
    for (const name6 of resetPlan.remove.sandboxes) {
      add("reset", ["sandbox", "get", name6, "--detail"], { note: resetPlan.unknownSandboxes.includes(name6) ? "Workspace targets will be discovered after its machine starts." : void 0 });
      for (const ws of resetPlan.workspaceGroups?.find((group) => group.sandbox === name6)?.workspaces ?? []) add("reset", ["workspace", "unmount", ws, "--discard"]);
      add("reset", ["sandbox", "remove", name6]);
    }
    for (const name6 of resetPlan.remove.stores) add("reset", ["store", "remove", name6]);
    for (const name6 of resetPlan.disconnect) add("reset", ["store", "disconnect", name6]);
    for (const name6 of resetPlan.remove.machines) add("reset", ["machine", "remove", name6]);
    if (resetPlan.stopDocker || resetPlan.startMachines.includes("docker")) add("reset", ["machine", "stop", "docker"]);
    for (const family of ["machine", "store", "sandbox"]) add("reset", [family, "list", "--detail", ...family === "sandbox" ? ["--limit", "1000"] : []], { note: "Verify the environment is empty before creating preset resources." });
  }
  add("build", ["home", "get", "--with", "platforms"], { note: "Prerequisites are checked before cleanup and checked again during setup." });
  for (const machine of configuration.machines) {
    const name6 = typeof machine === "string" ? machine : machine.name;
    if (typeof machine !== "string") add("build", machineCreateArgs(machine));
    if (configuration.stores.some((store) => usesMachine(store, name6))) add("build", ["machine", "start", name6], { note: "Only if the machine is not already running or ready." });
  }
  if (sandboxes && spec.daemon && configuration.stores.some((store) => store.machine === "native")) add("build", ["machine", "update", "native", "--daemon", spec.daemon], { note: "Only if the native daemon path differs." });
  const postgres = new PresetPostgres({ state: spec.state });
  const port = postgres.recorded()?.port ?? "<port>";
  const createStore = (store, note) => isPostgresql(store) ? (add("build", ["store", "save-auth", postgres.authName, "--user", "postgres", "--password-stdin"], { note: `The preset runs its own PostgreSQL server (Docker container ${postgres.container}, ${POSTGRES_IMAGE}, on 127.0.0.1); its password stays in the presets state folder and goes to LayerFS on stdin. ` }), add("build", ["store", "connect", store.name, `postgresql://127.0.0.1:${port}/${store.database}`, "--auth", postgres.authName], { note: `An empty database ${store.database} is created first. ${note}` })) : add("build", ["store", "create", store.name], { note });
  const placeStore = (store) => !isPostgresql(store) && store.machine !== "native" && add("build", ["store", "move", store.name, store.machine, "--progress"]);
  if (configuration.concurrentHistory) {
    for (const store of configuration.stores) {
      createStore(store, "Preparation only: project imports are serial within this store; independent stores can prepare concurrently.");
      for (const name6 of store.projects) add("build", ["project", "init", `${store.name}/${name6}`, join11(spec.state, "demo-sources", store.name, name6), "--progress"], { note: "The preset prepares source files here. All imports and store placements finish before concurrent histories start." });
      placeStore(store);
    }
    for (const store of configuration.stores) for (const name6 of store.projects) {
      for (const [index, step] of projectHistorySteps(store.name, name6, { density: configuration.historyDensity, executionMode: configuration.executionMode }).entries()) {
        const { argv, input, key, dependsOn, lane, commitFrom } = step;
        add("build", argv, { key, dependsOn, lane, commitFrom, ...input === void 0 ? {} : { input }, ...index === 0 ? { note: `Project script on ${store.machine}: starts after every store is placed. Independent branches run concurrently; writes on each branch and publications to main remain ordered. Exact publication commits come from successful receipts.` } : {} });
      }
    }
  } else {
    for (const store of configuration.stores) {
      createStore(store, "Independent store pipelines may run concurrently (up to two); project writes within this store remain ordered.");
      for (const name6 of store.projects) {
        add("build", ["project", "init", `${store.name}/${name6}`, join11(spec.state, "demo-sources", store.name, name6), "--progress"], { note: "The preset prepares sample source files at this path before initialization." });
        for (const { argv, input } of projectHistorySteps(store.name, name6, { density: configuration.historyDensity, executionMode: configuration.executionMode })) add("build", argv, input === void 0 ? {} : { input });
      }
      placeStore(store);
      if (sandboxes) {
        const name6 = `demo-${store.projects[0]}`;
        add("build", ["sandbox", "create", `${store.name}/${store.projects[0]}`, name6]);
        add("build", ["workspace", "mount", name6, projectHistoryPlan(store.projects[0]).definition.features[0].name, "--name", "feature"]);
        add("build", ["workspace", "mount", name6, projectHistoryPlan(store.projects[0]).definition.features[1].name, "--name", "fix"]);
      }
    }
  }
  for (const machine of configuration.machines) add("verify", ["machine", "get", typeof machine === "string" ? machine : machine.name]);
  for (const store of configuration.stores) {
    add("verify", ["store", "get", store.name]);
    for (const name6 of store.projects) {
      const project = `${store.name}/${name6}`;
      add("verify", ["project", "get", project]);
      for (const step of projectVerificationSteps(store.name, name6, { density: configuration.historyDensity, executionMode: configuration.executionMode })) add("verify", step.argv);
    }
    if (sandboxes) add("verify", ["sandbox", "get", `demo-${store.projects[0]}`, "--detail"]);
  }
  return commands;
}

// src/host/presets/machine-stop.js
var machine_stop_exports = {};
__export(machine_stop_exports, {
  MachineStop: () => MachineStop
});
import { createHash as createHash8, randomUUID as randomUUID6 } from "node:crypto";
import { closeSync as closeSync5, mkdirSync as mkdirSync10, openSync as openSync5, readFileSync as readFileSync12, renameSync as renameSync8, unlinkSync as unlinkSync5, writeFileSync as writeFileSync10 } from "node:fs";
import { join as join12 } from "node:path";
var save2 = (file, value) => {
  const temporary = `${file}.${process.pid}.tmp`;
  writeFileSync10(temporary, JSON.stringify(value), { mode: 384 });
  renameSync8(temporary, file);
};
var terminal = (machine) => !machine.op && (machine.name === "native" ? ["ready", "stopped"].includes(machine.state) : machine.state === "stopped");
var MachineStop = class extends CliInventory {
  constructor({ spec, driver, report = () => {
  }, progress = () => {
  } }) {
    super(driver);
    this.spec = spec;
    this.report = report;
    this.progress = progress;
    this.lock = join12(spec.state, "demo-fixtures.lock");
  }
  identity() {
    const id = JSON.parse(readFileSync12(join12(this.spec.home, "layerfs.json"), "utf8")).id;
    if (!id) throw new Error("The selected environment has no valid LayerFS home identity.");
    return id;
  }
  async plan() {
    const discovery = await this.driver.discover();
    const stop = discovery?.calls?.find((call) => call.family === "machine" && call.call === "stop");
    if (!stop?.options?.some((option) => option.name === "force" && option.kind === "bool")) {
      throw Object.assign(new Error("Reset requires machine.stop with the force option, which the selected LayerFS CLI does not advertise. Choose a compatible CLI and matching daemon in Center \u2192 Settings \u2192 Change\u2026, then review Reset again. No machines were stopped."), {
        code: "CliIncompatible",
        status: 409
      });
    }
    const homeId = this.identity();
    const machines = (await this.inventory("machine")).sort((a, b) => a.name.localeCompare(b.name));
    const detectedMachines = machines.map(({ name: name6, state, platform: platform2 }) => ({ name: name6, state, platform: platform2 }));
    const plan = { home: this.spec.home, homeId, scope: "machines", stopMachines: machines.map((machine) => machine.name), detectedMachines };
    const identities = machines.map(({ name: name6, created_at, platform: platform2 }) => ({ name: name6, created: created_at ?? null, platform: platform2 }));
    const signature = createHash8("sha256").update(JSON.stringify({ ...plan, identities })).digest("hex");
    return { ...plan, signature };
  }
  async run({ expectedPlan, onReady, assertIdle, onStopped }) {
    mkdirSync10(this.spec.state, { recursive: true, mode: 448 });
    let descriptor;
    try {
      descriptor = openSync5(this.lock, "wx", 384);
    } catch (error2) {
      if (error2.code !== "EEXIST") throw error2;
      if (liveReceipt(this.lock)) throw fixtureBusy("Another preset build or reset is running.");
      throw fixtureBusy("A previous operation left a stale lock. Inspect its receipt before starting another operation.");
    }
    const action = { id: randomUUID6(), name: "machine.stop-all", label: "Force-close LayerFS machines", target: this.spec.home };
    writeFileSync10(descriptor, JSON.stringify({ pid: process.pid, actionId: action.id }));
    closeSync5(descriptor);
    const file = join12(this.spec.state, "machine-stop.json");
    let receipt;
    try {
      this.progress({ stage: "checking", completed: 0, total: null, label: "Checking registered machines" });
      await assertIdle?.();
      const plan = await this.plan();
      if (plan.signature !== expectedPlan) throw Object.assign(new Error("The machine inventory changed since confirmation. Review the stop plan again."), { code: "Conflict", status: 409 });
      receipt = { ...plan, actionId: action.id, verified: false, completed: [], results: [], remaining: [], warnings: [], at: Date.now() };
      save2(file, receipt);
      await onReady?.(action);
      const failures = [];
      for (const [index, name6] of plan.stopMachines.entries()) {
        const argv = ["machine", "stop", name6, "--force", "--detail"];
        this.progress({ stage: "resetting", completed: index, total: plan.stopMachines.length, label: `layerfs ${argv.join(" ")}` });
        this.report(`Force-closing machine ${name6}`);
        try {
          const result = await this.driver.invoke(argv);
          if (result?.ok !== true || result?.machine !== name6 || result.forced !== true && result.unchanged !== true) throw new Error(`Force-stop outcome could not be confirmed for ${name6}`);
          receipt.completed.push(argv);
          receipt.results.push({ machine: name6, forced: result.forced === true, unchanged: result.unchanged === true, stoppedSandboxes: result.stopped_sandboxes ?? [], unknown: result.unknown_workspaces ?? [] });
          for (const workspace of result.unknown_workspaces ?? []) receipt.warnings.push(`Uncommitted workspace state may be lost or unknown: ${workspace}`);
          save2(file, receipt);
          await onStopped?.(name6);
        } catch (error2) {
          failures.push(`${name6}: ${error2.message}`);
          receipt.warnings.push(`${name6}: ${error2.message}`);
        }
        save2(file, receipt);
      }
      this.progress({ stage: "verifying", completed: 0, total: 1, label: "Verifying machines are stopped" });
      if (this.identity() !== plan.homeId) throw new Error("The LayerFS home identity changed during reset.");
      const machines = await this.inventory("machine");
      const byName = new Map(machines.map((machine) => [machine.name, machine]));
      receipt.remaining = [
        ...plan.stopMachines.flatMap((name6) => !byName.has(name6) ? [`machine registration missing: ${name6}`] : terminal(byName.get(name6)) ? [] : [`machine still running: ${name6}`]),
        ...machines.filter((machine) => !plan.stopMachines.includes(machine.name)).map((machine) => `new machine registration: ${machine.name}`)
      ];
      if (failures.length || receipt.remaining.length) throw new Error(`Machine reset could not be verified: ${[...failures, ...receipt.remaining].join("; ")}`);
      receipt.verified = true;
      receipt.ended = Date.now();
      save2(file, receipt);
      this.progress({ stage: "verifying", completed: 1, total: 1, label: "Machines closed; saved projects retained" });
      return receipt;
    } catch (error2) {
      if (receipt) {
        receipt.error = { code: error2.code ?? "Failed", message: error2.message };
        receipt.ended = Date.now();
        save2(file, receipt);
      }
      throw error2;
    } finally {
      unlinkSync5(this.lock);
    }
  }
};

// src/host/presets/recipe/script-page.js
var script_page_exports = {};
__export(script_page_exports, {
  scriptPage: () => scriptPage
});
function scriptPage(script, { offset = 0, limit = 100, kind, name: name6 } = {}) {
  offset = Number(offset);
  limit = Number(limit);
  if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isInteger(limit) || limit < 1 || limit > 1e3) throw Object.assign(new Error("Script pages need a nonnegative offset and a limit from 1 to 1000."), { status: 400, code: "InvalidInput" });
  const scoped = kind && name6;
  const stores2 = !scoped ? [] : script.configuration.stores.filter((store) => kind === "machine" ? store.machine === name6 : kind === "store" ? store.name === name6 : store.name === name6.split("/")[0]);
  const projects = new Set(stores2.flatMap((store) => store.projects.map((project) => `${store.name}/${project}`)).filter((project) => kind !== "project" || project === name6));
  const sandboxes = new Set(script.commands.filter((step) => step.argv[0] === "sandbox" && step.argv[1] === "create" && projects.has(step.argv[2])).map((step) => step.argv[3]));
  const commands = scoped ? script.commands.filter((step) => {
    if (step.phase === "reset") return false;
    const [family, , target] = step.argv;
    if (["project", "branch", "commit", "file"].includes(family)) return projects.has(target);
    if (family === "store") return kind !== "project" && stores2.some((store) => store.name === target);
    if (family === "sandbox") return sandboxes.has(step.argv[1] === "create" ? step.argv[3] : target);
    if (family === "workspace") return sandboxes.has(target.split(":")[0]);
    if (family === "machine") return kind === "machine" && target === name6;
    return false;
  }) : script.commands;
  return { ...script, files: [], commands: commands.slice(offset, offset + limit), total: commands.length, offset, next: offset + limit < commands.length ? offset + limit : null };
}

// src/host/presets/js.ts
var js = (m) => m;
var { buildPreset: buildPreset2, prepareBuild: prepareBuild2, presetScript: presetScript2 } = js(build_exports);
var { EnvironmentReset: EnvironmentReset2, liveReceipt: liveReceipt2 } = js(environment_reset_exports);
var { MachineStop: MachineStop2 } = js(machine_stop_exports);
var { TOOL: TOOL2 } = js(runner_exports);
var { MIXED_RECIPE_VERSION: MIXED_RECIPE_VERSION2 } = js(mixed_recipe_exports);
var { CONTENT_VERSION: CONTENT_VERSION2, presetOf: presetOf2, presets: presets2 } = js(presets_exports);
var { projectDefinition: projectDefinition2 } = js(projects_exports);
var { projectHistoryPlan: projectHistoryPlan2 } = js(recipe_exports);
var { scriptPage: scriptPage2 } = js(script_page_exports);
var { StepJournal: StepJournal2 } = js(step_journal_exports);

// src/host/presets/manager.ts
var error = (status, code2, message, detail) => Object.assign(new Error(message), { status, code: code2, ...detail === void 0 ? {} : { detail } });
var busy = (message, detail) => error(409, "ConnectBusy", message, detail);
var pending = (job) => !!job && ["queued", "running"].includes(job.state);
var read = (file) => {
  try {
    return JSON.parse(readFileSync13(file, "utf8"));
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw e;
  }
};
var save3 = (file, value) => {
  const tmp = `${file}.${process.pid}.tmp`;
  writeFileSync11(tmp, JSON.stringify(value), { mode: 384 });
  renameSync9(tmp, file);
};
var known2 = (name6) => Object.hasOwn(presets2, name6);
function modeOf(value) {
  const mode = value ?? "filesystem";
  if (mode !== "filesystem" && mode !== "mixed") throw error(400, "InvalidInput", "Choose Filesystem or Mixed execution mode.");
  return mode;
}
var PresetManager = class {
  constructor(host, state, home) {
    this.host = host;
    this.state = state;
    this.home = home;
    mkdirSync11(state, { recursive: true, mode: 448 });
    this.file = join13(state, "demo-preset-jobs.json");
    const interrupted = (job) => ({ ...job, state: "interrupted", ended: Date.now(), phase: "Interrupted: the host restarted during this operation. Inspect Machines and Storage, then build or reset again." });
    this.jobs = new Map((read(this.file) ?? []).map((job) => [job.id, pending(job) ? interrupted(job) : job]));
    const lock = join13(state, "demo-fixtures.lock");
    if (existsSync12(lock) && !liveReceipt2(lock)) unlinkSync6(lock);
    this.persist();
  }
  host;
  state;
  home;
  jobs;
  file;
  switching = false;
  tasks = /* @__PURE__ */ new Set();
  snapshots = /* @__PURE__ */ new Map();
  persist() {
    const kept2 = [...this.jobs.values()].slice(-20);
    save3(this.file, kept2);
  }
  publish(job) {
    this.persist();
    this.host.emit("demo-preset", { jobId: job.id, preset: job.preset, state: job.state });
  }
  /** Whether a preset operation holds the home (other changes wait). */
  exclusive() {
    return this.switching || [...this.jobs.values()].some(pending);
  }
  /** Wait for running work to settle (shutdown, tests). */
  async settle() {
    await Promise.allSettled([...this.tasks]);
  }
  spec() {
    return this.host.spec();
  }
  latest(name6) {
    return [...this.jobs.values()].reverse().find((job) => job.preset === name6) ?? null;
  }
  definition(name6, requestedMode) {
    const preset = presetOf2(name6);
    const manifest = read(join13(this.state, "demo-fixtures.json"));
    const job = this.latest(name6);
    const buildJob = [...this.jobs.values()].reverse().find((candidate) => candidate.preset === name6 && candidate.rebuild);
    const executionMode = modeOf(requestedMode ?? manifest?.executionMode);
    const stores2 = preset.stores.length;
    const projectDefinitions = preset.stores.flatMap((store) => store.projects.map((project) => {
      const definition = projectDefinition2(project), plan = projectHistoryPlan2(project, { executionMode });
      return { store: store.name, name: project, title: definition.title, description: definition.description, branches: plan.branches, history: plan.history, tier: plan.tier, cycles: plan.cycles, layers: plan.layers, commands: plan.commands, workspaceRevisions: plan.workspaceRevisions, authoredRevisions: plan.authoredRevisions, sandboxLimit: plan.sandboxLimit, workspaceLimit: plan.workspaceLimit };
    }));
    const owns = !!manifest && (manifest.preset ?? "studio") === name6;
    const contentReady = owns && (manifest?.executionMode ?? "filesystem") === executionMode && manifest?.contentVersion === CONTENT_VERSION2 && (executionMode !== "mixed" || manifest?.mixedRecipeVersion === MIXED_RECIPE_VERSION2) && buildJob?.state === "completed" && !!buildJob.presetVerified;
    const projects = preset.stores.reduce((n, s) => n + s.projects.length, 0);
    return {
      id: name6,
      description: preset.description,
      executionMode,
      contentVersion: CONTENT_VERSION2,
      contentReady,
      projectDefinitions,
      machineDefinitions: preset.machines.map((m) => typeof m === "string" ? { name: m, platform: m } : m),
      projectGroups: preset.stores.map((s) => ({ store: s.name, kind: s.kind === "postgresql" ? "postgresql" : "sqlite", machine: s.machine, projects: s.projects })),
      machines: preset.machines.map((m) => typeof m === "string" ? m : m.name),
      stores: stores2,
      projects,
      sandboxes: executionMode === "mixed" ? projects : preset.sandboxes === false ? 0 : stores2,
      workspaces: executionMode === "mixed" ? 0 : preset.sandboxes === false ? 0 : stores2 * 2,
      requirements: [
        ...preset.stores.some((s) => s.machine === "docker" || s.kind === "postgresql") ? ["docker"] : [],
        ...preset.machines.some((m) => typeof m !== "string") ? ["lima"] : [],
        ...executionMode === "mixed" || stores2 && preset.sandboxes !== false ? ["daemon"] : []
      ],
      home: this.home,
      state: this.state,
      initialized: existsSync12(join13(this.home, "layerfs.json")),
      built: owns && !!manifest?.homeId,
      settings: manifest ? { sandboxes: manifest.sandboxes, executionMode: manifest.executionMode ?? "filesystem" } : null,
      lastBuild: buildJob && buildJob.state === "completed" && buildJob.ended ? { ended: buildJob.ended, executionMode: buildJob.executionMode, verified: !!buildJob.presetVerified } : null,
      job
    };
  }
  list() {
    const items = Object.keys(presets2).map((name6) => this.definition(name6));
    return { items, home: this.home, busy: this.exclusive() || !!liveReceipt2(join13(this.state, "demo-fixtures.lock")) };
  }
  /** The preset's own Store names: always this home's, even when a listing fails. */
  storeNames(name6) {
    return presetOf2(name6).stores.map((s) => String(s.name));
  }
  /** The DSH side of a reset: bound sessions, dropped workspaces (Build only) and the project sessions deleted. */
  async impact(name6, projectKeys) {
    const removed = new Set(projectKeys);
    const stores2 = await this.host.homeStores(this.storeNames(name6));
    return {
      sessions: this.host.boundSessions(),
      workspaces: this.host.dshProjects().filter((p) => removed.has(p.project)),
      conversations: this.host.projectConversations(stores2)
    };
  }
  /** Delete this home's project sessions; Stores a Build removed match by name. */
  async deleteConversations(job, before, removedStores = []) {
    const known4 = await before;
    const stores2 = [...known4, ...removedStores.filter((n) => !known4.some((s) => s.name === n)).map((n) => ({ name: n }))];
    job.deletedSessions = await this.host.deleteProjectConversations(stores2);
    this.publish(job);
  }
  /** Refuse while other work holds the home. A forced reset skips the session check. */
  idle(force = false) {
    const sessions = force ? [] : this.host.boundSessions();
    const work = this.host.busy();
    if (!sessions.length && !work.length) return;
    const parts = [
      ...sessions.length ? [`${sessions.length === 1 ? "A session has" : `${sessions.length} sessions have`} an open Sandbox in this LayerFS home; close ${sessions.length === 1 ? "it" : "them"} first (session panel \u2192 Close Sandbox, or wait for the idle close)`] : [],
      ...work.length ? [`Wait for active work to finish: ${work.join(", ")}`] : []
    ];
    throw busy(`${parts.join(". ")}.`, { sessions, work });
  }
  async script(name6, sandboxes, query) {
    const executionMode = modeOf(query.get("executionMode") ?? void 0);
    const snapshotId = query.get("snapshot");
    const cached = snapshotId ? this.snapshots.get(snapshotId) : void 0;
    if (snapshotId && (!cached || cached.name !== name6 || cached.sandboxes !== sandboxes || cached.executionMode !== executionMode)) throw error(409, "Conflict", "This script preview expired. Close and reopen it to load the current plan.");
    const params = Object.fromEntries(query);
    if (cached) return { ...scriptPage2(cached.script, params), snapshot: snapshotId };
    const spec = this.spec();
    let resetPlan, resetNote = "Build discovers this home's resources and generates the cleanup commands when it starts.";
    if (existsSync12(join13(spec.home, "layerfs.json"))) {
      try {
        const driver = new CliDriver(spec);
        await driver.discover();
        resetPlan = await new EnvironmentReset2({ spec, driver }).plan();
        resetNote = "Cleanup commands below reflect the current inventory. Build checks the inventory again before executing.";
      } catch {
        resetNote = "The current inventory could not be fully inspected. Build discovers cleanup targets before executing; this preview does not claim the home is empty.";
      }
    }
    const script = presetScript2({ preset: name6, spec, sandboxes, executionMode, resetPlan, resetNote });
    const id = randomUUID7();
    this.snapshots.set(id, { name: name6, sandboxes, executionMode, script });
    while (this.snapshots.size > 2) this.snapshots.delete(this.snapshots.keys().next().value);
    return { ...scriptPage2(script, params), snapshot: id };
  }
  async buildPlan(name6, sandboxes, mode) {
    const executionMode = modeOf(mode);
    if (this.list().busy) throw busy("Wait for the preset operation to finish before building.");
    const spec = this.spec();
    const plan = await prepareBuild2({ spec, preset: name6, sandboxes, executionMode, driver: new CliDriver(spec) });
    return { ...plan, environment: name6, dsh: await this.impact(name6, plan.projectKeys) };
  }
  async environmentPlan(name6) {
    if (this.list().busy) throw busy("Wait for the preset operation to finish before planning a reset.");
    const spec = this.spec();
    if (!existsSync12(join13(spec.home, "layerfs.json"))) throw error(409, "InvalidInput", "This LayerFS home has not been initialized; there is nothing to reset.");
    const reset = new MachineStop2({ spec, driver: new CliDriver(spec) });
    const plan = await reset.plan();
    return { ...plan, environment: name6, dsh: await this.impact(name6, []) };
  }
  /** Drop the DSH records of projects whose Store the reset removed (verified first). */
  async forget(job, receipt) {
    if (!receipt?.verified) return;
    const removed = new Set(receipt.remove?.stores ?? []);
    const keys = new Set(receipt.projectKeys ?? []);
    for (const p of this.host.dshProjects()) if (removed.has(p.project.split("/")[0])) keys.add(p.project);
    job.forgotten = [];
    for (const key of [...keys].sort()) {
      if (!this.host.dshProjects().some((p) => p.project === key)) continue;
      await this.host.forgetProject(key);
      job.forgotten.push(key);
    }
  }
  async resetEnvironment(name6, body) {
    if (!body || !/^[\w-]{1,80}$/.test(body.requestId ?? "") || typeof body.expectedPlan !== "string" || body.confirm !== true || typeof body.rebuild !== "boolean" || typeof body.sandboxes !== "boolean" || body.force !== void 0 && typeof body.force !== "boolean") throw error(400, "InvalidInput", "Review and confirm the environment reset plan.");
    const executionMode = modeOf(body.executionMode);
    const force = body.force === true;
    const fingerprint = JSON.stringify([name6, "environment-reset", body.expectedPlan, body.rebuild, body.sandboxes, executionMode, force]);
    const duplicate = [...this.jobs.values()].find((j) => j.requestId === body.requestId);
    if (duplicate) {
      if (duplicate.fingerprint !== fingerprint) throw error(409, "Conflict", "This request ID was already used with different settings.");
      return duplicate;
    }
    if (this.list().busy) throw busy("Another preset operation is in progress.");
    this.idle(body.rebuild ? force : true);
    const spec = this.spec();
    this.switching = true;
    try {
      const job = { id: randomUUID7(), requestId: body.requestId, fingerprint, preset: name6, command: body.rebuild ? "environment-reset" : "machine-stop", executionMode, rebuild: body.rebuild, actionId: null, state: "queued", phase: "Checking environment", created: Date.now(), log: [], progress: { stage: "checking", completed: 0, total: null, label: "Checking environment" } };
      this.jobs.set(job.id, job);
      this.publish(job);
      let last = 0;
      const report = (text6) => {
        job.phase = text6.slice(0, 240);
        job.log.push({ at: Date.now(), text: text6.slice(0, 2e3) });
        if (job.log.length > LOG_LINES) job.log.splice(0, job.log.length - LOG_LINES);
        if (Date.now() - last >= 250) {
          last = Date.now();
          this.publish(job);
        }
      };
      const progress = (value) => {
        job.progress = value;
        if (Date.now() - last >= 250 || value.completed === value.total) {
          last = Date.now();
          this.publish(job);
        }
      };
      const before = this.host.homeStores(this.storeNames(name6)).catch(() => this.storeNames(name6).map((n) => ({ name: n })));
      const driver = new CliDriver(spec, report);
      const onReady = async (action) => {
        Object.assign(job, { actionId: action.id, state: "running", started: Date.now() });
        this.publish(job);
      };
      const options = { expectedPlan: body.expectedPlan, assertIdle: async () => this.idle(body.rebuild ? force : true), onReady };
      const operation = body.rebuild ? buildPreset2({
        spec,
        preset: name6,
        driver,
        sandboxes: body.sandboxes,
        executionMode,
        ...options,
        report,
        progress,
        onCleanup: async (receipt) => {
          job.cleanup = receipt;
          if (receipt?.verified) await this.deleteConversations(job, before, receipt.remove?.stores ?? []);
          await this.forget(job, receipt);
          this.publish(job);
        },
        onBuildReady: (action) => {
          job.rebuildActionId = action.id;
          this.publish(job);
        }
      }) : new MachineStop2({ spec, driver, report, progress }).run({ ...options, onStopped: async (machine) => this.host.machinesStopped?.([machine]) });
      const task = operation.then(async (result) => {
        const receipt = body.rebuild ? result.cleanup : result;
        job.cleanup = receipt;
        if (body.rebuild) job.presetVerified = result.presetVerified;
        else await this.deleteConversations(job, before);
        Object.assign(job, { state: "completed", phase: body.rebuild ? "Environment reset verified. Preset rebuilt and verified." : `Machines force-closed; ${job.deletedSessions?.length ?? 0} project sessions deleted. Saved projects retained.`, ended: Date.now() });
      }).catch((e) => {
        const receipt = read(join13(this.state, body.rebuild ? "environment-reset.json" : "machine-stop.json"));
        Object.assign(job, { state: "failed", cleanup: receipt?.actionId === job.actionId ? receipt : job.cleanup, error: { code: e?.code ?? "Failed", message: String(e?.message ?? e) }, phase: String(e?.message ?? e), ended: Date.now() });
      }).finally(() => {
        this.switching = false;
        this.publish(job);
        this.tasks.delete(task);
      });
      this.tasks.add(task);
      return job;
    } finally {
      this.switching = false;
    }
  }
  /** One request: `method` + segments after `/api/demo-presets` -> the answer, or undefined. */
  async route(method, parts, body, query) {
    if (parts.length > 2) return void 0;
    const [id, operation] = parts;
    if (method === "GET" && !id) return this.list();
    if (method === "GET" && id === "requests" && operation) {
      const job = [...this.jobs.values()].find((j) => j.requestId === operation);
      if (!job) throw error(404, "NotFound", "This request has not been admitted. Dismiss this message and choose Build or Reset explicitly.");
      return job;
    }
    if (method === "GET" && id === "jobs" && operation) {
      const job = this.jobs.get(operation);
      if (!job) throw error(404, "NotFound", "This preset operation is no longer available.");
      return job;
    }
    if (!id || !known2(id)) throw error(404, "NotFound", "Unknown preset.");
    if (method === "GET" && !operation) return this.definition(id, query.get("executionMode") ?? void 0);
    if (method === "GET" && operation === "environment-plan") return this.environmentPlan(id);
    if (method === "POST" && operation === "environment-reset") return this.resetEnvironment(id, body);
    if (method === "GET" && (operation === "build-plan" || operation === "build-plan-no-sandboxes")) return this.buildPlan(id, operation === "build-plan", query.get("executionMode") ?? void 0);
    if (method === "GET" && (operation === "script" || operation === "script-no-sandboxes")) return this.script(id, operation === "script", query);
    return void 0;
  }
};

// src/host/presets/state-dir.ts
import { createHash as createHash9 } from "node:crypto";
import { chmodSync as chmodSync5, cpSync as cpSync2, existsSync as existsSync13, mkdirSync as mkdirSync12, readFileSync as readFileSync14, realpathSync as realpathSync4, renameSync as renameSync10, rmSync as rmSync4, writeFileSync as writeFileSync12 } from "node:fs";
import { join as join14, resolve as resolve4 } from "node:path";
var RECORDS_PATH = ["demo-fixtures.json", "demo-steps.ndjson", "demo-preset-jobs.json", "environment-reset.json", "machine-stop.json"];
function legacyPresetState(root, home) {
  const path2 = existsSync13(home) ? realpathSync4(home) : resolve4(home);
  return join14(root, "presets", "homes", createHash9("sha256").update(path2).digest("hex").slice(0, 16));
}
function moveLegacy(legacy, target, home) {
  try {
    if (!existsSync13(home)) mkdirSync12(home, { recursive: true, mode: 448 });
    const from = realpathSync4(legacy);
    try {
      renameSync10(legacy, target);
    } catch {
      cpSync2(legacy, target, { recursive: true, preserveTimestamps: true });
      rmSync4(legacy, { recursive: true, force: true });
    }
    chmodSync5(target, 448);
    const to = realpathSync4(target);
    for (const name6 of RECORDS_PATH) {
      const file = join14(target, name6);
      if (!existsSync13(file)) continue;
      const text6 = readFileSync14(file, "utf8");
      if (text6.includes(from)) writeFileSync12(file, text6.split(from).join(to), { mode: 384 });
    }
  } catch {
  }
}
function presetStateFor(root, home) {
  const target = join14(home, "preset");
  const legacy = legacyPresetState(root, home);
  if (!existsSync13(target) && existsSync13(legacy)) moveLegacy(legacy, target, home);
  return target;
}

// src/host/routes/commands.ts
import { createHash as createHash10, randomBytes as randomBytes2 } from "node:crypto";
import { mkdirSync as mkdirSync13, readFileSync as readFileSync15, readdirSync as readdirSync5, renameSync as renameSync11, rmSync as rmSync5, writeFileSync as writeFileSync13 } from "node:fs";
import { join as join15 } from "node:path";
var KEEP = 50;
var TAIL = 64 * 1024;
var MAX_COMMAND = 8 * 1024;
function sandboxOfWs(ws) {
  const text6 = typeof ws === "string" ? ws : "";
  const at = text6.indexOf(":");
  if (at <= 0 || at === text6.length - 1 || text6.includes("\0")) throw refuse(400, "InvalidInput", "A Workspace is named <sandbox>:<name or path>.");
  return text6.slice(0, at);
}
var SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
var REPLACEMENT = /�/g;
function binaryText(text6) {
  if (text6.includes("\0")) return true;
  return (text6.match(REPLACEMENT)?.length ?? 0) > text6.length * 0.1;
}
function decodeTail(bytes, cut) {
  let kept2 = bytes;
  if (cut) {
    let i = 0;
    while (i < 3 && i < kept2.length && (kept2[i] & 192) === 128) i++;
    kept2 = kept2.subarray(i);
  }
  if (kept2.includes(0)) return { text: "", binary: true };
  const text6 = kept2.toString("utf8");
  return binaryText(text6) ? { text: "", binary: true } : { text: text6, binary: false };
}
var Tail = class {
  chunks = [];
  kept = 0;
  total = 0;
  push(chunk) {
    this.total += chunk.length;
    this.chunks.push(chunk);
    this.kept += chunk.length;
    while (this.kept - (this.chunks[0]?.length ?? 0) >= TAIL) this.kept -= this.chunks.shift().length;
  }
  read() {
    const all = Buffer.concat(this.chunks);
    const kept2 = all.subarray(Math.max(0, all.length - TAIL));
    return decodeTail(kept2, this.total > kept2.length);
  }
};
function output(run2) {
  const out = run2.out.read();
  const err = run2.err.read();
  return {
    stdout: out.text,
    stderr: err.text,
    stdoutBytes: run2.out.total,
    stderrBytes: run2.err.total,
    stdoutBinary: out.binary,
    stderrBinary: err.binary
  };
}
var newestFirst = (a, b) => b.startedAt - a.startedAt;
var SandboxCommands = class {
  constructor(host) {
    this.host = host;
  }
  host;
  live = /* @__PURE__ */ new Map();
  /** Each Workspace's log as read or written, keyed by ws. */
  loaded = /* @__PURE__ */ new Map();
  /** Sandboxes whose v1 log has been looked for. */
  migrated = /* @__PURE__ */ new Set();
  base() {
    return join15(this.host.jobs, "sandbox-commands");
  }
  dir(sandbox) {
    if (!SAFE_NAME.test(sandbox)) throw refuse(400, "InvalidInput", `${JSON.stringify(sandbox)} is not a Sandbox name.`);
    return join15(this.base(), sandbox);
  }
  file(ws) {
    const dir = this.dir(sandboxOfWs(ws));
    return join15(dir, `${createHash10("sha1").update(ws).digest("hex").slice(0, 16)}.json`);
  }
  /** Atomically writes a Workspace's log. */
  put(ws, commands) {
    const file = this.file(ws);
    mkdirSync13(this.dir(sandboxOfWs(ws)), { recursive: true });
    const temp = `${file}.${process.pid}.tmp`;
    writeFileSync13(temp, JSON.stringify({ version: 2, ws, commands }, null, 1));
    renameSync11(temp, file);
  }
  /** A Workspace's log file as stored (no live overlay, no caching). */
  load(ws) {
    try {
      const parsed = JSON.parse(readFileSync15(this.file(ws), "utf8"));
      if (parsed?.ws !== ws || !Array.isArray(parsed?.commands)) return [];
      return parsed.commands.filter((c) => c?.ws === ws);
    } catch (error2) {
      if (error2?.code !== "ENOENT" && !(error2 instanceof SyntaxError)) throw error2;
      return [];
    }
  }
  /** Splits a v1 `<sandbox>.json` into Workspace logs, once per Sandbox. */
  migrate(sandbox) {
    if (this.migrated.has(sandbox)) return;
    const v1 = join15(this.base(), `${sandbox}.json`);
    let old;
    try {
      const parsed = JSON.parse(readFileSync15(v1, "utf8"));
      old = Array.isArray(parsed?.commands) ? parsed.commands : [];
    } catch (error2) {
      if (error2?.code === "ENOENT") {
        this.migrated.add(sandbox);
        return;
      }
      if (!(error2 instanceof SyntaxError)) throw error2;
      old = [];
    }
    try {
      const byWs = /* @__PURE__ */ new Map();
      for (const c of old) {
        if (typeof c?.ws !== "string" || typeof c?.id !== "string") continue;
        try {
          if (sandboxOfWs(c.ws) !== sandbox) continue;
        } catch {
          continue;
        }
        const list4 = byWs.get(c.ws);
        if (list4) list4.push(c);
        else byWs.set(c.ws, [c]);
      }
      for (const [ws, commands] of byWs) {
        const have = this.load(ws);
        const ids = new Set(have.map((c) => c.id));
        const merged = [...have, ...commands.filter((c) => !ids.has(c.id))].sort(newestFirst).slice(0, KEEP);
        this.put(ws, merged);
        this.loaded.delete(ws);
      }
      rmSync5(v1, { force: true });
      this.migrated.add(sandbox);
    } catch (error2) {
      this.host.log(`sandbox-commands ${sandbox}: v1 log not migrated: ${error2?.message ?? error2}`);
    }
  }
  /** A Workspace's log, newest first (cached; entries normalized). */
  read(ws) {
    let all = this.loaded.get(ws);
    if (all) return all;
    this.migrate(sandboxOfWs(ws));
    all = this.load(ws);
    for (const c of all) {
      if (c.state === "running" && !this.live.has(c.id)) c.state = "unknown";
      if (typeof c.stdoutBinary !== "boolean") c.stdoutBinary = binaryText(c.stdout ?? "");
      if (typeof c.stderrBinary !== "boolean") c.stderrBinary = binaryText(c.stderr ?? "");
      if (c.stdoutBinary) c.stdout = "";
      if (c.stderrBinary) c.stderr = "";
    }
    this.loaded.set(ws, all);
    return all;
  }
  save(ws) {
    try {
      const all = this.read(ws).slice(0, KEEP);
      this.loaded.set(ws, all);
      this.put(ws, all);
    } catch (error2) {
      this.host.log(`sandbox-commands ${ws}: ${error2?.message ?? error2}`);
    }
  }
  /** Entries with live runs' output so far. */
  view(entries2) {
    return entries2.map((c) => {
      const run2 = this.live.get(c.id);
      return run2 ? { ...c, ...output(run2) } : c;
    });
  }
  /** One Workspace's commands, newest first (running ones with their output so far). */
  listWorkspace(ws) {
    this.file(ws);
    return { items: this.view(this.read(ws)) };
  }
  /** The Sandbox's commands across its Workspaces, newest first, at most {@link KEEP}. */
  list(sandbox) {
    const dir = this.dir(sandbox);
    this.migrate(sandbox);
    const workspaces = /* @__PURE__ */ new Set();
    for (const ws of this.loaded.keys()) if (sandboxOfWs(ws) === sandbox) workspaces.add(ws);
    let names = [];
    try {
      names = readdirSync5(dir);
    } catch (error2) {
      if (error2?.code !== "ENOENT") throw error2;
    }
    for (const name6 of names) {
      if (!/^[0-9a-f]{16}\.json$/.test(name6)) continue;
      try {
        const ws = JSON.parse(readFileSync15(join15(dir, name6), "utf8"))?.ws;
        if (typeof ws === "string" && sandboxOfWs(ws) === sandbox) workspaces.add(ws);
      } catch {
      }
    }
    const all = [...workspaces].flatMap((ws) => this.read(ws)).sort(newestFirst).slice(0, KEEP);
    return { items: this.view(all) };
  }
  /** Whether this host runs a command in Workspace `ws`. */
  running(ws) {
    for (const run2 of this.live.values()) if (run2.entry.ws === ws) return true;
    return false;
  }
  /** Whether this host started LayerFS exec `execId` in Workspace `ws` (running now, or in its kept log). */
  started(ws, execId) {
    for (const run2 of this.live.values()) if (run2.entry.ws === ws && run2.entry.execId === execId) return true;
    try {
      return this.read(ws).some((c) => c.execId === execId);
    } catch {
      return false;
    }
  }
  /** Refuses 409 CommandRunning while this host runs a command in `ws`. */
  assertIdle(ws, doing = "Wait for it to end or cancel it first.") {
    if (this.running(ws)) throw refuse(409, "CommandRunning", `A command is running in ${ws}. ${doing}`);
  }
  /** Start `command` in Workspace `ws`; answers the running entry. */
  start(ws, body) {
    const sandbox = sandboxOfWs(ws);
    this.file(ws);
    const command2 = typeof body?.command === "string" ? body.command.trim() : "";
    if (!command2) throw refuse(400, "InvalidInput", "Enter a command.");
    if (command2.length > MAX_COMMAND) throw refuse(400, "InvalidInput", `A command is at most ${MAX_COMMAND} characters.`);
    this.assertIdle(ws);
    const entry = {
      id: `dsh-${randomBytes2(8).toString("hex")}`,
      ws,
      sandbox,
      command: command2,
      state: "running",
      startedAt: Date.now(),
      finishedAt: null,
      exitCode: null,
      stdout: "",
      stderr: "",
      stdoutBytes: 0,
      stderrBytes: 0,
      stdoutBinary: false,
      stderrBinary: false,
      error: null,
      execId: null
    };
    const run2 = { entry, out: new Tail(), err: new Tail() };
    this.read(ws).unshift(entry);
    this.live.set(entry.id, run2);
    this.save(ws);
    this.forgetSandbox(sandbox);
    this.host.emit("sandbox-command", { type: "sandbox-command", sandbox, ws, id: entry.id, state: "running" });
    const finish = (patch) => {
      Object.assign(entry, patch, { finishedAt: Date.now() }, output(run2));
      this.live.delete(entry.id);
      if (this.loaded.get(ws)?.includes(entry)) this.save(ws);
      this.forgetSandbox(sandbox);
      this.host.emit("sandbox-command", { type: "sandbox-command", sandbox, ws, id: entry.id, state: entry.state });
    };
    const chunk = (c) => Buffer.isBuffer(c) ? c : Buffer.from(String(c));
    let exec;
    try {
      exec = Promise.resolve(this.host.lfs().workspace.exec(ws, command2, {
        detail: true,
        // the start event names the exec id `workspace cancel --exec` takes
        on_progress: (p) => {
          if (typeof p?.exec === "string" && p.exec) {
            entry.execId = p.exec;
            this.save(ws);
          }
        }
      }));
    } catch (error2) {
      exec = Promise.reject(error2);
    }
    void exec.then(
      (result) => {
        if (typeof result?.stdout === "string") run2.out.push(chunk(result.stdout));
        if (typeof result?.stderr === "string") run2.err.push(chunk(result.stderr));
        if (typeof result?.stdout_bytes === "number") run2.out.total = result.stdout_bytes;
        if (typeof result?.stderr_bytes === "number") run2.err.total = result.stderr_bytes;
        if (typeof result?.exec === "string" && result.exec) entry.execId = result.exec;
        const code2 = typeof result?.exit_code === "number" ? result.exit_code : null;
        finish({ state: result?.cancelled === true ? "cancelled" : "exited", exitCode: code2 });
      },
      // a lost reply is `Unknown` with the exec id: the command may still run, nothing runs it again
      (error2) => {
        if (typeof error2?.detail?.exec === "string") entry.execId = error2.detail.exec;
        finish({ state: error2?.code === "Unknown" ? "unknown" : "failed", error: { code: String(error2?.code ?? "Failed"), message: String(error2?.message ?? error2), ...fixOf(error2) } });
      }
    );
    return { ...entry };
  }
  /** Drop the Sandbox's kept sandbox.get answer (util.ts SANDBOX_KEEP_MS): what runs there changed. */
  forgetSandbox(sandbox) {
    try {
      invalidateSandbox(this.host.lfs(), sandbox);
    } catch {
    }
  }
  /**
   * `workspace cancel --exec` for one of this host's running commands, by the
   * exec id its start event named. Before that event there is nothing to name
   * (cancelling the whole Workspace would end other clients' commands): 409.
   */
  async cancel(ws, body) {
    sandboxOfWs(ws);
    const id = typeof body?.id === "string" ? body.id : "";
    const run2 = this.live.get(id);
    if (!run2 || run2.entry.ws !== ws) throw refuse(404, "NotFound", "That command is not running.");
    if (!run2.entry.execId) throw refuse(409, "Busy", "The command has not started yet; cancel it again in a moment.");
    return this.host.lfs().workspace.cancel(ws, { exec: run2.entry.execId, detail: true });
  }
  /** After a successful unmount: drops the Workspace's log and tells clients to re-read. */
  unmounted(ws) {
    const sandbox = sandboxOfWs(ws);
    this.loaded.delete(ws);
    try {
      rmSync5(this.file(ws), { force: true });
    } catch (error2) {
      this.host.log(`sandbox-commands ${ws}: ${error2?.message ?? error2}`);
    }
    this.host.emit("sandbox-command", { type: "sandbox-command", sandbox, ws, id: null, state: "unmounted" });
  }
  /** After a successful close: drops the Sandbox's logs (v2 folder and any v1 file). */
  closed(sandbox) {
    if (!SAFE_NAME.test(sandbox)) return;
    for (const ws of [...this.loaded.keys()]) if (sandboxOfWs(ws) === sandbox) this.loaded.delete(ws);
    this.migrated.delete(sandbox);
    try {
      rmSync5(this.dir(sandbox), { recursive: true, force: true });
      rmSync5(join15(this.base(), `${sandbox}.json`), { force: true });
    } catch (error2) {
      this.host.log(`sandbox-commands ${sandbox}: ${error2?.message ?? error2}`);
    }
  }
  /** Commands still running here. */
  busy() {
    return this.live.size > 0;
  }
};

// src/shared/doctor.ts
var THING_KINDS = ["home", "machine", "store", "project", "sandbox", "workspace", "bucket"];
var DOCTOR_KINDS = ["home", "machine", "store", "project", "sandbox", "bucket"];
var FULL_KINDS = ["project", "bucket"];
var CHILD_LISTS = {
  machines: "machine",
  stores: "store",
  projects: "project",
  sandboxes: "sandbox",
  workspaces: "workspace",
  buckets: "bucket"
};
function thingOf(value) {
  if (!value || typeof value !== "object") return null;
  for (const kind of THING_KINDS) {
    const name6 = value[kind];
    if (typeof name6 === "string" && name6) return { kind, name: name6 };
  }
  return null;
}
var thingKey = (kind, name6) => `${kind}:${name6}`;
function isReport(value) {
  return !!value && typeof value === "object" && Array.isArray(value.findings) && Array.isArray(value.not_checked) && typeof value.status === "string" && !!thingOf(value.tree) && Array.isArray(value.tree.checks);
}
var FAMILY = { home: "home", machine: "machine", store: "store", project: "project", sandbox: "sandbox", bucket: "backup" };
var PROGRESS = ["home", "machine", "store", "project", "sandbox"];
function hasTreeRead(calls) {
  const get = (calls ?? []).find((c) => !!c && typeof c === "object" && c.family === "home" && c.call === "get");
  const values = get?.form?.with;
  return !!values && typeof values === "object" && !Array.isArray(values) && "tree" in values;
}
function doctorArgv(call) {
  const family = FAMILY[call.kind];
  if (!family) return null;
  if (call.kind === "home" ? call.name !== void 0 : !call.name) return null;
  if (call.full && !FULL_KINDS.includes(call.kind)) return null;
  return [family, "doctor", "--detail", ...PROGRESS.includes(call.kind) ? ["--progress"] : [], ...call.full ? ["--full"] : [], ...call.kind === "home" ? [] : ["--", call.name]];
}
var WORD = /^[A-Za-z0-9][\w.:/-]*$/;
function stepOf(command2) {
  const words = command2.trim().split(/\s+/);
  if (words.length < 4 || words[0] !== "layerfs") return null;
  const [, family, call, ...args] = words;
  if (!/^[a-z]+$/.test(family) || !/^[a-z][a-z-]*$/.test(call)) return null;
  if (!args.every((a) => WORD.test(a))) return null;
  return { family, call: call.replaceAll("-", "_"), args };
}
function parseFix(line) {
  if (typeof line !== "string" || !line.trim() || line.length > 512) return null;
  const steps = line.split("&&").map(stepOf);
  if (steps.some((s) => !s)) return null;
  const [a, b] = steps;
  const is = (s, family, call, n) => !!s && s.family === family && s.call === call && s.args.length === n;
  if (steps.length === 2 && is(a, "machine", "stop", 1) && is(b, "machine", "start", 1) && a.args[0] === b.args[0]) return { kind: "restart", steps: [a, b] };
  if (steps.length !== 1) return null;
  if (is(a, "machine", "start", 1)) return { kind: "start", steps: [a] };
  if (is(a, "project", "delete", 1) && /^[^/]+\/[^/]+$/.test(a.args[0])) return { kind: "delete", steps: [a] };
  if (is(a, "backup", "create", 2)) return { kind: "backup", steps: [a] };
  return null;
}
var startLine = (machine) => `layerfs machine start ${machine}`;

// src/host/routes/doctor.ts
var CHECK_LANE = { name: "doctor", limit: 4 };
var FULL_LANE = { name: "doctor-full", limit: 2 };
var TREE_TIMEOUT_MS = 3e4;
var MOST_RUNS = 2e3;
var MOST_KEPT = 5e3;
var invalid3 = (message) => refuse(400, "InvalidInput", message);
var ID = /^[A-Za-z0-9_-]{8,64}$/;
var HANDLE = /^[A-Za-z0-9][\w.:/-]{0,255}$/;
var targetKey = (run2) => `${thingKey(run2.kind, run2.name ?? "")}${run2.full ? ":full" : ""}`;
function failureOf(error2) {
  const code2 = typeof error2?.code === "string" ? error2.code : null;
  const reason = code2 === "Timeout" || error2?.transport === "transport-unknown" && error2?.detail?.timeout ? "timeout" : code2 === "Busy" && (error2?.transport ?? "refusal") === "refusal" ? "busy" : "lost";
  return { reason, code: code2 };
}
var DoctorChecks = class {
  constructor(host, run2 = execute, options = {}) {
    this.host = host;
    this.run = run2;
    this.budgetMs = options.budgetMs ?? 3e5;
    this.treeKeepMs = options.treeKeepMs ?? 2e3;
    const lfs = () => this.host.lfs();
    this.actions = {
      machineStop: async (name6) => {
        const result = await lfs().machine.stop(name6);
        await this.host.machinesStopped?.([name6]);
        return result;
      },
      machineStart: (name6) => lfs().machine.start(name6),
      projectDelete: (project) => lfs().project.delete(project),
      // 2.0 `backup create <store> <bucket>` (a fix with `--file` names an option, so it is never run: parseFix)
      backupCreate: (store, bucket) => lfs().backup.create(store, bucket),
      ...options.actions
    };
  }
  host;
  run;
  live = /* @__PURE__ */ new Map();
  last = /* @__PURE__ */ new Map();
  fixes = /* @__PURE__ */ new Map();
  /** The fix lines this host produced, by the thing they are about: from reports, and from the last tree. */
  offeredByReport = /* @__PURE__ */ new Map();
  offeredByTree = /* @__PURE__ */ new Map();
  tree = { at: 0 };
  budgetMs;
  treeKeepMs;
  actions;
  /** Whether a doctor call or a fix runs now (a preset build waits for it). */
  busy() {
    return this.live.size > 0 || [...this.fixes.values()].some((f) => f.state === "running");
  }
  /** Ends every running doctor call (host shutdown). */
  close() {
    for (const l of this.live.values()) {
      l.stopped = true;
      l.stop.abort();
    }
  }
  async route(method, parts, body) {
    const [what, id, verb, ...rest] = parts;
    if (rest.length) return void 0;
    if (what === "tree" && !id && method === "GET") return this.readTree();
    if (what === "results" && !id && method === "GET") return this.results();
    if (what === "runs" && !id && method === "POST") return this.start(body ?? {});
    if (what === "runs" && id && verb === "stop" && method === "POST") return this.stop(id);
    if (what === "fixes" && !id && method === "POST") return this.fix(body ?? {});
    return void 0;
  }
  // ---------------------------------------------------------------- the tree
  /** The home's records as one tree: no doctor, no probe. One read at a time; its answer serves every reader for `treeKeepMs`. */
  readTree() {
    if (this.tree.value && Date.now() - this.tree.at < this.treeKeepMs) return Promise.resolve(this.tree.value);
    if (this.tree.pending) return this.tree.pending;
    const pending2 = (async () => {
      let answer;
      const hasTree = hasTreeRead((await this.host.discover()).calls);
      if (!hasTree) throw refuse(501, "Unsupported", "This LayerFS runtime has no `home get --with tree`; the Doctor page needs a 2.0 runtime.");
      try {
        answer = await this.run(this.host.lfs().spec, ["home", "get", "--with", "tree", "--detail"], { read: true, timeout: TREE_TIMEOUT_MS });
      } catch (error2) {
        if (error2?.transport === "usage-incompatible") throw refuse(501, "Unsupported", "This LayerFS runtime has no `home get --with tree`; the Doctor page needs a 2.0 runtime.");
        throw error2;
      }
      const tree = answer?.tree;
      if (!tree || typeof tree !== "object") throw refuse(501, "Unsupported", "This LayerFS runtime answered `home get --with tree` without a tree; the Doctor page needs a 2.0 runtime.");
      const value = {
        at: Date.now(),
        home: {
          home: String(answer.home ?? this.host.home),
          state: String(answer.state ?? "unknown"),
          version: typeof answer.version === "string" ? answer.version : null,
          generation: typeof answer.generation === "number" ? answer.generation : null,
          reason: typeof answer.reason === "string" ? answer.reason : null,
          fix: typeof answer.fix === "string" ? answer.fix : null
        },
        tree: { machines: listOf(tree.machines), stores: listOf(tree.stores), buckets: listOf(tree.buckets) }
      };
      this.offeredByTree = offersOfTree(value);
      this.tree = { at: value.at, value };
      return value;
    })();
    this.tree.pending = pending2;
    void pending2.catch(() => {
    }).finally(() => {
      if (this.tree.pending === pending2) delete this.tree.pending;
    });
    return pending2;
  }
  results() {
    return { last: [...this.last.values()], running: [...this.live.values()].map((l) => l.run), fixes: [...this.fixes.values()] };
  }
  // ---------------------------------------------------------------- doctor calls
  /** Starts each named doctor call once. A call whose target is already being checked is not started twice: its id comes back in `already`. */
  start(input) {
    const list4 = Array.isArray(input?.runs) ? input.runs : [];
    if (!list4.length || list4.length > MOST_RUNS) throw invalid3(`Name 1 to ${MOST_RUNS} doctor calls.`);
    const group = input.group == null ? null : String(input.group);
    if (group !== null && !ID.test(group)) throw invalid3("The group must be an id.");
    const seen = /* @__PURE__ */ new Set();
    const wanted = list4.map((r) => {
      const kind = r?.kind;
      const name6 = r?.name == null ? null : String(r.name);
      const full2 = r?.full === true;
      if (typeof r?.id !== "string" || !ID.test(r.id) || seen.has(r.id) || this.live.has(r.id)) throw invalid3("Each doctor call needs its own id.");
      seen.add(r.id);
      if (!DOCTOR_KINDS.includes(kind)) throw invalid3(`${String(r?.kind)} has no doctor.`);
      if (name6 !== null && !HANDLE.test(name6)) throw invalid3("That is not a handle.");
      const argv = doctorArgv({ kind, name: name6 ?? void 0, full: full2 });
      if (!argv) throw invalid3(kind === "home" ? "The home doctor takes no name." : full2 ? `${kind} has no Full check.` : `Name the ${kind} to check.`);
      return { id: r.id, kind, name: name6, full: full2, argv };
    });
    const busy2 = new Set([...this.live.values()].map((l) => targetKey(l.run)));
    const runs = [];
    const already = [];
    for (const w of wanted) {
      const run2 = { id: w.id, kind: w.kind, name: w.name, full: w.full, group, state: "queued", started: Date.now(), ended: null };
      if (busy2.has(targetKey(run2))) {
        already.push(w.id);
        continue;
      }
      busy2.add(targetKey(run2));
      const live = { run: run2, stop: new AbortController(), stopped: false };
      this.live.set(run2.id, live);
      runs.push({ ...run2 });
      this.emit(run2);
      void this.drive(live, w.argv);
    }
    return new Answer(202, { runs, already });
  }
  emit(run2, more = {}) {
    this.host.emit("doctor-run", wire({ type: "doctor-run", ...run2, ...more }));
  }
  async drive(live, argv) {
    const { run: run2 } = live;
    const storeRead = run2.kind === "store" ? run2.name : run2.kind === "project" ? run2.name.split("/")[0] : void 0;
    let report;
    let failure;
    try {
      const answer = await this.run(this.host.lfs().spec, argv, {
        read: true,
        lane: run2.full ? FULL_LANE : CHECK_LANE,
        signal: live.stop.signal,
        ...run2.full ? {} : { timeout: this.budgetMs },
        ...storeRead ? { storeRead } : {},
        onSpawn: () => {
          if (run2.state === "queued") {
            run2.state = "running";
            this.emit(run2);
          }
        },
        onProgress: (progress) => {
          if (!thingOf(progress?.node)) return;
          const event = { phase: String(progress.phase ?? ""), done: Number(progress.done) || 0, total: Number(progress.total) || 0, node: progress.node };
          this.emit(run2, { state: "running", progress: event });
        }
      });
      if (isReport(answer)) report = answer;
      else failure = { reason: "lost", code: "InvalidReport" };
    } catch (error2) {
      if (!live.stopped) failure = failureOf(error2);
    }
    run2.ended = Date.now();
    run2.state = live.stopped ? "stopped" : report ? "done" : "failed";
    this.live.delete(run2.id);
    if (run2.state !== "stopped") {
      const kept2 = { ...run2, ...report ? { report } : {}, ...failure ? { failure } : {} };
      this.last.delete(targetKey(run2));
      this.last.set(targetKey(run2), kept2);
      if (this.last.size > MOST_KEPT) this.last.delete(this.last.keys().next().value);
      if (report) this.offer(report);
    }
    this.emit(run2, { ...report ? { report } : {}, ...failure ? { failure } : {} });
  }
  /** Remember the fix lines a report names, by the thing each is about; a thing the report covers starts clean. */
  offer(report) {
    const walk2 = (node) => {
      const thing = thingOf(node);
      if (thing) this.offeredByReport.delete(thingKey(thing.kind, thing.name));
      for (const list4 of Object.keys(CHILD_LISTS)) for (const child of listOf(node?.[list4])) walk2(child);
    };
    walk2(report.tree);
    for (const finding of report.findings) {
      const thing = thingOf(finding);
      if (!thing || typeof finding.fix !== "string" || !finding.fix) continue;
      const key = thingKey(thing.kind, thing.name);
      if (!this.offeredByReport.has(key)) this.offeredByReport.set(key, /* @__PURE__ */ new Set());
      this.offeredByReport.get(key).add(finding.fix);
    }
  }
  stop(id) {
    const live = this.live.get(id);
    if (!live) throw refuse(404, "NotFound", "That doctor call is not running.");
    live.stopped = true;
    live.stop.abort();
    return { stopped: true };
  }
  // ---------------------------------------------------------------- fixes
  /** Runs a fix line this host produced for the named thing, when it is on the allow list. One attempt per step. */
  fix(input) {
    const kind = input?.kind;
    const name6 = String(input?.name ?? "");
    const line = typeof input?.fix === "string" ? input.fix : "";
    if (typeof input?.id !== "string" || !ID.test(input.id)) throw invalid3("The fix needs an id.");
    if (!DOCTOR_KINDS.includes(kind) || kind === "home" || !HANDLE.test(name6)) throw invalid3("Name the thing to fix.");
    const key = thingKey(kind, name6);
    if (!this.offeredByReport.get(key)?.has(line) && !this.offeredByTree.get(key)?.has(line)) {
      throw refuse(409, "Conflict", "No report of this host offers that fix for it now. Check it again.");
    }
    const parsed = parseFix(line);
    if (!parsed || !aboutThing(parsed, kind, name6)) throw invalid3("That fix is not one this page runs; copy the command instead.");
    if (this.fixes.get(key)?.state === "running") throw refuse(409, "Busy", "A fix is already running on it.");
    const fix = { id: input.id, kind, name: name6, fix: parsed.kind, step: 0, steps: parsed.steps.map((s) => s.call), state: "running" };
    this.fixes.set(key, fix);
    this.emitFix(fix);
    void this.repair(key, fix, parsed);
    return new Answer(202, { fix: { ...fix } });
  }
  emitFix(fix) {
    this.host.emit("doctor-fix", wire({ type: "doctor-fix", ...fix }));
  }
  step(step) {
    const [first, second] = step.args;
    if (step.family === "machine" && step.call === "stop") return this.actions.machineStop(first);
    if (step.family === "machine" && step.call === "start") return this.actions.machineStart(first);
    if (step.family === "project" && step.call === "delete") return this.actions.projectDelete(first);
    if (step.family === "backup" && step.call === "create") return this.actions.backupCreate(first, second);
    return Promise.reject(invalid3("That call is not on the allow list."));
  }
  async repair(key, fix, parsed) {
    try {
      for (let i = 0; i < parsed.steps.length; i++) {
        if (i > 0) {
          fix.step = i;
          this.emitFix(fix);
        }
        await this.step(parsed.steps[i]);
      }
      fix.state = "done";
      this.offeredByReport.delete(key);
    } catch (error2) {
      const refused = typeof error2?.code === "string" && (error2.transport ?? "refusal") === "refusal";
      fix.state = refused ? "refused" : "lost";
      if (refused) fix.refusal = { code: error2.code, message: String(error2.message ?? error2.code), ...typeof error2.fix === "string" && error2.fix ? { fix: error2.fix } : {} };
    } finally {
      this.tree = { at: 0 };
      this.emitFix(fix);
      if (this.fixes.get(key) === fix) this.fixes.delete(key);
    }
  }
};
var listOf = (value) => Array.isArray(value) ? value : [];
function aboutThing(fix, kind, name6) {
  const [step] = fix.steps;
  if (fix.kind === "restart" || fix.kind === "start") return kind === "machine" && fix.steps.every((s) => s.args[0] === name6);
  if (fix.kind === "delete") return kind === "project" && step.args[0] === name6;
  return kind === "store" && step.args[0] === name6;
}
function offersOfTree(answer) {
  const out = /* @__PURE__ */ new Map();
  const add = (kind, name6, line) => {
    if (typeof name6 !== "string" || typeof line !== "string" || !line) return;
    const key = thingKey(kind, name6);
    if (!out.has(key)) out.set(key, /* @__PURE__ */ new Set());
    out.get(key).add(line);
  };
  const store = (s) => add("store", s.store, s.fix);
  for (const m of listOf(answer.tree.machines)) {
    add("machine", m.machine, m.fix);
    if (m.state === "stopped" && typeof m.machine === "string") add("machine", m.machine, startLine(m.machine));
    for (const s of listOf(m.stores)) store(s);
    for (const b of listOf(m.sandboxes)) add("sandbox", b.sandbox, b.fix);
  }
  for (const s of listOf(answer.tree.stores)) store(s);
  return out;
}

// src/host/routes/machines.ts
import { join as join20 } from "node:path";

// src/host/routes/computer.ts
import { execFileSync as execFileSync2 } from "node:child_process";
import { readFileSync as readFileSync16 } from "node:fs";
import { arch, platform, release, version } from "node:os";
function osOf(value) {
  if (value === "macos" || value === "darwin") return "macos";
  if (value === "linux") return "linux";
  if (value === "windows" || value === "win32") return "windows";
  return "other";
}
function prettyName(text6) {
  const line = text6.split("\n").find((l) => l.startsWith("PRETTY_NAME="));
  const value = line?.slice("PRETTY_NAME=".length).trim().replace(/^"(.*)"$/, "$1");
  return value || null;
}
function releaseName(os) {
  try {
    if (os === "macos") {
      const v = execFileSync2("sw_vers", ["-productVersion"], { encoding: "utf8", timeout: 2e3 }).trim();
      return v ? `macOS ${v}` : "macOS";
    }
    if (os === "linux") {
      for (const file of ["/etc/os-release", "/usr/lib/os-release"]) {
        try {
          const name6 = prettyName(readFileSync16(file, "utf8"));
          if (name6) return name6;
        } catch {
        }
      }
      return `Linux ${release()}`;
    }
    if (os === "windows") return version() || "Windows";
  } catch {
  }
  return null;
}
var known3 = null;
function computer(lfsHost) {
  const os = lfsHost ? osOf(lfsHost) : osOf(platform());
  if (!known3 || known3.os !== os) known3 = { os, name: releaseName(os), arch: arch() };
  return known3;
}

// src/host/images/archive.ts
import { closeSync as closeSync6, fstatSync as fstatSync2, openSync as openSync6, readSync as readSync3, statSync as statSync6 } from "node:fs";
function magicOf(fd, blob) {
  const b = Buffer.alloc(4);
  readSync3(fd, b, 0, Math.min(4, blob.size), blob.offset);
  if (b[0] === 31 && b[1] === 139) return "gzip";
  if (b[0] === 40 && b[1] === 181 && b[2] === 47 && b[3] === 253) return "zstd";
  return "tar";
}
var BLOCK = 512;
var SMALL_MAX = 1 << 20;
var HEX = /^[a-f0-9]{64}$/;
var refuse2 = (message) => Object.assign(new Error(message), { code: "InvalidInput" });
var cstr = (b, start, length) => {
  const slice = b.subarray(start, start + length);
  const end = slice.indexOf(0);
  return slice.subarray(0, end < 0 ? slice.length : end).toString("utf8");
};
function sizeOf(b) {
  const field = b.subarray(124, 136);
  if (field[0] & 128) {
    let n = 0;
    for (let i = 1; i < field.length; i++) n = n * 256 + field[i];
    return n;
  }
  const text6 = cstr(b, 124, 12).trim();
  return text6 ? parseInt(text6, 8) : 0;
}
function paxPath(data) {
  let at = 0;
  while (at < data.length) {
    const space = data.indexOf(32, at);
    if (space < 0) break;
    const length = parseInt(data.subarray(at, space).toString("ascii"), 10);
    if (!Number.isFinite(length) || length <= 0) break;
    const record = data.subarray(space + 1, at + length - 1).toString("utf8");
    const eq = record.indexOf("=");
    if (eq > 0 && record.slice(0, eq) === "path") return record.slice(eq + 1);
    at += length;
  }
  return null;
}
var normal = (name6) => name6.replace(/^(\.\/)+/, "");
function walk(fd, start, end, visit) {
  const header = Buffer.alloc(BLOCK);
  let at = start;
  let longName = null;
  while (at + BLOCK <= end) {
    if (readSync3(fd, header, 0, BLOCK, at) < BLOCK) break;
    if (header.every((byte) => byte === 0)) break;
    const size = sizeOf(header);
    if (!Number.isSafeInteger(size) || size < 0) throw refuse2("the image archive has a malformed tar header");
    const type = String.fromCharCode(header[156] || 48);
    const data = at + BLOCK;
    const next = data + Math.ceil(size / BLOCK) * BLOCK;
    if (type === "L" || type === "x") {
      if (size > SMALL_MAX) throw refuse2("the image archive has an oversized tar header");
      const body = Buffer.alloc(size);
      readSync3(fd, body, 0, size, data);
      longName = type === "L" ? cstr(body, 0, size) : paxPath(body) ?? longName;
    } else if (type !== "g") {
      const ustar = cstr(header, 257, 6).startsWith("ustar");
      const prefix = ustar ? cstr(header, 345, 155) : "";
      const name6 = longName ?? (prefix ? `${prefix}/${cstr(header, 0, 100)}` : cstr(header, 0, 100));
      longName = null;
      visit(normal(name6), type, data, size);
    }
    at = next;
  }
}
function entries(fd, total) {
  const found = /* @__PURE__ */ new Map();
  walk(fd, 0, total, (name6, type, offset, size) => {
    if (type === "0" || type === "\0" || type === "7") found.set(name6, { offset, size });
  });
  return found;
}
var LOADERS = {
  arm64: ["lib/ld-linux-aarch64.so.1", "usr/lib/ld-linux-aarch64.so.1"],
  amd64: ["lib64/ld-linux-x86-64.so.2", "usr/lib64/ld-linux-x86-64.so.2"]
};
function scanLayer(fd, blob, loaders) {
  let device = false, loader = false;
  walk(fd, blob.offset, blob.offset + blob.size, (name6, type) => {
    if (type === "3" || type === "4") device = true;
    if (loaders.has(name6)) loader = true;
  });
  return { device, loader };
}
function readSmall(fd, blob, what) {
  if (blob.size > SMALL_MAX) throw refuse2(`the image archive's ${what} is too long`);
  const b = Buffer.alloc(blob.size);
  readSync3(fd, b, 0, blob.size, blob.offset);
  return b;
}
function problemOf(fd, all, layers, architecture, scans) {
  const blobs = layers.map((l) => typeof l === "string" ? all.get(normal(l)) : void 0);
  if (blobs.some((b) => b && b.size > 0 && magicOf(fd, b) !== "tar")) return "compressed";
  const loaders = new Set(architecture && LOADERS[architecture] ? LOADERS[architecture] : Object.values(LOADERS).flat());
  let device = false, loader = false;
  layers.forEach((l, i) => {
    const blob = blobs[i];
    if (!blob || typeof l !== "string") return;
    const key = `${normal(l)}\0${[...loaders].join(",")}`;
    let scan = scans.get(key);
    if (!scan) {
      try {
        scan = scanLayer(fd, blob, loaders);
      } catch {
        scan = { device: false, loader: true };
      }
      scans.set(key, scan);
    }
    device ||= scan.device;
    loader ||= scan.loader;
  });
  return device ? "device-node" : !loader ? "no-glibc" : null;
}
function layerBytes(all, layers) {
  let total = 0;
  for (const l of layers) {
    const blob = typeof l === "string" ? all.get(normal(l)) : void 0;
    if (!blob) return null;
    total += blob.size;
  }
  return total;
}
var kept = /* @__PURE__ */ new Map();
function readArchive(path2) {
  const stat2 = statSync6(path2);
  if (!stat2.isFile()) throw refuse2(`${path2} is not a file`);
  const key = `${path2}\0${stat2.size}\0${stat2.mtimeMs}`;
  const hit = kept.get(key);
  if (hit) return hit;
  const fd = openSync6(path2, "r");
  try {
    const all = entries(fd, fstatSync2(fd).size);
    const manifest = all.get("manifest.json");
    if (!manifest) throw refuse2("the image archive has no manifest.json (make it with docker save)");
    let list4;
    try {
      list4 = JSON.parse(readSmall(fd, manifest, "manifest.json").toString("utf8"));
    } catch (e) {
      throw e.code ? e : refuse2("the image archive's manifest.json is not JSON");
    }
    if (!Array.isArray(list4)) throw refuse2("the image archive's manifest.json is not a list");
    const images = [];
    const scans = /* @__PURE__ */ new Map();
    for (const item of list4) {
      if (!item || typeof item.Config !== "string" || !Array.isArray(item.Layers)) continue;
      const config = normal(item.Config);
      const base = config.slice(config.lastIndexOf("/") + 1);
      const hex = base.endsWith(".json") ? base.slice(0, -5) : base;
      if (!HEX.test(hex)) continue;
      let facts3 = {};
      const blob = all.get(config);
      if (blob) {
        try {
          facts3 = JSON.parse(readSmall(fd, blob, "config").toString("utf8")) ?? {};
        } catch {
        }
      }
      const text6 = (v) => typeof v === "string" && v ? v : null;
      images.push({
        digest: `sha256:${hex}`,
        tags: Array.isArray(item.RepoTags) ? item.RepoTags.filter((t) => typeof t === "string") : [],
        os: text6(facts3.os),
        architecture: text6(facts3.architecture),
        created: text6(facts3.created),
        layers: item.Layers.length,
        size: layerBytes(all, item.Layers),
        problem: problemOf(fd, all, item.Layers, text6(facts3.architecture), scans)
      });
    }
    if (kept.size > 64) kept.clear();
    kept.set(key, images);
    return images;
  } finally {
    closeSync6(fd);
  }
}

// src/host/routes/inspect.ts
var LOG_LIMIT_MAX = 1e3;
var KEEP_LINES = 1e3;
var KEEP_CHARS = 512 * 1024;
var KEEP_TARGETS = 64;
var text2 = (value) => typeof value === "string" && value ? value : null;
function logQuery(query) {
  const cursor = query.get("cursor") || null, before = query.get("before") || null;
  if (cursor && before) throw refuse(400, "InvalidInput", "A log read takes a cursor or a before, not both.");
  for (const value of [cursor, before]) if (value && (value.length > 1024 || /[\0\r\n]/.test(value))) throw refuse(400, "InvalidInput", "That is not a log cursor.");
  const raw = query.get("limit");
  let limit = null;
  if (raw !== null && raw !== "") {
    limit = Number(raw);
    if (!Number.isInteger(limit) || limit < 1 || limit > LOG_LIMIT_MAX) throw refuse(400, "InvalidInput", `A log read's limit is 1 to ${LOG_LIMIT_MAX}.`);
  }
  return { cursor, before, limit };
}
function logAnswer(answer) {
  const lines2 = [];
  for (const line of Array.isArray(answer?.items) ? answer.items : []) if (line && typeof line.text === "string") lines2.push(line.continued === true ? { text: line.text, continued: true } : { text: line.text });
  const before = text2(answer?.next_cursor);
  return { lines: lines2, cursor: null, before, hasMore: !!before };
}
function refusalOf2(error2, at) {
  const message = error2 instanceof Error ? error2.message : typeof error2?.message === "string" ? error2.message : String(error2);
  return { at, code: typeof error2?.code === "string" ? error2.code : "Unknown", message };
}
var FILES_LIMIT_MAX = 1e3;
var FILES_DEPTH_MAX = 32;
var FILES_LENGTH_MAX = 1024 * 1024;
var KEEP_FOLDERS = 128;
function filesQuery(query) {
  const path2 = query.get("path") || null;
  if (path2 !== null && (!path2.startsWith("/") || path2.length > 4096 || path2.includes("\0"))) throw refuse(400, "InvalidInput", "A path here is absolute: it starts with /.");
  const cursor = query.get("cursor") || null;
  if (cursor !== null && (cursor.length > 8192 || cursor.includes("\0"))) throw refuse(400, "InvalidInput", "That is not a folder cursor.");
  const whole = (name6, min, max) => {
    const raw = query.get(name6);
    if (raw === null || raw === "") return null;
    const n = Number(raw);
    if (!Number.isSafeInteger(n) || n < min || n > max) throw refuse(400, "InvalidInput", `A files read's ${name6} is ${min} to ${max}.`);
    return n;
  };
  const q2 = { path: path2, cursor, depth: whole("depth", 1, FILES_DEPTH_MAX), limit: whole("limit", 1, FILES_LIMIT_MAX), offset: whole("offset", 0, Number.MAX_SAFE_INTEGER), length: whole("length", 1, FILES_LENGTH_MAX) };
  if (path2 === null && (q2.cursor !== null || q2.offset !== null || q2.length !== null)) throw refuse(400, "InvalidInput", "The roots are read without a cursor, offset or length.");
  if (q2.cursor !== null && (q2.offset !== null || q2.length !== null)) throw refuse(400, "InvalidInput", "A folder page takes a cursor, a file window an offset and length, not both.");
  return q2;
}
var count = (value) => typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
var modeOf2 = (value) => typeof value === "string" && /^[0-7]{3,6}$/.test(value) ? parseInt(value, 8) : count(value);
var msOf = (value) => {
  const at = typeof value === "string" ? Date.parse(value) : NaN;
  return Number.isFinite(at) ? at : null;
};
var entryKind = (type, notRead) => text2(notRead) ?? (type === "dir" ? "folder" : type === "file" || type === "symlink" ? type : "other");
function machineFilesAnswer(answer, path2, offset) {
  if (answer?.type === "file" || typeof answer?.text === "string" || answer?.binary === true) {
    const next2 = count(answer.next_byte_offset);
    return { kind: "file", path: path2 ?? "", size: count(answer.size) ?? 0, offset: offset ?? 0, content: typeof answer.text === "string" ? answer.text : "", binary: answer.binary === true, next: next2 !== null && Number.isSafeInteger(next2) ? next2 : null };
  }
  if (!Array.isArray(answer?.items)) throw refuse(null, "Unknown", "LayerFS answered neither a folder nor a file.");
  const entries2 = [];
  for (const e of answer.items) {
    if (!e || typeof e.path !== "string" || !e.path) continue;
    entries2.push({
      path: e.path,
      depth: Number.isSafeInteger(e.depth) && e.depth > 0 ? e.depth : 1,
      kind: entryKind(e.type, e.not_read),
      size: count(e.size),
      mode: modeOf2(e.mode),
      mtime: msOf(e.modified_at),
      ...text2(e.role) ? { role: e.role } : {},
      ...text2(e.target) ? { target: e.target } : {},
      ...text2(e.workspace) ? { workspace: e.workspace } : {},
      ...text2(e.fs) ? { fs: e.fs } : {},
      ...count(e.disk_free_bytes) !== null ? { free_bytes: count(e.disk_free_bytes) } : {}
    });
  }
  const next = text2(answer.next_cursor);
  return { kind: "folder", path: path2, entries: entries2, next, hasMore: !!next, reason: null };
}
function filesAnswer(answer, path2, offset = null) {
  if (!answer || typeof answer !== "object") throw refuse(null, "Unknown", "LayerFS answered neither a folder nor a file.");
  return machineFilesAnswer(answer, path2, offset);
}
var cancelled = () => refuse(null, "Cancelled", "The read was dropped: nobody waits for its answer");
var InspectReads = class {
  flying = /* @__PURE__ */ new Map();
  kept = /* @__PURE__ */ new Map();
  requests = /* @__PURE__ */ new Map();
  keptFolders = /* @__PURE__ */ new Map();
  /**
   * Run `run` once for every caller asking `key` at the same time. `signal`
   * ends this caller's wait (`Cancelled`); the read is aborted (its own
   * signal, handed to `run`) when its last caller has gone.
   */
  read(key, run2, signal) {
    if (signal?.aborted) return Promise.reject(cancelled());
    let flight = this.flying.get(key);
    if (!flight) {
      const controller = new AbortController();
      const made = { controller, waiters: 0, promise: Promise.resolve().then(() => run2(controller.signal)).finally(() => {
        if (this.flying.get(key) === made) this.flying.delete(key);
      }) };
      made.promise.catch(() => {
      });
      this.flying.set(key, flight = made);
    }
    const joined = flight;
    joined.waiters++;
    if (!signal) return joined.promise;
    return new Promise((resolve11, reject) => {
      let left = false;
      const leave = () => {
        if (left) return;
        left = true;
        signal.removeEventListener("abort", gone);
        if (--joined.waiters === 0 && this.flying.get(key) === joined) {
          this.flying.delete(key);
          joined.controller.abort();
        }
      };
      const gone = () => {
        leave();
        reject(cancelled());
      };
      signal.addEventListener("abort", gone, { once: true });
      joined.promise.then((value) => {
        if (!left) {
          left = true;
          signal.removeEventListener("abort", gone);
          resolve11(value);
        }
      }, (error2) => {
        if (!left) {
          left = true;
          signal.removeEventListener("abort", gone);
          reject(error2);
        }
      });
    });
  }
  /** How many reads are in flight (tests). */
  get flights() {
    return this.flying.size;
  }
  /**
   * A signal for one page request named `rid`: aborted by `outer` (the
   * connection that asked) or by {@link cancel}. `done` forgets it.
   */
  request(rid, outer) {
    if (!rid) return { signal: outer, done: () => {
    } };
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (outer?.aborted) controller.abort();
    else outer?.addEventListener("abort", abort, { once: true });
    this.requests.get(rid)?.abort();
    this.requests.set(rid, controller);
    return { signal: controller.signal, done: () => {
      outer?.removeEventListener("abort", abort);
      if (this.requests.get(rid) === controller) this.requests.delete(rid);
    } };
  }
  /** The page stopped waiting for request `rid` (a left view, a collapsed folder). True when it was still open. */
  cancel(rid) {
    const controller = typeof rid === "string" ? this.requests.get(rid) : void 0;
    if (!controller) return false;
    this.requests.delete(rid);
    controller.abort();
    return true;
  }
  /** The last good answer kept for `target`. */
  last(target) {
    return this.kept.get(target);
  }
  /** Keep `value` as `target`'s last good answer (the oldest target goes past {@link KEEP_TARGETS}). */
  keep(target, value, at = Date.now()) {
    this.kept.delete(target);
    if (this.kept.size >= KEEP_TARGETS) this.kept.delete(this.kept.keys().next().value);
    this.kept.set(target, { at, value });
  }
  /** Forget what is kept for `target` (it was removed or replaced). */
  forget(target) {
    this.kept.delete(target);
  }
  /**
   * One log read for `target` (`machine:<name>` or `sandbox:<name>`).
   * A tail read (no cursor, no before) is kept whole; a forward read extends
   * the kept tail (bounded by {@link KEEP_LINES} and {@link KEEP_CHARS}; once
   * its start is cut, its `before` is gone). A refused read answers `stale`:
   * with the kept tail for a tail read, else with no lines and the cursors it
   * was asked with, so the page keeps what it already shows.
   * @param call - the LayerFS call: `(options) => lfs.machine.log(name, options)`.
   */
  async log(target, query, call, signal) {
    const tail = !query.cursor && !query.before;
    const key = `log:${target}:${query.cursor ?? ""}:${query.before ?? ""}:${query.limit ?? ""}`;
    const observedAt = Date.now();
    let answer;
    try {
      answer = await this.read(key, (inner) => call({
        ...query.cursor ? { cursor: query.cursor } : {},
        ...query.before ? { before: query.before } : {},
        ...query.limit ? { limit: query.limit } : {},
        signal: inner
      }), signal);
    } catch (error2) {
      if (error2?.code === "Cancelled") throw error2;
      const kept2 = this.last(`log:${target}`);
      const stale = refusalOf2(error2, kept2?.at ?? null);
      if (tail && kept2) return { ...kept2.value, observedAt, stale };
      return { lines: [], cursor: query.cursor, before: query.before, hasMore: false, observedAt, stale };
    }
    const view = logAnswer(answer);
    if (tail) this.keep(`log:${target}`, bounded(view), observedAt);
    else if (query.cursor) {
      const kept2 = this.last(`log:${target}`);
      if (kept2 && kept2.value.cursor === query.cursor) this.keep(`log:${target}`, bounded({ ...kept2.value, lines: [...kept2.value.lines, ...view.lines], cursor: view.cursor, hasMore: view.hasMore }), observedAt);
    }
    return { ...view, observedAt, stale: false };
  }
  /**
   * One files read for `target` (`machine:<name>` or `sandbox:<name>`): the
   * roots (no path), a folder page, or a file window; LayerFS says which a
   * path is. A folder's first page (and the roots) is kept; when a later read
   * of it is refused, the kept page answers again marked `stale`. Any other
   * refused read answers `refused` with the refusal: a refusal stays inside
   * the folder or file it is about, and never fails the page's request.
   * @param call - the LayerFS call: `(path, options) => lfs.machine.files(name, path, options)`.
   */
  async files(target, query, call, signal) {
    const key = `files:${target}:${JSON.stringify([query.path, query.depth, query.cursor, query.limit, query.offset, query.length])}`;
    const first = query.cursor === null && query.offset === null && query.length === null;
    const keptKey = `${target}\0${query.path ?? ""}\0${query.depth ?? ""}\0${query.limit ?? ""}`;
    const observedAt = Date.now();
    let answer;
    try {
      answer = await this.read(key, (inner) => call(query.path ?? void 0, {
        ...query.depth !== null ? { depth: query.depth } : {},
        ...query.cursor !== null ? { cursor: query.cursor } : {},
        ...query.limit !== null ? { limit: query.limit } : {},
        ...query.offset !== null ? { offset: query.offset } : {},
        ...query.length !== null ? { length: query.length } : {},
        signal: inner
      }), signal);
    } catch (error2) {
      if (error2?.code === "Cancelled") throw error2;
      const kept2 = first ? this.keptFolders.get(keptKey) : void 0;
      const stale = refusalOf2(error2, kept2?.at ?? null);
      if (kept2) return { ...kept2.value, observedAt, stale };
      return { kind: "refused", path: query.path, observedAt, stale };
    }
    let view;
    try {
      view = filesAnswer(answer, query.path, query.offset);
    } catch (error2) {
      return { kind: "refused", path: query.path, observedAt, stale: refusalOf2(error2, null) };
    }
    if (view.kind === "folder" && first) {
      this.keptFolders.delete(keptKey);
      if (this.keptFolders.size >= KEEP_FOLDERS) this.keptFolders.delete(this.keptFolders.keys().next().value);
      this.keptFolders.set(keptKey, { at: observedAt, value: view });
    } else if (view.kind === "file" && first) this.keptFolders.delete(keptKey);
    return { ...view, observedAt, stale: false };
  }
};
function bounded(view) {
  let from = Math.max(0, view.lines.length - KEEP_LINES), chars = 0;
  for (let i = view.lines.length - 1; i >= from; i--) {
    chars += view.lines[i].text.length;
    if (chars > KEEP_CHARS) {
      from = i + 1;
      break;
    }
  }
  while (from > 0 && from < view.lines.length && view.lines[from - 1].continued) from++;
  return from === 0 ? view : { ...view, lines: view.lines.slice(from), before: null };
}

// src/host/routes/observed.ts
var text3 = (value) => typeof value === "string" && value ? value : null;
var count2 = (value) => {
  const n = typeof value === "bigint" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) && n >= 0 ? n : null;
};
var msOf2 = (value) => {
  if (typeof value === "string") {
    const at = Date.parse(value);
    return Number.isFinite(at) ? at : null;
  }
  return count2(value);
};
function usageOf(u) {
  if (!u || typeof u !== "object") return null;
  const ms = count2(u.cpu_ms);
  return {
    cpuUsec: ms === null ? null : ms * 1e3,
    memoryCurrent: count2(u.memory_bytes),
    memoryPeak: count2(u.memory_peak_bytes),
    ..."memory_file_bytes" in u ? { memoryFile: count2(u.memory_file_bytes) } : {},
    pids: count2(u.pid_count),
    ..."oom_kill_count" in u ? { oomKills: count2(u.oom_kill_count) } : {}
  };
}
function sandboxRowOf(row) {
  const name6 = text3(row?.sandbox) ?? text3(row?.name);
  if (!name6) return null;
  const live = row.live === true ? true : row.live === false ? false : null;
  const liveReason = text3(row.live_reason), usageReason = text3(row.usage_reason);
  return {
    name: name6,
    live,
    ...liveReason ? { liveReason } : {},
    startedAt: msOf2(row.started_at),
    usage: usageOf(row.usage),
    ...usageReason ? { usageReason } : {}
  };
}
function statsAnswer(answer) {
  const w = answer?.worker, d = answer?.data_disk ?? {};
  const reasons = Array.isArray(answer?.reasons) ? answer.reasons.filter((r) => typeof r === "string") : [];
  const rows2 = (Array.isArray(answer?.sandboxes) ? answer.sandboxes : []).map(sandboxRowOf).filter((x) => !!x);
  const usec = (ms) => {
    const n = count2(ms);
    return n === null ? null : n * 1e3;
  };
  return {
    platform: text3(answer?.platform),
    observedAt: msOf2(answer?.observed_at),
    worker: w && typeof w === "object" ? { version: text3(w.version), pid: count2(w.pid), startedAt: msOf2(w.started_at), protocol: w.protocol == null ? null : String(w.protocol), bundle: text3(w.bundle) } : null,
    resources: {
      cpus: count2(answer?.cpus),
      memoryTotal: count2(answer?.memory_total_bytes),
      memoryUsed: count2(answer?.memory_used_bytes),
      diskTotal: count2(answer?.disk_total_bytes),
      diskUsed: count2(answer?.disk_used_bytes),
      diskFree: count2(answer?.disk_free_bytes),
      scope: text3(answer?.scope),
      reason: reasons.filter((r) => r !== "deadline").join(",") || null,
      ...answer && "cpu_busy_ms" in answer ? { cpuBusyUsec: usec(answer.cpu_busy_ms) } : {},
      ...answer && "cpu_total_ms" in answer ? { cpuTotalUsec: usec(answer.cpu_total_ms) } : {}
    },
    dataDisk: { path: text3(d.path), fs: text3(d.fs), scope: text3(d.scope), volume: text3(d.volume), inodesFree: count2(d.inodes_free) },
    stores: (Array.isArray(answer?.stores) ? answer.stores : []).filter((s) => s && typeof s.store === "string" && s.store).map((s) => ({ name: s.store, bytes: count2(s.size), allocated: count2(s.allocated_bytes) })),
    sandboxes: { recorded: Array.isArray(answer?.sandboxes) ? rows2.length : null, live: Array.isArray(answer?.sandboxes) ? rows2.filter((r) => r.live === true).length : null, items: rows2 },
    complete: answer?.incomplete !== true,
    reason: answer?.incomplete === true ? reasons.includes("deadline") ? "deadline" : reasons.join(",") || null : null
  };
}
function sandboxSpaceOf(row) {
  const name6 = text3(row?.sandbox);
  if (!name6) return null;
  const reason = text3(row.reason);
  return {
    name: name6,
    bytes: count2(row.allocated_bytes),
    overlays: count2(row.overlays_bytes),
    writes: count2(row.writes_bytes),
    home: count2(row.home_bytes),
    log: count2(row.log_bytes),
    runtime: count2(row.runtime_bytes),
    ...reason ? { reason } : {}
  };
}
function spaceAnswer(answer) {
  const sp = answer?.space ?? {}, d = answer?.data_disk ?? {};
  const part = (name6) => {
    const p = (Array.isArray(sp.parts) ? sp.parts : []).find((x) => x?.part === name6);
    return p ? count2(p.bytes) : null;
  };
  const reasons = Array.isArray(sp.reasons) ? sp.reasons.filter((r) => typeof r === "string") : [];
  return {
    platform: text3(answer?.platform),
    observedAt: msOf2(sp.observed_at ?? answer?.observed_at),
    disk: { total: count2(answer?.disk_total_bytes), used: count2(answer?.disk_used_bytes), free: count2(answer?.disk_free_bytes), path: text3(d.path), fs: text3(d.fs), scope: text3(d.scope) },
    layerfs: count2(sp.layerfs_bytes),
    outside: count2(sp.outside_bytes),
    parts: { stores: part("stores"), sandboxes: part("sandboxes"), images: part("images"), otherRuns: part("other_runs"), logs: part("logs"), other: part("other") },
    stores: (Array.isArray(sp.stores) ? sp.stores : []).filter((s) => s && typeof s.store === "string" && s.store).map((s) => ({ name: s.store, bytes: count2(s.allocated_bytes) })),
    sandboxes: (Array.isArray(sp.sandboxes) ? sp.sandboxes : []).map(sandboxSpaceOf).filter((x) => !!x),
    unreadable: count2(sp.unreadable_count) ?? 0,
    complete: sp.incomplete !== true,
    reason: reasons.join(",") || null
  };
}
function liveOf(item) {
  if (!item || !("live" in item)) return {};
  const live = item.live === true ? true : item.live === false ? false : null;
  const reason = text3(item.live_reason);
  return { live, ...reason ? { liveReason: reason } : {} };
}
function processOf(record) {
  const out = {};
  if (!record || !("stats" in record)) return out;
  const s = record.stats;
  if (!s || typeof s !== "object") return { daemon: null, usage: null };
  const d = s.daemon;
  out.daemon = d && typeof d === "object" ? { pid: count2(d.pid), startedAt: msOf2(d.started_at) } : null;
  out.usage = usageOf(s.usage);
  const reason = text3(s.usage_reason);
  if (reason) out.usageReason = reason;
  return out;
}

// src/host/routes/metrics.ts
var TICK_MS = 15e3;
var RING = 240;
var CLOSED_KEEP_MS = 10 * 6e4;
var SAMPLED_STATES = /* @__PURE__ */ new Set(["ready"]);
var STOPPED = "machine_stopped";
var realClock = { now: () => Date.now(), setTimeout: (run2, ms) => {
  const t = setTimeout(run2, ms);
  t.unref?.();
  return t;
}, clearTimeout: (timer) => clearTimeout(timer) };
var machineValues = (s) => {
  const r = s.resources;
  return {
    observedAt: s.observedAt,
    cpus: r.cpus,
    ..."cpuBusyUsec" in r ? { cpuBusyUsec: r.cpuBusyUsec ?? null } : {},
    ..."cpuTotalUsec" in r ? { cpuTotalUsec: r.cpuTotalUsec ?? null } : {},
    memoryUsed: r.memoryUsed,
    memoryTotal: r.memoryTotal,
    diskUsed: r.diskUsed,
    diskTotal: r.diskTotal,
    reason: r.reason
  };
};
var sandboxValues = (row, observedAt) => ({
  observedAt,
  live: row.live,
  ...row.liveReason ? { liveReason: row.liveReason } : {},
  startedAt: row.startedAt,
  usage: row.usage,
  ...row.usageReason ? { usageReason: row.usageReason } : {}
});
var push = (points, point) => {
  points.push(point);
  if (points.length > RING) points.splice(0, points.length - RING);
};
var liveReasonOf = (code2) => code2 === "Timeout" ? "not_answered" : code2 === STOPPED ? STOPPED : code2.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
var MetricsSampler = class {
  constructor(deps) {
    this.deps = deps;
    this.clock = deps.clock ?? realClock;
    this.epoch = this.clock.now();
  }
  deps;
  epoch;
  clock;
  machines = /* @__PURE__ */ new Map();
  sandboxes = /* @__PURE__ */ new Map();
  /** Sandboxes made since a read began, by name, with when: that read's rows predate them (U10 add-on 7). */
  madeAt = /* @__PURE__ */ new Map();
  listedAt = -Infinity;
  seq = 0;
  stepping = false;
  running = false;
  timer;
  controller = null;
  isOffered = false;
  /** Reads started (tests and the load count). */
  reads = 0;
  /** Begin sampling (once per host). */
  start() {
    if (this.running) return;
    this.running = true;
    this.schedule(0);
  }
  /** Stop: the read in flight is aborted; nothing more is read. */
  stop() {
    this.running = false;
    this.clock.clearTimeout(this.timer);
    this.timer = void 0;
    this.controller?.abort();
  }
  /** A machine was started, stopped, created or removed: the next turn lists the machines again (no read of its own). */
  relist() {
    this.listedAt = -Infinity;
  }
  /** Whether a read is running now (tests). */
  get reading() {
    return this.controller !== null;
  }
  schedule(ms) {
    if (!this.running) return;
    this.clock.clearTimeout(this.timer);
    this.timer = this.clock.setTimeout(() => {
      this.timer = void 0;
      void this.step();
    }, Math.max(0, ms));
  }
  /** One turn: list when due, then the machine whose turn is first (a read, a stopped gap, or a skipped turn). */
  async step() {
    if (!this.running || this.stepping) return;
    this.stepping = true;
    try {
      let now = this.clock.now();
      if (now - this.listedAt >= TICK_MS) {
        this.listedAt = now;
        this.isOffered = await this.deps.offered().catch(() => false);
        if (this.isOffered) {
          try {
            this.listed(await this.deps.list(), this.clock.now());
          } catch {
          }
        }
        now = this.clock.now();
      }
      if (!this.isOffered) return;
      this.prune(now);
      let next = null;
      for (const m of this.machines.values()) if (m.due <= now && (!next || m.due < next.due)) next = m;
      if (!next) return;
      if (next.skip) {
        next.skip = false;
        next.due = now + TICK_MS;
        return;
      }
      if (!SAMPLED_STATES.has(next.state)) {
        this.gap(next, now, STOPPED);
        next.due = now + TICK_MS;
        return;
      }
      await this.read(next);
    } finally {
      this.stepping = false;
      if (this.running) this.schedule(this.nextIn());
    }
  }
  /** Milliseconds until the next turn or list. */
  nextIn() {
    const now = this.clock.now();
    let at = this.listedAt + TICK_MS;
    if (this.isOffered) for (const m of this.machines.values()) at = Math.min(at, m.due);
    return Math.max(0, at - now);
  }
  listed(rows2, now) {
    const seen = /* @__PURE__ */ new Set();
    for (const row of rows2) {
      if (!row || typeof row.name !== "string" || !row.name) continue;
      seen.add(row.name);
      const state = typeof row.state === "string" && row.state ? row.state : "unknown";
      const known4 = this.machines.get(row.name);
      if (known4) {
        if (!SAMPLED_STATES.has(known4.state) && SAMPLED_STATES.has(state)) known4.due = Math.min(known4.due, now);
        known4.state = state;
      } else this.machines.set(row.name, { name: row.name, state, due: now, skip: false, points: [], latest: null });
    }
    for (const [name6] of this.machines) {
      if (seen.has(name6)) continue;
      this.machines.delete(name6);
      for (const b of this.sandboxes.values()) if (b.machine === name6 && b.closedAt === null) b.closedAt = now;
    }
  }
  async read(m) {
    const controller = new AbortController();
    this.controller = controller;
    this.reads++;
    const begun = this.clock.now();
    let answer, error2 = null;
    try {
      answer = await this.deps.stats(m.name, controller.signal);
    } catch (e) {
      error2 = e;
    }
    this.controller = null;
    if (!this.running) return;
    const end = this.clock.now();
    m.due = end + TICK_MS;
    if (error2) {
      const code2 = typeof error2?.code === "string" ? error2.code : "Unknown";
      const message = error2 instanceof Error ? error2.message : typeof error2?.message === "string" ? error2.message : String(error2);
      this.gap(m, end, code2, message);
      if (code2 === "Timeout") m.skip = true;
      return;
    }
    const stats = statsAnswer(answer);
    const seq = ++this.seq;
    m.latest = { at: end, stats };
    push(m.points, { seq, t: end, values: machineValues(stats) });
    const items = stats.sandboxes.items;
    if (!items) return;
    const here = /* @__PURE__ */ new Set();
    for (const row of items) {
      here.add(row.name);
      const made = this.madeAt.get(row.name);
      if (made !== void 0 && begun <= made) continue;
      this.madeAt.delete(row.name);
      let b = this.sandboxes.get(row.name);
      if (!b) this.sandboxes.set(row.name, b = { name: row.name, machine: m.name, closedAt: null, points: [] });
      b.machine = m.name;
      b.closedAt = null;
      push(b.points, { seq, t: end, values: sandboxValues(row, stats.observedAt) });
    }
    for (const b of this.sandboxes.values()) if (b.machine === m.name && b.closedAt === null && !here.has(b.name)) b.closedAt = end;
  }
  /** A gap point for the machine and each of its open Sandboxes. */
  gap(m, t, code2, message) {
    const seq = ++this.seq;
    const point = { seq, t, values: null, code: code2, ...message ? { message } : {} };
    push(m.points, point);
    for (const b of this.sandboxes.values()) if (b.machine === m.name && b.closedAt === null) push(b.points, point);
  }
  prune(now) {
    for (const [name6, b] of this.sandboxes) if (b.closedAt !== null && now - b.closedAt >= CLOSED_KEEP_MS) this.sandboxes.delete(name6);
    for (const [name6, at] of this.madeAt) if (now - at >= CLOSED_KEEP_MS) this.madeAt.delete(name6);
  }
  /**
   * `GET /api/metrics?machines=a,b&since=<seq>`: what is kept for those
   * machines (every machine when none is named) and their Sandboxes, only the
   * points newer than `since`. From memory: no LayerFS call.
   */
  view(query) {
    const names = (query.get("machines") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    const raw = Number(query.get("since") ?? 0);
    const since = Number.isSafeInteger(raw) && raw > 0 && raw <= this.seq ? raw : 0;
    const wanted = names.length ? new Set(names) : null;
    const machines = {};
    for (const m of this.machines.values()) {
      if (wanted && !wanted.has(m.name)) continue;
      machines[m.name] = { state: m.state, latest: m.latest, points: m.points.filter((p) => p.seq > since) };
    }
    const sandboxes = {};
    for (const b of this.sandboxes.values()) {
      if (wanted && !wanted.has(b.machine)) continue;
      const points = b.points.filter((p) => p.seq > since);
      if (since && !points.length && b.closedAt === null) continue;
      sandboxes[b.name] = { machine: b.machine, closedAt: b.closedAt, points };
    }
    return { epoch: this.epoch, seq: this.seq, since, now: this.clock.now(), tick: TICK_MS, ring: RING, offered: this.isOffered, machines, sandboxes };
  }
  /** The machine's last good answer and its newest point (the stats route). */
  machine(name6) {
    const m = this.machines.get(name6);
    return m ? { latest: m.latest, last: m.points.at(-1) ?? null, state: m.state } : null;
  }
  /**
   * A Sandbox was just made: what was kept for its name is of its create or an
   * earlier Sandbox, so it is dropped, and a read already under way when it was
   * made adds nothing for it. Until the next read its `live` is absent and its
   * card shows its record's state (never "Daemon not running" from before).
   */
  created(name6) {
    this.sandboxes.delete(name6);
    this.madeAt.set(name6, this.clock.now());
  }
  /**
   * Whether a Sandbox's daemon ran at its newest point, as `sandbox.list
   * --live` said it (`live`, `liveReason`); absent when the sampler has no
   * point for it (an older worker, or not read yet).
   */
  liveOf(name6) {
    const last = this.sandboxes.get(name6)?.points.at(-1);
    if (!last) return {};
    if (!last.values) return { live: null, liveReason: liveReasonOf(last.code ?? "not_observed") };
    return liveOf({ live: last.values.live, live_reason: last.values.liveReason });
  }
  /** How many Sandboxes hold a ring, and how many points in all (tests, the load note). */
  get size() {
    let points = 0;
    for (const m of this.machines.values()) points += m.points.length;
    for (const b of this.sandboxes.values()) points += b.points.length;
    return { machines: this.machines.size, sandboxes: this.sandboxes.size, points };
  }
};

// src/host/routes/image-loads.ts
import { randomBytes as randomBytes4 } from "node:crypto";

// src/host/routes/sandbox-creates.ts
import { randomBytes as randomBytes3 } from "node:crypto";
var COPY = /* @__PURE__ */ new Set(["inspect", "lock", "export", "send"]);
function bytesAfter(job, u) {
  const carry = COPY.has(u.phase) && COPY.has(job.phase);
  const total = typeof u.total === "number" ? u.total : carry ? job.total : void 0;
  let done = typeof u.done === "number" ? u.done : carry ? job.done : void 0;
  if (carry && done !== void 0 && job.done !== void 0 && total === job.total && done < job.done) done = job.done;
  return { ...done !== void 0 ? { done } : {}, ...total !== void 0 ? { total } : {} };
}
var FAILED_KEEP_MS = 10 * 6e4;
var BYTES_EVERY_MS = 500;
var newId = () => `c-${Date.now().toString(36)}-${randomBytes3(2).toString("hex")}`;
var SandboxCreates = class {
  /**
   * @param emit - publishes a host event (`sandbox-progress`).
   * @param settled - after a job ends, done or failed (the machines view reads anew).
   */
  constructor(emit, settled2 = () => {
  }) {
    this.emit = emit;
    this.settled = settled2;
  }
  emit;
  settled;
  jobs = /* @__PURE__ */ new Map();
  /** Per job: a byte update held back, and when the last event went out. */
  pending = /* @__PURE__ */ new Map();
  /**
   * Admits a job and starts `run` in the background; answers the `queued`
   * entry. A failed job for the same project and name leaves the list.
   */
  admit(input, run2) {
    this.forgetFailed(input.project, input.name);
    const now = Date.now();
    const job = { id: newId(), input: { ...input }, phase: "queued", startedAt: now, updatedAt: now };
    this.jobs.set(job.id, job);
    this.send(job);
    const admitted = { ...job, input: { ...job.input } };
    const report = (u) => this.update(job.id, u);
    void (async () => {
      try {
        await Promise.resolve();
        await run2(report);
        this.finish(job.id, "done");
      } catch (error2) {
        const detail = error2?.detail && typeof error2.detail === "object" ? error2.detail : void 0;
        this.finish(job.id, "failed", { code: typeof error2?.code === "string" ? error2.code : "Unknown", message: error2?.message ?? String(error2), ...detail ? { detail } : {}, ...fixOf(error2) });
      }
    })();
    return admitted;
  }
  /** Running jobs and failed ones younger than {@link FAILED_KEEP_MS}. */
  list() {
    this.expire();
    return { creations: [...this.jobs.values()].map((j) => ({ ...j, input: { ...j.input } })) };
  }
  /** Dismisses a failed job; a running one is refused (closing cancels nothing). */
  dismiss(id) {
    const job = this.jobs.get(id);
    if (!job) throw refuse(404, "NotFound", `no Sandbox creation ${id}`);
    if (job.phase !== "failed") throw refuse(409, "Busy", `Sandbox ${job.input.name} is still being created`);
    this.jobs.delete(id);
    return this.list();
  }
  /** A create of `project`/`name` succeeded anywhere (also without `background`): its failed jobs go. */
  created(project, name6) {
    this.forgetFailed(project, name6);
  }
  forgetFailed(project, name6) {
    for (const [id, j] of this.jobs) if (j.phase === "failed" && j.input.project === project && j.input.name === name6) this.jobs.delete(id);
  }
  expire() {
    const now = Date.now();
    for (const [id, j] of this.jobs) if (j.phase === "failed" && now - j.updatedAt >= FAILED_KEEP_MS) this.jobs.delete(id);
  }
  /** A phase change goes out at once; bytes within the same phase at most every {@link BYTES_EVERY_MS}. */
  update(id, u) {
    const job = this.jobs.get(id);
    if (!job || job.phase === "done" || job.phase === "failed") return;
    const bytes = bytesAfter(job, u);
    const changed = u.phase !== job.phase && !(COPY.has(u.phase) && COPY.has(job.phase) && job.total !== void 0);
    job.phase = u.phase;
    if (bytes.done !== void 0) job.done = bytes.done;
    else delete job.done;
    if (bytes.total !== void 0) job.total = bytes.total;
    else delete job.total;
    job.updatedAt = Date.now();
    if (changed) {
      this.send(job);
      return;
    }
    const p = this.pending.get(id) ?? { timer: null, last: 0 };
    this.pending.set(id, p);
    if (p.timer) return;
    const wait = BYTES_EVERY_MS - (Date.now() - p.last);
    if (wait <= 0) {
      this.send(job);
      return;
    }
    p.timer = setTimeout(() => {
      p.timer = null;
      const now = this.jobs.get(id);
      if (now && now.phase !== "done" && now.phase !== "failed") this.send(now);
    }, wait);
  }
  finish(id, phase, error2) {
    const job = this.jobs.get(id);
    if (!job) return;
    job.phase = phase;
    delete job.done;
    delete job.total;
    if (error2) job.error = error2;
    job.updatedAt = Date.now();
    this.send(job);
    const p = this.pending.get(id);
    if (p?.timer) clearTimeout(p.timer);
    this.pending.delete(id);
    if (phase === "done") {
      this.jobs.delete(id);
      this.forgetFailed(job.input.project, job.input.name);
    }
    try {
      this.settled();
    } catch {
    }
  }
  send(job) {
    const p = this.pending.get(job.id);
    if (p) {
      if (p.timer) {
        clearTimeout(p.timer);
        p.timer = null;
      }
      p.last = Date.now();
    } else this.pending.set(job.id, { timer: null, last: Date.now() });
    this.emit("sandbox-progress", { type: "sandbox-progress", creation: { ...job, input: { ...job.input } } });
  }
};

// src/host/routes/image-loads.ts
var newId2 = () => `l-${Date.now().toString(36)}-${randomBytes4(2).toString("hex")}`;
var copyOf = (j) => ({ ...j, ...j.error ? { error: { ...j.error } } : {} });
var ImageLoads = class {
  /**
   * @param emit - publishes a host event (`image-load`).
   * @param settled - after a copy ends, done or failed.
   */
  constructor(emit, settled2 = () => {
  }) {
    this.emit = emit;
    this.settled = settled2;
  }
  emit;
  settled;
  jobs = /* @__PURE__ */ new Map();
  last = /* @__PURE__ */ new Map();
  /** A copy of `image` to `machine` already running, if any (the route answers it instead of starting another). */
  running(machine, image) {
    for (const j of this.jobs.values()) if (j.machine === machine && j.image === image && j.phase !== "failed") return copyOf(j);
    return void 0;
  }
  /** Admits a copy and starts `run` in the background; answers the `queued` entry. A failed copy of the same image to the same machine leaves the list. */
  admit(machine, image, run2) {
    for (const [id, j] of this.jobs) if (j.phase === "failed" && j.machine === machine && j.image === image) this.jobs.delete(id);
    const now = Date.now();
    const job = { id: newId2(), machine, image, phase: "queued", startedAt: now, updatedAt: now };
    this.jobs.set(job.id, job);
    this.send(job);
    const admitted = copyOf(job);
    void (async () => {
      try {
        await Promise.resolve();
        const answer = await run2((u) => this.update(job.id, u));
        const dropped = typeof answer?.dropped_count === "number" ? answer.dropped_count : Array.isArray(answer?.dropped) ? answer.dropped.length : 0;
        this.finish(job.id, { reused: answer?.reused === true, dropped });
      } catch (error2) {
        const detail = error2?.detail && typeof error2.detail === "object" ? error2.detail : void 0;
        this.finish(job.id, { error: { code: typeof error2?.code === "string" ? error2.code : "Unknown", message: error2?.message ?? String(error2), ...detail ? { detail } : {}, ...fixOf(error2) } });
      }
    })();
    return admitted;
  }
  /** Running copies and failed ones younger than {@link FAILED_KEEP_MS}. */
  list() {
    const now = Date.now();
    for (const [id, j] of this.jobs) if (j.phase === "failed" && now - j.updatedAt >= FAILED_KEEP_MS) this.jobs.delete(id);
    return { loads: [...this.jobs.values()].map(copyOf) };
  }
  /** Dismisses a failed copy; a running one is refused (it cannot be cancelled). */
  dismiss(id) {
    const job = this.jobs.get(id);
    if (!job) throw refuse(404, "NotFound", `no image copy ${id}`);
    if (job.phase !== "failed") throw refuse(409, "Busy", `the image is still being copied to ${job.machine}`);
    this.jobs.delete(id);
    return this.list();
  }
  /** A phase change goes out at once; bytes within the copy at most every {@link BYTES_EVERY_MS}. */
  update(id, u) {
    const job = this.jobs.get(id);
    if (!job || job.phase === "done" || job.phase === "failed") return;
    const bytes = bytesAfter(job, u);
    const changed = u.phase !== job.phase && !(job.total !== void 0 && u.phase !== "unpack" && job.phase !== "unpack");
    job.phase = u.phase;
    if (bytes.done !== void 0) job.done = bytes.done;
    else delete job.done;
    if (bytes.total !== void 0) job.total = bytes.total;
    else delete job.total;
    job.updatedAt = Date.now();
    if (changed) {
      this.send(job);
      return;
    }
    const p = this.last.get(id) ?? { timer: null, at: 0 };
    this.last.set(id, p);
    if (p.timer) return;
    const wait = BYTES_EVERY_MS - (Date.now() - p.at);
    if (wait <= 0) {
      this.send(job);
      return;
    }
    p.timer = setTimeout(() => {
      p.timer = null;
      const now = this.jobs.get(id);
      if (now && now.phase !== "done" && now.phase !== "failed") this.send(now);
    }, wait);
  }
  finish(id, end) {
    const job = this.jobs.get(id);
    if (!job) return;
    job.phase = end.error ? "failed" : "done";
    delete job.done;
    delete job.total;
    if (end.error) job.error = end.error;
    if (end.reused) job.reused = true;
    if (end.dropped) job.dropped = end.dropped;
    job.updatedAt = Date.now();
    this.send(job);
    const p = this.last.get(id);
    if (p?.timer) clearTimeout(p.timer);
    this.last.delete(id);
    if (job.phase === "done") this.jobs.delete(id);
    try {
      this.settled(job.machine);
    } catch {
    }
  }
  send(job) {
    const p = this.last.get(job.id);
    if (p) {
      if (p.timer) {
        clearTimeout(p.timer);
        p.timer = null;
      }
      p.at = Date.now();
    } else this.last.set(job.id, { timer: null, at: Date.now() });
    this.emit("image-load", { type: "image-load", load: copyOf(job) });
  }
};

// src/host/routes/projects.ts
import { randomUUID as randomUUID9 } from "node:crypto";
import { mkdirSync as mkdirSync14, mkdtempSync, realpathSync as realpathSync5, rmSync as rmSync6, statSync as statSync7 } from "node:fs";
import { isAbsolute as isAbsolute4, join as join18, relative as relative2, sep } from "node:path";

// src/host/routes/storage-observations.ts
import { createHash as createHash11, randomUUID as randomUUID8 } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join as join16, resolve as resolve5 } from "node:path";
var OBSERVATION_GAP_MS = 30 * 60 * 1e3;
var MAX_POINTS = 1e3;
var MAX_SERIES = 8;
var RETAIN_MS = 90 * 864e5;
var digest = (value) => createHash11("sha256").update(value).digest("hex");
var fields = ["engine", "size", "logical_bytes", "canonical_bytes", "stored_bytes", "metadata_bytes", "file_bytes", "reusable_bytes", "dedupe", "compression"];
var StorageObservations = class {
  constructor(root, home, now = Date.now) {
    this.now = now;
    this.directory = join16(root, "storage-observations");
    this.home = resolve5(home ?? root);
  }
  now;
  directory;
  home;
  pending = /* @__PURE__ */ new Map();
  path(store) {
    return join16(this.directory, `${digest(`${this.home}\0${store}`)}.json`);
  }
  async read(store) {
    try {
      const value = JSON.parse(await readFile(this.path(store), "utf8"));
      if (value.version !== 1 || value.store !== store || !Array.isArray(value.series)) throw new Error("Invalid Store observation journal");
      return value;
    } catch (error2) {
      if (error2.code !== "ENOENT") throw error2;
      return { version: 1, scope: "store", store, gapAfterMs: OBSERVATION_GAP_MS, retentionDays: 90, maxPoints: MAX_POINTS, series: [] };
    }
  }
  record(store, stats, record) {
    const next = (this.pending.get(store) ?? Promise.resolve()).catch(() => {
    }).then(() => this.append(store, stats, record));
    this.pending.set(store, next);
    return next.finally(() => {
      if (this.pending.get(store) === next) this.pending.delete(store);
    });
  }
  async append(store, stats, record) {
    if (typeof stats.store_id !== "string" || !stats.store_id) throw new Error("This LayerFS build does not expose Store identity; disk observations are unavailable");
    const generation = stats.store_generation;
    if (generation == null) throw new Error("This LayerFS build does not expose Store generation; disk observations are unavailable");
    const identity2 = digest(stringify([this.home, store, stats.store_id, generation, stats.engine, record?.machine ?? null]));
    const now = this.now(), journal = await this.read(store);
    journal.series = journal.series.map((series2) => ({ ...series2, points: series2.points.filter((p) => p.observedAt >= now - RETAIN_MS) })).filter((series2) => series2.points.length);
    let series = journal.series.at(-1);
    if (!series || series.identity !== identity2 || now < series.points.at(-1).observedAt) {
      series = { identity: identity2, startedAt: now, points: [] };
      journal.series.push(series);
    }
    const snapshot = Object.fromEntries(fields.filter((field) => Object.hasOwn(stats, field)).map((field) => [field, stats[field]]));
    series.points.push({ observedAt: now, stats: snapshot });
    let count4 = journal.series.reduce((sum, item) => sum + item.points.length, 0);
    while (count4 > MAX_POINTS) {
      journal.series[0].points.shift();
      count4--;
      if (!journal.series[0].points.length) journal.series.shift();
    }
    journal.series = journal.series.slice(-MAX_SERIES);
    await mkdir(this.directory, { recursive: true, mode: 448 });
    const file = this.path(store), temporary = `${file}.${randomUUID8()}.tmp`;
    await writeFile(temporary, `${stringify(journal)}
`, { mode: 384 });
    await rename(temporary, file);
  }
};

// src/host/routes/project-storage.ts
import { createHash as createHash12 } from "node:crypto";
import { mkdir as mkdir2, readFile as readFile2, rename as rename2, writeFile as writeFile2 } from "node:fs/promises";
import { join as join17, resolve as resolve6 } from "node:path";
var PAGE_SIZE2 = 100;
var SAVE_MS = 5e3;
var RECENT = 30;
var GROWTH_POINTS = 40;
var FRESH_MS = 15e3;
var MESSAGE = 120;
var digest2 = (value) => createHash12("sha256").update(value).digest("hex");
var num2 = (value) => typeof value === "number" && Number.isFinite(value) ? value : 0;
var isCommit = (c) => !c?.source_branch;
var ProjectStorageLedgers = class {
  /** CLI clients that refused `include_storage` (builds older than it); a runtime switch makes a new client. */
  constructor(root, home, lfs, log = () => {
  }, now = Date.now) {
    this.lfs = lfs;
    this.log = log;
    this.now = now;
    this.directory = join17(root, "project-storage");
    this.home = resolve6(home ?? root);
  }
  lfs;
  log;
  now;
  directory;
  home;
  jobs = /* @__PURE__ */ new Map();
  errors = /* @__PURE__ */ new Map();
  finished = /* @__PURE__ */ new Map();
  /** A project record's ledger file: a recreated project (another `created`) starts a new one. */
  path(project, created) {
    return join17(this.directory, `${digest2(`${this.home}\0${project}\0${created ?? ""}`)}.json`);
  }
  async read(project, created) {
    try {
      const value = JSON.parse(await readFile2(this.path(project, created), "utf8"));
      if (value.version === 1 && value.project === project && value.created === created && value.commits && value.heads && value.publications) return value;
    } catch (error2) {
      if (error2.code !== "ENOENT") this.log(`[host] project storage ledger of ${project}: ${error2?.message ?? error2}`);
    }
    return { version: 1, project, created, commits: {}, heads: {}, publications: { count: 0, logical: 0, head: null }, updatedAt: null };
  }
  async write(ledger) {
    await mkdir2(this.directory, { recursive: true });
    const file = this.path(ledger.project, ledger.created), temp = `${file}.${process.pid}.tmp`;
    await writeFile2(temp, JSON.stringify(ledger));
    await rename2(temp, file);
  }
  /** Starts a refresh unless one runs or one finished a moment ago; returns the running one. */
  refresh(project, created, force = false) {
    const key = this.path(project, created);
    const running = this.jobs.get(key);
    if (running) return running;
    if (!force && this.now() - (this.finished.get(key) ?? 0) < FRESH_MS) return null;
    const job = { promise: Promise.resolve(), progress: { branches: 0, branchesTotal: 0, saves: 0 }, ledger: null };
    job.promise = this.build(project, created, job).then(() => {
      this.errors.delete(key);
    }, (error2) => {
      this.errors.set(key, { code: error2?.code ?? "Failed", message: error2?.message ?? String(error2), detail: error2?.detail ?? null, ...fixOf(error2) });
      this.log(`[host] project storage of ${project}: ${error2?.message ?? error2}`);
    }).finally(() => {
      this.jobs.delete(key);
      this.finished.set(key, this.now());
    });
    this.jobs.set(key, job);
    return job;
  }
  /** Waits for the running refresh, if any (tests and shutdown). */
  async settle(project, created) {
    await this.jobs.get(this.path(project, created))?.promise;
  }
  async close() {
    await Promise.all([...this.jobs.values()].map((job) => job.promise));
  }
  /**
   * Walks `branch` from `head` newest first (2.0 `commit list --at <head>
   * --detail`, by cursor: the cursor pins the Commit the first page read),
   * handing each page's rows to `take` until `known` matches. The long rows
   * always carry their byte counts.
   */
  async walk(project, branch, head, known4, take) {
    let cursor = null;
    for (; ; ) {
      const listed = await this.lfs().commit.list(project, branch, { at: head, limit: PAGE_SIZE2, ...cursor ? { cursor } : {}, detail: true });
      const rows2 = [];
      let reached = false;
      for (const c of listed?.items ?? []) {
        const id = String(c.commit);
        if (known4(id)) {
          reached = true;
          break;
        }
        rows2.push({ ...c, id });
      }
      await take(rows2);
      const next = listed?.next_cursor ?? null;
      if (reached || !next || next === cursor) return;
      cursor = next;
    }
  }
  /** A ledger row from a listed 2.0 Commit (`created_at`, `size`, `new_*_bytes`). */
  row(branch, c) {
    const at = typeof c.created_at === "string" ? Date.parse(c.created_at) : NaN;
    return [Number.isFinite(at) ? at : null, c.via ?? null, num2(c.size), num2(c.new_canonical_bytes), num2(c.new_stored_bytes), num2(c.new_metadata_bytes), branch, String(c.message ?? "").slice(0, MESSAGE)];
  }
  async build(project, created, job) {
    const lfs = this.lfs(), progress = job.progress;
    const ledger = job.ledger = await this.read(project, created);
    const branches = await pages((p) => lfs.branch.list(project, { ...p, detail: true }));
    const side = branches.filter((b) => b.branch !== "main" && b.commit && b.commit !== b.forked_from);
    progress.branchesTotal = side.length;
    let dirty = false, lastWrite = this.now();
    const save4 = async () => {
      if (dirty && this.now() - lastWrite > SAVE_MS) {
        await this.write(ledger);
        dirty = false;
        lastWrite = this.now();
      }
    };
    for (const b of side) {
      const head = b.commit;
      if (ledger.heads[b.branch] !== head) {
        await this.walk(project, b.branch, head, (id) => id in ledger.commits, async (rows2) => {
          for (const c of rows2.filter(isCommit)) {
            ledger.commits[c.id] = this.row(b.branch, c);
            progress.saves++;
          }
          dirty = true;
          await save4();
        });
        ledger.heads[b.branch] = head;
        dirty = true;
      }
      progress.branches++;
      await save4();
    }
    const main = branches.find((b) => b.branch === "main");
    const mainHead = main?.commit ?? null;
    if (mainHead && mainHead !== ledger.publications.head) {
      const layers = [];
      await this.walk(project, "main", mainHead, (id) => id === ledger.publications.head, async (rows2) => {
        layers.push(...rows2);
      });
      ledger.publications = {
        count: ledger.publications.count + layers.length,
        logical: ledger.publications.logical + layers.reduce((sum, c) => sum + num2(c.size), 0),
        head: mainHead
      };
      dirty = true;
    }
    ledger.updatedAt = this.now();
    await this.write(ledger);
  }
  /**
   * ProjectStorage: the ledger's totals (null while nothing is counted;
   * `partial` until a first read finishes), the newest saves, the growth of
   * packed bytes, and the running refresh. While a refresh runs the view reads
   * the ledger it fills, so the totals grow as the saves are counted.
   */
  async view(project, created, options = {}) {
    const job = this.refresh(project, created, options.refresh === true);
    const key = this.path(project, created);
    const ledger = job?.ledger ?? await this.read(project, created);
    const rows2 = Object.entries(ledger.commits).sort((a, b) => (a[1][0] ?? 0) - (b[1][0] ?? 0));
    const totals = ledger.updatedAt === null && !rows2.length ? null : {
      saves: rows2.length,
      merges: rows2.filter(([, r]) => r[1] === "merge").length,
      branches: Object.keys(ledger.heads).length,
      publications: ledger.publications.count,
      commitLogical: rows2.reduce((sum, [, r]) => sum + r[2], 0),
      publicationLogical: ledger.publications.logical,
      canonical: rows2.reduce((sum, [, r]) => sum + r[3], 0),
      stored: rows2.reduce((sum, [, r]) => sum + r[4], 0),
      metadata: rows2.reduce((sum, [, r]) => sum + r[5], 0)
    };
    const growth = [];
    if (rows2.length) {
      let sum = 0, at = 0;
      for (let i = 0; i < GROWTH_POINTS; i++) {
        const end = Math.ceil((i + 1) * rows2.length / GROWTH_POINTS);
        for (; at < end; at++) sum += rows2[at][1][4];
        growth.push(sum);
      }
    }
    return {
      project,
      totals,
      growth,
      recent: rows2.slice(-RECENT).map(([id, r]) => ({ id, time: r[0], via: r[1], logical: r[2], stored: r[4], branch: r[6], message: r[7] })),
      updatedAt: ledger.updatedAt,
      partial: ledger.updatedAt === null,
      building: job ? { ...job.progress } : null,
      error: job ? null : this.errors.get(key) ?? null
    };
  }
};

// src/host/placement.ts
var placeable = (m) => runsPostgresql(m) && (m.state ?? "ready") === "ready";
function reachedFrom(store) {
  const rows2 = Array.isArray(store?.connections) ? store.connections : [];
  return rows2.filter((r) => r?.reached === "ok").map((r) => typeof r.machine === "string" && r.machine ? r.machine : "native");
}
function lastUsed(sandboxes) {
  const at = (s) => {
    const t = Date.parse(String(s?.created_at ?? ""));
    return Number.isFinite(t) ? t : 0;
  };
  const newest = [...sandboxes].filter((s) => typeof s?.machine === "string" && s.machine).sort((a, b) => at(b) - at(a))[0];
  return newest ? String(newest.machine) : null;
}
function pgPlacement(machines, { last, reached } = {}) {
  const ok = (name6) => !!name6 && machines.some((m) => m.name === name6 && placeable(m));
  if (ok(last)) return last;
  return (reached ?? []).find(ok) ?? "native";
}

// src/host/routes/projects.ts
var WIDTH = 4;
var KEEP_CHANGES = 5e3;
var LIMIT = 200;
var KEEP_INITS = 50;
var HISTORY_PAGE_SIZE = 20;
var HISTORY_PAGES_KEPT = 512;
var HISTORY_WIDE_PAGE = 100;
var HISTORY_COUNTS_KEPT = 2048;
var MADE_ON_KEPT = 2e4;
var isLayer = (id) => typeof id === "string" && id.startsWith("32");
var DIGEST = /^sha256:[a-f0-9]{64}$/;
var CREATE_PHASES = /* @__PURE__ */ new Set(["inspect", "lock", "export", "send", "unpack", "start", "mount"]);
var byteCount = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : void 0;
function createPhase(progress) {
  if (!progress || typeof progress !== "object") return null;
  const p = progress;
  if (typeof p.phase !== "string" || !CREATE_PHASES.has(p.phase)) return null;
  const done = byteCount(p.done), total = byteCount(p.total);
  return { phase: p.phase, ...done !== void 0 ? { done } : {}, ...total !== void 0 ? { total } : {} };
}
function checkBranch(branch) {
  if (typeof branch !== "string" || !branch || branch.includes("\0")) throw refuse(400, "InvalidInput", "branch must be a Branch name, main or a saved id");
}
async function each(items, width, fn) {
  let next = 0;
  const lane = async () => {
    while (next < items.length) {
      const index = next++;
      await fn(items[index], index);
    }
  };
  await Promise.all(Array.from({ length: Math.min(width, items.length) }, lane));
}
function keep(map, key, value, most) {
  map.delete(key);
  map.set(key, value);
  while (map.size > most) map.delete(map.keys().next().value);
}
var savedRef = (id, branch) => id ? { id, kind: isLayer(id) ? "Layer" : "Commit", branch: branch ?? null } : null;
var commitInfo = (c, branch) => {
  const id = c.commit ?? c.id;
  const at = msAt(c.created_at);
  return {
    id,
    branch: c.branch ?? branch ?? "",
    message: c.message ?? "",
    at,
    parent: c.parent ?? null,
    merged: c.second_parent ?? null,
    kind: c.via ?? null,
    base: c.base ?? null,
    sourceCommit: c.source_commit ?? null,
    sourceBranch: c.source_branch ?? null,
    sourceTime: null,
    logical: c.size ?? null,
    savedKind: c.source_branch || isLayer(id) ? "layer" : "commit",
    ref: savedRef(id, c.branch ?? branch),
    parentRef: savedRef(c.parent ?? c.base, c.branch ?? branch),
    sourceRef: savedRef(c.source_commit, c.source_branch),
    timeStatus: at !== null ? "recorded" : "unavailable",
    newCanonical: c.new_canonical_bytes ?? null,
    newStored: c.new_stored_bytes ?? null,
    newMetadata: c.new_metadata_bytes ?? null
  };
};
var changeKind = (change) => {
  const c = String(change ?? "");
  return c ? c[0].toUpperCase() + c.slice(1) : "Modified";
};
var refusalOf3 = (error2) => ({ code: error2?.code ?? "Failed", message: error2?.message ?? String(error2), detail: error2?.detail ?? null, ...fixOf(error2) });
var STORE_REFUSALS = /* @__PURE__ */ new Set(["Busy", "Unresolved", "Unavailable"]);
function sandboxInfo(s, workspaces = null) {
  const name6 = String(s.sandbox ?? s.name);
  const stats = s.stats && typeof s.stats === "object" ? s.stats : null;
  const perWorkspace = new Map((Array.isArray(stats?.workspaces) ? stats.workspaces : []).map((w) => [String(w?.workspace), w]));
  return {
    id: name6,
    name: name6,
    state: typeof s.state === "string" ? s.state : "ready",
    op: opOf(s.op),
    ...companionsOf(s),
    backend: s.backend ?? null,
    route: s.route ?? null,
    project: s.project ?? null,
    image: s.image ?? null,
    machine: s.machine ?? null,
    created: msAt(s.created_at),
    // the daemon's control admission and retained failures (`--with stats`, best effort)
    daemonCapacity: stats?.daemon_capacity ?? null,
    ...s.platform ? { platform: s.platform } : {},
    workspaces: (workspaces ?? []).filter((w) => typeof w?.workspace === "string").map((w) => {
      const handle2 = String(w.workspace);
      return {
        ws: handle2,
        name: handle2.slice(handle2.indexOf(":") + 1),
        branch: w.branch ?? "",
        path: w.path ?? null,
        state: typeof w.state === "string" ? w.state : "ready",
        op: opOf(w.op),
        ...companionsOf(w),
        base: w.commit ?? null,
        baseLayer: w.base_layer ?? null,
        headMovedSinceMount: w.branch_moved ?? null,
        pendingMerge: w.pending_merge ?? null,
        mountedAt: msAt(w.mounted_at),
        ...runningOf(w),
        ...overlayBytesOf(perWorkspace.get(handle2), !!stats),
        ...workspaceUsageOf(perWorkspace.get(handle2), !!stats)
      };
    }),
    // the daemon process and the Sandbox's cgroup usage (`--with stats`): absent when not asked, null when not observed
    ...processOf(s),
    ...Number.isSafeInteger(s.workspace_capacity) && s.workspace_capacity > 0 ? { workspaceCapacity: s.workspace_capacity } : {},
    ...workspaces ? {} : { unread: true }
  };
}
function runningOf(w) {
  if (!w || !("commands" in w || "running" in w)) return {};
  const source = Array.isArray(w.commands) ? w.commands : Array.isArray(w.running) ? w.running.map((exec) => ({ exec })) : null;
  if (!source) return { running: [] };
  const running = [];
  for (const r of source) {
    if (!r || typeof r.exec !== "string" || !r.exec) continue;
    running.push({
      execId: r.exec,
      started: msAt(r.started_at) ?? 0,
      tag: typeof r.tag === "string" && r.tag ? r.tag : null,
      program: typeof r.program === "string" && r.program ? r.program : null
    });
  }
  return { running: running.sort((a, b) => a.started - b.started) };
}
function overlayBytesOf(w, read2) {
  if (!read2) return {};
  return { overlayBytes: typeof w?.overlay_bytes === "number" && Number.isFinite(w.overlay_bytes) && w.overlay_bytes >= 0 ? w.overlay_bytes : null };
}
function workspaceUsageOf(w, read2) {
  if (!read2) return {};
  if (!w) return { usage: null };
  const reason = typeof w.usage_reason === "string" && w.usage_reason ? w.usage_reason : null;
  return { usage: usageOf(w.usage), ...reason ? { usageReason: reason } : {} };
}
function branchInfos(listed, byId = null) {
  const merges = byId ? [...byId.values()].filter((c) => c.via === "merge") : [];
  return listed.map((b) => {
    const name6 = String(b.branch ?? b.name);
    if (name6 === "main") return { name: "main", head: b.commit ?? null, parent: null, forkedFrom: null, state: "open", commits: 0 };
    const head = b.commit && b.commit !== b.forked_from ? b.commit : null;
    const parent = b.forked_from ? isLayer(b.forked_from) ? "main" : byId?.get(b.forked_from)?.branch ?? null : null;
    let commits = byId ? 0 : null;
    if (byId) {
      for (const c of byId.values()) if (c.branch === name6) commits++;
    }
    const merged = !!head && merges.some((c) => c.branch !== name6 && (c.parent === head || c.second_parent === head || c.merged_from === head));
    return { name: name6, head: b.commit ?? null, parent, forkedFrom: b.forked_from ?? null, state: merged ? "merged" : "open", commits };
  });
}
var fail5 = (message) => refuse(400, "InvalidInput", message);
var integer = (q2, k, fallback, max = 2e3) => {
  const n = Number(q2.get(k) ?? fallback);
  if (!Number.isSafeInteger(n) || n < 1 || n > max) throw fail5(`${k} must be an integer from 1 to ${max}`);
  return n;
};
var pinOf = (b) => b.commit;
var validate = (branch, path2) => {
  if (typeof branch !== "string" || !branch || branch.includes("\0")) throw fail5("Name a Branch.");
  if (typeof path2 !== "string" || !path2.startsWith("/") || path2.includes("\0") || path2.split("/").includes("..")) throw fail5("Use an absolute path.");
};
var Projects = class {
  constructor(host) {
    this.host = host;
    this.emptySources = join18(host.root, "project-sources");
    this.sandboxCreates = new SandboxCreates((type, data) => host.emit(type, data));
    this.storageObservations = new StorageObservations(host.stats, host.home);
    this.storageLedgers = new ProjectStorageLedgers(host.stats, host.home, () => host.lfs(), (line) => host.log(line));
  }
  host;
  /** Commit id -> its changed paths, or null when LayerFS cannot compare it. */
  changes = /* @__PURE__ */ new Map();
  /**
   * History pages read at a named Commit (`at`/`head`), newest last: a Branch's
   * Commits before a given Commit never change, so reopening History rereads
   * only the Branches that moved.
   */
  historyPages = /* @__PURE__ */ new Map();
  /**
   * Each Branch's Commit count at its last counted head: a head that moved is
   * counted only back to that head, so a live Branch costs one read per refresh.
   */
  historyCounts = /* @__PURE__ */ new Map();
  counting = /* @__PURE__ */ new Map();
  /**
   * `<project> <commit>` -> the Branch the Commit was made on (`commit get`
   * answers it; file history and blame do not). A Commit never moves, so the
   * answer is kept, the oldest dropped past {@link MADE_ON_KEPT}.
   */
  madeOn = /* @__PURE__ */ new Map();
  /** Init job id -> ProjectInitJob: the Inits this host started (2.0 keeps no job registry). */
  inits = /* @__PURE__ */ new Map();
  creations = /* @__PURE__ */ new Map();
  emptySources;
  storageObservations;
  storageLedgers;
  /** Sandbox creations run in the background (`background: true`), with their progress events. */
  sandboxCreates;
  /** Store name -> { state, op }: set by the host (Storage.projectJoin). */
  storeJoin = null;
  get lfs() {
    return this.host.lfs();
  }
  log(line) {
    this.host.log(line);
  }
  /**
   * The Branch each of `ids` was made on: those in `own` are `branch`'s own;
   * the rest are asked once each (`commit get`, at most 4 at a time) and kept.
   * A Commit LayerFS cannot read answers null (the view names no Branch).
   */
  async branchesOf(project, ids, branch, own = /* @__PURE__ */ new Set()) {
    const out = /* @__PURE__ */ new Map();
    const ask = [];
    for (const id of new Set(ids)) {
      if (own.has(id)) out.set(id, branch);
      else if (this.madeOn.has(`${project} ${id}`)) out.set(id, this.madeOn.get(`${project} ${id}`));
      else ask.push(id);
    }
    for (let i = 0; i < ask.length; i += 4) {
      await Promise.all(ask.slice(i, i + 4).map(async (id) => {
        let made = null;
        try {
          const c = await this.lfs.commit.get(project, id);
          made = typeof c?.branch === "string" && c.branch ? c.branch : null;
        } catch {
          out.set(id, null);
          return;
        }
        out.set(id, made);
        this.madeOn.set(`${project} ${id}`, made);
        if (this.madeOn.size > MADE_ON_KEPT) this.madeOn.delete(this.madeOn.keys().next().value);
      }));
    }
    return out;
  }
  async saved(project, branch, pin) {
    if (pin) {
      if (!/^[0-9a-f]{66}$/.test(pin)) throw fail5("A saved pin must be a full 66-hex id.");
      return pin;
    }
    return pinOf(await this.lfs.branch.get(project, branch));
  }
  // ---------- status ----------
  /**
   * HostStatus: the linked LayerFS, the home and what it holds, plus the
   * runtime facts (`runtime`, from `ctx.layerfs.status()`).
   */
  async status(runtime) {
    const platform2 = process.platform === "darwin" ? "macos" : process.platform === "win32" ? "windows" : "linux";
    const base = {
      platform: platform2,
      mode: "real",
      layerfs: runtime?.version ?? null,
      settings: { state: this.host.root, home: this.host.home, cli: this.host.cli() },
      runtime
    };
    const [machines, stores2] = await Promise.all([machineRows(this.lfs), this.lfs.store.list()]);
    return {
      ...base,
      daemon: await this.daemonStatus(),
      machines: machines.map((m) => ({ name: m.name, platform: m.platform, state: m.state })),
      stores: (stores2.items ?? []).length
    };
  }
  /** macOS: whether the native machine has its daemon recorded (null elsewhere). */
  async daemonStatus() {
    if (process.platform !== "darwin") return null;
    try {
      const recorded = (await this.lfs.machine.get("native", { detail: true }))?.daemon ?? null;
      return recorded ? { recorded: true, why: null } : { recorded: false, why: this.host.daemon() ? "the native daemon was not recorded" : "no configured CLI or daemon" };
    } catch (error2) {
      return { recorded: false, why: `the native daemon was not recorded: ${error2?.message ?? error2}` };
    }
  }
  // ---------- projects ----------
  /** ProjectSummary of a project.list/get record. `join` (Store name -> { state, op }) adds the Store's state. */
  summary(p, join30 = null) {
    const key = keyOf(p);
    return {
      name: key.slice(key.indexOf("/") + 1),
      key,
      store: p.store ?? key.split("/")[0],
      kind: p.engine ?? null,
      machine: p.machine ?? null,
      created: msAt(p.created_at),
      // the project's own 2.0 state (busy init/delete, broken unresolved), when not ready
      ...typeof p.state === "string" && p.state !== "ready" ? { state: p.state, op: opOf(p.op), ...companionsOf(p) } : {},
      demo: null,
      run: null,
      ...join30 ? { storeState: join30.get(p.store)?.state ?? null, storeOp: join30.get(p.store)?.op ?? null } : {}
    };
  }
  /**
   * Starts an Init of `<store>/<name>` from a folder or an empty source, into
   * the existing Store `store` (2.0 never makes a Store at Init). Answers the
   * job; Init goes on while the window that asked stops polling.
   */
  async create(input) {
    const { name: name6, source, store } = input ?? {};
    if (typeof store !== "string" || !store) throw refuse(400, "InvalidInput", "Choose the Store the project goes into.");
    if (typeof name6 !== "string" || !/^[a-z0-9](?:[a-z0-9_.-]{0,61}[a-z0-9])?$/.test(name6)) throw refuse(400, "InvalidInput", "Project names use lowercase letters, numbers, dots, underscores and hyphens, with a letter or number at each end (maximum 63 characters).");
    const { key } = projectRef(`${store}/${name6}`);
    if ([...this.inits.values()].some((j) => j.name === key && !j.ended)) throw refuse(409, "Exists", `${key} is being created`);
    if (source !== void 0) this.checkSource({ source });
    let emptySource;
    if (source === void 0) {
      mkdirSync14(this.emptySources, { recursive: true, mode: 448 });
      emptySource = mkdtempSync(join18(this.emptySources, "empty-"));
    }
    const job = { id: randomUUID9(), name: key, source: source ?? null, started: Date.now(), ended: null, step: "scan", progress: null, project: null, error: null };
    keep(this.inits, job.id, job, KEEP_INITS);
    const on_progress = (p) => {
      if (typeof p?.phase === "string") job.step = p.phase;
      job.progress = { phase: p?.phase ?? null, done: p?.done ?? null, total: p?.total ?? null };
    };
    const completion = Promise.resolve().then(() => this.lfs.project.init(key, source ?? emptySource, { on_progress })).then(
      (made) => Object.assign(job, { step: "done", project: this.summary({ ...made, project: made?.project ?? key }) }),
      (error2) => {
        Object.assign(job, { step: "failed", error: { ...refusalOf3(error2), ...error2?.transport ? { transport: error2.transport } : {} } });
        this.log(`[host] creating ${key}: ${error2?.message ?? error2}`);
      }
    ).finally(() => {
      job.ended = Date.now();
      if (emptySource) rmSync6(emptySource, { recursive: true, force: true });
      this.creations.delete(job.id);
    });
    this.creations.set(job.id, completion);
    return { ...job };
  }
  /**
   * A folder an Init may copy from: an existing absolute directory outside the
   * LayerFS home. Reads no file in it; answers
   * `{ source }` (the real path) or refuses. The dialog calls it before it
   * makes a Store, so a wrong folder leaves no empty Store behind.
   */
  checkSource(input) {
    const source = input?.source;
    if (typeof source !== "string" || !isAbsolute4(source) || source.includes("\0") || !statSync7(source, { throwIfNoEntry: false })?.isDirectory()) {
      throw refuse(400, "InvalidInput", "Choose an existing absolute source folder.");
    }
    const real3 = realpathSync5(source);
    const home = safeReal(this.host.home);
    const rel = home ? relative2(home, real3) : "..";
    if (!(rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute4(rel))) throw refuse(400, "InvalidInput", `Choose a folder outside the LayerFS home (${this.host.home}).`);
    return { source: real3 };
  }
  /** One of this host's Init jobs. */
  async init(id) {
    const job = this.inits.get(id);
    if (!job) throw refuse(404, "NotFound", "The project creation task is no longer available. Refresh Projects to check its result.");
    return { ...job };
  }
  /** The Inits this host started, newest first. */
  initJobs() {
    return [...this.inits.values()].reverse().map((j) => ({ ...j }));
  }
  /** Whether an Init is running (for runtime admission). */
  busy() {
    return [...this.inits.values()].some((j) => !j.ended) || this.creations.size > 0;
  }
  /** ProjectSummary[]. */
  async list(fresh = false) {
    const records = await pages((p) => this.lfs.project.list({ ...p, detail: true, ...fresh ? { timeout_ms: READ_TIMEOUT_MS } : {} }));
    const join30 = this.storeJoin ? await this.storeJoin().catch(() => null) : null;
    return records.map((p) => this.summary(p, join30));
  }
  /** `project get --detail` of a key (the long form names the project, its engine, machine and created_at). */
  async record(key) {
    const project = projectRef(key).key;
    const got = await this.lfs.project.get(project, { detail: true });
    return { ...got, project: got?.project ?? project };
  }
  /**
   * ProjectState from the Store alone: its Branch metadata, its Sandbox
   * records and the Store's state. No Sandbox is asked. While its Store is
   * busy or broken, Store calls are refused (Busy, Unresolved, Unavailable);
   * while it is blocked (its machine is not ready) none is made (U3): the
   * page then gets what the home's records say, the Store's state and its
   * companions, and the refusal in `refusal`, with no Branches.
   */
  async state(key) {
    const record = await this.record(key);
    const project = keyOf(record);
    const status = await this.lfs.store.get(record.store, { detail: true }).catch(() => null);
    const down = status?.state === "blocked";
    const [listed, sandboxes] = await Promise.all([
      down ? { refused: null } : pages((p) => this.lfs.branch.list(project, { ...p, detail: true })).catch((error2) => {
        if (STORE_REFUSALS.has(error2?.code)) return { refused: refusalOf3(error2) };
        throw error2;
      }),
      pages((p) => this.lfs.sandbox.list({ project, ...p, detail: true })).catch((error2) => (this.log(`[host] sandbox.list of ${project}: ${error2?.message ?? error2}`), []))
    ]);
    const facts3 = companionsOf(status);
    const storeFacts = { storeState: status?.state ?? null, storeOp: opOf(status?.op), storeBlockedBy: facts3.blockedBy ?? null, storeReason: facts3.reason ?? null, storeFix: facts3.fix ?? null };
    const store = { path: null, bytes: null };
    if (!Array.isArray(listed)) {
      return {
        project: { ...this.summary(record), ...storeFacts, refusal: listed.refused },
        branches: [],
        layers: [],
        sandboxes: sandboxes.map((s) => sandboxInfo(s)),
        last: null,
        commits: null,
        store,
        storage: null
      };
    }
    const main = listed.find((b) => b.branch === "main");
    return {
      project: { ...this.summary(record), ...storeFacts },
      branches: branchInfos(listed),
      // 2.0 lists none of main's Layers but its newest (§9 Q3)
      layers: main?.commit ? [{ id: main.commit, message: "", at: null, from: null }] : [],
      sandboxes: sandboxes.map((s) => sandboxInfo(s)),
      last: null,
      commits: null,
      store,
      // the Store's totals have no 2.0 call (§9 Q4)
      storage: null
    };
  }
  /** SandboxInfo[] of the project's records (Workspaces are read on demand). */
  async sandboxes(key) {
    const { key: project } = projectRef(key);
    const listed = await pages((p) => this.lfs.sandbox.list({ project, ...p, detail: true }));
    return listed.map((s) => sandboxInfo(s));
  }
  /**
   * A new Sandbox of the project: `{ name, machine?, image?, start?, background? }`
   * (docs/specs/sandbox-images.md §4.1). A sqlite project's Sandboxes run on
   * its Store's machine (another is Unsupported); a PostgreSQL project's on
   * `machine` when one is named (any machine whose platform runs PostgreSQL
   * Sandboxes; LayerFS refuses the rest), else placement.ts's order (its
   * last machine, a machine its database was reached from, native; never a
   * broken or stopped one).
   *
   * `image` is a string. Until the pinned CLI declares references (Stage 1,
   * `imageRefs`), only a full `sha256:` digest is taken: anything else is
   * refused 501 `Unsupported` with `detail.need: 'image-refs'`, since the CLI
   * would drop it silently. `start: true` runs machine.start first (the
   * "Start and create" button). `background: true` answers `202 { creation }`
   * and runs the create as a job ({@link SandboxCreates}); without it the
   * route waits and answers sandbox.create's result.
   */
  async createSandbox(key, body = {}) {
    const record = await this.record(key);
    const { name: name6, image } = body ?? {};
    if (typeof name6 !== "string" || !name6) throw refuse(400, "InvalidInput", "A Sandbox needs a name.");
    const storeName = String(record.store ?? keyOf(record).split("/")[0]);
    const storeRecord = await this.lfs.store.get(storeName, { detail: true }).catch(() => null);
    const postgresql = (storeRecord?.engine ?? record.engine) === "postgresql";
    let machine = storeRecord?.machine ?? record.machine;
    if (postgresql) {
      const named = typeof body.machine === "string" && body.machine ? body.machine : null;
      if (!named) {
        const sandboxes = await this.lfs.sandbox.list({ project: keyOf(record), detail: true }).then((r) => r?.items ?? [], () => []);
        machine = pgPlacement(await machineRows(this.lfs), { last: lastUsed(sandboxes), reached: reachedFrom(storeRecord) });
      } else machine = named;
    }
    if (image !== void 0 && image !== null && image !== "" && typeof image !== "string") throw refuse(400, "InvalidInput", "Name the image as a string: its id (a sha256 digest) or a reference.");
    const picked = typeof image === "string" && image ? image : void 0;
    const features = await cliFeatures(this.host);
    if (picked && !DIGEST.test(picked) && features.imageStage < 1) {
      throw Object.assign(refuse(501, "Unsupported", `The pinned LayerFS CLI takes a Sandbox image only by its full sha256 digest, not ${JSON.stringify(picked)}. Pick an image from the list, or pin a LayerFS that takes image references.`), { detail: { need: "image-refs" } });
    }
    if (picked && features.imageStage === 1) {
      const short2 = await this.spaceFor(String(machine), picked);
      if (short2) throw Object.assign(refuse(507, "Capacity", `${picked} needs ${short2.need} bytes on ${machine}; it has ${short2.free} free.`), { detail: { needed_bytes: short2.need, free_bytes: short2.free, path: null }, fix: `layerfs machine prune ${machine} --unused` });
    }
    const start = body.start === true;
    const project = keyOf(record);
    const input = { project, name: name6, machine: String(machine), ...picked ? { image: picked } : {}, ...start ? { start: true } : {} };
    const run2 = async (report) => {
      if (start) {
        report({ phase: "machine" });
        await this.startMachine(input.machine);
        report({ phase: "queued" });
      }
      await this.host.ensureNative();
      const progress = features.createProgress ? { on_progress: (p) => {
        const u = createPhase(p);
        if (u) report(u);
      } } : {};
      const made = await this.lfs.sandbox.create(project, name6, { ...postgresql ? { machine: String(machine) } : {}, ...picked ? { image: picked } : {}, ...progress });
      this.sandboxCreates.created(project, name6);
      this.sandboxMade(name6);
      return made;
    };
    if (body.background === true) return new Answer(202, { creation: this.sandboxCreates.admit(input, run2) });
    return run2(() => {
    });
  }
  /** Stage 1's disk precheck of a create; the router wires Machines.spaceFor (none: no precheck). */
  spaceFor = async () => null;
  /** A Sandbox was made: the router wires the metrics sampler's `created` (no stale "daemon not running" point). */
  sandboxMade = () => {
  };
  /** machine.start of `name` before a create (`start: true`); the router wires Machines.start (machine-progress events). */
  startMachine = (name6) => this.lfs.machine.start(name6);
  /** One Sandbox with its Workspaces (sandbox.get). */
  async sandbox(name6) {
    if (typeof name6 !== "string" || !name6) throw refuse(400, "InvalidInput", "Name the Sandbox.");
    const record = await sandboxObservation(this.lfs, name6);
    const info2 = sandboxInfo({ ...record, sandbox: record?.sandbox ?? name6 }, Array.isArray(record?.workspaces) ? record.workspaces : []);
    const tags = /* @__PURE__ */ new Set();
    for (const w of info2.workspaces) for (const r of w.running ?? []) if (r.tag) tags.add(r.tag);
    let labels = {};
    if (tags.size) {
      try {
        labels = await this.host.labelTags?.([...tags]) ?? {};
      } catch {
      }
    }
    for (const w of info2.workspaces) {
      for (const r of w.running ?? []) {
        r.own = this.ownExec?.(w.ws, r.execId) ?? false;
        if (r.tag && labels[r.tag]) r.session = labels[r.tag];
      }
    }
    return info2;
  }
  /** Whether this host's Sandbox pages started command `execId` in Workspace `ws` (set by the router from commands.ts). */
  ownExec;
  /**
   * Mounts a Workspace in Sandbox `name`: `{ branch, fork?, name? }`. Only
   * side Branches are mounted (owner D14: mounting main is refused), so
   * `fork: true` first forks `branch` from main. Answers workspace.mount's result.
   */
  async mount(sandbox, { branch, fork = false, name: name6 } = {}) {
    if (typeof sandbox !== "string" || !sandbox) throw refuse(400, "InvalidInput", "Name the Sandbox.");
    checkBranch(branch);
    if (branch === "main") throw refuse(400, "InvalidInput", "Only side Branches are mounted: fork a Branch from main and mount that.");
    const lfs = this.lfs;
    if (fork) {
      const { project } = await lfs.sandbox.get(sandbox, { detail: true });
      await lfs.branch.fork(project, branch, "main");
    }
    try {
      return await lfs.workspace.mount(sandbox, branch, name6 ? { name: name6 } : {});
    } finally {
      invalidateSandbox(lfs, sandbox);
    }
  }
  /** workspace.unmount(ws, { discard, force }): refused while it has changes unless discarded, and while busy unless forced. */
  async unmount(ws, { discard = false, force = false } = {}) {
    if (typeof ws !== "string" || !ws.includes(":")) throw refuse(400, "InvalidInput", "A Workspace is named <sandbox>:<name or path>.");
    const lfs = this.lfs;
    try {
      return await lfs.workspace.unmount(ws, { ...discard ? { discard: true } : {}, ...force ? { force: true } : {} });
    } finally {
      invalidateSandbox(lfs, ws.slice(0, ws.indexOf(":")));
    }
  }
  /** sandbox.remove(name, { force }); answers its long form (`unmounted`: the Workspaces a forced removal ended). */
  async closeSandbox(name6, { force = false } = {}) {
    if (typeof name6 !== "string" || !name6) throw refuse(400, "InvalidInput", "Name the Sandbox to close.");
    if (!force && await this.host.closeSessionSandbox?.(name6).finally(() => this.forget(name6))) {
      this.sandboxClosedHook?.(name6);
      return { ok: true, outcome: "removed", sandbox: name6, unmounted: [], session: true };
    }
    const result = await this.lfs.sandbox.remove(name6, { detail: true, ...force ? { force: true } : {} }).finally(() => this.forget(name6));
    await this.host.sandboxClosed?.(name6);
    this.sandboxClosedHook?.(name6);
    return result;
  }
  /** A write on `sandbox` (its outcome known or not): its next read asks LayerFS again. */
  forget(sandbox) {
    try {
      invalidateSandbox(this.lfs, sandbox);
    } catch {
    }
  }
  /** Called after each successful close (the router drops the Sandbox's command logs). */
  sandboxClosedHook;
  /** Closes every Sandbox of the project (`force` passes on); answers each close. */
  async closeSandboxes(key, { force = false } = {}) {
    const { key: project } = projectRef(key);
    const listed = await pages((p) => this.lfs.sandbox.list({ project, ...p }));
    const out = [];
    for (const s of listed) out.push(await this.closeSandbox(String(s.sandbox), { force }));
    return out;
  }
  /**
   * project.delete: refused while a mount of the project is live; the project's data stays in its Store until
   * store.compact collects it.
   */
  async remove(key) {
    const { key: project } = projectRef(key);
    await this.host.projectRemoving?.(project);
    await this.lfs.project.delete(project);
    await this.host.projectRemoved?.(project);
    return { removed: true };
  }
  // ---------- Store statistics ----------
  /**
   * A Store's statistics: `store get --with stats` (it opens the Store where it
   * lives), its engine and the `stats` section. The observation journal needs
   * a Store identity 2.0 does not answer, so its append is refused and the
   * answer says why (`observationError`).
   */
  async storeStats(name6) {
    const record = await this.lfs.store.get(name6, { detail: true, with: ["stats"] });
    const stats = { engine: record?.engine ?? null, ...record?.stats ?? {} };
    try {
      await this.storageObservations.record(name6, stats, record);
      return stats;
    } catch (error2) {
      return { ...stats, observationError: String(error2?.message ?? error2) };
    }
  }
  async storeObservations(name6) {
    return this.storageObservations.read(name6);
  }
  /**
   * StoreProjects (the Store page's Projects tab and Overview): every project of
   * a Store with its ledger totals (project-storage.ts), its newest Commit, and
   * main's file count (project.stats). Ledgers refresh in the background as for
   * one project; reads go one project at a time, as the Store takes them. A
   * project.stats answer is reused while main's head is unchanged, so a reread
   * walks no tree again.
   */
  async storeProjects(name6) {
    const records = await pages((p) => this.lfs.project.list({ store: name6, ...p, detail: true }));
    const rows2 = [...new Map(records.map((r) => [keyOf(r), r])).entries()].map(([project, record]) => ({ short: project.slice(project.indexOf("/") + 1), record })).sort((a, b) => a.short < b.short ? -1 : a.short > b.short ? 1 : 0);
    const projects = [];
    for (const { short: short2, record } of rows2) {
      const project = keyOf(record), created = msAt(record.created_at);
      const view = await this.storageLedgers.view(project, created);
      const last = view.recent.length ? view.recent[view.recent.length - 1] : null;
      projects.push({ name: short2, created, totals: view.totals, last, files: await this.mainFiles(project), partial: view.partial, building: view.building, error: view.error });
    }
    return { store: name6, projects };
  }
  /** main's file count, by main's head (one project.stats walk per head). */
  filesByHead = /* @__PURE__ */ new Map();
  async mainFiles(project) {
    const head = await this.lfs.branch.get(project, "main").then((b) => String(b?.commit ?? ""), () => "");
    const known4 = this.filesByHead.get(project);
    if (head && known4?.head === head) return { files: known4.files, complete: known4.complete };
    const stats = await this.lfs.project.stats(project, head ? { at: head } : {}).catch(() => null);
    if (!stats) return null;
    const row = { head, files: typeof stats.file_count === "number" ? stats.file_count : null, complete: stats.partial !== true };
    if (head) this.filesByHead.set(project, row);
    return { files: row.files, complete: row.complete };
  }
  // ---------- a project's own storage ----------
  /**
   * ProjectStorage: this project's saves summed from their Commit counters
   * (the ledger, refreshed in the background), its Store's totals for the
   * share, and main's latest tree. `?refresh=1` starts a refresh now.
   */
  async projectStorage(key, q2) {
    const record = await this.record(key);
    const project = keyOf(record), created = msAt(record.created_at);
    const [view, store, storeRecord, main] = await Promise.all([
      this.storageLedgers.view(project, created, { refresh: q2.get("refresh") === "1" }),
      this.lfs.store.get(record.store, { with: ["stats"] }).then((r) => r?.stats ?? {}, (error2) => ({ refusal: refusalOf3(error2) })),
      this.lfs.store.get(record.store).catch(() => null),
      this.lfs.project.stats(project).catch(() => null)
    ]);
    const projects = typeof storeRecord?.projects_count === "number" ? storeRecord.projects_count : Array.isArray(storeRecord?.projects) ? new Set(storeRecord.projects).size : null;
    return {
      ...view,
      store: { name: record.store, projects, ..."refusal" in store ? { refusal: store.refusal } : { historyLogical: store.logical_bytes ?? null, canonical: store.canonical_bytes ?? null, stored: store.stored_bytes ?? null, metadata: store.metadata_bytes ?? null, file: store.file_bytes ?? null } },
      main: main ? { logical: main.size ?? null, files: main.file_count ?? null, directories: main.dir_count ?? null, complete: main.partial !== true } : null
    };
  }
  /**
   * A project's size for its Overview card, and the raw bytes of main's latest
   * tree. Alone in its Store (`?alone=1`, the caller knows the Store's
   * projects) the project's size is the Store's packed bytes, which count every
   * write, publications to main included. In a shared Store it is the packed
   * bytes its saves wrote first (the ledger above, refreshed in the background;
   * `counting` until a first read finishes or while one runs).
   */
  async projectSize(key, q2) {
    const record = await this.record(key);
    const project = keyOf(record), created = msAt(record.created_at);
    const files = this.lfs.project.stats(project).then((main) => typeof main?.size === "number" ? main.size : null, () => null);
    if (q2.get("alone") === "1") {
      const [store, logical2] = await Promise.all([this.lfs.store.get(record.store, { with: ["stats"] }).then((r) => r?.stats ?? null, () => null), files]);
      return { project, stored: typeof store?.stored_bytes === "number" ? store.stored_bytes : null, counting: false, files: logical2 };
    }
    const [view, logical] = await Promise.all([this.storageLedgers.view(project, created), files]);
    return { project, stored: view.totals && !view.partial ? view.totals.stored : null, counting: view.partial || view.building !== null, files: logical };
  }
  async history(key, q2) {
    const project = projectRef(key).key;
    const branch = q2.get("branch");
    if (!branch) {
      const page2 = await this.branchPage(project, q2.get("pos"));
      return { branches: page2.items.map((b) => ({ name: String(b.branch), head: pinOf(b), base: b.base ?? null, forkedFrom: b.forked_from ?? null })), next: page2.next };
    }
    const commit = q2.get("commit");
    if (commit) {
      const c = await this.lfs.commit.get(project, commit, { branch, detail: true });
      const id = String(c?.commit ?? commit);
      const from = q2.get("from") ?? c.parent ?? c.base;
      if (!from) return { item: commitInfo({ ...c, commit: id }, branch), changes: [], nextChanges: null };
      const diff = await this.lfs.commit.diff(project, id, { from, limit: 100, ...q2.get("cursor") ? { cursor: q2.get("cursor") } : {} });
      return { item: commitInfo({ ...c, commit: id }, branch), changes: (diff.items ?? []).map(({ path: path2, change }) => ({ path: path2, kind: String(change) })), nextChanges: diff.next_cursor ?? null };
    }
    const at = q2.get("at") ?? q2.get("head");
    const fork = branch === "main" ? null : q2.get("fork") || (await this.lfs.branch.get(project, branch, { detail: true })).forked_from;
    if (q2.get("count")) return this.historyCount(project, branch, at, fork);
    const wide = !!q2.get("wide");
    const cacheKey = at ? JSON.stringify([project, branch, at, fork, wide]) : null;
    const cached = cacheKey ? this.historyPages.get(cacheKey) : void 0;
    if (cached) {
      this.historyPages.delete(cacheKey);
      this.historyPages.set(cacheKey, cached);
      return cached;
    }
    const page = await this.commitPage(project, branch, at, wide ? HISTORY_WIDE_PAGE : HISTORY_PAGE_SIZE);
    const all = page.items;
    const boundary = fork ? all.findIndex((c) => c.id === fork) : -1;
    const items = boundary < 0 ? all : all.slice(0, boundary);
    const parent = items.at(-1)?.parent;
    const answer = { items: items.map((c) => commitInfo(c, branch)), head: at ?? items[0]?.id ?? null, next: page.more && boundary < 0 && parent !== fork ? parent ?? null : null };
    if (cacheKey) {
      this.historyPages.set(cacheKey, answer);
      if (this.historyPages.size > HISTORY_PAGES_KEPT) this.historyPages.delete(this.historyPages.keys().next().value);
    }
    return answer;
  }
  /**
   * How many Commits a side Branch has from `head` back to its fork (`main` has Layers, not
   * Commits: null). Counted once in wide pages, then kept: a moved head reads back only to
   * the head it was last counted at. One count runs at a time per Branch and head.
   */
  async historyCount(project, branch, head, fork) {
    if (branch === "main") return { head, count: null };
    if (!head || head === fork) return { head, count: 0 };
    const key = JSON.stringify([project, branch]);
    const known4 = this.historyCounts.get(key);
    if (known4?.head === head) return known4;
    const flight = JSON.stringify([project, branch, head]);
    const running = this.counting.get(flight);
    if (running) return running;
    const run2 = (async () => {
      let count4 = 0;
      let at = head;
      for (; ; ) {
        const page = await this.commitPage(project, branch, at, HISTORY_WIDE_PAGE);
        const rows2 = page.items;
        let done = false;
        for (const c of rows2) {
          if (fork && c.id === fork) {
            done = true;
            break;
          }
          if (known4 && c.id === known4.head) {
            count4 += known4.count;
            done = true;
            break;
          }
          count4++;
        }
        const parent = rows2.at(-1)?.parent;
        if (done || !page.more || !rows2.length || !parent || parent === fork || parent === at) break;
        at = parent;
      }
      const answer = { head, count: count4 };
      this.historyCounts.delete(key);
      this.historyCounts.set(key, answer);
      if (this.historyCounts.size > HISTORY_COUNTS_KEPT) this.historyCounts.delete(this.historyCounts.keys().next().value);
      return answer;
    })();
    this.counting.set(flight, run2);
    try {
      return await run2;
    } finally {
      this.counting.delete(flight);
    }
  }
  /**
   * One page of a Branch's Commits from `at` (2.0 `commit list --at --detail`),
   * newest first, each row with its `id`; `more` when LayerFS has another page.
   * Pages after the first resume at the last row's parent, so each is an
   * immutable read the host can keep.
   */
  async commitPage(project, branch, at, limit) {
    const page = await this.lfs.commit.list(project, branch, { limit, ...at ? { at } : {}, detail: true });
    return { items: (page?.items ?? []).map((c) => ({ ...c, id: c.commit })), more: !!page?.next_cursor };
  }
  /** One bounded immutable directory page (2.0 `file list --at`, by cursor); metadata is read only for opened files. */
  async listDir(key, branch, path2, pin, pos = 0) {
    validate(branch, path2);
    const project = projectRef(key).key;
    const at = await this.saved(project, branch, pin);
    const cursor = pos === 0 || pos === "0" || pos === "" ? null : String(pos);
    const page = await this.lfs.file.list(project, branch, path2, { at, limit: 1e3, ...cursor ? { cursor } : {} });
    const items = (page?.items ?? []).map((i) => ({ name: String(i.path).split("/").filter(Boolean).at(-1) ?? String(i.path), path: i.path, kind: i.type ?? "file", size: null, mode: null }));
    return { items, next: page?.next_cursor ?? null, at: { id: at } };
  }
  /** A window of a saved file (`file stat` and `file read --at --line --limit --detail`; a file that is not text answers `binary`). */
  async file(key, branch, path2, pin, line = 1) {
    validate(branch, path2);
    const project = projectRef(key).key;
    const at = await this.saved(project, branch, pin);
    if (!Number.isSafeInteger(Number(line)) || Number(line) < 1) throw fail5("line must be a positive integer");
    const stat2 = await this.lfs.file.stat(project, branch, path2, { at });
    const window = await this.lfs.file.read(project, branch, path2, { at, line: Number(line), limit: 1e3, detail: true });
    if (window?.binary === true) return { path: path2, size: stat2.size, binary: true, text: null, at: { id: at } };
    return {
      path: path2,
      size: stat2.size,
      mode: stat2.mode,
      binary: false,
      text: typeof window?.text === "string" ? window.text : "",
      next_line: window?.next_line ?? null,
      line_truncated: window?.line_truncated === true,
      at: { id: at }
    };
  }
  /**
   * The saved-file queries: `blame` (file blame's ranges with file read's
   * lines for the same window), `revisions` (file history), `compare` (commit
   * diff of one path, `--with patch`) and `branch-diff` (commit diff under a
   * path). 2.0 has no line ownership across a diff: `attribution` answers the
   * comparison with its attribution unavailable (file blame names owners).
   */
  async fileQuery(key, q2) {
    const project = projectRef(key).key, branch = q2.get("branch") ?? "main", path2 = q2.get("path");
    validate(branch, path2);
    const at = await this.saved(project, branch, q2.get("pin"));
    const kind = q2.get("kind"), pageSize = integer(q2, "size", 50, 1e3);
    if (kind === "blame") {
      const line = integer(q2, "line", 1, Number.MAX_SAFE_INTEGER);
      const [window, blame] = await Promise.all([
        this.lfs.file.read(project, branch, path2, { at, line, limit: 1e3, detail: true }),
        this.lfs.file.blame(project, branch, path2, { at, line, limit: 1e3, detail: true })
      ]);
      const messages = new Map((Array.isArray(blame?.commits) ? blame.commits : []).map((c) => [String(c.commit), c.message ?? null]));
      const ranges = Array.isArray(blame?.ranges) ? blame.ranges : [];
      const madeOn = await this.branchesOf(project, ranges.map((r) => r.commit).filter(Boolean).map(String), branch);
      const text6 = typeof window?.text === "string" ? window.text : "";
      const rows2 = text6 === "" ? [] : text6.replace(/\n$/, "").split("\n");
      const lines2 = rows2.map((t, i) => {
        const n = line + i;
        const owner = ranges.find((r) => n >= r.start && n <= r.end)?.commit;
        return { n, text: t, owner: owner ? { ref: savedRef(owner, madeOn.get(String(owner))), message: messages.get(String(owner)) ?? null } : null };
      });
      return { at: savedRef(at, branch), lines: lines2, coverage: { status: blame?.partial ? "partial" : "complete" }, next_line: blame?.next_line ?? window?.next_line ?? null };
    }
    if (kind === "revisions") {
      const traversal = q2.get("traversal") ?? "provenance";
      const page = await this.lfs.file.history(project, branch, path2, { at, traversal, limit: pageSize, ...q2.get("continuation") ? { cursor: q2.get("continuation") } : {}, detail: true });
      const items = page?.items ?? [];
      let own = new Set(traversal === "branch" ? items.map((r) => String(r.commit)) : []);
      if (traversal !== "branch" && items.length) {
        const line = await this.lfs.file.history(project, branch, path2, { at, traversal: "branch", limit: q2.get("continuation") ? 1e3 : pageSize }).catch(() => null);
        own = new Set((line?.items ?? []).map((r) => String(r.commit)));
      }
      const madeOn = await this.branchesOf(project, items.map((r) => String(r.commit)), branch, own);
      return {
        items: items.map((r) => {
          const on = madeOn.get(String(r.commit));
          return {
            ref: savedRef(r.commit, on),
            compared_to: savedRef(r.parent, on),
            kind: changeKind(r.change),
            message: r.message ?? null,
            recorded_at: msAt(r.created_at),
            after: typeof r.size === "number" ? { size: r.size } : null,
            changes: { content: r.content ?? void 0, metadata: r.metadata ?? void 0, identity: r.identity ?? void 0 }
          };
        }),
        has_more: !!page?.next_cursor,
        continuation: page?.next_cursor ?? null
      };
    }
    if (kind === "compare" || kind === "attribution") {
      const rightBranch = q2.get("rightBranch") ?? branch;
      const leftPin = await this.saved(project, rightBranch, q2.get("left"));
      const diff = await this.lfs.commit.diff(project, at, { from: leftPin, path: path2, with: ["patch"], limit: 1, detail: true });
      const item = (diff?.items ?? []).find((i) => i.path === path2) ?? diff?.items?.[0] ?? null;
      let left = 0, right = 0;
      const rows2 = (Array.isArray(item?.hunks) ? item.hunks : []).map((h) => {
        const op = h.op === "+" || h.op === "-" ? h.op : " ";
        if (op !== "+") left++;
        if (op !== "-") right++;
        return { op, text: String(h.text ?? ""), ...op !== "+" ? { left_line: left } : {}, ...op !== "-" ? { right_line: right } : {} };
      });
      const change = String(item?.change ?? "");
      const binary = !!item && !Array.isArray(item.hunks) && item.hunks_omitted !== true && item.content !== false && (item.type ?? "file") === "file";
      const sizeAt = async (onBranch, pin) => {
        if (!binary) return {};
        try {
          const s = await this.lfs.file.stat(project, onBranch, path2, { at: pin });
          return typeof s?.size === "number" ? { size: s.size } : {};
        } catch {
          return {};
        }
      };
      const [before, after] = await Promise.all([
        change === "added" ? null : sizeAt(rightBranch, leftPin),
        change === "removed" ? null : sizeAt(branch, at)
      ]);
      return {
        rows: rows2,
        has_more: item?.hunks_omitted === true,
        change_kind: item ? changeKind(item.change) : "Unchanged",
        before,
        after,
        changes: item ? { content: item.content, metadata: item.metadata, identity: item.identity, attribution: null } : void 0,
        ...kind === "attribution" ? { attribution_coverage: { status: "unavailable", reasons: ["LayerFS 2.0 names line owners with file blame, not across a diff"] } } : {}
      };
    }
    if (kind === "branch-diff") {
      const left = await this.saved(project, q2.get("rightBranch") ?? branch, q2.get("left"));
      const diff = await this.lfs.commit.diff(project, at, { from: left, ...path2 && path2 !== "/" ? { path: path2 } : {}, limit: pageSize, ...q2.get("continuation") ? { cursor: q2.get("continuation") } : {}, detail: true });
      return {
        from: savedRef(diff?.from ?? left),
        to: savedRef(diff?.to ?? at, branch),
        items: (diff?.items ?? []).map((i) => ({ path: i.path, kind: changeKind(i.change), type: i.type ?? "file", content: i.content, metadata: i.metadata, attribution: null, changed_owner_lines: null })),
        has_more: !!diff?.next_cursor,
        continuation: diff?.next_cursor ?? null,
        coverage: { complete: true }
      };
    }
    throw fail5("Unknown saved-file query.");
  }
  async branches(key, q2) {
    const project = projectRef(key).key;
    if (q2.get("branch")) return this.lfs.branch.get(project, q2.get("branch"), { detail: true });
    const page = await this.branchPage(project, q2.get("pos"));
    return { items: page.items.map((b) => ({ name: String(b.branch), head: pinOf(b), parent: null, forkedFrom: b.forked_from ?? null, state: "open", commits: null })), next: page.next };
  }
  /**
   * One page of a project's Branches (`branch list --detail`, 100 at a time,
   * by cursor; `pos` is the cursor, `0` or none the first page), main first:
   * main is read on its own for the first page and left out of every listed
   * page, since name order puts it on any page (`dsh.*` sorts before it). The
   * first page is never empty, so a client that hides internal Branches still
   * has one to show.
   */
  async branchPage(project, pos) {
    const cursor = pos && pos !== "0" ? pos : null;
    const [page, main] = await Promise.all([
      this.lfs.branch.list(project, { limit: 100, ...cursor ? { cursor } : {}, detail: true }),
      cursor ? null : this.lfs.branch.get(project, "main", { detail: true })
    ]);
    const items = (page?.items ?? []).filter((b) => b.branch !== "main");
    return { items: main ? [{ ...main, branch: "main" }, ...items] : items, next: page?.next_cursor ?? null };
  }
  /** `project stats --branch --at`: main's (or a Branch's) tree at a pin, in the view's words. */
  async projectStats(key, q2) {
    const project = projectRef(key).key, branch = q2.get("branch") ?? "main";
    const at = await this.saved(project, branch, q2.get("pin"));
    const s = await this.lfs.project.stats(project, { branch, at });
    return { files: s?.file_count ?? null, directories: s?.dir_count ?? null, symlinks: s?.symlink_count ?? null, logical: s?.size ?? null, complete: s?.partial !== true, projectKey: project };
  }
  // ---------- Commits ----------
  async commits(key, branch, limitText) {
    checkBranch(branch);
    const limit = limitText == null || limitText === "" ? LIMIT : Number(limitText);
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > PAGE) throw refuse(400, "InvalidInput", `limit must be a whole number from 1 to ${PAGE}`);
    const { key: project } = projectRef(key);
    if (branch === "main") return [];
    const b = await this.lfs.branch.get(project, branch, { detail: true });
    return this.withChanges(project, branch, await this.ownCommits(project, { name: branch, forked_from: b?.forked_from ?? null }, limit));
  }
  /** `{ [branch]: CommitInfo[] }` for several Branches (main's are []); a Branch gone since the caller saw it is left out. */
  async branchCommits(key, branches) {
    const { key: project } = projectRef(key);
    if (!Array.isArray(branches) || branches.length === 0) return {};
    if (branches.length > PAGE) throw refuse(400, "InvalidInput", `at most ${PAGE} Branches at once`);
    for (const b of branches) checkBranch(b);
    const wanted = [...new Set(branches)];
    const out = Object.fromEntries(wanted.filter((b) => b === "main").map((b) => [b, []]));
    const listed = new Map((await pages((p) => this.lfs.branch.list(project, { ...p, detail: true }))).map((b) => [String(b.branch), b]));
    await each(wanted.filter((b) => b !== "main" && listed.has(b)), WIDTH, async (branch) => {
      try {
        out[branch] = await this.withChanges(project, branch, await this.ownCommits(project, { name: branch, forked_from: listed.get(branch).forked_from ?? null }, LIMIT));
      } catch (error2) {
        if (error2?.code !== "NotFound") throw error2;
      }
    });
    return out;
  }
  /** A Branch's own Commits (records), newest first: the walk stops at the fork. */
  async ownCommits(project, branch, limit) {
    const items = [];
    let at = null;
    while (items.length < limit) {
      const page = await this.commitPage(project, branch.name, at, Math.min(HISTORY_PAGE_SIZE, limit - items.length));
      const rows2 = page.items.map((c) => ({ ...c, branch: c.branch ?? branch.name }));
      const boundary = rows2.findIndex((c) => c.id === branch.forked_from);
      items.push(...boundary < 0 ? rows2 : rows2.slice(0, boundary));
      const parent = rows2.at(-1)?.parent;
      if (!page.more || boundary >= 0 || !parent || parent === branch.forked_from || parent === at || !rows2.length) break;
      at = parent;
    }
    return items;
  }
  /** CommitInfo[] of records, each with its changed paths. */
  async withChanges(project, branch, records) {
    const commits = records.map((c) => commitInfo(c, branch));
    await each(records, WIDTH, async (c, index) => {
      const changes = await this.changesOf(project, c);
      if (changes) commits[index].changes = changes;
    });
    return commits;
  }
  /**
   * One Commit's changed paths: `commit diff <commit> --from <parent>`, or for
   * a Branch's first Commit from its base (as history() reads it). A failed
   * diff is logged.
   */
  async changesOf(project, c) {
    if (this.changes.has(c.id)) return this.changes.get(c.id);
    const from = c.parent ?? c.base;
    if (!from) return null;
    try {
      const items = [];
      for (let cursor = null; ; ) {
        const page = await this.lfs.commit.diff(project, c.id, { from, limit: PAGE, ...cursor ? { cursor } : {} });
        items.push(...(page.items ?? []).map(({ path: path2, change }) => ({ path: path2, kind: String(change) })));
        if (page.next_cursor) cursor = page.next_cursor;
        else break;
      }
      keep(this.changes, c.id, items, KEEP_CHANGES);
      return items;
    } catch (error2) {
      this.log(`[host] changes of ${c.id}: ${error2?.message ?? error2}`);
      return null;
    }
  }
  /** Lets active Inits finish. */
  async close() {
    await Promise.all([...this.creations.values(), this.storageLedgers.close()]);
  }
};
function safeReal(path2) {
  try {
    return realpathSync5(path2);
  } catch {
    return null;
  }
}

// src/host/routes/docker-engine.ts
import { request } from "node:http";
import { execFile as execFile2 } from "node:child_process";
import { existsSync as existsSync14, readlinkSync as readlinkSync2 } from "node:fs";
import { homedir as homedir3 } from "node:os";
import { dirname as dirname8, isAbsolute as isAbsolute5, resolve as resolve7, join as join19 } from "node:path";
var ENGINE_WAIT_MS = 12e4;
var POLL_MS = 1e3;
var isSocketNeed = (need2) => need2.startsWith("host:/") && need2 !== "host:/dev/fuse";
function engineSocket(row) {
  if (!row || row.platform !== "docker" || row.ready || row.missing.length === 0) return null;
  if (row.socket?.state === "denied") return null;
  if (!row.missing.every(isSocketNeed)) return null;
  return row.missing[0].slice("host:".length);
}
function socketTarget(socket, deps) {
  let at = socket;
  for (let i = 0; i < 8; i++) {
    const next = deps.readlink(at);
    if (!next) break;
    at = isAbsolute5(next) ? next : resolve7(dirname8(at), next);
  }
  return at;
}
function command(name6, deps) {
  for (const dir of ["/opt/homebrew/bin", "/usr/local/bin", ...deps.path]) {
    if (!dir) continue;
    const file = join19(dir, name6);
    if (deps.exists(file)) return file;
  }
  return null;
}
function app(name6, deps) {
  for (const dir of ["/Applications", join19(deps.home, "Applications")]) {
    const bundle = join19(dir, `${name6}.app`);
    if (deps.exists(bundle)) return bundle;
  }
  return null;
}
function launcherOf(socket, deps) {
  const target = socketTarget(socket, deps);
  if (target.includes("/.colima/")) {
    const colima2 = command("colima", deps);
    const profile = /\/\.colima\/([^/]+)\//.exec(target)?.[1];
    return colima2 ? { name: "colima", command: colima2, args: ["start", ...profile && profile !== "default" ? ["--profile", profile] : []] } : null;
  }
  if (target.includes("/.orbstack/")) return app("OrbStack", deps) ? { name: "OrbStack", command: "open", args: ["-g", "-a", "OrbStack"] } : null;
  if (app("Docker", deps)) return { name: "Docker Desktop", command: "open", args: ["-g", "-a", "Docker"] };
  const colima = target.includes("/.docker/") ? null : command("colima", deps);
  return colima ? { name: "colima", command: colima, args: ["start"] } : null;
}
async function startEngine(socket, deps, report, waitMs = ENGINE_WAIT_MS) {
  if (await deps.ping(socket)) return { started: false, engine: null };
  const launcher = launcherOf(socket, deps);
  if (!launcher) {
    throw refuse(null, "Unsupported", `The Docker Engine at ${socket} does not answer, and no Docker Desktop, OrbStack or colima is installed to start it. Install Docker Desktop, or point the docker machine at another socket.`);
  }
  report({ stage: "docker-engine", state: "started", engine: launcher.name });
  const fail6 = (code2, message) => {
    report({ stage: "docker-engine", state: "failed", engine: launcher.name, message });
    return refuse(null, code2, message);
  };
  const started = deps.now();
  const launching = deps.run(launcher.command, launcher.args, waitMs).then(() => null, (e) => e);
  let launchError = null;
  let launched = false;
  launching.then((e) => {
    launched = true;
    launchError = e;
  });
  while (deps.now() - started < waitMs) {
    if (await deps.ping(socket)) {
      report({ stage: "docker-engine", state: "completed", engine: launcher.name });
      return { started: true, engine: launcher.name };
    }
    if (launched && launchError) {
      const detail = String(launchError?.stderr || launchError?.message || launchError).trim().split("\n").slice(-3).join(" ");
      throw fail6("Unavailable", `${launcher.name} did not start: ${detail}`);
    }
    await deps.sleep(POLL_MS);
  }
  throw fail6("Timeout", `${launcher.name} did not come up in ${Math.round(waitMs / 1e3)} s (the Docker Engine at ${socket} still does not answer).`);
}
function pingSocket(socket) {
  return new Promise((done) => {
    const req = request({ socketPath: socket, path: "/_ping", method: "GET", timeout: 2e3 }, (res) => {
      res.resume();
      done(res.statusCode === 200);
    });
    req.on("timeout", () => {
      req.destroy();
      done(false);
    });
    req.on("error", () => done(false));
    req.end();
  });
}
var realEngineDeps = () => ({
  exists: (path2) => existsSync14(path2),
  readlink: (path2) => {
    try {
      return readlinkSync2(path2);
    } catch {
      return null;
    }
  },
  run: (cmd, args, timeoutMs) => new Promise((ok, no) => {
    execFile2(cmd, args, { timeout: timeoutMs, env: { ...process.env, PATH: ["/opt/homebrew/bin", "/usr/local/bin", process.env.PATH ?? ""].join(":") } }, (error2, _stdout, stderr) => error2 ? no(Object.assign(error2, { stderr })) : ok());
  }),
  ping: pingSocket,
  sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
  now: () => Date.now(),
  home: homedir3(),
  path: (process.env.PATH ?? "").split(":")
});

// src/host/routes/machines.ts
var BUILT_IN = /* @__PURE__ */ new Set(["native", "docker"]);
var OFF = /* @__PURE__ */ new Set(["ssh", "firecracker"]);
var OFF_OPTIONS = /* @__PURE__ */ new Set(["nested", "host"]);
var VIEW_KEEP_MS = 5e3;
var list2 = (value) => Array.isArray(value) ? value : Array.isArray(value?.items) ? value.items : [];
var DIGEST2 = /^sha256:[a-f0-9]{64}$/;
var BUNDLE_NAME = "LayerFS default";
var CACHE_REF = /^layerfs-cache\//;
var PRUNE_PER_IMAGE = /* @__PURE__ */ new Set(["InUse", "NotFound", "InvalidInput"]);
var linuxArchitecture = (arch2 = process.arch) => arch2 === "x64" ? "amd64" : arch2;
var text4 = (value) => typeof value === "string" && value ? value : null;
var count3 = (value) => typeof value === "number" ? value : Array.isArray(value) ? value.length : 0;
var num3 = (value) => typeof value === "number" && Number.isFinite(value) ? value : null;
var refsOf = (value) => Array.isArray(value) ? value.filter((r) => typeof r === "string" && !!r) : [];
var isoOf = (value) => {
  if (typeof value === "string" && value && Number.isFinite(Date.parse(value))) return value;
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return new Date(value < 1e12 ? value * 1e3 : value).toISOString();
  return null;
};
var WORKER_OUTDATED = /another build|replace its worker|outdated/i;
function staleOf(error2, at) {
  const message = error2 instanceof Error ? error2.message : typeof error2?.message === "string" ? error2.message : String(error2);
  const code2 = typeof error2?.code === "string" ? error2.code : "Unknown";
  const fix = typeof error2?.fix === "string" && error2.fix ? error2.fix : null;
  return { at, code: code2 === "Unavailable" && WORKER_OUTDATED.test(message) ? "WorkerOutdated" : code2, message, ...fix ? { fix } : {} };
}
var imageName = (refs) => refs.find((r) => r.endsWith(":latest")) ?? refs[0];
function readyOf(i) {
  const id = text4(i?.image);
  if (!id) return null;
  const refs = refsOf(i.refs).filter((r) => !CACHE_REF.test(r));
  const source = i.source === "bundle" || i.source === "machine" ? i.source : "imported";
  const row = {
    id,
    name: imageName(refs) ?? (source === "bundle" ? BUNDLE_NAME : id.replace(/^sha256:/, "").slice(0, 12)),
    refs,
    size: num3(i.size),
    source,
    sandboxes: num3(i.sandboxes_count) ?? count3(i.sandboxes),
    lastUsed: isoOf(i.last_used_at),
    usable: true
  };
  if (i.state === "busy") return { ...row, usable: false, state: "busy", op: opOf(i.op) };
  if (i.state === "broken") return { ...row, usable: false, state: "broken", partial: i.reason === "partial", ...text4(i.fix) ? { fix: i.fix } : {}, ...num3(i.staged_bytes) !== null ? { staged: num3(i.staged_bytes) } : {} };
  return row;
}
function dockerOf(answer) {
  const d = answer?.docker;
  if (!d || typeof d !== "object") return null;
  if (text4(d.reason)) {
    const reason = d.reason === "not_installed" ? "not-installed" : d.reason === "not_running" || d.reason === "engine_down" ? "not-running" : "error";
    return { available: false, reason, ...text4(d.message) ? { message: d.message } : {} };
  }
  const images = [];
  for (const r of Array.isArray(d.images) ? d.images : []) {
    const id = text4(r?.image);
    const refs = refsOf(r?.refs);
    if (!id) continue;
    const u = r.unusable;
    const reason = u && typeof u === "object" && typeof u.kind === "string" ? { kind: u.kind, ...text4(u.value) ? { value: u.value } : {} } : void 0;
    images.push({
      id,
      name: imageName(refs) ?? id.replace(/^sha256:/, "").slice(0, 12),
      refs,
      size: num3(r.size) ?? 0,
      architecture: text4(r.architecture) ?? "",
      os: text4(r.os) ?? "",
      need: num3(r.needed_bytes) ?? 0,
      fits: r.fits !== false,
      usable: r.usable !== false,
      ...reason ? { reason } : {}
    });
  }
  return { available: true, images };
}
function machineLive(name6, got, error2) {
  const live = got?.live && typeof got.live === "object" ? got.live : null;
  return {
    name: name6,
    freeDisk: num3(live?.disk_free_bytes),
    toolVersion: text4(live?.tool_version),
    worker: live?.worker && typeof live.worker === "object" ? { protocol: live.worker.protocol == null ? null : String(live.worker.protocol), bundle: text4(live.worker.bundle) } : null,
    ...error2 ? { error: { code: typeof error2?.code === "string" ? error2.code : "Unknown", message: String(error2?.message ?? error2), ...fixOf(error2) } } : {}
  };
}
var platformOf = (p) => ({
  platform: String(p.platform),
  how: String(p.how ?? ""),
  backend: text4(p.backend),
  route: text4(p.route),
  sqlite: text4(p.sqlite),
  postgresql: { store_calls: String(p.postgresql?.store_calls ?? ""), sandbox: p.postgresql?.sandbox === true, reason: text4(p.postgresql?.reason) },
  ready: p.ready === true,
  missing: list2(p.missing).map(String),
  version: text4(p.version),
  options: list2(p.options).map((o) => ({ option: String(o.option), kind: String(o.kind), ...o.default !== void 0 && o.default !== null ? { default: o.default } : {} })),
  description: String(p.description ?? ""),
  // docker's socket and the ones it could use
  ...p.socket && typeof p.socket === "object" ? { socket: { path: text4(p.socket.path), source: text4(p.socket.source), state: text4(p.socket.state) } } : {},
  ...Array.isArray(p.candidates) ? { candidates: p.candidates.map((c) => ({ path: text4(c?.path), source: text4(c?.source), ...text4(c?.host) ? { host: text4(c.host) } : {}, ...c?.usable === false ? { usable: false } : {} })) } : {}
});
function storeOf(s) {
  const machine = text4(s.machine);
  if (!machine || s.engine === "postgresql") return null;
  const names = Array.isArray(s.projects) ? s.projects.map(String) : [];
  return { name: String(s.store), machine, projects: num3(s.projects_count) ?? names.length, names, size: null, state: text4(s.state) ?? "ready", op: opOf(s.op), ...companionsOf(s) };
}
function pgStoreOf(s) {
  if (s.engine !== "postgresql") return null;
  const names = Array.isArray(s.projects) ? s.projects.map(String) : [];
  const connectedFrom = (Array.isArray(s.connections) ? s.connections : []).map((c) => ({ machine: text4(c?.machine) ?? "native", reached: text4(c?.reached) }));
  return { name: String(s.store), projects: num3(s.projects_count) ?? names.length, names, state: text4(s.state) ?? "ready", op: opOf(s.op), ...companionsOf(s), connectedFrom };
}
function sandboxOf(b) {
  return { name: String(b.sandbox ?? b.name), machine: text4(b.machine), project: text4(b.project), workspaces: Array.isArray(b.workspaces) ? b.workspaces.length : null, state: text4(b.state) ?? "ready", op: opOf(b.op), ...companionsOf(b), image: text4(b.image), platform: text4(b.platform) };
}
var SPACE_KEEP_MS = 6e4;
var noCall = (call, what) => Object.assign(refuse(501, "Unsupported", `The pinned LayerFS CLI cannot read ${what} (it has no ${call}).`), { detail: { need: call } });
function pick(body, keys) {
  const out = {};
  for (const key of keys) if (body[key] !== void 0 && body[key] !== null && body[key] !== "") out[key] = body[key];
  return out;
}
var Machines = class {
  /**
   * @param host - the route dependencies.
   * @param place - puts a Store on a machine as a job in Storage's table (push, pull, or pull then push).
   */
  constructor(host, place2 = null) {
    this.host = host;
    this.place = place2;
  }
  host;
  place;
  lastView = null;
  /** The MachinesView read in flight, shared by concurrent GETs; `changed()` (any write) makes later GETs read anew. */
  viewing = null;
  generation = 0;
  /** When `lastView` was read, and in which generation: within VIEW_KEEP_MS of the same generation it answers again without a call. */
  lastViewAt = null;
  platformAnswer = null;
  platformRead = null;
  get lfs() {
    return this.host.lfs();
  }
  /** The pinned CLI's version and the optional features its call table has. */
  async identity() {
    try {
      const d = await this.host.discover();
      return { version: d.identity?.version ?? null, features: featuresOf(d) };
    } catch {
      return { version: null, features: featuresOf(null) };
    }
  }
  /** A write somewhere (the router calls this on every non-GET): the next view() reads anew. */
  changed() {
    this.generation++;
  }
  /**
   * The metrics sampler (metrics.ts, layerfs-project#182 D1): one
   * `machine.stats` at a time across the machines that run, each once per
   * 15 s, kept as an hour of history in memory. Started by the routes plugin
   * (index.ts) for as long as dsh runs; `GET /api/metrics` and the stats route
   * answer from it without a LayerFS call.
   */
  metrics = new MetricsSampler({
    // the native daemon is recorded once before the first call, as the router does before every route
    list: async () => {
      await this.host.ensureNative();
      return list2((await this.lfs.machine.list({ detail: true })).items).map((m) => ({ name: String(m?.machine ?? ""), state: text4(m?.state) ?? "ready" }));
    },
    // the abort signal is an SDK-side option of monitoring reads (cli.ts), never a CLI flag
    stats: (name6, signal) => {
      const options = { signal, detail: true };
      return this.lfs.machine.stats(name6, options);
    },
    offered: async () => (await cliFeatures(this.host)).inspect.machineStats
  });
  /** The view with each Sandbox's `live` from the sampler's newest point (absent where it has none). */
  withLive(answer) {
    if (!Array.isArray(answer?.sandboxes)) return answer;
    return { ...answer, sandboxes: answer.sandboxes.map((b) => ({ ...b, ...this.metrics.liveOf(b.name) })) };
  }
  /**
   * MachinesView: concurrent GETs (the sidebar, the machines store, a dialog) share one read.
   * `fresh`: probe the platforms again now (Check again after an install), not within 30 s.
   */
  async view(fresh = false) {
    if (fresh) {
      this.platformAnswer = null;
      this.generation++;
    }
    const kept2 = this.lastViewAt;
    if (kept2 && kept2.generation === this.generation && Date.now() - kept2.at < VIEW_KEEP_MS && this.lastView) return this.withLive(this.lastView);
    if (this.viewing && this.viewing.generation === this.generation) return this.withLive(await this.viewing.promise);
    const generation = this.generation;
    const promise = this.readView().finally(() => {
      if (this.viewing?.promise === promise) this.viewing = null;
    });
    this.viewing = { promise, generation };
    const answer = await promise;
    this.lastViewAt = { at: Date.now(), generation };
    return this.withLive(answer);
  }
  async readView() {
    const lfs = this.lfs;
    const rows2 = list2((await lfs.machine.list({ detail: true })).items);
    const readErrors = {};
    const failed = (name6) => (e) => {
      readErrors[name6] = { error: { code: e?.code ?? "Unknown", message: e?.message ?? String(e), ...fixOf(e) }, at: Date.now() };
      return [];
    };
    let host = null;
    const { version: version2, features } = await this.identity();
    const listSandboxes = (p) => lfs.sandbox.list({ ...p, detail: true });
    const [platforms, listedStores, sandboxes, probes] = await Promise.all([
      this.platforms().then((p) => {
        host = p.host || null;
        return p.platforms;
      }, failed("platforms")),
      lfs.store.list({ detail: true }).then((a) => list2(a?.items), failed("stores")),
      // records only: a row's Workspaces where the home keeps them
      pages(listSandboxes).then((rows3) => rows3.map(sandboxOf), failed("sandboxes")),
      // the live probe of each machine (native's answers its free disk): starts nothing; its answer is the machine's current state.
      // A record LayerFS cannot read is not probed: `machine get` refuses it `Failed` with the same fix its list row carries.
      // (a probe that throws at once is a failed probe like any other: the record's row stands)
      Promise.all(rows2.filter((m) => !unreadableRecord({ state: m?.state, reason: m?.reason, platform: m?.platform })).map((m) => Promise.resolve().then(() => lfs.machine.get(String(m.machine), { detail: true, with: ["live"] })).then((got) => ({ name: String(m.machine), got }), (error2) => ({ name: String(m.machine), error: error2 }))))
    ]);
    const probed = new Map(probes.map((p) => [p.name, p]));
    const machines = rows2.map((m) => machineOf(probedRecord(m, probed.get(String(m.machine))?.got)));
    const live = Object.fromEntries([...probed].map(([name6, p]) => [name6, machineLive(name6, p.got, p.error)]));
    const stores2 = listedStores.map(storeOf).filter(Boolean);
    const postgresql = listedStores.map(pgStoreOf).filter(Boolean);
    const answer = { available: true, readErrors, layerfs: version2, features, computer: computer(host), machines, platforms, stores: stores2, postgresql, sandboxes, live };
    for (const [part, fields2] of Object.entries({ stores: ["stores", "postgresql"], sandboxes: ["sandboxes"], platforms: ["platforms"] })) {
      if (readErrors[part] && this.lastView) for (const field of fields2) answer[field] = this.lastView[field];
    }
    this.lastView = answer;
    return answer;
  }
  /** `home get --with platforms`: each platform on this host but the ones turned off; starts nothing (PlatformsView). */
  async platforms() {
    const now = Date.now();
    if (this.platformAnswer && now - this.platformAnswer.at < 3e4) return this.platformAnswer.value;
    if (this.platformRead) return this.platformRead;
    this.platformRead = this.readPlatforms().then((value) => {
      this.platformAnswer = { at: Date.now(), value };
      return value;
    }).finally(() => {
      this.platformRead = null;
    });
    return this.platformRead;
  }
  async readPlatforms() {
    const answer = (await this.lfs.home.get({ detail: true, with: ["platforms"] }))?.platforms ?? {};
    const rows2 = list2(answer.items).map(platformOf).filter((p) => !OFF.has(p.platform));
    return { host: String(answer.host ?? ""), platforms: rows2.map((p) => ({ ...p, options: p.options.filter((o) => !OFF_OPTIONS.has(o.option)) })) };
  }
  /**
   * `machine get <m> --detail --with live`, with the machine's own broken
   * record state kept over it ({@link probedRecord}). The record is read now
   * (`machine get <m> --detail`, beside the live read), never taken from the
   * last listing: a record fixed outside the page since then must not read
   * broken again (RV4 NOTE 5). A record read that fails leaves the live answer.
   */
  async inspect(name6) {
    const [record, got] = await Promise.all([
      this.lfs.machine.get(name6, { detail: true }).then((r) => r && typeof r === "object" ? r : null, () => null),
      this.lfs.machine.get(name6, { detail: true, with: ["live"] })
    ]);
    return { ...probedRecord(record, got), observedAt: Date.now() };
  }
  /** The monitoring reads' shared state: one read per key, last good answers, page requests that can be cancelled. */
  reads = new InspectReads();
  /**
   * `GET /api/machines/:id/log?before=&limit=&rid=`: the machine's worker log
   * (`machine log`), its last lines without `before`. A 2.0 log pages
   * backwards only (`next_cursor` is `before`): a page that follows it reads
   * the tail again, so a forward `cursor` is refused here. Its own read:
   * never part of the machines view. A refusal (a stopped machine
   * `Unavailable`, a machine without a worker `Unsupported`, a replaced log's
   * cursor `InvalidInput`, a full inspect lane `Busy`, no answer in time
   * `Timeout`) is answered as `stale` with the last good tail, not as an
   * error. 501 while the pinned CLI has no machine.log (the page hides the tab).
   */
  async machineLog(name6, query, outer) {
    if (!name6) throw refuse(400, "InvalidInput", "name the machine");
    if (!(await cliFeatures(this.host)).inspect.machineLog) throw noCall("machine.log", "a machine's worker log");
    if (query.get("cursor")) throw refuse(400, "InvalidInput", "A machine's log pages backwards only: read its tail again, or earlier lines with before.");
    const lfs = this.lfs;
    const request3 = this.reads.request(query.get("rid"), outer);
    try {
      return await this.reads.log(`machine:${name6}`, logQuery(query), (o) => lfs.machine.log(name6, { ...o.before ? { cursor: o.before } : {}, ...o.limit ? { limit: o.limit } : {}, signal: o.signal, detail: true }), request3.signal);
    } finally {
      request3.done();
    }
  }
  /**
   * `GET /api/sandboxes/:name/log?before=&limit=&rid=`: the Sandbox's
   * daemon log (`sandbox log`), as {@link machineLog}. It never waits on
   * sandbox.get and never dials the daemon; a lost or unresolved Sandbox's
   * refusal is answered as `stale`.
   */
  async sandboxLog(name6, query, outer) {
    if (!name6) throw refuse(400, "InvalidInput", "name the Sandbox");
    if (!(await cliFeatures(this.host)).inspect.sandboxLog) throw noCall("sandbox.log", "a Sandbox's daemon log");
    if (query.get("cursor")) throw refuse(400, "InvalidInput", "A Sandbox's log pages backwards only: read its tail again, or earlier lines with before.");
    const lfs = this.lfs;
    const request3 = this.reads.request(query.get("rid"), outer);
    try {
      return await this.reads.log(`sandbox:${name6}`, logQuery(query), (o) => lfs.sandbox.log(name6, { ...o.before ? { cursor: o.before } : {}, ...o.limit ? { limit: o.limit } : {}, signal: o.signal, detail: true }), request3.signal);
    } finally {
      request3.done();
    }
  }
  /**
   * `GET /api/machines/:id/files?path=&depth=&cursor=&limit=&offset=&length=&rid=`:
   * the machine's files (machine.files). Without a path, its roots: LayerFS's
   * own folders by role, then `/` where the machine has that view. With one, a
   * folder page (by `cursor`) or a file window (by `offset`). Its own read, as
   * {@link machineLog}: a refusal (`Unavailable`, `InvalidInput`, `Busy`,
   * `Unsupported`, `Timeout`) is answered inside the view (`stale` on a kept
   * folder page, else `refused`), not as an error. 501 while the pinned CLI
   * has no machine.files (the page hides the tab).
   */
  async machineFiles(name6, query, outer) {
    if (!name6) throw refuse(400, "InvalidInput", "name the machine");
    if (!(await cliFeatures(this.host)).inspect.machineFiles) throw noCall("machine.files", "a machine's files");
    const lfs = this.lfs;
    const request3 = this.reads.request(query.get("rid"), outer);
    const call = (path2, { offset, length, ...o }) => lfs.machine.files(name6, path2, { ...o, ...offset != null ? { byte_offset: offset } : {}, ...length != null ? { byte_length: length } : {}, detail: true });
    try {
      return await this.reads.files(`machine:${name6}`, filesQuery(query), call, request3.signal);
    } finally {
      request3.done();
    }
  }
  /**
   * `GET /api/sandboxes/:name/files?…`: the Sandbox's files (sandbox.files),
   * as {@link machineFiles}. Without a path, its roots: one per Workspace,
   * its home and its log, then `/` where its commands' root can be read. It
   * never waits on sandbox.get and never dials the daemon.
   */
  async sandboxFiles(name6, query, outer) {
    if (!name6) throw refuse(400, "InvalidInput", "name the Sandbox");
    if (!(await cliFeatures(this.host)).inspect.files) throw noCall("sandbox.files", "a Sandbox's files");
    const lfs = this.lfs;
    const request3 = this.reads.request(query.get("rid"), outer);
    const call = (path2, { offset, length, ...o }) => lfs.sandbox.files(name6, path2, { ...o, ...offset != null ? { byte_offset: offset } : {}, ...length != null ? { byte_length: length } : {}, detail: true });
    try {
      return await this.reads.files(`sandbox:${name6}`, filesQuery(query), call, request3.signal);
    } finally {
      request3.done();
    }
  }
  /**
   * `GET /api/machines/:id/stats`: what the machine has and uses now
   * (machine.stats, layerfs-project#164), as the metrics sampler last read it
   * (#182 D1): no LayerFS call. When the sampler's newest point is a gap (a
   * refusal, or a machine that is not running), it is answered as `stale`
   * with the last good values (none: `stats: null`). 501 while the pinned CLI
   * has no machine.stats.
   */
  async machineStats(name6) {
    if (!name6) throw refuse(400, "InvalidInput", "name the machine");
    if (!(await cliFeatures(this.host)).inspect.machineStats) throw noCall("machine.stats", "a machine's observed resources");
    const now = Date.now();
    const kept2 = this.metrics.machine(name6);
    const at = kept2?.latest?.at ?? null, stats = kept2?.latest?.stats ?? null;
    const last = kept2?.last;
    if (last && !last.values) {
      const code2 = last.code ?? "Unknown";
      return { machine: name6, readAt: now, at, stats, stale: { at, code: code2 === STOPPED ? "Unavailable" : code2, message: last.message ?? (code2 === STOPPED ? "The machine is not running; it is not asked." : code2) } };
    }
    return { machine: name6, readAt: now, at, stats, stale: false };
  }
  /** Each machine's last good `machine stats --with space` answer and when it was read (this host's clock). */
  spaceKept = /* @__PURE__ */ new Map();
  /** Each machine's last `machine stats --with space` attempt, good or refused: one read per {@link SPACE_KEEP_MS} unless asked `fresh`. */
  spaceTried = /* @__PURE__ */ new Map();
  /**
   * `GET /api/machines/:id/space?fresh=1`: where the machine's data disk goes
   * (`machine stats --with space`): LayerFS's parts, each Sandbox's run folder and what the
   * disk holds that is not LayerFS's. One bounded walk where the machine's
   * data is, so it is read at most once per {@link SPACE_KEEP_MS} per machine
   * (concurrent callers share one read) unless `fresh=1` (the page's Refresh).
   * A refusal (a stopped machine `Unavailable`, an older worker
   * `InvalidInput`, a full lane `Busy`) is answered as `stale` with the last
   * good answer. 501 while the pinned CLI's machine.stats has no `--with space`.
   */
  async machineSpace(name6, query = new URLSearchParams()) {
    if (!name6) throw refuse(400, "InvalidInput", "name the machine");
    if (!(await cliFeatures(this.host)).machineSpace) throw noCall("machine.stats --with space", "where a machine's disk goes");
    const tried = this.spaceTried.get(name6);
    const answer = () => {
      const kept2 = this.spaceKept.get(name6);
      const last = this.spaceTried.get(name6);
      return { machine: name6, readAt: Date.now(), at: kept2?.at ?? null, space: kept2?.space ?? null, stale: last?.stale ?? false };
    };
    if (tried && query.get("fresh") !== "1" && Date.now() - tried.at < SPACE_KEEP_MS) return answer();
    const lfs = this.lfs;
    try {
      const raw = await this.reads.read(`space:${name6}`, (signal) => {
        const options = { signal, detail: true, with: ["space"] };
        return lfs.machine.stats(name6, options);
      });
      const at = Date.now();
      this.spaceKept.set(name6, { at, space: spaceAnswer(raw) });
      this.spaceTried.set(name6, { at, stale: false });
    } catch (error2) {
      this.spaceTried.set(name6, { at: Date.now(), stale: refusalOf2(error2, this.spaceKept.get(name6)?.at ?? null) });
    }
    return answer();
  }
  /**
   * `GET /api/machines/:id/sandbox-images` (docs/specs/sandbox-images.md
   * §4.1). Never starts a machine or pulls an image. At Stage 0 (the pinned
   * CLI has no machine.images) the ready rows come from the archive a Sandbox
   * on the machine would run, read on this host ({@link archiveRows}), so a
   * stopped machine answers too; `docker` is null and `free` unknown.
   * Default (D7 at Stage 0): the record's digest, else the archive's only
   * image, else the first usable row.
   */
  async sandboxImages(name6) {
    if (!name6) throw refuse(null, "InvalidInput", "name the machine");
    const lfs = this.lfs;
    let record = null;
    try {
      record = await lfs.machine.get(name6, { detail: true });
    } catch (error2) {
      if (error2?.code === "NotFound") throw error2;
    }
    const state = text4(record?.state);
    const platform2 = text4(record?.platform) ?? (BUILT_IN.has(name6) ? name6 : null);
    const stage = (await cliFeatures(this.host)).imageStage;
    const base = { machine: name6, platform: platform2, state: state ?? "unknown", stage: 0, free: null, docker: null, observedAt: Date.now() };
    if (platform2 === "native" && process.platform !== "linux") return { ...base, stage, mode: "host", architecture: null, default: null, stale: false, ready: [] };
    if (stage === 1) return this.stage1Images(name6, base);
    const architecture = linuxArchitecture();
    const own = platform2 === "docker" ? null : text4(record?.image);
    const pinned = own && DIGEST2.test(own) ? own : null;
    let rows2;
    try {
      rows2 = this.archiveRows(record, platform2, architecture);
    } catch (error2) {
      const kept2 = this.keptImages.get(name6);
      const stale = staleOf(error2, kept2?.at ?? Date.now());
      const ready = kept2?.ready ?? [];
      return { ...base, mode: "images", architecture, default: defaultOf(ready, pinned), stale, ready };
    }
    if (rows2.length) {
      const counts = await this.sandboxCounts(name6);
      rows2 = rows2.map((r) => ({ ...r, sandboxes: counts.get(r.id) ?? 0 }));
    }
    this.keptImages.set(name6, { at: base.observedAt, ready: rows2 });
    return { ...base, mode: "images", architecture, default: defaultOf(rows2, pinned), stale: false, ready: rows2 };
  }
  /** The last good answer per machine (memory only): a later failed read answers it as `stale`. */
  keptImages = /* @__PURE__ */ new Map();
  /**
   * Stage 1 (§4.1): one machine.images read (a kept read, 5 s) answers it
   * all: `images` are the ready rows, `free` the data disk, `default`, and
   * `docker` + `available` the "From Docker" group, which LayerFS lists,
   * dedupes and sizes itself. The plugin never reads Docker. A machine that
   * cannot answer (stopped: `Unavailable`) answers the last good answer kept
   * for it, marked `stale`, or none.
   */
  async stage1Images(name6, base) {
    let ready;
    let free;
    let own;
    let docker;
    let architecture = linuxArchitecture();
    let stale = false;
    try {
      const answer = await this.lfs.machine.images(name6, { detail: true, with: ["docker"] });
      if (answer?.mode === "host") return { ...base, stage: 1, free: null, docker: null, mode: "host", architecture: null, default: null, stale: false, ready: [] };
      const items = Array.isArray(answer?.items) ? answer.items : [];
      ready = items.map(readyOf).filter((r) => !!r);
      free = num3(answer?.disk_free_bytes);
      own = text4(items.find((i) => i?.default === true)?.image);
      docker = dockerOf(answer);
      architecture = text4(answer?.architecture) ?? architecture;
      this.keptImages.set(name6, { at: base.observedAt, ready, free, default: own, docker });
    } catch (error2) {
      if (error2?.code === "NotFound") throw error2;
      const kept2 = this.keptImages.get(name6);
      stale = staleOf(error2, kept2?.at ?? base.observedAt);
      ready = kept2?.ready ?? [];
      free = kept2?.free ?? null;
      own = kept2?.default ?? null;
      docker = kept2?.docker ?? null;
    }
    return { ...base, stage: 1, mode: "images", architecture, free, default: defaultOf(ready, own), stale, ready, docker };
  }
  /**
   * The Stage-1 disk precheck of a create (§4.1, D8): `{ need, free }` when
   * `image` is a Docker image that is not ready on `machine` and its copy
   * does not fit in the machine's free space; null when it fits, is ready,
   * or anything is unknown (LayerFS's own Capacity refusal is the real answer).
   */
  async spaceFor(machine, image) {
    try {
      const view = await this.sandboxImages(machine);
      if (view.stage !== 1 || view.stale || view.free == null) return null;
      if (view.ready.some((r) => r.id === image || r.refs.includes(image))) return null;
      const row = view.docker?.available ? view.docker.images.find((r) => r.id === image || r.refs.includes(image)) : void 0;
      return row && row.need > view.free ? { need: row.need, free: view.free } : null;
    } catch {
      return null;
    }
  }
  /** Sandboxes on `machine` per recorded image id (`sandbox list --machine --detail`: `machine` and `image` are long-only; 0 each when it cannot be read). */
  async sandboxCounts(machine) {
    const counts = /* @__PURE__ */ new Map();
    try {
      for (const b of (await pages((p) => this.lfs.sandbox.list({ machine, ...p, detail: true }))).map(sandboxOf)) {
        if (b.machine === machine && b.image) counts.set(b.image, (counts.get(b.image) ?? 0) + 1);
      }
    } catch {
    }
    return counts;
  }
  /**
   * The Stage-0 ready rows: the images of the archive LayerFS picks a
   * Sandbox's root from (layerfs-sandbox `deploy::choose`) — the machine's
   * own archive (`image_archive`, or an `image` path; never on docker), else
   * the pinned Linux bundle's `sandbox-image.tar`. Read through the archive
   * memo (path, size, mtime), so no GET parses a tar again. An image the
   * archive shows LayerFS cannot run is `usable: false` with the reason.
   * Throws when the archive cannot be read; no archive at all is no rows.
   */
  archiveRows(record, platform2, architecture) {
    const own = platform2 === "docker" ? null : text4(record?.image);
    const mine = platform2 === "docker" ? null : text4(record?.image_archive) ?? (own?.startsWith("/") ? own : null);
    const bundle = this.host.bundle?.() ?? null;
    const archive = mine ?? (bundle ? join20(bundle, "sandbox-image.tar") : null);
    if (!archive) return [];
    const source = mine ? "machine" : "bundle";
    return readArchive(archive).map((i) => {
      const reason = i.os && i.os !== "linux" ? { kind: "os", value: i.os } : i.architecture && i.architecture !== architecture ? { kind: "arch", value: i.architecture } : i.problem ? { kind: i.problem } : void 0;
      return {
        id: i.digest,
        name: imageName(i.tags) ?? (source === "bundle" ? BUNDLE_NAME : i.digest.slice(7, 19)),
        refs: i.tags,
        size: i.size,
        source,
        sandboxes: 0,
        lastUsed: null,
        usable: !reason,
        ...reason ? { reason } : {}
      };
    });
  }
  /**
   * `POST /api/machines/:id/prune-images { images?: id[], unused?: boolean }`
   * (§4.1): `machine prune` once per id, or once with `--unused`, in the long
   * form (`removed`, `freed_bytes`). An image LayerFS keeps (InUse, gone) is
   * listed in `refused`, not an error of the request. 501 while the pinned
   * CLI has no machine.prune.
   */
  async pruneImages(name6, body) {
    if (!name6) throw refuse(null, "InvalidInput", "name the machine");
    if (!(await cliFeatures(this.host)).imagePrune) {
      throw Object.assign(refuse(501, "Unsupported", "The pinned LayerFS CLI cannot remove a machine's images (it has no machine.prune)."), { detail: { need: "image-prune" } });
    }
    const unused = body?.unused === true;
    const ids = [...new Set(refsOf(body?.images))];
    if (!unused && !ids.length) throw refuse(400, "InvalidInput", "Name the images to remove, or ask for the unused ones.");
    const answer = { removed: [], freed: 0, refused: [] };
    const take = (r) => {
      for (const id of refsOf(r?.removed)) if (!answer.removed.includes(id)) answer.removed.push(id);
      answer.freed += num3(r?.freed_bytes) ?? 0;
      for (const k of Array.isArray(r?.skipped) ? r.skipped : []) if (text4(k?.image)) answer.refused.push({ id: k.image, code: "Skipped", message: text4(k.message) ?? "kept" });
    };
    if (unused) take(await this.lfs.machine.prune(name6, { unused: true, detail: true }));
    for (const id of ids) {
      try {
        take(await this.lfs.machine.prune(name6, id, { detail: true }));
      } catch (error2) {
        if (!PRUNE_PER_IMAGE.has(error2?.code)) throw error2;
        answer.refused.push({ id, code: error2.code, message: error2?.message ?? String(error2), ...fixOf(error2) });
      }
    }
    return answer;
  }
  /** Image copies running in the background (`image-load` events); a copy that ends drops the machine's kept images answer. */
  loads = new ImageLoads((type, data) => this.host.emit(type, data), (machine) => {
    this.keptImages.delete(machine);
  });
  /**
   * `POST /api/machines/:id/load-image { image }`: copies one image of this
   * computer's Docker (its Id or a ref) to the machine with `machine
   * load-image`, without creating a Sandbox, in the background: `202 { load }`
   * at once, then `image-load` events (its `{ phase, done, total }` progress:
   * inspect, export, send, unpack). A copy of the same image already running
   * is answered instead of a second one. 501 while the pinned CLI has no
   * machine.load_image. Never starts the machine (a stopped one is refused by LayerFS).
   */
  async loadImage(name6, body) {
    if (!name6) throw refuse(null, "InvalidInput", "name the machine");
    const image = text4(body?.image);
    if (!image || image.includes("\0")) throw refuse(400, "InvalidInput", "name the Docker image to copy (its Id or a ref)");
    const features = await cliFeatures(this.host);
    if (!features.imageLoad) {
      throw Object.assign(refuse(501, "Unsupported", "The pinned LayerFS CLI cannot copy an image to a machine (it has no machine.load_image)."), { detail: { need: "image-load" } });
    }
    const running = this.loads.running(name6, image);
    if (running) return new Answer(202, { load: running });
    const run2 = (report) => this.lfs.machine.load_image(name6, image, { detail: true, on_progress: (p) => {
      const u = createPhase(p);
      if (u && u.phase !== "start" && u.phase !== "mount") report(u);
    } });
    return new Answer(202, { load: this.loads.admit(name6, image, run2) });
  }
  /**
   * `machine start <m> --progress`: a stopped machine and its worker, waited
   * for (phases bundle, image, boot, worker); a running one answers
   * `{ unchanged: true }` at once. A lost reply leaves it `broken`,
   * `unresolved`, which the next view's live read settles.
   */
  async start(name6) {
    if (!name6) throw refuse(null, "InvalidInput", "name the machine to start");
    const report = this.progress(name6, "start");
    await this.engineFirst(name6, report);
    try {
      return await this.lfs.machine.start(name6, { on_progress: report, detail: true });
    } finally {
      this.platformsChanged();
      this.metrics.relist();
    }
  }
  /**
   * An outdated worker's fix (R2, review fix 5): `machine stop <m>` then
   * `machine start <m>`, one attempt each; refused before anything runs while
   * Sandboxes are on the machine (their stop needs `--force`, which this host
   * never sends for a fix).
   */
  async restart(name6) {
    if (!name6) throw refuse(null, "InvalidInput", "name the machine to restart");
    const m = machineOf(await this.lfs.machine.get(name6, { detail: true }));
    if (m.sandboxes.length) throw refuse(409, "InUse", `${m.sandboxes.length} Sandbox${m.sandboxes.length === 1 ? " is" : "es are"} on ${name6}; copy the fix to stop it anyway`);
    await this.stop(name6);
    return this.start(name6);
  }
  /** The Docker Engine launch in flight, shared by concurrent starts. */
  engine = null;
  /** What the Engine launch reaches outside (fakes in tests). */
  engineDeps = realEngineDeps;
  /**
   * A docker machine on macOS whose platform is not ready only because the
   * Docker Engine does not answer at its socket: launch the Engine and wait
   * for it (docker-engine.ts), then read the platforms anew. Any other machine,
   * OS or missing need goes straight to machine.start, which refuses as before.
   */
  async engineFirst(name6, report) {
    const socket = await this.engineSocketOf(name6);
    if (!socket) return;
    this.engine ??= startEngine(socket, this.engineDeps(), report).finally(() => {
      this.engine = null;
      this.platformsChanged();
      this.changed();
    });
    await this.engine;
  }
  /** The socket whose Engine must be started before `name` can start, or null; a read that fails is null (machine.start answers as before). */
  async engineSocketOf(name6) {
    try {
      const known4 = Array.isArray(this.lastView?.machines) ? this.lastView.machines.find((m) => m.name === name6) : void 0;
      const platform2 = known4?.platform ?? text4((await this.lfs.machine.get(name6, { detail: true }))?.platform);
      if (platform2 !== "docker") return null;
      const view = await this.platforms();
      if (computer(view.host).os !== "macos") return null;
      return engineSocket(view.platforms.find((p) => p.platform === "docker"));
    } catch {
      return null;
    }
  }
  /** Phases (`{ phase, done, total }`) as `machine-progress` events (the Machines page shows them live). */
  progress(name6, kind) {
    const started = Date.now();
    return (progress) => this.host.emit("machine-progress", {
      type: "machine-progress",
      name: name6,
      kind,
      progress: { ...progress && typeof progress === "object" ? progress : { stage: String(progress) }, elapsed_ms: Date.now() - started }
    });
  }
  /** Normal stop preserves InUse refusals; explicit force ends running work. */
  async stop(name6, { force = false } = {}) {
    if (!name6) throw refuse(null, "InvalidInput", "name the machine to stop");
    if (force && !(await cliFeatures(this.host)).forceStop) throw refuse(501, "Unsupported", "The pinned LayerFS CLI has no forced stop (machine.stop takes no force option). Stop the machine normally, or pin a CLI that has it.");
    const result = await this.lfs.machine.stop(name6, { ...force ? { force: true } : {}, on_progress: this.progress(name6, "stop"), detail: true }).finally(() => this.platformsChanged());
    this.metrics.relist();
    await this.host.machinesStopped?.([name6]);
    return result;
  }
  /** The options `platform` declares for machine.create (`home get --with platforms`), or null when unknown. */
  async declared(platform2) {
    const row = (await this.platforms().catch(() => null))?.platforms.find((p) => p.platform === platform2);
    return row ? row.options.map((o) => o.option) : null;
  }
  /** A VM: { name, platform, cpus?, memory?, disk?, image? (its Sandbox image), os_image? }. */
  async create(body) {
    const { name: name6, platform: platform2, ...rest } = body ?? {};
    if (!name6 || !platform2) throw refuse(null, "InvalidInput", "a machine needs a name and a platform");
    if (OFF.has(platform2)) throw refuse(null, "Unsupported", `${platform2} machines are turned off`);
    const declared = await this.declared(platform2) ?? ["cpus", "memory", "disk", "image"];
    const given = pick(rest, Object.keys(rest));
    const extra = Object.keys(given).filter((k) => !declared.includes(k));
    if (extra.length) throw refuse(null, "InvalidInput", `${platform2} takes no ${extra.join(", ")} (its options: ${declared.join(", ") || "none"})`);
    try {
      return await this.lfs.machine.create(name6, platform2, { ...given, on_progress: this.progress(name6, "create"), detail: true });
    } finally {
      this.platformsChanged();
      this.metrics.relist();
    }
  }
  /**
   * Removes a VM; LayerFS refuses InUse while it holds Stores or running
   * Sandboxes. A built-in is LayerFS's to refuse: it removes one only as the
   * fix of a record with no vm_name (`layerfs machine remove docker`: its
   * record goes and the built-in comes back fresh), so the page only sends it
   * as that fix.
   */
  async remove(name6) {
    const lfs = this.lfs;
    try {
      return await lfs.machine.remove(name6, { on_progress: this.progress(name6, "remove"), detail: true });
    } finally {
      this.platformsChanged();
      this.metrics.relist();
    }
  }
  /** A built-in's settings ({ image, docker, wsl }); a VM's `cpus`/`memory` are refused `Unsupported` by LayerFS 2.0 (no resizing; there is no `disk`). */
  async update(name6, body) {
    const changes = pick(body ?? {}, ["cpus", "memory", "image", "docker", "wsl"]);
    if (body?.disk != null) throw refuse(400, "InvalidInput", "A machine's disk cannot be changed (LayerFS 2.0 resizes nothing).");
    if (body?.docker === "") changes.docker = "";
    try {
      return await this.lfs.machine.update(name6, { ...changes, detail: true });
    } finally {
      this.platformsChanged();
    }
  }
  /** A machine write or an Engine start: the platforms (docker's socket, a VM tool) are probed again on the next read. */
  platformsChanged() {
    this.platformAnswer = null;
  }
  /** Puts a sqlite Store on `machine`: a job in the host's table (its progress shows on Storage). */
  /** @param made - the Store was just made by a New Store dialog (the job's words say so). */
  async moveStore(store, machine, made = false) {
    if (!store || !machine) throw refuse(null, "InvalidInput", "name the Store and the machine");
    if (!this.place) throw refuse(null, "Unsupported", "this host has no Storage job table to push or pull with");
    return this.place(store, machine, made);
  }
};
function defaultOf(rows2, pinned) {
  const usable = rows2.filter((r) => r.usable);
  const used = usable.filter((r) => r.lastUsed && Number.isFinite(Date.parse(r.lastUsed))).sort((a, b) => Date.parse(b.lastUsed) - Date.parse(a.lastUsed));
  if (used.length) return used[0].id;
  if (pinned && usable.some((r) => r.id === pinned)) return pinned;
  if (rows2.length === 1 && rows2[0].usable) return rows2[0].id;
  return usable[0]?.id ?? null;
}

// src/host/routes/storage.ts
import { randomUUID as randomUUID10 } from "node:crypto";
import { chmodSync as chmodSync6, existsSync as existsSync15, mkdirSync as mkdirSync17, renameSync as renameSync14, rmSync as rmSync7, rmdirSync } from "node:fs";
import { join as join23 } from "node:path";

// src/host/routes/jobs.ts
import { mkdirSync as mkdirSync15, readFileSync as readFileSync17, renameSync as renameSync12, writeFileSync as writeFileSync14 } from "node:fs";
import { join as join21 } from "node:path";
var COMPACT_STEPS = { sqlite: ["mark", "build", "verify", "install"], postgresql: ["mark", "build", "swap", "cleanup"] };
function failureOutcome(error2, phase) {
  if (error2?.code === "Unknown" || error2?.transport && error2.transport !== "refusal" || ["install", "record"].includes(phase ?? "")) return "unknown";
  if (error2?.code === "Interrupted") return "interrupted";
  return "failed";
}
function transferSummary(job) {
  if (job.outcome === "unknown") return "Outcome unknown \xB7 Inspect";
  if (job.outcome === "interrupted") return "Interrupted \xB7 Final result unavailable";
  if (!job.error) return null;
  if (job.phase === "retire") return job.kind === "pull" || job.half === "pull" ? "On Home; source copy not removed" : `Moved to ${job.target}; old copy on Home not removed`;
  if (job.kind === "move" && job.half === "push") return "Pulled to Home; push failed (certain)";
  return null;
}
async function inspectJob(lfs, job) {
  const at = Date.now();
  const live = () => lfs.store.get(job.store, { detail: true, with: ["live"] });
  if (job.kind === "backup") return { at, kind: "backup", value: await lfs.backup.list({ bucket: job.target, detail: true }), action: null };
  if (job.kind === "restore") return { at, kind: "restore", value: await live(), action: null };
  if (job.kind === "compact") return { at, kind: "compact", value: await live(), action: null };
  const status = await live();
  const direction = job.kind === "move" ? job.half ?? "pull" : job.kind;
  const machine = direction === "pull" ? job.from : job.target;
  let action = null;
  if (status?.state === "ready" && job.outcome === "failed" && job.phase !== "retire") action = "retry";
  if (status?.state === "broken" && status?.reason === "unresolved" && typeof status?.fix === "string" && /^layerfs store move /.test(status.fix) && machine) {
    const target = await lfs.machine.get(machine, { detail: true, with: ["live"] });
    if ((target?.state ?? "ready") === "ready" && !target?.op) action = "resolve";
  }
  return { at, kind: "transfer", value: status, direction, action };
}
var JobStore = class {
  file;
  jobs = /* @__PURE__ */ new Map();
  constructor(directory) {
    this.file = directory ? join21(directory, "storage-jobs.json") : null;
    if (!directory || !this.file) return;
    mkdirSync15(directory, { recursive: true, mode: 448 });
    let records;
    try {
      records = JSON.parse(readFileSync17(this.file, "utf8"));
    } catch (error2) {
      if (error2.code === "ENOENT") return;
      throw new Error(`Storage job records could not be read: ${error2.message}`);
    }
    if (!Array.isArray(records)) throw new Error("Storage job records are malformed");
    for (const record of records) {
      if (!record.ended) Object.assign(record, { ended: Date.now(), outcome: "interrupted", error: { code: "Interrupted", message: "Host restarted; final result unavailable. Remote work may still finish.", phase: record.phase, detail: null }, recovery: null });
      this.jobs.set(record.id, record);
    }
    this.save();
  }
  save() {
    if (!this.file) return;
    const records = [...this.jobs.values()];
    while (records.length > 30) {
      const at = records.findIndex((j) => j.ended);
      if (at < 0) break;
      this.jobs.delete(records[at].id);
      records.splice(at, 1);
    }
    writeFileSync14(`${this.file}.tmp`, stringify(records), { mode: 384 });
    renameSync12(`${this.file}.tmp`, this.file);
  }
};

// src/host/routes/store-sizes.ts
import { mkdirSync as mkdirSync16, readFileSync as readFileSync18, renameSync as renameSync13, writeFileSync as writeFileSync15 } from "node:fs";
import { join as join22 } from "node:path";
var StoreSizes = class {
  kept = null;
  path;
  now;
  constructor(dir, now = Date.now) {
    this.path = join22(dir, "store-sizes.json");
    this.now = now;
  }
  load() {
    if (this.kept) return this.kept;
    try {
      const value = JSON.parse(readFileSync18(this.path, "utf8"));
      this.kept = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch {
      this.kept = {};
    }
    return this.kept;
  }
  /**
   * Each listed Store's size: the one read now (kept), else the last kept one
   * marked stale. `read` holds null where the list had no size.
   */
  answer(rows2) {
    const kept2 = this.load();
    const at = this.now();
    let changed = false;
    const listed = new Set(rows2.map((r) => r.name));
    for (const name6 of Object.keys(kept2)) if (!listed.has(name6)) {
      delete kept2[name6];
      changed = true;
    }
    const out = rows2.map(({ name: name6, size }) => {
      if (size) {
        const old2 = kept2[name6];
        if (!old2 || old2.bytes !== size.bytes || at - old2.at > 6e4) {
          kept2[name6] = { ...size, at };
          changed = true;
        }
        return size;
      }
      const old = kept2[name6];
      return old ? { bytes: old.bytes, seen: old.at, stale: true } : null;
    });
    if (changed) this.save();
    return out;
  }
  save() {
    try {
      mkdirSync16(join22(this.path, ".."), { recursive: true, mode: 448 });
      const tmp = `${this.path}.${process.pid}.tmp`;
      writeFileSync15(tmp, JSON.stringify(this.kept), { mode: 384 });
      renameSync13(tmp, this.path);
    } catch {
    }
  }
};

// src/host/routes/storage.ts
var KEEP_JOBS = 30;
var JOIN_MS = 15e3;
var CHECK_TIMEOUT_MS = 3e4;
function checkName(value, what) {
  if (typeof value !== "string" || !/^[a-z0-9](?:[a-z0-9_.-]{0,61}[a-z0-9])?$/.test(value)) throw refuse(400, "InvalidInput", `${what} needs a lowercase name (maximum 63 characters), starting and ending with a letter or number`);
}
function checkUrl(value, what) {
  let url;
  try {
    url = new URL(String(value));
  } catch {
    throw refuse(400, "InvalidInput", `${what} is not a URL`);
  }
  if (url.password || url.username) throw refuse(400, "InvalidInput", `${what} must not hold a user or password: they are given apart`);
  if ([...url.searchParams.keys()].some((k) => loginParameter(k))) throw refuse(400, "InvalidInput", `${what} must not carry a user, a password or a password file: give the login apart`);
}
var loginParameter = (name6) => {
  const n = name6.toLowerCase();
  return n === "user" || n === "passfile" || n.includes("password");
};
function pgLoginName(url) {
  const where = pgWhere(url);
  if (!where) return null;
  const name6 = `pg-${where.server}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "").slice(0, 63).replace(/-+$/, "");
  return /^[a-z0-9](?:[a-z0-9_.-]{0,61}[a-z0-9])?$/.test(name6) ? name6 : null;
}
function reachOf(r) {
  if (!r || typeof r !== "object") return null;
  return { at: msAt(r.at), ok: r.ok === true, latencyMs: typeof r.latency_ms === "number" ? r.latency_ms : null, version: typeof r.server_version === "string" ? r.server_version : null, error: typeof r.error === "string" ? r.error : null };
}
function connectionRows(s) {
  return (Array.isArray(s?.connections) ? s.connections : []).filter((c) => c && typeof c === "object").map((c) => {
    const server = c.server && typeof c.server === "object" ? { host: String(c.server.host ?? ""), port: typeof c.server.port === "number" ? c.server.port : Number(c.server.port) || null, database: typeof c.server.database === "string" ? c.server.database : null } : null;
    const reached = c.reached === "ok" || c.reached === "failed" ? c.reached : null;
    return { machine: typeof c.machine === "string" ? c.machine : null, url: typeof c.url === "string" ? c.url : null, own: c.own === true, server, reached, reach: reachOf(c.reach) };
  });
}
function bucketUrl({ provider, endpoint, account, jurisdiction, bucket, prefix } = {}) {
  const path2 = [bucket, ...prefix ? [String(prefix).replace(/^\/+|\/+$/g, "")] : []].filter(Boolean).join("/");
  if (!bucket) throw refuse(400, "InvalidInput", "Name the bucket");
  if (provider === "r2") {
    if (!/^[0-9a-f]{32}$/.test(account ?? "")) throw refuse(400, "InvalidInput", "A Cloudflare account id is 32 lowercase hex digits");
    return `r2://${account}/${path2}${jurisdiction ? `?jurisdiction=${jurisdiction}` : ""}`;
  }
  if (provider === "minio") {
    if (!/^https?:\/\//.test(endpoint ?? "")) throw refuse(400, "InvalidInput", "A MinIO endpoint is http(s)://host:port");
    return `${String(endpoint).replace(/\/+$/, "")}/${path2}`;
  }
  throw refuse(400, "InvalidInput", "Choose MinIO or Cloudflare R2");
}
function pgTarget(url) {
  try {
    const u = new URL(url);
    return `${u.username ? `${decodeURIComponent(u.username)}@` : ""}${u.host}${u.pathname}`;
  } catch {
    return null;
  }
}
function pgWhere(url) {
  if (typeof url !== "string") return null;
  try {
    const u = new URL(url);
    if (!/^postgres(ql)?:$/.test(u.protocol) || !u.hostname) return null;
    const database = decodeURIComponent(u.pathname.replace(/^\//, "")) || null;
    return { server: `${u.hostname.toLowerCase()}:${u.port || "5432"}`, database, user: u.username ? decodeURIComponent(u.username) : null };
  } catch {
    return null;
  }
}
function moveLegacyStorageState(home, jobDir, statDir) {
  const legacy = join23(home, "dsh-layerfs");
  if (!existsSync15(legacy)) return;
  const moves = [["storage-jobs.json", jobDir], ["doctor-jobs.json", jobDir], ["storage-observations", statDir], ["project-storage", statDir]];
  for (const [name6, dir] of moves) {
    try {
      if (!existsSync15(join23(legacy, name6))) continue;
      if (existsSync15(join23(dir, name6))) {
        rmSync7(join23(legacy, name6), { recursive: true, force: true });
        continue;
      }
      mkdirSync17(dir, { recursive: true, mode: 448 });
      renameSync14(join23(legacy, name6), join23(dir, name6));
    } catch {
    }
  }
  try {
    rmdirSync(legacy);
  } catch {
  }
}
function storeRow(s, jobs) {
  const kind = s.engine === "postgresql" ? "postgresql" : "sqlite";
  const rows2 = kind === "postgresql" ? connectionRows(s) : [];
  const home = rows2.find((c) => c.machine === null)?.url ?? null;
  const where = pgWhere(home);
  const names = (Array.isArray(s.projects) ? s.projects : []).map(String);
  return {
    name: String(s.store),
    kind,
    machine: typeof s.machine === "string" ? s.machine : null,
    projects: names,
    projectsCount: typeof s.projects_count === "number" ? s.projects_count : names.length,
    created: msAt(s.created_at),
    size: typeof s.size === "number" ? { bytes: s.size } : null,
    state: typeof s.state === "string" ? s.state : "ready",
    op: opOf(s.op),
    ...companionsOf(s),
    links: (Array.isArray(s.backups) ? s.backups : []).filter((b) => typeof b?.bucket === "string").map((b) => ({
      bucket: b.bucket,
      file: typeof b.file === "string" ? b.file : String(s.store),
      last: b.last && typeof b.last === "object" ? { op: String(b.last.call ?? ""), at: msAt(b.last.ended_at), bytes: typeof b.last.size === "number" ? b.last.size : null } : null,
      attempt: b.attempt && typeof b.attempt === "object" ? { op: String(b.attempt.call ?? ""), at: msAt(b.attempt.ended_at), error: b.attempt.error ?? null } : null
    })),
    job: jobs.find((j) => j.store === s.store && !j.ended)?.id ?? null,
    postgresql: kind === "postgresql" ? {
      auth: typeof s.auth === "string" ? s.auth : null,
      url: home,
      target: home ? pgTarget(home) : null,
      server: where?.server ?? null,
      database: where?.database ?? null,
      synchronousCommit: typeof s.synchronous_commit === "string" ? s.synchronous_commit : null,
      binding: typeof s.binding === "string" ? s.binding : null
    } : null,
    // PostgreSQL: every side that connects (this computer first), and the machines with an address of their own
    connectedFrom: rows2,
    ownConnections: rows2.filter((c) => c.machine !== null && c.own && c.url).map((c) => ({ machine: c.machine, url: c.url, target: pgTarget(c.url) }))
  };
}
var notListedError = (n) => ({ code: String(n?.reason ?? "lost"), message: String(n?.message ?? "the bucket could not be listed"), ...typeof n?.fix === "string" && n.fix ? { fix: n.fix } : {} });
function pgCheckError(report, record, from, reachError) {
  const findings = Array.isArray(report?.findings) ? report.findings : [];
  const recordFinding = findings.find((f) => f?.check === "store.record" && f?.severity === "error");
  const recordFix = typeof recordFinding?.fix === "string" && recordFinding.fix || typeof record?.fix === "string" && record.fix || void 0;
  const brokenRecord = record?.state === "broken" && (record?.reason === "outdated" || record?.reason === "missing");
  if (recordFinding || brokenRecord) {
    const message2 = String(recordFinding?.message ?? reachError ?? "the Store record needs attention");
    const outdated = record?.reason === "outdated" || /\boutdated\b/i.test(message2);
    const missing2 = !outdated && (record?.reason === "missing" || /\bmissing\b/i.test(message2));
    return {
      code: outdated ? "Outdated" : missing2 ? "NotFound" : "Failed",
      message: message2,
      ...recordFix ? { fix: recordFix } : {},
      step: "record"
    };
  }
  const connFinding = findings.find((f) => f?.check === "store.connection" && (f?.from ?? null) === from);
  const evidenceStep = typeof connFinding?.evidence?.step === "string" ? connFinding.evidence.step : void 0;
  const fix = typeof connFinding?.fix === "string" && connFinding.fix ? connFinding.fix : void 0;
  const message = String(reachError ?? connFinding?.message ?? "the check failed");
  const withFix = (code2, step) => ({ code: code2, message, ...fix ? { fix } : {}, ...step ? { step } : {} });
  if (evidenceStep === "authentication") return withFix("Denied", "authentication");
  if (evidenceStep === "database") return withFix("NotFound", "database");
  if (evidenceStep === "transport" || evidenceStep === "handshake") return withFix("Unavailable", "transport");
  if (evidenceStep === "login") return withFix(/\bno saved login\b/i.test(message) ? "Outdated" : "NotFound", "record");
  if (/\black(s)?\b/i.test(message)) return withFix("Denied", /\bUSAGE\s+on\s+schema\b/i.test(message) ? "store" : "write");
  if (message.includes("holds another Store than")) return withFix("Unavailable", "store");
  if (/\bRejected\b/i.test(message)) return withFix("Rejected", "authentication");
  if (/password authentication failed|authentication failed|SQLSTATE 28/i.test(message)) return withFix("Denied", "authentication");
  if (/PostgreSQL server refused the connection/i.test(message)) return withFix("Denied");
  if (/cannot reach PostgreSQL Store|PostgreSQL server unreachable|did not answer|timed out|connection refused|no connection to the server|resolves host\.docker\.internal to no IPv4|ECONNREFUSED|ETIMEDOUT|EHOSTUNREACH|ENETUNREACH/i.test(message)) {
    return withFix("Unavailable", "transport");
  }
  return withFix("Failed");
}
var Storage = class {
  /** @param host - the route dependencies. */
  constructor(host) {
    this.host = host;
    moveLegacyStorageState(host.home, host.jobs, host.stats);
    for (const dir of [host.jobs, host.stats, join23(host.stats, "storage-observations"), join23(host.stats, "project-storage")]) {
      mkdirSync17(dir, { recursive: true, mode: 448 });
      chmodSync6(dir, 448);
    }
    this.sizes = new StoreSizes(host.stats);
    this.jobStore = new JobStore(host.jobs);
    this.jobs = this.jobStore.jobs;
    this.reconciled = Promise.resolve().then(async () => {
      for (const job of this.jobs.values()) if (job.outcome === "interrupted") {
        try {
          await this.inspect(job.id);
        } catch (error2) {
          job.reconcileError = { code: error2?.code ?? "Failed", message: error2?.message };
          this.jobStore.save();
        }
      }
    });
  }
  host;
  jobStore;
  jobs;
  /** bucket name -> its last backup.list */
  listings = /* @__PURE__ */ new Map();
  lastView = null;
  /** The StorageView read in flight, shared by concurrent callers; a write (`changed`) bumps `generation` so later callers read anew. */
  viewing = null;
  generation = 0;
  /** The last size each Store was read at: a Store on a machine that does not answer shows it (store-sizes.ts). */
  sizes;
  reconciled;
  get lfs() {
    return this.host.lfs();
  }
  event(e) {
    this.host.emit(e.type, wire(e));
  }
  log(line) {
    this.host.log(line);
  }
  changed() {
    this.lastView = null;
    this.generation++;
    this.event({ type: "storage" });
  }
  /** The buckets connected to this LayerFS home, by any client: `home get --with tree` (records only). */
  async bucketRows(probe) {
    const tree = (await this.lfs.home.get({ with: ["tree"], ...probe }))?.tree;
    if (!tree) return null;
    const text6 = (v) => typeof v === "string" && v ? { value: v } : null;
    return (Array.isArray(tree?.buckets) ? tree.buckets : []).filter((b) => typeof b?.bucket === "string").map((b) => {
      const out = { name: b.bucket, provider: typeof b.provider === "string" ? b.provider : null };
      for (const key of ["url", "state", "reason", "fix", "message"]) {
        const v = text6(b[key]);
        if (v && !(key === "state" && v.value === "ready")) out[key] = v.value;
      }
      return out;
    });
  }
  /** StorageView: concurrent reads (the project list's join, the Storage page) share one. */
  view(fresh = false) {
    if (fresh) this.generation++;
    if (this.viewing && this.viewing.generation === this.generation) return this.viewing.promise;
    const generation = this.generation;
    const promise = this.readView(generation, fresh).finally(() => {
      if (this.viewing?.promise === promise) this.viewing = null;
    });
    this.viewing = { promise, generation };
    return promise;
  }
  async readView(generation, fresh) {
    const probe = fresh ? { timeout_ms: READ_TIMEOUT_MS } : {};
    const [listed, machines, bucketRecords, auths] = await Promise.all([
      this.lfs.store.list({ ...probe, detail: true, with: ["stats"] }),
      machineRows(this.lfs),
      this.bucketRows(probe).catch((error2) => (this.log(`[storage] home get --with tree: ${error2?.message ?? error2}`), null)),
      this.auths().catch((error2) => (this.log(`[storage] store auths: ${error2?.message ?? error2}`), { items: [] }))
    ]);
    const items = listed?.items ?? [];
    const jobs = this.jobList();
    const stores2 = items.map((s) => storeRow(s, jobs));
    await Promise.all(stores2.filter((s) => s.projectsCount > s.projects.length).map(async (s) => {
      const all = await pages((p) => this.lfs.project.list({ ...probe, store: s.name, ...p })).catch((error2) => (this.log(`[storage] project list --store ${s.name}: ${error2?.message ?? error2}`), null));
      if (all) s.projects = all.map((r) => String(r?.project ?? "")).filter(Boolean).map((key) => key.slice(key.indexOf("/") + 1));
    }));
    const sqlite = stores2.filter((s) => s.kind === "sqlite");
    const sizes = this.sizes.answer(sqlite.map((s) => ({ name: s.name, size: s.size ? { bytes: s.size.bytes } : null })));
    sqlite.forEach((s, i) => {
      s.size = sizes[i] ?? null;
    });
    const recorded = bucketRecords ?? [];
    const names = /* @__PURE__ */ new Set([...recorded.map((b) => b.name), ...stores2.flatMap((s) => s.links.map((l) => l.bucket))]);
    const buckets = [...names].sort().map((name6) => {
      const listing = this.listings.get(name6);
      const record = recorded.find((b) => b.name === name6);
      const own = record?.state ? { state: record.state, reason: record.reason ?? null, fix: record.fix ?? null, message: record.message ?? null } : {};
      return { name: name6, provider: record?.provider ?? null, ...record?.url ? { url: record.url } : {}, ...own, listed: listing?.at ?? null, files: listing?.items ?? null, error: listing?.error ?? null, stores: stores2.filter((s) => s.links.some((l) => l.bucket === name6)).map((s) => s.name) };
    });
    const view = {
      machines: machines.map((m) => ({ name: m.name, platform: m.platform, state: m.state, supports: m.supports })),
      // this computer (the native machine): its OS names it
      computer: computer(),
      stores: stores2,
      // the saved PostgreSQL logins (store auths), with those no Store names: the PostgreSQL tab groups by them (spec v23 V23-1)
      auths: auths.items,
      buckets,
      bucketInventoryComplete: bucketRecords !== null,
      jobs,
      compact: true,
      at: Date.now()
    };
    if (generation === this.generation) this.lastView = view;
    return view;
  }
  /** Store name -> { state, op, machine, reason } for the project list: a recent view, else a new one. */
  async projectJoin() {
    const view = this.lastView && Date.now() - this.lastView.at < JOIN_MS ? this.lastView : await this.view();
    return new Map(view.stores.map((s) => [s.name, { state: s.state, op: s.op, machine: s.machine, reason: s.reason ?? null }]));
  }
  // ---------- Stores ----------
  async createStore({ name: name6 } = {}) {
    checkName(name6, "A Store");
    await this.lfs.store.create(name6);
    this.changed();
    return this.view();
  }
  async removeStore(name6, { confirm } = {}) {
    if (confirm !== name6) throw refuse(400, "InvalidInput", `type the Store's name (${name6}) to remove it and every project in it`);
    await this.lfs.store.remove(name6);
    this.changed();
    return this.view();
  }
  /**
   * The saved login a PostgreSQL call names: `auth` (an existing one), the
   * login of Store `passwordFrom` (its server must be the URL's), or a new one
   * saved now from `user` + `passwordValue` under `authName` (default: the
   * Store's name). Saving under a name that exists rotates its password.
   */
  async loginOf(input, store, url) {
    if (typeof input?.auth === "string" && input.auth) {
      checkName(input.auth, "A saved login");
      return input.auth;
    }
    if (input?.passwordFrom !== void 0 && input.passwordFrom !== null && input.passwordFrom !== "") {
      checkName(input.passwordFrom, "The Store to take the login from");
      const source = await this.lfs.store.get(input.passwordFrom, { detail: true });
      if (source?.engine !== "postgresql" || typeof source.auth !== "string") throw refuse(400, "InvalidInput", `Store ${input.passwordFrom} is not a PostgreSQL Store with a saved login`);
      const there = pgWhere((Array.isArray(source.connections) ? source.connections : []).find((c) => !c?.machine)?.url);
      const here = pgWhere(url);
      if (url && (!here || !there || here.server !== there.server)) throw refuse(400, "InvalidInput", `Store ${input.passwordFrom} is on another server (${there?.server ?? "unknown"}); give this connection its own login`);
      return source.auth;
    }
    if (typeof input?.passwordValue === "string" && input.passwordValue !== "") {
      const user = typeof input.user === "string" ? input.user.trim() : "";
      if (!user) throw refuse(400, "InvalidInput", "Give the database user with the password");
      const auth = typeof input.authName === "string" && input.authName ? input.authName : store;
      checkName(auth, "A saved login");
      await this.lfs.store.save_auth(auth, { user, password: input.passwordValue });
      return auth;
    }
    return void 0;
  }
  /** A new login's name: refused when a saved login has it (saving under it would change another Store's password). */
  async freeLoginName(authName) {
    checkName(authName, "The new login");
    if ((await this.auths()).items.some((a) => a.auth === authName)) throw refuse(400, "InvalidInput", `A saved login named ${authName} exists: pick it, or name another`);
    return authName;
  }
  /**
   * A PostgreSQL database as a Store: { name, url (no user or password), auth
   * | passwordFrom | user + passwordValue + authName?, synchronousCommit? }.
   * A typed user and password are saved as a new login named `authName`
   * (default: the server's, `pg-<host>-<port>`, spec v23 V23-12), never one
   * that exists; when LayerFS refuses the connect, that new login is removed
   * again, so the same name can be given once more. Where its sessions run
   * is chosen when each is made (placement.ts).
   */
  async connectPostgresql(input = {}) {
    const { name: name6, url, synchronousCommit } = input;
    checkName(name6, "A PostgreSQL Store");
    checkUrl(url, "The database URL");
    const named = typeof input.auth === "string" && input.auth || input.passwordFrom !== void 0 && input.passwordFrom !== null && input.passwordFrom !== "";
    const typed = !named && typeof input.passwordValue === "string" && input.passwordValue !== "";
    if (typed && !(typeof input.user === "string" && input.user.trim())) throw refuse(400, "InvalidInput", "Give the database user with the password");
    const fresh = typed ? await this.freeLoginName(input.authName === void 0 || input.authName === null || input.authName === "" ? pgLoginName(url) ?? name6 : input.authName) : void 0;
    const auth = await this.loginOf(fresh ? { ...input, authName: fresh } : input, name6, url);
    if (!auth) throw refuse(400, "InvalidInput", "Choose a saved login, or give the user and password");
    try {
      await this.lfs.store.connect(name6, url, { auth, ...synchronousCommit ? { synchronous_commit: synchronousCommit } : {} });
    } catch (error2) {
      if (fresh && error2?.transport === "refusal") {
        try {
          await this.lfs.store.remove_auth(fresh);
        } catch {
        }
      }
      throw error2;
    }
    this.changed();
    return this.view();
  }
  /**
   * A PostgreSQL Store's connection: `{ machine?, url?, clear?, auth?,
   * passwordFrom?, user? + passwordValue?, synchronousCommit? }`. With a
   * `url`: the Store's address, or with `machine` that machine's own (proven
   * from it; store.connect). `clear` with `machine`: that machine's own
   * address goes (store.disconnect --machine). `auth`/`passwordFrom` or
   * `synchronousCommit`: store.update. A typed password: saved under the
   * Store's current login (store.save_auth rotates it). A Store that names no
   * saved login (`auth: null`: LayerFS answers it `broken` `outdated` and
   * refuses its calls) takes LayerFS's fix: a typed user and password are
   * saved as the login the person named (`authName`, never one that exists,
   * which would change another Store's password), then store.update names it.
   */
  async updateStore(name6, input = {}) {
    checkName(name6, "A PostgreSQL Store");
    const machine = input.machine === void 0 || input.machine === null || input.machine === "" ? void 0 : input.machine;
    if (machine !== void 0) checkName(machine, "A machine");
    if (input.clear === true) {
      if (machine === void 0) throw refuse(400, "InvalidInput", "Name the machine whose own address to remove");
      await this.lfs.store.disconnect(name6, { machine });
      this.changed();
      return this.view();
    }
    if (input.url) {
      checkUrl(input.url, "The database URL");
      await this.lfs.store.connect(name6, input.url, machine ? { machine } : {});
    }
    const sync = typeof input.synchronousCommit === "string" && input.synchronousCommit ? input.synchronousCommit : void 0;
    let rotated = false;
    if (typeof input.passwordValue === "string" && input.passwordValue !== "" && !input.auth) {
      const record = await this.lfs.store.get(name6, { detail: true });
      if (typeof record?.auth !== "string") {
        const authName = await this.freeLoginName(input.authName);
        const auth2 = await this.loginOf({ ...input, authName }, name6, null);
        await this.lfs.store.update(name6, { auth: auth2, ...sync ? { synchronous_commit: sync } : {} });
        this.changed();
        return this.view();
      }
      const saved = (await this.auths()).items;
      const user = typeof input.user === "string" && input.user.trim() ? input.user : saved.find((a) => a.auth === record.auth)?.user ?? void 0;
      await this.loginOf({ ...input, user, authName: record.auth }, name6, null);
      rotated = true;
    }
    const auth = rotated ? void 0 : await this.loginOf({ auth: input.auth, passwordFrom: input.passwordFrom }, name6, null);
    if (auth || sync) await this.lfs.store.update(name6, { ...auth ? { auth } : {}, ...sync ? { synchronous_commit: sync } : {} });
    if (!input.url && !auth && !sync && !rotated) throw refuse(400, "InvalidInput", "Give an address, a login, a password or synchronous_commit to change");
    this.changed();
    return this.view();
  }
  /**
   * The connection check from `machine` (`store doctor <store> --machine M`),
   * or from this computer when none is named (`store doctor <store>`).
   * LayerFS records what the check saw (spec v23 V23-2): the answer is that
   * side's `connections` row read back, `{ machine, host, ok, at, version,
   * latencyMs }` or `{ machine, host, ok: false, error }`. A machine the
   * doctor could not dial (not ready) is `ok: false` with the reason it
   * gave. A bad input (no such machine, a sqlite Store) is LayerFS's
   * refusal.
   */
  async checkStore(name6, machine) {
    checkName(name6, "A PostgreSQL Store");
    const from = machine === void 0 || machine === null || machine === "" || machine === "native" ? null : machine;
    if (from !== null) checkName(from, "A machine");
    const report = await this.lfs.store.doctor(name6, { ...from ? { machine: from } : {}, detail: true, timeout_ms: CHECK_TIMEOUT_MS });
    this.changed();
    const record = await this.lfs.store.get(name6, { detail: true });
    const row = connectionRows(record).find((c) => c.machine === from);
    const host = row?.server?.host ?? null;
    const who = from ?? "native";
    const findings = Array.isArray(report?.findings) ? report.findings : [];
    const recordFailed = findings.some((f) => f?.check === "store.record" && f?.severity === "error") || record?.state === "broken" && (record?.reason === "outdated" || record?.reason === "missing");
    if (recordFailed) {
      return { machine: who, host, ok: false, error: pgCheckError(report, record, from, row?.reach?.error ?? null) };
    }
    if (row?.reach) return row.reach.ok ? { machine: who, host, ok: true, at: row.reach.at ?? Date.now(), version: row.reach.version, latencyMs: row.reach.latencyMs } : { machine: who, host, ok: false, error: pgCheckError(report, record, from, row.reach.error) };
    const skipped = (Array.isArray(report?.not_checked) ? report.not_checked : []).find((n) => (n?.check === "store.connection" || !n?.check) && (n?.from === from || !n?.from));
    return { machine: who, host, ok: false, error: { code: String(skipped?.reason ?? skipped?.blocked_by?.reason ?? "Unknown"), message: `machine ${who} was not checked` } };
  }
  async disconnectStore(name6) {
    await this.lfs.store.disconnect(name6);
    this.changed();
    return this.view();
  }
  /**
   * The home's saved PostgreSQL logins (`store auths --detail`): name, user,
   * the Stores naming it, when it was saved and its state (a login file
   * LayerFS cannot read is `broken` with its fix); never a password.
   */
  async auths() {
    const listed = await this.lfs.store.auths({ detail: true });
    return {
      items: (Array.isArray(listed?.items) ? listed.items : []).map((a) => ({
        auth: String(a.auth),
        user: typeof a.user === "string" ? a.user : null,
        stores: Array.isArray(a.stores) ? a.stores.map(String) : [],
        state: typeof a.state === "string" ? a.state : "ready",
        ...companionsOf(a),
        created: msAt(a.created_at),
        updated: msAt(a.updated_at)
      }))
    };
  }
  /**
   * A new password for saved login `auth` (`{ user?, passwordValue }`, the
   * login's own user unless one is given): `store save-auth` under its own
   * name rotates it, the password on stdin, and every Store naming it dials
   * with it from its next connection. Then each of those Stores is checked
   * from this computer (`store doctor`, which records the reach). Answers
   * `{ auth, checks: [{ store, ok, error? }] }`; a check that fails is a
   * result, not a refusal.
   */
  async rotateLogin(auth, input = {}) {
    checkName(auth, "A saved login");
    if (typeof input.passwordValue !== "string" || input.passwordValue === "") throw refuse(400, "InvalidInput", "Give the new password");
    const saved = (await this.auths()).items.find((a) => a.auth === auth);
    if (!saved) throw refuse(404, "NotFound", `no saved login named ${auth}`);
    const user = typeof input.user === "string" && input.user.trim() ? input.user.trim() : saved.user;
    if (!user) throw refuse(400, "InvalidInput", "Give the database user with the password");
    const answer = await this.lfs.store.save_auth(auth, { user, password: input.passwordValue, detail: true });
    this.changed();
    const stores2 = Array.isArray(answer?.stores) ? answer.stores.map(String) : saved.stores;
    const checks = await Promise.all(stores2.map(async (store) => {
      try {
        const check = await this.checkStore(store, null);
        return check.ok ? { store, ok: true } : { store, ok: false, error: check.error };
      } catch (error2) {
        return { store, ok: false, error: { code: String(error2?.code ?? "Failed"), message: String(error2?.message ?? error2) } };
      }
    }));
    return { auth, checks };
  }
  /** Removes saved login `auth` (`store remove-auth`): LayerFS refuses `InUse` while a Store names it. */
  async removeLogin(auth) {
    checkName(auth, "A saved login");
    await this.lfs.store.remove_auth(auth);
    this.changed();
    return this.view();
  }
  // ---------- buckets ----------
  /**
   * An r2 or MinIO bucket. The URL is given whole ({ url }) or built from its
   * parts: MinIO { provider: 'minio', endpoint, bucket, prefix? }, R2
   * { provider: 'r2', account, jurisdiction?, bucket, prefix? }, with
   * { accessKey, secretKey }. The secret goes to LayerFS on stdin
   * (`--key-stdin`); the home keeps it. To change a key: connect again at
   * the same URL (spec v21); the answer's `outcome` is then `rotated`.
   */
  async connectBucket(input = {}) {
    const { name: name6 } = input;
    checkName(name6, "A bucket");
    const url = input.url ?? bucketUrl(input);
    if (typeof url !== "string" || !/^(https?:\/\/|r2:\/\/)/.test(url)) throw refuse(400, "InvalidInput", "A bucket URL is http(s)://<host>/<bucket>/<prefix> (MinIO) or r2://<account>/<bucket>/<prefix>");
    if (!url.startsWith("r2://")) checkUrl(url, "The bucket URL");
    const [access, secret] = [input.accessKey, input.secretKey].map((v) => typeof v === "string" ? v.trim() : "");
    if (!access || !secret || /\s/.test(access + secret)) throw refuse(400, "InvalidInput", "Give both the access key and the secret key (no spaces)");
    const answer = await this.lfs.backup.connect(name6, url, { access_key: access, secret_key: secret, detail: true });
    const prior = this.listings.get(name6);
    if (prior?.error) this.listings.set(name6, { ...prior, error: null });
    this.changed();
    const view = await this.view();
    return { ...view, outcome: typeof answer?.outcome === "string" ? answer.outcome : null };
  }
  /** Drops the bucket and its key; LayerFS drops every Store's link to it too. Answers which Stores lost theirs. */
  async disconnectBucket(name6) {
    const done = await this.lfs.backup.disconnect(name6, { detail: true });
    this.listings.delete(name6);
    this.changed();
    return { unlinked: done?.unlinked ?? [], view: await this.view() };
  }
  /**
   * `backup list --bucket <name> --detail`: its files, kept as the bucket's
   * last listing. A file: its Store link (`store`), `behind` (the Store
   * changed since its last backup), `changed` (the bucket's copy is not the
   * one the link last moved), `missing` (linked, not in the bucket); null
   * with a `message` where LayerFS could not read it. A bucket that could not
   * be listed comes back in `not_listed`: its reason and message.
   */
  async listBucket(name6) {
    checkName(name6, "A bucket");
    try {
      const listed = await this.lfs.backup.list({ bucket: name6, detail: true });
      const failed = (Array.isArray(listed?.not_listed) ? listed.not_listed : []).find((n) => n?.bucket === name6);
      const items = (Array.isArray(listed?.items) ? listed.items : []).filter((i) => i?.bucket === name6).map((i) => ({
        file: String(i.file),
        store: typeof i.store === "string" ? i.store : null,
        bytes: typeof i.size === "number" ? i.size : null,
        modified: msAt(i.modified_at),
        behind: typeof i.behind === "boolean" ? i.behind : null,
        changed: typeof i.changed === "boolean" ? i.changed : null,
        missing: i.missing === true,
        message: typeof i.message === "string" ? i.message : null
      }));
      this.listings.set(name6, failed ? { at: Date.now(), items: this.listings.get(name6)?.items ?? null, error: notListedError(failed) } : { at: Date.now(), items, error: null });
    } catch (error2) {
      this.listings.set(name6, { at: Date.now(), items: this.listings.get(name6)?.items ?? null, error: { code: error2?.code ?? "Failed", message: error2?.message ?? String(error2) } });
    }
    this.changed();
    return this.listings.get(name6);
  }
  /** Lists every bucket (`bucket`: one), each on its own call. */
  async check({ bucket } = {}) {
    const view = await this.view();
    const names = bucket ? [bucket] : view.buckets.map((b) => b.name);
    await Promise.all(names.map((n) => this.listBucket(n)));
    return this.view();
  }
  // ---------- jobs ----------
  jobList() {
    return [...this.jobs.values()].reverse().map((j) => ({ ...j }));
  }
  job(id) {
    const job = this.jobs.get(id);
    if (!job) throw refuse(404, "NotFound", "no such job: it ended long ago or another host started it");
    return { ...job };
  }
  /** Whether a job is running (for runtime admission). */
  busy() {
    return [...this.jobs.values()].some((j) => !j.ended);
  }
  /**
   * Starts LayerFS work with on_progress as a job; answers the job at once.
   * `run(on_progress, step, on_spawn)` may make more than one call: `step(half)`
   * marks the half a move is in.
   */
  start(kind, store, target, file, run2, from = null, steps) {
    if ([...this.jobs.values()].some((j) => j.store === store && !j.ended)) throw refuse(409, "ConnectBusy", `this host is already running a job on ${store}; wait for it to end`);
    const job = { id: randomUUID10(), kind, store, target, from, file: file ?? null, started: Date.now(), ended: null, half: null, phase: null, phases: [], outcome: null, pid: null, observation: null, summary: null, done: null, total: null, error: null, result: null, ...steps ? { steps } : {} };
    this.jobs.set(job.id, job);
    while (this.jobs.size > KEEP_JOBS) {
      const oldest = [...this.jobs.values()].find((j) => j.ended);
      if (!oldest) break;
      this.jobs.delete(oldest.id);
    }
    const emit = () => {
      this.jobStore.save();
      this.event({ type: "storage-job", job: { ...job } });
    };
    const on_progress = (p) => {
      if (typeof p?.phase === "string" && p.phase !== job.phase) {
        job.phase = p.phase;
        job.phases.push({ phase: p.phase, half: job.half, at: Date.now() });
        this.changed();
      }
      job.done = typeof p?.done === "number" ? p.done : null;
      job.total = typeof p?.total === "number" && p.total > 0 ? p.total : null;
      emit();
    };
    const step = (half, from2 = void 0) => {
      if (from2 !== void 0) job.from = from2;
      Object.assign(job, { half, phase: null, done: null, total: null });
      emit();
      this.changed();
    };
    this.jobStore.save();
    let running;
    try {
      running = Promise.resolve(run2(on_progress, step, (pid) => {
        job.pid = pid;
        emit();
      }));
    } catch (error2) {
      running = Promise.reject(error2);
    }
    this.running.set(job.id, running);
    running.then(
      (result) => {
        job.result = result ?? null;
        job.outcome = "succeeded";
      },
      (error2) => {
        job.phase = error2?.detail?.phase ?? job.phase;
        job.outcome = failureOutcome(error2, kind === "compact" ? null : job.phase);
        job.error = { transport: error2?.transport ?? null, code: error2?.code ?? "Failed", message: error2?.message ?? String(error2), phase: error2?.detail?.phase ?? job.phase, detail: error2?.detail ?? null, ...fixOf(error2), ...error2?.note ? { note: error2.note } : {} };
        this.log(`[storage] ${kind} ${store}: ${error2?.code ?? ""} ${error2?.message ?? error2}`);
      }
    ).finally(() => {
      this.running.delete(job.id);
      job.ended = Date.now();
      job.summary = transferSummary(job);
      emit();
      if (kind === "backup" || kind === "restore") void this.listBucket(target).catch(() => {
      });
      this.changed();
    });
    emit();
    this.changed();
    return { ...job };
  }
  /** store.move(store, machine): a sqlite Store on native to `machine`. */
  push(store, machine, made = false) {
    checkName(store, "A move");
    checkName(machine, "A move");
    const job = this.start("push", store, machine, null, async (on_progress, _step, on_spawn) => {
      await this.host.ensureNative();
      return this.lfs.store.move(store, machine, { on_progress, on_spawn, detail: true });
    });
    if (!made) return job;
    const own = this.jobs.get(job.id);
    if (own) own.made = true;
    return { ...job, made: true };
  }
  /** store.move(store, native): a sqlite Store on a machine back to this computer. */
  async pull(store) {
    checkName(store, "A move");
    const from = (await this.lfs.store.get(store))?.machine ?? null;
    return this.start("pull", store, "native", null, async (on_progress, _step, on_spawn) => {
      await this.host.ensureNative();
      return this.lfs.store.move(store, "native", { on_progress, on_spawn, detail: true });
    }, from);
  }
  /**
   * A Store on one machine to another: to native, then to the target, two
   * moves (a sqlite Store goes to or from this computer only; U5). When the
   * second fails the Store stays on native; the error's `note` says so (`pulled`).
   */
  move(store, machine) {
    checkName(store, "A move");
    checkName(machine, "A move");
    return this.start("move", store, machine, null, async (on_progress, step, on_spawn) => {
      await this.host.ensureNative();
      const source = await this.lfs.store.get(store);
      step("pull", source.machine ?? null);
      await this.lfs.store.move(store, "native", { on_progress, on_spawn, detail: true });
      step("push");
      try {
        return await this.lfs.store.move(store, machine, { on_progress, on_spawn, detail: true });
      } catch (error2) {
        if (failureOutcome(error2, error2?.detail?.phase) === "failed" && error2?.detail?.phase !== "retire") error2.note = "pulled";
        throw error2;
      }
    });
  }
  /** Puts sqlite Store `store` on `machine`: a move from native, to native, else two moves through native. */
  /** @param made - a Store a New Store dialog just made: the push job is marked so its words read "created on". */
  async place(store, machine, made = false) {
    checkName(store, "A Store");
    checkName(machine, "A machine");
    const record = await this.lfs.store.get(store);
    if (record.engine && record.engine !== "sqlite") throw refuse(400, "InvalidInput", `${store} is a PostgreSQL Store; it is never moved`);
    if (record.machine === machine) throw refuse(400, "InvalidInput", `${store} is on ${machine} already`);
    if (machine === "native") return this.pull(store);
    if (record.machine === "native") return this.push(store, machine, made);
    return this.move(store, machine);
  }
  /** A started job's LayerFS work while it runs (its result, or its refusal as it came). */
  running = /* @__PURE__ */ new Map();
  /**
   * The Doctor page's backup fix: the same Storage job as the Backups page's
   * (its job row, `storage-job` events, one job per Store), awaited to its end.
   */
  async backupAndWait(store, bucket) {
    const job = this.backup(store, { bucket });
    return await (this.running.get(job.id) ?? Promise.resolve(null));
  }
  /** backup.create(store, bucket, { file? }): a sqlite Store's snapshot to a bucket. */
  backup(store, { bucket, file } = {}) {
    checkName(store, "A backup");
    checkName(bucket, "A backup");
    return this.start("backup", store, bucket, file, (on_progress, _step, on_spawn) => this.lfs.backup.create(store, bucket, { ...file ? { file } : {}, on_progress, on_spawn, detail: true }));
  }
  /** backup.restore(bucket, file, store): a Store on native from a bucket's file (default: the file named after the Store). */
  restore({ store, bucket, file } = {}) {
    checkName(store, "A restore");
    checkName(bucket, "A restore");
    return this.start("restore", store, bucket, file, (on_progress, _step, on_spawn) => this.lfs.backup.restore(bucket, file || store, store, { on_progress, on_spawn, detail: true }));
  }
  /**
   * store.compact(store): rebuild a Store from its live history where it is
   * (a sqlite file in the home or on its machine, compacted by that
   * machine's worker; or its PostgreSQL server). LayerFS refuses a Store
   * with mounts (`InUse`), a busy one (`Busy` with `op`) and one whose
   * machine is not running (`Unavailable`, fix `layerfs machine start M`);
   * the job carries that refusal. One attempt: nothing here runs it again.
   * Its result is `{ freed_bytes, outcome, … }`.
   */
  async compact(store) {
    checkName(store, "A compaction");
    const family = (await this.lfs.store.get(store))?.engine === "postgresql" ? "postgresql" : "sqlite";
    return this.start("compact", store, store, null, (on_progress, _step, on_spawn) => this.lfs.store.compact(store, { on_progress, on_spawn, detail: true }), null, COMPACT_STEPS[family]);
  }
  async inspect(id) {
    const job = this.jobs.get(id);
    if (!job || !job.ended) throw refuse(409, "ConnectBusy", "Wait for a completed job before inspecting recovery");
    job.observation = await inspectJob(this.lfs, job);
    const value = job.observation.value;
    if (value?.state === "broken" && value?.reason === "unresolved") job.outcome = "unknown";
    else if (value?.state === "ready" && job.error?.transport === "transport-unknown" && !["install", "record"].includes(job.phase ?? "")) job.outcome = "interrupted";
    job.summary = transferSummary(job);
    this.jobStore.save();
    return { ...job };
  }
  async retry(id) {
    const old = this.jobs.get(id);
    if (!old?.observation?.action) throw refuse(409, "InspectRequired", "Inspect the current Store before choosing recovery");
    const job = await this.inspect(id);
    if (!job.observation.action) throw refuse(409, "RecoveryUnavailable", "The fresh observation does not permit this recovery");
    if (job.observation.direction === "pull") return this.pull(job.store);
    return this.push(job.store, job.target);
  }
  close() {
    this.jobStore.save();
  }
};

// src/host/routes/router.ts
var STATUS = {
  InvalidInput: 400,
  IsDirectory: 400,
  NotDirectory: 400,
  NotFile: 400,
  NotText: 400,
  Binary: 400,
  TooLarge: 400,
  NoSuchProject: 404,
  NoSuchPath: 404,
  NoSuchBranch: 404,
  NoSuchCommit: 404,
  NoSuchSandbox: 404,
  NoSuchStore: 404,
  NoSuchWorkspace: 404,
  NoMatch: 400,
  AmbiguousMatch: 400,
  NotFound: 404,
  // the SDK's: an operation holds the entity (detail names it, its phase and op)
  Busy: 409,
  // the host's own: one Sandbox-page command per Workspace (commands.ts)
  CommandRunning: 409,
  // the SDK's: an operation's outcome was lost; the message names the clearing call
  Unresolved: 409,
  // the host's own guards (one job per Store on this host)
  ConnectBusy: 409,
  // LayerFS's: not enough free disk (detail { needed_bytes, free_bytes, path }, fix)
  Capacity: 507,
  Unknown: 500,
  Conflict: 409,
  Exists: 409,
  NameTaken: 409,
  HeadMoved: 409,
  Dirty: 409,
  ReadOnly: 409,
  InUse: 409,
  // LayerFS's: a Sandbox closed while a Workspace is still mounted in it
  MountsActive: 409,
  Denied: 403,
  Unavailable: 502,
  // the host's own: no runtime chosen, or a LayerFS folder not set up yet (the setup modal fixes both)
  CliUnavailable: 503,
  Uninitialized: 503,
  MixedBuild: 409,
  Unsupported: 501,
  // a Workspace or Sandbox that is not (or no longer) what the caller named
  NotMounted: 409,
  StaleSandbox: 409,
  Cancelled: 409,
  NoStore: 404,
  NoSuchBucket: 404,
  // a call (or the host's wait for a Sandbox read) that did not answer in time
  Timeout: 504,
  // the host's own: a project name now names another project (sessions/catalog.ts)
  ProjectIdentityChanged: 409
};
var EXPECTED = /* @__PURE__ */ new Set(["Unavailable", "Capacity", "Unsupported"]);
var httpError = (status, code2, message) => Object.assign(new Error(message), { status, code: code2 });
var isConversion = (code2, detail) => code2 === "InUse" && Array.isArray(detail?.related) && detail.related.some((r) => typeof r?.why === "string");
function errorAnswer(error2) {
  const code2 = typeof error2?.code === "string" ? error2.code : "failed";
  const status = Number.isInteger(error2?.status) ? error2.status : STATUS[code2] ?? 500;
  const own = error2?.detail && typeof error2.detail === "object" ? error2.detail : null;
  const blocked = error2?.blocked_by && typeof error2.blocked_by === "object" && !own?.blocked_by ? error2.blocked_by : null;
  const detail = blocked ? { ...own, blocked_by: blocked } : own;
  return { status, body: wire({ code: code2, ...error2?.transport ? { transport: error2.transport } : {}, message: error2?.message ?? String(error2), ...detail ? { detail } : {}, ...fixOf(error2), ...isConversion(code2, detail) ? { conversion: true } : {} }) };
}
function createGroups(host, runtime) {
  const projects = new Projects(host);
  const storage = new Storage(host);
  projects.storeJoin = () => storage.projectJoin();
  const machines = new Machines(host, (store, machine, made) => storage.place(store, machine, made));
  const checks = new DoctorChecks(host, void 0, { actions: { machineStart: (name6) => machines.start(name6), machineStop: (name6) => machines.stop(name6), projectDelete: (key) => projects.remove(key), backupCreate: (store, bucket) => storage.backupAndWait(store, bucket) } });
  const commands = new SandboxCommands(host);
  projects.sandboxClosedHook = (name6) => commands.closed(name6);
  projects.ownExec = (ws, id) => commands.started(ws, id);
  projects.startMachine = (name6) => machines.start(name6);
  projects.sandboxMade = (name6) => machines.metrics.created(name6);
  projects.spaceFor = (machine, image) => machines.spaceFor(machine, image);
  projects.sandboxCreates.settled = () => machines.changed();
  return { host, machines, storage, projects, checks, commands, sandboxCreates: projects.sandboxCreates, runtime };
}
async function route(g, method, parts, query, body, signal) {
  const { machines, storage, projects } = g;
  const [api, group, id, sub, ...rest] = parts;
  if (method !== "GET") machines.changed();
  if (api === "api" && group === "demo-presets") return g.presets?.route(method, parts.slice(2), body, query);
  if (api === "api" && group === "doctor" && id) return g.checks.route(method, parts.slice(2), body);
  if (api !== "api" || rest.length) return void 0;
  if (group === "storage" && !id && method === "GET") return storage.view(query.get("fresh") === "1");
  if (group === "storage" && id === "check" && !sub && method === "POST") return storage.check(body ?? {});
  if (group === "stores") {
    if (!id && method === "POST") return storage.createStore(body ?? {});
    if (id === "postgresql" && !sub && method === "POST") return storage.connectPostgresql(body ?? {});
    if (id && sub === "stats" && method === "GET") return projects.storeStats(id);
    if (id && sub === "observations" && method === "GET") return projects.storeObservations(id);
    if (id && sub === "projects" && method === "GET") return projects.storeProjects(id);
    if (id && !sub && method === "DELETE") return storage.removeStore(id, { confirm: query.get("confirm") });
    if (id && sub === "disconnect" && method === "POST") return storage.disconnectStore(id);
    if (id && sub === "connection" && method === "POST") return storage.updateStore(id, body ?? {});
    if (id && sub === "check" && method === "GET") return storage.checkStore(id, query.get("machine"));
    if (id && sub === "push" && method === "POST") return storage.push(id, body?.machine);
    if (id && sub === "pull" && method === "POST") return storage.pull(id);
    if (id && sub === "move" && method === "POST") return storage.move(id, body?.machine);
    if (id && sub === "backup" && method === "POST") return storage.backup(id, body ?? {});
    if (id && sub === "compact" && method === "POST") return storage.compact(id);
    return void 0;
  }
  if (group === "buckets") {
    if (!id && method === "POST") return storage.connectBucket(body ?? {});
    if (id && !sub && method === "DELETE") return storage.disconnectBucket(id);
    if (id && sub === "files" && method === "GET") return storage.listBucket(id);
    if (id && sub === "restore" && method === "POST") return storage.restore({ ...body ?? {}, bucket: id });
    return void 0;
  }
  if (group === "store-auths" && !id && method === "GET") return storage.auths();
  if (group === "store-auths" && id && sub === "rotate" && method === "POST") return storage.rotateLogin(id, body ?? {});
  if (group === "store-auths" && id && !sub && method === "DELETE") return storage.removeLogin(id);
  if (group === "storage-jobs" && id && !sub && method === "GET") return storage.job(id);
  if (group === "storage-jobs" && id && sub === "inspect" && method === "POST") return storage.inspect(id);
  if (group === "storage-jobs" && id && sub === "retry" && method === "POST") return storage.retry(id);
  if (group === "platforms" && !id && method === "GET") return machines.platforms();
  if (group === "metrics" && !id && method === "GET") return machines.metrics.view(query);
  if (group === "sandbox-creates" && !sub) {
    if (!id && method === "GET") return g.sandboxCreates.list();
    if (id && method === "DELETE") return g.sandboxCreates.dismiss(id);
  }
  if (group === "image-loads" && !sub) {
    if (!id && method === "GET") return machines.loads.list();
    if (id && method === "DELETE") return machines.loads.dismiss(id);
  }
  if (group === "machines") {
    if (!id && !sub && method === "GET") return machines.view(query.get("fresh") === "1");
    if (id && sub === "inspect" && method === "GET") return machines.inspect(id);
    if (id && sub === "log" && method === "GET") return machines.machineLog(id, query, signal);
    if (id && sub === "files" && method === "GET") return machines.machineFiles(id, query, signal);
    if (id && sub === "stats" && method === "GET") return machines.machineStats(id);
    if (id && sub === "space" && method === "GET") return machines.machineSpace(id, query);
    if (id && sub === "sandbox-images" && method === "GET") return machines.sandboxImages(id);
    if (id && sub === "prune-images" && method === "POST") return machines.pruneImages(id, body ?? {});
    if (id && sub === "load-image" && method === "POST") return machines.loadImage(id, body ?? {});
    if (id && sub === "start" && method === "POST") return machines.start(id);
    if (id && sub === "restart" && method === "POST") return machines.restart(id);
    if (id && sub === "stop" && method === "POST") return machines.stop(id, { force: body?.force === true });
    if (!id && !sub && method === "POST") return machines.create(body);
    if (id && !sub && method === "DELETE") return machines.remove(id);
    if (id && sub === "update" && method === "POST") return machines.update(id, body);
    if (id && sub === "stores" && method === "POST") return machines.moveStore(body?.store, id, body?.made === true);
  }
  if (group === "status" && !id && method === "GET") return projects.status(await g.runtime());
  if (group === "projects") {
    if (!id) {
      if (method === "GET") return projects.list(query.get("fresh") === "1");
      if (method === "POST") return projects.create(body);
      return void 0;
    }
    const projectId = query.get("projectId");
    if (projectId) await g.host.assertProjectIdentity?.(id, projectId);
    if (!sub && method === "GET") return projects.state(id);
    if (!sub && method === "DELETE") return projects.remove(id);
    if (sub === "sandboxes" && method === "POST") return projects.createSandbox(id, body ?? {});
    if (sub === "close-sandboxes" && method === "POST") return projects.closeSandboxes(id, { force: body?.force === true });
    if (method !== "GET") return void 0;
    const branch = query.get("branch") ?? "main";
    if (sub === "history") return projects.history(id, query);
    if (sub === "storage") return projects.projectStorage(id, query);
    if (sub === "size") return projects.projectSize(id, query);
    if (sub === "branches") return projects.branches(id, query);
    if (sub === "file-query") return projects.fileQuery(id, query);
    if (sub === "stats") return projects.projectStats(id, query);
    if (sub === "commits") return projects.commits(id, branch, query.get("limit"));
    if (sub === "branch-commits") return projects.branchCommits(id, query.getAll("branch"));
    if (sub === "sandboxes") return projects.sandboxes(id);
    if (sub === "fs") return projects.listDir(id, branch, query.get("path") ?? "/", query.get("pin"), query.get("pos") ?? 0);
    if (sub === "file") return projects.file(id, branch, query.get("path"), query.get("pin"), query.get("line") ?? 1);
    return void 0;
  }
  if (group === "sandboxes" && id && !sub && method === "DELETE") return projects.closeSandbox(id, { force: query.get("force") === "1" });
  if (group === "sandboxes" && id && sub === "log" && method === "GET") return machines.sandboxLog(id, query, signal);
  if (group === "sandboxes" && id && sub === "files" && method === "GET") return machines.sandboxFiles(id, query, signal);
  if (group === "sandboxes" && id && !sub && method === "GET") return projects.sandbox(id);
  if (group === "sandboxes" && id && sub === "commands" && method === "GET") return g.commands.list(id);
  if (group === "workspaces" && id && sub === "commands" && method === "GET") return g.commands.listWorkspace(id);
  if (group === "workspaces" && id && sub === "commands" && method === "POST") return g.commands.start(id, body ?? {});
  if (group === "workspaces" && id && sub === "cancel" && method === "POST") return g.commands.cancel(id, body ?? {});
  if (group === "workspaces" && id && sub === "commit" && method === "POST") {
    const sandbox = sandboxOfWs(id);
    const message = typeof body?.message === "string" && body.message.trim() ? body.message.trim().slice(0, 4096) : void 0;
    const lfs = projects.lfs;
    try {
      return await lfs.workspace.commit(id, { detail: true, ...message ? { message } : {} });
    } finally {
      invalidateSandbox(lfs, sandbox);
    }
  }
  if (group === "sandboxes" && id && sub === "workspaces" && method === "POST") return projects.mount(id, body ?? {});
  if (group === "workspaces" && id && sub === "status" && method === "GET") return projects.lfs.workspace.status(id, { detail: true });
  if (group === "workspaces" && id && !sub && method === "DELETE") {
    const force = query.get("force") === "1";
    sandboxOfWs(id);
    if (!force) g.commands.assertIdle(id, "Cancel it first, or force the unmount.");
    const result = await projects.unmount(id, { discard: query.get("discard") === "1", force });
    g.commands.unmounted(id);
    return result;
  }
  if (group === "project-sources" && id === "check" && !sub && method === "POST") return projects.checkSource(body ?? {});
  if (group === "project-inits" && !id && method === "GET") return projects.initJobs();
  if (group === "project-inits" && id && !sub && method === "GET") return projects.init(id);
  return void 0;
}
async function handle(g, request3, signal) {
  const method = String(request3?.method ?? "GET").toUpperCase();
  let url;
  try {
    url = new URL(String(request3?.path ?? "/"), "http://127.0.0.1");
  } catch {
    return { status: 400, body: { code: "InvalidInput", message: "bad request URL" } };
  }
  let parts;
  try {
    parts = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);
  } catch {
    return { status: 400, body: { code: "InvalidInput", message: "bad path encoding" } };
  }
  try {
    let body = {};
    if (method === "POST" && request3.body !== void 0 && request3.body !== null) {
      if (typeof request3.body === "string") {
        try {
          body = JSON.parse(request3.body);
        } catch {
          throw httpError(400, "InvalidInput", "Invalid JSON request body.");
        }
      } else body = request3.body;
    }
    if (method !== "GET" && parts[1] !== "demo-presets" && g.presets?.exclusive()) {
      throw httpError(409, "ConnectBusy", "A preset build or reset is changing this LayerFS home. Changes are available when it finishes; you can keep browsing.");
    }
    await g.host.ensureNative();
    const answer = await route(g, method, parts, url.searchParams, body, signal);
    if (answer === void 0) return { status: 404, body: { code: "NotFound", message: `no route ${method} ${url.pathname}` } };
    if (answer instanceof Answer) return { status: answer.status, body: wire(answer.body) ?? null };
    return { status: 200, body: wire(answer) ?? null };
  } catch (error2) {
    const answer = errorAnswer(error2);
    if (answer.status >= 500 && answer.status !== 503 && !EXPECTED.has(String(answer.body.code))) g.host.log(`${method} ${url.pathname}: ${error2?.stack ?? answer.body.message}`);
    return answer;
  }
}

// src/host/routes/index.ts
var name2 = "dsh-layerfs-routes";
var inject2 = ["layerfs", "layerfsRemote"];
function apply2(ctx) {
  const logger = ctx.logger("layerfs-routes");
  const host = {
    lfs: () => ctx.layerfs.lfs,
    home: ctx.layerfs.home,
    root: ctx.layerfs.root,
    secrets: ctx.layerfs.secrets,
    jobs: ctx.layerfs.jobDir,
    stats: ctx.layerfs.statDir,
    cli: () => ctx.layerfs.cli,
    daemon: () => ctx.layerfs.daemon,
    bundle: () => ctx.layerfs.bundle,
    discover: () => ctx.layerfs.discovery(),
    ensureNative: () => ctx.layerfs.ensureNative(),
    emit: (type, data) => ctx.layerfs.emit(type, data),
    assertProjectIdentity: async (project, projectId) => {
      const persistence = ctx.get("sessionPersistence");
      if (!persistence?.catalog) throw new Error("Project identity service is unavailable");
      return persistence.catalog.assert(project, projectId, { claim: false });
    },
    projectRemoving: async (project) => {
      await ctx.get("layerfsSessions")?.closeProject(project);
    },
    projectRemoved: async (project) => {
      await ctx.get("layerfsSessions")?.forgetProject(project);
    },
    machinesStopped: async (machines) => {
      ctx.get("layerfsSessions")?.machinesStopped(machines);
    },
    sandboxClosed: async (name6) => {
      ctx.get("layerfsSessions")?.sandboxClosed(name6);
    },
    closeSessionSandbox: async (name6) => {
      const sessions2 = ctx.get("layerfsSessions");
      const owner = sessions2 && Object.values(sessions2.state.read().sessions).find((b) => b.sandbox === name6 && b.state === "bound");
      if (!owner) return false;
      await sessions2.close(owner.sessionId, "user");
      return true;
    },
    labelTags: async (tags) => {
      const out = {};
      for (const line of await label(ctx, tags.map((tag) => ({ tag })))) if (line.tag && line.dsh) out[line.tag] = line.dsh;
      return out;
    },
    log: (line) => logger.warn(line)
  };
  const groups = createGroups(host, () => ctx.layerfs.status());
  const sessions = () => ctx.get("layerfsSessions");
  const presetState = presetStateFor(ctx.layerfs.root, ctx.layerfs.home);
  const presets3 = new PresetManager({
    spec: () => {
      const { cli, home, bundle, cacheHome, callLog, gate } = ctx.layerfs.lfs.spec;
      return { cli, home, bundle, cacheHome, callLog, gate, daemon: ctx.layerfs.daemon, state: presetState };
    },
    busy: () => [
      ...groups.storage.busy() ? ["a storage job"] : [],
      ...groups.projects.busy() ? ["a project import"] : [],
      ...groups.checks.busy() ? ["a doctor run"] : [],
      ...groups.commands.busy() ? ["a Sandbox command"] : []
    ],
    boundSessions: () => Object.values(sessions()?.state.read().sessions ?? {}).filter((b) => b.kind === "project" && b.state === "bound" && b.sandbox).map((b) => ({ id: String(b.sessionId), project: b.project ?? null })),
    dshProjects: () => {
      const state = sessions()?.state.read();
      if (!state) return [];
      const all = Object.values(state.sessions);
      return Object.keys(state.projects).sort().map((project) => ({ project, sessions: all.filter((b) => b.project === project && b.kind !== "shared").length }));
    },
    forgetProject: async (project) => {
      await sessions()?.forgetProject(project);
    },
    homeStores: async (also) => sessions()?.homeStores(also) ?? also.map((name6) => ({ name: name6 })),
    projectConversations: (stores2) => sessions()?.projectConversations(stores2) ?? [],
    deleteProjectConversations: async (stores2) => await sessions()?.deleteProjectConversations(stores2) ?? [],
    machinesStopped: async (machines) => {
      sessions()?.machinesStopped(machines);
    },
    emit: (type, data) => ctx.layerfs.emit(type, data)
  }, presetState, ctx.layerfs.home);
  groups.presets = presets3;
  ctx.layerfs.exclusive = () => presets3.exclusive() ? "A preset build or reset is changing this LayerFS home; the session gets its Sandbox when it finishes. Send the message again then." : null;
  groups.machines.metrics.start();
  ctx.effect(() => () => {
    groups.machines.metrics.stop();
    ctx.layerfs.exclusive = void 0;
    groups.storage.close();
    groups.checks.close();
    void groups.projects.close();
  }, "dsh-layerfs: routes state");
  ctx.layerfsRemote.operate(ctx, {
    http: (args, signal) => handle(groups, args ?? {}, signal),
    // The page stopped waiting for a monitoring read it named with `?rid=` (a left tab, a collapsed folder):
    // queued, the read leaves the inspect lane without a process; running, its process is ended.
    // Not a route: a POST would mark the machines view changed and drop its shared read.
    "inspect.cancel": (args) => ({ cancelled: groups.machines.reads.cancel(args?.rid) })
  });
}

// src/host/sessions/index.ts
var sessions_exports = {};
__export(sessions_exports, {
  apply: () => apply3,
  inject: () => inject3,
  name: () => name3
});

// src/host/sessions/prompt.ts
var q = (value, missing2 = "not set yet") => value ? JSON.stringify(value) : `(${missing2})`;
function projectContext(b, options) {
  const sandbox = b.sandbox ?? b.ws?.split(":")[0];
  const lines2 = [
    "## LayerFS project session",
    "This conversation works on a LayerFS project. The project's files are **not** in the local working directory: they live in LayerFS, on the session Branch. Local commands such as `ls`, `cat` or `git status` see only the local working directory.",
    "",
    "| Setting | Value | In bash |",
    "| --- | --- | --- |",
    `| Project | ${q(b.project)} | \`$DSH_LAYERFS_PROJECT\` |`,
    `| Machine | ${q(b.machine, "unknown")} | |`,
    `| Session Branch (the project as this conversation has it) | ${q(b.branch)} | \`$DSH_LAYERFS_BRANCH\` |`,
    `| Session Sandbox (where you mount Workspaces to run commands; 16 per Sandbox) | ${q(sandbox, "not running")} | \`\${DSH_LAYERFS_WS%%:*}\` |`,
    `| dsh's Workspace (records checkpoints; leave it alone) | ${q(b.ws, "not mounted yet")} | \`$DSH_LAYERFS_WS\` |`,
    `| Local working directory (scratch, never saved) | ${q(b.scratch)} | \`pwd\` |`,
    "| LayerFS command / Node SDK | | `$DSH_LAYERFS_CLI` / `$DSH_LAYERFS_SDK` |",
    "",
    "- **Load the `dsh-layerfs` skill before your first LayerFS call.** It has the commands, the Node SDK, history, Branches, subagents, conflicts and limits.",
    "- **Files:** read, search and change them with `file` calls on the session Branch (`file read`, `file grep`, `file edit`, `file write`, `file apply`); each change is saved at once. Use a command instead only for a batch change with logic (a codemod, a formatter, a generator).",
    "- **Commands** (build, test, install, git) run in a Workspace you mount on the session Branch in the session Sandbox, usually one per bash call: mount, exec, commit, unmount. Use paths relative to the Workspace root, never its mount path.",
    "- **Installs and caches** (`node_modules`, `.venv`, Cargo's home and `target/`, tool caches) go inside the Workspace and are committed, so the next mount has them: never install into `HOME` or `/tmp`.",
    options.checkpoints && options.subagent ? "- **Checkpoints:** your `file` changes and Workspace Commits are saved on the session Branch at once; the main agent's turn end marks the checkpoint. Your own turns record none." : options.checkpoints ? "- **Checkpoints:** your `file` changes and Workspace Commits are saved on the session Branch at once. At the end of every turn in which it moved, dsh records a checkpoint the user can restore; after a restore the session Branch has a new name, shown here." : "- **Checkpoints are off:** your `file` changes and Workspace Commits are still saved on the session Branch; no restore points are recorded.",
    options.subagent ? "- **You are a subagent:** you share this project, Branch and Sandbox with the agent that started you. Work only on the files and Branch you were given, mount Workspaces under the names you were given, and report what you changed and committed." : "- **Subagents** you start share this project, Branch and Sandbox, and its 16 Workspace slots. Give each one its own files, Branch and Workspace names as the skill describes; for more room, create Sandboxes of your own.",
    "- **Local working directory:** the user's folder, possibly shared with other sessions. Use it for notes and temporary files only and never clear it; nothing in it reaches the project. Never draft project files there to upload later, and never build or test the project on the local machine: write files on the Branch with `file` calls and build in a Workspace.",
    "- **Leave alone:** never exec in, commit or unmount dsh's Workspace, and never close the session Sandbox: dsh manages both. Sandboxes you create for more room (see the skill) are yours to close. Unmount every Workspace you mounted before your turn ends. Work only in this project; machines, Stores, backups and other projects are the user's. The LayerFS paths the file policy lists as writable are for the LayerFS command itself: never read, write or `cd` into them directly."
  ];
  return lines2.join("\n");
}

// src/host/sessions/index.ts
import { existsSync as existsSync18, statSync as statSync9 } from "node:fs";
import { pathToFileURL as pathToFileURL2 } from "node:url";

// src/host/sessions/catalog.ts
import { createHash as createHash13, randomUUID as randomUUID11 } from "node:crypto";
import { existsSync as existsSync16, mkdirSync as mkdirSync18, readFileSync as readFileSync19, renameSync as renameSync15, writeFileSync as writeFileSync16 } from "node:fs";
import { dirname as dirname9, join as join24 } from "node:path";
var PROJECT_BRANCH_PREFIX = "dsh.project.";
var UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
var UNCLAIMED = "unclaimed:";
var identityBranch = (id) => `${PROJECT_BRANCH_PREFIX}${id}`;
function uuidOfBranches(names) {
  const ids = names.filter((name6) => name6.startsWith(PROJECT_BRANCH_PREFIX)).map((name6) => name6.slice(PROJECT_BRANCH_PREFIX.length)).filter((id) => UUID.test(id)).sort();
  return ids[0] ?? null;
}
var GONE_MS = 10 * 6e4;

// src/host/sessions/service.ts
import { Service as Service2 } from "@deepseek-ai/cordis";
import { existsSync as existsSync17, mkdirSync as mkdirSync19, mkdtempSync as mkdtempSync2, realpathSync as realpathSync6, rmSync as rmSync8, statSync as statSync8, writeFileSync as writeFileSync17 } from "node:fs";
import { isAbsolute as isAbsolute6, join as join25 } from "node:path";
import { createHash as createHash14, randomUUID as randomUUID12 } from "node:crypto";

// src/host/sessions/state.ts
var initialState = () => ({ version: 1, projects: {}, sessions: {}, checkpoints: {}, mirror: {}, pending: {} });

// src/host/sessions/availability.ts
function classifyStore(row, live) {
  if (!row) return { state: "removed", reason: "The project Store is no longer listed in this LayerFS home. Conversation history is retained." };
  const name6 = row.store ? `Store ${row.store}` : "the project Store";
  const recordBroken = row.state === "broken" && row.reason !== "unreachable";
  const x = live && !(recordBroken && (live.state ?? "ready") === "ready") ? live : row;
  const state = typeof x.state === "string" ? x.state : "ready";
  const op = x.op;
  const fix = typeof x.fix === "string" && x.fix ? ` Fix: ${x.fix}` : "";
  if (state === "blocked") {
    const why = x.blocked_by?.reason;
    const words = !why ? "not ready" : why === "failed" ? "unreadable: LayerFS cannot read its record" : String(why).replace(/_/g, " ");
    return { state: "unavailable", reason: `The machine of ${name6}${x.blocked_by?.machine ? ` (${x.blocked_by.machine})` : ""} is ${words}.` };
  }
  if (state === "broken") {
    if (x.reason === "unresolved") return { state: "unavailable", reason: `An earlier operation on ${name6} left an uncertain outcome; resolve it on the Storage page.${fix}` };
    if (x.reason === "unreachable") return { state: "unavailable", reason: `The PostgreSQL server of ${name6} cannot be reached from this computer.${fix}` };
    if (x.reason === "missing") return { state: "unavailable", reason: `The file of ${name6} is missing.${fix}` };
    if (x.reason === "outdated" && row.engine === "postgresql" && typeof row.auth !== "string") return { state: "unavailable", reason: `PostgreSQL ${name6} names no saved login; save one with Save a login\u2026 on its Storage page.${fix}` };
    return { state: "unavailable", reason: `${name6} needs repair (${String(x.reason ?? "broken")}).${fix}` };
  }
  if (state === "busy" || op) return { state: "transient", reason: `The project Store is busy${op?.name ? ` (${op.name})` : ""}.` };
  if (state === "ready") return { state: "available" };
  return { state: "unknown", reason: `The project Store reads ${String(state)}.` };
}
var storeOf2 = (project) => project?.split("/")[0] || void 0;

// src/host/sessions/service.ts
var IDENTITY_FRESH_MS = 15e3;
var compact = (sessionId) => sessionId.replace(/^session-/, "").replace(/[^A-Za-z0-9]/g, "").toLowerCase();
var branchOf = (sessionId, generation = 0) => `dsh.${compact(sessionId)}${generation ? `.r${generation}` : ""}`;
var sandboxOf2 = (sessionId) => `dsh-${compact(sessionId).slice(0, 20)}`;
var WS_NAME = "main";
var real2 = (path2) => {
  try {
    return realpathSync6(path2);
  } catch {
    return path2;
  }
};
var errorOf = (error2) => ({ code: String(error2?.code ?? "Failed"), message: String(error2?.message ?? error2) });
var exists = (error2) => error2?.code === "Exists";
var isFresh = (agent) => !agent.session.snapshotEvents(0).some((e) => e.type === "turn/start");
var LayerfsSessions = class extends Service2 {
  static inject = ["layerfs", "layerfsRemote", "workspaceRegistry", "workingDirectory", "sessions"];
  state;
  /** One operation at a time per session (bind, checkpoint, restore). */
  lanes = /* @__PURE__ */ new Map();
  scratchReady;
  /** The LayerFS session store, while the sessions area is up (the persistence row imports through it). */
  store;
  /** Last observed health of each Store a project conversation uses (read-only polling). */
  storeHealth = /* @__PURE__ */ new Map();
  /** When each PostgreSQL Store's server was last asked (one connection per ask). */
  serverChecked = /* @__PURE__ */ new Map();
  availabilityRun;
  constructor(ctx) {
    super(ctx, "layerfsSessions");
    this.state = new JsonFile(join25(ctx.layerfs.root, "sessions.json"), initialState);
  }
  get lfs() {
    return this.ctx.layerfs.lfs;
  }
  /** Separate installations may resume one archived conversation in the same home. */
  simulationSandbox(sessionId) {
    const installation = createHash14("sha256").update(this.ctx.layerfs.root).digest("hex").slice(0, 10);
    return `${sandboxOf2(sessionId)}-${installation}`;
  }
  /** Serialize work per session. */
  lane(sessionId, run2) {
    const next = (this.lanes.get(sessionId) ?? Promise.resolve()).then(run2, run2);
    this.lanes.set(sessionId, next.catch(() => {
    }));
    return next;
  }
  /** Wait until the session's queued operations (an owner choice, a bind) finish. */
  async settled(sessionId) {
    let current;
    while (current = this.lanes.get(sessionId)) {
      await current;
      if (this.lanes.get(sessionId) === current) return;
    }
  }
  // ------------------------------------------------------------- workspaces
  /** `<root>/projects/<store>/<name>`. */
  anchorOf(project) {
    const [store, name6] = project.split("/");
    if (!store || !name6 || project.split("/").length !== 2) throw new CliError("InvalidInput", `Not a project key: ${project}`);
    return join25(this.ctx.layerfs.root, "projects", store, name6);
  }
  get scratchAnchor() {
    return join25(this.ctx.layerfs.root, "scratch");
  }
  /** Whether `project` is the Scratch project. */
  isScratch(project) {
    return project === this.ctx.layerfs.scratchProject;
  }
  writeAnchor(dir, text6) {
    mkdirSync19(join25(dir, "sessions"), { recursive: true });
    const readme = join25(dir, "README.md");
    if (!existsSync17(readme)) writeFileSync17(readme, text6);
  }
  /**
   * The project's anchor directory (`<root>/projects/<store>/<name>`): the
   * parent of its sessions' scratch folders. It is a real directory but no
   * DSH workspace — sessions stay in whichever workspace they were placed in.
   */
  ensureAnchor(project) {
    const anchor = this.anchorOf(project);
    this.writeAnchor(anchor, `# ${project}

The DeepSeek Harness scratch area of LayerFS project \`${project}\`.

Each session works in its own LayerFS Workspace (branch \`dsh.<session>\`), used for project execution and checkpointed at the end of changed turns. \`sessions/<session>/\` is that
session's scratch folder: it is never saved into the project.
`);
    this.state.update((s) => {
      s.projects[project] ??= { project, anchor, createdAt: Date.now() };
    });
    return anchor;
  }
  /** The anchor a recorded project entry points at, once workspaces held them. */
  recordedWorkspace(project) {
    return this.state.read().projects[project]?.workspaceId;
  }
  /** List a session (an imported one) under a DSH workspace. Never throws. */
  async attach(workspaceId, sessionId) {
    if (this.placeOfId(sessionId)?.project) {
      await this.detach(sessionId);
      return;
    }
    if (!workspaceId) return;
    try {
      await this.ctx.workspaceRegistry.get(workspaceId)?.attachSession(sessionId);
    } catch (error2) {
      this.ctx.logger("layerfs").warn("session %s not listed in workspace %s: %s", sessionId, workspaceId, error2?.message ?? error2);
    }
  }
  /** Project ownership is independent of the folder selected as local scratch. */
  async detach(sessionId) {
    for (const workspace of this.ctx.workspaceRegistry?.list?.() ?? []) {
      if (workspace.sessionIds.includes(sessionId)) await workspace.detachSession(sessionId);
    }
  }
  /** Change the local folder's scratch role without moving project ownership. */
  async selectScratch(sessionId, cwd) {
    if (!this.placeOfId(sessionId)?.project) throw new CliError("InvalidInput", "Select a LayerFS project before choosing its scratch folder");
    if (!isAbsolute6(cwd) || !existsSync17(cwd) || !statSync8(cwd).isDirectory()) throw new CliError("ScratchUnavailable", "Select an existing absolute local directory");
    const agent = this.ctx.get?.("agents")?.get?.(sessionId);
    if (!agent) throw new CliError("Unavailable", "Open this project session before changing its scratch folder");
    const binding = this.binding(sessionId);
    if (binding?.kind === "shared") throw new CliError("InvalidInput", "Choose the scratch folder on the parent project session");
    if (binding?.mount && (real2(cwd) === real2(binding.mount) || real2(cwd).startsWith(`${real2(binding.mount)}/`))) {
      throw new CliError("InvalidInput", "Choose a local scratch folder outside the project mount");
    }
    await this.moveTo(agent, real2(cwd));
    if (binding) this.save({ ...binding, scratch: real2(cwd), scratchManaged: false });
    for (const child of Object.values(this.state.read().sessions)) {
      if (child.kind !== "shared" || child.parent !== sessionId) continue;
      const childAgent = this.ctx.get?.("agents")?.get?.(child.sessionId);
      if (childAgent) await this.moveTo(childAgent, real2(cwd));
      this.save({ ...child, scratch: real2(cwd), scratchManaged: false });
    }
    this.ctx.layerfs.emit("layerfs-session", { sessionId });
  }
  /** Ensure the Scratch workspace: a plain folder workspace for sessions without a project. */
  async ensureScratchWorkspace() {
    const anchor = this.scratchAnchor;
    this.writeAnchor(anchor, `# Scratch

A workspace for sessions without a LayerFS project: sessions here run as ordinary
DeepSeek Harness sessions in this folder.
`);
    const workspace = await this.ctx.workspaceRegistry.create(anchor, "Scratch");
    if (workspace.title !== "Scratch") await workspace.setTitle("Scratch");
    return { workspaceId: String(workspace.id), anchor };
  }
  /** Make the Scratch project (a SQLite Store on native, initialized empty) when it does not exist. */
  async ensureScratchProject() {
    const key = this.ctx.layerfs.scratchProject;
    this.scratchReady ??= (async () => {
      try {
        await this.lfs.project.get(key);
        return;
      } catch (error2) {
        if (error2?.code !== "NotFound") throw error2;
      }
      await this.ctx.layerfs.ensureNative();
      await this.lfs.store.create(key.split("/")[0]).catch((error2) => {
        if (!exists(error2)) throw error2;
      });
      const sources = join25(this.ctx.layerfs.root, "project-sources");
      mkdirSync19(sources, { recursive: true, mode: 448 });
      const empty = mkdtempSync2(join25(sources, "scratch-"));
      try {
        await this.lfs.project.init(key, empty).catch((error2) => {
          if (!exists(error2)) throw error2;
        });
      } finally {
        rmSync8(empty, { recursive: true, force: true });
      }
      this.ctx.layerfs.emit("storage-changed", { store: key.split("/")[0] });
    })();
    try {
      await this.scratchReady;
    } catch (error2) {
      this.scratchReady = void 0;
      throw error2;
    }
    return key;
  }
  /** Which project workspace a session `cwd` is, if it is one. */
  classify(cwd) {
    if (!cwd) return void 0;
    const at = real2(cwd);
    const root = real2(join25(this.ctx.layerfs.root, "projects"));
    for (const entry of Object.values(this.state.read().projects)) {
      if (!entry.workspaceId) continue;
      if (real2(entry.anchor) === at && at.startsWith(`${root}/`)) return { project: entry.project, anchor: entry.anchor };
    }
    return void 0;
  }
  /**
   * Record the project a session works in — the New Session control or a
   * Projects page names the blank/folder session it belongs to. `project`
   * `null` clears the choice; a recorded binding always outranks the pending
   * one, so a bound session cannot be re-placed this way.
   */
  async choose(sessionId, project, projectId, machine) {
    await this.lane(sessionId, () => this.chooseNow(sessionId, project, projectId, machine));
  }
  async chooseNow(sessionId, project, projectId, machine) {
    const live = this.ctx.sessions.get(sessionId);
    const bound = this.binding(sessionId);
    const persistence = this.ctx.get?.("sessionPersistence");
    const previous = bound?.project ?? this.state.read().pending[sessionId]?.project ?? persistence?.ownerOf?.(sessionId)?.project ?? null;
    let started = live?.snapshotEvents(0).some((e) => e.type === "turn/start") ?? false;
    if (!live && persistence?.local && await persistence.local.stat(sessionId)) {
      const reader = await persistence.local.open(sessionId, "read");
      try {
        started = (await reader.read()).events.some((e) => e.type === "turn/start");
      } finally {
        await reader.close();
      }
    }
    if (previous !== project && (bound || started)) {
      throw new CliError("SessionStarted", "Start a new session to change its project or switch to normal workspace mode");
    }
    if (!project && previous && live) {
      const original = live.header?.cwd;
      if (!original || !isAbsolute6(original) || !existsSync17(original) || !statSync8(original).isDirectory()) {
        throw new CliError("WorkspaceUnavailable", "Start a normal session in an existing local workspace");
      }
      const agent2 = this.ctx.get?.("agents")?.get?.(sessionId);
      if (agent2) await this.moveTo(agent2, original);
    }
    if (project) {
      if (projectId) await persistence?.catalog?.assert(project, projectId, { claim: true });
      await this.lfs.project.get(project);
      this.ensureAnchor(project);
    }
    await persistence?.migrateProject?.(live ?? sessionId, project);
    this.state.update((s) => {
      if (project) s.pending[sessionId] = { project, ...machine ? { machine } : {} };
      else delete s.pending[sessionId];
    });
    const agent = live ? this.ctx.get?.("agents")?.get?.(sessionId) : void 0;
    if (agent && previous !== project) await this.selectPreset(agent, !project);
    if (project && bound) await this.detach(sessionId);
    else if (!project && live?.header?.cwd) {
      const workspace = this.ctx.workspaceRegistry?.list?.().find((w) => real2(w.path) === real2(live.header.cwd));
      if (workspace) await workspace.attachSession(sessionId);
    }
    this.ctx.layerfs.emit("layerfs-session", { sessionId });
  }
  /**
   * Where a session works. In order: its existing binding; a bound parent's
   * Workspace (a subagent); the project it was placed in (`state.pending`);
   * a project anchor's `cwd` (a legacy project workspace or an imported
   * session); the place of the session it was forked from; otherwise a plain
   * folder (stock DSH).
   */
  placeOf(session) {
    const sessionId = String(session.id);
    const header = session.header ?? {};
    const existing = this.binding(sessionId);
    if (existing?.kind === "shared" && existing.parent) return { kind: "shared", parent: existing.parent, anchor: existing.anchor };
    if (existing?.project) return { kind: "project", project: existing.project, anchor: existing.anchor };
    if (existing) return { kind: "folder", cwd: existing.anchor };
    const parent = header.parentSession ? this.binding(String(header.parentSession)) : void 0;
    if (header.origin === "subagent" && parent) return { kind: "shared", parent: String(header.parentSession), anchor: header.cwd };
    const pending2 = this.state.read().pending[sessionId];
    if (pending2?.project) return { kind: "project", project: pending2.project, anchor: this.anchorOf(pending2.project) };
    const owner = this.ctx.get?.("sessionPersistence")?.ownerOf?.(sessionId);
    if (owner?.project) return { kind: "project", project: owner.project, anchor: this.anchorOf(owner.project) };
    const where = this.classify(header.cwd);
    if (where) return { kind: "project", ...where };
    if (parent?.project) return { kind: "project", project: parent.project, anchor: parent.anchor };
    return { kind: "folder", cwd: String(header.cwd ?? "") };
  }
  /**
   * The project a session works in, for the New Session control and the sidebar
   * row mark. A live session is asked for its place; one that is only
   * persisted answers from its recorded binding or its pending choice.
   */
  placeOfId(sessionId) {
    const persisted = this.binding(sessionId);
    const session = this.ctx.sessions.get(sessionId);
    if (!session) {
      if (persisted?.kind === "shared") return { project: this.binding(String(persisted.parent))?.project ?? persisted.project ?? null };
      if (persisted) return { project: persisted.project ?? null, ...persisted.project ? { scratch: persisted.scratch } : {} };
      const pending2 = this.state.read().pending[sessionId]?.project;
      const owner = this.ctx.get?.("sessionPersistence")?.ownerOf?.(sessionId);
      return pending2 || owner?.project ? { project: pending2 ?? owner.project } : null;
    }
    const place2 = this.placeOf(session);
    if (place2.kind === "shared") return { project: this.binding(place2.parent)?.project ?? null };
    if (place2.kind === "folder") return { project: null };
    return { project: place2.project, scratch: persisted?.scratch ?? this.ctx.workingDirectory?.get?.(session) ?? session.header?.cwd };
  }
  // ------------------------------------------------------------- binding
  binding(sessionId) {
    return this.state.read().sessions[sessionId];
  }
  checkpoints(sessionId) {
    return this.state.read().checkpoints[sessionId] ?? [];
  }
  simulationOf(sessionId) {
    return this.binding(sessionId)?.simulation ?? this.state.read().pending[sessionId]?.simulation;
  }
  /** Must precede agent creation so ownership is known before its first hook. */
  async prepareSimulation(sessionId, project, metadata) {
    const previous = this.placeOfId(sessionId)?.project;
    if (previous && previous !== project) throw new CliError("SessionStarted", "A script cannot change the session project");
    const current = this.binding(sessionId);
    if (current?.ws || current?.simulation && (current.simulation.runId !== metadata.runId || current.simulation.scriptId !== metadata.scriptId)) {
      throw new CliError("SessionStarted", "Start a fresh project session for a different script");
    }
    this.ensureAnchor(project);
    const simulation = { ...metadata, state: metadata.state ?? "running", handoffReady: false };
    this.state.update((s) => {
      s.pending[sessionId] = { project, simulation };
      if (s.sessions[sessionId]) s.sessions[sessionId].simulation = simulation;
    });
    const persistence = this.ctx.get?.("sessionPersistence");
    await persistence?.migrateProject?.(sessionId, project);
  }
  /** Final metadata precedes a fresh archive; normal mounting happens lazily. */
  async completeSimulation(sessionId, target, state, error2) {
    await this.lane(sessionId, async () => {
      const simulation = this.simulationOf(sessionId);
      if (!simulation) throw new CliError("NotFound", "This session has no script binding");
      if (target && (!["Commit", "Layer"].includes(target.kind) || !/^[a-f0-9]{66}$/.test(target.id) || !target.branch)) throw new CliError("InvalidInput", "A confirmed saved-version target is required");
      const next = { ...simulation, state, continuation: target, handoffReady: !!target, error: error2 };
      this.state.update((s) => {
        if (s.sessions[sessionId]) s.sessions[sessionId].simulation = next;
        if (s.pending[sessionId]) s.pending[sessionId].simulation = next;
      });
      await this.persistMetadata(sessionId);
    });
    this.store?.schedule(sessionId, 0);
  }
  /**
   * Whether a script owns this session right now (running, stopping or handing
   * off in this host). Any terminal state, a restart or an import leaves the
   * session free for a real model; the script never runs again.
   */
  isSimulationManaged(sessionId) {
    const simulation = this.simulationOf(sessionId);
    if (!simulation || simulation.state !== "running") return false;
    return this.ctx.get?.("layerfsSimulations")?.isActive?.(sessionId) === true;
  }
  save(binding) {
    binding.updatedAt = Date.now();
    this.state.update((s) => {
      s.sessions[binding.sessionId] = binding;
    });
    this.ctx.layerfs.emit("layerfs-session", { sessionId: binding.sessionId });
    return binding;
  }
  async record(sessionId, checkpoint) {
    this.state.update((s) => {
      (s.checkpoints[sessionId] ??= []).push(checkpoint);
    });
    await this.persistMetadata(sessionId);
    this.ctx.layerfs.emit("layerfs-checkpoint", { sessionId, checkpoint });
  }
  async persistMetadata(sessionId) {
    const persistence = this.ctx.get?.("sessionPersistence");
    await persistence?.updateSidecar?.(sessionId, (sidecar) => {
      const binding = this.binding(sessionId);
      sidecar.codeBranch = binding?.kind === "shared" && binding.parent ? this.binding(binding.parent)?.branch : binding?.branch;
      sidecar.bindingKind = binding?.kind;
      sidecar.sharedParent = binding?.kind === "shared" ? binding.parent : void 0;
      sidecar.checkpoints = this.checkpoints(sessionId);
      if (binding?.simulation) sidecar.simulation = binding.simulation;
    });
  }
  /**
   * Run host calls in `sessionId`'s trace context: each call gets a receipt
   * (and the log tag `dsh:<sessionId>:<receipt>`); `onInvocation` sees each
   * receipt before it is recorded, even when recording fails.
   */
  hostOperation(sessionId, project, turn, run2, onInvocation) {
    return withTraceContext({
      origin: "host",
      sessionId,
      project,
      workspace: this.binding(sessionId)?.ws,
      turn,
      record: async (invocation) => {
        onInvocation?.(invocation);
        const persistence = this.ctx.get?.("sessionPersistence");
        if (persistence?.recordInvocation) {
          await persistence.recordInvocation(invocation);
          this.ctx.layerfs.emit("layerfs-operation", { sessionId });
        }
      },
      onError: (e) => this.ctx.logger("layerfs").warn("record host operation: %s", String(e))
    }, run2);
  }
  /**
   * The machine a project's Sandboxes run on: a sqlite Store's machine; for a
   * PostgreSQL Store `preferred` (the session's own machine) when it has one,
   * else placement.ts's order: the project's last machine, a machine its
   * database was reached from, native; never a broken or stopped one.
   */
  async machineFor(project, preferred) {
    const info2 = await this.lfs.project.get(project, { detail: true });
    if (info2?.engine !== "postgresql") return info2?.machine ?? "native";
    if (preferred) return preferred;
    const [machines, store, sandboxes] = await Promise.all([
      machineRows(this.lfs),
      this.lfs.store.get(storeOf2(project), { detail: true }).catch(() => null),
      this.lfs.sandbox.list({ project, detail: true }).then((r) => r?.items ?? [], () => [])
    ]);
    return pgPlacement(machines, { last: lastUsed(sandboxes), reached: reachedFrom(store) });
  }
  /**
   * Make sure the session's Sandbox runs and its Workspace is mounted on its
   * branch. Answers the mount's host path on `native`; on any other machine the
   * mount lives inside the Sandbox, the session works through the LayerFS CLI
   * (`workspace.exec`, `file.*`) and its working directory stays its scratch
   * folder, so the answer is undefined.
   */
  async mount(binding) {
    const held = this.ctx.layerfs.exclusive?.();
    if (held) throw new CliError("ConnectBusy", held);
    const { project, sandbox, branch } = binding;
    const native = (binding.machine ?? "native") === "native";
    if (native) await this.ctx.layerfs.ensureNative();
    let observed;
    try {
      observed = await sandboxWorkspaces(this.lfs, sandbox);
    } catch (error2) {
      if (error2?.code !== "NotFound") throw error2;
    }
    if (!observed || observed.state === "broken") {
      if (observed) await this.lfs.sandbox.remove(sandbox, { force: true }).catch(() => {
      });
      const machine = binding.machine ?? "native";
      await this.lfs.sandbox.create(project, sandbox, machine !== "native" ? { machine } : {});
      observed = { workspaces: [] };
    }
    const handle2 = `${sandbox}:${WS_NAME}`;
    const existing = (observed.workspaces ?? []).find((w) => w.workspace === handle2);
    if (existing && existing.branch === branch && existing.path) {
      binding.ws = handle2;
      return native ? existing.path : void 0;
    }
    if (existing) await this.lfs.workspace.unmount(handle2, { force: true, discard: false }).catch(() => this.lfs.workspace.unmount(handle2, { force: true, discard: true }));
    const mounted = await this.lfs.workspace.mount(sandbox, branch, { name: WS_NAME, detail: true });
    binding.base ??= mounted.commit ?? mounted.base_layer ?? null;
    if (typeof mounted.workspace === "string") binding.ws = mounted.workspace;
    return native ? mounted.path : void 0;
  }
  /**
   * Recompose a project session's Agent under the `layerfs` preset while the
   * session is still blank. `leaving` instead moves a blank session that
   * leaves its project off `layerfs` (see {@link enforceFolderPreset}).
   */
  async selectPreset(agent, leaving = false) {
    if (leaving) return this.enforceFolderPreset(agent);
    const presets3 = this.ctx.get?.("agentPresets");
    if (!presets3?.select || !isFresh(agent)) return;
    try {
      await presets3.select(agent, "layerfs");
    } catch (error2) {
      this.ctx.logger("layerfs").warn("session %s: layerfs preset not applied: %s", String(agent.id), error2?.message ?? error2);
    }
  }
  /**
   * The `layerfs` preset belongs to project sessions only. A blank session with
   * no project that ends up on it (picked in the New Session row, the configured
   * default, or left from a cleared project) moves to the default preset, or to
   * the first other working preset when `layerfs` is the default. A started
   * session keeps the composition its history was produced under.
   */
  async enforceFolderPreset(agent) {
    const presets3 = this.ctx.get?.("agentPresets");
    if (!presets3?.select || !agent?.session || !isFresh(agent)) return;
    if (this.placeOf(agent.session).kind !== "folder") return;
    if (presets3.presetForSession?.(agent.session) !== "layerfs") return;
    let wanted = presets3.defaultId;
    if (!wanted || wanted === "layerfs") {
      const roster = await presets3.list?.().catch(() => []) ?? [];
      wanted = roster.find((p) => p.id !== "layerfs" && !p.broken)?.id;
    }
    if (!wanted) return;
    try {
      await presets3.select(agent, wanted);
    } catch (error2) {
      this.ctx.logger("layerfs").warn("session %s: %s preset not applied: %s", String(agent.id), wanted, error2?.message ?? error2);
    }
  }
  /**
   * Bind a session's Agent to its place and move it into its Workspace.
   * With `strict` a failure throws (the step must not run outside the
   * Workspace); otherwise it is recorded on the binding and shown in the panel.
   */
  async bindAgent(agent, source, strict = false) {
    const sessionId = String(agent.id);
    const persistence = this.ctx.get?.("sessionPersistence");
    if (!this.binding(sessionId) && persistence?.ownerOf?.(sessionId)) {
      const metadata = await persistence.readSidecar(sessionId);
      if (metadata?.simulation) {
        const simulation = { ...metadata.simulation };
        if (simulation.state === "running") {
          simulation.state = "interrupted";
          simulation.handoffReady = false;
          simulation.continuation = void 0;
        }
        this.state.update((s) => {
          s.pending[sessionId] = { project: metadata.project, simulation };
        });
      }
      if (metadata?.bindingKind === "shared" && metadata.sharedParent) {
        this.save({ sessionId, kind: "shared", project: metadata.project, parent: metadata.sharedParent, anchor: this.anchorOf(metadata.project), scratch: "", state: "closed", simulation: this.state.read().pending[sessionId]?.simulation, createdAt: Date.now(), updatedAt: Date.now() });
      }
    }
    const place2 = this.placeOf(agent.session);
    if (place2.kind === "folder") return void await this.enforceFolderPreset(agent);
    if (!strict) {
      if (place2.kind === "project" && !this.binding(sessionId)) {
        const metadata = await persistence?.readSidecar?.(sessionId).catch(() => void 0);
        const anchor = this.ensureAnchor(place2.project);
        const selected = this.selectedScratch(agent, anchor);
        this.save({
          sessionId,
          kind: "project",
          project: place2.project,
          projectId: persistence?.projectIdOf?.(sessionId),
          anchor,
          ...selected,
          branch: metadata?.codeBranch,
          sandbox: metadata?.codeBranch ? sandboxOf2(sessionId) : void 0,
          simulation: metadata?.simulation,
          state: "closed",
          executionState: "inactive",
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        if (metadata?.checkpoints) this.state.update((s) => {
          s.checkpoints[sessionId] ??= metadata.checkpoints;
        });
      }
      if (place2.kind === "project") await this.selectPreset(agent);
      return;
    }
    await this.lane(sessionId, async () => {
      try {
        await this.validateExecutionIdentity(sessionId);
        const preparing = this.binding(sessionId);
        if (preparing?.kind === "project") this.save({ ...preparing, executionState: "activating" });
        if (this.isSimulationManaged(sessionId)) return await this.bindSimulation(agent, place2);
        if (place2.kind === "shared") return await this.bindShared(agent, place2.parent, place2.anchor, strict);
        await this.hostOperation(sessionId, place2.project, void 0, () => this.bindProject(agent, place2.project, place2.anchor, source));
      } catch (error2) {
        const previous = this.binding(sessionId);
        this.ctx.logger("layerfs").warn("session %s: bind failed: %s", sessionId, error2?.message ?? error2);
        if (place2.kind === "project") {
          this.save({
            ...previous ?? { sessionId, kind: "project", anchor: place2.anchor, scratch: join25(place2.anchor, "sessions", sessionId), createdAt: Date.now(), updatedAt: Date.now() },
            project: place2.project,
            executionState: "interrupted",
            state: "failed",
            error: String(error2?.message ?? error2)
          });
        }
        if (strict) throw error2;
      }
    });
  }
  /**
   * Whether a session may run now: bound, else it throws. At pre-step (a new
   * message) a closed or interrupted context is re-activated; a tool call passes
   * `rebind: false` so access returning mid-turn never restarts execution.
   */
  async ensureBound(agent, options = {}) {
    const sessionId = String(agent.id);
    await this.settled(sessionId);
    if (this.placeOf(agent.session ?? { id: sessionId }).kind === "folder" && !this.simulationOf(sessionId)) return;
    const held = this.ctx.layerfs.exclusive?.();
    if (held) throw new CliError("ConnectBusy", held);
    await this.validateExecutionIdentity(sessionId, { recent: true });
    if (this.isSimulationManaged(sessionId)) {
      if (agent.model?.current?.()?.provider !== "simulation") throw new CliError("Busy", "Stop the active project script before changing its model");
      if (this.binding(sessionId)?.state !== "bound") return await this.bindAgent(agent, "pre-step", true);
      await this.detach(sessionId);
      return;
    }
    let b = this.binding(sessionId);
    if (b?.kind === "shared" && b.parent) b = this.binding(b.parent);
    if (b?.state === "bound" && b.ws && (b.mount ? existsSync17(b.mount) : true)) {
      const provider = this.ctx.get?.("sessionPersistence");
      const usable = !provider?.assertSessionIdentity || await this.lfs.workspace.status(b.ws).then(() => true, () => false);
      if (usable) {
        await this.detach(sessionId);
        return;
      }
      this.interrupt(b.sessionId, "The execution workspace was lost. A new message reconnects it.", "availability");
    }
    if (options.rebind === false) {
      const owner = b ? this.binding(b.sessionId) : void 0;
      throw new CliError("Unavailable", owner?.error ?? "Project execution is not active. Send a new message to activate it.");
    }
    await this.bindAgent(agent, "pre-step", true);
  }
  /** When each bound session's identity and readiness last passed (pre-step checks reuse it briefly). */
  identityChecked;
  /**
   * The session's Store, project and latest checkpoint are still its own, and its machine
   * and Store are ready. `recent`: a bound session that passed within `IDENTITY_FRESH_MS`
   * passes again without reads (every agent step of a team run calls this; each check is
   * five Store and machine reads queued behind that Store's other work).
   */
  async validateExecutionIdentity(sessionId, options = {}) {
    const persistence = this.ctx.get?.("sessionPersistence");
    let binding = this.binding(sessionId);
    while (binding?.kind === "shared" && binding.parent) binding = this.binding(binding.parent);
    const id = binding?.sessionId ?? sessionId;
    const checked = this.identityChecked ??= /* @__PURE__ */ new Map();
    const passed = checked.get(id);
    if (options.recent && passed && binding?.state === "bound" && Date.now() - passed < IDENTITY_FRESH_MS) return;
    checked.delete(id);
    try {
      const row = await persistence?.assertSessionIdentity?.(id);
      if (row) {
        const machine = row.kind === "postgresql" ? binding?.machine ?? "native" : row.machine ?? "native";
        await this.assertReady(row, machine);
        if (binding?.branch) {
          const latest = [...this.checkpoints(id)].reverse().find((checkpoint) => checkpoint.commit && !checkpoint.error);
          if (latest?.commit) await this.lfs.file.list(row.key, latest.branch ?? binding.branch, "/", { at: latest.commit, limit: 1 }).catch(() => {
            throw new CliError("CheckpointUnavailable", "The latest saved file checkpoint is unavailable in this Store. History and checkpoint references are retained; recover that checkpoint before continuing.");
          });
        }
        if (binding && binding.machine && binding.machine !== machine) this.save({ ...binding, machine, state: "closed", executionState: "inactive", mount: void 0, ws: void 0 });
      }
      checked.set(id, Date.now());
    } catch (error2) {
      const message = String(error2?.message ?? error2);
      const kind = error2?.code === "Unavailable" ? "availability" : "blocked";
      const current = binding ? this.binding(binding.sessionId) : void 0;
      if (kind === "availability" && current?.state === "bound" && current.ws && await this.lfs.workspace.status(current.ws).then(() => true, () => false)) {
        this.ctx.logger("layerfs").warn("session %s: readiness check failed while its Workspace answers; keeping execution: %s", current.sessionId, message);
        checked.set(id, Date.now());
        return;
      }
      if (current?.state === "bound") this.interrupt(current.sessionId, message, kind);
      else if (current) this.save({ ...current, error: message, interruption: { kind, at: Date.now() } });
      throw error2;
    }
  }
  async bindSimulation(agent, place2) {
    const sessionId = String(agent.id), simulation = this.simulationOf(sessionId);
    const parent = simulation.rootSessionId ?? (place2.kind === "shared" ? place2.parent : void 0);
    const root = parent ? this.binding(parent) : void 0;
    const project = place2.kind === "project" ? place2.project : root?.project;
    if (!project) throw new CliError("Unavailable", "The script parent project is unavailable");
    const anchor = this.anchorOf(project), existing = this.binding(sessionId);
    const selected = root ? { scratch: root.scratch, scratchManaged: root.scratchManaged } : this.selectedScratch(agent, anchor, existing);
    await this.ctx.get?.("sessionPersistence")?.migrateProject?.(agent.session, project);
    this.save({
      sessionId,
      kind: parent ? "shared" : "project",
      ...parent ? { parent } : {},
      project,
      anchor,
      ...selected,
      state: "bound",
      simulation,
      createdAt: existing?.createdAt ?? Date.now(),
      updatedAt: Date.now()
    });
    this.state.update((s) => {
      delete s.pending[sessionId];
    });
    await this.persistMetadata(sessionId);
    await this.selectPreset(agent);
    await this.moveTo(agent, selected.scratch);
    await this.detach(sessionId);
  }
  scratchFor(anchor, sessionId) {
    const dir = join25(anchor, "sessions", sessionId);
    mkdirSync19(dir, { recursive: true });
    return dir;
  }
  /** The selected folder is scratch on every machine; generated scratch is a fallback. */
  selectedScratch(agent, anchor, previous) {
    if (previous?.scratch && existsSync17(previous.scratch) && statSync8(previous.scratch).isDirectory()) return { scratch: previous.scratch, scratchManaged: previous.scratchManaged === true };
    const cwd = this.ctx.workingDirectory?.get(agent.session) ?? agent.session.header?.cwd;
    if (cwd && isAbsolute6(cwd) && !this.classify(cwd)) {
      if (!existsSync17(cwd) || !statSync8(cwd).isDirectory()) throw new CliError("ScratchUnavailable", "Select an existing local folder to use as scratch for this project session");
      return { scratch: cwd, scratchManaged: false };
    }
    return { scratch: this.scratchFor(anchor, String(agent.id)), scratchManaged: true };
  }
  /** Move the session's working directory: silently before its first turn, with DSH's notice afterwards. */
  async moveTo(agent, dir) {
    const wd = this.ctx.workingDirectory;
    if (wd.get(agent.session) === dir) return;
    const fresh = !agent.session.snapshotEvents(0).some((e) => e.type === "turn/start");
    if (fresh) agent.session.append("working-directory/change", { cwd: dir });
    else await wd.set(agent, dir);
  }
  async bindShared(agent, parent, anchor, strict) {
    const sessionId = String(agent.id);
    let root = this.binding(parent);
    while (root?.kind === "shared" && root.parent) root = this.binding(root.parent);
    if (root?.simulation && !this.isSimulationManaged(root.sessionId) && !root.ws) {
      const parentAgent = this.ctx.get?.("agents")?.get?.(root.sessionId);
      if (parentAgent) {
        await this.bindAgent(parentAgent, "child-handoff", strict);
        root = this.binding(root.sessionId);
      }
    }
    if (!root || root.state !== "bound" || !(root.mount ?? root.scratch)) {
      if (strict) throw new CliError("Unavailable", "The parent session's LayerFS Workspace is not bound");
      return;
    }
    await this.ctx.get?.("sessionPersistence")?.migrateProject?.(agent.session, root.project);
    this.save({ sessionId, kind: "shared", anchor, parent: root.sessionId, scratch: root.scratch, project: root.project, mount: root.mount, simulation: this.simulationOf(sessionId), projectId: this.ctx.get?.("sessionPersistence")?.projectIdOf?.(sessionId), executionState: "active", state: "bound", createdAt: Date.now(), updatedAt: Date.now() });
    await this.persistMetadata(sessionId);
    await this.moveTo(agent, root.scratch);
    await this.detach(sessionId);
  }
  async bindProject(agent, project, anchor, source) {
    const sessionId = String(agent.id);
    const held = this.ctx.layerfs.exclusive?.();
    if (held) throw new CliError("ConnectBusy", held);
    if (this.isScratch(project)) await this.ensureScratchProject();
    const header = agent.session.header;
    let existing = this.binding(sessionId);
    const persistence = this.ctx.get?.("sessionPersistence");
    if (!existing && persistence?.ownerOf?.(sessionId)) {
      const metadata = await persistence.readSidecar(sessionId);
      if (!metadata?.codeBranch && !metadata?.simulation && !this.state.read().pending[sessionId] && agent.session.snapshotEvents(0).some((e) => e.type === "turn/end")) {
        throw new CliError("RecoveryRequired", "This project conversation has no saved file-context metadata; recover its LayerFS annotations before continuing");
      }
      if (metadata?.checkpoints) this.state.update((s) => {
        s.checkpoints[sessionId] = metadata.checkpoints;
      });
      if (metadata?.codeBranch) {
        existing = {
          sessionId,
          kind: "project",
          project,
          anchor,
          scratch: "",
          branch: metadata.codeBranch,
          machine: await this.machineFor(project),
          sandbox: metadata.simulation ? this.simulationSandbox(sessionId) : sandboxOf2(sessionId),
          ws: `${metadata.simulation ? this.simulationSandbox(sessionId) : sandboxOf2(sessionId)}:${WS_NAME}`,
          state: "closed",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          simulation: metadata.simulation
        };
      }
    }
    if (!existing?.branch && persistence?.ownerOf?.(sessionId) && !this.state.read().pending[sessionId] && !this.simulationOf(sessionId) && agent.session.snapshotEvents(0).some((e) => e.type === "turn/end")) {
      throw new CliError("RecoveryRequired", "This conversation has no confirmed saved file context. Recover its annotations before continuing; execution cannot start from the current project files.");
    }
    const selected = this.selectedScratch(agent, anchor, existing);
    const { scratch } = selected;
    await persistence?.migrateProject?.(agent.session, project);
    let binding;
    let forkReceipt;
    if (existing?.branch && existing.sandbox) {
      const resolved = await persistence?.assertSessionIdentity?.(sessionId);
      binding = { ...existing, ...selected, machine: resolved ? resolved.kind === "postgresql" ? existing.machine ?? "native" : resolved.machine ?? "native" : existing.machine, state: existing.state };
    } else {
      const machine = await this.machineFor(project, existing?.machine ?? this.state.read().pending[sessionId]?.machine);
      const sandbox = this.simulationOf(sessionId) ? this.simulationSandbox(sessionId) : sandboxOf2(sessionId);
      const branch = existing?.resumeFromArchive ? `${branchOf(sessionId)}.resume.${randomUUID12().replaceAll("-", "").slice(0, 12)}` : branchOf(sessionId);
      const start = this.forkSource(sessionId, header, project);
      try {
        forkReceipt = await this.tracedFork(sessionId, project, 0, branch, start.branch ?? "main", start.commit ?? null);
      } catch (error2) {
        if (!exists(error2)) throw error2;
      }
      binding = {
        sessionId,
        kind: "project",
        project,
        anchor,
        ...selected,
        machine,
        branch,
        simulation: this.simulationOf(sessionId),
        sandbox,
        ws: `${sandbox}:${WS_NAME}`,
        state: "bound",
        createdAt: existing?.createdAt ?? Date.now(),
        updatedAt: Date.now(),
        ...start.session ? { from: { session: start.session, commit: start.commit, turn: start.turn } } : {}
      };
    }
    binding.mount = await this.mount(binding);
    this.state.update((s) => {
      delete s.pending[sessionId];
    });
    binding.state = "bound";
    binding.executionState = "active";
    binding.projectId = persistence?.projectIdOf?.(sessionId);
    delete binding.error;
    delete binding.interruption;
    this.save(binding);
    if (!this.checkpoints(sessionId).length) {
      await this.record(sessionId, {
        kind: "base",
        turn: 0,
        seq: agent.session.seq,
        endSeq: agent.session.seq,
        commit: binding.from?.commit ?? binding.simulation?.continuation?.id ?? binding.base ?? null,
        branch: binding.branch,
        changed: 0,
        at: Date.now(),
        message: binding.from ? `Forked from turn ${binding.from.turn ?? "?"}` : `Started from ${project}`,
        ...forkReceipt ? { receipt: forkReceipt } : {}
      });
    }
    await this.persistMetadata(sessionId);
    await this.selectPreset(agent);
    await this.moveTo(agent, scratch);
    await this.detach(sessionId);
    void source;
  }
  /** Where a new session's files start: a pending fork, a DSH fork's checkpoint, or `main`. */
  forkSource(sessionId, header, project) {
    const simulation = this.simulationOf(sessionId);
    if (simulation?.handoffReady && simulation.continuation) {
      return { branch: simulation.continuation.branch, commit: simulation.continuation.id };
    }
    if (simulation) return {};
    const pending2 = this.state.read().pending[sessionId];
    if (pending2 && pending2.project === project) return { branch: pending2.branch, commit: pending2.commit, session: pending2.session, turn: pending2.turn };
    const parent = header.parentSession ? String(header.parentSession) : void 0;
    const parentBinding = parent ? this.binding(parent) : void 0;
    if (!parent || !parentBinding || parentBinding.project !== project) return {};
    const inherited = Number(header.inheritedEventCount ?? this.ctx.sessions.get(sessionId)?.inheritedEventCount ?? Infinity);
    const points = this.checkpoints(parent).filter((c) => c.commit && (c.endSeq ?? c.seq) < inherited);
    const point = points.at(-1);
    if (!point) return { branch: parentBinding.branch ?? null, session: parent, turn: 0 };
    return { branch: point.branch, commit: point.kind === "base" ? null : point.commit, session: parent, turn: point.turn };
  }
  // ------------------------------------------------------------- checkpoints
  /**
   * Save the session's Workspace as a checkpoint. `turn` checkpoints of
   * unchanged turns record no commit.
   */
  async checkpoint(sessionId, kind, turn, message) {
    if (this.isSimulationManaged(sessionId)) return void 0;
    const binding = this.binding(sessionId);
    if (!binding || binding.kind !== "project" || binding.state !== "bound" || !binding.ws) return void 0;
    const session = this.ctx.sessions.get(sessionId);
    const seq = session?.seq ?? 0;
    let checkpoint;
    let receipt;
    try {
      await this.ctx.get?.("sessionPersistence")?.assertSessionIdentity?.(sessionId);
      const status = await this.lfs.workspace.status(binding.ws, { detail: true });
      const entries2 = Number(status?.changes_count ?? (Array.isArray(status?.changes) ? status.changes.length : 0)) || 0;
      if (!entries2 && !status?.pending_merge && !status?.branch_moved && kind === "turn") return void 0;
      const result = await this.hostOperation(sessionId, binding.project, turn, () => this.lfs.workspace.commit(binding.ws, { message, detail: true }), (invocation) => {
        receipt = invocation.id;
      });
      const commit = typeof result?.commit === "string" ? result.commit : null;
      const changed = result?.unchanged !== true ? Math.max(entries2, 1) : status?.branch_moved && commit ? await this.pathsChanged(binding.project, status.commit ?? status.base_layer, commit) : 0;
      checkpoint = { kind, turn, seq, commit, branch: binding.branch, changed, message, at: Date.now(), ...receipt ? { receipt } : {} };
      if (commit && binding.simulation?.handoffReady) {
        this.state.update((s) => {
          s.sessions[sessionId].simulation.continuation = { kind: "Commit", id: commit, branch: binding.branch };
        });
      }
    } catch (error2) {
      checkpoint = { kind, turn, seq, commit: null, branch: binding.branch, changed: 0, message, at: Date.now(), error: errorOf(error2), ...receipt ? { receipt } : {} };
    }
    await this.record(sessionId, checkpoint);
    return checkpoint;
  }
  /** Files that differ between two saved versions (one page, so at most 1000); 1 when unknown. */
  async pathsChanged(project, from, to) {
    if (!from || from === to) return from ? 0 : 1;
    try {
      const page = await this.lfs.commit.diff(project, to, { from, limit: 1e3, detail: true });
      const files = (page?.items ?? []).filter((item) => item?.type !== "dir").length;
      return Math.max(files, page?.items?.length ? 1 : 0);
    } catch {
      return 1;
    }
  }
  /** `turn/end` seen: complete the turn's checkpoint with its boundary seq. */
  markTurnEnd(sessionId, turn, seq) {
    const list4 = this.state.read().checkpoints[sessionId];
    if (!list4?.some((c) => c.kind === "turn" && c.turn === turn && c.endSeq === void 0)) return;
    this.state.update((s) => {
      for (const c of s.checkpoints[sessionId] ?? []) if (c.kind === "turn" && c.turn === turn && c.endSeq === void 0) c.endSeq = seq;
    });
    void this.persistMetadata(sessionId).catch((e) => this.ctx.logger("layerfs").warn("persist checkpoint boundary: %s", String(e)));
  }
  /**
   * Restore the session's files to a checkpoint: save current changes, fork a
   * new Branch from the checkpoint and remount it in place.
   */
  async restore(sessionId, commit) {
    if (this.isSimulationManaged(sessionId)) throw new CliError("Busy", "Stop script execution and establish its continuation context before restoring files");
    return await this.lane(sessionId, async () => {
      const binding = this.binding(sessionId);
      if (!binding || binding.kind !== "project" || !binding.project || !binding.sandbox) throw new CliError("InvalidInput", "This session has no LayerFS Workspace");
      await this.validateExecutionIdentity(sessionId);
      const target = this.checkpoints(sessionId).find((c) => c.commit === commit);
      if (!target) throw new CliError("NotFound", "No such checkpoint in this session");
      const session = this.ctx.sessions.get(sessionId);
      if (binding.state === "bound") {
        const saved = await this.checkpoint(sessionId, "manual", this.lastTurn(sessionId), "Saved before restore");
        if (saved?.error) throw new CliError(saved.error.code, saved.error.message);
      }
      const generation = (binding.restores ?? 0) + 1;
      const branch = branchOf(sessionId, generation);
      const receipt = await this.tracedFork(sessionId, binding.project, this.lastTurn(sessionId), branch, target.branch ?? binding.branch ?? "main", commit);
      const forked = { ...binding, branch, restores: generation, base: void 0, mount: void 0, ws: void 0, state: "closed", executionState: "activating", error: void 0, interruption: void 0 };
      if (forked.simulation?.handoffReady) forked.simulation = { ...forked.simulation, continuation: { kind: target.kind === "base" ? forked.simulation.continuation?.kind ?? "Commit" : "Commit", id: commit, branch } };
      this.save(forked);
      await this.record(sessionId, {
        kind: "restore",
        turn: target.turn,
        seq: session?.seq ?? 0,
        endSeq: session?.seq ?? 0,
        commit,
        branch,
        changed: 0,
        at: Date.now(),
        message: `Restored files to ${target.kind === "base" ? "the start" : `turn ${target.turn}`}`,
        ...receipt ? { receipt } : {}
      });
      await this.lfs.workspace.unmount(`${binding.sandbox}:${WS_NAME}`, { discard: true, force: true }).catch(() => {
      });
      const next = { ...forked, ws: binding.ws ?? `${binding.sandbox}:${WS_NAME}`, state: "bound", executionState: "active" };
      next.mount = await this.mountOrFail(forked, next);
      this.save(next);
      const agent = this.ctx.get("agents")?.get?.(sessionId);
      if (agent) {
        await this.moveTo(agent, next.scratch);
        try {
          const { createUserMessage: createUserMessage2 } = await import("@deepseek-ai/dsh-llm");
          agent.inject(createUserMessage2({ content: [{ type: "text", text: `The project files were restored to the checkpoint of ${target.kind === "base" ? "the session start" : `turn ${target.turn}`}. Changes made after it are no longer in the project Workspace.` }], source: { kind: "working-directory" } }));
        } catch {
        }
      }
      return next;
    });
  }
  /**
   * Mount `next` (a freshly forked branch). A failed mount keeps `forked` (its
   * new branch, no Workspace) as `failed`, so the next message re-mounts that branch.
   */
  async mountOrFail(forked, next) {
    try {
      return await this.mount(next);
    } catch (error2) {
      this.save({ ...forked, state: "failed", executionState: "interrupted", error: `Mounting the project files failed: ${errorOf(error2).message}. A new message mounts them again.` });
      throw error2;
    }
  }
  /** {@link forkAt} as a host operation of `sessionId`: answers the successful fork's receipt id. */
  async tracedFork(sessionId, project, turn, branch, from, commit) {
    let receipt;
    await this.hostOperation(sessionId, project, turn, () => this.forkAt(project, branch, from, commit), (invocation) => {
      if (invocation.operation === "branch.fork" && invocation.outcome === "success") receipt = invocation.id;
    });
    return receipt;
  }
  /** Fork `branch` at a commit (or base Layer) id: from the branch that holds it, else from `main`. */
  async forkAt(project, branch, from, commit) {
    if (!commit) {
      await this.lfs.branch.fork(project, branch, from);
      return;
    }
    try {
      await this.lfs.branch.fork(project, branch, from, { at: commit });
    } catch (error2) {
      if (from === "main" || exists(error2)) throw error2;
      await this.lfs.branch.fork(project, branch, "main", { at: commit });
    }
  }
  lastTurn(sessionId) {
    const session = this.ctx.sessions.get(sessionId);
    let turn = 0;
    for (const e of session?.snapshotEvents?.(0) ?? []) if (e.type === "turn/end" || e.type === "turn/start") turn = Math.max(turn, Number(e.data?.turn ?? 0));
    return turn;
  }
  /**
   * Branch the conversation and its files at a checkpoint: a DSH session fork
   * at the checkpoint's turn end, whose files start from the checkpoint.
   */
  async branchAt(sessionId, commit, turn) {
    if (this.isSimulationManaged(sessionId)) throw new CliError("Busy", "Stop script execution before forking its conversation");
    const binding = this.binding(sessionId);
    if (!binding?.project) throw new CliError("InvalidInput", "This session has no LayerFS project");
    await this.validateExecutionIdentity(sessionId);
    const target = this.checkpoints(sessionId).find((c) => c.turn === turn && (commit === null || c.commit === commit));
    if (!target) throw new CliError("NotFound", "No such checkpoint in this session");
    const controller = this.ctx.get?.("sessionController");
    if (!controller?.fork) throw new CliError("Unavailable", "DSH session forking is not available in this profile");
    const atSeq = target.kind === "base" ? void 0 : target.endSeq;
    if (target.kind !== "base" && atSeq === void 0) throw new CliError("Busy", "That turn has not ended yet");
    const start = { project: binding.project, commit: target.kind === "base" ? target.commit ?? null : target.commit, branch: target.branch, session: sessionId, turn: target.turn };
    const forked = await controller.fork({ sessionId, ...atSeq !== void 0 ? { atSeq } : {} });
    const child = String(forked.sessionId);
    this.state.update((s) => {
      s.pending[child] = start;
    });
    await this.lane(child, async () => {
      const bound = this.binding(child);
      if (!bound || bound.kind !== "project" || !bound.sandbox) return;
      if (bound.from?.session === sessionId && bound.from.turn === target.turn) return;
      const branch = branchOf(child, (bound.restores ?? 0) + 1);
      const receipt = await this.tracedFork(child, start.project, 0, branch, start.branch ?? "main", start.commit);
      const forked2 = { ...bound, branch, restores: (bound.restores ?? 0) + 1, base: void 0, from: { session: sessionId, commit: start.commit, turn: target.turn }, mount: void 0, ws: void 0, state: "closed", executionState: "activating", error: void 0, interruption: void 0 };
      this.save(forked2);
      await this.persistMetadata(child);
      await this.lfs.workspace.unmount(`${bound.sandbox}:${WS_NAME}`, { discard: true, force: true }).catch(() => {
      });
      const next = { ...forked2, ws: bound.ws ?? `${bound.sandbox}:${WS_NAME}`, state: "bound", executionState: "active" };
      next.mount = await this.mountOrFail(forked2, next);
      this.save(next);
      this.state.update((s) => {
        delete s.pending[child];
        s.checkpoints[child] = [{ kind: "base", turn: 0, seq: 0, endSeq: 0, commit: start.commit ?? next.base ?? null, branch, changed: 0, at: Date.now(), message: `Forked from turn ${target.turn}`, ...receipt ? { receipt } : {} }];
      });
      await this.persistMetadata(child);
      const agent = this.ctx.get("agents")?.get?.(child);
      if (agent) await this.moveTo(agent, next.scratch);
    });
    return { sessionId: child };
  }
  // ------------------------------------------------------------- lifecycle
  /**
   * Deactivate an owner's execution and its subagents' shared bindings: drop the
   * mount and Workspace handles, keep the Sandbox name, branch, checkpoints and
   * ownership. Nothing is closed, saved or replayed; the next message re-activates
   * (re-mounting the retained branch, or recreating a gone Sandbox).
   */
  interrupt(ownerId, reason, kind) {
    const bindings = this.state.read().sessions;
    for (const binding of Object.values(bindings)) {
      if (binding.sessionId !== ownerId && !(binding.kind === "shared" && binding.parent === ownerId)) continue;
      this.save({ ...binding, state: "closed", executionState: "interrupted", mount: void 0, ws: void 0, error: reason, interruption: { kind, at: Date.now() } });
    }
  }
  /** Owner bindings (not subagents' shared ones) matching `test`. */
  owners(test) {
    return Object.values(this.state.read().sessions).filter((b) => b.kind === "project" && test(b));
  }
  /** A confirmed stop invalidates mounts, never conversation ownership.
   * No checkpoint or worker call is possible after its machine has stopped. */
  machinesStopped(machines) {
    const stopped = new Set(machines);
    for (const owner of this.owners((b) => !!b.sandbox && stopped.has(b.machine ?? "native") && (b.state === "bound" || !!b.ws))) {
      this.interrupt(owner.sessionId, `Machine ${owner.machine ?? "native"} was stopped. Execution was interrupted; send a new message after it is started again.`, "availability");
    }
  }
  /** A forced Sandbox close releases only its own execution handles. */
  sandboxClosed(sandbox) {
    for (const owner of this.owners((b) => b.sandbox === sandbox)) {
      this.interrupt(owner.sessionId, "The session Sandbox was closed. Execution was interrupted; a new message starts it again.", "sandbox");
    }
  }
  /**
   * One read-only availability pass over the Stores of project conversations.
   * An active conversation whose Store is unavailable or removed is deactivated
   * (`interrupted`); once the Store answers again its stale error is cleared, and
   * execution waits for a new message. Never starts a machine, mounts or replays.
   * Emits `layerfs-availability` when any watched Store's health changes.
   */
  refreshAvailability() {
    this.availabilityRun ??= this.pollAvailability().finally(() => {
      this.availabilityRun = void 0;
    });
    return this.availabilityRun;
  }
  /** The last observed health of each watched Store. */
  availability() {
    return Object.fromEntries(this.storeHealth);
  }
  /** Whether any conversation needs availability polling (active, or waiting to clear an availability error). */
  watchesAvailability() {
    return this.owners((b) => !!b.project && !b.simulation && (b.state === "bound" || b.interruption?.kind === "availability" && !!b.error)).length > 0;
  }
  async pollAvailability() {
    if (this.ctx.layerfs.exclusive?.()) return;
    const watched = this.owners((b) => !!b.project && !b.simulation && (b.state === "bound" || b.interruption?.kind === "availability" && !!b.error));
    const stores2 = new Set(watched.map((b) => storeOf2(b.project)).filter((s) => !!s));
    if (!stores2.size) return;
    let rows2;
    try {
      rows2 = (await this.lfs.store.list({ detail: true }))?.items ?? [];
    } catch (error2) {
      this.ctx.logger("layerfs").warn("availability: store list: %s", String(error2?.message ?? error2));
      return;
    }
    let changed = false;
    for (const name6 of stores2) {
      const row = rows2.find((r) => r?.store === name6);
      let live;
      const askServer = row?.engine === "postgresql" && Date.now() - (this.serverChecked.get(name6) ?? 0) >= 6e4;
      if (askServer) {
        this.serverChecked.set(name6, Date.now());
        live = await this.lfs.store.get(name6, { detail: true, with: ["live"] }).catch(() => void 0);
      }
      const previous = this.storeHealth.get(name6);
      let health = classifyStore(row, live);
      if (row?.engine === "postgresql" && !askServer && previous?.state === "unavailable" && health.state === "available") health = previous;
      if (previous?.state !== health.state || previous?.reason !== health.reason) changed = true;
      this.storeHealth.set(name6, health);
      for (const owner of watched) {
        if (storeOf2(owner.project) !== name6) continue;
        if ((health.state === "unavailable" || health.state === "removed") && owner.state === "bound") {
          const reason = `${health.reason ?? "The project Store is unavailable."} Execution was interrupted; history is retained and a new message re-activates it after access returns.`;
          void this.lane(owner.sessionId, async () => {
            if (this.binding(owner.sessionId)?.state === "bound") this.interrupt(owner.sessionId, reason, "availability");
          }).catch((error2) => this.ctx.logger("layerfs").warn("availability: interrupt %s: %s", owner.sessionId, String(error2?.message ?? error2)));
        } else if (health.state === "available" && owner.state !== "bound" && owner.interruption?.kind === "availability" && owner.error) {
          const current = this.binding(owner.sessionId);
          if (current && current.state !== "bound" && current.interruption?.kind === "availability") this.save({ ...current, error: void 0 });
        }
      }
    }
    if (changed) this.ctx.layerfs.emit("layerfs-availability", { stores: Object.fromEntries([...stores2].map((s) => [s, this.storeHealth.get(s)])) });
  }
  /** The machine and Store a project executes on must be ready now (read-only; starts nothing). */
  async assertReady(row, placed) {
    const machine = row.kind === "postgresql" ? placed ?? "native" : row.machine ?? "native";
    const status = await this.lfs.machine.get(machine, { detail: true });
    if ((status?.state ?? "ready") !== "ready" || status?.op) {
      throw new CliError("Unavailable", `Machine ${machine} is not ready (${status?.state ?? "unknown"}${status?.reason ? `: ${status.reason}` : ""}). Start or repair it, then send the message again.`, null, "refusal", typeof status?.fix === "string" ? status.fix : null);
    }
    const store = await this.lfs.store.get(row.store, { detail: true });
    const health = classifyStore(store);
    this.storeHealth.set(row.store, health);
    if (health.state !== "available") throw new CliError("Unavailable", health.reason ?? "The project Store is not ready. Restore access, then send the message again.");
  }
  /** Save and close execution resources; a new message activates them again. */
  async close(sessionId, reason = "user") {
    await this.lane(sessionId, async () => {
      const binding = this.binding(sessionId);
      if (!binding || binding.kind !== "project" || binding.state !== "bound" || !binding.sandbox) return;
      const saved = await this.checkpoint(sessionId, "idle", this.lastTurn(sessionId), reason === "idle" ? "Saved before the idle Sandbox closed" : "Saved before closing");
      if (saved?.error) throw new CliError(saved.error.code, saved.error.message);
      await this.lfs.sandbox.remove(binding.sandbox, { force: true });
      this.save({ ...binding, state: "closed", executionState: "inactive", mount: void 0, ws: void 0 });
      this.store?.schedule(sessionId, 0);
    });
  }
  /** Forget a binding without deleting the user's selected folder or local history. */
  async forget(sessionId) {
    if (this.isSimulationManaged(sessionId)) throw new CliError("Busy", "Settle script execution before forgetting its binding");
    const binding = this.binding(sessionId);
    if (!binding) return;
    if (binding.kind === "project" && binding.sandbox) await this.lfs.sandbox.remove(binding.sandbox, { force: true }).catch(() => {
    });
    this.state.update((s) => {
      delete s.sessions[sessionId];
      delete s.pending[sessionId];
    });
  }
  /** Save and close every session Sandbox of a project (before the project is removed). */
  async closeProject(project) {
    for (const b of Object.values(this.state.read().sessions)) {
      if (b.project !== project || b.kind !== "project") continue;
      if (b.state === "bound") await this.close(b.sessionId, "user").catch(() => {
      });
      if (b.sandbox) await this.lfs.sandbox.remove(b.sandbox, { force: true }).catch(() => {
      });
    }
    const listed = await pages((paging) => this.lfs.sandbox.list({ project, ...paging })).catch(() => []);
    for (const s of listed) if (typeof s?.sandbox === "string" && s.sandbox.startsWith("dsh-")) await this.lfs.sandbox.remove(s.sandbox, { force: true }).catch(() => {
    });
  }
  /**
   * This LayerFS home's Stores, with their Store ID when the CLI reports one.
   * `also` adds names known to belong here (a preset's Stores) so a failed or
   * partial listing still covers them.
   */
  async homeStores(also = []) {
    const rows2 = await this.lfs.store.list().then((value) => value?.items ?? [], () => []);
    const out = new Map(also.map((name6) => [name6, { name: name6 }]));
    for (const row of rows2) if (typeof row?.store === "string") out.set(row.store, { name: row.store });
    return [...out.values()];
  }
  /**
   * The project conversations (owner-routed logs, bindings, pending choices)
   * whose Store is one of `stores`. A Store ID decides when both sides know it;
   * otherwise the Store name does. The project-session home may be shared by
   * several DSH homes, so conversations of other LayerFS homes stay.
   */
  projectConversations(stores2) {
    const persistence = this.ctx.get?.("sessionPersistence");
    const state = this.state.read();
    const ours = (project, storeId) => {
      const name6 = project ? storeOf2(project) : void 0;
      return !!name6 && stores2.some((s) => s.name === name6 && (!s.id || !storeId || s.id === storeId));
    };
    const found = /* @__PURE__ */ new Map();
    for (const id of persistence?.ownedSessionIds?.() ?? []) {
      const project = persistence.ownerOf?.(id)?.project;
      if (ours(project, persistence.storeIdOf?.(id))) found.set(id, project);
    }
    for (const b of Object.values(state.sessions)) if (b.project && (b.kind === "project" || b.kind === "shared") && ours(b.project)) found.set(b.sessionId, b.project);
    for (const [id, p] of Object.entries(state.pending)) if (ours(p.project)) found.set(id, p.project);
    return [...found].map(([id, project]) => ({ id, project })).sort((a, b) => a.project.localeCompare(b.project) || a.id.localeCompare(b.id));
  }
  /**
   * Delete this home's project conversations (Presets Reset and Build). A
   * loaded session is archived with its activity stopped first, through DSH's
   * workspace registry, so it cannot start another turn; then its log, owner
   * route, binding, checkpoints and store progress are removed. Sandboxes are
   * force-closed; project files and the copies archived inside Stores are not
   * touched (a deletion record keeps store sync from importing them back).
   * @returns the deleted session ids.
   */
  async deleteProjectConversations(stores2) {
    const targets = this.projectConversations(stores2);
    if (!targets.length) return [];
    const ids = targets.map((t) => t.id);
    for (const id of ids) {
      if (!this.ctx.sessions.get(id)) continue;
      await this.ctx.workspaceRegistry.archiveSession(id, { stopActivity: true }).catch((error2) => {
        this.ctx.logger("layerfs").warn("reset: could not stop session %s: %s", id, String(error2?.message ?? error2));
      });
    }
    await Promise.all(ids.map((id) => this.lane(id, async () => {
    })));
    for (const id of ids) {
      const binding = this.binding(id);
      if (binding?.kind === "project" && binding.sandbox) await this.lfs.sandbox.remove(binding.sandbox, { force: true }).catch(() => {
      });
      this.store?.forget(id);
    }
    const persistence = this.ctx.get?.("sessionPersistence");
    await persistence?.deleteSessions?.(ids);
    this.state.update((s) => {
      for (const id of ids) {
        delete s.sessions[id];
        delete s.checkpoints[id];
        delete s.mirror[id];
        delete s.pending[id];
      }
    });
    for (const id of ids) this.ctx.layerfs.emit("layerfs-session", { sessionId: id, deleted: true });
    for (const project of new Set(targets.map((t) => t.project))) this.ctx.layerfs.emit("layerfs-workspaces-changed", { project });
    return ids;
  }
  /** Removal invalidates execution, not conversation ownership or checkpoints. */
  async forgetProject(project) {
    for (const binding of Object.values(this.state.read().sessions)) if (binding.project === project) {
      this.save({
        ...binding,
        state: "failed",
        executionState: "interrupted",
        mount: void 0,
        ws: void 0,
        error: "The project was removed. Conversation history and checkpoint references are retained.",
        interruption: { kind: "removed", at: Date.now() }
      });
    }
    this.ctx.layerfs.emit("layerfs-workspaces-changed", { project });
  }
  /**
   * Everything the session panel shows. `observe` (every poll and
   * effect-driven read from the views) changes nothing: a refused machine,
   * Store or Workspace check is answered as unavailable, but the binding is
   * neither interrupted nor saved; that stays with an explicit action or the
   * host's own availability poll.
   */
  async view(sessionId, options = {}) {
    let binding = this.binding(sessionId) ?? null;
    let effective = binding;
    if (binding?.kind === "shared" && binding.parent) effective = this.binding(binding.parent) ?? binding;
    const persistence = this.ctx.get?.("sessionPersistence");
    let archivedCheckpoints = [];
    if (!effective) {
      const project2 = this.placeOfId(sessionId)?.project;
      if (project2) {
        const metadata = await persistence?.readSidecar?.(sessionId).catch(() => void 0);
        archivedCheckpoints = metadata?.checkpoints ?? [];
        effective = {
          sessionId,
          kind: "project",
          project: project2,
          projectId: persistence?.projectIdOf?.(sessionId),
          branch: metadata?.codeBranch,
          anchor: this.anchorOf(project2),
          scratch: "",
          state: "closed",
          executionState: "inactive",
          createdAt: 0,
          updatedAt: 0
        };
      }
    }
    let available = true;
    let reason;
    const ownerId = effective?.sessionId ?? sessionId;
    let refusal2;
    try {
      const row = await persistence?.assertSessionIdentity?.(ownerId);
      if (row) await this.assertReady(row, effective?.machine);
    } catch (error2) {
      available = false;
      reason = String(error2?.message ?? error2);
      refusal2 = error2?.code;
    }
    let status = null;
    if (available && effective?.kind === "project" && effective.state === "bound" && effective.ws) {
      status = await this.lfs.workspace.status(effective.ws, { detail: true }).catch((error2) => {
        available = false;
        reason = String(error2?.message ?? error2);
        refusal2 = error2?.code;
        return { error: errorOf(error2) };
      });
    }
    const stored = effective && !options.observe ? this.binding(effective.sessionId) : void 0;
    if (!available && stored?.state === "bound") {
      this.interrupt(stored.sessionId, reason ?? "The project is unavailable.", refusal2 === "Unavailable" ? "availability" : "blocked");
    } else if (available && stored && stored.state !== "bound" && stored.interruption?.kind === "availability" && stored.error) {
      this.save({ ...stored, error: void 0 });
    }
    if (stored) {
      effective = this.binding(stored.sessionId) ?? effective;
      binding = this.binding(sessionId) ?? binding;
    }
    const project = effective?.project ?? this.placeOfId(sessionId)?.project ?? null;
    const live = this.ctx.sessions.get(sessionId);
    const snapshot = project ? await persistence?.local?.stat(sessionId) : void 0;
    const mirror = effective ? this.state.read().mirror[effective.sessionId] ?? null : null;
    return {
      sessionId,
      binding: effective,
      checkpoints: effective ? this.checkpoints(effective.sessionId).length ? this.checkpoints(effective.sessionId) : archivedCheckpoints : [],
      project,
      execution: project ? { state: effective?.executionState ?? (effective?.state === "bound" ? "active" : effective?.state === "failed" ? "interrupted" : "inactive"), available, reason, projectId: persistence?.projectIdOf?.(sessionId) } : void 0,
      scratchProject: this.isScratch(effective?.project),
      status,
      mirror,
      archive: project ? {
        localCount: live ? live.snapshotEvents(0).length : snapshot?.eventCount ?? 0,
        savedCount: mirror?.count ?? 0,
        ...mirror ? { updatedAt: mirror.updatedAt, ...mirror.error ? { error: mirror.error } : {} } : {}
      } : null
    };
  }
};

// src/host/sessions/store.ts
import { constants, mkdirSync as mkdirSync20 } from "node:fs";
import { chmod, lstat, mkdir as mkdir3, mkdtemp, open, readdir, rm } from "node:fs/promises";
import { join as join26 } from "node:path";
import { createHash as createHash15 } from "node:crypto";
import { sessionFormatCatalog } from "@deepseek-ai/dsh-session-format-catalog";
var STORE_PREFIX = "dsh.session.";
function branchHead(branch) {
  const id = branch?.commit;
  return typeof id === "string" && id ? id : null;
}
var DIR = "/.dsh/session";
var MISS_MS = 3e4;
var PART_LIMIT = 32;
var COMPACT_FLOOR = 64 * 1024;
var sha = (text6) => createHash15("sha256").update(text6).digest("hex");
var joinLines = (lines2, from = 0, to = lines2.length) => to > from ? lines2.slice(from, to).join("\n") + "\n" : "";
var STREAM_FILE = { session: /^session(\.[0-9]+)?\.jsonl$/, invocations: /^invocations(\.[0-9]+)?\.jsonl$/ };
function planStream(stem, lines2, mark, remote) {
  const text6 = joinLines(lines2);
  const next = { lines: lines2.length, digest: sha(text6) };
  const last = remote?.[remote.length - 1];
  if (mark && remote?.length && last.to === mark.lines && lines2.length >= mark.lines && sha(joinLines(lines2, 0, mark.lines)) === mark.digest) {
    const added = joinLines(lines2, mark.lines);
    if (!added) return { changes: [], pieces: [...remote], mark: next, text: text6 };
    const bytes = Buffer.byteLength(added);
    const parts = remote.length;
    const partBytes = remote.slice(1).reduce((sum, piece) => sum + piece.bytes, 0) + bytes;
    if (parts <= PART_LIMIT && partBytes <= Math.max(remote[0].bytes, COMPACT_FLOOR)) {
      const piece = { file: `${stem}.${mark.lines}.jsonl`, from: mark.lines, to: lines2.length, bytes };
      return { changes: [{ op: "write", path: `${DIR}/${piece.file}`, content: added }], pieces: [...remote, piece], mark: next, text: text6 };
    }
  }
  const base = { file: `${stem}.jsonl`, from: 0, to: lines2.length, bytes: Buffer.byteLength(text6) };
  return {
    changes: [...(remote ?? []).filter((piece) => piece.file !== base.file).map((piece) => ({ op: "rm", path: `${DIR}/${piece.file}` })), { op: "write", path: `${DIR}/${base.file}`, content: text6 }],
    pieces: [base],
    mark: next,
    text: text6
  };
}
var archiveDigest = (logDigest, rest, invocationsDigest) => sha(JSON.stringify([logDigest, sha(JSON.stringify({ ...rest, archive: void 0 })), invocationsDigest]));
function piecesOf(manifest, stream) {
  const pieces = manifest?.[stream === "session" ? "log" : "invocations"];
  if (!Array.isArray(pieces) || !pieces.length) throw new CliError("InvalidInput", "The stored manifest lists no archive files");
  let at = 0;
  for (const piece of pieces) {
    if (typeof piece?.file !== "string" || !STREAM_FILE[stream].test(piece.file) || piece.from !== at || !Number.isSafeInteger(piece.to) || piece.to < at || !Number.isSafeInteger(piece.bytes)) throw new CliError("InvalidInput", "Unsafe or discontinuous session archive file list");
    at = piece.to;
  }
  return pieces;
}
var compact2 = (sessionId) => sessionId.replace(/^session-/, "").replace(/[^A-Za-z0-9]/g, "").toLowerCase();
var storeBranchOf = (sessionId) => `${STORE_PREFIX}${compact2(sessionId)}`;
var SessionStore = class {
  constructor(ctx, sessions) {
    this.ctx = ctx;
    this.sessions = sessions;
  }
  ctx;
  sessions;
  timers = /* @__PURE__ */ new Map();
  /** Where each stored session found by discovery lives (session id -> project). */
  found = /* @__PURE__ */ new Map();
  syncing = /* @__PURE__ */ new Map();
  /** Session ids discovery did not find, and when: not searched again for {@link MISS_MS}. */
  missed = /* @__PURE__ */ new Map();
  get lfs() {
    return this.ctx.layerfs.lfs;
  }
  /** Mirror soon (debounced): after `turn/end` and on disposal. */
  schedule(sessionId, delay = 1200) {
    clearTimeout(this.timers.get(sessionId));
    this.timers.set(sessionId, setTimeout(() => {
      this.timers.delete(sessionId);
      void this.mirror(sessionId).catch((error2) => this.ctx.logger("layerfs").warn("session store %s: %s", sessionId, error2?.message ?? error2));
    }, delay));
  }
  dispose() {
    for (const t of this.timers.values()) clearTimeout(t);
    this.timers.clear();
  }
  /** Drop a deleted session's pending mirror and discovery memo. */
  forget(sessionId) {
    clearTimeout(this.timers.get(sessionId));
    this.timers.delete(sessionId);
    this.found.delete(sessionId);
  }
  /** Mirrors queued on their Store's lane that have not started (session id -> run). */
  queued = /* @__PURE__ */ new Map();
  /**
   * Append the session's new events to its project. Saves to one Store run one
   * at a time (concurrent writers only queue on LayerFS's Store lock), and a
   * session already queued is not queued twice: its run reads the latest log.
   */
  mirror(sessionId) {
    const waiting = this.queued.get(sessionId);
    if (waiting) return waiting;
    const project = this.sessions.binding(sessionId)?.project;
    if (!project) return Promise.resolve();
    let started = false;
    const run2 = this.sessions.lane(`archive:${project.split("/")[0]}`, () => {
      started = true;
      this.queued.delete(sessionId);
      return this.mirrorNow(sessionId);
    });
    if (!started) this.queued.set(sessionId, run2);
    return run2;
  }
  async mirrorNow(sessionId) {
    const binding = this.sessions.binding(sessionId);
    if (!binding || !binding.project) return;
    const session = this.ctx.get("sessions")?.get(sessionId);
    if (!session && !await localPersistence(this.ctx)?.stat(sessionId)) return;
    const project = binding.project;
    const branch = storeBranchOf(sessionId);
    const state = this.sessions.state.read().mirror[sessionId];
    const persistence = localPersistence(this.ctx);
    await persistence.flush();
    const handle2 = await persistence.open(sessionId, "read");
    let header, inheritedEventCount, events;
    try {
      header = handle2.header;
      inheritedEventCount = handle2.inheritedEventCount ?? 0;
      events = (await handle2.read()).events;
    } finally {
      await handle2.close();
    }
    const at = events.length;
    const from = state?.count ?? 0;
    const checkpoints = this.sessions.checkpoints(sessionId);
    const provider = this.ctx.get("sessionPersistence");
    const annotations = await provider?.readSidecar?.(sessionId) ?? { version: 1, sessionId, project, invocations: [] };
    const codeBranch = binding.branch ?? (binding.parent ? this.sessions.binding(binding.parent)?.branch : null) ?? null;
    const title = this.titleOf(session ?? { snapshotEvents: () => events });
    const sidecar = { ...annotations, title, bindingKind: binding.kind, ...binding.parent ? { sharedParent: binding.parent } : {}, codeBranch, checkpoints, archive: { count: at, updatedAt: Date.now() } };
    const { invocations = [], ...rest } = sidecar;
    const logLines = [
      JSON.stringify(sessionFormatCatalog.encodeCurrentHeader({ ...header, delegationDepth: header.delegationDepth ?? 0 }, inheritedEventCount)),
      ...events.map((event) => JSON.stringify(sessionFormatCatalog.encodeCurrentEvent(event)))
    ];
    const invocationLines = (Array.isArray(invocations) ? invocations : []).map((row) => JSON.stringify(row));
    const confirmed2 = state?.digest ? state : void 0;
    try {
      await provider?.assertSessionIdentity?.(sessionId);
      let remote = null;
      if (confirmed2) {
        remote = await this.readManifest(project, branch);
        if (remote.digest !== confirmed2.digest || remote.count !== from) {
          throw new CliError("ArchiveConflict", "The project archive differs from the last confirmed save, possibly after restore or another writer. Local history is retained; reconcile the archive before saving again.");
        }
      }
      const v3 = remote?.version === 3;
      const marks = v3 ? confirmed2?.streams : void 0;
      const log = planStream("session", logLines, marks?.log, v3 ? piecesOf(remote, "session") : void 0);
      const receipts = planStream("invocations", invocationLines, marks?.invocations, v3 ? piecesOf(remote, "invocations") : void 0);
      const digest4 = archiveDigest(log.mark.digest, rest, receipts.mark.digest);
      if (confirmed2?.digest === digest4 && !confirmed2.error) return;
      const manifest = {
        version: 3,
        kind: "dsh-session",
        sessionId,
        project,
        projectId: provider?.projectIdOf?.(sessionId),
        header,
        inheritedEventCount,
        title,
        codeBranch,
        bindingKind: binding.kind,
        ...binding.parent ? { sharedParent: binding.parent } : {},
        count: at,
        log: log.pieces,
        invocations: receipts.pieces,
        checkpoints,
        digest: digest4,
        updatedAt: Date.now()
      };
      const changes = [
        ...confirmed2 ? [] : [{ op: "mkdir", path: DIR }],
        ...log.changes,
        ...receipts.changes,
        { op: "write", path: `${DIR}/layerfs.json`, content: JSON.stringify(rest) + "\n" },
        { op: "write", path: `${DIR}/manifest.json`, content: JSON.stringify(manifest) + "\n" }
      ];
      let saved = false;
      if (!confirmed2) {
        await withoutTraceContext(() => this.lfs.branch.fork(project, branch, "main")).catch(async (error2) => {
          if (error2?.code !== "Exists") throw error2;
          const existing = await this.readManifest(project, branch).catch((e) => {
            if (e?.code === "NotFound") return null;
            throw e;
          });
          if (existing && existing.digest !== digest4) throw new CliError("ArchiveConflict", "An archive already exists for this conversation. Reconcile it before saving local history.");
          saved = !!existing;
        });
      }
      const bytes = changes.reduce((sum, change) => sum + (typeof change.content === "string" ? Buffer.byteLength(change.content) : 0), 0);
      if (!saved) await withoutTraceContext(() => this.lfs.file.apply(project, branch, changes, { message: `dsh session ${compact2(sessionId).slice(0, 8)}: events ${from}..${at} (${bytes} bytes)` }));
      const streams = { log: log.mark, invocations: receipts.mark };
      this.sessions.state.update((s) => {
        s.mirror[sessionId] = { project, branch, count: at, segments: log.pieces.map(({ file, from: from2, to }) => ({ file, from: from2, to })), streams, updatedAt: Date.now(), digest: digest4 };
      });
      await provider?.updateSidecar?.(sessionId, (value) => {
        value.title = sidecar.title;
        value.bindingKind = binding.kind;
        if (binding.parent) value.sharedParent = binding.parent;
        value.codeBranch = codeBranch;
        value.checkpoints = checkpoints;
        value.archive = sidecar.archive;
      });
      this.ctx.layerfs.emit("layerfs-session", { sessionId });
    } catch (error2) {
      this.sessions.state.update((s) => {
        s.mirror[sessionId] = { ...state ?? { project, branch, count: from, segments: [] }, updatedAt: Date.now(), error: String(error2?.message ?? error2) };
      });
      await provider?.updateSidecar?.(sessionId, (value) => {
        value.archive = { count: from, updatedAt: Date.now(), error: String(error2?.message ?? error2) };
      });
      throw error2;
    }
  }
  titleOf(session) {
    let title = null;
    for (const e of session.snapshotEvents?.(0) ?? []) {
      if (e.type === "session/title" && typeof e.data?.title === "string") title = e.data.title;
      if (!title && e.type === "user/message") {
        const text6 = (e.data?.message?.content ?? e.data?.content ?? []).find?.((p) => p?.type === "text")?.text;
        if (typeof text6 === "string") title = text6.slice(0, 80);
      }
    }
    return title;
  }
  /**
   * Parsed manifests of stored sessions by `project\0branch`, with the Branch head they
   * were read at: a Branch whose head did not move is not read again. The session list
   * is polled by every open project view, and re-reading each manifest per poll stalled
   * host reads during a team run (Quarry v2 FIX-LOG F22).
   */
  manifests = /* @__PURE__ */ new Map();
  /** Discovery walks in flight by project: concurrent callers share one walk. */
  discovering = /* @__PURE__ */ new Map();
  /** The sessions stored in a project, joined with what this DSH has locally. */
  discover(project) {
    const running = this.discovering.get(project);
    if (running) return running;
    const walk2 = this.discoverNow(project).finally(() => this.discovering.delete(project));
    this.discovering.set(project, walk2);
    return walk2;
  }
  async discoverNow(project) {
    const branches = (await pages((paging) => this.lfs.branch.list(project, { prefix: STORE_PREFIX, ...paging }))).map((b) => ({ ...b, name: b.branch }));
    const stored = branches.filter((b) => typeof b.name === "string" && b.name.startsWith(STORE_PREFIX));
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    for (const b of stored) {
      try {
        const key = `${project}\0${b.name}`;
        seen.add(key);
        const head = branchHead(b);
        const kept2 = head ? this.manifests.get(key) : void 0;
        const manifest = kept2 && kept2.head === head ? kept2.manifest : await this.readManifest(project, b.name);
        if (head) this.manifests.set(key, { head, manifest });
        else this.manifests.delete(key);
        out.push({
          sessionId: manifest.sessionId,
          projectId: manifest.projectId,
          title: manifest.title ?? null,
          branch: b.name,
          codeBranch: manifest.codeBranch ?? null,
          events: manifest.count ?? 0,
          checkpoints: (manifest.checkpoints ?? []).filter((c) => c.kind !== "base" && c.kind !== "restore" && c.commit && c.changed > 0).length,
          updatedAt: manifest.updatedAt ?? null,
          local: !!await localPersistence(this.ctx)?.stat(manifest.sessionId).catch(() => void 0),
          shared: manifest.bindingKind === "shared" || manifest.header?.origin === "subagent"
        });
        this.found.set(manifest.sessionId, project);
      } catch {
      }
    }
    for (const key of this.manifests.keys()) if (key.startsWith(`${project}\0`) && !seen.has(key)) this.manifests.delete(key);
    return out;
  }
  /** Read one pinned Branch export. The windowed file.read API deliberately
   * truncates long lines, so it cannot transport native JSONL or annotations. */
  async withArchive(project, branch, consume) {
    const parent = join26(this.ctx.layerfs.root, "archive-imports");
    await mkdir3(parent, { recursive: true, mode: 448 });
    const owned2 = await mkdtemp(join26(parent, "read-"));
    const destination = join26(owned2, "snapshot");
    try {
      await withoutTraceContext(() => this.lfs.project.export(project, destination, { branch }));
      const read2 = async (path2) => {
        const parts = path2.split("/").filter(Boolean);
        if (parts[0] !== ".dsh" || parts[1] !== "session" || parts.length < 3 || parts.some((part) => part === "." || part === "..")) throw new CliError("InvalidInput", "Unsafe session archive path");
        let current = destination;
        for (let index = -1; index < parts.length; index++) {
          if (index >= 0) current = join26(current, parts[index]);
          const info2 = await lstat(current);
          if (info2.isSymbolicLink() || (index < parts.length - 1 ? !info2.isDirectory() : !info2.isFile())) throw new CliError("InvalidInput", "Session archive entries must be real directories and regular files");
        }
        const file = await open(current, constants.O_RDONLY | constants.O_NOFOLLOW);
        try {
          if (!(await file.stat()).isFile()) throw new CliError("InvalidInput", "Session archive entry is not a regular file");
          return await file.readFile("utf8");
        } finally {
          await file.close();
        }
      };
      return await consume(read2);
    } finally {
      const writable = async (path2) => {
        const info2 = await lstat(path2).catch(() => void 0);
        if (!info2?.isDirectory() || info2.isSymbolicLink()) return;
        await chmod(path2, 448);
        for (const entry of await readdir(path2)) await writable(join26(path2, entry));
      };
      await writable(owned2);
      await rm(owned2, { recursive: true, force: true });
    }
  }
  async readManifest(project, branch) {
    const page = await withoutTraceContext(() => this.lfs.file.read(project, branch, `${DIR}/manifest.json`, { line: 1, detail: true }));
    let size;
    if (typeof page.size === "bigint" && page.size >= 0n) size = page.size;
    else if (typeof page.size === "number" && Number.isSafeInteger(page.size) && page.size >= 0) size = BigInt(page.size);
    else if (typeof page.size === "string" && /^[0-9]{1,20}$/.test(page.size)) size = BigInt(page.size);
    if (page.binary !== true && page.start_line === 1 && page.line_truncated === false && page.next_line == null && typeof page.text === "string" && size === BigInt(Buffer.byteLength(page.text))) return JSON.parse(page.text);
    return this.withArchive(project, branch, async (read2) => JSON.parse(await read2(`${DIR}/manifest.json`)));
  }
  /** Import missing native history and annotations without rewriting identities.
   * Imported cwd remains historical; a safe local scratch folder is selected. */
  async import(project, sessionId, workspaceId) {
    return await this.sessions.lane(`import:${sessionId}`, () => this.importNow(project, sessionId, workspaceId));
  }
  async importNow(project, sessionId, workspaceId) {
    const persistence = localPersistence(this.ctx);
    if (!persistence) throw new CliError("Unavailable", "DSH session persistence is not available");
    if (await persistence.stat(sessionId).catch(() => void 0)) {
      await this.ctx.get("sessionPersistence")?.assertSessionIdentity?.(sessionId);
      return { sessionId, imported: false };
    }
    const branch = storeBranchOf(sessionId);
    return this.withArchive(project, branch, (read2) => this.importSnapshot(project, sessionId, workspaceId, read2));
  }
  async importSnapshot(project, sessionId, workspaceId, read2) {
    const persistence = localPersistence(this.ctx);
    const branch = storeBranchOf(sessionId);
    const manifest = JSON.parse(await read2(`${DIR}/manifest.json`));
    const provider = this.ctx.get("sessionPersistence");
    if (!manifest.projectId && provider?.catalog) throw new CliError("BindingRequired", "This legacy archive has no permanent project identity. Local histories are preserved; importing it requires explicit ownership recovery.");
    if (manifest.projectId && provider?.catalog) {
      const destination = await provider.catalog.resolve(project);
      if (manifest.projectId !== destination.projectId) throw new CliError("BindingRequired", "This backup contains history owned by another project identity. Recover the original project explicitly before importing its conversations.");
    }
    if (manifest.sessionId !== sessionId) throw new CliError("InvalidInput", "The stored manifest names another session");
    if (manifest.bindingKind === "shared") {
      if (typeof manifest.sharedParent !== "string" || !manifest.sharedParent) throw new CliError("InvalidInput", "The stored shared session has no parent");
      const seen = /* @__PURE__ */ new Set([sessionId]);
      let parent = manifest.sharedParent;
      while (parent) {
        if (seen.has(parent)) throw new CliError("InvalidInput", "The stored shared session has a cyclic parent dependency");
        seen.add(parent);
        parent = this.sessions.binding(parent)?.parent;
      }
    }
    const anchor = this.sessions.ensureAnchor(project);
    const list4 = workspaceId ?? this.sessions.recordedWorkspace(project);
    let events = [];
    let header = manifest.header;
    let inheritedEventCount = manifest.inheritedEventCount ?? 0;
    let sidecar;
    let streams;
    const restoreLog = (text6) => {
      const lines2 = text6.split("\n").filter((line) => line.trim());
      const restore = sessionFormatCatalog.createRestore(JSON.parse(lines2.shift()), { recovery: "strict", validation: "current" });
      for (const line of lines2) restore.decodeRow(JSON.parse(line));
      const artifact = restore.finish();
      header = artifact.header;
      events = [...artifact.events];
      inheritedEventCount = artifact.inheritedEventCount;
    };
    if (manifest.version === 3) {
      const stream = async (name6) => {
        let text6 = "";
        for (const piece of piecesOf(manifest, name6)) {
          const part = await read2(`${DIR}/${piece.file}`);
          const lines3 = part ? part.split("\n") : [""];
          if (part !== "" && !part.endsWith("\n") || lines3.length - 1 !== piece.to - piece.from) throw new CliError("InvalidInput", "A session archive file does not hold the lines its manifest lists");
          text6 += part;
        }
        return text6;
      };
      const logText = await stream("session");
      const invocationsText = await stream("invocations");
      restoreLog(logText);
      const rest = JSON.parse(await read2(`${DIR}/layerfs.json`));
      if (rest.sessionId !== sessionId || rest.project !== project) throw new CliError("InvalidInput", "The stored annotations name another session or project");
      const lines2 = { log: logText.split("\n").length - 1, invocations: invocationsText ? invocationsText.split("\n").length - 1 : 0 };
      streams = { log: { lines: lines2.log, digest: sha(logText) }, invocations: { lines: lines2.invocations, digest: sha(invocationsText) } };
      if (manifest.digest !== archiveDigest(streams.log.digest, rest, streams.invocations.digest)) throw new CliError("InvalidInput", "The archived session checksum does not match its manifest");
      sidecar = { ...rest, invocations: invocationsText.split("\n").filter(Boolean).map((line) => JSON.parse(line)) };
    } else if (manifest.version === 2) {
      const text6 = await read2(`${DIR}/session.jsonl`);
      restoreLog(text6);
      sidecar = JSON.parse(await read2(`${DIR}/layerfs.json`));
      if (sidecar.sessionId !== sessionId || sidecar.project !== project) throw new CliError("InvalidInput", "The stored annotations name another session or project");
      const digest4 = createHash15("sha256").update(text6).update(JSON.stringify({ ...sidecar, archive: void 0 })).digest("hex");
      if (manifest.digest !== digest4) throw new CliError("InvalidInput", "The archived session checksum does not match its manifest");
    } else {
      for (const segment of manifest.segments ?? []) {
        if (!/^segments\/[0-9]+\.jsonl$/.test(segment.file)) throw new CliError("InvalidInput", "Unsafe session segment path");
        const text6 = await read2(`${DIR}/${segment.file}`);
        for (const line of text6.split("\n")) if (line.trim()) events.push(JSON.parse(line));
      }
    }
    if (header?.id !== sessionId || events.length !== manifest.count) throw new CliError("InvalidInput", "The stored session identity or event count does not match its manifest");
    await provider?.migrateProject?.(sessionId, project);
    const handle2 = await persistence.create(header, inheritedEventCount ? { inheritedEventCount } : void 0);
    try {
      if (events.length) await handle2.append(events);
      await handle2.flush?.();
    } finally {
      await handle2.close?.();
    }
    if (sidecar) await provider?.updateSidecar?.(sessionId, (value) => {
      const local = value.invocations;
      Object.assign(value, sidecar);
      value.invocations = mergeInvocations(local, sidecar.invocations);
    });
    const scratch = `${anchor}/sessions/${sessionId}`;
    mkdirSync20(scratch, { recursive: true });
    const simulation = sidecar?.simulation ? { ...sidecar.simulation } : void 0;
    if (simulation?.state === "running") {
      simulation.state = "interrupted";
      simulation.handoffReady = false;
      simulation.error = "The imported script was interrupted. The script will not run again; a real model continues this session from the project's current files.";
    }
    if (simulation) await provider?.updateSidecar?.(sessionId, (value) => {
      value.simulation = simulation;
    });
    this.sessions.state.update((s) => {
      s.checkpoints[sessionId] ??= sidecar?.checkpoints ?? manifest.checkpoints ?? [];
      if (!manifest.codeBranch && !simulation) s.pending[sessionId] ??= { project };
      if ((manifest.codeBranch || simulation) && !s.sessions[sessionId]) {
        s.sessions[sessionId] = {
          sessionId,
          kind: manifest.bindingKind === "shared" && manifest.sharedParent ? "shared" : "project",
          ...manifest.bindingKind === "shared" && manifest.sharedParent ? { parent: manifest.sharedParent } : {},
          project,
          anchor,
          scratch,
          scratchManaged: true,
          machine: "native",
          branch: manifest.codeBranch,
          sandbox: `dsh-${compact2(sessionId).slice(0, 20)}`,
          ws: `dsh-${compact2(sessionId).slice(0, 20)}:main`,
          ...simulation ? { simulation, resumeFromArchive: true, sandbox: void 0, ws: void 0, branch: void 0 } : {},
          state: "closed",
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
      }
      s.mirror[sessionId] = { project, branch, count: manifest.count ?? events.length, segments: (manifest.version === 3 ? manifest.log : manifest.segments ?? []).map(({ file, from, to }) => ({ file, from, to })), ...streams ? { streams } : {}, updatedAt: Date.now(), digest: manifest.digest };
    });
    await this.sessions.attach(list4, sessionId);
    return { sessionId, imported: true };
  }
  /**
   * Import every session stored in `project` that this DSH does not have.
   * @returns how many sessions were imported.
   */
  sync(project) {
    const running = this.syncing.get(project);
    if (running) return running;
    const run2 = (async () => {
      let imported = 0;
      const persistence = this.ctx.get("sessionPersistence");
      for (const stored of await this.discover(project)) {
        if (stored.local || persistence?.isDeleted?.(stored.sessionId)) continue;
        try {
          if ((await this.import(project, stored.sessionId)).imported) imported++;
        } catch (error2) {
          this.ctx.logger("layerfs").warn("session store: import %s from %s: %s", stored.sessionId, project, error2?.message ?? error2);
        }
      }
      return imported;
    })().finally(() => this.syncing.delete(project));
    this.syncing.set(project, run2);
    return run2;
  }
  /** Sync every project this DSH has a workspace for (the Scratch project included). Never throws. */
  async syncAll() {
    for (const project of Object.keys(this.sessions.state.read().projects)) {
      await this.sync(project).catch((error2) => this.ctx.logger("layerfs").warn("session store: sync %s: %s", project, error2?.message ?? error2));
    }
  }
  /** The project this DSH already knows stores a session (no LayerFS calls). */
  known(sessionId) {
    return this.ctx.get("sessionPersistence")?.ownerOf?.(sessionId)?.project ?? this.sessions.state.read().sessions[sessionId]?.project ?? this.sessions.state.read().pending[sessionId]?.project ?? this.sessions.state.read().mirror[sessionId]?.project ?? this.found.get(sessionId);
  }
  /**
   * The project a session missing locally is stored in: known from this DSH's
   * state or an earlier discovery, else found by discovering every known project.
   */
  async locate(sessionId) {
    const known4 = this.known(sessionId);
    if (known4) return known4;
    if (Date.now() - (this.missed.get(sessionId) ?? 0) < MISS_MS) return void 0;
    for (const project of Object.keys(this.sessions.state.read().projects)) {
      await this.discover(project).catch(() => []);
      if (this.found.has(sessionId)) return this.found.get(sessionId);
    }
    this.missed.set(sessionId, Date.now());
    if (this.missed.size > 1e3) this.missed.delete(this.missed.keys().next().value);
    return void 0;
  }
};
function localPersistence(ctx) {
  const persistence = ctx.get("sessionPersistence");
  return persistence?.local ?? persistence;
}

// src/shared/trajectory.ts
var PREVIEW_MAX = 300;
var DETAIL_MAX = 64 * 1024;

// src/host/sessions/trace.ts
var SUMMARY_MAX = 200;
var SUMMARY_KEYS = ["command", "cmd", "path", "file_path", "pattern", "query", "url", "description", "prompt"];
var text5 = (value) => typeof value === "string" && value.trim() ? value : void 0;
var finite = (value) => typeof value === "number" && Number.isFinite(value) ? value : void 0;
var clip = (value) => {
  const line = value.replace(/\s+/g, " ").trim();
  return line.length > SUMMARY_MAX ? `${line.slice(0, SUMMARY_MAX - 1)}\u2026` : line;
};
function summarize(args) {
  if (typeof args !== "string" || !args.trim()) return void 0;
  let value;
  try {
    value = JSON.parse(args);
  } catch {
    return clip(args);
  }
  if (!value || typeof value !== "object") return text5(String(value)) ? clip(String(value)) : void 0;
  for (const key of SUMMARY_KEYS) if (text5(value[key])) return clip(value[key]);
  for (const field of Object.values(value)) if (text5(field)) return clip(field);
  return void 0;
}
var word = (value) => {
  const w = text5(value);
  return w && !w.startsWith("<") && !w.startsWith("-") ? w : void 0;
};
function versionBranch(version2, receipt, checkpoints, current) {
  if (word(version2.branch)) return version2.branch;
  if (version2.kind === "Layer") return "main";
  const argv = Array.isArray(receipt?.argv) ? receipt.argv : [];
  const operation = String(receipt?.operation ?? "");
  if (operation.startsWith("file.")) return word(argv[3]);
  if (operation === "branch.merge") return word(argv[3]);
  if (operation === "branch.fork") return word(argv[4]) ?? word(argv[3]);
  const own = checkpoints.find((c) => c?.receipt && c.receipt === receipt?.id);
  if (word(own?.branch)) return own.branch;
  const at = finite(receipt?.at) ?? Number.POSITIVE_INFINITY;
  let before;
  for (const c of checkpoints) if (word(c?.branch) && finite(c?.at) !== void 0 && c.at <= at) before = c.branch;
  return before ?? current ?? void 0;
}
function toOp(receipt, checkpoints, current) {
  const versions = [];
  for (const v of Array.isArray(receipt?.versions) ? receipt.versions : []) {
    if (!v || v.kind !== "Commit" && v.kind !== "Layer" || !text5(v.id) || !["created", "unchanged", "referenced"].includes(v.effect)) continue;
    const branch = versionBranch(v, receipt, checkpoints, current);
    versions.push({ kind: v.kind, id: v.id, effect: v.effect, ...branch ? { branch } : {} });
  }
  return {
    id: String(receipt.id),
    origin: receipt.origin === "host" ? "host" : "tool",
    operation: text5(receipt.operation) ?? "?",
    ...Array.isArray(receipt.argv) ? { argv: receipt.argv.filter((w) => typeof w === "string") } : {},
    outcome: receipt.outcome === "success" || receipt.outcome === "refusal" ? receipt.outcome : "unknown",
    ...text5(receipt.code) ? { code: receipt.code } : {},
    ...text5(receipt.kind) ? { kind: receipt.kind } : {},
    ...finite(receipt.at) !== void 0 ? { at: receipt.at } : {},
    ...finite(receipt.ms) !== void 0 ? { ms: receipt.ms } : {},
    ...receipt.exit === null || Number.isInteger(receipt.exit) ? { exit: receipt.exit } : {},
    versions
  };
}
function blocks(content, type) {
  const out = [];
  if (Array.isArray(content)) {
    for (const b of content) if (b?.type === type && typeof b.text === "string") out.push(b.text);
  }
  return out;
}
function preview(parts) {
  let out = "";
  let space = false;
  for (const part of parts) {
    if (out) space = true;
    for (let i = 0; i < part.length; i++) {
      const ch = part[i];
      if (/\s/.test(ch)) {
        if (out) space = true;
        continue;
      }
      if (space) {
        out += " ";
        space = false;
      }
      out += ch;
      if (out.length > PREVIEW_MAX) return { text: `${out.slice(0, PREVIEW_MAX - 1)}\u2026`, truncated: true };
    }
  }
  return { text: out, truncated: false };
}
var stepKey = (turn, step) => `${turn}:${step}`;
var integer2 = (value) => Number.isInteger(value) ? value : void 0;
var CREATING_KINDS = /* @__PURE__ */ new Set(["Committed", "Added", "Merged"]);
function buildTrajectory(input) {
  const { checkpoints, branch } = input;
  const turns = /* @__PURE__ */ new Map();
  const turn = (n) => {
    let t = turns.get(n);
    if (!t) turns.set(n, t = { turn: n, records: [], orphanCalls: [], hostOps: [], checkpoints: [] });
    return t;
  };
  const tools = /* @__PURE__ */ new Map();
  const stepStarts = /* @__PURE__ */ new Map();
  let open3;
  let last;
  let pending2 = [];
  for (const event of input.events ?? []) {
    const type = event?.type;
    const data = event?.data;
    const seq = integer2(event?.seq);
    const at = finite(event?.time);
    if (type === "turn/start") {
      const n = integer2(data?.turn);
      if (n === void 0) continue;
      const t = turn(n);
      t.at ??= at;
      open3 = last = n;
      if (pending2.length) {
        for (const r of pending2) {
          r.turn = n;
          t.records.push(r);
        }
        pending2 = [];
      }
    } else if (type === "turn/end") {
      const n = integer2(data?.turn);
      if (n === void 0) continue;
      const t = turn(n);
      if (at !== void 0) t.endAt = at;
      if (open3 === n) open3 = void 0;
      last = Math.max(last ?? n, n);
    } else if (type === "step/start") {
      if (at !== void 0 && integer2(data?.turn) !== void 0) stepStarts.set(stepKey(data.turn, data.step), at);
    } else if (type === "user/message") {
      if (seq === void 0 || !data) continue;
      const kind = text5(data.source?.kind) ?? "unknown";
      const p = preview(blocks(data.content, "text"));
      const record = {
        kind: kind === "user" ? "user" : "context",
        seq,
        turn: open3 ?? 0,
        source: kind,
        ...at !== void 0 ? { at } : {},
        text: p.text,
        ...p.truncated ? { truncated: true } : {}
      };
      if (open3 !== void 0) turn(open3).records.push(record);
      else pending2.push(record);
    } else if (type === "assistant/message") {
      const n = integer2(data?.turn);
      if (seq === void 0 || n === void 0) continue;
      const content = data.message?.content;
      const p = preview(blocks(content, "text"));
      const toolCalls = Array.isArray(content) ? content.filter((b) => b?.type === "tool-call").length : 0;
      const step = integer2(data.step);
      const startedAt = step !== void 0 ? stepStarts.get(stepKey(n, step)) : void 0;
      const record = {
        kind: "assistant",
        seq,
        turn: n,
        ...step !== void 0 ? { step } : {},
        ...at !== void 0 ? { at } : {},
        text: p.text,
        ...p.truncated ? { truncated: true } : {},
        ...blocks(content, "reasoning").length ? { thinking: true } : {},
        toolCalls,
        ...startedAt !== void 0 ? { startedAt } : {},
        ...data.interrupted === true ? { interrupted: true } : {}
      };
      turn(n).records.push(record);
    } else if (type === "tool/call") {
      const n = integer2(data?.turn);
      if (seq === void 0 || n === void 0 || !text5(data.callId) || tools.has(data.callId)) continue;
      const step = integer2(data.step);
      const summary = summarize(data.arguments);
      const record = {
        kind: "tool",
        seq,
        turn: n,
        ...step !== void 0 ? { step } : {},
        ...at !== void 0 ? { at } : {},
        callId: data.callId,
        name: text5(data.name) ?? "?",
        ...summary ? { summary } : {},
        ops: []
      };
      tools.set(data.callId, record);
      turn(n).records.push(record);
    } else if (type === "tool/result") {
      const record = tools.get(data?.message?.toolCallId);
      if (!record || record.resultSeq !== void 0) continue;
      const p = preview(blocks(data.message.content, "text"));
      record.result = p.text;
      if (p.truncated) record.resultTruncated = true;
      if (data.message.isError === true) record.isError = true;
      if (seq !== void 0) record.resultSeq = seq;
      if (at !== void 0) record.endedAt = at;
    }
  }
  if (pending2.length) {
    const n = (last ?? 0) + 1;
    const t = turn(n);
    for (const r of pending2) {
      r.turn = n;
      t.records.push(r);
    }
  }
  const byReceipt = /* @__PURE__ */ new Map();
  for (const c of checkpoints) {
    if (!c || !Number.isInteger(c.turn)) continue;
    const checkpoint = {
      kind: c.kind,
      commit: text5(c.commit) ?? null,
      branch: text5(c.branch) ?? null,
      changed: Number(c.changed) || 0,
      message: String(c.message ?? ""),
      at: Number(c.at) || 0,
      ...c.error && text5(c.error.code) ? { error: { code: c.error.code, message: String(c.error.message ?? "") } } : {}
    };
    turn(c.turn).checkpoints.push(checkpoint);
    if (text5(c.receipt)) byReceipt.set(c.receipt, checkpoint);
  }
  const orphans = /* @__PURE__ */ new Map();
  for (const receipt of input.invocations) {
    if (!receipt || typeof receipt !== "object" || !text5(receipt.id)) continue;
    if (text5(receipt.sessionId) && receipt.sessionId !== input.sessionId) continue;
    const op = toOp(receipt, checkpoints, branch);
    const n = integer2(receipt.turn) ?? 0;
    if (text5(receipt.toolCallId)) {
      const record = tools.get(receipt.toolCallId);
      if (record) {
        record.ops.push(op);
        continue;
      }
      let orphan = orphans.get(receipt.toolCallId);
      if (!orphan) {
        orphans.set(receipt.toolCallId, orphan = { callId: receipt.toolCallId, ops: [] });
        turn(n).orphanCalls.push(orphan);
      }
      orphan.ops.push(op);
      continue;
    }
    const checkpoint = byReceipt.get(op.id);
    if (checkpoint) checkpoint.op = op;
    else turn(n).hostOps.push(op);
  }
  const created = /* @__PURE__ */ new Set();
  let unnamed = 0;
  let callsWithVersions = 0;
  const madeBy = (op) => {
    let any = false;
    for (const v of op.versions) if (v.effect === "created") {
      created.add(v.id);
      any = true;
    }
    if (!any && op.outcome === "success" && CREATING_KINDS.has(op.kind ?? "")) {
      unnamed++;
      any = true;
    }
    return any;
  };
  const count4 = (ops) => {
    if (ops.map(madeBy).some(Boolean)) callsWithVersions++;
  };
  for (const record of tools.values()) count4(record.ops);
  for (const orphan of orphans.values()) count4(orphan.ops);
  for (const t of turns.values()) {
    for (const op of t.hostOps) madeBy(op);
    for (const c of t.checkpoints) {
      const linked = c.op ? madeBy(c.op) : false;
      if (!linked && c.commit && !c.error && c.changed > 0) created.add(c.commit);
    }
  }
  return {
    sessionId: input.sessionId,
    project: input.project,
    branch,
    turns: [...turns.values()].sort((a, b) => a.turn - b.turn),
    logLoaded: input.events !== void 0,
    counts: { versionsCreated: created.size + unnamed, callsWithVersions }
  };
}
function full(value, field, cut) {
  if (value.length <= DETAIL_MAX) return value;
  cut.push(field);
  return value.slice(0, DETAIL_MAX);
}
function trajectoryDetail(events, seq) {
  if (!events || !Number.isInteger(seq)) return void 0;
  let call;
  for (const event of events) {
    if (call) {
      if (event?.type === "tool/result" && event.data?.message?.toolCallId === call.callId) {
        const cut2 = [];
        const args2 = full(typeof call.arguments === "string" ? call.arguments : "", "args", cut2);
        const result = full(blocks(event.data.message.content, "text").join("\n"), "result", cut2);
        return { seq, kind: "tool", args: args2, result, ...cut2.length ? { truncated: cut2 } : {} };
      }
      continue;
    }
    if (event?.seq !== seq) continue;
    const data = event.data;
    if (event.type === "user/message" && data) {
      const cut2 = [];
      const value = full(blocks(data.content, "text").join("\n"), "text", cut2);
      return { seq, kind: data.source?.kind === "user" ? "user" : "context", text: value, ...cut2.length ? { truncated: cut2 } : {} };
    }
    if (event.type === "assistant/message" && Number.isInteger(data?.turn)) {
      const cut2 = [];
      const value = full(blocks(data.message?.content, "text").join("\n"), "text", cut2);
      const reasoning = blocks(data.message?.content, "reasoning");
      const thinking = reasoning.length ? full(reasoning.join("\n"), "thinking", cut2) : void 0;
      return { seq, kind: "assistant", text: value, ...thinking !== void 0 ? { thinking } : {}, ...cut2.length ? { truncated: cut2 } : {} };
    }
    if (event.type === "tool/call" && text5(data?.callId) && Number.isInteger(data?.turn)) {
      call = data;
      continue;
    }
    return void 0;
  }
  if (!call) return void 0;
  const cut = [];
  const args = full(typeof call.arguments === "string" ? call.arguments : "", "args", cut);
  return { seq, kind: "tool", args, ...cut.length ? { truncated: cut } : {} };
}

// src/host/sessions/index.ts
var STORED_LOGS = 16;
var name3 = "dsh-layerfs-sessions";
var inject3 = ["layerfs", "layerfsRemote"];
var need = (args, key) => {
  const v = args?.[key];
  if (typeof v !== "string" || !v) throw new CliError("InvalidInput", `${key} is required`);
  return v;
};
function agentCli(ctx) {
  return ctx.layerfs.agentCli();
}
var AVAILABILITY_POLL_MS = 1e4;
var turnOf = (session) => {
  const events = session?.snapshotEvents(0) ?? [];
  for (let i = events.length - 1; i >= 0; i--) if (events[i].type === "turn/start") return Number(events[i].data?.turn);
  return void 0;
};
function apply3(ctx) {
  ctx.plugin(LayerfsSessions);
  ctx.inject(["layerfsSessions", "layerfs", "layerfsRemote", "workspaceRegistry"], (ctx2) => {
    const sessions = ctx2.layerfsSessions;
    const record = async (invocation) => {
      const persistence = ctx2.get("sessionPersistence");
      if (!persistence?.recordInvocation) throw new Error("Project session persistence is not available to record the invocation");
      await persistence.recordInvocation(invocation);
      ctx2.layerfs.emit("layerfs-operation", { sessionId: invocation.sessionId });
    };
    const turnCalls = /* @__PURE__ */ new Map();
    const collect = async (sessionId, calls) => {
      if (!calls.length) return;
      const since = Math.min(...calls.map((c) => c.since)) - 1e3;
      const lines2 = await callsSince(ctx2.layerfs, `${TAG_PREFIX}${sessionId}:`, since);
      if (!lines2.length) return;
      const persistence = ctx2.get("sessionPersistence");
      const sidecar = await Promise.resolve(persistence?.readSidecar?.(sessionId)).catch(() => void 0);
      const known4 = new Set((sidecar?.invocations ?? []).map((i) => i?.id));
      for (const line of [...lines2].reverse()) {
        const tag = parseTag(line.tag);
        if (!tag || tag.sessionId !== sessionId || known4.has(tag.receiptId)) continue;
        const call = calls.find((c) => c.identity.scope && tag.receiptId.startsWith(`${c.identity.scope}.`) && line.at >= c.since - 1e3);
        if (!call) continue;
        known4.add(tag.receiptId);
        const exit = line.argv[0] === "workspace" && line.argv[1] === "exec" && line.tag ? exitOfOutput(readOutput(outputsDir(ctx2.layerfs.callLog), line.tag), line.argv.includes("--stream")) : void 0;
        const fastForward = line.argv[0] === "branch" && line.argv[1] === "merge" && line.kind === "Merged" && line.tag ? fastForwardOfOutput(readOutput(outputsDir(ctx2.layerfs.callLog), line.tag)) : void 0;
        await record(receiptFromLine(line, call.identity, tag.receiptId, exit, fastForward));
      }
    };
    const settle = async (sessionId) => {
      const calls = turnCalls.get(sessionId) ?? [];
      turnCalls.delete(sessionId);
      await collect(sessionId, calls).catch((e) => ctx2.logger("layerfs").warn("collect invocations: %s", String(e)));
    };
    ctx2.on("tools/execute", async (execution, next) => {
      const agent = execution.agent;
      if (!agent) return next();
      const id = String(agent.id);
      const place2 = sessions.placeOfId(id);
      if (!place2?.project) return next();
      await sessions.ensureBound(agent, { rebind: false });
      let binding = sessions.binding(id);
      if (binding?.kind === "shared" && binding.parent) binding = sessions.binding(binding.parent);
      const simulations = ctx2.get("layerfsSimulations");
      const scriptedWorkspace = simulations?.workspaceOfCall?.(id, String(execution.callId));
      const step = simulations?.stepOfCall?.(id, String(execution.callId));
      const identity2 = { origin: "tool", sessionId: id, project: place2.project, workspace: scriptedWorkspace ?? binding?.ws, turn: turnOf(agent.session), toolCallId: execution.callId, scope: toolScope(id, String(execution.callId)), ...step ? { step } : {} };
      const call = { identity: identity2, since: Date.now() };
      const calls = turnCalls.get(id) ?? [];
      calls.push(call);
      turnCalls.set(id, calls);
      try {
        return await withTraceContext({ ...identity2, record, onError: (e) => ctx2.logger("layerfs").warn("record invocation: %s", String(e)) }, next);
      } finally {
        await collect(id, [call]).catch((e) => ctx2.logger("layerfs").warn("collect invocations: %s", String(e)));
        if (!await ctx2.layerfs.nativeLogs().catch(() => true)) notifyCallLog(ctx2.layerfs.callLog);
      }
    });
    const store = new SessionStore(ctx2, sessions);
    sessions.store = store;
    ctx2.effect(() => () => {
      store.dispose();
      if (sessions.store === store) sessions.store = void 0;
    }, "dsh-layerfs: session store");
    ctx2.effect(() => {
      const timer = setTimeout(() => {
        void store.syncAll().then(async () => {
          const persistence = ctx2.get("sessionPersistence");
          const ids = /* @__PURE__ */ new Set([...Object.keys(sessions.state.read().sessions), ...persistence?.ownedSessionIds?.() ?? []]);
          for (const id of ids) await sessions.detach(id);
        }).catch((e) => ctx2.logger("layerfs").warn("session recovery: %s", String(e)));
      }, 1500);
      return () => clearTimeout(timer);
    }, "dsh-layerfs: session store sync");
    ctx2.effect(() => {
      const timer = setInterval(() => {
        if (sessions.watchesAvailability()) void sessions.refreshAvailability().catch((e) => ctx2.logger("layerfs").warn("availability: %s", String(e?.message ?? e)));
      }, AVAILABILITY_POLL_MS);
      return () => clearInterval(timer);
    }, "dsh-layerfs: store availability");
    const idle = /* @__PURE__ */ new Map();
    ctx2.effect(() => () => {
      for (const t of idle.values()) clearTimeout(t);
      idle.clear();
    }, "dsh-layerfs: idle timers");
    ctx2.on("agent/created", async ({ agent, source }) => {
      clearTimeout(idle.get(String(agent.id)));
      await sessions.bindAgent(agent, String(source?.kind ?? source ?? "create"));
      return void 0;
    });
    ctx2.on("agent-preset/selected", (sessionId, preset) => {
      if (preset !== "layerfs") return;
      const agent = ctx2.get("agents")?.get?.(sessionId);
      if (agent) queueMicrotask(() => {
        void sessions.enforceFolderPreset(agent).catch(() => {
        });
      });
    });
    ctx2.on("agent/pre-step", async (payload, next) => {
      clearTimeout(idle.get(String(payload.agent.id)));
      await sessions.ensureBound(payload.agent);
      return next();
    });
    ctx2.on("agent/turn-stopping", async ({ agent, turn }) => {
      await settle(String(agent.id));
      if (ctx2.layerfs.checkpoints === "off") return;
      const id = String(agent.id);
      const b = sessions.binding(id);
      if (!b || b.kind !== "project") return;
      await sessions.lane(id, () => sessions.checkpoint(id, "turn", Number(turn), `dsh turn ${turn}`));
    });
    ctx2.on("session/event", (session, event) => {
      if (event?.type !== "turn/end") return;
      const id = String(session.id);
      sessions.markTurnEnd(id, Number(event.data?.turn), Number(event.seq));
      store.schedule(id);
    });
    ctx2.on("agent/disposed", ({ agent }) => {
      const id = String(agent.id);
      void settle(id);
      store.schedule(id, 0);
      const minutes = ctx2.layerfs.idleMinutes;
      const b = sessions.binding(id);
      if (!minutes || b?.kind !== "project" || b.state !== "bound") return;
      clearTimeout(idle.get(id));
      idle.set(id, setTimeout(() => {
        idle.delete(id);
        void sessions.close(id, "idle").catch((error2) => ctx2.logger("layerfs").warn("idle close %s: %s", id, error2?.message ?? error2));
      }, minutes * 6e4));
    });
    ctx2.inject(["shellEnv"], (scope) => {
      const dispose = scope.shellEnv.register({
        name: "layerfs",
        variables: {
          DSH_LAYERFS_CLI: { description: "The pinned LayerFS CLI for this session's project (already bound to this app's LayerFS home)" },
          DSH_LAYERFS_PROJECT: { description: "The LayerFS project this session works in" },
          DSH_LAYERFS_BRANCH: { description: "The session Branch (`dsh.<id>[.rN]`): this conversation's saved history; it changes after a restore" },
          DSH_LAYERFS_WS: { description: "The session's mounted LayerFS Workspace handle (`<sandbox>:<name>`)" },
          DSH_LAYERFS_TRACE_CONTEXT: { description: "Invocation provenance for managed LayerFS commands; preserve unchanged" },
          DSH_LAYERFS_SDK: { description: "File URL of the LayerFS Node SDK (`@layerfs/node`) bound to this app's LayerFS home: `const { default: layerfs } = await import(process.env.DSH_LAYERFS_SDK)`" }
        },
        resolve: (execution) => {
          const agent = execution?.agent;
          if (!agent) return {};
          let b = sessions.binding(String(agent.id));
          if (b?.kind === "shared" && b.parent) b = sessions.binding(b.parent) ?? b;
          if (!b || b.state !== "bound") return {};
          const cli = agentCli(ctx2);
          if (!cli) return {};
          const sdk = ctx2.layerfs.agentSdk();
          return {
            DSH_LAYERFS_CLI: cli,
            ...sdk ? { DSH_LAYERFS_SDK: pathToFileURL2(sdk).href } : {},
            DSH_LAYERFS_TRACE_CONTEXT: traceEnvironment({ origin: "tool", sessionId: String(agent.id), project: b.project, workspace: scope.get("layerfsSimulations")?.workspaceOfCall?.(String(agent.id), String(execution.callId)) ?? b.ws, turn: turnOf(agent.session), toolCallId: execution.callId, scope: toolScope(String(agent.id), String(execution.callId)) }),
            ...b.project ? { DSH_LAYERFS_PROJECT: b.project } : {},
            ...b.branch ? { DSH_LAYERFS_BRANCH: b.branch } : {},
            ...b.ws ? { DSH_LAYERFS_WS: b.ws } : {}
          };
        }
      });
      ctx2.effect(() => () => dispose(), "dsh-layerfs: shell env");
    });
    ctx2.inject(["systemPrompt"], (scope) => {
      const sp = scope.systemPrompt;
      sp.context({
        name: "layerfs:workspace",
        order: sp.getContextOrder("WORKING_DIRECTORY"),
        interpolate: false,
        text: (context2) => {
          const id = context2.agent?.id;
          if (!id) return "";
          let b = sessions.binding(String(id));
          if (b?.kind === "shared" && b.parent) b = sessions.binding(b.parent) ?? b;
          if (!b) return "";
          if (sessions.isSimulationManaged(String(id))) {
            return `## LayerFS project
Project files belong to ${JSON.stringify(b.project)}. The active model supplies explicit LayerFS commands and manages their saved contexts. Local commands run in scratch ${JSON.stringify(b.scratch)}; scratch is never checkpointed. Preserve actual tool results and report only confirmed changes.`;
          }
          return projectContext(b, { checkpoints: ctx2.layerfs.checkpoints === "turn", subagent: String(id) !== b.sessionId });
        }
      });
    });
    const storedLogs = /* @__PURE__ */ new Map();
    const sessionEvents = async (id) => {
      try {
        const events = ctx2.get("sessions")?.get?.(id)?.snapshotEvents?.(0);
        if (Array.isArray(events)) return events;
      } catch {
      }
      try {
        const persistence = localPersistence(ctx2);
        const snapshot = await persistence?.stat(id);
        if (!snapshot) return void 0;
        const path2 = snapshot.location?.path;
        const info2 = path2 && existsSync18(path2) ? statSync9(path2) : void 0;
        const key = info2 ? `${info2.size}:${info2.mtimeMs}` : "";
        const kept2 = storedLogs.get(id);
        if (key && kept2?.key === key) return kept2.events;
        const reader = await persistence.open(id, "read");
        let read2;
        try {
          read2 = (await reader.read()).events;
        } finally {
          await reader.close();
        }
        if (!Array.isArray(read2)) return void 0;
        if (key) {
          storedLogs.delete(id);
          storedLogs.set(id, { key, events: read2 });
          while (storedLogs.size > STORED_LOGS) storedLogs.delete(storedLogs.keys().next().value);
        }
        return read2;
      } catch {
        return void 0;
      }
    };
    const trajectoryInput = async (id) => {
      const persistence = ctx2.get("sessionPersistence");
      const sidecar = await Promise.resolve(persistence?.readSidecar?.(id)).catch(() => void 0);
      let binding = sessions.binding(id);
      if (binding?.kind === "shared" && binding.parent) binding = sessions.binding(binding.parent) ?? binding;
      const local = sessions.checkpoints(id);
      const events = await sessionEvents(id);
      return {
        sessionId: id,
        project: binding?.project ?? persistence?.ownerOf?.(id)?.project ?? null,
        branch: binding?.branch ?? (typeof sidecar?.codeBranch === "string" ? sidecar.codeBranch : null),
        ...events ? { events } : {},
        invocations: Array.isArray(sidecar?.invocations) ? sidecar.invocations : [],
        checkpoints: local.length ? local : Array.isArray(sidecar?.checkpoints) ? sidecar.checkpoints : []
      };
    };
    ctx2.layerfsRemote.operate(ctx2, {
      "projects.catalog": async () => {
        const provider = ctx2.get("sessionPersistence");
        return { rows: await provider.catalogProjects(), scratchKey: ctx2.layerfs.scratchProject };
      },
      // Projects with sessions on this DSH, newest activity first (docs/specs/layerfs-workspaces.md §4).
      // Local records only: no LayerFS call, so listing never resolves or claims a project.
      "projects.recent": async () => {
        const provider = ctx2.get("sessionPersistence");
        const persistence = localPersistence(ctx2);
        const state = sessions.state.read();
        const scratch = ctx2.layerfs.scratchProject;
        const rows2 = /* @__PURE__ */ new Map();
        const add = (id, project, at, created = at) => {
          if (!project || project === scratch) return;
          const projectId = provider?.projectIdOf?.(id);
          const key = projectId ?? project;
          const row = rows2.get(key) ?? { project, ...projectId ? { projectId } : {}, lastActivity: 0, newestSession: 0, sessionIds: [] };
          if (!row.sessionIds.includes(id)) row.sessionIds.push(id);
          row.lastActivity = Math.max(row.lastActivity, at || 0);
          row.newestSession = Math.max(row.newestSession, created || 0);
          rows2.set(key, row);
        };
        const seen = /* @__PURE__ */ new Set();
        for (const b of Object.values(state.sessions)) {
          if (b.kind === "shared" || !b.project) continue;
          seen.add(b.sessionId);
          add(b.sessionId, b.project, b.updatedAt ?? b.createdAt, b.createdAt);
        }
        const local = async (id) => {
          const snap = await persistence?.stat(id).catch(() => void 0);
          return snap && snap.header?.origin !== "subagent" ? snap : void 0;
        };
        for (const [id, pending2] of Object.entries(state.pending)) {
          if (seen.has(id)) continue;
          seen.add(id);
          const snap = await local(id);
          if (snap) add(id, pending2.project, snap.header.createdAt);
        }
        for (const id of provider?.ownedSessionIds?.() ?? []) {
          if (seen.has(id)) continue;
          const snap = await local(id);
          if (!snap) continue;
          const sidecar = await provider.readSidecar?.(id).catch(() => void 0);
          if (sidecar?.bindingKind === "shared") continue;
          add(id, provider.ownerOf?.(id)?.project, snap.header.createdAt);
        }
        return { projects: [...rows2.values()].sort((a, b) => b.lastActivity - a.lastActivity) };
      },
      "sessions.choose": async (args) => {
        const sessionId = need(args, "sessionId");
        const project = typeof args?.project === "string" && args.project ? args.project : null;
        const machine = typeof args?.machine === "string" && args.machine ? args.machine : void 0;
        await sessions.choose(sessionId, project, args?.projectId, machine);
        if (project) void store.sync(project).catch(() => {
        });
        return { sessionId, project };
      },
      "sessions.prepareScratch": async (args) => {
        const out = await sessions.ensureScratchWorkspace();
        void store.sync(ctx2.layerfs.scratchProject).catch(() => {
        });
        return { ...out, ...args?.navigate === false ? {} : { navigate: { workspaceId: out.workspaceId } } };
      },
      "sessions.list": async (args) => {
        const project = need(args, "project");
        const projectId = typeof args?.projectId === "string" ? args.projectId : void 0;
        const provider = ctx2.get("sessionPersistence");
        let liveId = projectId;
        let identityError;
        if (projectId && !args?.localOnly) {
          liveId = await provider.catalog.assert(project, projectId, { claim: false }).then((row) => row.projectId, (error2) => {
            identityError = error2;
            return projectId;
          });
        }
        const unclaimed = !!liveId?.startsWith(UNCLAIMED);
        const belongs = (id) => !liveId || (unclaimed ? !provider?.projectIdOf?.(id) : provider?.projectIdOf?.(id) === liveId);
        const state = sessions.state.read();
        const persistence = localPersistence(ctx2);
        const rows2 = /* @__PURE__ */ new Map();
        const localTitle = async (id) => {
          const live = ctx2.get("sessions")?.get(id);
          const titles = live?.snapshotEvents(0).filter((event) => event.type === "session/title" && typeof event.data?.title === "string") ?? [];
          return titles.at(-1)?.data.title ?? (await provider?.readSidecar?.(id).catch(() => void 0))?.title ?? null;
        };
        for (const b of Object.values(state.sessions)) {
          if (b.project !== project || b.kind === "shared" || !belongs(b.sessionId)) continue;
          const snap = await persistence?.stat(b.sessionId).catch(() => void 0);
          rows2.set(b.sessionId, {
            sessionId: b.sessionId,
            title: snap ? await localTitle(b.sessionId) : null,
            branch: b.branch ?? null,
            state: b.state,
            local: !!snap,
            executionState: b.executionState ?? (b.state === "bound" ? "active" : "inactive"),
            error: b.error ?? null,
            checkpoints: (state.checkpoints[b.sessionId] ?? []).filter((c) => c.commit && c.changed > 0).length,
            updatedAt: b.updatedAt,
            stored: !!state.mirror[b.sessionId] && !state.mirror[b.sessionId].error
          });
        }
        for (const [id, pending2] of Object.entries(state.pending)) {
          if (pending2.project !== project || rows2.has(id) || !belongs(id)) continue;
          const snap = await persistence?.stat(id);
          if (snap) rows2.set(id, { sessionId: id, title: await localTitle(id), state: "pending", local: true, checkpoints: 0, updatedAt: snap.header.createdAt, stored: false });
        }
        for (const id of provider?.ownedSessionIds?.(project, unclaimed ? void 0 : liveId) ?? []) {
          if (rows2.has(id) || !belongs(id)) continue;
          const snap = await persistence?.stat(id);
          if (!snap || snap.header.origin === "subagent") continue;
          const sidecar = await provider.readSidecar(id);
          if (sidecar?.bindingKind === "shared") continue;
          rows2.set(id, {
            sessionId: id,
            title: await localTitle(id),
            state: "local",
            local: true,
            checkpoints: (sidecar?.checkpoints ?? []).filter((c) => c.commit && c.changed > 0).length,
            updatedAt: snap.header.createdAt,
            stored: !!sidecar?.archive && !sidecar.archive.error
          });
        }
        let discoveryError = null;
        const discover2 = async () => {
          if (identityError) throw identityError;
          return store.discover(project);
        };
        const discovered = args?.localOnly ? [] : await discover2().catch((error2) => {
          discoveryError = { code: error2?.code ?? "Unavailable", message: String(error2?.message ?? error2) };
          return [];
        });
        for (const s of discovered) {
          if (s.shared) continue;
          if (liveId && s.projectId && s.projectId !== liveId) {
            discoveryError = { code: "BindingRequired", message: "This restored copy contains conversations owned by another project identity. The original histories remain separate." };
            continue;
          }
          const row = rows2.get(s.sessionId);
          rows2.set(s.sessionId, {
            ...row ?? { sessionId: s.sessionId, branch: s.codeBranch, state: "stored", local: s.local, checkpoints: s.checkpoints, updatedAt: s.updatedAt },
            title: s.title,
            stored: true
          });
        }
        const archived = new Set(ctx2.workspaceRegistry?.archivedSessionIds ?? []);
        return { project, discoveryError, sessions: [...rows2.values()].filter((r) => !archived.has(r.sessionId)).sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0)) };
      },
      "sessions.open": async (args) => {
        const sessionId = need(args, "sessionId");
        const workspaceId = typeof args?.workspaceId === "string" && args.workspaceId ? args.workspaceId : void 0;
        if (await localPersistence(ctx2)?.stat(sessionId).catch(() => void 0)) {
          await sessions.attach(workspaceId, sessionId);
          return { sessionId, imported: false, navigate: { sessionId } };
        }
        ;
        ctx2.get("sessionPersistence")?.undelete?.(sessionId);
        const out = args?.project ? await store.import(String(args.project), sessionId, workspaceId) : { sessionId, imported: true };
        const controller = ctx2.get("sessionController");
        if (!controller?.resolveAgent) throw new CliError("Unavailable", "DSH's session controller is not available");
        const resolved = await controller.resolveAgent(sessionId);
        if (resolved && "error" in resolved) {
          if (resolved.error?.code === "session/not-found") throw new CliError("NotFound", "This session is not stored locally or in any LayerFS project this DSH knows");
          throw resolved.error;
        }
        await sessions.attach(workspaceId, sessionId);
        return { ...out, navigate: { sessionId } };
      },
      "sessions.close": async (args) => {
        await sessions.close(need(args, "sessionId"), "user");
        return { ok: true };
      },
      "sessions.forget": async (args) => {
        await sessions.forget(need(args, "sessionId"));
        return { ok: true };
      },
      // `observe: true` (the views' polls and effect reads): a read that changes nothing
      "session.state": (args) => sessions.view(need(args, "sessionId"), { observe: args?.observe === true }),
      "sessions.availability": async () => {
        await sessions.refreshAvailability();
        return { stores: sessions.availability() };
      },
      "session.annotations": async (args) => {
        const id = need(args, "sessionId");
        const persistence = ctx2.get("sessionPersistence");
        return await persistence?.readSidecar?.(id) ?? { invocations: [] };
      },
      "session.trajectory": async (args) => buildTrajectory(await trajectoryInput(need(args, "sessionId"))),
      "session.trajectory.record": async (args) => {
        const id = need(args, "sessionId");
        const seq = Number(args?.seq);
        if (!Number.isInteger(seq)) throw new CliError("InvalidInput", "seq must be an integer");
        const detail = trajectoryDetail(await sessionEvents(id), seq);
        if (!detail) throw new CliError("NotFound", `No trajectory record ${seq} in this session's log`);
        return detail;
      },
      // B2 #7: a project session row's one action, Archive (DSH's own archive set; Unarchive in DSH brings it back)
      "sessions.archive": async (args) => {
        const id = need(args, "sessionId");
        await ctx2.workspaceRegistry.archiveSession(id);
        ctx2.layerfs.emit("layerfs-session", { sessionId: id });
        return { sessionId: id, archived: true };
      },
      "session.place": (args) => {
        const id = need(args, "sessionId");
        const place2 = sessions.placeOfId(id);
        const projectId = ctx2.get("sessionPersistence")?.projectIdOf?.(id);
        return { place: place2 ? { ...place2, projectId } : null };
      },
      "sessions.scratch": async (args) => {
        const id = need(args, "sessionId");
        const workspace = args?.workspaceId ? ctx2.workspaceRegistry.get(String(args.workspaceId)) : void 0;
        if (args?.workspaceId && !workspace) throw new CliError("NotFound", "This local workspace no longer exists");
        await sessions.selectScratch(id, workspace?.path ?? need(args, "cwd"));
        return { place: sessions.placeOfId(id) };
      },
      "sessions.scratchOptions": () => ({ workspaces: ctx2.workspaceRegistry.list().map((w) => ({ workspaceId: String(w.id), title: w.title, path: w.path })) }),
      // Retire only generated legacy registrations. Registry deletion preserves
      // directories, logs, and project bindings; recorded anchor identities stay
      // available to migrate old conversation headers when they are resumed.
      "sessions.retireLegacyWorkspaces": async (args) => {
        const state = sessions.state.read();
        const root = `${ctx2.layerfs.root}/projects`;
        const candidates = ctx2.workspaceRegistry.list().flatMap((workspace) => {
          const entry = Object.values(state.projects).find((p) => p.anchor === workspace.path);
          if (workspace.path !== root && (!entry || !workspace.path.startsWith(`${root}/`))) return [];
          const unknown = workspace.sessionIds.filter((id) => !entry?.project && !sessions.placeOfId(String(id))?.project);
          return [{
            workspaceId: String(workspace.id),
            title: workspace.title,
            path: workspace.path,
            project: entry?.project ?? null,
            sessions: [...workspace.sessionIds],
            unplacedSessions: unknown,
            retired: false
          }];
        });
        const before = /* @__PURE__ */ new Map();
        if (args?.apply === true) for (const candidate of candidates) {
          for (const id of candidate.sessions) before.set(String(id), !!await localPersistence(ctx2)?.stat(String(id)));
          candidate.retired = await ctx2.workspaceRegistry.delete(candidate.workspaceId);
        }
        if (candidates.some((c) => c.retired)) ctx2.layerfs.emit("layerfs-workspaces-changed", {});
        const preservedSessions = [];
        for (const [sessionId, localBefore] of before) preservedSessions.push({ sessionId, localBefore, localAfter: !!await localPersistence(ctx2)?.stat(sessionId) });
        return { candidates, preservedSessions };
      },
      "session.mirror": async (args) => {
        await store.mirror(need(args, "sessionId"));
        return { ok: true };
      },
      "checkpoints.create": async (args) => {
        const id = need(args, "sessionId");
        const checkpoint = await sessions.lane(id, () => sessions.checkpoint(id, "manual", Number(args?.turn ?? 0), String(args?.message ?? "Checkpoint")));
        store.schedule(id);
        return { checkpoint: checkpoint ?? null };
      },
      "checkpoints.diff": async (args) => {
        const id = need(args, "sessionId");
        const b = sessions.binding(id);
        if (!b?.project) throw new CliError("InvalidInput", "This session has no LayerFS project");
        const to = need(args, "to");
        const from = typeof args?.from === "string" && args.from ? args.from : null;
        if (!from) return { files: [], from, to };
        return await ctx2.layerfs.lfs.commit.diff(b.project, to, { from, ...args?.paths_only ? {} : { with: ["patch"] } });
      },
      "checkpoints.restore": async (args) => {
        const id = need(args, "sessionId");
        const binding = await sessions.restore(id, need(args, "commit"));
        store.schedule(id);
        return { binding };
      },
      "checkpoints.branch": async (args) => {
        const out = await sessions.branchAt(need(args, "sessionId"), typeof args?.commit === "string" ? args.commit : null, Number(args?.turn ?? 0));
        return { ...out, navigate: { sessionId: out.sessionId } };
      },
      "projects.branches": async (args) => ({ items: await pages((p) => ctx2.layerfs.lfs.branch.list(need(args, "project"), { ...p, detail: true })) })
    });
  });
}

// src/host/simulations/index.ts
var simulations_exports = {};
__export(simulations_exports, {
  apply: () => apply4,
  inject: () => inject4,
  name: () => name4,
  simulationArguments: () => simulationArguments
});

// src/host/simulations/model.ts
import { LlmAdapter, ToolCallId } from "@deepseek-ai/dsh-llm";
var DEFAULT_PACING = { word: [20, 40], decision: [300, 800], argument: [30, 70] };
function pacingFromEnvironment(value = process.env.DSH_LAYERFS_SIMULATION_PACING) {
  return value !== void 0 && /^(0|off|false|no)$/i.test(value.trim()) ? null : DEFAULT_PACING;
}
var between = ([low, high]) => low + Math.random() * Math.max(0, high - low);
function pause(ms, signal) {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve11, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const abort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", abort);
      resolve11();
    }, ms);
    signal?.addEventListener("abort", abort, { once: true });
  });
}
function textDeltas(text6, random = Math.random) {
  const tokens = text6.match(/\s*\S+\s*/g) ?? (text6 ? [text6] : []);
  const deltas = [];
  for (let index = 0; index < tokens.length; ) {
    const size = 2 + Math.floor(random() * 3);
    deltas.push(tokens.slice(index, index + size).join(""));
    index += size;
  }
  if (!deltas.length && text6) deltas.push(text6);
  return deltas;
}
function argumentDeltas(json4) {
  const lead = json4.match(/^\{"description":"(?:[^"\\]|\\.)*",?/);
  const head = lead ? lead[0] : json4.slice(0, Math.ceil(json4.length / 3));
  const rest = json4.slice(head.length);
  if (!rest) return [head];
  if (rest.length < 24) return [head, rest];
  const middle = Math.ceil(rest.length / 2);
  return [head, rest.slice(0, middle), rest.slice(middle)];
}
var normalize = (reply) => "id" in reply && "name" in reply ? { calls: [reply] } : reply;
var SimulationAdapter = class extends LlmAdapter {
  constructor(source, options = {}) {
    super();
    this.source = source;
    this.pacing = options.pacing === void 0 ? pacingFromEnvironment() : options.pacing === true ? DEFAULT_PACING : options.pacing || null;
  }
  source;
  pacing;
  providerInfo(provider) {
    return { id: provider, name: "LayerFS scripts" };
  }
  async listModels(provider) {
    return this.source.scripts().map((script) => ({ provider, id: script.scriptId, name: script.name, description: "Project action script", inputModalities: ["text"] }));
  }
  async resolveModel(provider, model) {
    const script = this.source.scripts().find((script2) => script2.scriptId === model);
    if (!script) throw new Error("This script is unavailable. Select an ordinary model to continue this session.");
    return { provider, id: model, name: script.name, description: "Project action script", context: { contextWindow: 1e6 }, inputModalities: ["text"] };
  }
  async *stream(options) {
    const signal = options.signal;
    signal?.throwIfAborted();
    if (options.purpose !== void 0) {
      const text6 = options.purpose === "compaction" ? simulationCompactionSummary(options, this.source.compactionContext?.(options)) : this.source.scripts().find((script) => script.scriptId === options.model)?.name ?? "Project work";
      yield { type: "block-start", index: 0, blockType: "text" };
      yield { type: "text-delta", index: 0, text: text6 };
      yield { type: "block-end", index: 0, block: { type: "text", text: text6 } };
      yield { type: "finish", reason: { kind: "stop" } };
      return;
    }
    try {
      const pacing = this.pacing;
      let text6 = "";
      let open3 = false;
      const self = this;
      async function* streamText(segment) {
        if (!segment) return;
        if (!open3) {
          open3 = true;
          yield { type: "block-start", index: 0, blockType: "text" };
        }
        const piece = text6 && !/\s$/.test(text6) ? `

${segment}` : segment;
        const deltas = pacing ? textDeltas(piece) : [piece];
        for (const [index, delta] of deltas.entries()) {
          if (pacing && index) await pause(between(pacing.word), signal);
          yield { type: "text-delta", index: 0, text: delta };
        }
        text6 += piece;
      }
      const spoken = [];
      let wake;
      let outcome2;
      let closed = false;
      const say = (value) => closed ? Promise.resolve() : new Promise((resolve11) => {
        spoken.push({ text: value, done: resolve11 });
        wake?.();
      });
      void Promise.resolve().then(() => self.source.next(options, { say })).then(
        (reply2) => {
          outcome2 = { reply: normalize(reply2) };
          wake?.();
        },
        (error2) => {
          outcome2 = { error: error2 };
          wake?.();
        }
      );
      try {
        for (; ; ) {
          while (spoken.length) {
            const item = spoken.shift();
            yield* streamText(item.text);
            item.done();
          }
          if (outcome2) break;
          await new Promise((resolve11) => {
            wake = resolve11;
            if (spoken.length || outcome2) resolve11();
          });
          wake = void 0;
        }
      } finally {
        closed = true;
        for (const item of spoken.splice(0)) item.done();
      }
      if ("error" in outcome2) throw outcome2.error;
      signal?.throwIfAborted();
      const reply = outcome2.reply;
      if (reply.text) yield* streamText(reply.text);
      if (open3) yield { type: "block-end", index: 0, block: { type: "text", text: text6 } };
      const calls = reply.calls ?? [];
      for (const [offset, call] of calls.entries()) {
        const index = (open3 ? 1 : 0) + offset;
        if (pacing) await pause(between(pacing.decision), signal);
        const id = ToolCallId(call.id), args = JSON.stringify(call.arguments);
        yield { type: "block-start", index, blockType: "tool-call" };
        for (const [part, delta] of (pacing ? argumentDeltas(args) : [args]).entries()) {
          if (pacing && part) await pause(between(pacing.argument), signal);
          yield { type: "tool-call-delta", index, id, ...part ? {} : { name: call.name }, argumentsDelta: delta };
        }
        yield { type: "block-end", index, block: { type: "tool-call", id, name: call.name, arguments: args } };
      }
      if (!open3 && !calls.length) {
        yield { type: "block-start", index: 0, blockType: "text" };
        yield { type: "block-end", index: 0, block: { type: "text", text: "" } };
      }
      yield { type: "finish", reason: { kind: calls.length ? "tool-calls" : "stop" } };
    } finally {
      if (signal?.aborted && options.sessionId !== void 0) await this.source.holdStopping?.(String(options.sessionId));
    }
  }
};
function simulationCompactionSummary(options, context2 = "") {
  const limit = Math.max(512, Math.min(24e3, Math.floor((options.maxTokens ?? 4e3) * 3)));
  const excerpt = (value, size) => value.length <= size ? value : `${value.slice(0, size)} [excerpt truncated]`;
  const text6 = (message) => (message.content ?? []).filter((block) => block.type === "text").map((block) => block.text).join("\n");
  const messages = options.messages.filter((message, index, all) => !(index === all.length - 1 && message.role === "user" && !message.source));
  const sections = ["Recorded project checkpoint. Text below contains partial excerpts; full messages and tool output remain in the native session history."];
  if (context2) sections.push(excerpt(context2, 5e3));
  const requests = messages.filter((message) => message.role === "user");
  const selected = [...requests.slice(0, 2), ...requests.slice(-3)].filter((message, index, all) => all.indexOf(message) === index);
  for (const message of selected) sections.push(`Recorded request/context:
${excerpt(text6(message), 1200)}`);
  for (const message of messages.filter((message2) => message2.role === "tool" && message2.isError).slice(-4)) sections.push(`Recorded tool error:
${excerpt(text6(message), 1200)}`);
  for (const message of messages.filter((message2) => message2.role === "assistant").slice(-3)) {
    const reply = text6(message);
    if (reply) sections.push(`Recorded assistant response:
${excerpt(reply, 1e3)}`);
  }
  for (const message of messages.filter((message2) => message2.role === "tool").slice(-6)) {
    const result = message;
    sections.push(`Recorded tool result ${result.toolCallId ?? result.source?.callId ?? ""}:
${excerpt(text6(message), 1e3)}`);
  }
  const system = messages.filter((message) => message.role === "system" || message.role === "developer");
  for (const message of system.slice(-2)) {
    const value = text6(message);
    sections.push(`Recorded execution instructions (ending excerpt):
${value.length > 2500 ? "[earlier instructions omitted] " : ""}${value.slice(-2500)}`);
  }
  sections.push("Continue from confirmed results and the saved project file context. Omitted output is not evidence that application tests passed. The script driver derives completed actions from the unchanged native log, not from this summary.");
  const summary = sections.join("\n\n");
  return summary.length <= limit ? summary : `${summary.slice(0, Math.max(0, limit - 33))}
[checkpoint excerpts truncated]`;
}

// src/host/simulations/runtime.ts
import { randomUUID as randomUUID14 } from "node:crypto";
import { mkdir as mkdir5, readFile as readFile4, readdir as readdir2, stat } from "node:fs/promises";
import { join as join29, resolve as resolve10 } from "node:path";
import { createUserMessage } from "@deepseek-ai/dsh-llm";

// src/host/simulations/compiler.ts
import { createHash as createHash16, randomUUID as randomUUID13 } from "node:crypto";
import { join as join27 } from "node:path";
var SIMULATION_VERSION = 1;
var SIMULATION_PROFILES = Object.freeze(Object.fromEntries(
  Object.keys(DENSE_TIERS).map((name6, index) => [name6, { conversations: [2, 3, 4, 4, 5, 6, 7, 8][index], children: [[1, 2], [1, 3], [2, 4], [2, 4], [2, 5], [3, 6], [3, 7], [3, 8]][index] }])
));
var json2 = (value) => JSON.stringify(value, null, 2) + "\n";
var quote2 = (value) => `'${String(value).replaceAll("'", "'\\''")}'`;
var hash = (value) => createHash16("sha256").update(value).digest("hex");
var validName = (value) => typeof value === "string" && /^[a-z0-9](?:[a-z0-9_.-]{0,61}[a-z0-9])?$/.test(value);
function compileSimulation({ project, machine = "native", mixed = false, runId = randomUUID13(), cycles, createdAt = (/* @__PURE__ */ new Date()).toISOString() } = {}) {
  if (!Object.hasOwn(SIMULATION_PROFILES, project)) throw new Error(`Unknown simulation project: ${project}`);
  if (!validName(machine) || !validName(runId)) throw new Error("Simulation machine and run ID must be valid LayerFS names.");
  if (typeof mixed !== "boolean") throw new Error("Simulation mixed must be a boolean.");
  const profile = SIMULATION_PROFILES[project];
  const options = { cycles, executionMode: mixed ? "mixed" : "filesystem" };
  const history = projectHistoryPlan(project, options);
  const tag = hash(runId).slice(0, 20);
  const store = `sim-${project}-${tag}`, projectName = `${project}-${tag}`, projectRef2 = `${store}/${projectName}`;
  const files = {}, steps = [], tasks = [];
  const put = (path2, value) => {
    files[path2] = typeof value === "string" ? value : json2(value);
  };
  for (const [path2, content] of Object.entries(history.definition.files)) put(`source/${path2}`, content);
  const setup = [
    { key: "setup.machine", argv: ["machine", "get", machine, "--detail"], dependsOn: [] },
    { key: "setup.store", argv: ["store", "create", store], dependsOn: ["setup.machine"] },
    { key: "setup.project", argv: ["project", "init", projectRef2, "<source>"], dependsOn: ["setup.store"] }
  ];
  if (machine !== "native") setup.push({ key: "setup.push", argv: ["store", "move", store, machine], dependsOn: ["setup.project"] });
  for (const step of setup) steps.push({ ...step, phase: "setup" });
  const conversations = Array.from({ length: Math.min(profile.conversations, history.cycles) }, (_, index) => {
    const topic = DENSE_TIERS[project].topics[index % 3], id = `c${String(index + 1).padStart(2, "0")}-${topic}`;
    const count4 = profile.children[0] + index % (profile.children[1] - profile.children[0] + 1);
    return { id, title: `${history.definition.title}: ${topic} objective ${index + 1}`, project: projectRef2, cycles: [], maxTurns: 10, subagents: Array.from({ length: count4 }, (_2, child) => ({ id: `a${String(child + 1).padStart(2, "0")}-worker`, role: "project-worker", maxTurns: 10 })) };
  });
  for (let cycle = 1; cycle <= history.cycles; cycle++) conversations[Math.min(conversations.length - 1, Math.floor((cycle - 1) * conversations.length / history.cycles))].cycles.push(cycle);
  const raw = projectHistorySteps(store, project, options);
  const originalSandbox = `demo-mix-${project}-1`, sandbox = `sim-${hash(runId).slice(0, 20)}-1`;
  const wsMounts = /* @__PURE__ */ new Map(), branchHeads = /* @__PURE__ */ new Map();
  for (const step of raw) {
    step.argv = step.argv.map((word2) => typeof word2 === "string" ? word2.replaceAll(originalSandbox, sandbox).replaceAll(`${store}/${project}`, projectRef2) : word2);
    if (step.argv[0] === "sandbox" && step.argv[1] === "create") {
      step.resource = { family: "sandbox", name: sandbox };
    }
    if (step.argv[0] === "workspace" && step.argv[1] === "mount") wsMounts.set(`${sandbox}:${step.argv.at(-1)}`, step.key);
    else if (step.argv[0] === "workspace") step.argv[2] = `<ws:${wsMounts.get(step.argv[2])}>`;
    if (step.argv[0] === "branch" && step.argv[1] === "publish" && !step.commitFrom) {
      step.commitFrom = branchHeads.get(step.argv[3]);
      if (!step.commitFrom) throw new Error(`Missing branch head source for ${step.key}`);
      step.argv.push("--at", `<commit:${step.commitFrom}>`);
    }
    if (step.argv[0] === "file" && step.argv[1] === "write") branchHeads.set(step.argv[3], step.key);
    if (step.argv[0] === "branch" && step.argv[1] === "merge") branchHeads.set(step.argv[step.argv.indexOf("--into") + 1], step.key);
    if (!step.dependsOn.length) step.dependsOn = [setup.at(-1).key];
  }
  const taskGroups = /* @__PURE__ */ new Map();
  for (const step of raw) {
    const dense = step.key.match(/^dense\.(\d+)\.([^.]+)\./), cycle = dense ? Number(dense[1]) : 0;
    const conversation = cycle ? conversations.find((item) => item.cycles.includes(cycle)) : conversations[0];
    const lane = dense?.[2];
    const group = !cycle ? "foundation" : step.argv[0] === "branch" && step.argv[1] === "fork" ? "prepare" : lane;
    const id = cycle ? `cycle-${String(cycle).padStart(3, "0")}-${group}` : "foundation";
    if (!taskGroups.has(id)) {
      const delegated = ["a", "b", "maintenance"].includes(group);
      const workerIndex = ((cycle - conversation.cycles[0]) * 3 + ["a", "b", "maintenance"].indexOf(group)) % conversation.subagents.length;
      const agentId = delegated ? conversation.subagents[workerIndex].id : null;
      const folder = `agents/${conversation.id}-${agentId ?? "main"}`;
      const scriptPath = `${folder}/commands/${id}.sh`;
      const task2 = { id, conversationId: conversation.id, agentId, cycle, lane: group, title: cycle ? `Release ${cycle}: ${group}` : "Prepare initial project history", prompt: cycle ? `Complete the ${group} work for release cycle ${cycle}. Preserve dependencies and report only confirmed CLI results.` : "Prepare the project foundation and retained exploration branches.", scriptPath, stepKeys: [], dependsOn: [] };
      tasks.push(task2);
      taskGroups.set(id, task2);
    }
    const task = taskGroups.get(id);
    task.stepKeys.push(step.key);
    steps.push({ ...step, phase: "conversation", conversationId: conversation.id, agentId: task.agentId, taskId: task.id, scriptPath: task.scriptPath });
  }
  for (const task of tasks) {
    const own = steps.filter((step) => step.taskId === task.id);
    const writes = own.map((step) => step.historyArgv ?? step.argv).filter((argv) => argv[0] === "file" && argv[1] === "write");
    const paths = [...new Set(writes.map((argv) => argv[4]))];
    task.files = paths;
    if (!task.cycle) {
      task.title = `Establish ${history.definition.title} base releases and exploration branches`;
      task.prompt = `Prepare the reference ${project} project foundation, integrate its initial features and maintenance, and retain unfinished exploration branches. Work only in ${projectRef2}. Follow the compiled dependency order. Save the real CLI receipts for every mutation and publication; these fixture files do not prove an application test ran.`;
      continue;
    }
    const branch = denseCycleBranches(project, task.cycle), topics = DENSE_TIERS[project].topics;
    const descriptions = {
      prepare: [`Prepare release ${task.cycle} feature and maintenance work`, `Fork ${branch.a}, ${branch.b} and ${branch.maintenance} from the current published main. These branches must share the intended release base before their independent writers begin.`],
      a: [`Revise ${topics[0]} for release ${task.cycle}`, `Update ${branch.a} for the ${topics[0]} feature stream. Author the specification, examples, policy and review revisions in their prescribed order.`],
      b: [`Revise ${topics[1]} for release ${task.cycle}`, `Update ${branch.b} for the independent ${topics[1]} feature stream. Keep its changes on that branch until integration.`],
      maintenance: [`Maintain ${topics[2]} for release ${task.cycle}`, `Revise ${branch.maintenance} for ${topics[2]}. Preserve its earlier main base while feature integration proceeds; the release agent will merge this maintenance history afterward.`],
      integration: [`Integrate ${topics[0]} and ${topics[1]} for release ${task.cycle}`, `Wait for ${branch.a} and ${branch.b}, then merge them into ${branch.integration}. Preserve both source histories and publish each planned integration revision using its exact confirmed Commit head.`],
      release: [`Publish release ${task.cycle} with ${topics[2]} maintenance`, `Wait for the completed feature integration and ${branch.maintenance}. Merge current main with that maintenance branch into ${branch.release}; publish its planned revisions without overwriting newer main Layers.`]
    };
    const [title, description] = descriptions[task.lane];
    task.title = title;
    task.prompt = `${description} Project: ${projectRef2}.${paths.length ? ` Files: ${paths.join(", ")}.` : ""} Execute the compiled CLI tasks and report confirmed branch/Commit/publication receipts. ${mixed && ["a", "b"].includes(task.lane) ? "For selected workspace revisions, mount, execute and commit twice, then unmount cleanly; reuse this agent session for later assignments." : "Reuse this conversation context for related follow-up assignments."} Do not claim the application was built or tested.`;
  }
  const owners = new Map(steps.filter((step) => step.taskId).map((step) => [step.key, step.taskId]));
  const byKey = new Map(steps.map((step) => [step.key, step]));
  for (const task of tasks) task.dependsOn = [...new Set(task.stepKeys.flatMap((key) => byKey.get(key).dependsOn.map((dep) => owners.get(dep)).filter((dep) => dep && dep !== task.id)))];
  const turns = [];
  for (const conversation of conversations) {
    for (const agentId of [null, ...conversation.subagents.map((child) => child.id)]) {
      const ownTasks = tasks.filter((task) => task.conversationId === conversation.id && task.agentId === agentId);
      const folder = `agents/${conversation.id}-${agentId ?? "main"}`;
      const visibleTasks = agentId ? ownTasks : tasks.filter((task) => task.conversationId === conversation.id);
      const cycleGroups = [...new Set(visibleTasks.map((task) => task.cycle))];
      const agentTurns = cycleGroups.map((cycle, index) => {
        const cycleTasks = visibleTasks.filter((task) => task.cycle === cycle);
        const topics = DENSE_TIERS[project].topics;
        const branches = cycle ? denseCycleBranches(project, cycle) : null;
        const request3 = cycle === 0 ? `Set up the initial ${history.definition.title} releases, incorporate the reference features and maintenance, and keep unfinished exploration work available for later. Work in ${projectRef2}; report the actual committed and published results when this foundation is ready.` : agentId ? `For release ${cycle}, complete your assigned ${[...new Set(cycleTasks.map((task) => ({ a: topics[0], b: topics[1], maintenance: topics[2] })[task.lane]))].join(" and ")} changes. Work through all revisions and follow-up assignments for this request, then return the confirmed saved file versions and a concise summary.` : `Prepare release ${cycle} of ${history.definition.title}. Delegate the ${topics[0]} and ${topics[1]} feature updates and ${topics[2]} maintenance, collect their confirmed results, integrate the feature branches, and publish the release with maintenance preserved. Work in ${projectRef2} and summarize the real publications when this release is complete.`;
        const ordered = [], waiting = cycleTasks.filter((task) => task.agentId && !agentId), placed = /* @__PURE__ */ new Set();
        const ready = (task) => task.dependsOn.every((dep) => placed.has(dep) || !cycleTasks.some((item) => item.id === dep));
        const release2 = () => {
          for (let task = waiting.find(ready); task; task = waiting.find(ready)) {
            ordered.push(task);
            placed.add(task.id);
            waiting.splice(waiting.indexOf(task), 1);
          }
        };
        release2();
        for (const task of cycleTasks) {
          if (task.agentId && !agentId) continue;
          ordered.push(task);
          placed.add(task.id);
          release2();
        }
        ordered.push(...waiting);
        const actions = ordered.flatMap((task) => task.agentId && !agentId ? [{ type: "delegate", taskId: task.id, agentId: task.agentId, reuse: true, dependsOn: task.dependsOn }] : [{ type: "assignment", taskId: task.id, text: task.prompt }, { type: "wait", tasks: task.dependsOn }, ...task.stepKeys.map((stepKey2) => ({ type: "tool", tool: "bash", taskId: task.id, stepKey: stepKey2, argv: byKey.get(stepKey2).argv })), { type: "report", taskId: task.id, from: "confirmed-receipts" }]);
        const turn = { conversationId: conversation.id, agentId, id: `turn-${String(index + 1).padStart(2, "0")}`, request: request3, taskIds: cycleTasks.map((task) => task.id), actions };
        turns.push(turn);
        return turn;
      });
      if (agentTurns.length > 10) throw new Error(`Simulation exceeds ten turns for ${conversation.id}/${agentId ?? "main"}`);
      const agentKey = `${conversation.id}-${agentId ?? "main"}`;
      const script = { agentKey, scriptId: `${runId}-${agentKey}`, name: agentId ? `${history.definition.title}: ${agentId}` : conversation.title, conversationId: conversation.id, agentId, maxTurns: 10, turns: agentTurns };
      put(`${folder}/script.json`, script);
    }
  }
  const expectations = { project: projectRef2, recipe: options, branches: ["main", ...history.branches], files: history.expectedMain, history: history.history, workspaceRevisions: history.workspaceRevisions, workspaceSessions: history.workspaceSessions ?? 0, applicationTestsExecuted: false };
  const resources = { runId, store: { name: store, kind: "sqlite", machine, owned: true, status: "planned" }, project: projectRef2, sandboxes: [], workspaces: [], branches: [] };
  const sessions = { conversations: {}, subagents: {} };
  const plan = { version: SIMULATION_VERSION, steps, tasks, conversations, turns, limits: { maxTurnsPerAgent: 10, conversations: 8, subagentsPerConversation: 8, concurrency: 12, perConversation: 3, sandboxes: 3, workspacesPerSandbox: 16 }, counts: { setupCommands: setup.length, historyCommands: raw.length, commands: steps.length, tasks: tasks.length, conversations: conversations.length, subagents: conversations.reduce((sum, item) => sum + item.subagents.length, 0) } };
  plan.agents = Object.entries(files).filter(([path2]) => path2.endsWith("/script.json")).map(([path2, content]) => ({ ...JSON.parse(content), path: path2, hash: hash(content) }));
  plan.expectations = expectations;
  plan.source = "source";
  plan.continuationTargets = Object.fromEntries(conversations.map((conversation) => {
    const published = steps.filter((step) => step.conversationId === conversation.id && !step.agentId && step.argv[0] === "branch" && step.argv[1] === "publish");
    const last = published.at(-1);
    return [conversation.id, { receipt: last?.key, project: projectRef2, branch: "main", type: "Layer", fallbacks: [...published].reverse().map((step) => ({ receipt: step.key, project: projectRef2, branch: "main", type: "Layer" })).concat([{ receipt: "setup.project", project: projectRef2, branch: "main", type: "Layer", initial: true }]) }];
  }));
  plan.stopContinuationTargets = Object.fromEntries(Object.entries(plan.continuationTargets).map(([id, target]) => [id, target.fallbacks]));
  put("plan.json", plan);
  const manifest = { version: SIMULATION_VERSION, runId, createdAt, project, template: project, projectName, projectRef: projectRef2, store, machine, mixed, cycles: history.cycles, recipeVersion: 3, maxTurnsPerAgent: 10, status: "prepared", hashes: Object.fromEntries(Object.entries(files).filter(([path2]) => !["journal.jsonl"].includes(path2)).map(([path2, content]) => [path2, hash(content)])) };
  put("manifest.json", manifest);
  return { manifest, plan, resources, sessions, expectations, files };
}
var SIMULATION_CLI = '"$DSH_LAYERFS_CLI"';
var shellWord = (value) => {
  const word2 = String(value);
  return /^[A-Za-z0-9_@%+=:,./-]+$/.test(word2) ? word2 : quote2(word2);
};
var delimiter = (input) => {
  const lines2 = new Set(input.split("\n"));
  let name6 = "EOF";
  for (let index = 2; lines2.has(name6); index++) name6 = `EOF${index}`;
  return name6;
};
function renderSimulationCommand(step, argv = step.argv, cli = SIMULATION_CLI) {
  if (argv.some((word2) => /^<(?:source|ws:|commit:)/.test(String(word2)))) throw new Error(`Resolve confirmed references before rendering ${step.key}`);
  const command2 = `${cli === SIMULATION_CLI ? cli : shellWord(cli)} ${argv.map(shellWord).join(" ")}`;
  if (step.input === void 0) return command2;
  const input = String(step.input);
  if (input.endsWith("\n") && !input.includes("\r")) {
    const end = delimiter(input);
    return `${command2} <<'${end}'
${input}${end}`;
  }
  return `printf '%s' ${quote2(input)} | ${command2}`;
}
function resolveSimulationStep(step, receipts, runDirectory) {
  return resolveHistoryStep(step, receipts).map((word2) => {
    if (word2 === "<source>") {
      if (!runDirectory) throw new Error("Missing simulation run directory for project initialization.");
      return join27(runDirectory, "source");
    }
    const match = typeof word2 === "string" && word2.match(/^<ws:(.+)>$/);
    if (!match) return word2;
    const ws = receipts[match[1]]?.workspace;
    if (typeof ws !== "string" || !ws) throw new Error(`Missing confirmed workspace receipt for ${step.key}`);
    return ws;
  });
}

// src/host/simulations/package.ts
import { createHash as createHash17 } from "node:crypto";
import { mkdir as mkdir4, open as open2, readFile as readFile3, rename as rename3, rm as rm2, lstat as lstat2, realpath } from "node:fs/promises";
import { dirname as dirname11, join as join28, resolve as resolve9, sep as sep2 } from "node:path";
var digest3 = (value) => createHash17("sha256").update(value).digest("hex");
var json3 = (value) => JSON.stringify(value, null, 2) + "\n";
async function durableWrite(path2, content) {
  const file = await open2(path2, "wx", 384);
  try {
    await file.writeFile(content);
    await file.sync();
  } finally {
    await file.close();
  }
}
async function syncDirectory(path2) {
  const file = await open2(path2, "r");
  try {
    await file.sync();
  } finally {
    await file.close();
  }
}
async function writeSimulationPackage(root, compiled) {
  if (!/^[a-z0-9][a-z0-9_.-]{0,62}$/.test(compiled.manifest.runId)) throw new Error("Invalid simulation run ID");
  const directory = resolve9(root, "simulations", compiled.manifest.runId);
  await mkdir4(dirname11(directory), { recursive: true });
  await mkdir4(directory, { mode: 448 });
  for (const [relative3, content] of Object.entries(compiled.files)) {
    const path2 = resolve9(directory, relative3);
    if (!path2.startsWith(directory + sep2)) throw new Error("Invalid package path");
    await mkdir4(dirname11(path2), { recursive: true });
    await durableWrite(path2, String(content));
  }
  await durableWrite(join28(directory, "journal.jsonl"), "");
  await syncDirectory(directory);
  return directory;
}
async function validateSimulationPackage(input) {
  const directory = await realpath(input);
  const manifest = JSON.parse(await readFile3(join28(directory, "manifest.json"), "utf8"));
  if (manifest.version !== SIMULATION_VERSION || !manifest.hashes || typeof manifest.hashes !== "object") throw new Error("Invalid simulation manifest");
  for (const [relative3, hash2] of Object.entries(manifest.hashes)) {
    const path2 = resolve9(directory, relative3);
    if (!path2.startsWith(directory + sep2) || typeof hash2 !== "string" || (await lstat2(path2)).isSymbolicLink() || !(await realpath(path2)).startsWith(directory + sep2)) throw new Error("Invalid package file reference");
    if (digest3(await readFile3(path2)) !== hash2) throw new Error(`Simulation package hash changed: ${relative3}`);
  }
  if (!manifest.hashes["plan.json"]) throw new Error("Missing simulation plan hash");
  const plan = JSON.parse(await readFile3(join28(directory, "plan.json"), "utf8"));
  for (const agent of plan.agents ?? []) if (manifest.hashes[agent.path] !== agent.hash) throw new Error("Invalid script identity");
  return manifest;
}
async function claimSimulationExecution(directory, owner = "host") {
  await validateSimulationPackage(directory);
  const lock = join28(directory, ".claim");
  try {
    await mkdir4(lock);
  } catch {
    throw new Error("Simulation execution ownership is already claimed or uncertain");
  }
  try {
    const path2 = join28(directory, "manifest.json");
    const manifest = JSON.parse(await readFile3(path2, "utf8"));
    if (manifest.owner) throw new Error(`Simulation package already owned by ${manifest.owner.name}; execution cannot be replayed`);
    manifest.owner = { name: owner, pid: process.pid, claimedAt: (/* @__PURE__ */ new Date()).toISOString() };
    const pending2 = join28(directory, ".manifest-claim.json");
    await durableWrite(pending2, json3(manifest));
    await rename3(pending2, path2);
    await syncDirectory(directory);
  } finally {
    await rm2(lock, { recursive: true });
  }
}
var SimulationJournal = class _SimulationJournal {
  records = [];
  pending = Promise.resolve();
  poisoned = false;
  receiptCursor = 0;
  receiptCache = {};
  directory;
  constructor(directory) {
    this.directory = directory;
  }
  static async open(directory) {
    const journal = new _SimulationJournal(directory);
    const path2 = join28(directory, "journal.jsonl");
    const raw = await readFile3(path2, "utf8");
    const lines2 = raw.split("\n");
    const complete = raw.endsWith("\n") ? lines2.slice(0, -1) : lines2.slice(0, -1);
    for (const line of complete) {
      if (!line.trim()) throw new Error("Corrupt simulation journal record");
      let event;
      try {
        event = JSON.parse(line);
      } catch {
        throw new Error("Corrupt simulation journal before final record");
      }
      if (!event || typeof event.type !== "string" || event.seq !== journal.records.length + 1) throw new Error("Invalid simulation journal sequence");
      journal.records.push(event);
    }
    if (!raw.endsWith("\n")) {
      const file = await open2(path2, "r+");
      try {
        await file.truncate(Buffer.byteLength(complete.join("\n") + (complete.length ? "\n" : "")));
        await file.sync();
      } finally {
        await file.close();
      }
    }
    return journal;
  }
  append(event) {
    const task = this.pending.then(async () => {
      if (this.poisoned) throw new Error("Simulation journal durability is uncertain");
      const record = { ...event, seq: this.records.length + 1, at: (/* @__PURE__ */ new Date()).toISOString() };
      const file = await open2(join28(this.directory, "journal.jsonl"), "a", 384);
      try {
        await file.writeFile(JSON.stringify(record) + "\n");
        await file.sync();
      } catch (error2) {
        this.poisoned = true;
        throw error2;
      } finally {
        await file.close();
      }
      this.records.push(record);
      return record;
    });
    this.pending = task.catch(() => {
    });
    return task;
  }
  get receipts() {
    for (; this.receiptCursor < this.records.length; this.receiptCursor++) {
      const record = this.records[this.receiptCursor];
      if (record.type === "result" && record.ok === true) this.receiptCache[record.stepKey] = record.receipt;
    }
    return this.receiptCache;
  }
  async bind(agentKey, sessionId) {
    const existing = this.records.find((record) => record.type === "binding" && record.agentKey === agentKey);
    if (existing) {
      if (existing.sessionId !== sessionId) throw new Error("Agent is already bound to another session");
      return;
    }
    await this.append({ type: "binding", agentKey, sessionId });
  }
};

// src/host/simulations/verify.ts
function simulationArchiveBranches(journal) {
  return new Set(journal.records.filter((record) => record.type === "binding" && typeof record.sessionId === "string").map((record) => storeBranchOf(record.sessionId)));
}
function simulationVerificationQuery(manifest, journal, query) {
  const recipeProject = `${manifest.store}/${manifest.project}`;
  const excluded = simulationArchiveBranches(journal);
  let inventory;
  async function branches() {
    const items = [];
    const cursors = /* @__PURE__ */ new Set();
    let cursor = null, first = true;
    while (first || cursor !== null) {
      first = false;
      const result = await query(["branch", "list", manifest.projectRef, "--limit", "100", ...cursor ? ["--cursor", cursor] : []]);
      if (!Array.isArray(result?.items)) throw new Error("Invalid simulation branch inventory");
      items.push(...result.items);
      const next = result.next_cursor ?? null;
      if (next !== null && (cursors.has(next) || !result.items.length)) throw new Error("Simulation branch pagination did not advance");
      if (next !== null) cursors.add(next);
      cursor = next;
    }
    const identity2 = uuidOfBranches(items.map((branch) => branch.branch));
    return items.filter((branch) => !excluded.has(branch.branch) && !(identity2 && branch.branch === identityBranch(identity2)));
  }
  return async (argv) => {
    const resolved = argv.map((word2) => word2 === recipeProject ? manifest.projectRef : word2);
    if (resolved[0] !== "branch" || resolved[1] !== "list") return query(resolved);
    inventory ??= branches();
    const all = await inventory;
    const option = (name6, fallback) => {
      const index = resolved.indexOf(name6);
      const value = index === -1 ? fallback : Number(resolved[index + 1]);
      if (!Number.isInteger(value) || value < 0) throw new Error("Invalid verification pagination");
      return value;
    };
    const at = resolved.indexOf("--cursor"), start = at === -1 ? 0 : Number(resolved[at + 1]);
    if (!Number.isInteger(start) || start < 0) throw new Error("Invalid verification pagination");
    const size = option("--limit", 100);
    if (!size) throw new Error("Invalid verification page size");
    const next = start + size < all.length ? start + size : null;
    return { items: all.slice(start, start + size), ...next !== null ? { next_cursor: String(next) } : {} };
  };
}
async function verifySimulation(manifest, plan, journal, query) {
  for (const step of plan.steps) if (!Object.hasOwn(journal.receipts, step.key)) throw new Error(`Cannot verify incomplete simulation step: ${step.key}`);
  await journal.append({ type: "verification.started", project: manifest.projectRef, origin: "host" });
  try {
    const verdict = await verifyProject(simulationVerificationQuery(manifest, journal, query), manifest.store, manifest.project, journal.receipts, { cycles: manifest.cycles, executionMode: manifest.mixed ? "mixed" : "filesystem" });
    const result = { ...verdict, project: manifest.projectRef, excludedArchiveBranches: [...simulationArchiveBranches(journal)] };
    await journal.append({ type: "verification.completed", origin: "host", result });
    return result;
  } catch (error2) {
    await journal.append({ type: "verification.failed", origin: "host", error: String(error2?.message ?? error2) });
    throw error2;
  }
}

// src/host/simulations/gate.ts
var WorkspaceLifecycleGate = class {
  constructor() {
    this.lanes = /* @__PURE__ */ new Map();
  }
  acquire(key, exclusive, signal) {
    signal?.throwIfAborted();
    let lane = this.lanes.get(key);
    if (!lane) this.lanes.set(key, lane = { readers: 0, writer: false, queue: [] });
    return new Promise((resolve11, reject) => {
      const entry = { exclusive, signal, resolve: resolve11, reject };
      entry.abort = () => {
        lane.queue = lane.queue.filter((waiter) => waiter !== entry);
        signal.removeEventListener("abort", entry.abort);
        reject(signal.reason ?? new Error("Workspace admission stopped."));
        this.drain(key, lane);
      };
      signal?.addEventListener("abort", entry.abort, { once: true });
      lane.queue.push(entry);
      this.drain(key, lane);
    });
  }
  drain(key, lane) {
    while (!lane.writer && lane.queue.length) {
      const entry = lane.queue[0];
      if (entry.exclusive && lane.readers) break;
      lane.queue.shift();
      entry.signal?.removeEventListener("abort", entry.abort);
      if (entry.exclusive) lane.writer = true;
      else lane.readers++;
      let released = false;
      entry.resolve(() => {
        if (released) return;
        released = true;
        if (entry.exclusive) lane.writer = false;
        else lane.readers--;
        this.drain(key, lane);
      });
      if (entry.exclusive) break;
    }
    if (!lane.writer && !lane.readers && !lane.queue.length && this.lanes.get(key) === lane) this.lanes.delete(key);
  }
  async run(key, exclusive, signal, execute2) {
    const release2 = await this.acquire(key, exclusive, signal);
    try {
      signal?.throwIfAborted();
      return await execute2();
    } finally {
      release2();
    }
  }
};
var SimulationCommandBudget = class {
  constructor(limit = 12) {
    if (!Number.isInteger(limit) || limit < 1) throw new Error("Invalid shared simulation command budget");
    this.limit = limit;
    this.active = 0;
    this.queue = [];
  }
  acquire(signal) {
    signal?.throwIfAborted();
    return new Promise((resolve11, reject) => {
      const entry = { resolve: resolve11, reject, signal };
      entry.abort = () => {
        this.queue = this.queue.filter((item) => item !== entry);
        reject(signal.reason ?? new Error("Simulation stopped"));
      };
      signal?.addEventListener("abort", entry.abort, { once: true });
      this.queue.push(entry);
      this.drain();
    });
  }
  drain() {
    while (this.active < this.limit && this.queue.length) {
      const entry = this.queue.shift();
      entry.signal?.removeEventListener("abort", entry.abort);
      this.active++;
      let released = false;
      entry.resolve(() => {
        if (!released) {
          released = true;
          this.active--;
          this.drain();
        }
      });
    }
  }
  async run(execute2, signal) {
    const release2 = await this.acquire(signal);
    try {
      signal?.throwIfAborted();
      return await execute2();
    } finally {
      release2();
    }
  }
};
var hostCommandBudget = new SimulationCommandBudget();
var SimulationExecution = class {
  constructor(plan, journal, { directory = journal.directory, concurrency = 12, globalBudget = hostCommandBudget } = {}) {
    if (!Number.isInteger(concurrency) || concurrency < 1) throw new Error("Invalid simulation concurrency");
    this.plan = plan;
    this.journal = journal;
    this.directory = directory;
    this.steps = new Map(plan.steps.map((step) => [step.key, step]));
    if (this.steps.size !== plan.steps.length) throw new Error("Duplicate simulation step");
    const done = /* @__PURE__ */ new Set(), active = /* @__PURE__ */ new Set();
    const visit = (key) => {
      if (active.has(key)) throw new Error("Cyclic simulation dependencies");
      if (done.has(key)) return;
      const step = this.steps.get(key);
      if (!step) throw new Error(`Missing simulation dependency: ${key}`);
      active.add(key);
      for (const dep of step.dependsOn ?? []) visit(dep);
      active.delete(key);
      done.add(key);
    };
    for (const key of this.steps.keys()) visit(key);
    this.globalBudget = globalBudget;
    this.limit = concurrency;
    this.running = /* @__PURE__ */ new Map();
    this.controllers = /* @__PURE__ */ new Map();
    this.waiters = /* @__PURE__ */ new Set();
    this.lifecycle = new WorkspaceLifecycleGate();
    this.capacity = new WorkspaceLifecycleGate();
    this.agents = new WorkspaceLifecycleGate();
    this.used = new Set(journal.records.filter((record) => record.type === "intent").map((record) => record.stepKey));
    this.stopped = /* @__PURE__ */ new Set();
    this.failed = new Set(journal.records.filter((record) => record.type === "intent" && !Object.hasOwn(journal.receipts, record.stepKey)).map((record) => record.stepKey));
  }
  controller(agentKey) {
    if (!this.controllers.has(agentKey)) this.controllers.set(agentKey, new AbortController());
    return this.controllers.get(agentKey);
  }
  notify() {
    for (const callback of [...this.waiters]) callback();
  }
  async waitSteps(keys, signal) {
    signal?.throwIfAborted();
    const check = () => {
      for (const key of keys) {
        if (!this.steps.has(key)) throw new Error(`Unknown simulation dependency: ${key}`);
        if (this.failed.has(key)) throw new Error(`Dependency ${key} did not complete; execution cannot continue`);
      }
      return keys.every((key) => Object.hasOwn(this.journal.receipts, key));
    };
    if (check()) return;
    await new Promise((resolve11, reject) => {
      const clean = () => {
        this.waiters.delete(tick);
        signal?.removeEventListener("abort", abort);
      };
      const tick = () => {
        try {
          if (check()) {
            clean();
            resolve11();
          }
        } catch (error2) {
          clean();
          reject(error2);
        }
      };
      const abort = () => {
        clean();
        reject(signal.reason ?? new Error("Simulation stopped"));
      };
      this.waiters.add(tick);
      signal?.addEventListener("abort", abort, { once: true });
      tick();
    });
  }
  waitTasks(taskIds, signal) {
    return this.waitSteps(taskIds.flatMap((id) => {
      const task = this.plan.tasks.find((task2) => task2.id === id);
      if (!task) throw new Error(`Unknown simulation task: ${id}`);
      return task.stepKeys;
    }), signal);
  }
  validateCommand(stepKey2, argv, input) {
    const step = this.steps.get(stepKey2);
    if (!step) throw new Error(`Unknown simulation step: ${stepKey2}`);
    const expected = resolveSimulationStep(step, this.journal.receipts, this.directory);
    if (JSON.stringify(expected) !== JSON.stringify(argv) || input !== step.input) throw new Error(`Command does not match authorized step: ${stepKey2}`);
    return step;
  }
  async execute(stepKey2, context2, executor, externalSignal) {
    const step = this.steps.get(stepKey2);
    if (!step) throw new Error(`Unknown simulation step: ${stepKey2}`);
    const expectedAgent = step.conversationId ? `${step.conversationId}-${step.agentId ?? "main"}` : "host";
    if (context2.agentKey && context2.agentKey !== expectedAgent) throw new Error("Step belongs to another agent");
    if (step.phase === "conversation") {
      const binding = this.journal.records.find((record) => record.type === "binding" && record.agentKey === expectedAgent);
      if (!binding || binding.sessionId !== context2.sessionId || !context2.turnId || !context2.toolCallId) throw new Error("Missing native tool invocation identity");
    }
    const ownSignal = this.controller(expectedAgent).signal;
    const signal = externalSignal ? AbortSignal.any([externalSignal, ownSignal]) : ownSignal;
    signal.throwIfAborted();
    if (this.used.has(stepKey2) || this.running.has(stepKey2)) throw new Error(`Step ${stepKey2} was already attempted; replay is forbidden`);
    const work = (async () => {
      await this.waitSteps(step.dependsOn ?? [], signal);
      const argv = resolveSimulationStep(step, this.journal.receipts, this.directory);
      const admitted = async () => {
        signal.throwIfAborted();
        if (this.used.has(stepKey2)) throw new Error("Simulation step was already attempted");
        this.used.add(stepKey2);
        await this.journal.append({ type: "intent", stepKey: stepKey2, agentKey: expectedAgent, argv, input: step.input, ...context2 });
        try {
          signal.throwIfAborted();
          const receipt = await executor(argv, step, signal);
          if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) throw new Error("Missing structured operation receipt");
          if (step.key === "setup.machine" && (!(receipt.supports ?? []).includes("sqlite") || receipt.state !== "ready" || receipt.op)) {
            throw Object.assign(new Error(`Machine ${step.argv[2]} is not ready for a SQLite simulation. Start a supported machine and launch a new simulation.`), { code: "Unavailable" });
          }
          assertProjectStep(step, receipt);
          await this.journal.append({ type: "result", stepKey: stepKey2, agentKey: expectedAgent, ok: true, receipt });
          this.notify();
          return receipt;
        } catch (error2) {
          this.failed.add(stepKey2);
          await this.journal.append({ type: "result", stepKey: stepKey2, agentKey: expectedAgent, ok: false, error: String(error2.message ?? error2), uncertain: true });
          this.notify();
          throw error2;
        }
      };
      const capacity = () => this.capacity.run("commands", false, signal, async () => {
        while ([...this.running.values()].filter((value) => value.admitted).length >= this.limit || step.conversationId && [...this.running.values()].filter((value) => value.admitted && value.conversationId === step.conversationId).length >= (this.plan.limits?.perConversation ?? 3)) await new Promise((resolve11, reject) => {
          const callback = () => {
            this.waiters.delete(callback);
            signal.removeEventListener("abort", abort);
            resolve11();
          };
          const abort = () => {
            this.waiters.delete(callback);
            reject(signal.reason);
          };
          this.waiters.add(callback);
          signal.addEventListener("abort", abort, { once: true });
        });
        signal.throwIfAborted();
        const entry = this.running.get(stepKey2);
        if (entry) entry.admitted = true;
        try {
          return await this.globalBudget.run(admitted, signal);
        } finally {
          if (entry) entry.admitted = false;
          this.notify();
        }
      });
      return this.agents.run(expectedAgent, true, signal, () => argv[0] === "workspace" && argv[1] !== "cancel" ? this.lifecycle.run(argv[2].split(":")[0], ["mount", "unmount"].includes(argv[1]), signal, capacity) : capacity());
    })();
    this.running.set(stepKey2, { promise: work, agentKey: expectedAgent, conversationId: step.conversationId, admitted: false });
    try {
      return await work;
    } finally {
      this.running.delete(stepKey2);
      this.notify();
    }
  }
  stop(agentKey) {
    const agent = this.plan.agents?.find((agent2) => agent2.agentKey === agentKey);
    const keys = agent && !agent.agentId ? this.plan.agents.filter((item) => item.conversationId === agent.conversationId).map((item) => item.agentKey) : [agentKey];
    for (const key of keys) this.controller(key).abort(new Error("Simulation stopped"));
    for (const step of this.steps.values()) {
      const owner = step.conversationId ? `${step.conversationId}-${step.agentId ?? "main"}` : "host";
      if (keys.includes(owner) && !Object.hasOwn(this.journal.receipts, step.key)) {
        this.failed.add(step.key);
        this.stopped.add(step.key);
      }
    }
    this.notify();
    return this.pending(keys);
  }
  /** Whether a conversation can no longer finish only because steps of a stopped
   * conversation it depends on will never complete (and none of its own failed). */
  blockedByStop(conversationId) {
    if (!this.stopped.size) return false;
    const own = [...this.steps.values()].filter((step) => step.conversationId === conversationId);
    if (own.some((step) => this.failed.has(step.key) && !this.stopped.has(step.key))) return false;
    const seen = /* @__PURE__ */ new Set();
    const reaches = (key) => {
      if (this.stopped.has(key)) return true;
      if (seen.has(key)) return false;
      seen.add(key);
      return (this.steps.get(key)?.dependsOn ?? []).some(reaches);
    };
    return own.some((step) => !Object.hasOwn(this.journal.receipts, step.key) && !this.stopped.has(step.key) && (step.dependsOn ?? []).some(reaches));
  }
  async pending(agentKeys) {
    await Promise.allSettled([...this.running.values()].filter((entry) => !agentKeys || agentKeys.includes(entry.agentKey)).map((entry) => entry.promise));
  }
};

// src/host/simulations/narration.ts
var code = (value) => `\`${value}\``;
var path = (value) => String(value).replace(/^\/+/, "");
var short = (id) => String(id).slice(0, 12);
var unique = (values) => [...new Set(values)];
function list3(items, max = 3, noun = ["other", "others"]) {
  const values = unique(items.filter(Boolean));
  if (values.length <= 1) return values[0] ?? "";
  if (values.length > max) {
    const rest = values.length - max;
    return `${values.slice(0, max).join(", ")} and ${rest} ${typeof noun === "string" ? noun : noun[rest === 1 ? 0 : 1]}`;
  }
  return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
}
var BRANCHES = ["more branch", "more branches"];
var workspaceName = (handle2) => String(handle2).split(":").slice(1).join(":") || String(handle2);
var mergeOf = (argv) => ({ target: argv[argv.indexOf("--into") + 1], sources: [argv[3], argv[4]] });
var written = (command2) => String(command2).match(/>\s*'?([^'\s>]+)'?\s*$/)?.[1];
function describeCommand(argv) {
  const [family, verb] = argv;
  if (family === "branch" && verb === "fork") return `Fork ${argv[3]} from ${argv[4]}`;
  if (family === "branch" && verb === "publish") return `Publish ${argv[3]} to main`;
  if (family === "branch" && verb === "merge") {
    const { target, sources } = mergeOf(argv);
    return `Merge ${list3(sources, 4)} into ${target}`;
  }
  if (family === "file" && verb === "write") return `Write ${path(argv[4])} on ${argv[3]}`;
  if (family === "sandbox" && verb === "create") return `Create sandbox ${argv[3]}${argv[4] ? ` on ${argv[4]}` : ""}`;
  if (family === "workspace" && verb === "mount") {
    const name6 = argv[argv.indexOf("--name") + 1];
    return `Mount ${argv[3]} in ${argv[2]}${argv.includes("--name") && name6 ? ` as ${name6}` : ""}`;
  }
  if (family === "workspace" && verb === "exec") {
    const file = written(argv[3]);
    return file ? `Write ${file} in workspace ${workspaceName(argv[2])}` : `Run a command in workspace ${workspaceName(argv[2])}`;
  }
  if (family === "workspace" && verb === "commit") return `Commit workspace ${workspaceName(argv[2])}`;
  if (family === "workspace" && verb === "unmount") return `Unmount workspace ${workspaceName(argv[2])}`;
  return `Run layerfs ${[family, verb].filter(Boolean).join(" ")}`;
}
function branchOf2(step, steps) {
  const [family, verb] = step.argv;
  if (family === "workspace") {
    if (verb === "mount") return step.argv[3];
    const mount = String(step.argv[2]).match(/^<ws:(.+)>$/)?.[1];
    return mount ? steps.get(mount)?.argv[3] : void 0;
  }
  if (family === "branch" && verb === "merge") return mergeOf(step.argv).target;
  return step.argv[3];
}
function taskPhrase(task) {
  const title = String(task?.title ?? "");
  let match;
  if (match = title.match(/^Revise (.+) for release (\d+)$/)) return `the ${match[1]} revisions`;
  if (match = title.match(/^Maintain (.+) for release (\d+)$/)) return `the ${match[1]} maintenance`;
  if (match = title.match(/^Prepare release (\d+)/)) return `the release ${match[1]} branches`;
  if (match = title.match(/^Integrate .+ for release (\d+)$/)) return `the release ${match[1]} integration`;
  if (match = title.match(/^Publish release (\d+)/)) return `release ${match[1]}`;
  if (!task?.cycle) return "the project foundation";
  return title ? title[0].toLowerCase() + title.slice(1) : "the earlier work";
}
function owned(task, script) {
  if (task.conversationId !== script.conversationId) return `${taskPhrase(task)} in another conversation`;
  if (task.agentId && task.agentId !== script.agentId) return `${taskPhrase(task)} (${task.agentId})`;
  return taskPhrase(task);
}
function facts2(task, plan) {
  const steps = new Map((plan.steps ?? []).map((step) => [step.key, step]));
  const own = task.stepKeys.map((key) => steps.get(key)).filter(Boolean);
  const forks = /* @__PURE__ */ new Map(), writes = /* @__PURE__ */ new Map(), merges = [], publishes = [], mounted = /* @__PURE__ */ new Set();
  for (const step of own) {
    const [family, verb] = step.argv;
    const branch = branchOf2(step, steps);
    if (family === "branch" && verb === "fork") forks.set(step.argv[4], [...forks.get(step.argv[4]) ?? [], step.argv[3]]);
    else if (family === "branch" && verb === "publish") publishes.push(step.argv[3]);
    else if (family === "branch" && verb === "merge") merges.push({ ...mergeOf(step.argv), key: step.key });
    else if (family === "file" && verb === "write") writes.set(branch, [...writes.get(branch) ?? [], path(step.argv[4])]);
    else if (family === "workspace" && verb === "mount") mounted.add(branch);
    else if (family === "workspace" && verb === "exec" && written(step.argv[3])) writes.set(branch, [...writes.get(branch) ?? [], path(written(step.argv[3]))]);
  }
  return { own, steps, forks, writes, merges, publishes: unique(publishes), mounted };
}
function narrateTask(task, plan) {
  const { forks, writes, merges, publishes, mounted } = facts2(task, plan);
  const sentences = [];
  for (const [from, branches2] of forks) sentences.push(`Forking ${list3(branches2.map(code), 4, BRANCHES)} from ${code(from)}.`);
  const branches = [...writes.keys()].filter(Boolean);
  if (branches.length === 1) {
    const files = unique(writes.get(branches[0]));
    sentences.push(`I'll revise ${list3(files.map(code), 3, ["other file", "other files"])} on ${code(branches[0])}.`);
  } else if (branches.length > 1) sentences.push(`I'll write the files for ${list3(branches.map(code), 3, BRANCHES)}.`);
  if (mounted.size) sentences.push(`Some of those edits go through a mounted workspace and are committed from there.`);
  if (merges.length) {
    const targets = unique(merges.map((merge) => merge.target));
    const merged = targets.length === 1 ? `${list3(unique(merges.flatMap((merge) => merge.sources)).map(code))} into ${code(targets[0])}` : `into ${list3(targets.map(code), 3, BRANCHES)}`;
    sentences.push(`${sentences.length ? "Then I'll merge" : "Merging"} ${merged}${publishes.length ? `, and publish ${list3(publishes.map(code), 3, BRANCHES)} to main` : ""}.`);
  } else if (publishes.length) sentences.push(`${sentences.length ? "Then I'll publish" : "Publishing"} ${list3(publishes.map(code), 3, BRANCHES)} to main.`);
  return sentences.join(" ") || `Starting on ${taskPhrase(task)}.`;
}
function confirmed(tasks, plan, receipts) {
  const steps = new Map((plan.steps ?? []).map((step) => [step.key, step]));
  const forked = [], changed = /* @__PURE__ */ new Map(), merged = /* @__PURE__ */ new Map(), published = /* @__PURE__ */ new Map();
  for (const task of tasks) for (const key of task.stepKeys) {
    const step = steps.get(key), receipt = receipts[key];
    if (!step || !receipt) continue;
    const [family, verb] = step.argv;
    const branch = branchOf2(step, steps);
    const version2 = savedVersions(`${family}.${verb}`, receipt)[0];
    if (family === "branch" && verb === "fork") forked.push(step.argv[3]);
    else if (family === "branch" && verb === "publish") {
      if (version2) published.set(step.argv[3], version2);
    } else if (family === "branch" && verb === "merge") {
      const { target, sources } = mergeOf(step.argv);
      merged.set(`${target}|${sources.join("|")}`, { target, sources, version: version2 });
    } else if (family === "file" && verb === "write" || family === "workspace" && verb === "commit") {
      const entry = changed.get(branch) ?? { files: /* @__PURE__ */ new Set(), version: void 0 };
      if (family === "file") entry.files.add(path(step.argv[4]));
      if (version2) entry.version = version2;
      changed.set(branch, entry);
    } else if (family === "workspace" && verb === "exec" && written(step.argv[3])) {
      const entry = changed.get(branch) ?? { files: /* @__PURE__ */ new Set(), version: void 0 };
      entry.files.add(path(written(step.argv[3])));
      changed.set(branch, entry);
    }
  }
  const lines2 = [];
  if (forked.length) lines2.push(`Forked ${list3(forked.map(code), 4, BRANCHES)}.`);
  const branches = [...changed].filter(([branch]) => branch);
  if (branches.length > 4) {
    const files = new Set(branches.flatMap(([branch, entry]) => [...entry.files].map((file) => `${branch}:${file}`)));
    lines2.push(`Committed ${files.size ? `${files.size} files` : "changes"} across ${list3(branches.map(([branch]) => code(branch)), 3, BRANCHES)}.`);
  } else for (const [branch, entry] of branches) {
    const files = [...entry.files];
    const what = files.length ? `${files.length === 1 ? code(files[0]) : `${files.length} files`}` : "changes";
    lines2.push(`Committed ${what} on ${code(branch)}${entry.version ? ` (latest commit ${code(short(entry.version.id))})` : ""}.`);
  }
  const merges = [...merged.values()];
  if (merges.length > 3) lines2.push(`Merged into ${list3(unique(merges.map((merge) => merge.target)).map(code), 3, BRANCHES)}.`);
  else for (const merge of merges) lines2.push(`Merged ${list3(merge.sources.map(code))} into ${code(merge.target)}${merge.version ? ` (${code(short(merge.version.id))})` : ""}.`);
  const publications = [...published];
  if (publications.length > 3) {
    const [branch, version2] = publications.at(-1);
    lines2.push(`Published ${list3(publications.map(([name6]) => code(name6)), 3, BRANCHES)} to main; the last one, ${code(branch)}, is Layer ${code(short(version2.id))}.`);
  } else for (const [branch, version2] of publications) lines2.push(`Published ${code(branch)} to main${version2.effect === "unchanged" ? " (already up to date)" : ""} as Layer ${code(short(version2.id))}.`);
  return lines2;
}
function reportTask(task, plan, receipts) {
  return confirmed([task], plan, receipts).join(" ");
}
function summarizeTurn({ script, turn, plan, receipts, target }) {
  const tasks = (turn.taskIds ?? []).map((id) => plan.tasks?.find((task) => task.id === id)).filter(Boolean);
  const lines2 = confirmed(tasks, plan, receipts);
  const cycles = unique(tasks.map((task) => task.cycle));
  const published = lines2.some((line) => line.startsWith("Published"));
  let lead;
  if (script.agentId) lead = `Done with ${list3(tasks.map(taskPhrase))}${cycles[0] ? ` for release ${cycles[0]}` : ""}.`;
  else if (cycles.length === 1 && cycles[0]) lead = published ? `Release ${cycles[0]} is published.` : `Release ${cycles[0]} work is finished.`;
  else lead = "The project foundation is in place.";
  const parts = [lead];
  if (lines2.length) parts.push(lines2.map((line) => `- ${line}`).join("\n"));
  if (target) parts.push(`Latest saved version on main: ${target.kind} ${code(target.id)}.`);
  if (!script.agentId) parts.push("These are saved file changes only; no application build or tests were run.");
  return parts.join("\n\n");
}
function narrateDelegation(assignments) {
  const children2 = /* @__PURE__ */ new Map();
  for (const { phrase, agentId } of assignments) children2.set(agentId, [...children2.get(agentId) ?? [], phrase]);
  if (!children2.size) return "";
  return `Delegating ${list3([...children2].map(([agentId, phrases]) => `${list3(phrases)} to ${agentId}`), 4, ["more assignment", "more assignments"])}.`;
}
function narrateWait(tasks, script) {
  const groups = /* @__PURE__ */ new Map();
  for (const task of tasks) {
    const owner = task.conversationId !== script.conversationId ? " in another conversation" : task.agentId && task.agentId !== script.agentId ? ` (${task.agentId})` : "";
    groups.set(owner, [...groups.get(owner) ?? [], taskPhrase(task)]);
  }
  const phrases = [...groups].map(([owner, names]) => {
    const kinds = names.map((name6) => name6.match(/^the (.+) (revisions|maintenance)$/));
    const combined = names.length > 1 && kinds.every((kind) => kind && kind[2] === kinds[0][2]) ? `the ${list3(kinds.map((kind) => kind[1]))} ${kinds[0][2]}` : list3(names);
    return `${combined}${owner}`;
  });
  return `Waiting for ${list3(phrases, 3, ["other task", "other tasks"])} to finish first.`;
}
function narrateFailure({ argv, output: output2 }) {
  const what = argv ? `The last command (${describeCommand(argv)})` : "The last project command";
  const tail = String(output2 ?? "").trim().split("\n").slice(-8).join("\n").slice(-800);
  return [
    `${what} failed.${tail ? " Its output ended with:" : ""}`,
    tail ? `\`\`\`
${tail}
\`\`\`` : "",
    "I'm stopping here: work that depends on this step cannot continue until it is reconciled."
  ].filter(Boolean).join("\n\n");
}
function narrateBlocked(tasks, script) {
  return `I can't continue: ${list3(tasks.map((task) => owned(task, script)))} did not complete, and the next step depends on it.`;
}

// src/host/simulations/receipts.ts
function parseSimulationBashReceipt(result, { exec = false } = {}) {
  const value = result?.value;
  const exitCode = value?.exitCode;
  const commandsOwn = exec && Number.isInteger(exitCode) && exitCode !== 0;
  if (result?.isError || value?.kind !== "foreground" || exitCode !== 0 && !commandsOwn || value?.aborted || value?.timedOut || value?.stdout?.truncated || typeof value?.stdout?.text !== "string") {
    throw new Error("The LayerFS command did not return a complete successful result; inspect its tool result before continuing.");
  }
  const lines2 = value.stdout.text.trim().split("\n").filter((line) => line.trim());
  let receipt;
  let final = false;
  for (const line of lines2) {
    let frame;
    try {
      frame = JSON.parse(line);
    } catch {
      throw new Error("Malformed LayerFS JSON receipt");
    }
    if (!frame || typeof frame !== "object" || Array.isArray(frame)) throw new Error("Invalid LayerFS receipt frame");
    if (final) throw new Error("LayerFS emitted data after its final result");
    receipt = frame;
    final = true;
  }
  if (!final || !receipt || typeof receipt !== "object" || Array.isArray(receipt)) throw new Error("Missing complete LayerFS operation receipt");
  if (commandsOwn && (receipt.exit_code !== exitCode || typeof receipt.error === "string")) throw new Error("The LayerFS command did not return a complete successful result; inspect its tool result before continuing.");
  return receipt;
}

// src/host/simulations/runtime.ts
var textOf = (message) => (message.content ?? []).filter((block) => block.type === "text").map((block) => block.text).join("");
var request2 = (text6) => createUserMessage({ content: [{ type: "text", text: text6 }], source: { kind: "user" } });
var terminal2 = (state) => ["completed", "stopped", "interrupted", "uncertain", "failed"].includes(state);
var realRoute = (route2) => route2 && typeof route2.provider === "string" && typeof route2.model === "string" && route2.provider && route2.model && route2.provider !== "simulation" ? route2 : void 0;
var CONTINUE_FRESH = "The script will not run again; a real model continues this session from the project's current files.";
function foldNativeActions(events, actions = /* @__PURE__ */ new Map()) {
  for (const event of events) {
    if (event.type === "assistant/message") for (const block of event.data?.message?.content ?? []) {
      if (block.type === "tool-call") actions.set(String(block.id), { state: "issued" });
    }
    if (event.type === "tool/call") actions.set(String(event.data.callId), { state: "issued" });
    if (event.type === "tool/result") {
      const message = event.data?.message;
      const id = message?.toolCallId ?? message?.source?.callId;
      if (id !== void 0) actions.set(String(id), { state: message.isError ? "failed" : "completed" });
    }
  }
  return actions;
}
var HOLD_LIMIT_MS = 35e3;
var SimulationRuntime = class {
  runs = /* @__PURE__ */ new Map();
  bindings = /* @__PURE__ */ new Map();
  calls = /* @__PURE__ */ new Map();
  recoveredDeferred = /* @__PURE__ */ new Map();
  constructor(ctx) {
    this.ctx = ctx;
  }
  dispose() {
    for (const binding of this.bindings.values()) {
      if (terminal2(binding.state)) continue;
      binding.controller.abort(new Error("The simulation host was disposed"));
      binding.agent?.cancel({ kind: "disposed" }, { keepInbox: true });
      void binding.run.execution.stop(binding.script.agentKey).catch(() => {
      });
    }
  }
  /** Only routes a running script can still use: live non-terminal bindings,
   * plus child routes a running parent may still delegate to. */
  scripts() {
    const routes = /* @__PURE__ */ new Map();
    for (const run2 of this.runs.values()) {
      for (const binding of run2.bindings.values()) {
        if (!terminal2(binding.state) && !(binding.script.agentId && binding.ordinaryRestored)) routes.set(binding.script.scriptId, binding.script);
      }
      for (const script of run2.plan.agents) {
        if (!script.agentId || run2.bindings.has(script.agentKey)) continue;
        const root = run2.bindings.get(`${script.conversationId}-main`);
        if (root && !terminal2(root.state)) routes.set(script.scriptId, script);
      }
    }
    return [...routes.values()];
  }
  /** Drop finished runs and tell model pickers when the offered scripts change. */
  refreshModels() {
    for (const [runId, run2] of this.runs) {
      const roots = run2.plan.agents.filter((script) => !script.agentId).map((script) => run2.bindings.get(script.agentKey));
      if (roots.length && roots.every((binding) => binding && terminal2(binding.state))) this.forget(run2, runId);
    }
    const signature = this.scripts().map((script) => script.scriptId).sort().join("\n");
    if (signature === this.modelSignature) return;
    this.modelSignature = signature;
    this.ctx.emit?.("llm/models-updated", "simulation");
  }
  /** Release a finished run's in-memory state. A dormant child keeps its binding
   * while it still holds parked input for its continuation owner (created()). */
  forget(run2, runId = run2.manifest.runId) {
    this.runs.delete(runId);
    for (const [id, call] of this.calls) if (call.binding.run === run2) this.calls.delete(id);
    for (const binding of run2.bindings.values()) {
      if (binding.parkedHuman?.size || binding.parking?.size || binding.parkedNotices?.size) continue;
      if (this.bindings.get(binding.sessionId) === binding) this.bindings.delete(binding.sessionId);
    }
  }
  /** Whether a script currently owns this session (running, stopping or handing off). */
  isActive(sessionId) {
    const binding = this.bindings.get(String(sessionId));
    return !!binding && !terminal2(binding.state);
  }
  ordinaryRoute(remembered) {
    return realRoute(remembered) ?? realRoute(this.ctx.agentDefaultModel?.currentSelection?.());
  }
  /** Session-local only: switch a session off a finished script route. */
  restoreOrdinary(agent, remembered, force = false) {
    if (!agent?.model?.select) return false;
    if (!force && agent.model.current?.()?.provider !== "simulation") return true;
    const route2 = this.ordinaryRoute(remembered);
    if (!route2) return false;
    agent.model.select(route2);
    return true;
  }
  /** A launch needs a real model to hand off to; check before creating anything. */
  async usableRealModel(requested, signal) {
    const candidates = [realRoute(requested), realRoute(this.ctx.agentDefaultModel?.currentSelection?.())].filter(Boolean);
    for (const route2 of candidates) {
      if (!this.ctx.llm?.resolveModelInfo) return route2;
      try {
        await this.ctx.llm.resolveModelInfo(route2.provider, route2.model, signal);
        return route2;
      } catch (error2) {
        signal?.throwIfAborted();
        this.ctx.logger?.("layerfs").warn("simulation real model %s/%s unavailable: %s", route2.provider, route2.model, String(error2?.message ?? error2));
      }
    }
    throw new Error("Select a usable real model before starting /simulation; it continues the sessions after the script. Nothing was created.");
  }
  metadata(binding) {
    const { run: run2, script, ordinaryModel, rootSessionId } = binding;
    return { runId: run2.manifest.runId, agentKey: script.agentKey, scriptId: script.scriptId, name: script.name, hash: script.hash, ordinaryModel, ...script.agentId ? { rootSessionId } : {}, state: binding.state };
  }
  async recover() {
    const root = join29(this.ctx.layerfs.root, "simulations");
    for (const entry of await readdir2(root, { withFileTypes: true }).catch(() => [])) {
      if (!entry.isDirectory()) continue;
      const directory = join29(root, entry.name);
      try {
        const manifest = await validateSimulationPackage(directory);
        if (!manifest.owner) continue;
        const plan = JSON.parse(await readFile4(join29(directory, "plan.json"), "utf8"));
        const journal = await SimulationJournal.open(directory);
        for (const record of journal.records.filter((record2) => record2.type === "human-deferred")) {
          if (!journal.records.some((released) => released.type === "human-released" && released.messageId === record.messageId)) {
            const pending2 = this.recoveredDeferred.get(record.sessionId) ?? { journal, ids: /* @__PURE__ */ new Set() };
            pending2.ids.add(record.messageId);
            this.recoveredDeferred.set(record.sessionId, pending2);
          }
        }
        const bound = journal.records.filter((record) => record.type === "binding");
        for (const row of bound) {
          if (this.isActive(row.sessionId)) continue;
          const meta = this.ctx.layerfsSessions.simulationOf(row.sessionId);
          if (meta && !terminal2(meta.state)) await this.ctx.layerfsSessions.completeSimulation(row.sessionId, void 0, "interrupted", `The host restarted during script execution. ${CONTINUE_FRESH}`);
          const live = this.ctx.agents?.get?.(row.sessionId);
          if (live && meta) {
            this.restoreOrdinary(live, meta.ordinaryModel);
            await this.restoreDeferred(live);
          }
        }
      } catch (error2) {
        this.ctx.logger("layerfs").warn("simulation recovery %s: %s", entry.name, String(error2));
      }
    }
  }
  async launch(options, signal) {
    if ((options.cycles !== void 0 || options.dispatchDelayMs !== void 0) && process.env.DSH_LAYERFS_SIMULATION_FIXTURES !== "1") throw new Error("Bounded simulation fixtures are disabled.");
    if (options.dispatchDelayMs !== void 0 && (!Number.isInteger(options.dispatchDelayMs) || options.dispatchDelayMs < 0 || options.dispatchDelayMs > 1e4)) throw new Error("Invalid fixture dispatch delay");
    if (options.cwd !== void 0 && (!(await stat(options.cwd)).isDirectory() || !String(options.cwd).startsWith("/"))) throw new Error("Choose an existing absolute local scratch folder.");
    const compiled = compileSimulation({ project: options.project, machine: options.machine ?? "native", mixed: options.mixed ?? false, ...options.cycles === void 0 ? {} : { cycles: options.cycles } });
    const cli = this.ctx.layerfs.cli;
    if (!cli) throw new Error("Pin a LayerFS CLI before starting project work.");
    const ordinaryModel = await this.usableRealModel(options.ordinaryModel, signal);
    const directory = await writeSimulationPackage(this.ctx.layerfs.root, compiled);
    await claimSimulationExecution(directory, "host");
    const journal = await SimulationJournal.open(directory);
    const run2 = { ...compiled, directory, journal, execution: new SimulationExecution(compiled.plan, journal, { directory }), bindings: /* @__PURE__ */ new Map(), dispatchDelayMs: options.dispatchDelayMs ?? 0 };
    this.runs.set(compiled.manifest.runId, run2);
    try {
      await this.ctx.layerfs.ensureNative();
      for (const step of run2.plan.steps.filter((step2) => step2.phase === "setup")) {
        await run2.execution.execute(step.key, { origin: "host", runId: run2.manifest.runId }, (argv, definition, executionSignal) => execute({ cli, home: this.ctx.layerfs.home, bundle: this.ctx.layerfs.bundle, cacheHome: this.ctx.layerfs.cacheHome, callLog: this.ctx.layerfs.callLog, gate: this.ctx.layerfs.lfs.spec.gate }, argv, { input: definition.input, tag: `dsh-sim:${run2.manifest.runId}:${step.key}`, beforeSpawn: () => executionSignal.throwIfAborted(), onSpawn: (child) => {
          const cancel = () => child.kill("SIGTERM");
          executionSignal.addEventListener("abort", cancel, { once: true });
          if (executionSignal.aborted) cancel();
          child.once("close", () => executionSignal.removeEventListener("abort", cancel));
        } }), signal);
      }
      const sessions = [];
      for (const script of run2.plan.agents.filter((agent) => !agent.agentId)) {
        signal?.throwIfAborted();
        const id = `session-${randomUUID14()}`;
        const cwd = resolve10(options.cwd ?? join29(this.ctx.layerfs.root, "simulation-scratch", run2.manifest.runId, script.agentKey));
        await mkdir5(cwd, { recursive: true });
        const binding = { run: run2, script, sessionId: id, rootSessionId: id, ordinaryModel, turn: 0, state: "running", controller: new AbortController(), complete: false };
        this.bindings.set(id, binding);
        run2.bindings.set(script.agentKey, binding);
        await this.ctx.layerfsSessions.prepareSimulation(id, run2.manifest.projectRef, this.metadata(binding));
        await run2.journal.bind(script.agentKey, id);
        await this.ctx.sessionController.create({ sessionId: id, cwd, agentPreset: "layerfs" });
        const agent = this.ctx.agents.get(id);
        binding.agent = agent;
        agent.model.select({ provider: "simulation", model: script.scriptId });
        this.authorize(agent, run2);
        sessions.push(id);
      }
      this.refreshModels();
      for (const id of sessions) {
        const binding = this.bindings.get(id);
        this.queueScript(binding, binding.script.turns[0].request);
      }
      return { runId: run2.manifest.runId, sessionId: sessions[0], sessions, navigate: { sessionId: sessions[0] } };
    } catch (error2) {
      await journal.append({ type: "setup-failed", error: String(error2) });
      for (const binding of run2.bindings.values()) {
        binding.state = "failed";
        binding.controller.abort(error2);
        if (binding.agent) this.restoreOrdinary(binding.agent, binding.ordinaryModel, true);
        await this.ctx.layerfsSessions.completeSimulation(binding.sessionId, void 0, "failed", `${String(error2?.message ?? error2)} ${CONTINUE_FRESH}`);
      }
      this.forget(run2);
      this.refreshModels();
      throw error2;
    }
  }
  authorize(agent, run2) {
    if (agent.session.snapshotEvents(0).some((event) => event.type === "subagent/model-selection-policy")) return;
    agent.session.append("subagent/model-selection-policy", { allowedModels: [...run2.plan.agents.map((script) => ({ provider: "simulation", model: script.scriptId })), ...[...run2.bindings.values()].map((binding) => binding.ordinaryModel).filter((route2) => route2 && route2.provider !== "simulation").map((route2) => ({ provider: route2.provider, model: route2.model }))].filter((route2, index, all) => all.findIndex((other) => other.provider === route2.provider && other.model === route2.model) === index) });
  }
  async created(agent) {
    const id = String(agent.id);
    let binding = this.bindings.get(id);
    if (!binding) {
      const saved = this.ctx.layerfsSessions?.simulationOf?.(id);
      if (saved) {
        this.restoreOrdinary(agent, saved.ordinaryModel);
        await this.restoreDeferred(agent);
        return;
      }
      await this.restoreDeferred(agent);
      const route2 = agent.model.current();
      if (route2?.provider !== "simulation") return;
      const run2 = [...this.runs.values()].find((run3) => run3.plan.agents.some((script2) => script2.scriptId === route2.model));
      const script = run2?.plan.agents.find((script2) => script2.scriptId === route2.model);
      if (!run2 || !script?.agentId) throw new Error("This script is not authorized to start a fresh session.");
      const root = run2.bindings.get(`${script.conversationId}-main`);
      if (!root || terminal2(root.state)) throw new Error("The parent script has stopped.");
      const header = agent.session.header;
      if (header?.origin !== "subagent" || String(header.parentSession) !== root.sessionId) throw new Error("This child script must be started by its own native parent session.");
      const assigned = run2.bindings.get(script.agentKey);
      if (assigned && assigned.sessionId !== id) throw new Error("This script already belongs to another native child session.");
      binding = { run: run2, script, sessionId: id, rootSessionId: root.sessionId, ordinaryModel: root.ordinaryModel, turn: 0, state: "running", controller: new AbortController(), complete: false, agent };
      this.bindings.set(id, binding);
      run2.bindings.set(script.agentKey, binding);
      await this.ctx.layerfsSessions.prepareSimulation(id, run2.manifest.projectRef, this.metadata(binding));
      await run2.journal.bind(script.agentKey, id);
      this.refreshModels();
    } else await this.restoreDeferred(agent);
    binding.agent = agent;
    this.authorize(agent, binding.run);
    if (terminal2(binding.state)) {
      if (this.restoreOrdinary(agent, binding.ordinaryModel)) binding.ordinaryRestored = true;
      if (binding.parkedHuman?.size || binding.parkedNotices?.size) await this.releaseHumans(binding, false);
    }
  }
  async preStep(payload, next) {
    const binding = this.bindings.get(String(payload.agent.id));
    if (!binding || terminal2(binding.state)) {
      if (payload.modelSelection?.provider === "simulation") {
        const saved = binding ?? this.ctx.layerfsSessions?.simulationOf?.(String(payload.agent.id));
        if (saved) this.restoreOrdinary(payload.agent, saved.ordinaryModel);
      }
      return next();
    }
    if (["stopping", "handoff"].includes(binding.state)) {
      for (const message of payload.messages) this.parkNotice(binding, message);
      await Promise.all(payload.messages.map((message) => this.parkHuman(binding, message)));
      await this.drainParking(binding);
      return { kind: "reject" };
    }
    if (payload.modelSelection.provider !== "simulation" || payload.modelSelection.model !== binding.script.scriptId) throw new Error("Stop the active project script before changing its model.");
    const aborted = () => {
      void this.stop(binding.sessionId).catch((error2) => this.ctx.logger("layerfs").warn("simulation stop: %s", String(error2)));
    };
    binding.turnSignals ??= /* @__PURE__ */ new WeakSet();
    if (!binding.turnSignals.has(payload.signal)) {
      binding.turnSignals.add(payload.signal);
      payload.signal.addEventListener("abort", aborted, { once: true });
    }
    const decision = await next();
    await this.drainParking(binding);
    if (decision.kind !== "enter") return decision;
    const held = /* @__PURE__ */ new Set();
    for (const message of decision.messages) if (this.isHuman(binding, message)) {
      held.add(String(message.id));
      await this.parkHuman(binding, message);
    }
    return { ...decision, messages: decision.messages.filter((message) => !held.has(String(message.id))) };
  }
  nativeActions(binding) {
    const session = binding.agent?.session;
    if (!session?.snapshotEvents) return /* @__PURE__ */ new Map();
    if (binding.nativeActionSession !== session) {
      binding.nativeActionSession = session;
      binding.nativeActionOffset = 0;
      binding.nativeActionStates = /* @__PURE__ */ new Map();
    }
    const events = session.snapshotEvents(binding.nativeActionOffset);
    foldNativeActions(events, binding.nativeActionStates);
    if (events.length) binding.nativeActionOffset = Number(events.at(-1).seq) + 1;
    return binding.nativeActionStates;
  }
  compactionContext(options) {
    const binding = this.bindings.get(String(options.sessionId));
    if (!binding) return "";
    const { run: run2, script } = binding;
    const request3 = script.turns[binding.turn]?.request ?? script.turns.at(-1)?.request;
    const records = run2.journal?.records ?? [];
    const versions = [];
    for (const record of records) {
      if (record.type !== "result" || record.ok !== true) continue;
      const step = run2.plan.steps.find((step2) => step2.key === record.stepKey);
      if (step?.conversationId !== script.conversationId) continue;
      for (const version2 of savedVersions(step.argv.slice(0, 2).join("."), record.receipt)) versions.push(`${version2.kind} ${version2.id}`);
    }
    const children2 = [...run2.bindings.values()].filter((item) => item.script.conversationId === script.conversationId && item.script.agentId).map((item) => `${item.script.name}: native session ${item.sessionId}`);
    return [
      `Project: ${run2.manifest.projectRef}`,
      request3 ? `Current recorded work objective: ${request3}` : "",
      versions.length ? `Latest confirmed saved-version references: ${[...new Set(versions)].slice(-6).join("; ")}` : "No saved version is asserted by this checkpoint.",
      children2.length ? `Native child sessions: ${children2.join("; ")}` : ""
    ].filter(Boolean).join("\n");
  }
  async next(options, stream) {
    const binding = this.bindings.get(String(options.sessionId));
    if (!binding || binding.script.scriptId !== options.model || terminal2(binding.state)) throw new Error("This script is no longer active. Select an ordinary model to continue.");
    if (binding.narratedFailure) throw new Error(binding.narratedFailure);
    const signal = options.signal ? AbortSignal.any([options.signal, binding.controller.signal]) : binding.controller.signal;
    signal.throwIfAborted();
    const { run: run2, script } = binding;
    if (!binding.initialDelayDone && run2.dispatchDelayMs) {
      binding.initialDelayDone = true;
      await new Promise((resolve11, reject) => {
        const timer = setTimeout(() => {
          signal.removeEventListener("abort", abort);
          resolve11();
        }, run2.dispatchDelayMs);
        const abort = () => {
          clearTimeout(timer);
          reject(signal.reason);
        };
        signal.addEventListener("abort", abort, { once: true });
      });
      signal.throwIfAborted();
    }
    const turn = script.turns[binding.turn];
    if (!turn) throw new Error("No script request is pending; ordinary follow-ups require a real model.");
    const nativeActions = this.nativeActions(binding);
    const results = new Map(options.messages.filter((message) => message.role === "tool").map((message) => [String(message.toolCallId ?? message.source?.callId), message]));
    const seenChildren = /* @__PURE__ */ new Set();
    let pending2 = [];
    const say = async (text6) => {
      if (text6) await stream?.say?.(text6);
    };
    const speak = async (...extra) => {
      const text6 = [...pending2, ...extra].filter(Boolean).join(" ");
      pending2 = [];
      await say(text6);
    };
    const plan = run2.plan ?? {};
    const taskOf = (id) => plan.tasks?.find((task) => task.id === id);
    const ready = (keys) => keys.every((key) => Object.hasOwn(run2.journal?.receipts ?? {}, key));
    const tasksReady = (ids) => ready(ids.flatMap((id) => taskOf(id)?.stepKeys ?? []));
    const waitTasks = async (ids, line) => {
      if (!tasksReady(ids)) await speak(line ?? narrateWait(ids.map(taskOf).filter((task) => task && !ready(task.stepKeys)), script));
      try {
        await run2.execution.waitTasks(ids, signal);
      } catch (error2) {
        if (signal.aborted || !/did not complete/.test(String(error2?.message ?? error2))) throw error2;
        const blocked = ids.map(taskOf).filter((task) => task && !ready(task.stepKeys));
        throw Object.assign(error2, { narration: narrateBlocked(blocked, script) });
      }
    };
    const narrateFailureAndSettle = (error2, narration) => {
      const agent = binding.agent;
      if (!agent || typeof agent.whenIdle !== "function") throw error2;
      binding.narratedFailure = String(error2?.message ?? error2);
      void Promise.resolve(agent.whenIdle()).then(() => this.fail(agent, error2), () => this.fail(agent, error2));
      return { text: narration };
    };
    const issuable = (index, id, action) => {
      const result = results.get(id);
      const native = nativeActions.get(id);
      if (result?.isError || native?.state === "failed") {
        const error2 = new Error("A project tool call failed. Inspect its native result before continuing.");
        const call = this.calls.get(id);
        const step = action.type === "tool" ? plan.steps?.find((step2) => step2.key === action.stepKey) : void 0;
        throw Object.assign(error2, { narration: action.type === "tool" ? narrateFailure({ argv: call?.argv ?? step?.argv, output: result ? textOf(result) : "" }) : void 0 });
      }
      if (native?.state === "completed" || result) return false;
      if (native?.state === "issued") throw new Error("A dispatched project action has no confirmed native result; the script cannot replay it and stops here.");
      if (action.type === "tool" && Object.hasOwn(run2.journal?.receipts ?? {}, action.stepKey)) return false;
      if (action.type === "tool" && run2.journal?.records?.some((record) => record.type === "intent" && record.stepKey === action.stepKey)) throw new Error("A project operation was already attempted without a confirmed receipt; the script cannot replay it and stops here.");
      return true;
    };
    const delegation = (action, id) => {
      const child = plan.agents.find((agent) => agent.conversationId === script.conversationId && agent.agentId === action.agentId);
      const childTurn = child.turns.find((item) => item.taskIds.some((taskId) => turn.taskIds.includes(taskId)));
      if (!childTurn) throw new Error("Missing child assignment script");
      const existing = run2.bindings.get(child.agentKey);
      const title = childTurn.taskIds.map(taskOf).find(Boolean)?.title ?? child.name;
      const args = existing ? { agent_id: existing.sessionId, message: childTurn.request } : { description: title, name: child.agentId, prompt: childTurn.request, provider: "simulation", model: child.scriptId };
      this.calls.set(id, { binding, action, turn });
      const tasks = childTurn.taskIds.map(taskOf).filter(Boolean);
      return { call: { id, name: existing ? "send_message" : "subagent", arguments: args }, assignment: { agentId: child.agentId, phrase: tasks.length ? list3(tasks.map(taskPhrase)) : "the next assignment" } };
    };
    try {
      for (let index = 0; index < turn.actions.length; index++) {
        const action = turn.actions[index];
        const id = `sim-${script.scriptId}-${turn.id}-${index}`;
        if (action.type === "delegate") {
          if (seenChildren.has(action.agentId)) continue;
          seenChildren.add(action.agentId);
        }
        if (action.type === "assignment") {
          const task = taskOf(action.taskId);
          if (task) pending2.push(narrateTask(task, plan));
          continue;
        }
        if (action.type === "report") {
          const task = taskOf(action.taskId);
          if (task) pending2.push(reportTask(task, plan, run2.journal?.receipts ?? {}));
          continue;
        }
        if (action.type === "wait") {
          await waitTasks(action.tasks);
          continue;
        }
        if (!issuable(index, id, action)) {
          pending2 = [];
          continue;
        }
        if (action.type === "tool") {
          const step = plan.steps.find((step2) => step2.key === action.stepKey);
          if (!ready(step.dependsOn ?? [])) await speak("Waiting for an earlier step to finish.");
          await run2.execution.waitSteps(step.dependsOn ?? [], signal);
          const argv = resolveSimulationStep(step, run2.journal.receipts, run2.directory);
          const cli = this.ctx.layerfs.agentCli?.() ?? managedCli({ root: this.ctx.layerfs.root, cli: this.ctx.layerfs.cli, home: this.ctx.layerfs.home, bundle: this.ctx.layerfs.bundle, cacheHome: this.ctx.layerfs.cacheHome, callLog: this.ctx.layerfs.callLog, gate: this.ctx.layerfs.lfs.spec.gate });
          let bound = this.ctx.layerfsSessions?.binding?.(binding.sessionId);
          if (bound?.kind === "shared" && bound.parent) bound = this.ctx.layerfsSessions.binding(bound.parent) ?? bound;
          const command2 = renderSimulationCommand(step, argv, bound?.state === "bound" ? SIMULATION_CLI : cli);
          this.calls.set(id, { binding, action, turn, argv, command: command2 });
          this.ensureStoreLane();
          const text6 = pending2.filter(Boolean).join(" ");
          return { ...text6 ? { text: text6 } : {}, calls: [{ id, name: "bash", arguments: { description: describeCommand(argv), command: command2 } }] };
        }
        if (action.type === "delegate") {
          const group = [delegation(action, id)];
          for (let next = index + 1; turn.actions[next]?.type === "delegate"; next++) {
            const other = turn.actions[next], otherId = `sim-${script.scriptId}-${turn.id}-${next}`;
            if (seenChildren.has(other.agentId)) continue;
            if (!issuable(next, otherId, other)) break;
            seenChildren.add(other.agentId);
            group.push(delegation(other, otherId));
          }
          const text6 = [...pending2, narrateDelegation(group.map((item) => item.assignment))].filter(Boolean).join(" ");
          return { text: text6, calls: group.map((item) => item.call) };
        }
      }
      pending2 = [];
      await waitTasks(turn.taskIds);
      if (!script.agentId && binding.turn === script.turns.length - 1) {
        const own = (plan.tasks ?? []).filter((task) => task.conversationId === script.conversationId).map((task) => task.id);
        if (!tasksReady(own)) await speak(narrateWait(own.map(taskOf).filter((task) => task && !ready(task.stepKeys)), script));
        await this.settleConversation(binding, signal);
        signal.throwIfAborted();
      }
      binding.complete = true;
      const final = !script.agentId && binding.turn === script.turns.length - 1 ? this.target(binding) : void 0;
      return { text: summarizeTurn({ script, turn, plan, receipts: run2.journal?.receipts ?? {}, target: final }) };
    } catch (error2) {
      if (!error2?.narration || signal.aborted) throw error2;
      return narrateFailureAndSettle(error2, error2.narration);
    }
  }
  /** A root's last turn waits for its own conversation (tasks and children) only;
   * other conversations of the run keep going or stop independently. The
   * whole-project verification runs once every task of the run has a confirmed
   * receipt, i.e. only when no conversation stopped or failed before finishing. */
  async settleConversation(binding, signal) {
    const { run: run2, script } = binding;
    await run2.execution.waitTasks(run2.plan.tasks.filter((task) => task.conversationId === script.conversationId).map((task) => task.id), signal);
    await Promise.all([...run2.bindings.values()].filter((item) => item.script.agentId && item.script.conversationId === script.conversationId).map((item) => item.agent?.whenIdle()));
    const complete = run2.plan.tasks.every((task) => task.stepKeys.every((key) => Object.hasOwn(run2.journal.receipts, key)));
    if (!complete) return;
    if (!run2.verification) run2.verification = verifySimulation(run2.manifest, run2.plan, run2.journal, (argv) => run2.execution.globalBudget.run(() => execute({ cli: this.ctx.layerfs.cli, home: this.ctx.layerfs.home, bundle: this.ctx.layerfs.bundle, cacheHome: this.ctx.layerfs.cacheHome, callLog: this.ctx.layerfs.callLog, gate: this.ctx.layerfs.lfs.spec.gate }, argv, { read: true, tag: `dsh-sim:${run2.manifest.runId}:verify` })));
    await run2.verification;
  }
  workspaceOfCall(sessionId, callId) {
    const call = this.calls.get(String(callId));
    return call?.binding.sessionId === String(sessionId) && call.argv?.[0] === "workspace" ? call.argv[2] : void 0;
  }
  stepOfCall(sessionId, callId) {
    const call = this.calls.get(String(callId));
    return call?.binding.sessionId === String(sessionId) && call.action.type === "tool" ? { runId: call.binding.run.manifest.runId, stepKey: call.action.stepKey } : void 0;
  }
  async executeTool(execution, next) {
    const binding = this.bindings.get(String(execution.agent?.id));
    if (!binding || terminal2(binding.state)) return next();
    try {
      return await this.scriptTool(binding, execution, next);
    } finally {
      if (execution.signal?.aborted) await this.holdForChildren(binding);
    }
  }
  async scriptTool(binding, execution, next) {
    binding.controller.signal.throwIfAborted();
    const call = this.calls.get(String(execution.callId));
    if (!call || call.binding !== binding) throw new Error("Tool call is not part of this session script.");
    execution.signal = AbortSignal.any([execution.signal, binding.controller.signal]);
    if (call.action.type !== "tool") return next();
    if (execution.name !== "bash" || execution.arguments.command !== call.command || execution.arguments.run_in_background) throw new Error("Command differs from the authorized project action.");
    let result;
    await binding.run.execution.execute(call.action.stepKey, { origin: "tool", agentKey: binding.script.agentKey, sessionId: binding.sessionId, turnId: call.turn.id, toolCallId: String(execution.callId) }, async (argv, step, signal) => {
      binding.run.execution.validateCommand(step.key, call.argv, step.input);
      let cancellation;
      const cancel = () => {
        if (argv[0] !== "workspace" || argv[1] !== "exec" || cancellation) return;
        cancellation = (async () => {
          const receipt = await execute({ cli: this.ctx.layerfs.cli, home: this.ctx.layerfs.home, bundle: this.ctx.layerfs.bundle, cacheHome: this.ctx.layerfs.cacheHome, callLog: this.ctx.layerfs.callLog, gate: this.ctx.layerfs.lfs.spec.gate }, ["workspace", "cancel", argv[2], "--detail"], { timeout: 3e4 });
          if (receipt?.unknown === true || !(receipt?.already_ended === true || ["SIGTERM", "SIGKILL"].includes(receipt?.signal))) throw new Error(`Execution cancellation was not confirmed: ${receipt?.outcome ?? "missing outcome"}`);
          await binding.run.journal.append({ type: "execution.cancelled", stepKey: step.key, agentKey: binding.script.agentKey, origin: "host", receipt });
        })().catch(async (error2) => {
          await binding.run.journal.append({ type: "execution.cancel-uncertain", stepKey: step.key, agentKey: binding.script.agentKey, origin: "host", error: String(error2) });
          throw error2;
        });
        void cancellation.catch(() => {
        });
      };
      signal.addEventListener("abort", cancel, { once: true });
      try {
        signal.throwIfAborted();
        result = await next();
        return parseSimulationBashReceipt(result, { exec: argv[0] === "workspace" && argv[1] === "exec" });
      } finally {
        signal.removeEventListener("abort", cancel);
        await cancellation;
      }
    }, execution.signal);
    return result;
  }
  async turnStopping(agent) {
    const binding = this.bindings.get(String(agent.id));
    if (!binding || terminal2(binding.state) || !binding.complete) return;
    binding.complete = false;
    binding.turn++;
    await binding.run.journal.append({ type: "turn-settled", agentKey: binding.script.agentKey, sessionId: binding.sessionId, turn: binding.turn });
    if (binding.script.agentId) {
      if (binding.turn >= binding.script.turns.length && binding.ordinaryModel) {
        agent.model.select(binding.ordinaryModel);
        binding.ordinaryRestored = true;
        this.refreshModels();
      }
      return;
    }
    if (binding.turn < binding.script.turns.length) {
      this.queueScript(binding, binding.script.turns[binding.turn].request, true);
      return;
    }
    await this.finishRoot(binding, "completed");
  }
  target(binding, allowFallback = false) {
    const familyKeys = new Set(binding.run.plan.agents.filter((agent) => agent.conversationId === binding.script.conversationId).map((agent) => agent.agentKey));
    if (binding.run.journal.records.some((record) => record.type === "intent" && familyKeys.has(record.agentKey) && !binding.run.journal.records.some((result) => result.type === "result" && result.stepKey === record.stepKey && result.ok === true))) return void 0;
    const target = binding.run.plan.continuationTargets[binding.script.conversationId];
    if (allowFallback) {
      const mounts = binding.run.plan.steps?.filter((step) => step.conversationId === binding.script.conversationId && step.argv[0] === "workspace" && step.argv[1] === "mount" && binding.run.journal.receipts[step.key]) ?? [];
      for (const mount of mounts) {
        const ws = binding.run.journal.receipts[mount.key].workspace;
        if (!binding.run.plan.steps.some((step) => step.argv[0] === "workspace" && step.argv[1] === "unmount" && binding.run.journal.receipts[step.key] && resolveSimulationStep(step, binding.run.journal.receipts, binding.run.directory)[2] === ws)) return void 0;
      }
    }
    const candidates = allowFallback ? target?.fallbacks ?? [target] : [target];
    for (const candidate of candidates) {
      const receipt = candidate?.receipt && binding.run.journal.receipts[candidate.receipt];
      const version2 = candidate.initial === true && candidate.receipt === "setup.project" && typeof receipt?.commit === "string" && /^[a-f0-9]{66}$/.test(receipt.commit) ? { kind: "Layer", id: receipt.commit } : savedVersions("branch.publish", receipt).find((version3) => version3.kind === "Layer");
      if (version2) return { kind: version2.kind, id: version2.id, branch: candidate.branch };
    }
    return void 0;
  }
  async finishRoot(binding, state, error2) {
    const family = [...binding.run.bindings.values()].filter((item) => item.rootSessionId === binding.rootSessionId).sort((a, b) => Number(!a.script.agentId) - Number(!b.script.agentId));
    const target = this.target(binding, state !== "completed");
    const resolvedState = !target && state !== "interrupted" ? "failed" : state;
    for (const item of family) {
      item.state = "handoff";
      await this.drainParking(item);
      let resumed;
      try {
        const live = this.ctx.agents?.get?.(item.sessionId);
        if (item.script.agentId && this.ctx.agents && !live && (!item.ordinaryRestored && item.ordinaryModel || item.parkedHuman?.size)) {
          const root = this.bindings.get(item.rootSessionId);
          if (!root?.agent) throw new Error("The native parent is unavailable for child handoff.");
          resumed = await this.ctx.agents.resume({ resumeSessionId: item.sessionId, parentAgent: root.agent, agentOptions: item.ordinaryModel });
          item.agent = resumed.agent;
        } else if (live) item.agent = live;
        if (!item.ordinaryRestored && this.restoreOrdinary(item.agent, item.ordinaryModel, true)) item.ordinaryRestored = true;
        await binding.run.journal.append({ type: "handoff", agentKey: item.script.agentKey, sessionId: item.sessionId, state: resolvedState, target, error: error2 });
        await this.ctx.layerfsSessions.completeSimulation(item.sessionId, target, resolvedState, error2 ?? (!target ? `No confirmed continuation version is available. ${CONTINUE_FRESH}` : void 0));
        item.state = resolvedState;
        await this.releaseHumans(item, !item.script.agentId);
      } finally {
        await resumed?.dispose();
      }
    }
    this.refreshModels();
  }
  async stop(sessionId) {
    const binding = this.bindings.get(sessionId);
    if (!binding || terminal2(binding.state)) return { state: binding?.state ?? this.ctx.layerfsSessions?.simulationOf?.(sessionId)?.state ?? "idle" };
    if (binding.stopping) return binding.stopping;
    if (binding.state === "stopping") return { state: "stopping" };
    const root = binding.script.agentId ? this.bindings.get(binding.rootSessionId) : void 0;
    if (root && root !== binding && !terminal2(root.state)) return this.stop(root.sessionId);
    const blocked = !binding.script.agentId && !!binding.failure && !!binding.run.execution.blockedByStop?.(binding.script.conversationId);
    binding.stopping = (async () => {
      const family = binding.script.agentId ? [binding] : [...binding.run.bindings.values()].filter((item) => item.rootSessionId === sessionId);
      for (const item of family) {
        item.state = "stopping";
        item.controller.abort(new Error("Project work stopped"));
      }
      for (const item of family) for (const queued of [...item.agent?.inbox?.nextTurn ?? [], ...item.agent?.inbox?.nextStep ?? []]) this.parkNotice(item, queued, true);
      if (!binding.script.agentId) this.holdIdleRoot(binding);
      for (const item of family) {
        for (const queued of [...item.agent.inbox.nextTurn, ...item.agent.inbox.nextStep]) if (item.scriptRequests?.has(String(queued.id))) item.agent.inbox.remove(queued.id);
        await Promise.all([...item.agent.inbox.nextTurn, ...item.agent.inbox.nextStep].map((message) => this.parkHuman(item, message)));
        item.agent.cancel({ kind: "user" }, { keepInbox: true });
      }
      await binding.run.execution.stop(binding.script.agentKey);
      if (binding.run.verification) await Promise.allSettled([binding.run.verification]);
      await Promise.all(family.map((item) => item.agent.whenIdle()));
      await Promise.all(family.map((item) => this.drainParking(item)));
      if (binding.script.agentId) {
        binding.state = "stopped";
        await binding.run.journal.append({ type: "driver-stopped", agentKey: binding.script.agentKey, sessionId });
        await this.ctx.layerfsSessions.completeSimulation(sessionId, void 0, "stopped", `The child stopped. ${CONTINUE_FRESH}`);
        await this.releaseHumans(binding, false);
        this.refreshModels();
      } else {
        await this.finishRoot(binding, binding.failure && !blocked ? "failed" : "stopped", blocked ? `Another conversation of this run was stopped before this conversation's prerequisites completed. ${CONTINUE_FRESH}` : binding.failure);
      }
      return { state: binding.state };
    })().catch((error2) => this.settlementFailed(binding, error2));
    return binding.stopping;
  }
  async settlementFailed(binding, error2) {
    const message = `Project handoff failed: ${String(error2?.message ?? error2)}. ${CONTINUE_FRESH}`;
    const family = binding.script.agentId ? [binding] : [...binding.run.bindings.values()].filter((item) => item.rootSessionId === binding.rootSessionId);
    for (const item of family) {
      item.state = "failed";
      item.controller.abort(new Error(message));
      item.agent?.cancel({ kind: "user" }, { keepInbox: true });
    }
    const warn = (failure) => this.ctx.logger?.("layerfs").warn("simulation failed handoff: %s", String(failure));
    await binding.run.execution.stop(binding.script.agentKey).catch(warn);
    await Promise.allSettled(family.map((item) => item.agent?.whenIdle()));
    for (const item of family) {
      await binding.run.journal.append({ type: "driver-handoff-failed", agentKey: item.script.agentKey, sessionId: item.sessionId, state: "failed", error: message }).catch(warn);
      await this.ctx.layerfsSessions.completeSimulation(item.sessionId, void 0, "failed", message).catch(warn);
      const live = this.ctx.agents?.get?.(item.sessionId);
      if (!this.ctx.agents || live === item.agent) {
        let restored = !!item.ordinaryRestored;
        if (!restored) try {
          restored = item.ordinaryRestored = this.restoreOrdinary(item.agent, item.ordinaryModel, true);
        } catch (failure) {
          warn(failure);
        }
        await this.releaseHumans(item, restored && !item.script.agentId).catch(warn);
      }
    }
    this.refreshModels();
    return { state: "failed", error: message };
  }
  turnEnded(session) {
    const binding = this.bindings.get(String(session.id));
    if (binding?.script.agentId && binding.state === "stopping" && !binding.ordinaryRestored && binding.ordinaryModel) {
      binding.agent.model.select(binding.ordinaryModel);
      binding.ordinaryRestored = true;
    }
  }
  queueScript(binding, text6, prepend = false) {
    const message = request2(text6);
    binding.scriptRequests ??= /* @__PURE__ */ new Set();
    binding.scriptRequests.add(String(message.id));
    if (prepend) binding.agent.inbox.prepend("next-turn", message);
    else binding.agent.followup(message);
  }
  isHuman(binding, message) {
    if (message.source?.kind !== "user") return false;
    if (binding.scriptRequests?.has(String(message.id))) return false;
    if (binding.script.agentId && !binding.initialPromptId && message.content?.[0]?.type === "text" && message.content[0].text === binding.script.turns[0]?.request) {
      binding.initialPromptId = String(message.id);
      binding.scriptRequests ??= /* @__PURE__ */ new Set();
      binding.scriptRequests.add(String(message.id));
      return false;
    }
    return true;
  }
  parkHuman(binding, message) {
    if (!this.isHuman(binding, message)) return Promise.resolve();
    binding.parkedHuman ??= /* @__PURE__ */ new Map();
    binding.parking ??= /* @__PURE__ */ new Map();
    const id = String(message.id);
    if (binding.parkedHuman.has(id)) return Promise.resolve();
    if (binding.parking.has(id)) return binding.parking.get(id);
    const pending2 = (async () => {
      await binding.run.journal.append({ type: "human-deferred", agentKey: binding.script.agentKey, sessionId: binding.sessionId, messageId: id });
      binding.parkedHuman.set(id, message);
      binding.agent.inbox.remove(message.id);
    })().finally(() => binding.parking.delete(id));
    binding.parking.set(id, pending2);
    return pending2;
  }
  async drainParking(binding) {
    while (binding.parking?.size) await Promise.all([...binding.parking.values()]);
  }
  inserted(agent, message) {
    const binding = this.bindings.get(String(agent.id));
    if (binding && this.parkNotice(binding, message, true)) return;
    if (binding && !terminal2(binding.state)) void this.parkHuman(binding, message).catch((error2) => this.fail(agent, error2));
  }
  /** While a script stops, DSH's notice that one of its children settled is held
   * for the real model instead of reaching the stopping script. Taken out of the
   * inbox synchronously, so a root kept busy by holdForChildren never wakes into
   * an empty turn for it. Released without waking (releaseHumans). */
  parkNotice(binding, message, fromInbox = false) {
    if (!["stopping", "handoff"].includes(binding.state) || message?.source?.kind !== "subagent-settled") return false;
    binding.parkedNotices ??= /* @__PURE__ */ new Map();
    binding.parkedNotices.set(String(message.id), message);
    if (message.source.senderSessionId !== void 0) (binding.settledChildren ??= /* @__PURE__ */ new Set()).add(String(message.source.senderSessionId));
    if (fromInbox) binding.agent?.inbox?.remove?.(message.id);
    return true;
  }
  /** Called by the adapter after an aborted script step (model.ts). */
  holdStopping(sessionId) {
    return this.holdForChildren(this.bindings.get(String(sessionId)));
  }
  /** A stopping root's driver stays busy until its live children settle (bounded),
   * so DSH delivers their settlement notices as steering that parkNotice takes,
   * rather than as a follow-up that wakes the idle root into an empty turn.
   * Called after an aborted step: the adapter's stream and executeTool. */
  async holdForChildren(binding, limitMs = HOLD_LIMIT_MS) {
    if (!binding || binding.script.agentId) return;
    await new Promise((resolve11) => setImmediate(resolve11));
    if (!["stopping", "handoff"].includes(binding.state)) return;
    await this.childrenSettled(binding, limitMs);
  }
  /** An idle root (e.g. one that already narrated a failure) is held the same way
   * through a DSH maintenance task: wakes sent meanwhile are latched and dropped
   * when it ends, as parkNotice has emptied the inbox. Started before Stop
   * cancels the children; a busy root is held by holdForChildren instead. */
  holdIdleRoot(binding) {
    const agent = binding.agent;
    if (binding.script.agentId || agent?.status !== "idle" || typeof agent.runMaintenance !== "function") return;
    try {
      void agent.runMaintenance(() => this.childrenSettled(binding)).catch(() => {
      });
    } catch {
    }
  }
  /** Resolves when the root's children that are live now have settled (their
   * notice seen, or gone from the registry a moment), or after `limitMs`. Longer
   * than a child's 30 s remote execution cancellation. */
  async childrenSettled(binding, limitMs = HOLD_LIMIT_MS) {
    if (!this.ctx.agents?.get) return;
    const live = (id) => !!this.ctx.agents.get(id);
    const children2 = [...binding.run.bindings.values()].filter((item) => item !== binding && item.rootSessionId === binding.rootSessionId && live(item.sessionId));
    const gone = /* @__PURE__ */ new Map();
    const deadline = Date.now() + limitMs;
    while (Date.now() < deadline) {
      const now = Date.now();
      const open3 = children2.filter((item) => {
        if (binding.settledChildren?.has(item.sessionId)) return false;
        if (live(item.sessionId)) return true;
        if (!gone.has(item.sessionId)) gone.set(item.sessionId, now);
        return now - gone.get(item.sessionId) < 250;
      });
      if (!open3.length) return;
      await new Promise((resolve11) => setTimeout(resolve11, 25));
    }
  }
  async releaseHumans(binding, wake) {
    await this.drainParking(binding);
    for (const [id, message] of binding.parkedNotices ?? []) {
      const pending2 = [...binding.agent.inbox.nextTurn ?? [], ...binding.agent.inbox.nextStep ?? []];
      if (!pending2.some((queued) => String(queued.id) === id)) {
        if (typeof binding.agent.inject === "function") binding.agent.inject(message);
        else binding.agent.send(message, "next-step", false);
      }
      binding.parkedNotices.delete(id);
    }
    for (const [id, message] of binding.parkedHuman ?? []) {
      const pending2 = [...binding.agent.inbox.nextTurn ?? [], ...binding.agent.inbox.nextStep ?? []];
      if (!pending2.some((queued) => String(queued.id) === id)) binding.agent.send(message, "next-turn", wake);
      await binding.run.journal.append({ type: "human-released", sessionId: binding.sessionId, messageId: id });
      binding.parkedHuman.delete(id);
    }
  }
  async restoreDeferred(agent) {
    const pending2 = this.recoveredDeferred.get(String(agent.id));
    if (!pending2) return;
    for (const event of agent.session.snapshotEvents(0)) {
      if (event.type !== "agent/inbox/spliced") continue;
      for (const message of event.data.inserted ?? []) if (pending2.ids.has(String(message.id))) {
        if (![...agent.inbox.nextTurn, ...agent.inbox.nextStep].some((queued) => queued.id === message.id)) agent.send(message, "next-turn", false);
        await pending2.journal.append({ type: "human-released", sessionId: String(agent.id), messageId: String(message.id) });
        pending2.ids.delete(String(message.id));
      }
    }
    this.recoveredDeferred.delete(String(agent.id));
  }
  fail(agent, error2) {
    const binding = this.bindings.get(String(agent.id));
    if (!binding || terminal2(binding.state) || binding.state === "stopping") return;
    const root = this.bindings.get(binding.rootSessionId) ?? binding;
    root.failure = String(error2?.message ?? error2);
    void this.stop(root.sessionId).catch((failure) => this.ctx.logger("layerfs").warn("simulation settlement: %s", String(failure)));
  }
  async inspect(sessionId) {
    const binding = this.bindings.get(sessionId);
    const meta = binding ? this.metadata(binding) : this.ctx.layerfsSessions.simulationOf(sessionId);
    if (!meta) return { script: null, state: "idle", locked: false };
    const state = binding?.state ?? meta.state;
    if (!binding) {
      if (typeof meta.runId !== "string" || !/^[a-z0-9][a-z0-9_.-]{0,62}$/.test(meta.runId) || typeof meta.hash !== "string" || !/^[a-f0-9]{64}$/.test(meta.hash)) throw new Error("The saved script identity is invalid.");
      const directory = join29(this.ctx.layerfs.root, "simulations", meta.runId);
      let source = null;
      try {
        const manifest = await validateSimulationPackage(directory);
        const plan = JSON.parse(await readFile4(join29(directory, "plan.json"), "utf8"));
        const script = plan.agents.find((script2) => script2.agentKey === meta.agentKey && script2.scriptId === meta.scriptId && script2.hash === meta.hash);
        if (!script || !Object.hasOwn(manifest.hashes, script.path) || manifest.hashes[script.path] !== meta.hash) throw new Error("The saved script identity does not match this session.");
        source = await readFile4(join29(directory, script.path), "utf8");
      } catch (error2) {
        if (error2?.code !== "ENOENT") throw error2;
      }
      return { script: { ...meta, source }, state: terminal2(state) ? state : "interrupted", locked: false };
    }
    await validateSimulationPackage(binding.run.directory);
    return { script: { ...meta, source: await readFile4(join29(binding.run.directory, binding.script.path), "utf8") }, state, locked: !terminal2(state) };
  }
  /** What an active script session's shell commands may write: its run's project,
   * machine and planned sandboxes, for the sandbox policy. */
  executionScope(sessionId) {
    const binding = this.bindings.get(String(sessionId));
    if (!binding || terminal2(binding.state)) return void 0;
    const { manifest, plan } = binding.run;
    const sandboxes = [...new Set((plan.steps ?? []).filter((step) => step.resource?.family === "sandbox").map((step) => step.resource.name))];
    return { project: manifest.projectRef, machine: manifest.machine, sandboxes, rootSessionId: binding.rootSessionId };
  }
  /** LayerFS fails a second process on one Store (`Busy`, "Store busy before
   * effect"), so a scripted CLI call that opens the Store holds the host's
   * per-Store lane while its bash runs: the same calls the host's own `execute`
   * serializes (`storeOfCall`), never sandbox or workspace calls, which go
   * through the daemon and may run long. The lane is taken by a tools/execute
   * hook registered once, when the first scripted command is issued, so it
   * normally wraps only the shell itself; the lane is re-entrant, so host work
   * a later-registered hook awaits inside it cannot deadlock on it either.
   * Waiting for the lane ends when the tool call is aborted. */
  ensureStoreLane() {
    if (this.storeLane || typeof this.ctx.on !== "function") return;
    this.storeLane = true;
    this.ctx.on("tools/execute", (execution, next) => {
      const call = this.calls.get(String(execution.callId));
      if (!call || call.action.type !== "tool" || call.binding.sessionId !== String(execution.agent?.id) || !call.argv) return next();
      const store = storeOfCall(call.argv);
      const home = this.ctx.layerfs?.home;
      return store && home ? admitStore(home, store, () => next(), execution.signal) : next();
    });
  }
};

// src/host/simulations/index.ts
var name4 = "dsh-layerfs-simulations";
var inject4 = ["layerfs", "layerfsRemote", "layerfsSessions", "llm", "agents", "sessionController", "agentDefaultModel"];
function simulationArguments(raw) {
  const words = raw.trim().split(/\s+/).filter(Boolean);
  const parsed = { project: "", machine: "", mixed: false };
  const seen = /* @__PURE__ */ new Set();
  for (let i = 0; i < words.length; i++) {
    const flag = words[i];
    if (seen.has(flag)) throw new Error(`Duplicate simulation option: ${flag}`);
    seen.add(flag);
    if (flag === "--mixed") parsed.mixed = true;
    else if (flag === "--project" || flag === "--machine") {
      const value = words[++i];
      if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value`);
      parsed[flag === "--project" ? "project" : "machine"] = value;
    } else throw new Error(`Unknown simulation option: ${flag}`);
  }
  if (!parsed.project || !parsed.machine) throw new Error("Use /simulation --project <preset> --machine <machine> [--mixed]");
  return parsed;
}
function apply4(ctx) {
  const runtime = new SimulationRuntime(ctx);
  ctx.provide("layerfsSimulations", runtime);
  ctx.effect(() => () => runtime.dispose(), "dsh-layerfs: script admission");
  ctx.llm.registerAdapter(["simulation"], new SimulationAdapter(runtime));
  ctx.on("agent/created", async ({ agent }) => {
    await runtime.created(agent);
    return void 0;
  }, { prepend: true });
  ctx.on("agent/pre-step", (payload, next) => runtime.preStep(payload, next), { prepend: true });
  ctx.on("session/event", (session, event) => {
    if (event?.type === "turn/end") runtime.turnEnded(session);
  });
  ctx.on("agent/inbox/inserted", ({ agent, message }) => runtime.inserted(agent, message));
  ctx.on("agent/error", ({ agent, error: error2 }) => runtime.fail(agent, error2));
  ctx.on("agent/turn-stopping", async ({ agent }) => runtime.turnStopping(agent));
  ctx.on("tools/execute", (execution, next) => runtime.executeTool(execution, next), { prepend: true });
  ctx.layerfsRemote.operate(ctx, {
    "simulation.launch": (args, signal) => runtime.launch(args, signal),
    "simulation.stop": (args) => runtime.stop(String(args.sessionId)),
    "simulation.script": (args) => runtime.inspect(String(args.sessionId)),
    "simulation.status": (args) => runtime.inspect(String(args.sessionId)).then(({ state, locked }) => ({ state, locked }))
  });
  ctx.inject(["commands"], (scope) => {
    const commands = scope.commands;
    commands.register({
      name: "simulation",
      description: "Start project work from a prepared action script",
      input: { hint: "--project <preset> --machine <machine> [--mixed]" },
      handler: async ({ agent, rawInput, signal }) => {
        const options = simulationArguments(rawInput);
        const result = await runtime.launch({ ...options, cwd: agent.session.header.cwd, ordinaryModel: agent.model.current() }, signal);
        ctx.layerfs.emit("simulation-open", { sourceSessionId: String(agent.id), sessionId: result.sessionId });
        return { kind: "success", text: `Opened project session ${result.sessionId}.` };
      }
    });
  });
  void runtime.recover().catch((error2) => ctx.logger("layerfs").warn("simulation recovery: %s", String(error2)));
}

// src/host/index.ts
var name5 = "dsh-layerfs";
function apply5(ctx, config = {}) {
  ctx.plugin(LayerfsRemote);
  ctx.plugin(LayerfsService, config);
  ctx.effect(() => () => {
    for (const child of children) child.kill("SIGTERM");
  }, "dsh-layerfs: cli children");
  ctx.inject(["layerfsRemote", "layerfs"], (ctx2) => {
    ctx2.layerfs.startSetup();
    ctx2.layerfsRemote.operate(ctx2, {
      "runtime.status": () => ctx2.layerfs.status(),
      "runtime.save": (args) => ctx2.layerfs.savePin({ cli: args?.cli ?? null, daemon: args?.daemon ?? null, bundle: args?.bundle ?? null, ...args?.runtime ? { runtime: args.runtime } : {}, ...args && "cacheHome" in args ? { cacheHome: args.cacheHome ?? null } : {} }),
      // the setup check (docs/specs/layerfs-setup.md §3): runtime, LayerFS folder, one build
      "setup.status": () => ctx2.layerfs.setup(),
      // a refusal's `layerfs home init` fix (a missing folder); an older LayerFS's folder is never converted
      "setup.init": () => ctx2.layerfs.initHome(),
      "setup.recordDaemon": () => ctx2.layerfs.recordDaemon(),
      "runtime.installed": () => ctx2.layerfs.installed()
    });
    ctx2.plugin(routes_exports);
    ctx2.plugin(sessions_exports);
    ctx2.plugin(simulations_exports);
    ctx2.plugin(logs_exports);
  });
}
export {
  apply5 as apply,
  name5 as name
};
//# sourceMappingURL=index.js.map
