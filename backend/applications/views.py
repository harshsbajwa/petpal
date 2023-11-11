from rest_framework import viewsets
from rest_framework.generics import ListAPIView
from application import Application
from petlistings.petlisting import PetListing
from serializers import ApplicationSerializer
from permissions import IsSeekerOrShelter, IsShelter


class ApplicationView(viewsets.ModelViewSet):
    permission_classes = [IsSeekerOrShelter]
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer


class ApplicationsViewList(ListAPIView):
    permission_classes = [IsShelter]
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        pet_listing_id = self.kwargs['pet_listing_id']
        pet_listing = PetListing.objects.filter(id=pet_listing_id)
        return Application.objects.filter(pet_listing=pet_listing)