import pytest
from model_bakery import baker
from api.models import VolunteerStory, Case, Person

pytestmark = pytest.mark.api


def test_stories_list_authed_shows_own(auth_client):
    resp = auth_client.get("/api/stories/")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_stories_create_auth(auth_client, baker_make):
    case = baker_make(Case, primary_subject=baker_make(Person))
    payload = {
        "title": "My Story",
        "content": "content",
        "related_case": str(case.id),
        "story_type": "EXPERIENCE",
        "status": "DRAFT",
        "tags": ["help", "impact"],
    }
    resp = auth_client.post("/api/stories/", payload, format="json")
    assert resp.status_code == 201, resp.content
    data = resp.json()
    assert data["title"] == "My Story"
    assert data["related_case"] == str(case.id)
