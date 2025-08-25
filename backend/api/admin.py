from django.contrib import admin
from .models import (
    Person,
    Case,
    Update,
    Campaign,
    Donation,
    VolunteerProfile,
    Assignment,
    VolunteerStory,
    StoryMedia,
    StoryLike,
    StoryComment,
    Notification,
    Badge,
    UserBadge,
    CommunityGoal,
    ActivityLog,
    EmailSchedule,
    EmailAnalytics,
)


# Create a custom admin class for the VolunteerProfile model
class VolunteerProfileAdmin(admin.ModelAdmin):
    # Explicitly list the fields to show on the add/edit form
    fields = ["user", "phone_number", "skills", "availability", "is_onboarded"]


# Register the models with the admin site
admin.site.register(Person)
admin.site.register(Case)
admin.site.register(Update)
admin.site.register(Campaign)
admin.site.register(Donation)

# Register the VolunteerProfile model WITH its new custom admin class
admin.site.register(VolunteerProfile, VolunteerProfileAdmin)

# Additional models for full platform management
@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "points_value", "is_active")
    list_filter = ("category", "is_active")
    search_fields = ("name", "description")


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ("user", "badge", "earned_at")
    list_filter = ("earned_at",)
    search_fields = ("user__username", "badge__name")


@admin.register(VolunteerStory)
class VolunteerStoryAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "status", "story_type", "created_at")
    list_filter = ("status", "story_type", "created_at")
    search_fields = ("title", "author__username")


admin.site.register(StoryMedia)
admin.site.register(StoryLike)
admin.site.register(StoryComment)


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ("case", "volunteer", "coordinator", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("case__title", "volunteer__username", "coordinator__username")


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("title", "recipient", "notification_type", "created_at", "is_read")
    list_filter = ("notification_type", "is_read", "created_at")
    search_fields = ("title", "recipient__username")


@admin.register(CommunityGoal)
class CommunityGoalAdmin(admin.ModelAdmin):
    list_display = ("title", "goal_type", "current_value", "target_value", "is_active", "is_featured")
    list_filter = ("goal_type", "is_active", "is_featured")
    search_fields = ("title",)


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ("user", "activity_type", "points_earned", "created_at")
    list_filter = ("activity_type", "created_at")
    search_fields = ("user__username",)


@admin.register(EmailSchedule)
class EmailScheduleAdmin(admin.ModelAdmin):
    list_display = ("user", "email_type", "scheduled_for", "sent", "failed")
    list_filter = ("email_type", "sent", "failed")
    search_fields = ("user__email",)


@admin.register(EmailAnalytics)
class EmailAnalyticsAdmin(admin.ModelAdmin):
    list_display = ("email_type", "recipient_email", "delivery_status", "open_count", "click_count", "created_at")
    list_filter = ("delivery_status", "email_type", "created_at")
    search_fields = ("recipient_email", "email_type")
