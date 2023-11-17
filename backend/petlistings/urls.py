from django.urls import path
from . import views

app_name="petlistings"
urlpatterns=[
    path('user/petlistings/', views.PetListingCreate.as_view(), name='petlistings'),
    path('user/petlistings/<int:pk>/', views.PetListingRetrieveUpdateDestroy.as_view(), name='listingedit'),
    path('user/petlistings/results/', views.PetListingSearch.as_view(), name='petlistingsearch'),
]