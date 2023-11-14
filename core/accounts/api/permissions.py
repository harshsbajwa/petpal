from rest_framework.permissions import BasePermission

class IsSeekerUser(BasePermission):
    def has_permission(self,request, view):
        return bool(request.user and request.user.is_seeker)

class IsShelterUser(BasePermission):
    def has_permission(self,request, view):
        return bool(request.user and request.user.is_shelter)