import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as cn } from "./utils-Fk7ydq6X.mjs";
import { n as Badge, r as statusTone, t as AppShell } from "./badge-BG0iyrua.mjs";
import { i as dispatchDisrupt, s as loadWorkspace } from "./ops-DEpmkez_.mjs";
import { t as Button } from "./button-BTy3-nAK.mjs";
import { n as SwarmTimeline, t as FindingCard } from "./swarm-timeline-Bd26wVzY.mjs";
import { t as ATTACKS } from "./catalog-BKDiF7J1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/disruptor-CXb6oM-4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DisruptorPage() {
	const [selected, setSelected] = (0, import_react.useState)(ATTACKS[0].id);
	const [result, setResult] = (0, import_react.useState)(null);
	const [visible, setVisible] = (0, import_react.useState)(0);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [history, setHistory] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		loadWorkspace().then((w) => setHistory(w.runs.filter((r) => r.mode === "disrupt")));
	}, [result]);
	(0, import_react.useEffect)(() => {
		if (!result || visible >= result.steps.length) return;
		const t = window.setTimeout(() => setVisible((v) => v + 1), 650);
		return () => window.clearTimeout(t);
	}, [result, visible]);
	const attack = ATTACKS.find((a) => a.id === selected) ?? ATTACKS[0];
	const contained = history.filter((h) => h.status === "contained").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl space-y-8 px-5 py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.22em] text-subtle",
					children: "Lab"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-4xl tracking-tight",
					children: "Disruptor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-2xl text-sm text-muted",
					children: "Fire a known swarm attack at the controller. The model does not decide containment — the gates do."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
					children: "Contained"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-display text-3xl tabular-nums",
					children: [
						contained,
						"/",
						history.length || 0
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2 lg:col-span-2",
				children: ATTACKS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setSelected(a.id);
						setResult(null);
						setVisible(0);
					},
					className: cn("w-full rounded-lg border px-4 py-3 text-left transition-colors duration-150", selected === a.id ? "border-accent/40 bg-elevated" : "border-border bg-surface hover:bg-elevated"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: a.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: a.phase })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-2 text-xs text-muted",
						children: a.summary
					})]
				}) }, a.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5 lg:col-span-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl tracking-tight",
							children: attack.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: attack.mechanism
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 font-mono text-[11px] text-subtle",
							children: ["Gates: ", attack.caughtBy.join(" · ")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-5",
							disabled: busy,
							onClick: () => {
								setBusy(true);
								setVisible(0);
								dispatchDisrupt({ data: { attackId: attack.id } }).then((r) => {
									setResult({
										outcome: r.outcome,
										steps: r.steps,
										finding: r.finding,
										gates: r.gates
									});
									toast.message(`Outcome: ${r.outcome}`);
								}).catch((e) => toast.error(e.message)).finally(() => setBusy(false));
							},
							children: busy ? "Injecting…" : "Inject attack"
						})
					]
				}), result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: statusTone(result.outcome),
							children: result.outcome
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted",
							children: "Controller verdict — not a model vote."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwarmTimeline, {
						steps: result.steps,
						visible
					}),
					visible >= result.steps.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FindingCard, { finding: result.finding })
				] })]
			})]
		})]
	}) });
}
//#endregion
export { DisruptorPage as component };
