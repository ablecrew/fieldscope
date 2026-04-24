from django.contrib import admin
from .models import Sensor

@admin.register(Sensor)
class SensorAdmin(admin.ModelAdmin):
    list_display = ("sensor_code", "sensor_type", "status", "field", "deployed_at")
    list_filter = ("status", "sensor_type")