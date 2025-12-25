from rest_framework import serializers
from .models import Booking


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
