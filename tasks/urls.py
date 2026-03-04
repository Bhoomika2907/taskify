from django.urls import path
from .views import CreateTaskView, UpdateTaskStatusView, AddCollaboratorView

urlpatterns = [
    path('create/', CreateTaskView.as_view()),
    path('update-status/<int:task_id>/', UpdateTaskStatusView.as_view()),
    path('add-collaborator/', AddCollaboratorView.as_view()),
]