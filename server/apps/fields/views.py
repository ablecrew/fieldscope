from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import Field, FieldNote
from .serializers import FieldSerializer, FieldNoteSerializer
from apps.accounts.permissions import IsAdminRole
from apps.activities.models import Activity
from apps.notifications.models import Notification


class FieldListCreateView(generics.ListCreateAPIView):
    serializer_class = FieldSerializer

    def get_queryset(self):
        if self.request.user.role == "agent":
            return Field.objects.filter(assigned_agent=self.request.user, is_archived=False)
        return Field.objects.filter(is_archived=False)

    def perform_create(self, serializer):
        field = serializer.save(created_by=self.request.user)
        Activity.objects.create(
            actor=self.request.user,
            action="created",
            target_type="field",
            target_id=field.id,
            description=f"Created field: {field.name}"
        )


class FieldDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FieldSerializer

    def get_queryset(self):
        if self.request.user.role == "agent":
            return Field.objects.filter(assigned_agent=self.request.user)
        return Field.objects.all()

    def perform_update(self, serializer):
        old_stage = self.get_object().current_stage
        field = serializer.save(last_updated_at=timezone.now())

        if old_stage != field.current_stage:
            Activity.objects.create(
                actor=self.request.user,
                action="updated_stage",
                target_type="field",
                target_id=field.id,
                description=f"Changed stage from {old_stage} to {field.current_stage}"
            )


class FieldNoteListCreateView(generics.ListCreateAPIView):
    serializer_class = FieldNoteSerializer

    def get_queryset(self):
        return FieldNote.objects.filter(field_id=self.kwargs["field_id"])

    def perform_create(self, serializer):
        field = Field.objects.get(pk=self.kwargs["field_id"])
        note = serializer.save(author=self.request.user, field=field)
        field.last_updated_at = timezone.now()
        field.save()

        Activity.objects.create(
            actor=self.request.user,
            action="added_note",
            target_type="field_note",
            target_id=note.id,
            description=f"Added note to {field.name}"
        )

class FieldNoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FieldNoteSerializer

    def get_queryset(self):
                return FieldNote.objects.all()

    def perform_update(self, serializer):
                from django.utils import timezone
                serializer.save(updated_at=timezone.now())


class ArchiveFieldView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        field = Field.objects.get(pk=pk)
        field.is_archived = not field.is_archived
        field.save()
        return Response({"detail": "Field archived/unarchived successfully"})