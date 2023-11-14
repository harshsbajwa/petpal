from rest_framework.serializers import ModelSerializer
from .models import Comment

class ApplicationCommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = ['text', 'user', 'application', 'created_at']

class ShelterCommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = ['text', 'shelter', 'created_at']