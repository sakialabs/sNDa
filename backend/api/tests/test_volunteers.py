import pytest

pytestmark = pytest.mark.api


def test_volunteers_requires_auth(api_client):
    resp = api_client.get("/api/volunteers/")
    assert resp.status_code in (401, 403)


def test_my_profile(auth_client):
    resp = auth_client.get("/api/volunteers/my_profile/")
    assert resp.status_code == 200
    data = resp.json()
    assert "user" in data


def test_leaderboard(auth_client):
    resp = auth_client.get("/api/volunteers/leaderboard/")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
