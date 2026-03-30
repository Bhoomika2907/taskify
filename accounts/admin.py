
# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# from .models import User, OTP

# class UserAdmin(BaseUserAdmin):
#     # The forms to add and change user instances
#     list_display = ('email', 'name', 'role', 'is_admin', 'is_active')
#     list_filter = ('role', 'is_admin')
#     fieldsets = (
#         (None, {'fields': ('email', 'password')}),
#         ('Personal info', {'fields': ('name', 'role')}),
#         ('Permissions', {'fields': ('is_admin', 'is_active')}),
#     )
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('email', 'name', 'role', 'password'),
#         }),
#     )
#     search_fields = ('email', 'name')
#     ordering = ('email',)
#     filter_horizontal = ()

# @admin.register(OTP)
# class OTPAdmin(admin.ModelAdmin):
#     list_display = ('email', 'otp', 'created_at')
#     search_fields = ('email',)

# admin.site.register(User, UserAdmin)
