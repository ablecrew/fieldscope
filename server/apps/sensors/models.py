import uuid
from django.db import models
from django.conf import settings

class Sensor(models.Model):
    STATUS_CHOICES = [
        ("Online", "Online"),
        ("Offline", "Offline"),
        ("Maintenance", "Maintenance"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sensor_code = models.CharField(max_length=100, unique=True)
    field = models.ForeignKey("fields.Field", on_delete=models.SET_NULL, null=True, blank=True, related_name="sensors")
    sensor_type = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Online")
    deployed_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.sensor_code} - {self.sensor_type}"