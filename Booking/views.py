import base64
import hashlib
import hmac
import json
import uuid
import requests
from django.shortcuts import redirect
from django.conf import settings
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from datetime import date as date_cls
from .models import Booking,PanditBlockedDate
from .serializers import BookingSerializer,PanditBlockedDateSerializer
from django.utils import timezone
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from django.utils.dateparse import parse_date

from .serializers import BookingSerializer

User = get_user_model()
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_booking_view(request):
    """
    Create a booking.
    """
    pandit_id = request.data.get("pandit")
    data_str=request.data.get("data")
    
    booking_date=parse_date(data_str) if data_str else None
    
    if PanditBlockedDate.objects.filter(pandit_id=pandit_id, date=booking_date).exists():
        return Response(
            {"message": "Pandit is unavailable on this date."},
            status=400
        )

    # ✅ validate pandit exists
    if not pandit_id:
        return Response({"message": "Pandit is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        pandit_user = User.objects.get(id=pandit_id)
    except User.DoesNotExist:
        return Response({"message": "Pandit not found."}, status=status.HTTP_404_NOT_FOUND)

    # ✅ BLOCK: pandit cannot book themselves
    if pandit_user.id == request.user.id:
        return Response({"message": "You cannot book yourself."}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ optional but recommended: ensure target is a pandit
    if (getattr(pandit_user, "role", "") or "").lower() != "pandit":
        return Response({"message": "Selected user is not a pandit."}, status=status.HTTP_400_BAD_REQUEST)

    serializer = BookingSerializer(data=request.data)

    if serializer.is_valid():
        booking = serializer.save(user=request.user, status="pending")
        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)

    return Response(
        {"message": "Invalid data", "errors": serializer.errors},
        status=status.HTTP_400_BAD_REQUEST
    )


# @api_view(['POST'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
# def create_booking_view(request):
#     """
#     Create a booking.

#     Expected JSON from frontend:
#     {
#       "pandit": <pandit_id>,
#       "pooja": <pooja_id>,
#       "date": "2025-12-31",
#       "time": "10:30:00",
#       "location": "Kathmandu, Nepal",
#       "notes": "Any extra info",
#       "price": 2000.0
#     }
#     """
#     serializer = BookingSerializer(data=request.data)

#     if serializer.is_valid():
#        booking = serializer.save(user=request.user, status="pending")  # ✅ IMPORTANT
#        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)
#     return Response(
#         {'message': 'Invalid data', 'errors': serializer.errors},
#         status=status.HTTP_400_BAD_REQUEST
#     )
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


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def pay_booking_view(request, booking_id: int):
    """
    POST /api/bookings/<id>/pay/

    For Khalti demo:
      { "method": "khalti", "token": "...", "amount": 1100 }

    For eSewa demo init:
      { "method": "esewa", "amount": 1100 }

    Returns:
      - khalti: marks booking paid
      - esewa: returns action_url + fields for form submit
    """
    try:
        booking = Booking.objects.get(id=booking_id, user=request.user)
    except Booking.DoesNotExist:
        return Response({"message": "Booking not found"}, status=404)

    method = (request.data.get("method") or "").lower()
    amount = int(request.data.get("amount") or booking.price or 0)

    if amount <= 0:
        return Response({"message": "Invalid amount"}, status=400)

    if booking.payment_status == "paid":
        return Response({"message": "Already paid", "booking_id": booking.id}, status=200)

    # ======================= KHALTI (DEMO) =======================
    if method == "khalti":
        token = request.data.get("token") or request.data.get("payer_id")  # ✅ accept either
        if not token:
            return Response({"message": "Missing khalti token"}, status=400)

        # ✅ For demo: mark paid without calling real Khalti verify
        # If you want real verification, we can add it using khalti secret key.
        booking.payment_status = "paid"
        booking.payment_method = "khalti"
        booking.payment_reference = token
        booking.paid_at = timezone.now()
        booking.status = "confirmed"
        booking.save()

        return Response({"status": "paid", "booking_id": booking.id}, status=200)

    # ======================= ESEWA (DEMO INIT) =======================
    if method == "esewa":
        transaction_uuid = f"{booking.id}-{uuid.uuid4().hex[:6]}"

        amount_str = str(amount)
        total_amount = amount_str
        product_code = getattr(settings, "ESEWA_PRODUCT_CODE", "EPAYTEST")
        secret_key = getattr(settings, "ESEWA_SECRET_KEY", "demo_secret")

        # ✅ callback URLs (backend)
        success_url = "http://localhost:8000/api/payments/esewa/success/"
        failure_url = "http://localhost:8000/api/payments/esewa/failure/"

        signed_field_names = "total_amount,transaction_uuid,product_code"
        message = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"

        signature = base64.b64encode(
            hmac.new(
                secret_key.encode(),
                message.encode(),
                hashlib.sha256
            ).digest()
        ).decode()

        # save reference in booking
        booking.payment_status = "unpaid"
        booking.payment_method = "esewa"
        booking.payment_reference = transaction_uuid
        booking.save(update_fields=["payment_status", "payment_method", "payment_reference"])

        # eSewa test URL
        action_url = "https://rc.esewa.com.np/api/epay/main/v2/form"

        fields = {
            "amount": amount_str,
            "tax_amount": "0",
            "total_amount": total_amount,
            "transaction_uuid": transaction_uuid,
            "product_code": product_code,
            "product_service_charge": "0",
            "product_delivery_charge": "0",
            "success_url": success_url,
            "failure_url": failure_url,
            "signed_field_names": signed_field_names,
            "signature": signature,
        }

        return Response({"gateway": "esewa", "action_url": action_url, "fields": fields}, status=200)

    return Response({"message": "Invalid payment method"}, status=400)


@api_view(["GET"])
def esewa_success_view(request):
    """
    eSewa redirects to success_url with Base64 `data`.
    For demo: mark paid if booking exists.
    """
    data_b64 = request.GET.get("data")
    if not data_b64:
        return Response({"message": "Missing data"}, status=400)

    decoded = base64.b64decode(data_b64).decode()
    payload = json.loads(decoded)

    transaction_uuid = payload.get("transaction_uuid")
    if not transaction_uuid:
        return Response({"message": "Missing transaction_uuid"}, status=400)

    try:
        booking = Booking.objects.get(payment_reference=transaction_uuid)
    except Booking.DoesNotExist:
        return Response({"message": "Booking not found"}, status=404)

    # ✅ DEMO: mark paid (for real, you'd also call status API)
    booking.payment_status = "paid"
    booking.payment_method = "esewa"
    booking.paid_at = timezone.now()
    booking.status = "confirmed"
    booking.save()

    # redirect back to React (5173)
    return redirect(f"http://localhost:5173/payment/success?bookingId={booking.id}")


@api_view(["GET"])
def esewa_failure_view(request):
    return redirect("http://localhost:5173/payment/failed")