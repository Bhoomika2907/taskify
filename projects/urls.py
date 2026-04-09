from django.urls import path
from .views import CreateProjectView , ProjectListView
from .views import AddProjectMemberView
from .views import ProjectDetailView
from .views import AddMultipleMembersView
from .views import ProjectMembersView

urlpatterns = [
    path('', ProjectListView.as_view()), # GET /api/projects/
    path('create/', CreateProjectView.as_view()), # POST /api/projects/create/
    path('add-member/', AddProjectMemberView.as_view()),
    path('<int:pk>/', ProjectDetailView.as_view()),
    path('<int:project_id>/members/', ProjectMembersView.as_view()),
    path('add-members/', AddMultipleMembersView.as_view()),
]