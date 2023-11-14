from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.permissions import IsAdminUser
from ..models import PetListing
from ..serializers import PetListingSerializer, SortFilterSerializer

class PetListingRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    serializer_class = PetListingSerializer
    def get_object(self):
        return get_object_or_404(PetListing, id=self.kwargs['pk'])
        #add a check to make sure it is the shelter eg add shelter=
    
class PetListingCreate(ListCreateAPIView):
    serializer_class = PetListingSerializer
    queryset = PetListing.objects.all()

class PetListingSearch(ListAPIView):
    serializer_class = SortFilterSerializer
    queryset = PetListing.objects.all()
    
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