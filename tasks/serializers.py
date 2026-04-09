from rest_framework import serializers
from .models import Task


# Create Task
class TaskSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.CharField(source='assigned_to.name', read_only=True)
    
    class Meta:
        model = Task
        fields = [
            'id', 'name', 'description', 'project', 
            'assigned_to', 'assigned_to_name', 'status', 
            'deadline', 'created_by','priority'
        ]
        # Keep this as read_only so the save(created_by=user) logic above works
        read_only_fields = ['created_by', 'assigned_to_name']

# Update Status
class TaskStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['status']

  