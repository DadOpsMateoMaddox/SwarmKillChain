import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as shortHash, n as cn } from "./utils-Fk7ydq6X.mjs";
import { n as Badge, r as statusTone } from "./badge-BG0iyrua.mjs";
import { n as briefFinding } from "./ops-DEpmkez_.mjs";
import { t as Button } from "./button-BTy3-nAK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/swarm-timeline-Bd26wVzY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FindingCard({ finding, createdAt }) {
	const title = finding.title;
	const attack = "attackClass" in finding && finding.attackClass ? finding.attackClass : finding.attack_class;
	const claim = "investigatorClaim" in finding && finding.investigatorClaim ? finding.investigatorClaim : finding.investigator_claim;
	const rebuttal = "skepticRebuttal" in finding && finding.skepticRebuttal ? finding.skepticRebuttal : finding.skeptic_rebuttal;
	const verdict = "adjudicatorVerdict" in finding && finding.adjudicatorVerdict ? finding.adjudicatorVerdict : finding.adjudicator_verdict;
	const tools = Array.isArray(finding.toolRefs) ? finding.toolRefs : JSON.parse((finding.tool_refs ?? "[]") || "[]");
	const hashes = Array.isArray(finding.evidenceHashes) ? finding.evidenceHashes : JSON.parse((finding.evidence_hashes ?? "[]") || "[]");
	const gates = Array.isArray(finding.gates) ? finding.gates : JSON.parse((typeof finding.gates === "string" ? finding.gates : "[]") || "[]");
	const [brief, setBrief] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl tracking-tight",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle",
					children: [
						attack,
						" · ",
						finding.phase,
						createdAt ? ` · ${createdAt}` : ""
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: statusTone(finding.status),
						children: finding.status.replaceAll("_", " ")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: finding.confidence })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-5 grid gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
						children: "Investigator"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 text-sm text-muted",
						children: claim
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
						children: "Skeptic"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 text-sm text-muted",
						children: rebuttal
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
						children: "Adjudicator"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 text-sm text-fg",
						children: verdict
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [tools.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: "info",
					children: t
				}, t)), hashes.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: shortHash(h) }, h))]
			}),
			gates.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid gap-1 sm:grid-cols-2",
				children: gates.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-2 text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: g.ok ? "text-ok" : "text-danger",
							children: g.ok ? "PASS" : "FAIL"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: g.id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-subtle",
							children: g.detail
						})
					]
				}, g.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					disabled: busy,
					onClick: () => {
						setBusy(true);
						briefFinding({ data: {
							title,
							claim: claim ?? "",
							verdict: verdict ?? ""
						} }).then((r) => setBrief(r.text)).finally(() => setBusy(false));
					},
					children: busy ? "Briefing…" : "Operator brief"
				}), brief && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: brief
				})]
			})
		]
	});
}
function SwarmTimeline({ steps, visible }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "space-y-3",
		children: steps.map((s, i) => {
			const show = i < visible;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cn("rounded-lg border border-border bg-elevated px-4 py-3 transition-opacity duration-300", show ? "opacity-100" : "opacity-30"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
						children: s.role
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-sm font-medium",
						children: s.title
					}),
					show && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: s.body
					})
				]
			}, `${s.role}-${i}`);
		})
	});
}
//#endregion
export { SwarmTimeline as n, FindingCard as t };
