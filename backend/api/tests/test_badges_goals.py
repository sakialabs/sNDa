import pytest
from model_bakery import baker
from api.models import Badge, UserBadge, CommunityGoal

pytestmark = pytest.mark.api


def test_badges_requires_auth(api_client):
    resp = api_client.get("/api/badges/")
    assert resp.status_code in (401, 403)


def test_badges_list_auth(auth_client):
    baker.make(Badge, is_active=True, _quantity=2)
    resp = auth_client.get("/api/badges/")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_user_badges_auth(auth_client, user):
    b = baker.make(Badge, is_active=True)
    baker.make(UserBadge, user=user, badge=b)
    resp = auth_client.get("/api/user-badges/")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 1


def test_community_goals_public(api_client):
    baker.make(CommunityGoal, is_active=True, _quantity=2)
    resp = api_client.get("/api/community-goals/")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
