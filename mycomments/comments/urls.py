from django.urls import path
from . import views

urlpatterns = [ 
    path('user/comments/shelter/<int:pk>/create', views.ShelterCommentsListCreate.as_view()),
    path('user/comments/application/<int:pk>/create', views.ApplicationCommentsListCreate.as_view()),
    path('user/comments/shelter/<int:pk>/list', views.RetreiveShelterComments.as_view()),
    path('user/comments/application/<int:pk>/list', views.RetreiveApplicationComments.as_view())
]