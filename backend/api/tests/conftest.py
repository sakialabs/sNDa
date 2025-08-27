import os
import tempfile
import pytest
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from model_bakery import baker

User = get_user_model()

@pytest.fixture(scope="session")
def django_db_setup(django_db_blocker):
    """Ensure test DB is ready; override media root to a temp dir for the session."""
    with django_db_blocker.unblock():
        # Use sqlite for tests to avoid external DB dependency
        settings.DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": ":memory:",
            }
        }
        tmp_media = tempfile.mkdtemp(prefix="test_media_")
        settings.MEDIA_ROOT = tmp_media
        settings.DEFAULT_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"
        # Make DRF auth simple in tests
        settings.REST_FRAMEWORK.setdefault("TEST_REQUEST_DEFAULT_FORMAT", "json")

@pytest.fixture()
def api_client():
    return APIClient()

@pytest.fixture()
def user(db):
    return User.objects.create_user(username="user", email="user@example.com", password="pass1234")

@pytest.fixture()
def volunteer(db):
    u = User.objects.create_user(username="vol", email="vol@example.com", password="pass1234", is_volunteer=True)
    # ensure VolunteerProfile exists where needed
    return u

@pytest.fixture()
def coordinator(db):
    return User.objects.create_user(username="coord", email="coord@example.com", password="pass1234", is_coordinator=True)

@pytest.fixture()
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client

@pytest.fixture()
def auth_client_vol(api_client, volunteer):
    api_client.force_authenticate(user=volunteer)
    return api_client

@pytest.fixture()
def auth_client_coord(api_client, coordinator):
    api_client.force_authenticate(user=coordinator)
    return api_client

@pytest.fixture()
def baker_make(db):
    """Expose model_bakery baker.make with sensible defaults for our models."""
    def _make(model, **kwargs):
        # Provide minimal required fields when not given
        if model.__name__ == "Person":
            kwargs.setdefault("first_name", "John")
            kwargs.setdefault("last_name", "Doe")
        if model.__name__ == "Case":
            kwargs.setdefault("title", "Test Case")
            kwargs.setdefault("description", "Test description")
            kwargs.setdefault("primary_subject", baker.make("api.Person"))
        if model.__name__ == "VolunteerProfile":
            # Ensure user exists
            u = kwargs.pop("user", None) or baker.make(User)
            kwargs.setdefault("user", u)
        return baker.make(model, **kwargs)
    return _make
