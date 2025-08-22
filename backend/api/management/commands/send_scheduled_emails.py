"""
Django management command to send scheduled emails and manage email automation
Run with: python manage.py send_scheduled_emails
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from api.email_system import (
    send_scheduled_emails, 
    schedule_weekly_motivation_emails,
    schedule_streak_reminders
)
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Send scheduled emails and manage email automation'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what emails would be sent without actually sending them',
        )
        parser.add_argument(
            '--email-type',
            type=str,
            help='Only send emails of specific type (e.g., welcome, assignment_notification)',
        )
        parser.add_argument(
            '--user-email',
            type=str,
            help='Only send emails to specific user email',
        )
        parser.add_argument(
            '--schedule-weekly',
            action='store_true',
            help='Schedule weekly motivation emails for active volunteers',
        )
        parser.add_argument(
            '--schedule-streaks',
            action='store_true',
            help='Schedule streak reminder emails for volunteers with active streaks',
        )
        parser.add_argument(
            '--setup-automation',
            action='store_true',
            help='Set up all recurring email automation (weekly + streaks)',
        )
    
    def handle(self, *args, **options):
        dry_run = options['dry_run']
        email_type = options.get('email_type')
        user_email = options.get('user_email')
        schedule_weekly = options['schedule_weekly']
        schedule_streaks = options['schedule_streaks']
        setup_automation = options['setup_automation']
        
        if setup_automation:
            self.stdout.write('Setting up email automation...')
            schedule_weekly_motivation_emails()
            schedule_streak_reminders()
            self.stdout.write(
                self.style.SUCCESS('Email automation setup complete!')
            )
            return
        
        if schedule_weekly:
            self.stdout.write('Scheduling weekly motivation emails...')
            schedule_weekly_motivation_emails()
            self.stdout.write(
                self.style.SUCCESS('Weekly motivation emails scheduled!')
            )
            return
        
        if schedule_streaks:
            self.stdout.write('Scheduling streak reminder emails...')
            schedule_streak_reminders()
            self.stdout.write(
                self.style.SUCCESS('Streak reminder emails scheduled!')
            )
            return
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING('DRY RUN MODE - No emails will be sent')
            )
            
            # Show what would be sent
            from api.models import EmailSchedule
            
            query = EmailSchedule.objects.filter(
                scheduled_for__lte=timezone.now(),
                sent=False,
                failed=False
            )
            
            if email_type:
                query = query.filter(email_type=email_type)
            
            if user_email:
                query = query.filter(user__email=user_email)
            
            pending_emails = query.all()
            
            if pending_emails:
                self.stdout.write(f'Found {len(pending_emails)} emails to send:')
                for email in pending_emails:
                    self.stdout.write(
                        f'  - {email.email_type} to {email.user.email} '
                        f'(scheduled for {email.scheduled_for})'
                    )
            else:
                self.stdout.write('No pending emails found.')
        else:
            self.stdout.write('Sending scheduled emails...')
            send_scheduled_emails()
            self.stdout.write(
                self.style.SUCCESS('Successfully processed scheduled emails')
            )
            return
        
        self.stdout.write(
            self.style.SUCCESS('Scheduled emails processed successfully!')
        )
        
        try:
            if dry_run:
                self._dry_run_preview(email_type, user_email)
            else:
                send_scheduled_emails()
                self.stdout.write(
                    self.style.SUCCESS('Scheduled emails processed successfully!')
                )
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error processing scheduled emails: {str(e)}')
            )
            logger.error(f'Scheduled email processing failed: {str(e)}')

    def _dry_run_preview(self, email_type_filter=None, user_email_filter=None):
        """Preview what emails would be sent"""
        from api.models import EmailSchedule
        
        query = EmailSchedule.objects.filter(
            scheduled_for__lte=timezone.now(),
            sent=False,
            failed=False
        )
        
        if email_type_filter:
            query = query.filter(email_type=email_type_filter)
        
        if user_email_filter:
            query = query.filter(user__email=user_email_filter)
        
        due_emails = query.order_by('scheduled_for')
        
        if not due_emails:
            self.stdout.write(
                self.style.WARNING('No scheduled emails due for sending.')
            )
            return
        
        self.stdout.write(
            self.style.SUCCESS(f'Found {due_emails.count()} emails ready to send:')
        )
        
        for email in due_emails:
            self.stdout.write(
                f'  • {email.email_type} → {email.user.email} '
                f'(scheduled: {email.scheduled_for.strftime("%Y-%m-%d %H:%M")})'
            )
