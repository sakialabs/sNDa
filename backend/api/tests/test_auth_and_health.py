import pytest

pytestmark = pytest.mark.api


def test_health(api_client):
    resp = api_client.get("/api/health/")
    assert resp.status_code == 200
    data = resp.json()
    assert data.get("status") == "healthy"
    assert "service" in data
    assert "database" in data


def test_jwt_token_obtain(api_client, user):
    payload = {"username": "user", "password": "pass1234"}
    resp = api_client.post("/api/token/", payload)
    assert resp.status_code == 200, resp.content
    data = resp.json()
    assert "access" in data and "refresh" in data
