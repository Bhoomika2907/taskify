from django.urls import path
from .views import TaskListView
from .views import CreateTaskView, UpdateTaskStatusView, TaskListView
urlpatterns = [
    path('', TaskListView.as_view()),
    path('create/', CreateTaskView.as_view()),
    path('update-status/<int:task_id>/', UpdateTaskStatusView.as_view()),
]