from django.contrib import admin
from .models import Activity

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("actor", "action", "target_type", "created_at")
    list_filter = ("action", "target_type")
    search_fields = ("description",)
    ordering = ("-created_at",)