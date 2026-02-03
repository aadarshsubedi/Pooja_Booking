import base64
import hashlib
import hmac
import uuid
import requests

from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import redirect
from django.utils import timezone

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from decimal import Decimal, ROUND_HALF_UP
from .models import Booking


# -------------------------
# Helpers
# -------------------------
def esewa_amount_str(value) -> str:
    """
    Ensure amount is stable (no float issues).
    eSewa accepts numeric strings; keep it consistent.
    If your prices are always integer, this returns "1100".
    """
    d = Decimal(str(value)).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
    return format(d, "f")  # "1100"

def esewa_signature(total_amount: str, transaction_uuid: str, product_code: str) -> str:
    """
    message must be EXACT:
    total_amount=<>,transaction_uuid=<>,product_code=<>
    """
    secret = settings.ESEWA_SECRET_KEY  # MUST be exactly: 8gBm/:&EnhH.1/q
    message = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"
    digest = hmac.new(secret.encode("utf-8"), message.encode("utf-8"), hashlib.sha256).digest()
    return base64.b64encode(digest).decode("utf-8")


def _safe_str(v):
    return "" if v is None else str(v)


# -------------------------
# Main payment entry
# -------------------------
@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def pay_booking_view(request, booking_id: int):
    """
    POST /api/bookings/<id>/pay/
    body: { method: "esewa" | "khalti", amount?: number }

    - eSewa => return form action_url + fields
    - Khalti => if no key => return demo type
    """
    method = (request.data.get("method") or request.data.get("gateway") or "").strip().lower()
    if method not in ["esewa", "khalti"]:
        return Response({"message": "Invalid payment method"}, status=400)

    try:
        booking = Booking.objects.get(id=booking_id, user=request.user)
    except Booking.DoesNotExist:
        return Response({"message": "Booking not found"}, status=404)

    if booking.payment_status == "paid":
        return Response({"message": "Already paid"}, status=400)

    total_amount = esewa_amount_str(booking.price or (request.data.get("amount") or 0))
    txn_uuid = f"{booking.id}-{uuid.uuid4().hex[:8]}"

    booking.payment_method = method
    booking.payment_status = "unpaid"
    booking.payment_reference = txn_uuid
    booking.save(update_fields=["payment_method", "payment_status", "payment_reference"])

    # ----------------- eSewa UAT -----------------
    if method == "esewa":
        product_code = settings.ESEWA_PRODUCT_CODE

        success_url = f"{settings.BACKEND_URL}/api/payments/esewa/success/?booking_id={booking.id}"
        failure_url = f"{settings.BACKEND_URL}/api/payments/esewa/failure/?booking_id={booking.id}"

        signature = esewa_signature(total_amount, txn_uuid, product_code)

        fields = {
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
                "action_url": settings.ESEWA_FORM_URL,
                "fields": fields,
            },
            status=200,
        )

    # ----------------- Khalti DEMO -----------------
    # If no real key present, use demo mode
    if not getattr(settings, "KHALTI_SECRET_KEY", "").strip():
        return Response(
            {
                "provider": "khalti",
                "type": "demo",
                "booking_id": booking.id,
                "amount": booking.price,
            },
            status=200,
        )

    # If later you add real Khalti keys, you can implement real initiate here.
    return Response({"message": "Khalti real integration not configured"}, status=400)


