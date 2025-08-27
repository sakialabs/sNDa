import pytest
from model_bakery import baker
from api.models import Person

pytestmark = pytest.mark.api


def test_people_list_requires_auth(api_client):
    url = "/api/people/"
    resp = api_client.get(url)
    assert resp.status_code in (401, 403)


def test_people_list_authed(auth_client, baker_make):
    baker_make(Person, _quantity=2)
    url = "/api/people/"
    resp = auth_client.get(url)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_people_create_authed(auth_client):
    payload = {"first_name": "Jane", "last_name": "Doe", "gender": "F"}
    url = "/api/people/"
    resp = auth_client.post(url, payload)
    assert resp.status_code == 201
    assert resp.json()["first_name"] == "Jane"
