import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

pytestmark = pytest.mark.api


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create_user(
        username="testuser", 
        email="test@example.com", 
        password="testpass123"
    )


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


def test_users_me_requires_auth(api_client):
    """Test that /api/users/me/ requires authentication"""
    resp = api_client.get("/api/users/me/")
    assert resp.status_code in (401, 403)


def test_users_me_authenticated(auth_client, user):
    """Test that authenticated user can access their profile"""
    resp = auth_client.get("/api/users/me/")
    assert resp.status_code == 200
    data = resp.json()
    
    # Verify expected fields are present
    expected_fields = ["id", "username", "email", "first_name", "last_name"]
    for field in expected_fields:
        assert field in data
    
    # Verify the data matches the user
    assert data["id"] == user.id
    assert data["username"] == user.username
    assert data["email"] == user.email