"""Append-only evidence locker and hash-chained audit log.

Evidence is content-addressed (sha256) and stored once; the audit log is a
hash chain over canonical JSON so any prior entry's tampering breaks every
hash after it. Nothing in this module supports UPDATE or DELETE — both the
locker and the audit trail are write-once by construction.
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

GENESIS_HASH = "0" * 64


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _canonical_json(obj: Any) -> bytes:
    return json.dumps(obj, sort_keys=True, separators=(",", ":")).encode("utf-8")


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


@dataclass(frozen=True)
class EvidenceItem:
    sha256: str
    stored_at: str
    size_bytes: int
    path: str


@dataclass(frozen=True)
class AuditEvent:
    prev_hash: str
    event: dict[str, Any]
    event_hash: str
    ts: str


class EvidenceLocker:
    """Content-addressed, write-once evidence store rooted at `root`."""

    def __init__(self, root: Path) -> None:
        self.root = root
        self.root.mkdir(parents=True, exist_ok=True)

    def ingest(self, payload: bytes) -> EvidenceItem:
        digest = sha256_bytes(payload)
        dest = self.root / f"{digest}.bin"
        if not dest.exists():
            dest.write_bytes(payload)
        return EvidenceItem(
            sha256=digest,
            stored_at=_utc_now_iso(),
            size_bytes=len(payload),
            path=str(dest),
        )

    def exists(self, digest: str) -> bool:
        return (self.root / f"{digest}.bin").exists()

    def read(self, digest: str) -> bytes:
        path = self.root / f"{digest}.bin"
        if not path.exists():
            raise FileNotFoundError(f"evidence {digest} not in locker")
        return path.read_bytes()

    def list_hashes(self) -> list[str]:
        return sorted(p.stem for p in self.root.glob("*.bin"))


@dataclass
class AuditChain:
    """Append-only, hash-chained audit log persisted as JSONL.

    Each event's hash covers the previous event's hash plus the canonical
    JSON of the event body, so the chain is tamper-evident: recomputing hashes
    from genesis must reproduce every stored event_hash exactly.
    """

    path: Path
    _events: list[AuditEvent] = field(default_factory=list, init=False, repr=False)

    def __post_init__(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        if self.path.exists():
            for line in self.path.read_text(encoding="utf-8").splitlines():
                if not line.strip():
                    continue
                raw = json.loads(line)
                self._events.append(
                    AuditEvent(
                        prev_hash=raw["prev_hash"],
                        event=raw["event"],
                        event_hash=raw["event_hash"],
                        ts=raw["ts"],
                    )
                )

    @property
    def head_hash(self) -> str:
        return self._events[-1].event_hash if self._events else GENESIS_HASH

    def append(self, event: dict[str, Any]) -> AuditEvent:
        prev_hash = self.head_hash
        digest = sha256_bytes(prev_hash.encode("utf-8") + _canonical_json(event))
        record = AuditEvent(prev_hash=prev_hash, event=event, event_hash=digest, ts=_utc_now_iso())
        self._events.append(record)
        with self.path.open("a", encoding="utf-8") as handle:
            handle.write(
                json.dumps(
                    {
                        "prev_hash": record.prev_hash,
                        "event": record.event,
                        "event_hash": record.event_hash,
                        "ts": record.ts,
                    },
                    sort_keys=True,
                )
                + "\n"
            )
        return record

    def events(self) -> list[AuditEvent]:
        return list(self._events)

    def verify(self) -> bool:
        """Recompute the chain from genesis; True only if every hash matches."""
        prev_hash = GENESIS_HASH
        for record in self._events:
            if record.prev_hash != prev_hash:
                return False
            expected = sha256_bytes(prev_hash.encode("utf-8") + _canonical_json(record.event))
            if expected != record.event_hash:
                return False
            prev_hash = record.event_hash
        return True
