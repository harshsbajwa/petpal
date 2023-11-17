from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, UpdateAPIView, DestroyAPIView
from .models import Notification
from .serializers import NotificationSerializer, NotificationUpdateSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from accounts.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
# Create your views here.

# class NotificationCreate(CreateAPIView):
#     queryset = Notification.objects.all()
#     serializer_class = NotificationSerializer
#     permission_class = [IsAuthenticated]

#     def perform_create(self, serializer):
#         recipient = get_object_or_404(User, id=self.request.data.get('recipient'))
#         serializer.save(sender=self.request.user, recipient=recipient)

# class NotificationView(APIView):
#     def post():
#         serializer = NotificationSerializer
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     def get(self, request, id):
#         notifs = Notificaton.objects.filter(recipient=self.kwargs['id'])
#         serializer = NotificationSerializer(notifs, many=True )
#         return Response(serializer.data)

class NotificationListView(ListAPIView):
    serializer_class  = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class= PageNumberPagination
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by('-creation_date')

class ReadNotificationListView(ListAPIView):
    serializer_class  = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class= PageNumberPagination
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user, is_read=True).order_by('-creation_date')

class UnreadNotificationListView(ListAPIView):
    serializer_class  = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class= PageNumberPagination
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user, is_read=False).order_by('-creation_date')

class UpdateNotificationView(UpdateAPIView):
    serializer_class = NotificationUpdateSerializer
    queryset = Notification.objects.all()
    def update(self, request, *args, **kwargs):
        if self.get_object().recipient == self.request.user:
            notification = self.get_object()
            readValue = request.data.get('is_read')

            notification.is_read = readValue
            notification.save()
            
            serializer = self.get_serializer(notification)
            return Response(serializer.data)
        else:
            return Response("You do no have access to this notification", status=status.HTTP_400_BAD_REQUEST)

class DeleteNotificationView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Notification.objects.all()
    def delete(self, request, *args, **kwargs):
        if self.get_object().recipient == self.request.user:
            notification = self.get_object()
            serializer = NotificationSerializer(notification)
            notification.delete()
            return Response(serializer.data)
        else:
            return Response("You do no have access to this notification", status=status.HTTP_400_BAD_REQUEST)
