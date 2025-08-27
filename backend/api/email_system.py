"""
Email System for sNDa Platform
3-step onboarding sequence and transactional emails
"""

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Centralized email service for sNDa platform"""
    
    def __init__(self):
        self.from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'snda@hey.com')
    
    def send_welcome_email(self, user, is_volunteer=True):
        """Day 0: Welcome Email 🥪"""
        subject = "🥪 Welcome to sNDa - Your First Bite of Solidarity"
        
        context = {
            'user_name': user.get_full_name() or user.username,
            'is_volunteer': is_volunteer,
            'platform_url': settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000',
            'dashboard_url': '/volunteer/dashboard' if is_volunteer else '/coordinator',
            'profile_url': f"{settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'}/volunteer/profile",
            'unsubscribe_url': '#',  # TODO: Implement unsubscribe functionality
        }
        
        html_message = render_to_string('emails/welcome.html', context)
        plain_message = strip_tags(html_message)
        
        return self._send_email(
            subject=subject,
            message=plain_message,
            html_message=html_message,
            recipient_list=[user.email]
        )
    
    def send_layer_up_email(self, user, is_volunteer=True):
        """Day 2-3: Layer Up Email 🥗"""
        subject = "🥗 Layer Up — Let's Build Your Sandwich"
        
        context = {
            'user_name': user.get_full_name() or user.username,
            'is_volunteer': is_volunteer,
            'explore_projects_url': f"{settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'}/coordinator",
            'profile_url': f"{settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'}/volunteer/profile",
            'unsubscribe_url': '#',
        }
        
        html_message = render_to_string('emails/layer_up.html', context)
        plain_message = strip_tags(html_message)
        
        return self._send_email(
            subject=subject,
            message=plain_message,
            html_message=html_message,
            recipient_list=[user.email]
        )
    
    def send_engagement_email(self, user, is_volunteer=True):
        """Day 5-7: Engagement Email 🍽️"""
        subject = "🍽️ Your First Bite of Action"
        
        # Get community stats for personalization
        from .models import VolunteerProfile, Assignment, VolunteerStory, CommunityGoal
        
        community_stats = {
            'active_volunteers': VolunteerProfile.objects.filter(is_onboarded=True).count(),
            'cases_resolved': Assignment.objects.filter(status='COMPLETED').count(),
            'stories_shared': VolunteerStory.objects.filter(status='PUBLISHED').count(),
        }
        
        context = {
            'user_name': user.get_full_name() or user.username,
            'is_volunteer': is_volunteer,
            'community_stats': community_stats,
            'first_action_url': f"{settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'}/volunteer/dashboard",
            'community_url': f"{settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'}/community",
            'unsubscribe_url': '#',
        }
        
        html_message = render_to_string('emails/engagement.html', context)
        plain_message = strip_tags(html_message)
        
        return self._send_email(
            subject=subject,
            message=plain_message,
            html_message=html_message,
            recipient_list=[user.email]
        )
    
    def send_assignment_notification(self, assignment):
        """Case Assignment Notification 🌟"""
        subject = f"🌟 A New Case Needs Your Touch, {assignment.volunteer.get_full_name()}!"
        
        context = {
            'volunteer_name': assignment.volunteer.get_full_name(),
            'case_title': assignment.case.title,
            'case_description': assignment.case.description[:200] + '...' if len(assignment.case.description) > 200 else assignment.case.description,
            'urgency_score': assignment.case.urgency_score,
            'coordinator_name': assignment.coordinator.get_full_name(),
            'assignment_note': assignment.assignment_note,
            'due_date': assignment.scheduled_end.strftime('%B %d, %Y') if assignment.scheduled_end else None,
            'location': 'Remote',  # TODO: Add location field to Case model
            'case_url': f"{settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'}/coordinator/cases/{assignment.case.id}",
            'unsubscribe_url': '#',
        }
        
        html_message = render_to_string('emails/assignment_notification.html', context)
        plain_message = strip_tags(html_message)
        
        return self._send_email(
            subject=subject,
            message=plain_message,
            html_message=html_message,
            recipient_list=[assignment.volunteer.email]
        )
    
    def send_story_published_notification(self, story):
        """Story Approval / Publication 🎉"""
        subject = "🎉 Your Story is Live on the Wall of Love!"
        
        context = {
            'author_name': story.author.get_full_name(),
            'story_title': story.title,
            'story_url': f"{settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'}/community",
            'share_url': f"{settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'}/community",
            'case_title': story.related_case.title if story.related_case else None,
            'unsubscribe_url': '#',
        }
        
        html_message = render_to_string('emails/story_published.html', context)
        plain_message = strip_tags(html_message)
        
        return self._send_email(
            subject=subject,
            message=plain_message,
            html_message=html_message,
            recipient_list=[story.author.email]
        )
    
    def send_donation_confirmation(self, donation_data):
        """Donation Confirmation 💌"""
        subject = f"💌 Thank You for Your ${donation_data['amount']} Generosity!"
        
        context = {
            'donor_name': donation_data.get('donor_name', 'Anonymous'),
            'amount': donation_data['amount'],
            'campaign_name': donation_data.get('campaign_name', 'General Fund'),
            'transaction_id': donation_data.get('transaction_id'),
            'date': donation_data.get('date', timezone.now().strftime('%B %d, %Y')),
            'impact_url': f"{settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'}/donate",
            'share_url': f"{settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'}/community",
            'unsubscribe_url': '#',
        }
        
        html_message = render_to_string('emails/donation_confirmation.html', context)
        plain_message = strip_tags(html_message)
        
        recipient = donation_data.get('donor_email')
        if recipient:
            return self._send_email(
                subject=subject,
                message=plain_message,
                html_message=html_message,
                recipient_list=[recipient]
            )
    
    def send_case_status_update(self, case, recipient_email, status_change):
        """Case Status Update 📝"""
        subject = f"📝 Your Case {case.title} Status Has Changed"
        
        context = {
            'case_title': case.title,
            'old_status': status_change.get('old_status', ''),
            'new_status': status_change.get('new_status', ''),
            'updated_date': timezone.now().strftime('%B %d, %Y'),
            'case_progress_url': f"{settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'}/coordinator/cases/{case.id}",
            'dashboard_url': f"{settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'}/volunteer/dashboard",
            'success_story': case.success_story if hasattr(case, 'success_story') else None,
            'unsubscribe_url': '#',
        }
        
        html_message = render_to_string('emails/case_status_update.html', context)
        plain_message = strip_tags(html_message)
        
        return self._send_email(
            subject=subject,
            message=plain_message,
            html_message=html_message,
            recipient_list=[recipient_email]
        )
    
    def send_streak_reminder(self, user, streak_days):
        """Streak / Motivation Reminder 🔔"""
        subject = f"🔔 Keep Your Streak Going, {user.get_full_name()}!"
        
        # Get user profile for additional stats
        from .models import VolunteerProfile
        profile, _ = VolunteerProfile.objects.get_or_create(user=user)
        
        context = {
            'user_name': user.get_full_name(),
            'streak_days': streak_days,
            'longest_streak': profile.longest_streak,
            'total_points': profile.total_points,
            'dashboard_url': f"{settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'}/volunteer/dashboard",
            'community_url': f"{settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'}/community",
            'unsubscribe_url': '#',
        }
        
        html_message = render_to_string('emails/streak_reminder.html', context)
        plain_message = strip_tags(html_message)
        
        return self._send_email(
            subject=subject,
            message=plain_message,
            html_message=html_message,
            recipient_list=[user.email]
        )
    
    def send_boba_weekly_motivation(self, user):
        """Boba's Weekly Personalized Motivational Email 🤖"""
        from .models import VolunteerProfile, Assignment, VolunteerStory
        
        # Get personalized data
        profile, _ = VolunteerProfile.objects.get_or_create(user=user)
        recent_assignments = Assignment.objects.filter(
            volunteer=user, 
            created_at__gte=timezone.now() - timedelta(days=7)
        ).count()
        recent_stories = VolunteerStory.objects.filter(
            author=user,
            created_at__gte=timezone.now() - timedelta(days=7)
        ).count()
        
        # Personalized subject lines based on activity
        if recent_assignments > 0:
            subject = f"🤖 Boba's Weekly Check-in: You're on Fire, {user.get_full_name()}!"
        elif profile.current_streak > 0:
            subject = f"🤖 Boba's Weekly Boost: Your {profile.current_streak}-Day Streak is Amazing!"
        else:
            subject = f"🤖 Boba Misses You: Ready for Your Next Adventure?"
        
        # Generate personalized motivational message
        motivational_messages = [
            "Every sandwich needs its perfect ingredients, and you're one of ours! 🥪✨",
            "Your dedication adds the most delicious layer to our community sandwich! 🌟",
            "Like a master chef, you bring out the best flavors in every case you touch! 👨‍🍳",
            "You're not just volunteering, you're crafting hope one case at a time! 🎨",
            "Your consistency is the secret sauce that makes our community stronger! 🔥"
        ]
        
        import random
        boba_message = random.choice(motivational_messages)
        
        context = {
            'user_name': user.get_full_name(),
            'current_streak': profile.current_streak,
            'total_points': profile.total_points,
            'cases_completed': profile.cases_completed,
            'recent_activity': recent_assignments + recent_stories,
            'boba_message': boba_message,
            'dashboard_url': f"{settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'}/volunteer/dashboard",
            'community_url': f"{settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'http://localhost:3000'}/community",
            'unsubscribe_url': '#',
        }
        
        html_message = render_to_string('emails/boba_weekly_motivation.html', context)
        plain_message = strip_tags(html_message)
        
        return self._send_email(
            subject=subject,
            message=plain_message,
            html_message=html_message,
            recipient_list=[user.email]
        )
    
    def _send_email(self, subject: str, message: str, recipient_list: list, html_message: str = None) -> bool:
        """Internal method to send emails"""
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=self.from_email,
                recipient_list=recipient_list,
                html_message=html_message,
                fail_silently=False
            )
            logger.info(f"Email sent successfully to {recipient_list}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {recipient_list}: {str(e)}")
            return False


