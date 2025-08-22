from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CaseViewSet, PersonViewSet, VolunteerViewSet, ReferralMediaViewSet, IntakeView,
    BadgeViewSet, UserBadgeViewSet, CommunityGoalViewSet, VolunteerStoryViewSet,
    PublicStoriesView, VolunteerDashboardView, CommunityStatsView,
    ChumaRecommendationsView, ChumaNotificationsView
)

# Create a router and register our viewset with it.
router = DefaultRouter()
router.register(r"cases", CaseViewSet, basename="case")
router.register(r"people", PersonViewSet, basename="person")
router.register(r"volunteers", VolunteerViewSet, basename="volunteer")
router.register(r"media", ReferralMediaViewSet, basename="media")

# Gamification endpoints
router.register(r"badges", BadgeViewSet, basename="badge")
router.register(r"user-badges", UserBadgeViewSet, basename="user-badge")
router.register(r"community-goals", CommunityGoalViewSet, basename="community-goal")
router.register(r"stories", VolunteerStoryViewSet, basename="story")

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path("", include(router.urls)),
    path("intake/", IntakeView.as_view(), name="intake"),
    
    # Community & gamification endpoints
    path("public/stories/", PublicStoriesView.as_view(), name="public-stories"),
    path("dashboard/", VolunteerDashboardView.as_view(), name="volunteer-dashboard"),
    path("community/stats/", CommunityStatsView.as_view(), name="community-stats"),
    
    # Chuma AI endpoints
    path("chuma/recommendations/", ChumaRecommendationsView.as_view(), name="chuma-recommendations"),
    path("chuma/notifications/", ChumaNotificationsView.as_view(), name="chuma-notifications"),
]
