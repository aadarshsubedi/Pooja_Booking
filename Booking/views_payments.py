import base64, json, uuid, hmac, hashlib
import requests
from django.conf import settings
from django.shortcuts import redirect
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import Booking



def _esewa_signature(total_amount: str, transaction_uuid: str, product_code: str) -> str:
    """
    Signature = base64(HMAC_SHA256(secret, "total_amount=...,transaction_uuid=...,product_code=..."))
    Order must match signed_field_names in docs.
    """
    message = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"
    secret = settings.ESEWA_SECRET_KEY.encode("utf-8")
    digest = hmac.new(secret, message.encode("utf-8"), hashlib.sha256).digest()
    return base64.b64encode(digest).decode("utf-8")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def pay_booking_view(request, booking_id: int):
    """
    POST /api/bookings/<id>/pay/
    body: { method: "khalti" | "esewa", amount: number }
    """
    method = (request.data.get("method") or request.data.get("gateway") or "").strip().lower()
    amount = request.data.get("amount")

    if method not in ["esewa", "khalti"]:
        return Response({"message": "Invalid payment method"}, status=400)

    try:
        booking = Booking.objects.get(id=booking_id, user=request.user)
    except Booking.DoesNotExist:
        return Response({"message": "Booking not found"}, status=404)

    # Prevent paying twice
    if booking.payment_status == "paid":
        return Response({"message": "Already paid"}, status=400)

    # Use backend price if exists
    total_amount = str(booking.price if booking.price else (amount or 0))

    # Create a stable transaction id for gateways
    txn_uuid = f"{booking.id}-{uuid.uuid4().hex[:10]}"
    booking.payment_method = method
    booking.payment_status = "unpaid"
    booking.payment_reference = txn_uuid
    booking.save(update_fields=["payment_method", "payment_status", "payment_reference"])

    # ----------------- eSewa (UAT) -----------------
    if method == "esewa":
        product_code = settings.ESEWA_PRODUCT_CODE

        # success/failure -> your backend endpoints (then we redirect to React)
        success_url = f"http://localhost:8000/api/payments/esewa/success/?booking_id={booking.id}"
        failure_url = f"http://localhost:8000/api/payments/esewa/failure/?booking_id={booking.id}"

        signature = _esewa_signature(total_amount, txn_uuid, product_code)

        form_fields = {
            "amount": total_amount,
            "tax_amount": "0",
            "total_amount": total_amount,
            "transaction_uuid": txn_uuid,
            "product_code": product_code,
            "product_service_charge": "0",
            "product_delivery_charge": "0",
            "success_url": success_url,
            "failure_url": failure_url,
            "signed_field_names": "total_amount,transaction_uuid,product_code",
            "signature": signature,
        }

        return Response(
            {
                "provider": "esewa",
                "type": "form",
                "action": "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
                "fields": form_fields,
            },
            status=200,
        )

    # ----------------- Khalti -----------------
    # Initiate -> get payment_url, then redirect user there
    headers = {
        "Authorization": f"Key {settings.KHALTI_SECRET_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "return_url": f"http://localhost:8000/api/payments/khalti/return/?booking_id={booking.id}",
        "website_url": settings.FRONTEND_URL,
        "amount": int(float(total_amount) * 100),  # Khalti uses paisa
        "purchase_order_id": str(booking.id),
        "purchase_order_name": f"Booking #{booking.id}",
    }

    r = requests.post(settings.KHALTI_INIT_URL, headers=headers, json=payload, timeout=20)
    data = r.json() if r.content else {}

    if r.status_code != 200:
        return Response({"message": "Khalti initiate failed", "details": data}, status=400)

    # Store pidx as reference (useful for lookup)
    booking.payment_reference = data.get("pidx") or booking.payment_reference
    booking.save(update_fields=["payment_reference"])

    return Response(
        {
            "provider": "khalti",
            "type": "redirect",
            "payment_url": data.get("payment_url"),
            "pidx": data.get("pidx"),
        },
        status=200,
    )
    
@api_view(["GET"])
@permission_classes([AllowAny])
def khalti_demo_view(request):
    booking_id = request.GET.get("booking_id")
    if not booking_id:
        return redirect(f"{settings.FRONTEND_URL}/payment/failed?reason=missing_booking")

    booking = Booking.objects.filter(id=booking_id).first()
    if not booking:
        return redirect(f"{settings.FRONTEND_URL}/payment/failed?reason=booking_not_found")

    booking.payment_status = "paid"
    booking.payment_method = "khalti"
    booking.paid_at = timezone.now()
    booking.status = "confirmed"
    booking.save()

    return redirect(f"{settings.FRONTEND_URL}/payment/success?booking_id={booking.id}")

@api_view(["GET"])
@permission_classes([AllowAny])
def esewa_success_view(request):
    booking_id = request.GET.get("booking_id")
    if not booking_id:
        return redirect(f"{settings.FRONTEND_URL}/payment/failed?reason=missing_booking")

    booking = Booking.objects.filter(id=booking_id).first()
    if not booking:
        return redirect(f"{settings.FRONTEND_URL}/payment/failed?reason=booking_not_found")

    booking.payment_status = "paid"
    booking.payment_method = "esewa"
    booking.paid_at = timezone.now()
    booking.status = "confirmed"
    booking.save()

    return redirect(f"{settings.FRONTEND_URL}/payment/success?booking_id={booking.id}")


@api_view(["GET"])
@permission_classes([AllowAny])
def esewa_failure_view(request):
    booking_id = request.GET.get("booking_id")
    if booking_id:
        Booking.objects.filter(id=booking_id).update(payment_status="failed", payment_method="esewa")

    return redirect(f"{settings.FRONTEND_URL}/payment/failed?booking_id={booking_id or ''}")

@api_view(["GET"])
@permission_classes([AllowAny])
def khalti_return_view(request):
    """
    Khalti redirects to return_url with pidx.
    We'll do lookup to confirm status then redirect to React.
    """
    booking_id = request.query_params.get("booking_id")
    pidx = request.query_params.get("pidx")

    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return redirect(f"{settings.FRONTEND_URL}/payment-result?status=failed&method=khalti")

    if not pidx:
        booking.payment_status = "failed"
        booking.save(update_fields=["payment_status"])
        return redirect(f"{settings.FRONTEND_URL}/payment-result?status=failed&booking_id={booking.id}&method=khalti")

    headers = {"Authorization": f"Key {settings.KHALTI_SECRET_KEY}"}
    r = requests.post(settings.KHALTI_LOOKUP_URL, headers=headers, json={"pidx": pidx}, timeout=20)
    data = r.json() if r.content else {}

    # Khalti status generally returns "Completed" when paid
    khalti_status = (data.get("status") or "").lower()

    if r.status_code == 200 and khalti_status in ["completed", "complete"]:
        booking.payment_status = "paid"
        booking.paid_at = timezone.now()
        booking.payment_reference = pidx
        booking.save(update_fields=["payment_status", "paid_at", "payment_reference"])
        return redirect(f"{settings.FRONTEND_URL}/payment-result?status=success&booking_id={booking.id}&method=khalti")

    booking.payment_status = "failed"
    booking.payment_reference = pidx
    booking.save(update_fields=["payment_status", "payment_reference"])
    return redirect(f"{settings.FRONTEND_URL}/payment-result?status=failed&booking_id={booking.id}&method=khalti")
