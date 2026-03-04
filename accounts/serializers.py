from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import random
from django.core.mail import send_mail
from django.conf import settings
from .models import OTP

class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password'],
            role=validated_data.get('role', 'employee')
        )
        return user
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(
            email=data['email'],
            password=data['password']
        )

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }                                



class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def save(self):
        email = self.validated_data['email']
        otp = str(random.randint(100000, 999999))

        OTP.objects.create(email=email, otp=otp)

        send_mail(
            'Your OTP Code',
            f'Your OTP is {otp}',
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        ) 
class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()
    new_password = serializers.CharField()

    def save(self):
        email = self.validated_data['email']
        otp = self.validated_data['otp']
        new_password = self.validated_data['new_password']

        try:
            otp_obj = OTP.objects.filter(email=email, otp=otp).latest('created_at')
        except OTP.DoesNotExist:
            raise serializers.ValidationError("Invalid OTP")

        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()

        return user           