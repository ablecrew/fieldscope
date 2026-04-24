from rest_framework import generics
from apps.accounts.permissions import IsAdminRole
from .models import Sensor
from .serializers import SensorSerializer

class SensorListCreateView(generics.ListCreateAPIView):
    serializer_class = SensorSerializer
    permission_classes = [IsAdminRole]
    queryset = Sensor.objects.all().order_by("-deployed_at")


class SensorDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SensorSerializer
    permission_classes = [IsAdminRole]
    queryset = Sensor.objects.all()