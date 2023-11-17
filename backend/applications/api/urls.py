from django.urls import path
from .views import ApplicationsView

urlpatterns = [ 
    path('applications/', ApplicationsView.as_view({'get': 'list', 'post': 'create'}), name="applications"),
    path('application/<int:pk>/', ApplicationsView.as_view({'get': 'retrieve', 'post': 'update'}), name="application")
]