# Singleton instance
email_service = EmailService()


# Celery tasks for scheduled emails (if using Celery)
def schedule_onboarding_emails(user_id, is_volunteer=True):
    """Schedule the 3-step onboarding sequence: Day 0, Day 2-3, Day 5-7"""
    from django.contrib.auth.models import User
    from django.utils import timezone
    from datetime import timedelta
    
    try:
        user = User.objects.get(id=user_id)
        
        # Send welcome email immediately (Day 0)
        email_service.send_welcome_email(user, is_volunteer)
        
        from .models import EmailSchedule
        
        # Schedule Layer Up email for day 2-3
        EmailSchedule.objects.create(
            user=user,
            email_type='layer_up',
            scheduled_for=timezone.now() + timedelta(days=2),
            is_volunteer=is_volunteer,
            metadata={'sequence_step': 2}
        )
        
        # Schedule Engagement email for day 5-7
        EmailSchedule.objects.create(
            user=user,
            email_type='engagement',
            scheduled_for=timezone.now() + timedelta(days=5),
            is_volunteer=is_volunteer,
            metadata={'sequence_step': 3}
        )
        
        # Schedule first Boba weekly motivation for day 14
        EmailSchedule.objects.create(
            user=user,
            email_type='boba_weekly_motivation',
            scheduled_for=timezone.now() + timedelta(days=14),
            is_volunteer=is_volunteer,
            metadata={'recurring': True, 'interval_days': 7}
        )
        
        logger.info(f"Onboarding email sequence scheduled for user {user.email}")
        
    except Exception as e:
        logger.error(f"Failed to schedule onboarding emails for user {user_id}: {str(e)}")


