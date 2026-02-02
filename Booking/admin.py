from django.contrib import admin
from .models import Booking, Pooja
from .admin_dashboard import admin_dashboard_view
from django.urls import path

@admin.register(Pooja)
class PoojaAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "base_price")
    search_fields = ("name",)


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "pandit",
        "date",
        "time",
        "price",
        "status",
        "payment_status",
        "payment_method",
        "created_at",
    )

    list_filter = (
        "status",
        "payment_status",
        "payment_method",
        "date",
        "created_at",
    )

    search_fields = (
        "id",
        "user__username",
        "user__email",
        "pandit__username",
        "pandit__email",
        "location",
    )

    readonly_fields = ("created_at", "updated_at", "paid_at")

    ordering = ("-created_at",)

    fieldsets = (
        ("Booking Info", {
            "fields": ("user", "pandit", "pooja", "date", "time", "location", "notes", "price", "status")
        }),
        ("Payment Info", {
            "fields": ("payment_status", "payment_method", "payment_reference", "paid_at")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at")
        }),
    )
def get_admin_urls(urls):
    def get_urls():
        my_urls = [
            path("dashboard/", admin_dashboard_view, name="admin-dashboard"),
        ]
        return my_urls + urls
    return get_urls


admin.site.get_urls = get_admin_urls(admin.site.get_urls())
