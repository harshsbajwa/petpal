from rest_framework.serializers import ModelSerializer
from .models import ShelterBlog, BlogPost


class ShelterBlogSerializer(ModelSerializer):
    class Meta:
        model = ShelterBlog
        fields = '__all__'


class BlogPostSerializer(ModelSerializer):
    class Meta:
        model = BlogPost
        fields = '__all__'