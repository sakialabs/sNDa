import os
from celery import Celery
from django.conf import settings

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('snda_backend')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

# Celery Beat Schedule for periodic tasks
app.conf.beat_schedule = {
    'send-weekly-motivation-emails': {
        'task': 'api.tasks.send_weekly_motivation_emails',
        'schedule': 604800.0,  # Every week (7 days * 24 hours * 60 minutes * 60 seconds)
        'options': {'queue': 'default'}
    },
    'send-streak-reminders': {
        'task': 'api.tasks.send_streak_reminders',
        'schedule': 86400.0,  # Every day (24 hours * 60 minutes * 60 seconds)
        'options': {'queue': 'default'}
    },
    'process-scheduled-emails': {
        'task': 'api.tasks.process_scheduled_emails',
        'schedule': 300.0,  # Every 5 minutes
        'options': {'queue': 'default'}
    },
}

app.conf.timezone = 'UTC'

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
