import pytest

pytestmark = pytest.mark.api


@pytest.mark.django_db
def test_community_stats_public(api_client):
    resp = api_client.get("/api/community/stats/")
    assert resp.status_code == 200
    data = resp.json()
    # basic shape
    for key in [
        "total_cases_resolved",
        "total_volunteers",
        "total_stories",
        "active_goals",
        "top_volunteers",
        "recent_achievements",
    ]:
        assert key in data
