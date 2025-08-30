# 📬 sNDa Email System Documentation

## Overview

The sNDa platform features a comprehensive, automated email system designed to create warm, engaging, and personalized communication with volunteers and donors. The system includes onboarding sequences, transactional emails, and motivational content powered by Boba AI.

- Emoji branding used throughout for clarity and warmth: 🥪🌟

## 🏗️ Architecture

### Core Components

1. **EmailService** (`api/email_system.py`) - Central service for all email operations
2. **Email Templates** (`templates/emails/`) - Responsive HTML templates with sNDa branding
3. **Email Scheduling** (`api/models.py:EmailSchedule`) - Database-driven email scheduling
4. **Celery Tasks** (`api/tasks.py`) - Asynchronous email processing
5. **Management Commands** - CLI tools for email automation

### 📬 Email Types

#### Onboarding Sequence (3-Step)

- **Day 0: Welcome Email** (`welcome.html`) - Platform introduction and first steps
- **Day 2-3: Layer Up Email** (`layer_up.html`) - Skills and engagement building
- **Day 5-7: Engagement Email** (`engagement.html`) - First actions and community stats

#### Transactional Emails

- **Assignment Notification** (`assignment_notification.html`) - New case assignments
- **Story Published** (`story_published.html`) - Story approval notifications
- **Donation Confirmation** (`donation_confirmation.html`) - Payment receipts
- **Case Status Update** (`case_status_update.html`) - Progress notifications

#### Motivational Emails

- **Streak Reminder** (`streak_reminder.html`) - Activity streak maintenance
- **Boba Weekly Motivation** (`boba_weekly_motivation.html`) - Personalized weekly check-ins

## Email Templates

### Base Template Structure

All emails extend `base_email.html` which provides:
- Consistent sNDa branding and colors
- Responsive design for mobile/desktop
- Header with logo and navigation
- Footer with unsubscribe links
- Boba AI signature styling

### Template Features

- **Inline CSS** for email client compatibility
- **Responsive design** with mobile-first approach
- **Emoji integration** for visual appeal
- **Dynamic content** with Django template variables
- **Call-to-action buttons** with consistent styling
- **Progress bars** and visual elements

## 🛠️ Configuration

### Email Backend Setup

```python
# settings.py
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.sendgrid.net'  # or Mailgun
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('SENDGRID_USERNAME')
EMAIL_HOST_PASSWORD = os.environ.get('SENDGRID_PASSWORD')
DEFAULT_FROM_EMAIL = 'snda@hey.com'
```

### Environment Variables

```bash
SENDGRID_API_KEY=your_sendgrid_api_key
MAILGUN_API_KEY=your_mailgun_api_key
FRONTEND_URL=http://localhost:3000
```

## 📦 Usage

### Triggering Emails Programmatically

```python
from api.email_system import email_service

# Send welcome email
email_service.send_welcome_email(user, is_volunteer=True)

# Send assignment notification
email_service.send_assignment_notification(assignment)

# Send donation confirmation
donation_data = {
    'donor_name': 'John Doe',
    'donor_email': 'john@example.com',
    'amount': 100,
    'campaign_name': 'Emergency Relief',
    'transaction_id': 'txn_123'
}
email_service.send_donation_confirmation(donation_data)
```

### 📅 Scheduling Emails

```python
from api.email_system import schedule_onboarding_emails

# Schedule 3-step onboarding sequence
schedule_onboarding_emails(user.id, is_volunteer=True)
```

### Using Celery Tasks

```python
from api.tasks import (
    send_assignment_notification_task,
    onboarding_email_sequence_task
)

# Async email sending
send_assignment_notification_task.delay(assignment.id)
onboarding_email_sequence_task.delay(user.id, is_volunteer=True)
```

## Management Commands

### Send Scheduled Emails

```bash
# Send all due emails
python manage.py send_scheduled_emails

# Dry run to preview emails
python manage.py send_scheduled_emails --dry-run

# Send specific email type
python manage.py send_scheduled_emails --email-type=welcome

# Setup automation (weekly + streak reminders)
python manage.py send_scheduled_emails --setup-automation
```

### Schedule Recurring Emails

```bash
# Schedule weekly motivation emails
python manage.py send_scheduled_emails --schedule-weekly

# Schedule streak reminders
python manage.py send_scheduled_emails --schedule-streaks
```

## Celery Integration

### Celery Beat Schedule

```python
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
```

### Starting Celery

```bash
# Start Celery worker
celery -A config worker -l info

# Start Celery beat scheduler
celery -A config beat -l info
```

## 📝 Email Content Guidelines

### 🤖 Boba AI Personality

- **Friendly and warm** - Use conversational tone
- **Sandwich metaphor** - Layer building, ingredients, flavors
- **Motivational** - Encourage and celebrate achievements
- **Community-focused** - Emphasize collective impact
- **Consistent emojis** - 🥪 🌟 🤖 for branding

