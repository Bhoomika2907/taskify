from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Task, TaskCollaborators
from .serializers import (
    TaskSerializer,
    TaskStatusSerializer,
    TaskCollaboratorSerializer
)


# Create Task
class CreateTaskView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if user.role != 'manager':
            return Response({"error": "Only managers can create tasks"}, status=403)

        serializer = TaskSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


# Update Task Status
class UpdateTaskStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, task_id):
        user = request.user

        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=404)

        if task.assigned_to != user:
            return Response({"error": "Only assigned user can update status"}, status=403)

        serializer = TaskStatusSerializer(task, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Status updated"}, status=200)

        return Response(serializer.errors, status=400)


# Add Collaborator
class AddCollaboratorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # Only manager can add collaborators
        if user.role != 'manager':
            return Response({"error": "Only managers can add collaborators"}, status=403)

        serializer = TaskCollaboratorSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Collaborator added"}, status=201)

        return Response(serializer.errors, status=400)