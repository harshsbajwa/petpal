from rest_framework.serializers import ModelSerializer
from .models import Comment

#Add serializers for application and shelter (and maybe user as well)

class ApplicationCommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = ['text', 'user', 'application', 'created_at']

class ShelterCommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = ['text', 'shelter', 'created_at']

