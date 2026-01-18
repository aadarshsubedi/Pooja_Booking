from datetime import date
from django.db.models import Sum
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from account.permissions import IsPandit
from .models import Booking
from .serializers import PanditBookingSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsPandit])
def pandit_dashboard_summary(request):
    user = request.user
    today = date.today()

    qs = Booking.objects.filter(pandit=user)

    pending = qs.filter(status="pending").count()
    confirmed = qs.filter(status="confirmed").count()
    completed = qs.filter(status="completed").count()
    cancelled = qs.filter(status="cancelled").count()

    upcoming = qs.filter(date__gte=today).exclude(status__in=["cancelled"]).count()

    earnings = qs.filter(payment_status="paid").aggregate(total=Sum("price"))["total"] or 0

    return Response({
        "pandit_username": user.username,
        "pending": pending,
        "confirmed": confirmed,
        "completed": completed,
        "cancelled": cancelled,
        "upcoming": upcoming,
        "earnings": int(earnings),
    }, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsPandit])
def pandit_bookings_list(request):
    user = request.user
    status = request.query_params.get("status")  # optional: pending/confirmed/completed/cancelled

    qs = Booking.objects.filter(pandit=user).order_by("-date", "-time")
    if status:
        qs = qs.filter(status=status)

    serializer = PanditBookingSerializer(qs, many=True)
    return Response(serializer.data, status=200)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsPandit])
def pandit_update_booking_status(request, booking_id: int):
    user = request.user
    new_status = request.data.get("status")

    if new_status not in ["pending", "confirmed", "cancelled", "completed"]:
        return Response({"message": "Invalid status"}, status=400)

    try:
        booking = Booking.objects.get(id=booking_id, pandit=user)
    except Booking.DoesNotExist:
        return Response({"message": "Booking not found"}, status=404)

    booking.status = new_status
    booking.save(update_fields=["status"])

    return Response({"message": "Status updated", "status": booking.status}, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsPandit])
def pandit_earnings(request):
    user = request.user
    qs = Booking.objects.filter(pandit=user, payment_status="paid")

    total = qs.aggregate(total=Sum("price"))["total"] or 0
    completed = qs.filter(status="completed").count()

    return Response({
        "total_earnings": int(total),
        "paid_bookings": qs.count(),
        "completed_paid_bookings": completed,
    }, status=200)
