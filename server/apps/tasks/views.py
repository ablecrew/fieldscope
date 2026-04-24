from rest_framework import generics, permissions
from .models import Task
from .serializers import TaskSerializer
from apps.accounts.permissions import IsAdminRole

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "agent":
            return Task.objects.filter(assigned_agent=user)
        return Task.objects.all()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Task.objects.all()
        if user.role == "agent":
            qs = qs.filter(assigned_agent=user)
        return qs