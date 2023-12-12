from rest_framework.permissions import BasePermission
from .models import ShelterBlogger


class IsAuthor(BasePermission):
    """
    Check if User is an author of a Shelter Blog Post.
    """
    def has_object_permission(self, request, view, obj):
        return (obj.author == request.user)
    

class IsMemberOfShelterBlog(BasePermission):
    """
    Given a Blog Post, check if User belongs to the Shelter Blog.
    """
    def has_permission(self, request, view):
        return True if (ShelterBlogger.objects.get(user=request.user, blog=request.data)) else False