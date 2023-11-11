from rest_framework.serializers import ModelSerializer
from application import Application
from comments.serializers import ApplicationCommentSerializer


class ApplicationSerializer(ModelSerializer):
    comments = ApplicationCommentSerializer(many=True, read_only=True)
    class Meta:
        model = Application
        fields = ['id', 'pet_seeker', 'pet_listing', 'status', 'created_at', 'updated_at', 'form', 'comments']