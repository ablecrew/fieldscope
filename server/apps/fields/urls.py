from django.urls import path
from .views import (
    FieldListCreateView, FieldDetailView,
    FieldNoteListCreateView, FieldNoteDetailView,
    ArchiveFieldView,
)
from .analytics_views import DashboardSummaryView

urlpatterns = [
    path("", FieldListCreateView.as_view(), name="field-list"),
    path("summary/", DashboardSummaryView.as_view(), name="field-summary"),
    path("<uuid:pk>/", FieldDetailView.as_view(), name="field-detail"),
    path("<uuid:pk>/archive/", ArchiveFieldView.as_view(), name="field-archive"),
    path("<uuid:field_id>/notes/", FieldNoteListCreateView.as_view(), name="field-notes"),
    path("notes/<uuid:pk>/", FieldNoteDetailView.as_view(), name="field-note-detail"),
]