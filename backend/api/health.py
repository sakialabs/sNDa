from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    """
    Health check endpoint for Render deployment monitoring.
    Returns basic system status and database connectivity.
    """
    try:
        # Test database connection
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            db_status = "healthy"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    # Test Celery broker connection (non-blocking)
    try:
        from celery import current_app
        # Just check if we can import and access the app, don't ping workers
        celery_status = "configured" if current_app else "not configured"
    except Exception as e:
        celery_status = f"error: {str(e)}"
    
    return JsonResponse({
        "status": "healthy",
        "service": "sNDa Backend API",
        "database": db_status,
        "celery": celery_status,
        "version": "1.0.0"
    })
