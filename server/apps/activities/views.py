from rest_framework import generics, permissions
from .models import Activity
from .serializers import ActivitySerializer

class ActivityListView(generics.ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return Activity.objects.all()[:50]
        return Activity.objects.filter(actor=user)[:30]