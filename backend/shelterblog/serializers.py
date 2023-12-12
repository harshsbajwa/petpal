from rest_framework.serializers import ModelSerializer
from .models import ShelterBlog, BlogPost
from accounts.models import Shelter, User


class ShelterBlogSerializer(ModelSerializer):
    class Meta:
        model = ShelterBlog
        fields = '__all__'


class BlogPostSerializer(ModelSerializer):
    class Meta:
        model = BlogPost
        exclude = ['id', 'created_at', 'cover_image', 'file', 'updated_on', 'views']
        depth = 1