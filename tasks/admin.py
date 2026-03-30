# from django.contrib import admin
# from .models import Task, TaskCollaborators

# @admin.register(Task)
# class TaskAdmin(admin.ModelAdmin):
#     list_display = ('name', 'project', 'assigned_to', 'status', 'deadline')
#     list_filter = ('status', 'project', 'deadline')
#     search_fields = ('name', 'assigned_to__email', 'project__name')

# @admin.register(TaskCollaborators)
# class TaskCollaboratorsAdmin(admin.ModelAdmin):
#     list_display = ('task', 'user')