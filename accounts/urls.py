from django.urls import path
from .views import SignupView,LoginView,ForgotPasswordView,ResetPasswordView
from .views import UserListView

urlpatterns = [
    path('signup/', SignupView.as_view()),
    path('login/', LoginView.as_view()),
    path('forgot-password/', ForgotPasswordView.as_view()),
    path('reset-password/', ResetPasswordView.as_view()),
    path('users/', UserListView.as_view()),
]