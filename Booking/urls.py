from django.urls import path
from .views import create_booking_view, pandit_booked_slots_view

urlpatterns = [
    path('bookings/', create_booking_view, name='create_booking'),
    path("pandits/<int:pandit_id>/booked-slots/", pandit_booked_slots_view, name="pandit_booked_slots"),
]
