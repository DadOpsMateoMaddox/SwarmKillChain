import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as formatWhen } from "./utils-Fk7ydq6X.mjs";
import { n as Badge, t as AppShell } from "./badge-BG0iyrua.mjs";
import { r as createCase, s as loadWorkspace } from "./ops-DEpmkez_.mjs";
import { t as Button } from "./button-BTy3-nAK.mjs";
import { n as Textarea, t as Input } from "./input-De8DqIyv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cases-DwthiTLu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CasesPage() {
	const [cases, setCases] = (0, import_react.useState)([]);
	const [title, setTitle] = (0, import_react.useState)("");
	const [summary, setSummary] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const refresh = () => loadWorkspace().then((w) => setCases(w.cases)).catch((e) => toast.error(e.message));
	(0, import_react.useEffect)(() => {
		refresh();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl space-y-8 px-5 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.22em] text-subtle",
				children: "Locker"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl tracking-tight",
				children: "Cases"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "rounded-xl border border-border bg-surface p-5",
				onSubmit: (e) => {
					e.preventDefault();
					setBusy(true);
					createCase({ data: {
						title,
						summary
					} }).then(() => {
						setTitle("");
						setSummary("");
						toast.success("Case opened");
						return refresh();
					}).catch((err) => toast.error(err.message)).finally(() => setBusy(false));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Open a case"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-3 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Title",
							value: title,
							onChange: (e) => setTitle(e.target.value),
							required: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							placeholder: "What is in scope — and what is not.",
							value: summary,
							onChange: (e) => setSummary(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						disabled: busy,
						type: "submit",
						children: busy ? "Opening…" : "Create case"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3 md:grid-cols-2",
				children: cases.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/cases/$caseId",
					params: { caseId: c.id },
					className: "block h-full rounded-xl border border-border bg-surface p-5 hover:bg-elevated",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-2xl tracking-tight",
								children: c.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: c.classification })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 line-clamp-3 text-sm text-muted",
							children: c.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 font-mono text-[11px] text-subtle",
							children: formatWhen(c.created_at)
						})
					]
				}) }, c.id))
			})
		]
	}) });
}
//#endregion
export { CasesPage as component };
