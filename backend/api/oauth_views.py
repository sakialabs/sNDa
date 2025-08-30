"""
OAuth authentication views for social login integration.
"""
import json
import logging
from django.conf import settings
from django.contrib.auth import login
from django.shortcuts import redirect
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
from allauth.socialaccount.models import SocialAccount, SocialApp
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount import app_settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import CustomUser
from users.serializers import UserSerializer

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([AllowAny])
def oauth_config(request):
    """
    Return OAuth configuration for frontend.
    """
    try:
        google_app = SocialApp.objects.get(provider='google')
        facebook_app = SocialApp.objects.get(provider='facebook')
        
        config = {
            'google': {
                'client_id': google_app.client_id,
                'redirect_uri': f"{settings.FRONTEND_URL}/auth/google/callback",
            },
            'facebook': {
                'app_id': facebook_app.client_id,
                'redirect_uri': f"{settings.FRONTEND_URL}/auth/facebook/callback",
            }
        }
        return Response(config)
    except SocialApp.DoesNotExist:
        return Response(
            {'error': 'OAuth apps not configured'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def google_oauth_callback(request):
    """
    Handle Google OAuth callback and return JWT tokens.
    """
    try:
        # Get the authorization code from the request
        auth_code = request.data.get('code')
        if not auth_code:
            return Response(
                {'error': 'Authorization code required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Exchange code for tokens using Google OAuth adapter
        adapter = GoogleOAuth2Adapter(request)
        app = adapter.get_app(request)
        token = adapter.complete_login(request, app, auth_code)
        
        # Get or create user
        social_account = token.account
        user = social_account.user
        
        # Update user profile with Google data
        if social_account.extra_data:
            extra_data = social_account.extra_data
            if not user.first_name and extra_data.get('given_name'):
                user.first_name = extra_data.get('given_name')
            if not user.last_name and extra_data.get('family_name'):
                user.last_name = extra_data.get('family_name')
            if not user.avatar and extra_data.get('picture'):
                user.avatar = extra_data.get('picture')
            user.provider = 'google'
            user.provider_id = extra_data.get('id')
            user.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })
        
    except Exception as e:
        logger.error(f"Google OAuth error: {str(e)}")
        return Response(
            {'error': 'OAuth authentication failed'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def facebook_oauth_callback(request):
    """
    Handle Facebook OAuth callback and return JWT tokens.
    """
    try:
        # Get the authorization code from the request
        auth_code = request.data.get('code')
        if not auth_code:
            return Response(
                {'error': 'Authorization code required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Exchange code for tokens using Facebook OAuth adapter
        adapter = FacebookOAuth2Adapter(request)
        app = adapter.get_app(request)
        token = adapter.complete_login(request, app, auth_code)
        
        # Get or create user
        social_account = token.account
        user = social_account.user
        
        # Update user profile with Facebook data
        if social_account.extra_data:
            extra_data = social_account.extra_data
            if not user.first_name and extra_data.get('first_name'):
                user.first_name = extra_data.get('first_name')
            if not user.last_name and extra_data.get('last_name'):
                user.last_name = extra_data.get('last_name')
            if not user.avatar and extra_data.get('picture', {}).get('data', {}).get('url'):
                user.avatar = extra_data['picture']['data']['url']
            user.provider = 'facebook'
            user.provider_id = extra_data.get('id')
            user.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })
        
    except Exception as e:
        logger.error(f"Facebook OAuth error: {str(e)}")
        return Response(
            {'error': 'OAuth authentication failed'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def social_login_success(request):
    """
    Handle successful social login redirect.
    """
    return redirect(f"{settings.FRONTEND_URL}/dashboard")


@api_view(['GET'])
@permission_classes([AllowAny])
def email_verification_success(request):
    """
    Handle successful email verification.
    """
    return redirect(f"{settings.FRONTEND_URL}/auth/email-verified")


@api_view(['POST'])
@permission_classes([AllowAny])
def disconnect_social_account(request):
    """
    Disconnect a social account from user profile.
    """
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Authentication required'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    provider = request.data.get('provider')
    if not provider:
        return Response(
            {'error': 'Provider required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        social_account = SocialAccount.objects.get(
            user=request.user, 
            provider=provider
        )
        social_account.delete()
        
        # Clear provider fields from user
        if request.user.provider == provider:
            request.user.provider = None
            request.user.provider_id = None
            request.user.save()
        
        return Response({'message': 'Social account disconnected successfully'})
        
    except SocialAccount.DoesNotExist:
        return Response(
            {'error': 'Social account not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def user_social_accounts(request):
    """
    Get user's connected social accounts.
    """
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Authentication required'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    social_accounts = SocialAccount.objects.filter(user=request.user)
    accounts_data = []
    
    for account in social_accounts:
        accounts_data.append({
            'provider': account.provider,
            'uid': account.uid,
            'date_joined': account.date_joined,
            'extra_data': {
                'name': account.extra_data.get('name', ''),
                'email': account.extra_data.get('email', ''),
                'picture': account.extra_data.get('picture', ''),
            }
        })
    
    return Response({
        'social_accounts': accounts_data,
        'total_count': len(accounts_data)
    })
