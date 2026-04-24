from rest_framework import serializers
from .models import Field, FieldNote
from apps.accounts.serializers import UserSerializer


class FieldNoteSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = FieldNote
        fields = ["id", "field", "author", "content", "created_at", "updated_at"]
        read_only_fields = ["author", "created_at", "updated_at"]


class FieldSerializer(serializers.ModelSerializer):
    assigned_agent_details = UserSerializer(source="assigned_agent", read_only=True)
    notes = FieldNoteSerializer(many=True, read_only=True)

    class Meta:
        model = Field
        fields = [
            "id", "name", "crop_type", "planting_date", "current_stage",
            "status", "assigned_agent", "assigned_agent_details", "location",
            "size_hectares", "last_updated_at", "is_archived", "created_at",
            "notes"
        ]
        read_only_fields = ["status", "last_updated_at", "created_at"]