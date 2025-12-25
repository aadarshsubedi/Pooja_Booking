from django.urls import path
from . import views

urlpatterns = [
    path('bookings/', views.create_booking_view, name='create_booking'),
    # you can add more later: list bookings, update status, etc.
]
