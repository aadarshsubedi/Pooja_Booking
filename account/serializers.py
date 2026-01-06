# account/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import PanditProfile,UserProfile

User = get_user_model()

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'user')
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'role')

class PanditProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    specializations_list = serializers.SerializerMethodField()

    class Meta:
        model = PanditProfile
        fields = (
            "id",
            "user_id",
            "username",
            "email",
            "full_name",
            "city",
            "experience_years",
            "bio",
            "specializations",
            "specializations_list",
            "rating",
            "reviews_count",
            "image_url",
            "is_approved",
        )
        read_only_fields = ("rating", "reviews_count", "is_approved")

    def get_specializations_list(self, obj):
        return obj.specialties_list()

class UserProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ("full_name", "phone", "address", "avatar", "avatar_url")

    def get_avatar_url(self, obj):
        request = self.context.get("request")
        if obj.avatar and hasattr(obj.avatar, "url"):
            url = obj.avatar.url  # like /media/avatars/xxx.png
            return request.build_absolute_uri(url) if request else url
        return None