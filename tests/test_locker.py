import json

import pytest

from sans_swarm.locker import GENESIS_HASH, AuditChain, EvidenceLocker, sha256_bytes


def test_ingest_is_content_addressed(tmp_path):
    locker = EvidenceLocker(tmp_path / "evidence")
    item = locker.ingest(b"hello world")
    assert item.sha256 == sha256_bytes(b"hello world")
    assert locker.exists(item.sha256)
    assert locker.read(item.sha256) == b"hello world"


def test_ingest_same_payload_twice_is_idempotent(tmp_path):
    locker = EvidenceLocker(tmp_path / "evidence")
    first = locker.ingest(b"same bytes")
    second = locker.ingest(b"same bytes")
    assert first.sha256 == second.sha256
    assert locker.list_hashes() == [first.sha256]


def test_read_missing_evidence_raises(tmp_path):
    locker = EvidenceLocker(tmp_path / "evidence")
    with pytest.raises(FileNotFoundError):
        locker.read("0" * 64)


def test_empty_locker_lists_nothing(tmp_path):
    locker = EvidenceLocker(tmp_path / "evidence")
    assert locker.list_hashes() == []


def test_first_audit_event_chains_from_genesis(tmp_path):
    chain = AuditChain(tmp_path / "audit.jsonl")
    assert chain.head_hash == GENESIS_HASH
    record = chain.append({"kind": "test", "n": 1})
    assert record.prev_hash == GENESIS_HASH
    assert chain.head_hash == record.event_hash
    assert chain.verify() is True


def test_audit_chain_links_sequential_events(tmp_path):
    chain = AuditChain(tmp_path / "audit.jsonl")
    first = chain.append({"n": 1})
    second = chain.append({"n": 2})
    assert second.prev_hash == first.event_hash
    assert chain.verify() is True


def test_audit_chain_reloads_from_disk(tmp_path):
    path = tmp_path / "audit.jsonl"
    chain = AuditChain(path)
    chain.append({"n": 1})
    chain.append({"n": 2})

    reloaded = AuditChain(path)
    assert len(reloaded.events()) == 2
    assert reloaded.head_hash == chain.head_hash
    assert reloaded.verify() is True


def test_tampered_event_breaks_chain_verification(tmp_path):
    path = tmp_path / "audit.jsonl"
    chain = AuditChain(path)
    chain.append({"n": 1})
    chain.append({"n": 2})

    lines = path.read_text(encoding="utf-8").splitlines()
    tampered = json.loads(lines[0])
    tampered["event"]["n"] = 999
    lines[0] = json.dumps(tampered, sort_keys=True)
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    reloaded = AuditChain(path)
    assert reloaded.verify() is False


def test_editing_a_stored_line_in_place_is_caught_by_verify(tmp_path):
    """The only write path is append() in mode 'a'. If something other than
    this module edits a line directly on disk (bypassing the chain), verify()
    must catch it — that's the actual no-UPDATE guarantee, not just an absent
    update() method name."""
    path = tmp_path / "audit.jsonl"
    chain = AuditChain(path)
    chain.append({"tool": "correlate_auth_file", "n": 1})
    chain.append({"tool": "correlate_auth_file", "n": 2})

    lines = path.read_text(encoding="utf-8").splitlines()
    edited = json.loads(lines[0])
    edited["event"]["n"] = 999  # simulate an out-of-band UPDATE
    lines[0] = json.dumps(edited, sort_keys=True)
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    assert AuditChain(path).verify() is False


def test_deleting_a_stored_line_is_caught_by_verify(tmp_path):
    path = tmp_path / "audit.jsonl"
    chain = AuditChain(path)
    chain.append({"n": 1})
    chain.append({"n": 2})
    chain.append({"n": 3})

    lines = path.read_text(encoding="utf-8").splitlines()
    del lines[1]  # simulate an out-of-band DELETE of the middle row
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    assert AuditChain(path).verify() is False
