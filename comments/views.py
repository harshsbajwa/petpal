from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .comments import Comment
from .serializers import ApplicationCommentSerializer, ShelterCommentSerializer
#import Shelter model
#import Application model

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



    