from rest_framework.serializers import ModelSerializer
from .models import ShelterBlog


class ShelterBlogSerializer(ModelSerializer):
    class Meta:
        model = ShelterBlog
        fields = '__all__'