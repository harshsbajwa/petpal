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
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    pagination_class= PageNumberPagination

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

        user = self.request.user
        sender = user
        shelter_id = serializer.validated_data.get('shelter').user.id

        notification_data = {
            "sender": sender.id,
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

        ordering = self.request.query_params.get('ordering')
        if ordering:
            applications = applications.order_by(ordering)

        serializer = ApplicationSerializer(applications, many=True)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)