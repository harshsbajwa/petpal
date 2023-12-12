from django.shortcuts import get_object_or_404
from accounts.api.permissions import IsShelterUser
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from ..models import PetListing
from ..serializers import PetListingSerializer, SortFilterSerializer
from accounts.models import Shelter
from rest_framework.pagination import PageNumberPagination

class PetListingRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    serializer_class = PetListingSerializer
    def get_object(self):
        return get_object_or_404(PetListing, id=self.kwargs['pk'])
        #add a check to make sure it is the shelter eg add shelter=
    
class PetListingCreate(ListCreateAPIView):
    permission_classes= [IsAuthenticated&IsShelterUser]
    serializer_class = PetListingSerializer
    queryset = PetListing.objects.all()
    pagination_class= PageNumberPagination
    def perform_create(self, serializer):
        serializer.save(shelter=Shelter.objects.get(user=self.request.user))
    

class PetListingSearch(ListAPIView):
    serializer_class = SortFilterSerializer
    queryset = PetListing.objects.all()
    pagination_class= PageNumberPagination
    
    def get_queryset(self):
        queryset = PetListing.objects.all()
        status = self.request.query_params.get('status', None)
        breed = self.request.query_params.get('breed', None)
        age = self.request.query_params.get('age', None)

        if status is not None:
            queryset = queryset.filter(status=status)
        if breed is not None:
            queryset = queryset.filter(breed=breed)
        if age is not None:
            queryset = queryset.filter(age=age)

        ordering = self.request.query_params.get('ordering', 'name')
        queryset = queryset.order_by(ordering)

        return queryset