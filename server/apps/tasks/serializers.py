from rest_framework import serializers
from .models import Task
from apps.accounts.serializers import UserSerializer
from apps.fields.serializers import FieldSerializer

class TaskSerializer(serializers.ModelSerializer):
    assigned_agent_details = UserSerializer(source="assigned_agent", read_only=True)
    field_details = FieldSerializer(source="field", read_only=True)

    class Meta:
        model = Task
        fields = [
            "id", "title", "description", "field", "field_details",
            "assigned_agent", "assigned_agent_details", "priority",
            "due_date", "is_completed", "created_by", "created_at", "updated_at"
        ]
        read_only_fields = ["created_by", "created_at", "updated_at"]