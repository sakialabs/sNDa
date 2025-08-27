import io
import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from model_bakery import baker
from api.models import Case, Person, ReferralMedia

pytestmark = pytest.mark.api


def test_media_public_filters_consent(api_client, baker_make):
    case = baker_make(Case, primary_subject=baker_make(Person))
    # one consented, one not
    baker.make(ReferralMedia, case=case, consent_given=True)
    baker.make(ReferralMedia, case=case, consent_given=False)
    resp = api_client.get(f"/api/media/?case={case.id}")
    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_media_upload_requires_auth(api_client, baker_make):
    case = baker_make(Case, primary_subject=baker_make(Person))
    file = SimpleUploadedFile("test.txt", b"hello", content_type="text/plain")
    payload = {"case": str(case.id), "file": file, "consent_given": True}
    resp = api_client.post("/api/media/", payload, format="multipart")
    assert resp.status_code in (401, 403)


def test_media_upload_authed(auth_client, user, baker_make):
    case = baker_make(Case, primary_subject=baker_make(Person))
    file = SimpleUploadedFile("test.txt", b"hello", content_type="text/plain")
    payload = {"case": str(case.id), "file": file, "consent_given": True}
    resp = auth_client.post("/api/media/", payload, format="multipart")
    assert resp.status_code == 201, resp.content
    data = resp.json()
    assert data["uploaded_by"]["id"] == user.id
