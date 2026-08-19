"""Provider discovery via the LiteLLM gateway.

Health checks send a real 1-token completion request per seat. LiteLLM is a
token pipe only — this module never grants tool, write, or state authority
to a provider. If the gateway is unreachable, every seat reports unavailable;
nothing here silently falls back to a different provider or model.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import tomllib
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path

DEFAULT_BASE_URL = "http://localhost:4000"
HEALTH_CHECK_TIMEOUT_SECONDS = 10


@dataclass(frozen=True)
class Seat:
    role: str
    model: str
    enabled: bool = True


def load_seats(path: Path) -> list[Seat]:
    """Load seat metadata (role -> model_name) from a local TOML file."""
    with path.open("rb") as handle:
        data = tomllib.load(handle)
    seats = []
    for role, raw in data.get("seats", {}).items():
        seats.append(
            Seat(
                role=role,
                model=str(raw["model"]),
                enabled=bool(raw.get("enabled", True)),
            )
        )
    return seats


def _gateway_config() -> tuple[str, str | None]:
    base_url = os.environ.get("LITELLM_BASE_URL", DEFAULT_BASE_URL).rstrip("/")
    api_key = os.environ.get("LITELLM_API_KEY") or None
    return base_url, api_key


def ping(seat: Seat, base_url: str, api_key: str | None) -> tuple[bool, str]:
    """Send a 1-token completion request. Returns (available, detail)."""
    if not seat.enabled:
        return False, "disabled"

    payload = json.dumps(
        {
            "model": seat.model,
            "messages": [{"role": "user", "content": "ping"}],
            "max_tokens": 1,
        }
    ).encode("utf-8")

    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    request = urllib.request.Request(
        f"{base_url}/chat/completions", data=payload, headers=headers, method="POST"
    )
    try:
        with urllib.request.urlopen(request, timeout=HEALTH_CHECK_TIMEOUT_SECONDS) as resp:
            if resp.status == 200:
                return True, "ok"
            return False, f"http {resp.status}"
    except urllib.error.HTTPError as exc:
        return False, f"http {exc.code}"
    except (urllib.error.URLError, TimeoutError, ConnectionError) as exc:
        return False, f"unreachable ({exc.reason if hasattr(exc, 'reason') else exc})"


def health_report(seats: list[Seat]) -> list[dict[str, str | bool]]:
    base_url, api_key = _gateway_config()
    reports = []
    for seat in seats:
        available, detail = ping(seat, base_url, api_key)
        reports.append(
            {
                "role": seat.role,
                "model": seat.model,
                "enabled": seat.enabled,
                "available": available,
                "detail": detail,
            }
        )
    return reports


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["health"])
    parser.add_argument(
        "--config",
        type=Path,
        default=Path(__file__).parents[2] / "config" / "providers.toml",
    )
    args = parser.parse_args(argv)
    reports = health_report(load_seats(args.config))
    for report in reports:
        state = "available" if report["available"] else "unavailable"
        print(f"{report['role']}: {state} ({report['model']}) — {report['detail']}")
    return 0 if all(r["available"] for r in reports if r["enabled"]) else 2


if __name__ == "__main__":
    sys.exit(main())
