from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


# Custom User Manager
class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, role='employee'):
        if not email:
            raise ValueError("User must have an email")

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            role=role,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        user = self.create_user(
            email=email,
            name=name,
            password=password,
            role='manager'
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


# Custom User Model
class User(AbstractBaseUser):
    ROLE_CHOICES = (
        ('manager', 'Manager'),
        ('employee', 'Employee'),
    )

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    created_at = models.DateTimeField(auto_now_add=True)

    # Required for Django internally
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email
def has_perm(self, perm, obj=None):
    return True

def has_module_perms(self, app_label):
    return True

class OTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
