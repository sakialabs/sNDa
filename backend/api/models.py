import uuid
from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


class Case(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(_("Case Title"), max_length=255)
    description = models.TextField(_("Detailed Description"))
    status = models.CharField(_("Status"), max_length=20, default="NEW", db_index=True)
    urgency_score = models.IntegerField(_("Urgency Score"), null=True, blank=True)
    
    # Gamification fields
    success_story = models.TextField(_("Success Story"), null=True, blank=True)
    is_public = models.BooleanField(_("Public Story"), default=False)
    primary_subject = models.ForeignKey(
        "Person", on_delete=models.PROTECT, related_name="primary_cases"
    )
    associated_people = models.ManyToManyField(
        "Person", related_name="associated_cases", blank=True
    )
    assigned_volunteer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_cases",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Case {self.id} - {self.title}"
    
    @property
    def current_assignment(self):
        """Get the current active assignment for this case"""
        return self.assignments.filter(
            status__in=['ACCEPTED', 'IN_PROGRESS']
        ).first()


class Person(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(_("First Name"), max_length=150)
    last_name = models.CharField(_("Last Name"), max_length=150)
    date_of_birth = models.DateField(_("Date of Birth"), null=True, blank=True)
    gender = models.CharField(_("Gender"), max_length=50, blank=True)
    location_details = models.CharField(
        _("Location Details"), max_length=255, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Update(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name="updates")
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="case_updates",
    )
    note = models.TextField(_("Note"))
    created_at = models.DateTimeField(auto_now_add=True)


class ReferralMedia(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name="media")
    file = models.FileField(_("File"), upload_to="case_media/%Y/%m/%d/")
    description = models.CharField(_("Description"), max_length=255, blank=True)
    consent_given = models.BooleanField(_("Consent Given"), default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )


class VolunteerProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="volunteer_profile",
    )
    phone_number = models.CharField(_("Phone Number"), max_length=30, blank=True)
    skills = models.TextField(_("Skills & Experience"), blank=True)
    availability = models.CharField(_("Availability"), max_length=100, blank=True)
    is_onboarded = models.BooleanField(_("Onboarding Complete"), default=False)
    
    # Gamification fields
    cases_completed = models.IntegerField(_("Cases Completed"), default=0)
    current_streak = models.IntegerField(_("Current Streak"), default=0)
    longest_streak = models.IntegerField(_("Longest Streak"), default=0)
    last_activity = models.DateTimeField(_("Last Activity"), null=True, blank=True)
    total_points = models.IntegerField(_("Total Points"), default=0)

    def __str__(self):
        return f"{self.user.username}'s Profile"

    class Meta:
        verbose_name = "Volunteer"
        verbose_name_plural = "Volunteers"


class Campaign(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(_("Title"), max_length=255)
    description = models.TextField(_("Description"))
    goal_amount = models.DecimalField(_("Goal Amount"), max_digits=12, decimal_places=2)
    is_active = models.BooleanField(_("Is Active"), default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    end_date = models.DateField(_("End Date"), null=True, blank=True)

    def __str__(self):
        return self.title


class Donation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    campaign = models.ForeignKey(
        Campaign, on_delete=models.PROTECT, related_name="donations"
    )
    donor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="donations",
    )
    amount = models.DecimalField(_("Amount"), max_digits=12, decimal_places=2)
    transaction_id = models.CharField(_("Transaction ID"), max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Assignment(models.Model):
    """Real assignment system connecting coordinators, volunteers, and cases"""
    ASSIGNMENT_STATUS_CHOICES = [
        ('PENDING', _('Pending Acceptance')),
        ('ACCEPTED', _('Accepted')),
        ('IN_PROGRESS', _('In Progress')),
        ('COMPLETED', _('Completed')),
        ('DECLINED', _('Declined')),
        ('CANCELLED', _('Cancelled')),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name="assignments")
    volunteer = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="volunteer_assignments"
    )
    coordinator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="coordinator_assignments"
    )
    status = models.CharField(
        _("Assignment Status"), 
        max_length=20, 
        choices=ASSIGNMENT_STATUS_CHOICES, 
        default='PENDING',
        db_index=True
    )
    assignment_note = models.TextField(_("Assignment Instructions"), blank=True)
    volunteer_response = models.TextField(_("Volunteer Response"), blank=True)
    estimated_hours = models.PositiveIntegerField(_("Estimated Hours"), null=True, blank=True)
    actual_hours = models.PositiveIntegerField(_("Actual Hours"), null=True, blank=True)
    
    # Scheduling
    scheduled_start = models.DateTimeField(_("Scheduled Start"), null=True, blank=True)
    scheduled_end = models.DateTimeField(_("Scheduled End"), null=True, blank=True)
    
    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ['case', 'volunteer']  # One assignment per volunteer per case
        ordering = ['-created_at']
        verbose_name = "Assignment"
        verbose_name_plural = "Assignments"
    
    def __str__(self):
        return f"Assignment: {self.volunteer.get_full_name()} → {self.case.title}"


class VolunteerStory(models.Model):
    """Volunteer stories linked to cases and assignments for impact tracking"""
    STORY_STATUS_CHOICES = [
        ('DRAFT', _('Draft')),
        ('PUBLISHED', _('Published')),
        ('ARCHIVED', _('Archived')),
    ]
    
    STORY_TYPE_CHOICES = [
        ('EXPERIENCE', _('Experience Share')),
        ('CASE_UPDATE', _('Case Update')),
        ('REFLECTION', _('Personal Reflection')),
        ('MILESTONE', _('Milestone Achievement')),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(_("Story Title"), max_length=255)
    content = models.TextField(_("Story Content"))
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="volunteer_stories"
    )
    
    # Connections to platform data
    related_case = models.ForeignKey(
        Case, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="volunteer_stories"
    )
    related_assignment = models.ForeignKey(
        Assignment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="volunteer_stories"
    )
    
    # Story metadata
    story_type = models.CharField(
        _("Story Type"),
        max_length=20,
        choices=STORY_TYPE_CHOICES,
        default='EXPERIENCE'
    )
    status = models.CharField(
        _("Status"),
        max_length=20,
        choices=STORY_STATUS_CHOICES,
        default='DRAFT'
    )
    tags = models.JSONField(_("Tags"), default=list, blank=True)
    
    # Engagement metrics
    likes_count = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)
    shares_count = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Volunteer Story"
        verbose_name_plural = "Volunteer Stories"
        indexes = [
            models.Index(fields=['status', 'story_type']),
            models.Index(fields=['author', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} by {self.author.get_full_name()}"


class StoryMedia(models.Model):
    """Media attachments for volunteer stories"""
    MEDIA_TYPE_CHOICES = [
        ('IMAGE', _('Image')),
        ('VIDEO', _('Video')),
        ('LINK', _('External Link')),
        ('DOCUMENT', _('Document')),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    story = models.ForeignKey(VolunteerStory, on_delete=models.CASCADE, related_name="media")
    media_type = models.CharField(_("Media Type"), max_length=20, choices=MEDIA_TYPE_CHOICES)
    
    # File upload (for images, videos, documents)
    file = models.FileField(_("File"), upload_to="story_media/%Y/%m/%d/", null=True, blank=True)
    
    # External link
    url = models.URLField(_("URL"), null=True, blank=True)
    
    # Metadata
    title = models.CharField(_("Title"), max_length=255, blank=True)
    description = models.TextField(_("Description"), blank=True)
    thumbnail = models.ImageField(_("Thumbnail"), upload_to="story_thumbnails/%Y/%m/%d/", null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.media_type} for {self.story.title}"
    
    class Meta:
        verbose_name = "Story Media"
        verbose_name_plural = "Story Media"


class StoryLike(models.Model):
    """Track story likes for engagement"""
    story = models.ForeignKey(VolunteerStory, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['story', 'user']
        verbose_name = "Story Like"
        verbose_name_plural = "Story Likes"


class StoryComment(models.Model):
    """Comments on volunteer stories"""
    story = models.ForeignKey(VolunteerStory, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(_("Comment"))
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
        verbose_name = "Story Comment"
        verbose_name_plural = "Story Comments"


class Notification(models.Model):
    """Real-time notifications for assignments and platform updates"""
    NOTIFICATION_TYPES = [
        ('ASSIGNMENT_NEW', _('New Assignment')),
        ('ASSIGNMENT_ACCEPTED', _('Assignment Accepted')),
        ('ASSIGNMENT_COMPLETED', _('Assignment Completed')),
        ('STORY_PUBLISHED', _('Story Published')),
        ('STORY_LIKED', _('Story Liked')),
        ('STORY_COMMENTED', _('Story Commented')),
        ('CASE_UPDATE', _('Case Update')),
        ('SYSTEM', _('System Notification')),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    notification_type = models.CharField(
        _("Type"),
        max_length=30,
        choices=NOTIFICATION_TYPES
    )
    title = models.CharField(_("Title"), max_length=255)
    message = models.TextField(_("Message"))
    
    # Optional links to related objects
    related_case = models.ForeignKey(Case, on_delete=models.CASCADE, null=True, blank=True)
    related_assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, null=True, blank=True)
    related_story = models.ForeignKey(VolunteerStory, on_delete=models.CASCADE, null=True, blank=True)
    
    # Status tracking
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['notification_type', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} → {self.recipient.get_full_name()}"


class Badge(models.Model):
    """Achievement badges for gamification"""
    BADGE_CATEGORIES = [
        ('MILESTONE', _('Milestone')),
        ('STREAK', _('Streak')),
        ('COMMUNITY', _('Community')),
        ('SPECIAL', _('Special Achievement')),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_("Badge Name"), max_length=100)
    description = models.TextField(_("Description"))
    icon = models.CharField(_("Icon"), max_length=50)  # Emoji or icon class
    category = models.CharField(_("Category"), max_length=20, choices=BADGE_CATEGORIES)
    points_value = models.IntegerField(_("Points Value"), default=10)
    
    # Requirements
    required_cases = models.IntegerField(_("Required Cases"), null=True, blank=True)
    required_streak = models.IntegerField(_("Required Streak"), null=True, blank=True)
    required_stories = models.IntegerField(_("Required Stories"), null=True, blank=True)
    
    # Display
    color = models.CharField(_("Badge Color"), max_length=20, default="blue")
    is_active = models.BooleanField(_("Active"), default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['category', 'required_cases']
        verbose_name = "Badge"
        verbose_name_plural = "Badges"
    
    def __str__(self):
        return f"{self.icon} {self.name}"


class UserBadge(models.Model):
    """Track badges earned by users"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="badges")
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    
    # Context when earned
    earned_for_case = models.ForeignKey(Case, on_delete=models.SET_NULL, null=True, blank=True)
    earned_for_story = models.ForeignKey(VolunteerStory, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        unique_together = ['user', 'badge']
        ordering = ['-earned_at']
        verbose_name = "User Badge"
        verbose_name_plural = "User Badges"
    
    def __str__(self):
        return f"{self.user.username} earned {self.badge.name}"


class CommunityGoal(models.Model):
    """Shared community goals for collective motivation"""
    GOAL_TYPES = [
        ('CASES', _('Cases Resolved')),
        ('STORIES', _('Stories Shared')),
        ('VOLUNTEERS', _('Active Volunteers')),
        ('DONATIONS', _('Donations Raised')),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(_("Goal Title"), max_length=200)
    description = models.TextField(_("Description"))
    goal_type = models.CharField(_("Goal Type"), max_length=20, choices=GOAL_TYPES)
    target_value = models.IntegerField(_("Target Value"))
    current_value = models.IntegerField(_("Current Value"), default=0)
    
    # Timeline
    start_date = models.DateField(_("Start Date"))
    end_date = models.DateField(_("End Date"))
    
    # Display
    icon = models.CharField(_("Icon"), max_length=50, default="🎯")
    is_active = models.BooleanField(_("Active"), default=True)
    is_featured = models.BooleanField(_("Featured"), default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    @property
    def progress_percentage(self):
        if self.target_value == 0:
            return 0
        return min(100, (self.current_value / self.target_value) * 100)
    
    @property
    def is_completed(self):
        return self.current_value >= self.target_value
    
    class Meta:
        ordering = ['-is_featured', '-created_at']
        verbose_name = "Community Goal"
        verbose_name_plural = "Community Goals"
    
    def __str__(self):
        return f"{self.icon} {self.title} ({self.current_value}/{self.target_value})"


class ActivityLog(models.Model):
    """Track user activities for gamification"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=50, choices=[
        ('case_completed', 'Case Completed'),
        ('story_published', 'Story Published'),
        ('badge_earned', 'Badge Earned'),
        ('streak_milestone', 'Streak Milestone'),
        ('login', 'User Login'),
        ('profile_updated', 'Profile Updated'),
    ])
    description = models.TextField()
    points_earned = models.IntegerField(default=0)
    metadata = models.JSONField(default=dict, blank=True)  # Store additional context
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.activity_type} ({self.created_at.strftime('%Y-%m-%d')})"


class EmailSchedule(models.Model):
    """Track scheduled emails for onboarding sequence"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    email_type = models.CharField(max_length=50)
    scheduled_for = models.DateTimeField()
    sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    failed = models.BooleanField(default=False)
    error_message = models.TextField(blank=True)
    is_volunteer = models.BooleanField(default=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['scheduled_for']
        verbose_name = "Email Schedule"
        verbose_name_plural = "Email Schedules"
        indexes = [
            models.Index(fields=['scheduled_for', 'sent']),
            models.Index(fields=['email_type']),
        ]
    
    def __str__(self):
        return f"{self.email_type} to {self.user.email} at {self.scheduled_for}"


class EmailAnalytics(models.Model):
    """Track email engagement and analytics"""
    email_schedule = models.OneToOneField(EmailSchedule, on_delete=models.CASCADE, null=True, blank=True)
    email_type = models.CharField(max_length=50)
    recipient_email = models.EmailField()
    subject = models.CharField(max_length=255)
    
    # Delivery tracking
    delivered_at = models.DateTimeField(null=True, blank=True)
    delivery_status = models.CharField(max_length=20, choices=[
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('bounced', 'Bounced'),
        ('failed', 'Failed'),
    ], default='sent')
    
    # Engagement tracking
    opened_at = models.DateTimeField(null=True, blank=True)
    clicked_at = models.DateTimeField(null=True, blank=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    
    # Metrics
    open_count = models.PositiveIntegerField(default=0)
    click_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Email Analytics"
        verbose_name_plural = "Email Analytics"
        indexes = [
            models.Index(fields=['email_type', 'delivery_status']),
            models.Index(fields=['recipient_email']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.email_type} analytics for {self.recipient_email}"
    
    @property
    def is_opened(self):
        return self.opened_at is not None
    
    @property
    def is_clicked(self):
        return self.clicked_at is not None


