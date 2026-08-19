import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as ClassificationBar } from "./utils-Fk7ydq6X.mjs";
import { n as SignedIn, r as SignedOut } from "./gates-DA9fmBUX.mjs";
import { t as Button } from "./button-BTy3-nAK.mjs";
import { n as CROSS_REVIEW } from "./catalog-BKDiF7J1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-nFhrF4SP.js
var import_jsx_runtime = require_jsx_runtime();
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClassificationBar, { label: "CONTROLLED UNCLASSIFIED // SWARMKILLCHAIN BRIEFING" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg tracking-tight",
						children: "SwarmKillChain"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							children: "Sign in"
						})
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/ops",
							children: "Open console"
						})
					}) })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-6 pb-20 pt-10 md:pt-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] uppercase tracking-[0.22em] text-subtle",
						children: "Read-only · Self-verifying · Consensus is not evidence"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-5 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight md:text-6xl",
						children: "Detect when a swarm’s reasoning, tools, and effects diverge."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-2xl text-base text-muted md:text-lg",
						children: "Three independent roles. Typed read-only tools. Hash-chained audit. Findings without a live tool-call and a matching locker digest stay UNCERTAIN — the swarm does not get to conclude."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/login",
									children: ["Enter the console ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
								})
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/ops",
									children: ["Enter the console ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
								})
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/intel",
									children: "Read the cross-review"
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-y border-border bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-6xl gap-px bg-border md:grid-cols-3",
					children: [
						{
							role: "Investigator",
							body: "Forms hypotheses and may only request typed read-only tools. Cannot authorize its own findings."
						},
						{
							role: "Skeptic",
							body: "Independently tries to refute every claim. A missing skeptic turn is treated as coordinator compromise."
						},
						{
							role: "Adjudicator",
							body: "Applies deterministic gates. Peer messages and majority votes are not sensors."
						}
					].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "bg-surface px-8 py-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl tracking-tight",
							children: c.role
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: c.body
						})]
					}, c.role))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-6 py-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] uppercase tracking-[0.22em] text-subtle",
						children: "Blind synthesis"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 max-w-3xl font-display text-3xl tracking-tight md:text-4xl",
						children: CROSS_REVIEW.headline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-8 grid gap-4 md:grid-cols-2",
						children: CROSS_REVIEW.agreements.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-lg border border-border bg-surface px-5 py-4 text-sm text-muted",
							children: a
						}, a))
					})
				]
			})
		]
	});
}
//#endregion
export { Landing as component };
