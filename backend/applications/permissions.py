from django.shortcuts import get_object_or_404
from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.views import View
from application import Application
from petlistings.petlisting import PetListing


class IsSeekerOrShelter(permissions.BasePermission):
    def has_application_permission(self, request: Request, view: View, application: Application) -> bool:
        """
        Check if the request.user is the pet_seeker user or the pet_listing shelter user.
        """
        return request.user == application.pet_seeker.user or request.user == application.pet_listing.shelter.user


class IsShelter(permissions.BasePermission):
    def has_applications_permission(self, request: Request, view: View) -> bool:
        """
        Check if the request.user is the pet_listing shelter user.
        """
        pet_listing_id = view.kwargs.get('pet_listing_id')
        
        if not pet_listing_id:
            return False
        
        pet_listing = PetListing.objects.filter(id=pet_listing_id).first()

        if pet_listing and pet_listing.shelter.user == request.user:
            return True
        return False