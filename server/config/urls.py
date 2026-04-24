# config/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse


def cors_preflight(request, *args, **kwargs):
    """Handle preflight OPTIONS requests explicitly."""
    response = HttpResponse()
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    response["Access-Control-Allow-Headers"] = (
        "Accept, Accept-Encoding, Authorization, Content-Type, "
        "DNT, Origin, User-Agent, X-CSRFToken, X-Requested-With"
    )
    response["Access-Control-Max-Age"] = "86400"
    return response


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/fields/", include("apps.fields.urls")),
    path("api/notifications/", include("apps.notifications.urls")),
    path("api/activities/", include("apps.activities.urls")),
    path("api/tasks/", include("apps.tasks.urls")),
    path("api/sensors/", include("apps.sensors.urls")),
]