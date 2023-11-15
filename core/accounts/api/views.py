from rest_framework import generics, status
from rest_framework.response import Response

from accounts.models import Seeker, Shelter
from .serializers import SeekerDeleteSerializer, SeekerRegisterSerializer, SeekerUpdateSerializer, ShelterDeleteSerializer, ShelterProfileSerializer, ShelterRegisterSerializer, ShelterUpdateSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .permissions import IsSeekerUser, IsShelterUser

class SeekerRegisterView(generics.GenericAPIView):
    serializer_class = SeekerRegisterSerializer
    def post(self, request, *args, **kwargs):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user":UserSerializer(user, context=self.get_serializer_context()).data,
            "message":"account created successfully"
        })

class ShelterRegisterView(generics.GenericAPIView):
    serializer_class = ShelterRegisterSerializer
    def post(self, request, *args, **kwargs):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user":UserSerializer(user, context=self.get_serializer_context()).data,
            "message":"account created successfully"
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
            seeker = Seeker.objects.get(user=user)
            # get the applications
            #delete the notifications for the seeker side but not the shelter side (probably have duplicate notifications one for seeker and one for shelter)
            seeker_serializer = SeekerDeleteSerializer(seeker)
            seeker.delete()
            #also delete the applications and notifications
            user.delete()
            return Response(seeker_serializer.data, status=status.HTTP_204_NO_CONTENT)
        elif user.is_shelter:
            shelter = Shelter.objects.get(user=user)
            # get all the pet listings
            #delete the notifications for the seeker side but not the shelter side (probably have duplicate notifications one for seeker and one for shelter)
            shelter_serializer = ShelterDeleteSerializer(shelter)
            shelter.delete()
            #also delete the other stuff
            user.delete()
            return Response(shelter_serializer.data, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response("Invalid User Type", status=status.HTTP_400_BAD_REQUEST)
