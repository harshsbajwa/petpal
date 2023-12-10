from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework import status
from accounts.models import Shelter
from .models import ShelterBlog
from .serializers import ShelterBlogSerializer
from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000

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
        #obtain comments on the speciifc shelter
        return ShelterBlog.objects.filter(shelter=self.kwargs['pk']).order_by('-created_at')
