import { i as createServerFn, o as getServerFnById, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DdKwCnVL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ops-DEpmkez_.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var loadWorkspace = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("02ee2a7257e03290d04a9f4cd895d2734de26148db37d1170aa472f82ca2aa54"));
var loadCase = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("7d913717709f9e82d2314958a826542e43dbfb6ceb8d5c0b1450c1e320e8f2dd"));
var createCase = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	title: input.title.trim().slice(0, 120),
	summary: input.summary.trim().slice(0, 800)
})).handler(createSsrRpc("5174c3986578819c0fb5c15a08041ef0dae703f70fe9effe8a4ac78b04095cd9"));
var addEvidence = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("6d3a07c3e21485a2067f241cb7c5f786462a705c99259e30810144a687e7698d"));
var dispatchInvestigate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((caseId) => caseId).handler(createSsrRpc("def6a5d935214b59d9fe0868b0dd8415ed4ac6805f801e102c3c29eebdea156e"));
var dispatchDisrupt = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ceb56b0651a0eda36ef2b015d3ed72664a9596e467dac27031b3ec90251e775e"));
var briefFinding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("23aa098b570397bf309442202ebdeb1ef5ce54353031954578fad9e0ce229605"));
//#endregion
export { dispatchInvestigate as a, dispatchDisrupt as i, briefFinding as n, loadCase as o, createCase as r, loadWorkspace as s, addEvidence as t };
