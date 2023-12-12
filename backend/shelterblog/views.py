from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, UpdateAPIView, RetrieveAPIView, ListAPIView, CreateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAuthor, IsMemberOfShelterBlog
from rest_framework.exceptions import PermissionDenied
from rest_framework import status
from accounts.models import Shelter
from .models import ShelterBlog, BlogPost, ShelterBlogger
from .serializers import ShelterBlogSerializer, BlogPostSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from rest_framework.response import Response


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 30


class ShelterBlogListCreate(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShelterBlogSerializer
    pagination_class= PageNumberPagination
    
    def get_queryset(self): 
        return ShelterBlog.objects.filter(shelter=self.kwargs['pk'])
    
    def perform_create(self, serializer):
        shelter = get_object_or_404(Shelter, pk=self.kwargs['pk'])
        if shelter.user == self.request.user:
            serializer.save(shelter=shelter)

        else:
            raise PermissionDenied("You are not allowed to create a blogpost for this shelter")


class RetreiveShelterBlog(ListAPIView):
    serializer_class = ShelterBlogSerializer
    pagination_class= PageNumberPagination
    def get_queryset(self): 
        return ShelterBlog.objects.filter(shelter=self.kwargs['pk']).order_by('-created_at')
    

class RetrieveShelterBlogPost(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BlogPostSerializer


class UpdateShelterBlogPost(UpdateAPIView):
    permission_classes = [IsAuthor]
    serializer_class = BlogPostSerializer


class CreateShelterBlogPost(CreateAPIView):
    permission_classes = [IsMemberOfShelterBlog]
    serializer_class = BlogPostSerializer

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class DestroyShelterBlogPost(DestroyAPIView):
    permission_classes = [IsAuthor]
    serializer_class = BlogPostSerializer

    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class ListShelterBlogPost(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BlogPostSerializer

    def get(self, *args, **kwargs):
        blog_id = self.kwargs.get('blogid')
        
        shelter_blog = get_object_or_404(ShelterBlog, id=blog_id)

        blogposts = BlogPost.objects.filter(blog=shelter_blog)

        category = self.request.POST['category']
        if category is not None:
            blogposts = blogposts.filter(category=category)

        author = self.request.POST['author']
        if author is not None:
            blogposts = blogposts.filter(author=author)

        search_query = self.request.query_params.get('s', None)
        if search_query:
            blogposts = BlogPost.objects.filter(title__icontains=search_query)

        ordering = self.request.query_params.get('ordering', '-created_at')
        blogposts = blogposts.order_by(ordering)

        page = self.paginate_queryset(blogposts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(blogposts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)