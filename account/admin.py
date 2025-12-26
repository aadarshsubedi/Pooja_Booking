# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from .models import CustomUser

# @admin.register(CustomUser)
# class CustomUserAdmin(UserAdmin):
#     fieldsets = UserAdmin.fieldsets + (
#         ('Role', {'fields': ('role',)}),
#     )
#     add_fieldsets = UserAdmin.add_fieldsets + (
#         (None, {'fields': ('role',)}),
#     )
#     list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
#     list_filter = ('role', 'is_staff', 'is_active')

# account/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser
from .models import PanditProfile


# ---------- CUSTOM ACTIONS ----------

@admin.action(description="Mark selected users as ACTIVE")
def make_active(modeladmin, request, queryset):
    queryset.update(is_active=True)


@admin.action(description="Mark selected users as INACTIVE")
def make_inactive(modeladmin, request, queryset):
    queryset.update(is_active=False)


@admin.action(description="Set role = Pandit for selected users")
def make_pandits(modeladmin, request, queryset):
    queryset.update(role="Pandit")   # use the exact choice value you use in CustomUser.role


# ---------- CUSTOM USER ADMIN ----------

@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    # fields shown in the edit form
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Role", {"fields": ("role",)}),
    )

    # fields shown when creating a user from admin
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Role", {"fields": ("role",)}),
    )

    # columns in the list view
    list_display = (
        "id",          # 👈 very useful to match with frontend / bookings
        "username",
        "email",
        "role",
        "is_staff",
        "is_active",
        "date_joined",
        "last_login",
    )

    # filters on the right/top
    list_filter = (
        "role",
        "is_staff",
        "is_active",
        "date_joined",
    )

    # search bar
    search_fields = ("username", "email")

    # clicking row: which fields are links
    list_display_links = ("username", "email")

    # default ordering (newest first)
    ordering = ("-date_joined",)

    # read-only fields (admin can see but not edit)
    readonly_fields = ("date_joined", "last_login")

    # bulk actions
    actions = [make_active, make_inactive, make_pandits]


# ---------- OPTIONAL: CUSTOM ADMIN TITLES ----------

admin.site.site_header = "Pooja Booking Admin"
admin.site.site_title = "Pooja Booking Admin"
admin.site.index_title = "Administration"

@admin.register(PanditProfile)
class PanditProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "full_name", "city", "experience_years", "is_approved")
    list_filter = ("is_approved", "city")
    search_fields = ("full_name", "user__username", "city")
