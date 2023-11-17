from applications.application import Application
from petlistings.models.petlisting import PetListing
from petlistings.serializers import PetListingSerializer
from rest_framework import generics, status
from rest_framework.response import Response

from accounts.models import Seeker, Shelter
from .serializers import SeekerDeleteSerializer, SeekerProfileSerializer, SeekerRegisterSerializer, SeekerUpdateSerializer, ShelterDeleteSerializer, ShelterProfileSerializer, ShelterRegisterSerializer, ShelterUpdateSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .permissions import IsSeekerUser, IsShelterUser, SeekerShelterApplicationPair

class SeekerRegisterView(generics.GenericAPIView):
    serializer_class = SeekerRegisterSerializer
    def post(self, request, *args, **kwargs):
        #save the seeker
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        #send response
        return Response({
            "user":UserSerializer(user, context=self.get_serializer_context()).data,
            "message":"account successfully created "
        })

class ShelterRegisterView(generics.GenericAPIView):
    serializer_class = ShelterRegisterSerializer
    def post(self, request, *args, **kwargs):
        #save the seeker
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        #send response
        return Response({
            "user":UserSerializer(user, context=self.get_serializer_context()).data,
            "message":"account successfully created "
        })

class LogoutView(APIView):
    def post(self, request, format=None):
        request.auth.delete()
        return Response(status=status.HTTP_200_OK)

class SeekerOnlyView(generics.RetrieveAPIView):
    permission_classes= [IsAuthenticated&IsSeekerUser]
    serializer_class=UserSerializer

    def get_object(self):
        return self.request.user

class ShelterOnlyView(generics.RetrieveAPIView):
    permission_classes= [IsAuthenticated&IsShelterUser]
    serializer_class=UserSerializer

    def get_object(self):
        return self.request.user

class UserUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        user = self.request.user
        if user.is_seeker:
            return Seeker.objects.get_or_create(user=user)[0]
        elif user.is_shelter:
            return Shelter.objects.get_or_create(user=user)[0]
        else:
            raise ValueError("You are neither a Seeker or Shelter")
    
    def get_serializer_class(self):
        user = self.request.user
        if user.is_seeker:
            return SeekerUpdateSerializer
        elif user.is_shelter:
            return ShelterUpdateSerializer
        else:
            raise ValueError("You are neither a Seeker or Shelter")

class ShelterProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Shelter.objects.all()
    serializer_class= ShelterProfileSerializer

    def retrieve(self, request, *args, **kwargs):
        shelter = self.get_object()
        petlistings = PetListing.objects.filter(shelter=shelter)

        shelter_serializer = self.get_serializer(shelter)
        pets_serializer = PetListingSerializer(petlistings, many=True)

        data = {
            'shelter': shelter_serializer.data,
            'petslistings': pets_serializer.data
        }

        return Response(data, status=status.HTTP_200_OK)

class SeekerProfileView(generics.RetrieveAPIView):
    #can only be seen by shelters that have an active applications with this pk which is a seeker
    permission_classes = [IsAuthenticated&IsShelterUser&SeekerShelterApplicationPair]
    queryset = Seeker.objects.all()
    serializer_class= SeekerProfileSerializer

class ShelterListView(generics.ListAPIView):
    queryset = Shelter.objects.all()
    serializer_class = ShelterProfileSerializer

class UserDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        if user.is_seeker:
            #delete seeker
            seeker = Seeker.objects.get(user=user)

            seeker_serializer = SeekerDeleteSerializer(seeker)
            seeker.delete()
            user.delete()
            return Response(seeker_serializer.data, status=status.HTTP_204_NO_CONTENT)
        elif user.is_shelter:
            #delete shelter
            shelter = Shelter.objects.get(user=user)
            shelter_serializer = ShelterDeleteSerializer(shelter)
            
            shelter.delete()
            user.delete()

            return Response(shelter_serializer.data, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response("Invalid User Type", status=status.HTTP_400_BAD_REQUEST)
