from rest_framework import serializers
from .models import Booking,PanditBlockedDate
from django.utils import timezone



class BookingSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.username')
    pandit_username = serializers.ReadOnlyField(source='pandit.username')

    class Meta:
        model = Booking
        fields = (
            'id',
            'user',
            'pandit',
            'pooja',
            'date',
            'time',
            'location',
            'notes',
            'price',
            'status',
            'created_at',
            'updated_at',
            'user_username',
            'pandit_username',
        )
        read_only_fields = ('user', 'status', 'created_at', 'updated_at')
        extra_kwargs = {
            'pooja': {'required': False, 'allow_null': True},
        }
    def validate(self, attrs):
        booking_date = attrs.get("date")
        booking_time = attrs.get("time")
        pandit = attrs.get("pandit")
        # 1) block past dates
        today = timezone.now().date()
        if booking_date and booking_date < today:
            raise serializers.ValidationError({"date": "You cannot book a past date."})

        # 2) prevent duplicate booking for same pandit/date/time
        if pandit and booking_date and booking_time:
            exists = Booking.objects.filter(
                pandit=pandit,
                date=booking_date,
                time=booking_time,
                status__in=["pending", "confirmed"]   # cancelled/completed are free (assumption)
            ).exists()
            if exists:
                raise serializers.ValidationError({"time": "This time slot is already booked for this pandit."})

        return attrs
    
class PanditBookingSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source="user.username", read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)
    pandit_username = serializers.CharField(source="pandit.username", read_only=True)
    pooja_name = serializers.CharField(source="pooja.name", read_only=True)

    class Meta:
        model = Booking
        fields = (
            "id",
            "user", "user_username", "user_email",
            "pandit", "pandit_username",
            "pooja", "pooja_name",
            "date", "time", "location", "notes",
            "price", "status",
            "payment_status", "payment_method", "payment_reference", "paid_at",
            "created_at",
        )
        read_only_fields = ("user", "pandit", "created_at", "paid_at")
        
class PanditBlockedDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PanditBlockedDate
        fields = ("id", "date", "reason", "created_at")
