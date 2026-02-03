# from django.urls import path
# from .views import create_booking_view, pandit_booked_slots_view
# from . import views
# from . import views_payments as pay
# from .views_pandit import (
#     pandit_dashboard_summary,
#     pandit_bookings_list,
#     pandit_update_booking_status,
#     pandit_earnings,
# )
# from .views_blocked_dates import (
#     pandit_block_date_view,
#     pandit_unblock_date_view,
#     pandit_blocked_dates_public_view,
# )
# urlpatterns = [
#     path('bookings/', create_booking_view, name='create_booking'),
#     path("pandits/<int:pandit_id>/booked-slots/", pandit_booked_slots_view, name="pandit_booked_slots"),
#     path("pandit/dashboard/summary/", pandit_dashboard_summary),
#     path("pandit/dashboard/bookings/", pandit_bookings_list),
#     path("pandit/dashboard/bookings/<int:booking_id>/status/", pandit_update_booking_status),
#     path("pandit/dashboard/earnings/", pandit_earnings),
#     path("bookings/<int:booking_id>/pay/", views.pay_booking_view, name="pay_booking"),
#     path("payments/esewa/success/", views.esewa_success_view, name="esewa_success"),
#     path("payments/esewa/failure/", views.esewa_failure_view, name="esewa_failure"),
#     path("payments/khalti/return/", views.khalti_return_view, name="khalti_return"),
#     path("pandit/blocked-dates/", pandit_block_date_view, name="pandit_block_date"),
#     path("pandit/blocked-dates/unblock/", pandit_unblock_date_view, name="pandit_unblock_date"),
#     path("pandits/<int:pandit_id>/blocked-dates/", pandit_blocked_dates_public_view, name="pandit_blocked_dates_public"),
# ]
from django.urls import path

from .views import create_booking_view, pandit_booked_slots_view
from .views_pandit import (
    pandit_dashboard_summary,
    pandit_bookings_list,
    pandit_update_booking_status,
    pandit_earnings,
)
from .views_blocked_dates import (
    pandit_block_date_view,
    pandit_unblock_date_view,
    pandit_blocked_dates_public_view,
)

from . import views_payments as pay  # ✅ all payment logic here

urlpatterns = [
    # Booking
    path("bookings/", create_booking_view, name="create_booking"),
    path("pandits/<int:pandit_id>/booked-slots/", pandit_booked_slots_view, name="pandit_booked_slots"),

    # Pandit dashboard
    path("pandit/dashboard/summary/", pandit_dashboard_summary),
    path("pandit/dashboard/bookings/", pandit_bookings_list),
    path("pandit/dashboard/bookings/<int:booking_id>/status/", pandit_update_booking_status),
    path("pandit/dashboard/earnings/", pandit_earnings),

    # Payments
    path("bookings/<int:booking_id>/pay/", pay.pay_booking_view, name="pay_booking"),

    path("payments/esewa/success/", pay.esewa_success_view, name="esewa_success"),
    path("payments/esewa/failure/", pay.esewa_failure_view, name="esewa_failure"),

    # Khalti demo (no key needed)
    path("payments/khalti/demo/initiate/<int:booking_id>/", pay.khalti_demo_initiate_view, name="khalti_demo_initiate"),
    path("payments/khalti/demo/confirm/<int:booking_id>/", pay.khalti_demo_confirm_view, name="khalti_demo_confirm"),

    # Receipt
    path("bookings/<int:booking_id>/receipt/", pay.booking_receipt_pdf_view, name="booking_receipt_pdf"),

    # Blocked dates
    path("pandit/blocked-dates/", pandit_block_date_view, name="pandit_block_date"),
    path("pandit/blocked-dates/unblock/", pandit_unblock_date_view, name="pandit_unblock_date"),
    path("pandits/<int:pandit_id>/blocked-dates/", pandit_blocked_dates_public_view, name="pandit_blocked_dates_public"),
]
