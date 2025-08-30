"""
Django management command to automatically setup OAuth social applications
"""
import os
from django.core.management.base import BaseCommand
from allauth.socialaccount.models import SocialApp
from django.contrib.sites.models import Site


class Command(BaseCommand):
    help = 'Setup OAuth social applications (Google and Facebook)'

    def handle(self, *args, **options):
        # Get the default site
        site = Site.objects.get_current()
        
        # Setup Google OAuth
        google_client_id = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
        google_client_secret = os.getenv('GOOGLE_OAUTH_CLIENT_SECRET')
        
        if google_client_id and google_client_secret:
            google_app, created = SocialApp.objects.get_or_create(
                provider='google',
                defaults={
                    'name': 'Google OAuth',
                    'client_id': google_client_id,
                    'secret': google_client_secret,
                }
            )
            
            if not created:
                # Update existing app
                google_app.client_id = google_client_id
                google_app.secret = google_client_secret
                google_app.save()
            
            # Add site to the app
            google_app.sites.add(site)
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ Google OAuth app {"created" if created else "updated"} successfully'
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING('⚠️  Google OAuth credentials not found in environment')
            )
        
        # Setup Facebook OAuth
        facebook_app_id = os.getenv('FACEBOOK_APP_ID')
        facebook_app_secret = os.getenv('FACEBOOK_APP_SECRET')
        
        if facebook_app_id and facebook_app_secret:
            facebook_app, created = SocialApp.objects.get_or_create(
                provider='facebook',
                defaults={
                    'name': 'Facebook OAuth',
                    'client_id': facebook_app_id,
                    'secret': facebook_app_secret,
                }
            )
            
            if not created:
                # Update existing app
                facebook_app.client_id = facebook_app_id
                facebook_app.secret = facebook_app_secret
                facebook_app.save()
            
            # Add site to the app
            facebook_app.sites.add(site)
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ Facebook OAuth app {"created" if created else "updated"} successfully'
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING('⚠️  Facebook OAuth credentials not found in environment')
            )
        
        self.stdout.write(
            self.style.SUCCESS('\n🚀 OAuth setup complete! Your social authentication is ready.')
        )
        self.stdout.write('Next steps:')
        self.stdout.write('1. Start the development server: python manage.py runserver')
        self.stdout.write('2. Test OAuth buttons at: http://localhost:3000')
