from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView 
from rest_framework import status, generics
from .models import Project
from .serializers import ProjectSerializer
from .models import ProjectMembers
from .serializers import ProjectMemberSerializer
from accounts.models import User
from .serializers import AddMembersSerializer
from .serializers import ProjectMemberDetailSerializer
from django.db.models import Q

class CreateProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        
        if user.role != 'manager':
            return Response({"error": "Only managers can create projects"}, status=403)

        serializer = ProjectSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(created_by=user)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)



class ProjectListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        user = self.request.user

        # Filter: I created the project OR I am a member/lead in the project
        return Project.objects.filter(
            Q(created_by=user) | Q(projectmembers__user=user)
        ).distinct()
    
class ProjectDetailView(generics.RetrieveAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Prevent users from seeing project details by typing the ID in the URL
        return Project.objects.filter(
            Q(created_by=user) | Q(projectmembers__user=user)
        ).distinct()


class AddProjectMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProjectMemberSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)    
    
class AddMultipleMembersView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AddMembersSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        project_id = serializer.validated_data['project']
        users = serializer.validated_data['users']
        team_lead = serializer.validated_data.get('team_lead')

        for user_id in users:
            ProjectMembers.objects.get_or_create(
    project_id=project_id,
    user_id=user_id,
    defaults={
        'is_team_lead': user_id == team_lead
    }
)

        return Response({"message": "Members added successfully"}, status=201)    
    

class ProjectMembersView(ListAPIView):
    serializer_class = ProjectMemberDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        return ProjectMembers.objects.filter(project_id=project_id)    