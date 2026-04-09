from rest_framework import serializers
from .models import Project
from .models import ProjectMembers
from accounts.models import User

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'timeline']


class ProjectMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMembers
        fields = ['id', 'project', 'user', 'role']


class AddMembersSerializer(serializers.Serializer):
    project = serializers.IntegerField()
    users = serializers.ListField(
        child=serializers.IntegerField()
    )
    team_lead = serializers.IntegerField(required=False)

class ProjectMemberDetailSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name')
    email = serializers.CharField(source='user.email')

    class Meta:
        model = ProjectMembers
        fields = ['id', 'user', 'name', 'email', 'is_team_lead']    
