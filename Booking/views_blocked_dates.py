from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils.dateparse import parse_date

from .models import PanditBlockedDate
from .serializers import PanditBlockedDateSerializer
from account.models import CustomUser  # adjust import if your User model path differs


@api_view(["GET", "POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def pandit_block_date_view(request):
    """
    GET  /api/pandit/blocked-dates/?start=YYYY-MM-DD&end=YYYY-MM-DD
    POST /api/pandit/blocked-dates/  body: { date: "YYYY-MM-DD", reason?: "" }
    """
    user = request.user

    if (user.role or "").lower() != "pandit":
        return Response({"message": "Only pandits can manage blocked dates."}, status=403)

    # -------- GET (list blocked dates for current pandit) --------
    if request.method == "GET":
        start = request.query_params.get("start")
        end = request.query_params.get("end")

        qs = PanditBlockedDate.objects.filter(pandit=user)

        if start and end:
            start_d = parse_date(start)
            end_d = parse_date(end)
            if not start_d or not end_d:
                return Response({"message": "Invalid start/end date."}, status=400)
            qs = qs.filter(date__range=[start_d, end_d])

        serializer = PanditBlockedDateSerializer(qs.order_by("date"), many=True)
        return Response(serializer.data, status=200)

    # -------- POST (block a date) --------
    date_str = request.data.get("date")
    reason = (request.data.get("reason") or "").strip()

    d = parse_date(date_str) if date_str else None
    if not d:
        return Response({"message": "Date is required in YYYY-MM-DD format."}, status=400)

    obj, created = PanditBlockedDate.objects.get_or_create(
        pandit=user,
        date=d,
        defaults={"reason": reason},
    )

    # If already exists, update reason if provided
    if not created and reason:
        obj.reason = reason
        obj.save(update_fields=["reason"])

    return Response(PanditBlockedDateSerializer(obj).data, status=201)


@api_view(["DELETE"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def pandit_unblock_date_view(request):
    """
    DELETE /api/pandit/blocked-dates/unblock/
    body: { date: "YYYY-MM-DD" }   (we also accept ?date=YYYY-MM-DD)
    """
    user = request.user

    if (user.role or "").lower() != "pandit":
        return Response({"message": "Only pandits can manage blocked dates."}, status=403)

    date_str = request.data.get("date") or request.query_params.get("date")
    d = parse_date(date_str) if date_str else None
    if not d:
        return Response({"message": "date is required (YYYY-MM-DD)."}, status=400)

    deleted, _ = PanditBlockedDate.objects.filter(pandit=user, date=d).delete()
    return Response({"message": "Unblocked", "deleted": deleted, "date": date_str}, status=200)


@api_view(["GET"])
@permission_classes([AllowAny])
def pandit_blocked_dates_public_view(request, pandit_id: int):
    """
    GET /api/pandits/<pandit_id>/blocked-dates/?start=YYYY-MM-DD&end=YYYY-MM-DD
    Returns: ["YYYY-MM-DD", ...]  (simple list for frontend calendar disable)
    """
    start = request.query_params.get("start")
    end = request.query_params.get("end")

    qs = PanditBlockedDate.objects.filter(pandit_id=pandit_id)

    if start and end:
        start_d = parse_date(start)
        end_d = parse_date(end)
        if start_d and end_d:
            qs = qs.filter(date__range=[start_d, end_d])

    # ✅ return list of strings (frontend expects this)
    return Response([b.date.isoformat() for b in qs], status=200)
