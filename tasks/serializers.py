from rest_framework import serializers
from .models import Task, TaskCollaborators


# Create Task
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id',
            'name',
            'description',
            'project',
            'assigned_to',
            'status',
            'deadline'
        ]


# Update Status
class TaskStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['status']


# Add Collaborator
class TaskCollaboratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCollaborators
        fields = ['task', 'user']    