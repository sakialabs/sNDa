"""
Celery tasks for automated email scheduling and sending
"""

from celery import shared_task
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)


@shared_task
def send_scheduled_emails_task():
    """Celery task to send scheduled emails"""
    from .email_system import send_scheduled_emails
    
    try:
        send_scheduled_emails()
        logger.info("Scheduled emails task completed successfully")
        return "Scheduled emails sent successfully"
    except Exception as e:
        logger.error(f"Failed to send scheduled emails: {str(e)}")
        raise


@shared_task
def schedule_weekly_motivation_task():
    """Celery task to schedule weekly motivation emails"""
    from .email_system import schedule_weekly_motivation_emails
    
    try:
        schedule_weekly_motivation_emails()
        logger.info("Weekly motivation emails scheduled successfully")
        return "Weekly motivation emails scheduled"
    except Exception as e:
        logger.error(f"Failed to schedule weekly motivation emails: {str(e)}")
        raise


@shared_task
def schedule_streak_reminders_task():
    """Celery task to schedule streak reminder emails"""
    from .email_system import schedule_streak_reminders
    
    try:
        schedule_streak_reminders()
        logger.info("Streak reminders scheduled successfully")
        return "Streak reminders scheduled"
    except Exception as e:
        logger.error(f"Failed to schedule streak reminders: {str(e)}")
        raise


@shared_task
def onboarding_email_sequence_task(user_id, is_volunteer=True):
    """Celery task to handle onboarding email sequence"""
    from .email_system import schedule_onboarding_emails
    
    try:
        schedule_onboarding_emails(user_id, is_volunteer)
        logger.info(f"Onboarding sequence started for user {user_id}")
        return f"Onboarding sequence scheduled for user {user_id}"
    except Exception as e:
        logger.error(f"Failed to schedule onboarding for user {user_id}: {str(e)}")
        raise


@shared_task
def send_assignment_notification_task(assignment_id):
    """Celery task to send assignment notification"""
    from .models import Assignment
    from .email_system import email_service
    
    try:
        assignment = Assignment.objects.get(id=assignment_id)
        email_service.send_assignment_notification(assignment)
        logger.info(f"Assignment notification sent for assignment {assignment_id}")
        return f"Assignment notification sent for {assignment_id}"
    except Assignment.DoesNotExist:
        logger.error(f"Assignment {assignment_id} not found")
        raise
    except Exception as e:
        logger.error(f"Failed to send assignment notification {assignment_id}: {str(e)}")
        raise


@shared_task
def send_story_published_notification_task(story_id):
    """Celery task to send story published notification"""
    from .models import VolunteerStory
    from .email_system import email_service
    
    try:
        story = VolunteerStory.objects.get(id=story_id)
        email_service.send_story_published_notification(story)
        logger.info(f"Story published notification sent for story {story_id}")
        return f"Story published notification sent for {story_id}"
    except VolunteerStory.DoesNotExist:
        logger.error(f"Story {story_id} not found")
        raise
    except Exception as e:
        logger.error(f"Failed to send story published notification {story_id}: {str(e)}")
        raise


@shared_task
def send_donation_confirmation_task(donation_data):
    """Celery task to send donation confirmation"""
    from .email_system import email_service
    
    try:
        email_service.send_donation_confirmation(donation_data)
        logger.info(f"Donation confirmation sent to {donation_data.get('donor_email')}")
        return f"Donation confirmation sent"
    except Exception as e:
        logger.error(f"Failed to send donation confirmation: {str(e)}")
        raise


@shared_task
def send_case_status_update_task(case_id, recipient_email, status_change):
    """Celery task to send case status update"""
    from .models import Case
    from .email_system import email_service
    
    try:
        case = Case.objects.get(id=case_id)
        email_service.send_case_status_update(case, recipient_email, status_change)
        logger.info(f"Case status update sent for case {case_id}")
        return f"Case status update sent for {case_id}"
    except Case.DoesNotExist:
        logger.error(f"Case {case_id} not found")
        raise
    except Exception as e:
        logger.error(f"Failed to send case status update {case_id}: {str(e)}")
        raise


# Periodic tasks setup (add to celery beat schedule)
CELERY_BEAT_SCHEDULE = {
    'send-scheduled-emails': {
        'task': 'api.tasks.send_scheduled_emails_task',
        'schedule': 300.0,  # Every 5 minutes
    },
    'schedule-weekly-motivation': {
        'task': 'api.tasks.schedule_weekly_motivation_task',
        'schedule': 86400.0,  # Daily
    },
    'schedule-streak-reminders': {
        'task': 'api.tasks.schedule_streak_reminders_task',
        'schedule': 3600.0,  # Every hour
    },
}
