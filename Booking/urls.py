from django.urls import path
from .views import create_booking_view, pandit_booked_slots_view
from . import views
urlpatterns = [
    path('bookings/', create_booking_view, name='create_booking'),
    path("pandits/<int:pandit_id>/booked-slots/", pandit_booked_slots_view, name="pandit_booked_slots"),
    path("bookings/<int:pk>/pay/", views.pay_booking_view, name="pay_booking"),
]
