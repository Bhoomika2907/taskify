from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('name', 'project', 'assigned_to', 'created_by', 'status', 'deadline')
    list_filter = ('status', 'project', 'deadline')
    search_fields = ('name', 'assigned_to__email', 'project__name')