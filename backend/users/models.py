from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    # Custom fields for the user model
    is_coordinator = models.BooleanField(default=False)
    is_volunteer = models.BooleanField(default=False)