def schedule_weekly_motivation_emails():
    """Schedule weekly Boba motivation emails for all active volunteers"""
    from django.contrib.auth.models import User
    from .models import VolunteerProfile, EmailSchedule
    from django.utils import timezone
    from datetime import timedelta
    
    # Get all volunteers who have been active in the last 30 days
    active_volunteers = VolunteerProfile.objects.filter(
        is_onboarded=True,
        user__last_login__gte=timezone.now() - timedelta(days=30)
    )
    
    for profile in active_volunteers:
        # Check if they already have a pending weekly motivation email
        existing_schedule = EmailSchedule.objects.filter(
            user=profile.user,
            email_type='boba_weekly_motivation',
            sent=False,
            failed=False
        ).exists()
        
        if not existing_schedule:
            # Schedule next weekly motivation
            EmailSchedule.objects.create(
                user=profile.user,
                email_type='boba_weekly_motivation',
                scheduled_for=timezone.now() + timedelta(days=7),
                is_volunteer=True,
                metadata={'recurring': True, 'interval_days': 7}
            )
    
    logger.info(f"Scheduled weekly motivation emails for {active_volunteers.count()} volunteers")


def schedule_streak_reminders():
    """Schedule streak reminder emails for volunteers with active streaks"""
    from .models import VolunteerProfile, EmailSchedule
    from django.utils import timezone
    from datetime import timedelta
    
    # Get volunteers with streaks >= 3 days who haven't been active today
    volunteers_with_streaks = VolunteerProfile.objects.filter(
        current_streak__gte=3,
        last_activity_date__lt=timezone.now().date()
    )
    
    for profile in volunteers_with_streaks:
        # Check if they already have a pending streak reminder
        existing_reminder = EmailSchedule.objects.filter(
            user=profile.user,
            email_type='streak_reminder',
            sent=False,
            failed=False,
            scheduled_for__gte=timezone.now().date()
        ).exists()
        
        if not existing_reminder:
            # Schedule streak reminder for tomorrow if they don't log in today
            EmailSchedule.objects.create(
                user=profile.user,
                email_type='streak_reminder',
                scheduled_for=timezone.now() + timedelta(hours=20),  # Evening reminder
                is_volunteer=True,
                metadata={'streak_days': profile.current_streak}
            )
    
    logger.info(f"Scheduled streak reminders for {volunteers_with_streaks.count()} volunteers")


