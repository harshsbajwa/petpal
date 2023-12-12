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
        fields = '__all__'
        depth = 1
    