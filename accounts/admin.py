from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, OTP


class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'name', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name', 'role')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'role', 'password'),
        }),
    )

    search_fields = ('email', 'name')
    ordering = ('email',)
    filter_horizontal = ()


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('email', 'otp', 'created_at')
    search_fields = ('email',)


admin.site.register(User, UserAdmin)