from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Pooja(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.name


class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    pandit = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='assigned_bookings'
    )
    pooja = models.ForeignKey(
        Pooja,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='bookings'
    )

    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    price = models.IntegerField(default=1100)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking #{self.id} by {self.user} for {self.pandit} on {self.date}"
    payment_status = models.CharField(max_length=20, default="unpaid")  # unpaid/paid/failed
    payment_method = models.CharField(max_length=20, blank=True, null=True)  # khalti/esewa/demo
    payment_reference = models.CharField(max_length=100, blank=True, null=True)
    paid_at = models.DateTimeField(blank=True, null=True)

class PanditBlockedDate(models.Model):
    pandit = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blocked_dates")
    date = models.DateField()
    reason = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("pandit", "date")
        ordering = ["-date"]

    def __str__(self):
        return f"{self.pandit} blocked {self.date}"