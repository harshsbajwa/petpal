from django.urls import path

from accounts.api.views import SeekerRegisterView, ShelterRegisterView
from accounts.api.views import LogoutView, SeekerOnlyView, ShelterOnlyView
urlpatterns = [
    path('register/seeker/', SeekerRegisterView.as_view()),
    path('register/shelter/', ShelterRegisterView.as_view()),
    path('logout/', LogoutView.as_view(), name='logout-view'),
    path('seeker/dashboard/', SeekerOnlyView.as_view(), name='seeker-dashboard'),
    path('shelter/dashboard/', ShelterOnlyView.as_view(), name='shelter-dashboard')
]
