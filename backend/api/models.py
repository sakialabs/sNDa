import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class Case(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(_("Case Title"), max_length=255)
    description = models.TextField(_("Detailed Description"))
    status = models.CharField(_("Status"), max_length=20, default="NEW", db_index=True)
    urgency_score = models.IntegerField(_("Urgency Score"), null=True, blank=True)
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


class StoryLike(models.Model):
    """Track story likes for engagement"""
    story = models.ForeignKey(VolunteerStory, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['story', 'user']


class StoryComment(models.Model):
    """Comments on volunteer stories"""
    story = models.ForeignKey(VolunteerStory, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(_("Comment"))
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']


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
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['notification_type', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} → {self.recipient.get_full_name()}"