# -------------------------
# eSewa callbacks
# -------------------------
@api_view(["GET", "POST"])
def esewa_success_view(request):
    """
    eSewa will redirect here on success.
    We verify status via eSewa transaction status API (UAT).
    Then redirect to React payment-result page.
    """
    booking_id = request.GET.get("booking_id") or request.data.get("booking_id")
    if not booking_id:
        return Response({"message": "booking_id missing"}, status=400)

    try:
        booking = Booking.objects.get(id=int(booking_id))
    except Booking.DoesNotExist:
        return Response({"message": "Booking not found"}, status=404)

    # The gateway may send transaction_uuid + total_amount etc.
    # But we already stored txn_uuid in booking.payment_reference.
    txn_uuid = booking.payment_reference
    product_code = settings.ESEWA_PRODUCT_CODE
    total_amount = esewa_amount_str(booking.price)

    # Verify with eSewa status endpoint
    verified = False
    try:
        res = requests.get(
            settings.ESEWA_STATUS_URL,
            params={
                "product_code": product_code,
                "total_amount": total_amount,
                "transaction_uuid": txn_uuid,
            },
            timeout=20,
        )
        data = res.json() if res.content else {}
        # eSewa typically returns status like "COMPLETE" on success
        status_val = _safe_str(data.get("status")).upper()
        if status_val in ["COMPLETE", "COMPLETED", "SUCCESS"]:
            verified = True
    except Exception:
        verified = False

    if verified:
        booking.payment_status = "paid"
        booking.paid_at = timezone.now()
        booking.payment_method = "esewa"
        booking.save(update_fields=["payment_status", "paid_at", "payment_method"])
        return redirect(f"{settings.FRONTEND_URL}/payment-result?status=success&booking_id={booking.id}")
    else:
        booking.payment_status = "failed"
        booking.save(update_fields=["payment_status"])
        return redirect(f"{settings.FRONTEND_URL}/payment-result?status=failed&booking_id={booking.id}")


@api_view(["GET", "POST"])
def esewa_failure_view(request):
    booking_id = request.GET.get("booking_id") or request.data.get("booking_id")
    if booking_id:
        Booking.objects.filter(id=int(booking_id)).update(payment_status="failed", payment_method="esewa")
    return redirect(f"{settings.FRONTEND_URL}/payment-result?status=failed&booking_id={booking_id or ''}")


# -------------------------
# Khalti DEMO confirm
# -------------------------
@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def khalti_demo_confirm_view(request, booking_id: int):
    """
    body: { status: "paid" | "failed" }
    """
    status_val = (request.data.get("status") or "").strip().lower()
    if status_val not in ["paid", "failed"]:
        return Response({"message": "Invalid status"}, status=400)

    try:
        booking = Booking.objects.get(id=booking_id, user=request.user)
    except Booking.DoesNotExist:
        return Response({"message": "Booking not found"}, status=404)

    booking.payment_method = "khalti_demo"
    if status_val == "paid":
        booking.payment_status = "paid"
        booking.paid_at = timezone.now()
    else:
        booking.payment_status = "failed"

    booking.save(update_fields=["payment_method", "payment_status", "paid_at"])
    return Response({"message": "Updated", "payment_status": booking.payment_status}, status=200)


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def khalti_demo_initiate_view(request, booking_id: int):
    """
    Optional: can be used if you want to show a reference before demo confirm.
    """
    try:
        booking = Booking.objects.get(id=booking_id, user=request.user)
    except Booking.DoesNotExist:
        return Response({"message": "Booking not found"}, status=404)

    if booking.payment_status == "paid":
        return Response({"message": "Already paid"}, status=400)

    ref = f"KD-{booking.id}-{uuid.uuid4().hex[:8]}"
    booking.payment_method = "khalti_demo"
    booking.payment_status = "unpaid"
    booking.payment_reference = ref
    booking.save(update_fields=["payment_method", "payment_status", "payment_reference"])

    return Response({"reference": ref, "booking_id": booking.id, "amount": booking.price}, status=200)


