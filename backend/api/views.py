from django.shortcuts import render
from rest_framework import viewsets, parsers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Case, Person, VolunteerProfile, ReferralMedia
from .serializers import (
    CaseSerializer,
    PersonSerializer,
    VolunteerSerializer,
    ReferralMediaSerializer,
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