# Management command helper for sending scheduled emails
def send_scheduled_emails():
    """Send any due scheduled emails"""
    from .models import EmailSchedule
    
    due_emails = EmailSchedule.objects.filter(
        scheduled_for__lte=timezone.now(),
        sent=False,
        failed=False
    )
    
    for email_schedule in due_emails:
        try:
            if email_schedule.email_type == 'layer_up':
                email_service.send_layer_up_email(
                    email_schedule.user, 
                    email_schedule.is_volunteer
                )
            elif email_schedule.email_type == 'engagement':
                email_service.send_engagement_email(
                    email_schedule.user, 
                    email_schedule.is_volunteer
                )
            elif email_schedule.email_type == 'streak_reminder':
                # Get current streak from user profile
                from .models import VolunteerProfile
                profile, _ = VolunteerProfile.objects.get_or_create(user=email_schedule.user)
                email_service.send_streak_reminder(
                    email_schedule.user,
                    profile.current_streak
                )
            elif email_schedule.email_type == 'boba_weekly_motivation':
                email_service.send_boba_weekly_motivation(email_schedule.user)
                
                # If this is a recurring email, schedule the next one
                if email_schedule.metadata and email_schedule.metadata.get('recurring'):
                    interval_days = email_schedule.metadata.get('interval_days', 7)
                    EmailSchedule.objects.create(
                        user=email_schedule.user,
                        email_type='boba_weekly_motivation',
                        scheduled_for=timezone.now() + timedelta(days=interval_days),
                        is_volunteer=email_schedule.is_volunteer,
                        metadata=email_schedule.metadata
                    )
            
            email_schedule.sent = True
            email_schedule.sent_at = timezone.now()
            email_schedule.save()
            
            logger.info(f"Sent scheduled email {email_schedule.email_type} to {email_schedule.user.email}")
            
        except Exception as e:
            logger.error(f"Failed to send scheduled email {email_schedule.id}: {str(e)}")
            email_schedule.failed = True
            email_schedule.error_message = str(e)
            email_schedule.save()
