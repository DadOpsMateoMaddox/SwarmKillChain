from pathlib import Path

from sans_swarm.providers import Provider, discover, health_report, load_providers


def test_loads_three_explicit_roles():
    path = Path(__file__).parents[1] / "config" / "providers.toml"
    providers = load_providers(path)
    assert {provider.name for provider in providers} == {"claude", "gpt", "gwen"}
    assert {provider.role for provider in providers} == {
        "investigator",
        "skeptic",
        "alternative_narrative",
    }


def test_discovery_does_not_fallback_to_another_provider(monkeypatch):
    monkeypatch.setattr("sans_swarm.providers.shutil.which", lambda command: None)
    provider = Provider("gwen", "command", "gwen", (), "alternative_narrative")
    assert discover(provider) is None


def test_health_report_preserves_provider_identity(monkeypatch):
    monkeypatch.setattr(
        "sans_swarm.providers.shutil.which",
        lambda command: f"/bin/{command}" if command == "claude" else None,
    )
    reports = health_report(
        [
            Provider("claude", "command", "claude", (), "investigator"),
            Provider("gwen", "command", "gwen", (), "alternative_narrative"),
        ]
    )
    assert reports[0]["available"] is True
    assert reports[1]["available"] is False
    assert reports[1]["provider"] == "gwen"

