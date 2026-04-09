from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Project(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    timeline = models.DateField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class ProjectMembers(models.Model):
    ROLE_CHOICES = (
        ('member', 'Member'),
        ('viewer', 'Viewer'),
    )

    id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    is_team_lead = models.BooleanField(default=False)
