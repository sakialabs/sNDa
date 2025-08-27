# Email Configuration for sNDa Platform
# Add these settings to your main settings.py file

# Email Backend Configuration
# For development, use console backend to see emails in terminal
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# For production, use SMTP backend with your email service
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# SMTP Configuration (for production)
# EMAIL_HOST = 'smtp.sendgrid.net'  # or your email service SMTP
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = 'apikey'  # SendGrid uses 'apikey' as username
# EMAIL_HOST_PASSWORD = os.environ.get('SENDGRID_API_KEY')

# Alternative email services:
# Gmail SMTP:
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_HOST_USER = 'your-email@gmail.com'
# EMAIL_HOST_PASSWORD = 'your-app-password'

# Mailgun SMTP:
# EMAIL_HOST = 'smtp.mailgun.org'
# EMAIL_HOST_USER = 'postmaster@your-domain.mailgun.org'
# EMAIL_HOST_PASSWORD = os.environ.get('MAILGUN_SMTP_PASSWORD')

# Default email addresses
DEFAULT_FROM_EMAIL = 'sNDa Platform <snda@hey.com>'
SERVER_EMAIL = 'sNDa Server <snda@hey.com>'

# Frontend URL for email links
FRONTEND_URL = 'http://localhost:3000'  # Development
# FRONTEND_URL = 'https://your-domain.com'  # Production

# Email template settings
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),  # Add this line
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Logging configuration for email debugging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'email.log',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'api.email_system': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

# Celery configuration for scheduled emails (optional)
# CELERY_BROKER_URL = 'redis://localhost:6379/0'
# CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
# CELERY_ACCEPT_CONTENT = ['json']
# CELERY_TASK_SERIALIZER = 'json'
# CELERY_RESULT_SERIALIZER = 'json'
# CELERY_TIMEZONE = 'UTC'

# Cron job setup for scheduled emails (alternative to Celery)
# Add to your server's crontab:
# */15 * * * * cd /path/to/your/project && python manage.py send_scheduled_emails
# This runs every 15 minutes to check for due emails
