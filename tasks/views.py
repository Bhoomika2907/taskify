from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView

from django.db.models import Q

from .models import Task
from .serializers import TaskSerializer, TaskStatusSerializer
from projects.models import ProjectMembers


class CreateTaskView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        project_id = request.data.get('project')

        # ✅ Check if user is team lead
        is_lead = ProjectMembers.objects.filter(
            project_id=project_id,
            user=user,
            is_team_lead=True
        ).exists()

        if not is_lead:
            return Response({"error": "Only team lead can create tasks"}, status=403)

        # We don't need to copy the data and manually insert the ID anymore
        serializer = TaskSerializer(data=request.data)

        if serializer.is_valid():
            # ✅ PASS THE USER DIRECTLY HERE
            # This is where the magic happens. It maps 'created_by' to the logged-in user.
            serializer.save(created_by=user) 
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

# 🔥 TASK LIST (ROLE BASED)
class TaskListView(ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        project_id = self.request.query_params.get('project')

        queryset = Task.objects.all()

        # Filter by project if provided
        if project_id:
            queryset = queryset.filter(project_id=project_id)

        # Manager → all
        if user.role == 'manager':
            return queryset

        # Others → only their projects
        return queryset.filter(
            project__projectmembers__user=user
        )


# backend/tasks/views.py

class UpdateTaskStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, task_id):
        user = request.user

        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=404)

        # ✅ NEW LOGIC: Check if the user is the Team Lead for this project
        is_team_lead = ProjectMembers.objects.filter(
            project=task.project,
            user=user,
            is_team_lead=True
        ).exists()

        # ✅ ALLOW if user is Assigned TO the task OR is the Team Lead
        if task.assigned_to != user and not is_team_lead:
            return Response(
                {"error": "Only the assigned user or the Team Lead can update status"}, 
                status=403
            )

        serializer = TaskStatusSerializer(task, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Status updated"}, status=200)

        return Response(serializer.errors, status=400)