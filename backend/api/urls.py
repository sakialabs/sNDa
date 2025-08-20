from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CaseViewSet, PersonViewSet, VolunteerViewSet

# Create a router and register our viewset with it.
router = DefaultRouter()
router.register(r"cases", CaseViewSet, basename="case")
router.register(r"people", PersonViewSet, basename="person")
router.register(r"volunteers", VolunteerViewSet, basename="volunteer")

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path("", include(router.urls)),
]
