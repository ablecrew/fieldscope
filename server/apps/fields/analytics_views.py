from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Field


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        fields = Field.objects.filter(is_archived=False)

        if user.role == "agent":
            fields = fields.filter(assigned_agent=user)

        total = fields.count()
        active = fields.filter(status="Active").count()
        at_risk = fields.filter(status="At Risk").count()
        completed = fields.filter(status="Completed").count()

        stage_breakdown = {
            "Planted": fields.filter(current_stage="Planted").count(),
            "Growing": fields.filter(current_stage="Growing").count(),
            "Ready": fields.filter(current_stage="Ready").count(),
            "Harvested": fields.filter(current_stage="Harvested").count(),
        }

        insights = []
        if at_risk > 0:
            insights.append(f"{at_risk} field(s) need urgent attention.")
        if stage_breakdown["Ready"] > 0:
            insights.append(f"{stage_breakdown['Ready']} field(s) are ready for harvest.")
        if completed > 0:
            insights.append(f"{completed} field(s) have completed their lifecycle.")

        return Response({
            "total_fields": total,
            "status_breakdown": {
                "active": active,
                "at_risk": at_risk,
                "completed": completed,
            },
            "stage_breakdown": stage_breakdown,
            "insights": insights,
        })