from django.contrib import admin
from .models import Person, Case, Update, Campaign, Donation, VolunteerProfile


# Create a custom admin class for the VolunteerProfile model
class VolunteerProfileAdmin(admin.ModelAdmin):
    # Explicitly list the fields to show on the add/edit form
    fields = ["user", "phone_number", "skills", "availability", "is_onboarded"]


# Register the models with the admin site
admin.site.register(Person)
admin.site.register(Case)
admin.site.register(Update)
admin.site.register(Campaign)
admin.site.register(Donation)

# Register the VolunteerProfile model WITH its new custom admin class
admin.site.register(VolunteerProfile, VolunteerProfileAdmin)
