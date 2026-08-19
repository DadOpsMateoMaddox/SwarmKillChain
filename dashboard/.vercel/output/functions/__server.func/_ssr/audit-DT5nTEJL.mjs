import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as shortHash, r as formatWhen } from "./utils-Fk7ydq6X.mjs";
import { n as Badge, t as AppShell } from "./badge-BG0iyrua.mjs";
import { s as loadWorkspace } from "./ops-DEpmkez_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audit-DT5nTEJL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuditPage() {
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		loadWorkspace().then((w) => setRows([...w.audits].reverse()));
	}, []);
	const brokenAt = (0, import_react.useMemo)(() => {
		for (let i = 1; i < rows.length; i += 1) if (rows[i].prev_hash !== rows[i - 1].event_hash) return i;
		return -1;
	}, [rows]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl space-y-8 px-5 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.22em] text-subtle",
					children: "Chain of custody"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-4xl tracking-tight",
					children: "Audit"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-2xl text-sm text-muted",
					children: "Append-only. Each event hashes its predecessor. A missing or rewritten row breaks the chain and is treated as tamper."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
					children: "Integrity"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 font-display text-2xl",
					children: rows.length === 0 ? "No events" : brokenAt === -1 ? "Chain intact" : `Break at index ${brokenAt}`
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-2",
				children: rows.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg border border-border bg-surface px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs tabular-nums text-subtle",
								children: String(i + 1).padStart(3, "0")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: a.action
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: a.actor })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-[11px] leading-relaxed text-subtle",
						children: [
							"prev ",
							shortHash(a.prev_hash, 10),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"hash ",
							shortHash(a.event_hash, 10),
							" · ",
							formatWhen(a.created_at)
						]
					})]
				}, a.id))
			})
		]
	}) });
}
//#endregion
export { AuditPage as component };
