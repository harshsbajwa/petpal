from django.urls import path

from accounts.api.views import SeekerRegisterView, ShelterListView, ShelterProfileView, ShelterRegisterView, UserDeleteView
from accounts.api.views import LogoutView, SeekerOnlyView, ShelterOnlyView, UserUpdateView
urlpatterns = [
    path('register/seeker/', SeekerRegisterView.as_view()),
    path('register/shelter/', ShelterRegisterView.as_view()),
    path('logout/', LogoutView.as_view(), name='logout-view'),
    path('seeker/dashboard/', SeekerOnlyView.as_view(), name='seeker-dashboard'),
    path('shelter/dashboard/', ShelterOnlyView.as_view(), name='shelter-dashboard'),
    path("update/user/", UserUpdateView.as_view(), name='user-update'),
    path('shelter/<int:pk>/', ShelterProfileView.as_view(), name='shelter-profile'),
    path('shelters/', ShelterListView.as_view(), name='shelter-list'),
    path('delete/user/', UserDeleteView.as_view(), name='user-update' ),
]
