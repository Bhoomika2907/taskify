from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Comment
from .serializers import CommentSerializer


# Add Comment
class AddCommentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CommentSerializer(data=request.data)

        if serializer.is_valid():
            # ✅ Manually attach the user who is logged in
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        
        # If it still fails, this print will show you exactly WHY in your terminal
        print(serializer.errors) 
        return Response(serializer.errors, status=400)

# Get Comments (task-wise)
class GetCommentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id):
        comments = Comment.objects.filter(task_id=task_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=200)
