import { S as require_jsx_runtime, b as Navigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GROK_PROVIDERS } from "./server-1xWT149U.mjs";
import { r as signIn } from "./client-sGid3STf.mjs";
import { o as useCurrentUserState, t as ClassificationBar } from "./utils-Fk7ydq6X.mjs";
import { t as Button } from "./button-BTy3-nAK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CHfCW-4M.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	if (!isPending && user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/ops" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClassificationBar, { label: "CUI // ACCESS CONTROL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "grid flex-1 place-items-center px-6 py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md rounded-xl border border-border bg-surface p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[0.22em] text-subtle",
						children: "SwarmKillChain"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-3xl tracking-tight",
						children: "Request access"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Cases, evidence, and audit chains are scoped to your operator identity. Sign in to dispatch the swarm."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 space-y-3",
						children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							className: "w-full",
							onClick: () => void signIn(p.providerId, { callbackURL: "/ops" }),
							children: ["Continue with ", p.label]
						}, p.providerId))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-center text-xs text-subtle",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "underline-offset-4 hover:underline",
							children: "Return to briefing"
						})
					})
				]
			})
		})]
	});
}
//#endregion
export { Login as component };
