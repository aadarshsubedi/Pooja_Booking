from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('pandit', 'Pandit'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    def __str__(self):
        return f"{self.username} ({self.role})"

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    # optional fields
    full_name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    address = models.CharField(max_length=255, blank=True)
    dob = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True)
    def __str__(self):
        return f"Profile of {self.user.username}"

class PanditProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="pandit_profile",
    )
    full_name = models.CharField(max_length=150)
    city = models.CharField(max_length=100, blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    bio = models.TextField(blank=True)

    # simple comma-separated specializations: "Griha Pravesh, Satyanarayan"
    specializations = models.CharField(max_length=255, blank=True)

    rating = models.FloatField(default=0.0)
    reviews_count = models.PositiveIntegerField(default=0)

    image_url = models.URLField(blank=True)  # or ImageField if you set MEDIA

    is_approved = models.BooleanField(default=False)  # admin toggles this

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PanditProfile({self.user.username})"

    def specialties_list(self):
        return [s.strip() for s in self.specializations.split(",") if s.strip()]