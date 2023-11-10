from django.urls import path
from . import views

urlpatterns = [ 
    path('user/comments/<int:pk>/shelter', views.ShelterCommentsListCreate.as_view()),
     path('user/comments/<int:pk>/application', views.ApplicationCommentsListCreate.as_view()),
]