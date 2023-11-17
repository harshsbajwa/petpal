from rest_framework.serializers import ModelSerializer
from .models import Comment, ApplicationComment

#Add serializers for application and shelter (and maybe user as well)

class ApplicationCommentSerializer(ModelSerializer):
    class Meta:
        model = ApplicationComment
        #fields = ['text', 'user', 'application', 'created_at']
        # fields = ['text', 'created_at']
        fields = '__all__'

class ShelterCommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = ['user', 'text', 'shelter', 'created_at']

class SpecificCommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
