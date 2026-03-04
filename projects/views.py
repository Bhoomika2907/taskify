from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import ProjectSerializer


class CreateProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # 🔥 ROLE CHECK
        if user.role != 'manager':
            return Response({"error": "Only managers can create projects"}, status=403)

        serializer = ProjectSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(created_by=user)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