# -------------------------
# Receipt PDF (Proof)
# -------------------------
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def booking_receipt_pdf_view(request, booking_id: int):
    """
    Download receipt only if payment_status == paid.
    Allow booking owner (user) and the pandit to download.
    """
    try:
        booking = Booking.objects.select_related("user", "pandit", "pooja").get(id=booking_id)
    except Booking.DoesNotExist:
        return Response({"message": "Booking not found"}, status=404)

    # Permission: user or pandit
    if request.user != booking.user and request.user != booking.pandit:
        return Response({"message": "Not allowed"}, status=403)

    if booking.payment_status != "paid":
        return Response({"message": "Receipt available only after successful payment"}, status=400)

    # --- PDF response ---
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="receipt_booking_{booking.id}.pdf"'

    c = canvas.Canvas(response, pagesize=A4)
    width, height = A4

    # Helpers
    def line(y):
        c.setLineWidth(0.8)
        c.line(18 * mm, y, width - 18 * mm, y)

    def label_value(y, label, value):
        c.setFont("Helvetica-Bold", 10.5)
        c.drawString(18 * mm, y, f"{label}")
        c.setFont("Helvetica", 10.5)
        c.drawString(65 * mm, y, f": {value}")

    # --- Header Bar ---
    top = height - 18 * mm
    c.setFont("Helvetica-Bold", 16)
    c.drawString(18 * mm, top, "POOJA BOOKING SYSTEM")
    c.setFont("Helvetica", 10)
    c.drawString(18 * mm, top - 14, "Payment Receipt (Project / Demo)")

    # Right side meta
    paid_at = booking.paid_at or timezone.now()
    paid_at_local = timezone.localtime(paid_at)
    receipt_no = f"RCPT-{booking.id}-{(booking.payment_reference or 'NA')[-6:]}"  # short + clean

    c.setFont("Helvetica", 10)
    c.drawRightString(width - 18 * mm, top, f"Receipt No: {receipt_no}")
    c.drawRightString(width - 18 * mm, top - 14, f"Issued: {paid_at_local.strftime('%Y-%m-%d %I:%M %p')}")

    line(top - 22)

    # --- Receipt Details Section ---
    y = top - 42
    c.setFont("Helvetica-Bold", 12)
    c.drawString(18 * mm, y, "Receipt Details")
    y -= 12
    line(y)
    y -= 16

    label_value(y, "Booking ID", f"#{booking.id}")
    y -= 14
    label_value(y, "Transaction Ref", booking.payment_reference or "N/A")
    y -= 14
    label_value(y, "Payment Method", (booking.payment_method or "").upper() if booking.payment_method else "N/A")
    y -= 14
    label_value(y, "Payment Status", booking.payment_status.upper())
    y -= 18

    # --- Booking Details Section ---
    c.setFont("Helvetica-Bold", 12)
    c.drawString(18 * mm, y, "Booking Details")
    y -= 12
    line(y)
    y -= 16

    pooja_name = booking.pooja.name if getattr(booking, "pooja", None) else "N/A"
    label_value(y, "Pooja", pooja_name)
    y -= 14
    label_value(y, "User", f"{booking.user.username} ({booking.user.email})")
    y -= 14
    label_value(y, "Pandit", f"{booking.pandit.username} ({booking.pandit.email})")
    y -= 14
    label_value(y, "Scheduled", f"{booking.date}  {booking.time}")
    y -= 14
    label_value(y, "Location", booking.location)
    y -= 18

    # --- Amount Summary Box ---
    line(y)
    y -= 20
    c.setFont("Helvetica-Bold", 12)
    c.drawString(18 * mm, y, "Amount Summary")
    y -= 12
    line(y)
    y -= 18

    amount_str = esewa_amount_str(booking.price) if booking.price is not None else "0"
    c.setFont("Helvetica-Bold", 12)
    c.drawString(18 * mm, y, "Total Paid")
    c.drawRightString(width - 18 * mm, y, f"Rs. {amount_str}")
    y -= 22

    # --- Footer ---
    line(30 * mm)
    c.setFont("Helvetica-Oblique", 9)
    c.drawString(
        18 * mm,
        22 * mm,
        "This receipt is system-generated as proof of payment completion (for academic/demo use)."
    )
    c.drawString(
        18 * mm,
        16 * mm,
        "If you have questions, please contact the admin/support of this project."
    )

    c.showPage()
    c.save()
    return response
