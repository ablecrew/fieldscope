from rest_framework import serializers
from .models import Sensor
from apps.accounts.serializers import UserSerializer

class SensorSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Sensor
        fields = ["id", "sensor_code", "field", "sensor_type", "status", "deployed_at", "created_by"]