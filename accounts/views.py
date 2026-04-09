from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SignupSerializer
from .serializers import LoginSerializer
from .serializers import ForgotPasswordSerializer
from .serializers import ResetPasswordSerializer
from rest_framework.generics import ListAPIView
from .models import User
from .serializers import SignupSerializer
from rest_framework.permissions import IsAuthenticated

class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=201)

        return Response(serializer.errors, status=400)
    
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            return Response(serializer.validated_data, status=200)

        return Response(serializer.errors, status=400)
    
class ForgotPasswordView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "OTP sent"}, status=200)

        return Response(serializer.errors, status=400)


class ResetPasswordView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password reset successful"}, status=200)

        return Response(serializer.errors, status=400)
    

class UserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = SignupSerializer
    permission_classes = [IsAuthenticated]