### Subject Line Patterns

- Welcome: "🥪 Welcome to sNDa - Your First Bite of Solidarity"
- Assignment: "🌟 A New Case Needs Your Touch, [Name]!"
- Story: "🎉 Your Story is Live on the Wall of Love!"
- Motivation: "🤖 Boba's Weekly Check-in: You're on Fire, [Name]!"

### Content Structure

1. **Boba Introduction** - Personal greeting from AI assistant
2. **Main Content** - Key information or call-to-action
3. **Visual Elements** - Progress bars, stats, emojis
4. **Action Buttons** - Clear next steps
5. **Boba Signature** - Motivational closing message

## Monitoring and Analytics

### Email Tracking

- **Delivery Status** - Success/failure logging
- **Schedule Tracking** - EmailSchedule model records
- **Error Handling** - Failed email retry logic
- **Performance Metrics** - Send time and success rates

### Logging

```python
import logging
logger = logging.getLogger('email_system')

# Email events are logged with:
logger.info(f"Email sent: {email_type} to {recipient}")
logger.error(f"Email failed: {error_message}")
```

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check email backend configuration
   - Verify API keys and credentials
   - Review Django email settings

2. **Templates not rendering**
   - Ensure template directory in TEMPLATES setting
   - Check template syntax and context variables
   - Verify template inheritance

3. **Scheduled emails not processing**
   - Run management command manually
   - Check EmailSchedule records in database
   - Verify Celery worker is running

4. **CSS not displaying**
   - Use inline styles for email clients
   - Test across different email providers
   - Avoid external CSS references

### 🐛 Debugging Commands

```bash
# Check scheduled emails
python manage.py send_scheduled_emails --dry-run

# Test email configuration
python manage.py shell
>>> from django.core.mail import send_mail
>>> send_mail('Test', 'Message', 'from@example.com', ['to@example.com'])

# View email logs
tail -f logs/email.log
```

## 🛡️ Security Considerations

1. **API Key Protection** - Use environment variables
2. **Unsubscribe Links** - Include in all emails
3. **Rate Limiting** - Prevent email spam
4. **Data Privacy** - Minimal personal data in emails
5. **GDPR Compliance** - Respect user preferences

## 🚀 Future Enhancements

1. **Email Analytics Dashboard** - Open rates, click tracking
2. **A/B Testing** - Subject line and content optimization
3. **Advanced Personalization** - ML-driven content
4. **Multi-language Support** - Arabic email templates
5. **Email Preferences** - User-controlled frequency settings

## 📲 API Integration

### 🌐 REST Endpoints

```python
# Send immediate email
POST /api/emails/send/
{
    "email_type": "assignment_notification",
    "recipient": "user@example.com",
    "context": {...}
}

# Schedule email
POST /api/emails/schedule/
{
    "email_type": "boba_weekly_motivation",
    "user_id": 123,
    "scheduled_for": "2024-01-15T10:00:00Z"
}
```

This email system provides a robust foundation for engaging sNDa community members through personalized, automated communication that scales with platform growth.

## Email System Testing Guide

## 🧪 Pre-Deployment Testing Checklist

### 1. Environment Setup

```bash
# Install new dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser if needed
python manage.py createsuperuser
```

### 2. Email Backend Configuration Test

```python
# Test in Django shell
python manage.py shell

>>> from django.core.mail import send_mail
>>> send_mail(
...     'Test Email',
...     'This is a test message.',
...     'snda@hey.com',
...     ['your-email@example.com'],
...     fail_silently=False,
... )
# Should return 1 if successful
```

### 3. Email Service Unit Tests

```bash
# Run email system tests
python manage.py test api.tests.test_email_system

# Test specific email types
python manage.py shell
>>> from api.email_system import email_service
>>> from django.contrib.auth.models import User

# Test welcome email
>>> user = User.objects.first()
>>> email_service.send_welcome_email(user, is_volunteer=True)

# Test assignment notification (create test assignment first)
>>> from api.models import Assignment, Case, VolunteerProfile
>>> assignment = Assignment.objects.first()
>>> email_service.send_assignment_notification(assignment)
```

### 4. Email Scheduling Tests

```bash
# Test onboarding sequence
python manage.py shell
>>> from api.email_system import schedule_onboarding_emails
>>> user = User.objects.first()
>>> schedule_onboarding_emails(user.id, is_volunteer=True)

# Check scheduled emails
>>> from api.models import EmailSchedule
>>> EmailSchedule.objects.filter(user=user)
```

### 5. Management Command Tests

