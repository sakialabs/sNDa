from rest_framework import serializers
from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = CustomUser
        fields = [
            "id", "username", "first_name", "last_name", "email", "full_name",
            "is_coordinator", "is_volunteer", "avatar", "provider", "provider_id",
            "phone_number", "date_of_birth", "bio", "email_notifications", 
            "sms_notifications", "created_at", "updated_at", "last_active"
        ]
        read_only_fields = ["id", "provider", "provider_id", "created_at", "updated_at"]


class SocialAuthUserSerializer(serializers.ModelSerializer):
    """Simplified serializer for social authentication responses."""
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = CustomUser
        fields = [
            "id", "username", "first_name", "last_name", "email", "full_name",
            "is_coordinator", "is_volunteer", "avatar", "provider"
        ]


# Backwards-compatible alias for existing imports
UserSerializer = CustomUserSerializer
