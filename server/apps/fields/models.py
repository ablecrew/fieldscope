import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone


class Field(models.Model):
    STAGE_CHOICES = [
        ("Planted", "Planted"),
        ("Growing", "Growing"),
        ("Ready", "Ready"),
        ("Harvested", "Harvested"),
    ]
    STATUS_CHOICES = [
        ("Active", "Active"),
        ("At Risk", "At Risk"),
        ("Completed", "Completed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    crop_type = models.CharField(max_length=100)
    planting_date = models.DateField()
    current_stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default="Planted")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")
    assigned_agent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_fields",
        limit_choices_to={"role": "agent"},
    )
    location = models.CharField(max_length=255, blank=True, null=True)
    size_hectares = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    last_updated_at = models.DateTimeField(default=timezone.now)
    is_archived = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_fields",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def compute_status(self):
        if self.current_stage == "Harvested":
            return "Completed"
        days_since_update = (timezone.now() - self.last_updated_at).days
        if days_since_update > 14:
            return "At Risk"
        return "Active"

    def save(self, *args, **kwargs):
        self.status = self.compute_status()
        if not self.pk:  # New field
            self.created_by = kwargs.pop("created_by", None)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class FieldNote(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name="notes")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Note on {self.field.name}"
