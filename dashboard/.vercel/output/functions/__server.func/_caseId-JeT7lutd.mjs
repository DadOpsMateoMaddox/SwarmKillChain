import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { n as Route$1 } from "./_ssr/router-T8nvpqDu.mjs";
import { i as shortHash, r as formatWhen } from "./_ssr/utils-Fk7ydq6X.mjs";
import { n as Badge, t as AppShell } from "./_ssr/badge-BG0iyrua.mjs";
import { a as dispatchInvestigate, o as loadCase, t as addEvidence } from "./_ssr/ops-DEpmkez_.mjs";
import { t as Button } from "./_ssr/button-BTy3-nAK.mjs";
import { n as SwarmTimeline, t as FindingCard } from "./_ssr/swarm-timeline-Bd26wVzY.mjs";
import { n as Textarea, t as Input } from "./_ssr/input-De8DqIyv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_caseId-JeT7lutd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CasePage() {
	const { caseId } = Route$1.useParams();
	const [kase, setKase] = (0, import_react.useState)(null);
	const [evidence, setEvidence] = (0, import_react.useState)([]);
	const [findings, setFindings] = (0, import_react.useState)([]);
	const [audits, setAudits] = (0, import_react.useState)([]);
	const [steps, setSteps] = (0, import_react.useState)([]);
	const [visible, setVisible] = (0, import_react.useState)(0);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("note");
	const [note, setNote] = (0, import_react.useState)("");
	const refresh = () => loadCase({ data: caseId }).then((row) => {
		if (!row) return;
		setKase(row.case);
		setEvidence(row.evidence);
		setFindings(row.findings);
		setAudits(row.audits);
	});
	(0, import_react.useEffect)(() => {
		refresh().catch((e) => toast.error(e.message));
	}, [caseId]);
	(0, import_react.useEffect)(() => {
		if (!steps.length || visible >= steps.length) return;
		const t = window.setTimeout(() => setVisible((v) => v + 1), 700);
		return () => window.clearTimeout(t);
	}, [steps, visible]);
	if (!kase) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[50vh] place-items-center text-sm text-muted",
		children: "Loading case…"
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl space-y-8 px-5 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[0.22em] text-subtle",
						children: "Case"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-4xl tracking-tight",
						children: kase.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-3xl text-sm text-muted",
						children: kase.summary
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy || evidence.length === 0,
					onClick: () => {
						setBusy(true);
						setVisible(0);
						dispatchInvestigate({ data: caseId }).then((r) => {
							setSteps(r.steps);
							toast.success(`${r.findings.length} finding${r.findings.length === 1 ? "" : "s"} adjudicated`);
							return refresh();
						}).catch((e) => toast.error(e.message)).finally(() => setBusy(false));
					},
					children: busy ? "Dispatching…" : "Dispatch swarm"
				})]
			}),
			steps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-display text-2xl tracking-tight",
				children: "Run"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwarmTimeline, {
				steps,
				visible
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-6 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl tracking-tight",
							children: "Evidence locker"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-2",
							children: evidence.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-border bg-surface px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm",
										children: e.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: e.kind })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-mono text-[11px] text-subtle",
									children: shortHash(e.sha256, 10)
								})]
							}, e.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-4 space-y-3 rounded-xl border border-border bg-surface p-4",
							onSubmit: (e) => {
								e.preventDefault();
								addEvidence({ data: {
									caseId,
									name,
									kind,
									note
								} }).then(() => {
									setName("");
									setNote("");
									toast.success("Artifact hashed into locker");
									return refresh();
								}).catch((err) => toast.error(err.message));
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-medium",
									children: "Ingest artifact"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Name",
									value: name,
									onChange: (ev) => setName(ev.target.value),
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Kind (auth_log, file_event, net…)",
									value: kind,
									onChange: (ev) => setKind(ev.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									placeholder: "Note / payload",
									value: note,
									onChange: (ev) => setNote(ev.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									variant: "outline",
									size: "sm",
									children: "Hash and store"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Audit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2",
						children: audits.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg border border-border bg-elevated px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-xs",
								children: a.action
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-mono text-[10px] text-subtle",
								children: [
									shortHash(a.event_hash),
									" · ",
									formatWhen(a.created_at)
								]
							})]
						}, a.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Findings"
					}),
					findings.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Dispatch the swarm to adjudicate this locker."
					}),
					findings.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FindingCard, {
						finding: f,
						createdAt: formatWhen(f.created_at)
					}, f.id))
				]
			})
		]
	}) });
}
//#endregion
export { CasePage as component };
