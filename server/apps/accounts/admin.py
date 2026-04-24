from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("email", "full_name", "role", "is_active", "is_archived")
    list_filter = ("role", "is_active", "is_archived")
    search_fields = ("email", "full_name")
    ordering = ("-created_at",)