```bash
# Dry run to see what would be sent
python manage.py send_scheduled_emails --dry-run

# Setup automation
python manage.py send_scheduled_emails --setup-automation

# Schedule weekly motivation
python manage.py send_scheduled_emails --schedule-weekly

# Schedule streak reminders
python manage.py send_scheduled_emails --schedule-streaks
```

### 6. Celery Integration Tests

```bash
# Start Redis (if using Redis broker)
redis-server

# Start Celery worker in separate terminal
celery -A config worker -l info

# Start Celery beat scheduler in another terminal
celery -A config beat -l info

# Test async email sending
python manage.py shell
>>> from api.tasks import send_assignment_notification_task
>>> assignment = Assignment.objects.first()
>>> send_assignment_notification_task.delay(assignment.id)
```

### 7. Template Rendering Tests

```bash
# Test template rendering
python manage.py shell
>>> from django.template.loader import render_to_string
>>> context = {
...     'user_name': 'Test User',
...     'is_volunteer': True,
...     'platform_url': 'http://localhost:3000'
... }
>>> html = render_to_string('emails/welcome.html', context)
>>> print(html[:200])  # Check first 200 chars
```

### 8. Email Analytics Tests

```bash
# Check analytics model
python manage.py shell
>>> from api.models import EmailAnalytics
>>> EmailAnalytics.objects.all()

# Create test analytics record
>>> analytics = EmailAnalytics.objects.create(
...     email_type='welcome',
...     recipient_email='test@example.com',
...     subject='Welcome to sNDa',
...     delivery_status='delivered'
... )
```

## 🔍 Integration Testing Scenarios

### Scenario 1: New Volunteer Registration

1. Create new user account
2. Verify welcome email is sent immediately
3. Check that onboarding sequence is scheduled
4. Verify volunteer profile is created

### Scenario 2: Assignment Workflow

1. Create new case
2. Assign to volunteer
3. Verify assignment notification email
4. Complete assignment
5. Check completion email and streak update

### Scenario 3: Story Publication

1. Create volunteer story
2. Publish story
3. Verify publication notification
4. Check community stats update

### Scenario 4: Weekly Motivation Flow

1. Run weekly motivation scheduler
2. Verify emails are scheduled for active volunteers
3. Process scheduled emails
4. Check next week's emails are auto-scheduled

## 🐛 Common Issues & Solutions

### Email Not Sending

- Check email backend configuration
- Verify API keys in environment variables
- Test SMTP connection manually

### Templates Not Rendering

- Ensure templates directory is in TEMPLATES setting
- Check template syntax and inheritance
- Verify context variables are passed correctly

### Celery Tasks Failing

- Ensure Redis/RabbitMQ is running
- Check Celery worker logs
- Verify task imports are correct

### Scheduled Emails Not Processing

- Run management command manually
- Check EmailSchedule records in database
- Verify scheduled_for dates are correct

## 📊 Performance Testing

### Load Testing Email System

```python
# Test bulk email sending
python manage.py shell
>>> from api.email_system import email_service
>>> from django.contrib.auth.models import User
>>> users = User.objects.all()[:10]  # Test with 10 users
>>> for user in users:
...     email_service.send_welcome_email(user)
```

### Database Performance

```sql
-- Check email schedule query performance
EXPLAIN ANALYZE SELECT * FROM api_emailschedule 
WHERE scheduled_for <= NOW() AND sent = false;

-- Check analytics queries
EXPLAIN ANALYZE SELECT email_type, COUNT(*) 
FROM api_emailanalytics 
GROUP BY email_type;
```

## ✅ Pre-Production Checklist

- [ ] All unit tests pass
- [ ] Email backend configured with production credentials
- [ ] Celery workers running and monitored
- [ ] Redis/broker configured and secured
- [ ] Email templates tested across email clients
- [ ] Rate limiting configured to prevent spam
- [ ] Monitoring and alerting setup for email failures
- [ ] Unsubscribe functionality implemented
- [ ] GDPR compliance verified
- [ ] Error handling and retry logic tested

## 🚀 Production Deployment Steps

1. **Environment Variables**

   ```bash
   export SENDGRID_API_KEY=your_production_key
   export REDIS_URL=redis://localhost:6379/0
   export CELERY_BROKER_URL=redis://localhost:6379/0
   ```

2. **Database Migration**

   ```bash
   python manage.py migrate --settings=config.settings.production
   ```

3. **Static Files**

   ```bash
   python manage.py collectstatic --noinput
   ```

4. **Start Services**

   ```bash
   # Start web server
   gunicorn config.wsgi:application

   # Start Celery worker
   celery -A config worker -l info

   # Start Celery beat
   celery -A config beat -l info
   ```

5. **Setup Automation**

   ```bash
   python manage.py send_scheduled_emails --setup-automation
   ```

This comprehensive testing approach ensures your email system is bulletproof before deployment! 🎯
