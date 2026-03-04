from django.urls import path
from .views import AddCommentView, GetCommentsView

urlpatterns = [
    path('add/', AddCommentView.as_view()),
    path('task/<int:task_id>/', GetCommentsView.as_view()),
]