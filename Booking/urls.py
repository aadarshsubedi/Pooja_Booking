from django.urls import path
from .views import create_booking_view, pandit_booked_slots_view
from . import views
from .views_pandit import (
    pandit_dashboard_summary,
    pandit_bookings_list,
    pandit_update_booking_status,
    pandit_earnings,
)
urlpatterns = [
    path('bookings/', create_booking_view, name='create_booking'),
    path("pandits/<int:pandit_id>/booked-slots/", pandit_booked_slots_view, name="pandit_booked_slots"),
    path("bookings/<int:pk>/pay/", views.pay_booking_view, name="pay_booking"),
     path("pandit/dashboard/summary/", pandit_dashboard_summary),
    path("pandit/dashboard/bookings/", pandit_bookings_list),
    path("pandit/dashboard/bookings/<int:booking_id>/status/", pandit_update_booking_status),
    path("pandit/dashboard/earnings/", pandit_earnings),
]