# Reuse Matrix

| Source | Reuse | Decision | Reason |
|---|---|---|---|
| Protocol SIFT++ | EvidenceGuard, read-only MCP boundary, evidence pre/post hashing, hash-chained audit, Investigator/Skeptic correction loop | Adopt pattern | Strongest chain-of-custody and self-verification design |
| Mulder | Planner/Executor/Analyst phases, structural gates, typed evidence references, alternative narrative, model routing | Adopt pattern | Good orchestration and retry boundaries |
| TRUDI | Three-model directive exchange, capped self-correction, confidence and citation gates, `UNCERTAIN` outcome | Adopt pattern | Closest match to the requested swarm |
| FindEvil | Linux/container tool families, path validation, subprocess timeouts, structured outputs, coverage checks | Adapt selectively | Useful Linux scope, but tools stay behind our boundary |
| Camel | Code-mode, session caching, typed SDK/resources | Design reference only | .NET runtime is too large for the first Python swarm |
| three-models-in-a-trenchcoat | Independent model outputs and consensus reporting | Adopt reporting pattern | Already local and deterministic-first |

## Excluded from the initial repository

- Source-case evidence, memory images, logs, reports, and example artifacts.
- `.env` files, API keys, provider credentials, and local agent settings.
- Whole-repository copies of any source project.
- Live response or write-capable tools.
- Vendored `litellm`, Volatility, SIFT, or .NET runtime trees.

All source archives were inspected from `C:\Users\MyPC\Downloads` and copied
only to the temporary inspection directory `D:\tmp\sans-sources`.

