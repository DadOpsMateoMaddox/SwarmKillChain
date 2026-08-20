import urllib.error
from pathlib import Path

from sans_swarm.providers import Seat, health_report, load_seats, ping


def test_loads_three_seats():
    path = Path(__file__).parents[1] / "config" / "providers.toml"
    seats = load_seats(path)
    assert {seat.role for seat in seats} == {"investigator", "skeptic", "adjudicator"}


def test_disabled_seat_never_pings(monkeypatch):
    called = False

    def _fail_if_called(*args, **kwargs):
        nonlocal called
        called = True
        raise AssertionError("disabled seat must not send a request")

    monkeypatch.setattr("sans_swarm.providers.urllib.request.urlopen", _fail_if_called)
    seat = Seat("adjudicator", "adjudicator", enabled=False)
    available, detail = ping(seat, "http://localhost:4000", None)
    assert available is False
    assert detail == "disabled"
    assert called is False


def test_unreachable_gateway_reports_unavailable_no_fallback(monkeypatch):
    def _raise_unreachable(*args, **kwargs):
        raise urllib.error.URLError("connection refused")

    monkeypatch.setattr("sans_swarm.providers.urllib.request.urlopen", _raise_unreachable)
    seat = Seat("skeptic", "skeptic")
    available, detail = ping(seat, "http://localhost:4000", None)
    assert available is False
    assert "unreachable" in detail


def test_health_report_preserves_seat_identity(monkeypatch):
    def _fake_ping(seat, base_url, api_key):
        return (seat.role == "investigator"), "stub"

    monkeypatch.setattr("sans_swarm.providers.ping", _fake_ping)
    reports = health_report(
        [
            Seat("investigator", "investigator"),
            Seat("adjudicator", "adjudicator"),
        ]
    )
    assert reports[0]["available"] is True
    assert reports[1]["available"] is False
    assert reports[1]["role"] == "adjudicator"
