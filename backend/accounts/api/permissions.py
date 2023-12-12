from rest_framework.permissions import BasePermission
from applications.application import Application


class IsSeekerUser(BasePermission):
    """Permissions to check if user is a seeker"""
    def has_permission(self, request, view):
        if request.user.is_anonymous:
            return False
        return bool(request.user and request.user.is_seeker)


class IsShelterUser(BasePermission):
    """Permissions to check if user is a shelter"""
    def has_permission(self, request, view):
        if request.user.is_anonymous:
            return False
        return bool(request.user and request.user.is_shelter)


class SeekerShelterApplicationPair(BasePermission):
    ##must use with IsShelterUser
    def has_permission(self, request, view):
        shelter_user = request.user
        seeker_id = view.kwargs.get('pk')
        applications = Application.objects.filter(shelter__user=shelter_user, pet_seeker_id=seeker_id)
        are_pair = applications.exists()
        return are_pair

