from django.shortcuts import render
from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import viewsets, parsers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from .models import (
    Case, Person, VolunteerProfile, ReferralMedia, Badge, UserBadge,
    CommunityGoal, ActivityLog, VolunteerStory, Assignment
)
from .boba_ai import boba
from .serializers import (
    CaseSerializer, PersonSerializer, VolunteerSerializer, ReferralMediaSerializer,
    BadgeSerializer, UserBadgeSerializer, CommunityGoalSerializer, ActivityLogSerializer,
    VolunteerStorySerializer, PublicStorySerializer, DashboardStatsSerializer
)
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly


class CaseViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows cases to be viewed or edited.
    """

    queryset = Case.objects.all().order_by("-created_at")
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class PersonViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows people to be viewed or edited.
    """

    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    permission_classes = [IsAuthenticated]


class VolunteerViewSet(viewsets.ModelViewSet):
    """
    API endpoint for volunteer profiles.
    """

    queryset = VolunteerProfile.objects.all()
    serializer_class = VolunteerSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        """Get current user's volunteer profile"""
        profile, created = VolunteerProfile.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def leaderboard(self, request):
        """Get volunteer leaderboard"""
        top_volunteers = VolunteerProfile.objects.filter(
            total_points__gt=0
        ).order_by('-total_points')[:20]
        
        serializer = self.get_serializer(top_volunteers, many=True)
        return Response(serializer.data)


class ReferralMediaViewSet(viewsets.ModelViewSet):
    queryset = ReferralMedia.objects.all().order_by("-uploaded_at")
    serializer_class = ReferralMediaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    def get_queryset(self):
        qs = super().get_queryset()
        case_id = self.request.query_params.get("case")
        if case_id:
            qs = qs.filter(case=case_id)
        # Only expose consented media publicly
        if not self.request.user.is_authenticated:
            qs = qs.filter(consent_given=True)
        return qs


class IntakeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Public intake endpoint: creates a Person and a Case with status NEW.
        Expected JSON body: { child_name, location, description, consent }
        """
        child_name = (request.data.get("child_name") or "").strip()
        location = (request.data.get("location") or "").strip()
        description = (request.data.get("description") or "").strip()
        consent = bool(request.data.get("consent"))

        if not consent:
            return Response({"detail": "Consent is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not child_name:
            return Response({"detail": "Child name is required."}, status=status.HTTP_400_BAD_REQUEST)
        # Split name into first/last heuristically
        parts = child_name.split()
        first_name = parts[0]
        last_name = " ".join(parts[1:]) if len(parts) > 1 else ""

        person = Person.objects.create(
            first_name=first_name,
            last_name=last_name,
            location_details=location,
        )

        title = f"Referral for {child_name}"
        case = Case.objects.create(
            title=title[:255],
            description=description,
            status="NEW",
            primary_subject=person,
        )

        return Response({"id": str(case.id)}, status=status.HTTP_201_CREATED)


class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing badges"""
    queryset = Badge.objects.filter(is_active=True)
    serializer_class = BadgeSerializer
    permission_classes = [IsAuthenticated]


class UserBadgeViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for user badges"""
    serializer_class = UserBadgeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user).order_by('-earned_at')


class CommunityGoalViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for community goals"""
    serializer_class = CommunityGoalSerializer
    permission_classes = [AllowAny]  # Public community goals
    
    def get_queryset(self):
        return CommunityGoal.objects.filter(is_active=True).order_by('-is_featured', '-created_at')


class VolunteerStoryViewSet(viewsets.ModelViewSet):
    """API endpoint for volunteer stories"""
    serializer_class = VolunteerStorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.action == 'list':
            # Show user's own stories
            return VolunteerStory.objects.filter(author=self.request.user).order_by('-created_at')
        return VolunteerStory.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PublicStoriesView(APIView):
    """Public Wall of Love endpoint"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        stories = VolunteerStory.objects.filter(
            status='PUBLISHED',
            related_case__is_public=True
        ).order_by('-published_at')[:20]
        
        serializer = PublicStorySerializer(stories, many=True)
        return Response(serializer.data)


class VolunteerDashboardView(APIView):
    """Enhanced volunteer dashboard with gamification stats"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        profile, created = VolunteerProfile.objects.get_or_create(user=user)
        
        # Get recent badges
        recent_badges = UserBadge.objects.filter(user=user).order_by('-earned_at')[:5]
        
        # Get active assignments
        active_assignments = Assignment.objects.filter(
            volunteer=user,
            status__in=['ACCEPTED', 'IN_PROGRESS']
        ).order_by('-created_at')[:5]
        
        # Get recent activities
        recent_activities = ActivityLog.objects.filter(user=user).order_by('-created_at')[:10]
        
        # Calculate community rank
        higher_ranked = VolunteerProfile.objects.filter(total_points__gt=profile.total_points).count()
        community_rank = higher_ranked + 1
        
        # Count published stories
        stories_published = VolunteerStory.objects.filter(
            author=user, 
            status='PUBLISHED'
        ).count()
        
        stats = {
            'cases_completed': profile.cases_completed,
            'current_streak': profile.current_streak,
            'longest_streak': profile.longest_streak,
            'total_points': profile.total_points,
            'recent_badges': [badge.badge for badge in recent_badges],
            'active_assignments': active_assignments.count(),
            'recent_activities': recent_activities,
            'community_rank': community_rank,
            'stories_published': stories_published,
            'impact_summary': {
                'total_cases': profile.cases_completed,
                'total_points': profile.total_points,
                'community_rank': community_rank
            }
        }
        
        serializer = DashboardStatsSerializer(stats)
        return Response(serializer.data)


class CommunityStatsView(APIView):
    """Community-wide statistics"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        stats = {
            'total_cases_resolved': Case.objects.filter(status='RESOLVED').count(),
            'total_volunteers': VolunteerProfile.objects.count(),
            'total_stories': VolunteerStory.objects.filter(status='PUBLISHED').count(),
            'active_goals': CommunityGoal.objects.filter(is_active=True).count(),
            'top_volunteers': self.get_top_volunteers(),
            'recent_achievements': self.get_recent_achievements()
        }
        return Response(stats)
    
    def get_top_volunteers(self):
        """Get top 5 volunteers by points"""
        top_profiles = VolunteerProfile.objects.filter(
            total_points__gt=0
        ).order_by('-total_points')[:5]
        
        return [{
            'name': profile.user.get_full_name(),
            'points': profile.total_points,
            'cases_completed': profile.cases_completed,
            'current_streak': profile.current_streak
        } for profile in top_profiles]
    
    def get_recent_achievements(self):
        """Get recent badge achievements"""
        recent_badges = UserBadge.objects.select_related('user', 'badge').order_by('-earned_at')[:10]
        
        return [{
            'volunteer_name': badge.user.get_full_name(),
            'badge_name': badge.badge.name,
            'badge_icon': badge.badge.icon,
            'earned_at': badge.earned_at
        } for badge in recent_badges]


class BobaRecommendationsView(APIView):
    """Boba AI recommendations for volunteers"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        recommendations = boba.get_volunteer_recommendations(request.user)
        greeting = boba.get_boba_greeting(request.user)
        
        return Response({
            'greeting': greeting,
            'recommendations': recommendations,
            'timestamp': timezone.now()
        })


class BobaNotificationsView(APIView):
    """Generate daily notifications from Boba"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get user-specific notifications
        daily_notifications = boba.generate_daily_notifications()
        user_notifications = [
            notif for notif in daily_notifications 
            if notif['user_id'] == request.user.id
        ]
        
        return Response({
            'notifications': user_notifications,
            'count': len(user_notifications)
        })
