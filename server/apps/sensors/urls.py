from django.urls import path
from .views import SensorListCreateView, SensorDetailView

urlpatterns = [
    path("", SensorListCreateView.as_view(), name="sensor-list"),
    path("<uuid:pk>/", SensorDetailView.as_view(), name="sensor-detail"),
]