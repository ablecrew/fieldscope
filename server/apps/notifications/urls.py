from django.urls import path
from .views import NotificationListView, UnreadCountView, MarkAsReadView

urlpatterns = [
    path("", NotificationListView.as_view(), name="notification-list"),
    path("unread-count/", UnreadCountView.as_view(), name="unread-count"),
    path("<uuid:pk>/read/", MarkAsReadView.as_view(), name="mark-read"),
]