"""Provider discovery without making model calls or reading credentials."""

from __future__ import annotations

import argparse
import shutil
import sys
import tomllib
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Provider:
    name: str
    kind: str
    command: str
    args: tuple[str, ...]
    role: str
    enabled: bool = True


def load_providers(path: Path) -> list[Provider]:
    """Load provider metadata from a local TOML file."""
    with path.open("rb") as handle:
        data = tomllib.load(handle)
    providers = []
    for name, raw in data.get("providers", {}).items():
        providers.append(
            Provider(
                name=name,
                kind=str(raw.get("kind", "command")),
                command=str(raw["command"]),
                args=tuple(str(arg) for arg in raw.get("args", [])),
                role=str(raw.get("role", "unspecified")),
                enabled=bool(raw.get("enabled", True)),
            )
        )
    return providers


def discover(provider: Provider) -> str | None:
    """Return the resolved executable path, or None when unavailable."""
    if not provider.enabled:
        return None
    return shutil.which(provider.command)


def health_report(providers: list[Provider]) -> list[dict[str, str | bool]]:
    return [
        {
            "provider": provider.name,
            "role": provider.role,
            "enabled": provider.enabled,
            "available": discover(provider) is not None,
            "command": discover(provider) or provider.command,
        }
        for provider in providers
    ]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["health"])
    parser.add_argument(
        "--config",
        type=Path,
        default=Path(__file__).parents[2] / "config" / "providers.toml",
    )
    args = parser.parse_args(argv)
    reports = health_report(load_providers(args.config))
    for report in reports:
        state = "available" if report["available"] else "unavailable"
        print(f"{report['provider']}: {state} ({report['command']}) role={report['role']}")
    return 0 if all(report["available"] for report in reports if report["enabled"]) else 2


if __name__ == "__main__":
    sys.exit(main())

