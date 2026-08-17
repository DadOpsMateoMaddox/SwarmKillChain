# SANS Swarm

An isolated, deterministic-first DFIR swarm built from patterns found in the
attached SANS FIND EVIL projects. The swarm separates model roles from the
forensic execution boundary:

```text
case evidence -> typed read-only tools -> audit chain -> independent agents
                                                |-> investigator
                                                |-> skeptic
                                                |-> alternative narrative
                                                `-> report gate
```

Models may plan, select, correlate, challenge, and summarize. They do not get
an arbitrary shell, evidence write access, or an unverified finding channel.

## Initial reuse decisions

See [docs/REUSE_MATRIX.md](docs/REUSE_MATRIX.md) and
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). The five source archives remain
outside this repository. No case data or generated reports are copied here.

## Provider status

Claude and GPT/Codex are represented by configurable adapters. Gwen is also a
configurable adapter, but its executable or endpoint is not currently
discoverable on this machine. `python -m sans_swarm.providers health` reports
that state instead of silently routing to another model.

## Development

```powershell
cd D:\MasterVault\sans-swarm
python -m pytest
python -m sans_swarm.providers health
```

