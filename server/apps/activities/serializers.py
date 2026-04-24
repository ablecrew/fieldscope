from rest_framework import serializers
from .models import Activity
from apps.accounts.serializers import UserSerializer

class ActivitySerializer(serializers.ModelSerializer):
    actor = UserSerializer(read_only=True)

    class Meta:
        model = Activity
        fields = ["id", "actor", "action", "target_type", "target_id", "description", "created_at"]