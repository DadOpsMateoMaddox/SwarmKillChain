import { createHash } from "node:crypto";
import { GENESIS_HASH } from "./swarm-types";

export const GENESIS = GENESIS_HASH;

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => canonical(v)).join(",")}]`;
  const rec = value as Record<string, unknown>;
  const keys = Object.keys(rec).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonical(rec[k])}`).join(",")}}`;
}

export function chainHash(prev: string, actor: string, action: string, payload: unknown, at: string): string {
  return sha256(`${prev}|${at}|${actor}|${action}|${canonical(payload)}`);
}
