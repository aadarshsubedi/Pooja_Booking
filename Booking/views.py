from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Booking
from .serializers import BookingSerializer

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_booking_view(request):
    """
    Create a booking.

    Expected JSON from frontend:
    {
      "pandit": <pandit_id>,
      "pooja": <pooja_id>,
      "date": "2025-12-31",
      "time": "10:30:00",
      "location": "Kathmandu, Nepal",
      "notes": "Any extra info",
      "price": 2000.0
    }
    """
    data = request.data.copy()
    data['user'] = request.user.id  # always set user from token

    serializer = BookingSerializer(data=data)
    if serializer.is_valid():
        booking = serializer.save(status='pending')
        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)

    return Response(
        {'message': 'Invalid data', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST
    )
