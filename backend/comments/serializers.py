from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .comment import Comment


class ApplicationCommentSerializer(ModelSerializer):
    replies = serializers.RecursiveField(many=True, required=False)
    class Meta:
        model = Comment
        fields = ['text', 'user', 'created_at', 'replies']


class ShelterCommentSerializer(ModelSerializer):
    replies = serializers.RecursiveField(many=True, required=False)
    class Meta:
        model = Comment
        fields = ['text', 'user', 'created_at', 'replies']
