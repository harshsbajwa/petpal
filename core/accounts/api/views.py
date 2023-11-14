from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import SeekerRegisterSerializer, ShelterRegisterSerializer, UserSerializer
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