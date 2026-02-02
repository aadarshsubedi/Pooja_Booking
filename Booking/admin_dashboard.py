from datetime import timedelta

from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Count
from django.shortcuts import render
from django.utils import timezone
from django.contrib.auth import get_user_model

from Booking.models import Booking
from account.models import PanditProfile


@staff_member_required
def admin_dashboard_view(request):
    # ---------- TOP METRICS ----------
    User = get_user_model()

    total_bookings = Booking.objects.count()
    total_users = User.objects.count()
    approved_pandits = PanditProfile.objects.filter(is_approved=True).count()
    paid_bookings = Booking.objects.filter(payment_status="paid").count()

    # ---------- RECENT BOOKINGS ----------
    recent_bookings = (
        Booking.objects.select_related("user", "pandit")
        .order_by("-created_at")[:10]
    )

    # ---------- BOOKINGS TREND (LAST 30 DAYS) ----------
    # ✅ IMPORTANT: Use Booking.date (DateField) to avoid SQLite trunc function crash
    today = timezone.localdate()
    start_date = today - timedelta(days=29)

    # grouped by booking "date" (DateField)
    daily_qs = (
        Booking.objects.filter(date__gte=start_date, date__lte=today)
        .values("date")
        .annotate(c=Count("id"))
        .order_by("date")
    )

    # Build map: "YYYY-MM-DD" -> count
    daily_map = {row["date"].isoformat(): row["c"] for row in daily_qs}

    # labels for every day (even if count=0)
    daily_labels = []
    daily_counts = []
    for i in range(30):
        d = start_date + timedelta(days=i)
        key = d.isoformat()
        daily_labels.append(key)
        daily_counts.append(daily_map.get(key, 0))

    # ---------- STATUS COUNTS ----------
    status_qs = Booking.objects.values("status").annotate(c=Count("id"))
    status_counts = {row["status"]: row["c"] for row in status_qs}

    # ---------- PAYMENT METHOD COUNTS ----------
    method_qs = Booking.objects.values("payment_method").annotate(c=Count("id"))
    # normalize None/"" for chart
    method_counts = {}
    for row in method_qs:
        k = (row["payment_method"] or "none").strip().lower()
        method_counts[k] = row["c"]

    # ---------- PAYMENT STATUS COUNTS ----------
    pay_status_qs = Booking.objects.values("payment_status").annotate(c=Count("id"))
    payment_status_counts = {row["payment_status"]: row["c"] for row in pay_status_qs}

    context = {
        # numbers
        "total_bookings": total_bookings,
        "total_users": total_users,
        "approved_pandits": approved_pandits,
        "paid_bookings": paid_bookings,

        # table
        "recent_bookings": recent_bookings,

        # charts
        "daily_labels": daily_labels,
        "daily_counts": daily_counts,
        "status_counts": status_counts,
        "method_counts": method_counts,
        "payment_status_counts": payment_status_counts,
    }

    return render(request, "admin/admin_dashboard.html", context)
