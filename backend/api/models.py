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
