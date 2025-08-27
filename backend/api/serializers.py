from rest_framework import serializers
from .models import (
    Case, Person, VolunteerProfile, ReferralMedia, Badge, UserBadge,
    CommunityGoal, ActivityLog, VolunteerStory, EmailSchedule, StoryMedia, Assignment
)
from users.models import CustomUser
from users.serializers import CustomUserSerializer


# This serializer translates Person data into JSON
class PersonSerializer(serializers.ModelSerializer):
    # Meta class defines the model and fields to be serialized
    class Meta:
        model = Person
        fields = [
            "id",
            "first_name",
            "last_name",
            "date_of_birth",
            "gender",
            "location_details",
        ]


# This serializer translates Case data into JSON
class CaseSerializer(serializers.ModelSerializer):
    # These fields are for reading data (GET requests)
    primary_subject = PersonSerializer(read_only=True)
    assigned_volunteer = CustomUserSerializer(read_only=True)
    thumbnail_url = serializers.SerializerMethodField(read_only=True)

    # These fields are for writing data (POST/PUT requests)
    primary_subject_id = serializers.PrimaryKeyRelatedField(
        queryset=Person.objects.all(), source="primary_subject", write_only=True
    )
    assigned_volunteer_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        source="assigned_volunteer",
        write_only=True,
        required=False,
    )

    # Meta class defines the model and fields to be serialized
    class Meta:
        model = Case
        fields = [
            "id",
            "title",
            "description",
            "status",
            "urgency_score",
            "created_at",
            "primary_subject",
            "assigned_volunteer",
            "assigned_volunteer_id",
            "primary_subject_id",
            "thumbnail_url",
            "success_story",
            "is_public",
        ]
        read_only_fields = ["id", "created_at"]

    def get_thumbnail_url(self, obj: Case) -> str | None:
        media = (
            ReferralMedia.objects.filter(case=obj, consent_given=True)
            .order_by("uploaded_at")
            .first()
        )
        if media and media.file:
            try:
                return media.file.url
            except Exception:
                return None
        return None


class VolunteerSerializer(serializers.ModelSerializer):
    # Nested serializer to include user details
    user = CustomUserSerializer(read_only=True)
    recent_badges = serializers.SerializerMethodField()
    
    class Meta:
        model = VolunteerProfile
        fields = [
            "user", "phone_number", "skills", "availability", "is_onboarded",
            "cases_completed", "current_streak", "longest_streak", "total_points",
            "last_activity", "recent_badges"
        ]
    
    def get_recent_badges(self, obj):
        recent_badges = UserBadge.objects.filter(user=obj.user).order_by('-earned_at')[:3]
        return BadgeSerializer([badge.badge for badge in recent_badges], many=True).data


class ReferralMediaSerializer(serializers.ModelSerializer):
    uploaded_by = CustomUserSerializer(read_only=True)

    class Meta:
        model = ReferralMedia
        fields = [
            "id",
            "case",
            "file",
            "description",
            "consent_given",
            "uploaded_at",
            "uploaded_by",
        ]
        read_only_fields = ["id", "uploaded_at", "uploaded_by"]


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = [
            "id", "name", "description", "icon", "category", "points_value",
            "required_cases", "required_streak", "required_stories", "color", "created_at"
        ]


class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)
    
    class Meta:
        model = UserBadge
        fields = ["badge", "earned_at", "earned_for_case", "earned_for_story"]


class CommunityGoalSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.ReadOnlyField()
    is_completed = serializers.ReadOnlyField()
    
    class Meta:
        model = CommunityGoal
        fields = [
            "id", "title", "description", "goal_type", "target_value", "current_value",
            "start_date", "end_date", "icon", "is_active", "is_featured",
            "progress_percentage", "is_completed", "created_at"
        ]


class ActivityLogSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    
    class Meta:
        model = ActivityLog
        fields = [
            "activity_type", "points_earned", "created_at", "user",
            "related_case", "related_story", "related_assignment"
        ]


class StoryMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryMedia
        fields = [
            "id", "media_type", "file", "url", "title", "description", 
            "thumbnail", "created_at"
        ]


class VolunteerStorySerializer(serializers.ModelSerializer):
    author = CustomUserSerializer(read_only=True)
    media = StoryMediaSerializer(many=True, read_only=True)
    related_case_title = serializers.CharField(source='related_case.title', read_only=True)
    
    class Meta:
        model = VolunteerStory
        fields = [
            "id", "title", "content", "author", "related_case", "related_case_title",
            "related_assignment", "story_type", "status", "tags", "likes_count",
            "comments_count", "shares_count", "created_at", "updated_at",
            "published_at", "media"
        ]
        read_only_fields = ["id", "author", "likes_count", "comments_count", "shares_count"]


class PublicStorySerializer(serializers.ModelSerializer):
    """Simplified serializer for public Wall of Love"""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    case_title = serializers.CharField(source='related_case.title', read_only=True)
    media = StoryMediaSerializer(many=True, read_only=True)
    
    class Meta:
        model = VolunteerStory
        fields = [
            "id", "title", "content", "author_name", "case_title", "story_type",
            "tags", "likes_count", "published_at", "media"
        ]


class AssignmentSerializer(serializers.ModelSerializer):
    volunteer = CustomUserSerializer(read_only=True)
    coordinator = CustomUserSerializer(read_only=True)
    case = CaseSerializer(read_only=True)
    
    class Meta:
        model = Assignment
        fields = [
            "id", "case", "volunteer", "coordinator", "status", "assignment_note",
            "volunteer_response", "estimated_hours", "actual_hours", "scheduled_start",
            "scheduled_end", "created_at", "accepted_at", "started_at", "completed_at"
        ]


class EmailScheduleSerializer(serializers.ModelSerializer):
    """Serializer for email scheduling"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = EmailSchedule
        fields = [
            'id', 'user', 'user_email', 'user_name', 'email_type', 
            'scheduled_for', 'sent', 'sent_at', 'failed', 'error_message',
            'is_volunteer', 'metadata', 'created_at'
        ]
        read_only_fields = ['id', 'user_email', 'user_name', 'sent_at', 'created_at']


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for volunteer dashboard statistics"""
    cases_completed = serializers.IntegerField()
    current_streak = serializers.IntegerField()
    longest_streak = serializers.IntegerField()
    total_points = serializers.IntegerField()
    recent_badges = BadgeSerializer(many=True)
    active_assignments = serializers.IntegerField()
    recent_activities = ActivityLogSerializer(many=True)
    community_rank = serializers.IntegerField()
    stories_published = serializers.IntegerField()
    impact_summary = serializers.DictField()
