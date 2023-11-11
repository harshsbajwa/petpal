from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .comment import Comment
from .serializers import ApplicationCommentSerializer, ShelterCommentSerializer
from accounts.shelter import Shelter
from applications.application import Application


class ShelterCommentsList(ListCreateAPIView):
    serializer_class = ShelterCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): 
        # Obtain comments on the speciifc shelter
        return Comment.objects.filter(shelter=self.kwargs['pk'])
    
    def perform_create(self, serializer):
        shelter = get_object_or_404(Shelter, pk=self.kwargs['pk'])
        serializer.save(shelter=shelter)


class ApplicationCommentsList(ListCreateAPIView):
    serializer_class = ApplicationCommentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self): 
        # Obtain comments on the specifc application
        return Comment.objects.filter(application=self.kwargs['pk'])
    
    def perform_create(self, serializer):
        application = get_object_or_404(Application, pk=self.kwargs['pk'])
        if application.pet_seeker.user == self.request.user or application.pet_listing.shelter.user == self.request.user:
            serializer.save(application=application)
        else:
            raise PermissionDenied("You are not allowed to comment on this application")