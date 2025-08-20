from django.shortcuts import render
from rest_framework import viewsets
from .models import Case, Person, VolunteerProfile
from .serializers import CaseSerializer, PersonSerializer, VolunteerSerializer
from rest_framework.permissions import IsAuthenticated


class CaseViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows cases to be viewed or edited.
    """

    queryset = Case.objects.all().order_by("-created_at")
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated]


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
