from rest_framework import serializers
from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "first_name", "last_name", "email"]

# Backwards-compatible alias for existing imports
UserSerializer = CustomUserSerializer
