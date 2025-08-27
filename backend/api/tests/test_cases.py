import pytest
from django.urls import reverse
from model_bakery import baker
from api.models import Case, Person

pytestmark = pytest.mark.api


def test_cases_list_public(api_client, baker_make):
    baker_make(Case, primary_subject=baker_make(Person), _quantity=3)
    url = "/api/cases/"
    resp = api_client.get(url)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_cases_create_requires_auth(api_client, baker_make):
    person = baker_make(Person)
    payload = {
        "title": "New Case",
        "description": "Some desc",
        "status": "NEW",
        "primary_subject_id": str(person.id),
    }
    url = "/api/cases/"
    resp = api_client.post(url, payload)
    assert resp.status_code in (401, 403)


def test_cases_create_authenticated(auth_client, baker_make):
    person = baker_make(Person)
    payload = {
        "title": "Auth Case",
        "description": "Auth desc",
        "status": "NEW",
        "primary_subject_id": str(person.id),
    }
    url = "/api/cases/"
    resp = auth_client.post(url, payload, format="json")
    assert resp.status_code == 201, resp.content
    data = resp.json()
    assert data["title"] == "Auth Case"
    assert data["primary_subject"]["id"] == str(person.id)


def test_cases_retrieve(api_client, baker_make):
    case = baker_make(Case, primary_subject=baker_make(Person))
    url = f"/api/cases/{case.id}/"
    resp = api_client.get(url)
    assert resp.status_code == 200
    assert resp.json()["id"] == str(case.id)
