from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework import status
from notifications.serializers import NotificationSerializer
from accounts.models import Shelter
from applications.application import Application
from .models import ApplicationComment, Comment
from .serializers import ApplicationCommentSerializer, ShelterCommentSerializer, SpecificCommentSerializer
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
    permission_classes = [IsAuthenticated]
    serializer_class = ShelterCommentSerializer
    pagination_class= PageNumberPagination
    
    def get_queryset(self): 
        #obtain comments on the speciifc shelter
        return Comment.objects.filter(shelter=self.kwargs['pk'])
    
    def perform_create(self, serializer):
        shelter = get_object_or_404(Shelter, pk=self.kwargs['pk'])
        serializer.save(shelter=shelter, user=self.request.user)

        user = self.request.user
        sender = user
        recipient = shelter.user 

        notification_data = {
            "sender": sender.id,
            "recipient": recipient.id,
            "message": "A new comment is available for shelter name {}".format(shelter.user.username),
            "comment": None,
            "application": serializer.instance
        }
            
        notification_serializer = NotificationSerializer(data=notification_data)
        if notification_serializer.is_valid():
            notification_serializer.save()

class ApplicationCommentsListCreate(ListCreateAPIView):
    serializer_class = ApplicationCommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class= PageNumberPagination
    
    def get_queryset(self): 
        #obtain comments on the speciifc application
        return Comment.objects.filter(application=self.kwargs['pk'])
    
    def perform_create(self, serializer):
        application = get_object_or_404(Application, pk=self.kwargs['pk'])
        if application.pet_seeker.user == self.request.user or application.shelter.user == self.request.user:
            serializer.save(application=application, user=self.request.user)

            user = self.request.user
            sender = user
            recipient = application.shelter.user
            notification_data = {
                "sender": sender.id,
                "recipient": recipient.id,
                "message": "A new comment is available on the application for {}".format(application.pet_listing.name),
                "comment": None,
                "application": serializer.instance
            }

            notification_serializer = NotificationSerializer(data=notification_data)
            if notification_serializer.is_valid():
                notification_serializer.save()

        else:
            raise PermissionDenied("You are not allowed to comment on this application")

# class RetreiveShelterComments(APIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = ShelterCommentSerializer
#     def get(self, request, pk):
#         comments = Comment.objects.filter(shelter=pk).order_by('-created_at')
#         return Response([
#             {
#                 'text': comment.text,
#                 'user': comment.user,
#                 'shelter': comment.shelter,
#                 'created on': comment.created_at,
#              }
#              for comment in comments])

class RetreiveShelterComments(ListAPIView):
    serializer_class = ShelterCommentSerializer
    pagination_class= PageNumberPagination
    def get_queryset(self): 
        #obtain comments on the speciifc shelter
        return Comment.objects.filter(shelter=self.kwargs['pk']).order_by('-created_at')

#used for when we click on comment link for notification
class RetrieveSingleCommentView(RetrieveAPIView):
    serializer_class = SpecificCommentSerializer
    def get_queryset(self):
        comment_id = self.kwargs.get('pk')
        queryset = Comment.objects.filter(id=comment_id, shelter__user=self.request.user)
        return queryset



# class RetreiveApplicationComments(APIView):
#     serializer_class = ApplicationCommentSerializer
#     permission_classes = [IsAuthenticated]
#     def get(self, request, *args, **kwargs):
#         application = get_object_or_404(Application, pk=self.kwargs['pk'])
#         comments = ApplicationComment.objects.filter(application=self.kwargs['pk']).order_by('-created_at')
#         if application.pet_seeker.user == self.request.user or application.shelter.user == self.request.user:
#             return Response([
#             {
#                 'text': comment.text,
#                 'user': comment.user,
#                 'shelter': comment.application.shelter,
#                 'application':comment.application,
#                 'created on': comment.created_at,
#              }
#              for comment in comments])
#         else:
#             raise PermissionDenied("You are not allowed to view comments on this application")
        

class RetreiveApplicationComments(ListAPIView):
    serializer_class = ApplicationCommentSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        application = get_object_or_404(Application, pk=self.kwargs['pk'])
        if application.pet_seeker.user == self.request.user or application.shelter.user == self.request.user:
            return ApplicationComment.objects.filter(application=self.kwargs['pk']).order_by('-created_at')
        else:
            raise PermissionDenied("You are not allowed to view comments on this application")

