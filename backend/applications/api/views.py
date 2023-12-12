from rest_framework import status
from rest_framework.response import Response
from applications.application import Application
from accounts.models import Seeker, Shelter
from petlistings.models import PetListing
from .serializers import ApplicationSerializer
from .permissions import HasApplicationPermission
from accounts.api.permissions import IsShelterUser, IsSeekerUser
from notifications.serializers import NotificationSerializer, NotificationUpdateSerializer
from notifications.models import Notification
from rest_framework import viewsets, mixins
from rest_framework.pagination import PageNumberPagination


class ApplicationsView(mixins.CreateModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    permission_classes = [IsShelterUser|IsSeekerUser, HasApplicationPermission]
    serializer_class = ApplicationSerializer
    pagination_class= PageNumberPagination

    def get_queryset(self):
        user = self.request.user
        if user.is_seeker:
            seeker = Seeker.objects.get(user=user)
            applications = Application.objects.filter(pet_seeker=seeker)
        else:
            shelter = Shelter.objects.get(user=user)
            applications = Application.objects.filter(shelter=shelter)

        app_status = self.request.query_params.get('status', None)
        if app_status is not None:
            applications = applications.filter(status=app_status)

        ordering = self.request.query_params.get('ordering', '-created_at')
        applications = applications.order_by(ordering)

        return applications

    def retrieve(self, request, *args, **kwargs):
        print(request)
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        pet_listing_id = serializer.validated_data.get('pet_listing').id
        pet_listing = PetListing.objects.get(id=pet_listing_id)

        if pet_listing.status != "Available":
            return Response({"error": "This pet is not available for adoption."}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        application = serializer.instance

        """ 

        user = request.user
        if user.is_seeker:
            sender = user
            recipient = application.shelter.user
        else:
            sender = application.shelter.user
            recipient = user

        notification_data = {
            "sender": sender,
            "recipient": recipient,
            "message": "An application has been created for {}".format(application.pet_listing.name),
            "comment": None,
            "application": application
        }
        notification_serializer = NotificationSerializer(data=notification_data)
        
        if notification_serializer.is_valid():
            notification_serializer.save()
        """

        pet_seeker_id = serializer.validated_data.get('pet_seeker').id
        pet_seeker = Seeker.objects.get(id=pet_seeker_id)
        shelter_id = serializer.validated_data.get('shelter').user.id

        notification_data = {
            "sender": pet_seeker.user.id,
            "recipient": shelter_id,
            "message": "A new application is available for {}".format(pet_listing.name),
            "comment": None,
            "application": serializer.instance
        }
            
        notification_serializer = NotificationSerializer(data=notification_data)
        if notification_serializer.is_valid():
            notification_serializer.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        print("updating instead")
        application = self.get_object()
        current_user = request.user
        new_status = request.data.get('status')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        pet_listing_id = serializer.validated_data.get('pet_listing').id
        pet_listing = PetListing.objects.get(id=pet_listing_id)

        if application.pet_seeker.user == current_user:
            if application.status != "pending" and application.status != "accepted":
                return Response({"error": "Pet seeker can only update the status of an application from pending or accepted to withdrawn."}, status=status.HTTP_400_BAD_REQUEST)
            if new_status.lower() != "withdrawn":
                return Response({"error": "Pet seeker can only update the status of an application from pending or accepted to withdrawn."}, status=status.HTTP_400_BAD_REQUEST)
            sender_id = current_user.id
            recipient_id = serializer.validated_data.get('shelter').id

        elif application.shelter.user == current_user:
            if application.status != "pending":
                return Response({"error": "Shelter can only update the status of an application from pending to accepted or denied."}, status=status.HTTP_400_BAD_REQUEST)
            if new_status.lower() not in ["accepted", "denied"]:
                return Response({"error": "Shelter can only update the status of an application from pending to accepted or denied."}, status=status.HTTP_400_BAD_REQUEST)
            sender_id = serializer.validated_data.get('shelter').id
            recipient_id = current_user.id
        
        else:
            return Response({"error": "You do not have permission to update this application."}, status=status.HTTP_403_FORBIDDEN)

        if new_status.lower() != "withdrawn" or new_status.lower() != Application.Status.ACCEPTED or new_status.lower() != Application.Status.DENIED:
            return Response(status.HTTP_400_BAD_REQUEST)
        application.status = Application.Status[new_status.lower()]
        application.save()

        notification_data = {
            "sender": sender_id,
            "recipient": recipient_id,
            "message": "A new update is available for {}".format(pet_listing.name),
            "comment": None,
            "application": serializer.instance
        }

        notification_serializer = NotificationSerializer(data=notification_data)
        if notification_serializer.is_valid():
            notification_serializer.save()

        return super().update(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        search_query = self.request.query_params.get('search', None)
        if search_query:
            pets = PetListing.objects.filter(name__icontains=search_query)
            pet_ids = pets.values_list('id', flat=True)
            queryset = queryset.filter(pet_listing__in=pet_ids)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)