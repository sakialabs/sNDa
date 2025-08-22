from rest_framework import serializers
from .models import Case, Person, ReferralMedia
from users.models import CustomUser
from users.serializers import CustomUserSerializer
from .models import VolunteerProfile


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

    # Meta class defines the model and fields to be serialized
    class Meta:
        model = VolunteerProfile
        fields = ["user", "phone_number", "skills", "availability", "is_onboarded"]


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
