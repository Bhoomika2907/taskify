from django.db import models
from django.conf import settings
from projects.models import Project

User = settings.AUTH_USER_MODEL


class Task(models.Model):
    STATUS_CHOICES = (
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    )

    PRIORITY_CHOICES = (
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    )

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()

    project = models.ForeignKey(Project, on_delete=models.CASCADE)

  
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_tasks'
    )

    
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='assigned_tasks'
    )

    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='todo'
    )

    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')

    deadline = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    