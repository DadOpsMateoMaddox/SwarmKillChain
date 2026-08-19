import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as shortHash, n as cn, r as formatWhen } from "./utils-Fk7ydq6X.mjs";
import { n as Badge, r as statusTone, t as AppShell } from "./badge-BG0iyrua.mjs";
import { s as loadWorkspace } from "./ops-DEpmkez_.mjs";
import { t as Button } from "./button-BTy3-nAK.mjs";
import { i as PHASES } from "./catalog-BKDiF7J1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ops-C_pa-9Pi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function KillChain({ active = [], counts }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "grid grid-cols-4 gap-2 lg:grid-cols-8",
		children: PHASES.map((p) => {
			const on = active.includes(p.id);
			const n = counts?.[p.id] ?? 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cn("rounded-md border px-2 py-3 text-center", on ? "border-accent/40 bg-elevated" : "border-border bg-surface"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
					children: p.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 font-mono text-sm tabular-nums text-fg",
					children: n
				})]
			}, p.id);
		})
	});
}
function OpsPage() {
	const [data, setData] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		loadWorkspace().then(setData).catch((e) => setErr(e.message));
	}, []);
	const counts = (0, import_react.useMemo)(() => {
		const c = {};
		for (const f of data?.findings ?? []) {
			const p = f.phase;
			c[p] = (c[p] ?? 0) + 1;
		}
		return c;
	}, [data]);
	const contained = (data?.runs ?? []).filter((r) => r.status === "contained").length;
	const breach = (data?.runs ?? []).filter((r) => r.status === "breach").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl space-y-8 px-5 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.22em] text-subtle",
					children: "Command"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-4xl tracking-tight",
					children: "Operations"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/cases",
							children: "Open cases"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/disruptor",
							children: "Run disruptor"
						})
					})]
				})]
			}),
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: err
			}),
			!data && !err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Loading workspace…"
			}),
			data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "grid gap-3 sm:grid-cols-4",
					children: [
						{
							k: "Open cases",
							v: data.cases.filter((c) => c.status === "open").length
						},
						{
							k: "Findings",
							v: data.findings.length
						},
						{
							k: "Contained",
							v: contained
						},
						{
							k: "Breaches",
							v: breach
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface px-5 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
							children: s.k
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 font-display text-3xl tabular-nums",
							children: s.v
						})]
					}, s.k))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KillChain, {
					active: Object.keys(counts).filter((k) => (counts[k] ?? 0) > 0),
					counts
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid gap-6 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Cases"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2",
						children: data.cases.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/cases/$caseId",
							params: { caseId: c.id },
							className: "block rounded-lg border border-border bg-surface px-4 py-3 hover:bg-elevated",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: c.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: c.classification })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 line-clamp-2 text-xs text-muted",
								children: c.summary
							})]
						}) }, c.id))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Latest audit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2",
						children: data.audits.slice(0, 8).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg border border-border bg-surface px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs text-fg",
									children: a.action
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: statusTone(a.actor),
									children: a.actor
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 font-mono text-[11px] text-subtle",
								children: [
									shortHash(a.event_hash),
									" · ",
									formatWhen(a.created_at)
								]
							})]
						}, a.id))
					})] })]
				})
			] })
		]
	}) });
}
//#endregion
export { OpsPage as component };
