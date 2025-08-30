from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    # Custom fields for the user model
    is_coordinator = models.BooleanField(default=False)
    is_volunteer = models.BooleanField(default=False)
    
    # Social authentication fields
    avatar = models.URLField(blank=True, null=True, help_text="Profile picture URL from social providers")
    provider = models.CharField(
        max_length=50, 
        blank=True, 
        null=True,
        help_text="OAuth provider (google, facebook, etc.)"
    )
    provider_id = models.CharField(
        max_length=100, 
        blank=True, 
        null=True,
        help_text="Provider-specific user ID"
    )
    
    # Enhanced profile fields
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    
    # Preferences
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_active = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'auth_user'
        
    def __str__(self):
        return self.email or self.username
        
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username
