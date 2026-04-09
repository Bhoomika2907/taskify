from django.db import models
from django.conf import settings
from tasks.models import Task

User = settings.AUTH_USER_MODEL


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField(blank=True, null=True) # ✅ Must have blank=True, null=True
    file = models.FileField(upload_to='comment_attachments/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)