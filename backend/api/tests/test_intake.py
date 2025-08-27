import pytest

pytestmark = pytest.mark.api


@pytest.mark.django_db
def test_intake_requires_consent(api_client):
    payload = {"child_name": "Ali", "location": "City", "description": "desc", "consent": False}
    resp = api_client.post("/api/intake/", payload)
    assert resp.status_code == 400, f"Expected 400 but got {resp.status_code}: {resp.content}"
    data = resp.json()
    assert "consent" in data.get("detail", "").lower()


@pytest.mark.django_db
def test_intake_creates_case(api_client):
    payload = {"child_name": "Ali Ahmed", "location": "City", "description": "desc", "consent": True}
    resp = api_client.post("/api/intake/", payload)
    assert resp.status_code == 201, resp.content
    data = resp.json()
    assert "id" in data
