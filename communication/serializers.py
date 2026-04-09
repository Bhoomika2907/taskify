from rest_framework import serializers
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    # This helps get the full URL of the file for the frontend
    file_url = serializers.SerializerMethodField()
    text = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Comment
        fields = ['id', 'task', 'user', 'user_name', 'text', 'file', 'file_url', 'created_at']
        # ✅ 'user' MUST be here so the serializer doesn't require it in the POST request
        read_only_fields = ['user', 'created_at', 'user_name']

    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None