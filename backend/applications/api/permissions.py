from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.views import View
from applications.application import Application


class HasApplicationPermission(permissions.BasePermission):
    def has_object_permission(self, request: Request, view: View, application: Application) -> bool:
        """
        Check if the request.user is the pet_seeker user or the pet_listing shelter user.
        """
        return request.user == application.pet_seeker.user or request.user == application.shelter.user