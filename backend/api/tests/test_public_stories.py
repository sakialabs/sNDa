import pytest
from model_bakery import baker
from api.models import VolunteerStory, Case, Person

pytestmark = pytest.mark.api


def test_public_stories_filters_status_and_visibility(api_client, baker_make):
    case_public = baker_make(Case, primary_subject=baker_make(Person), is_public=True)
    case_private = baker_make(Case, primary_subject=baker_make(Person), is_public=False)

    # Should appear
    baker.make(VolunteerStory, status="PUBLISHED", related_case=case_public)
    # Wrong status
    baker.make(VolunteerStory, status="DRAFT", related_case=case_public)
    # Private case
    baker.make(VolunteerStory, status="PUBLISHED", related_case=case_private)

    resp = api_client.get("/api/public/stories/")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
