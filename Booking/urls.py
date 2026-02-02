from django.urls import path
from .views import create_booking_view, pandit_booked_slots_view
from . import views
from . import views_payments as pay
from .views_pandit import (
    pandit_dashboard_summary,
    pandit_bookings_list,
    pandit_update_booking_status,
    pandit_earnings,
)
urlpatterns = [
    path('bookings/', create_booking_view, name='create_booking'),
    path("pandits/<int:pandit_id>/booked-slots/", pandit_booked_slots_view, name="pandit_booked_slots"),
    path("bookings/<int:booking_id>/pay/", views.pay_booking_view, name="pay_booking"),
    path("payments/esewa/success/", views.esewa_success_view, name="esewa_success"),
    path("payments/esewa/failure/", views.esewa_failure_view, name="esewa_failure"),
    path("pandit/dashboard/summary/", pandit_dashboard_summary),
    path("pandit/dashboard/bookings/", pandit_bookings_list),
    path("pandit/dashboard/bookings/<int:booking_id>/status/", pandit_update_booking_status),
    path("pandit/dashboard/earnings/", pandit_earnings),
    path("payments/esewa/success/", pay.esewa_success_view, name="esewa_success"),
    path("payments/esewa/failure/", pay.esewa_failure_view, name="esewa_failure"),
    path("payments/khalti/return/",pay.khalti_return_view, name="khalti_return"),
]