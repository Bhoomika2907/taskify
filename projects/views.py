from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView 
from .models import Project
from .serializers import ProjectSerializer


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

from rest_framework.generics import ListAPIView # Add this import
from .models import Project
from .serializers import ProjectSerializer



class ProjectListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        # This ensures users only see projects they are involved in 
        # (or all projects if you prefer for now)
        return Project.objects.all()