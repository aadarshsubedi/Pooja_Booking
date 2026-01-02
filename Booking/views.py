from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from datetime import date as date_cls
from .models import Booking
from .serializers import BookingSerializer

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_booking_view(request):
    """
    Create a booking.

    Expected JSON from frontend:
    {
      "pandit": <pandit_id>,
      "pooja": <pooja_id>,
      "date": "2025-12-31",
      "time": "10:30:00",
      "location": "Kathmandu, Nepal",
      "notes": "Any extra info",
      "price": 2000.0
    }
    """
    serializer = BookingSerializer(data=request.data)

    if serializer.is_valid():
       booking = serializer.save(user=request.user, status="pending")  # ✅ IMPORTANT
       return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)
    return Response(
        {'message': 'Invalid data', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST
    )
@api_view(["GET"])
@permission_classes([AllowAny])
def pandit_booked_slots_view(request, pandit_id):
    """
    GET /api/pandits/<pandit_id>/booked-slots/?start=YYYY-MM-DD&end=YYYY-MM-DD

    Returns:
    {
      "2025-12-31": ["06:00:00", "13:00:00"],
      "2026-01-01": ["17:00:00"]
    }
    """
    start = request.query_params.get("start")
    end = request.query_params.get("end")

    if not start or not end:
        return Response({"message": "start and end are required"}, status=400)

    try:
        start_date = date_cls.fromisoformat(start)
        end_date = date_cls.fromisoformat(end)
    except ValueError:
        return Response({"message": "Invalid date format. Use YYYY-MM-DD"}, status=400)

    qs = Booking.objects.filter(
        pandit_id=pandit_id,
        date__range=(start_date, end_date),
        status__in=["pending", "confirmed"]  # treat these as occupied
    ).values("date", "time")

    result = {}
    for row in qs:
        d = row["date"].isoformat()
        t = row["time"].strftime("%H:%M:%S")
        result.setdefault(d, []).append(t)

    return Response(result, status=200)