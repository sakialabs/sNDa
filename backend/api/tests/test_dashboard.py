import pytest

pytestmark = pytest.mark.api


def test_dashboard_requires_auth(api_client):
    resp = api_client.get("/api/dashboard/")
    assert resp.status_code in (401, 403)


def test_dashboard_authed_shape(auth_client):
    resp = auth_client.get("/api/dashboard/")
    assert resp.status_code == 200
    data = resp.json()
    for key in [
        "cases_completed",
        "current_streak",
        "longest_streak",
        "total_points",
        "recent_badges",
        "active_assignments",
        "recent_activities",
        "community_rank",
        "stories_published",
    ]:
        assert key in data
