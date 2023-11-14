from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Comment
from .serializers import ApplicationCommentSerializer, ShelterCommentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
#import Shelter model
#import Application model

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000

class ShelterCommentsListCreate(ListCreateAPIView):
    serializer_class = ShelterCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): 
        #obtain comments on the speciifc shelter
        return Comment.objects.filter(shelter=self.kwargs['pk'])
    
    def perform_create(self, serializer):
        shelter = get_object_or_404(Shelter, pk=self.kwargs['pk'])
        serializer.save(shelter=shelter)

class ApplicationCommentsListCreate(ListCreateAPIView):
    serializer_class = ApplicationCommentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self): 
        #obtain comments on the speciifc application
        return Comment.objects.filter(application=self.kwargs['pk'])
    
    def perform_create(self, serializer):
        application = get_object_or_404(Application, pk=self.kwargs['pk'])
        if application.owner == self.request.user or application.shelter == self.request.user:
            serializer.save(application=application)
        else:
            raise PermissionDenied("You are not allowed to comment on this application")

class RetreiveShelterComments(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        comments = Comment.objects.filter(shelter=self.kwargs['pk']).order_by('-created_at')
        return Response([
            {
                'text': comment.text,
                'user': comment.user,
                'shelter': comment.shelter,
                'created on': comment.created_at,
             }
             for comment in comments])

class RetreiveApplicationComments(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        application = get_object_or_404(Application, pk=self.kwargs['pk'])
        comments = Comment.objects.filter(application=self.kwargs['pk']).order_by('-created_at')
        if application.owner == self.request.user or application.shelter == self.request.user:
            return Response([
            {
                'text': comment.text,
                'user': comment.user,
                'shelter': comment.shelter,
                'application':comment.application,
                'created on': comment.created_at,
             }
             for comment in comments])
        else:
            raise PermissionDenied("You are not allowed to view comments on this application")
        
