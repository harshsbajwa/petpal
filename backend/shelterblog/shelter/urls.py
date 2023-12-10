from django.urls import path
from . import views

urlpatterns = [ 
    path('shelter/<int:pk>/blog/', views.ShelterBlogListCreate.as_view()),
]