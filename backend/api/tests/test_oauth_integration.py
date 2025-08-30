"""
OAuth Integration Tests for sNDa Platform
Tests the complete OAuth flow and configuration
"""
import os
import django
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from allauth.socialaccount.models import SocialApp, SocialAccount
from django.contrib.sites.models import Site

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

User = get_user_model()


class OAuthConfigurationTest(TestCase):
    """Test OAuth configuration and setup"""
    
    def setUp(self):
        """Set up test environment"""
        self.client = Client()
        self.site = Site.objects.get_current()
    
    def test_oauth_config_endpoint(self):
        """Test OAuth configuration endpoint"""
        response = self.client.get('/api/auth/config/')
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertIn('google', data)
        self.assertIn('facebook', data)
        self.assertIn('client_id', data['google'])
        self.assertIn('app_id', data['facebook'])
    
    def test_google_oauth_app_configured(self):
        """Test Google OAuth app is properly configured"""
        google_apps = SocialApp.objects.filter(provider='google')
        self.assertTrue(google_apps.exists())
        
        google_app = google_apps.first()
        self.assertEqual(google_app.provider, 'google')
        self.assertIsNotNone(google_app.client_id)
        self.assertIsNotNone(google_app.secret)
        self.assertIn(self.site, google_app.sites.all())
    
    def test_facebook_oauth_app_configured(self):
        """Test Facebook OAuth app is properly configured"""
        facebook_apps = SocialApp.objects.filter(provider='facebook')
        self.assertTrue(facebook_apps.exists())
        
        facebook_app = facebook_apps.first()
        self.assertEqual(facebook_app.provider, 'facebook')
        self.assertIsNotNone(facebook_app.client_id)
        self.assertIsNotNone(facebook_app.secret)
        self.assertIn(self.site, facebook_app.sites.all())
    
    def test_oauth_callback_endpoints_exist(self):
        """Test OAuth callback endpoints are accessible"""
        # Test Google callback endpoint structure
        response = self.client.post('/api/auth/google/callback/', 
                                  {'code': 'test_code'}, 
                                  content_type='application/json')
        # Should return error (invalid code) but endpoint should exist
        self.assertNotEqual(response.status_code, 404)
        
        # Test Facebook callback endpoint structure
        response = self.client.post('/api/auth/facebook/callback/', 
                                  {'code': 'test_code'}, 
                                  content_type='application/json')
        # Should return error (invalid code) but endpoint should exist
        self.assertNotEqual(response.status_code, 404)


class OAuthEnvironmentTest(TestCase):
    """Test OAuth environment variables and configuration"""
    
    def test_google_oauth_credentials_configured(self):
        """Test Google OAuth credentials are in environment"""
        google_client_id = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
        google_client_secret = os.getenv('GOOGLE_OAUTH_CLIENT_SECRET')
        
        self.assertIsNotNone(google_client_id, "Google OAuth Client ID not configured")
        self.assertIsNotNone(google_client_secret, "Google OAuth Client Secret not configured")
        self.assertNotEqual(google_client_id, "", "Google OAuth Client ID is empty")
        self.assertNotEqual(google_client_secret, "", "Google OAuth Client Secret is empty")
    
    def test_facebook_oauth_credentials_configured(self):
        """Test Facebook OAuth credentials are in environment"""
        facebook_app_id = os.getenv('FACEBOOK_APP_ID')
        facebook_app_secret = os.getenv('FACEBOOK_APP_SECRET')
        
        self.assertIsNotNone(facebook_app_id, "Facebook App ID not configured")
        self.assertIsNotNone(facebook_app_secret, "Facebook App Secret not configured")
        self.assertNotEqual(facebook_app_id, "", "Facebook App ID is empty")
        self.assertNotEqual(facebook_app_secret, "", "Facebook App Secret is empty")


if __name__ == '__main__':
    import unittest
    unittest.main()
