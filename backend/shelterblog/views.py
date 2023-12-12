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
    permission_classes = [IsAuthenticated,]
    serializer_class = BlogPostSerializer
    queryset = BlogPost.objects.all()


class UpdateShelterBlogPost(UpdateAPIView):
    permission_classes = [IsAuthor,]
    serializer_class = BlogPostSerializer


class CreateShelterBlogPost(CreateAPIView):
    permission_classes = [IsMemberOfShelterBlog,]
    serializer_class = BlogPostSerializer

    def create(self, request, *args, **kwargs):
        print("we are here.. inseide. create.")
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            print("inside inside woww")
            serializer.save(request.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("outside oh no :(")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DestroyShelterBlogPost(DestroyAPIView):
    permission_classes = [IsAuthor,]
    serializer_class = BlogPostSerializer

    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class ListShelterBlogPost(ListAPIView):
    permission_classes = [IsAuthenticated,]
    serializer_class = BlogPostSerializer
    queryset = BlogPost.objects.all()

    def get(self, *args, **kwargs):
        queryset = self.get_queryset()

        id = self.kwargs.get('pk1')
        
        shelterblog = get_object_or_404(ShelterBlog, id=id)

        queryset = queryset.filter(parent=shelterblog)

        category = self.request.query_params.get('category', None)
        if category is not None:
            queryset = queryset.filter(category=category)

        author = self.request.query_params.get('author', None)
        if author is not None:
            queryset = queryset.filter(author=author)

        search_query = self.request.query_params.get('s', None)
        if search_query:
            queryset = queryset.filter(title__icontains=search_query)

        ordering = self.request.query_params.get('ordering', '-created_at')
        queryset = queryset.order_by(ordering)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)