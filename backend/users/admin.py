from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    # This customizes the admin view for your user model
    model = CustomUser
    # This adds your custom fields to the edit form
    fieldsets = UserAdmin.fieldsets + (
        ("Role Information", {"fields": ("is_coordinator", "is_volunteer")}),
    )
    # This adds your custom fields to the user list
    list_display = ["username", "email", "is_coordinator", "is_volunteer", "is_staff"]


# Register your CustomUser model with its custom admin options
admin.site.register(CustomUser, CustomUserAdmin)
