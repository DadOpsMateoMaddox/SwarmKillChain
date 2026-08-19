import { S as require_jsx_runtime, f as useRouterState, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as FileSearch, c as Activity, i as LayoutGrid, n as Shield, o as Crosshair, r as ScrollText } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn, o as useCurrentUserState, t as ClassificationBar } from "./utils-Fk7ydq6X.mjs";
import { i as UserButton, t as RedirectToSignIn } from "./gates-DA9fmBUX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-BG0iyrua.js
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/ops",
		label: "Command",
		icon: LayoutGrid
	},
	{
		to: "/cases",
		label: "Cases",
		icon: FileSearch
	},
	{
		to: "/disruptor",
		label: "Disruptor",
		icon: Crosshair
	},
	{
		to: "/intel",
		label: "Intel",
		icon: Shield
	},
	{
		to: "/audit",
		label: "Audit",
		icon: ScrollText
	}
];
function AppShell({ children }) {
	const { user, isPending } = useCurrentUserState();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClassificationBar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid flex-1 place-items-center text-sm text-muted",
			children: "Resolving session"
		})]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClassificationBar, { label: "CUI // SWARMKILLCHAIN // OPERATOR" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "hidden w-56 shrink-0 flex-col border-r border-border bg-surface md:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/ops",
							className: "flex items-center gap-2 px-5 py-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg tracking-tight",
								children: "SwarmKillChain"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "flex flex-1 flex-col gap-1 px-3",
							children: NAV.map((item) => {
								const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150", active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated hover:text-fg"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
								}, item.to);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t border-border p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-1 flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex h-14 items-center justify-between border-b border-border px-4 md:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-base",
							children: "SwarmKillChain"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "min-h-0 flex-1 overflow-auto pb-20 md:pb-0",
						children
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-border bg-surface md:hidden",
				children: NAV.map((item) => {
					const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: cn("flex h-16 flex-col items-center justify-center gap-1 text-[10px] uppercase tracking-[0.12em]", active ? "text-fg" : "text-subtle"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
					}, item.to);
				})
			})
		]
	});
}
var badgeVariants = cva("inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]", {
	variants: { tone: {
		default: "bg-elevated text-muted",
		ok: "bg-ok/15 text-ok",
		warn: "bg-warn/15 text-warn",
		danger: "bg-danger/15 text-danger",
		info: "bg-info/15 text-info"
	} },
	defaultVariants: { tone: "default" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({
			tone,
			className
		})),
		...props
	});
}
function statusTone(status) {
	if (status === "supported" || status === "contained" || status === "complete" || status === "open") return "ok";
	if (status === "partially_supported" || status === "partial" || status === "uncertain") return "warn";
	if (status === "disputed" || status === "unsupported" || status === "breach") return "danger";
	return "default";
}
//#endregion
export { Badge as n, statusTone as r, AppShell as t };
