import pytest

pytestmark = pytest.mark.api


def test_boba_recommendations_requires_auth(api_client):
    resp = api_client.get("/api/boba/recommendations/")
    assert resp.status_code in (401, 403)


def test_boba_notifications_requires_auth(api_client):
    resp = api_client.get("/api/boba/notifications/")
    assert resp.status_code in (401, 403)


def test_boba_recommendations_authed(auth_client):
    resp = auth_client.get("/api/boba/recommendations/")
    assert resp.status_code == 200
    data = resp.json()
    assert "greeting" in data and "recommendations" in data


def test_boba_notifications_authed(auth_client):
    resp = auth_client.get("/api/boba/notifications/")
    assert resp.status_code == 200
    data = resp.json()
    assert "notifications" in data and "count" in data
