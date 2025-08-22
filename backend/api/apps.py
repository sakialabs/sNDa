from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
    
    def ready(self):
        import api.signals  # Import signals to register them
        from api.signals import create_default_badges
        create_default_badges()  # Create default badges on startup
