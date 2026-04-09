from django.contrib import admin
from .models import Project, ProjectMembers

class ProjectMemberInline(admin.TabularInline):
    model = ProjectMembers
    extra = 1

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'timeline', 'created_at')
    list_filter = ('timeline', 'created_at')
    search_fields = ('name', 'created_by__email')
    inlines = [ProjectMemberInline]

@admin.register(ProjectMembers)
class ProjectMembersAdmin(admin.ModelAdmin):
    list_display = ('project', 'user', 'role')
    list_filter = ('role', 'project')