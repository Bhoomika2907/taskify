from django.urls import path
from .views import CreateProjectView , ProjectListView

urlpatterns = [
    path('', ProjectListView.as_view()), 
    path('create/', CreateProjectView.as_view()),
]