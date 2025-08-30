from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CaseViewSet, PersonViewSet, VolunteerViewSet, ReferralMediaViewSet, IntakeView,
    BadgeViewSet, UserBadgeViewSet, CommunityGoalViewSet, VolunteerStoryViewSet,
    PublicStoriesView, VolunteerDashboardView, CommunityStatsView,
    BobaRecommendationsView, BobaNotificationsView
)
from .oauth_views import (
    oauth_config, google_oauth_callback, facebook_oauth_callback,
    social_login_success, email_verification_success, 
    disconnect_social_account, user_social_accounts
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
    
    # OAuth authentication endpoints
    path("auth/config/", oauth_config, name="oauth-config"),
    path("auth/google/callback/", google_oauth_callback, name="google-oauth-callback"),
    path("auth/facebook/callback/", facebook_oauth_callback, name="facebook-oauth-callback"),
    path("auth/social/success/", social_login_success, name="social-login-success"),
    path("auth/email-verification/success/", email_verification_success, name="email-verification-success"),
    path("auth/disconnect/", disconnect_social_account, name="disconnect-social-account"),
    path("auth/social-accounts/", user_social_accounts, name="user-social-accounts"),
    
    # Community & gamification endpoints
    path("public/stories/", PublicStoriesView.as_view(), name="public-stories"),
    path("dashboard/", VolunteerDashboardView.as_view(), name="volunteer-dashboard"),
    path("community/stats/", CommunityStatsView.as_view(), name="community-stats"),
    
    # Boba AI endpoints
    path("boba/recommendations/", BobaRecommendationsView.as_view(), name="boba-recommendations"),
    path("boba/notifications/", BobaNotificationsView.as_view(), name="boba-notifications"),
]
