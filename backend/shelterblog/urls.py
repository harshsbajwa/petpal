from django.urls import path
from . import views

app_name="shelterblog"
urlpatterns = [ 
    path('shelter/<int:pk1>/blog/', views.ListShelterBlogPost.as_view()),
    path('shelter/<int:pk1>/blog/create/', views.CreateShelterBlogPost.as_view()),
    path('shelter/<int:pk1>/blog/<int:pk>/', views.RetrieveShelterBlogPost.as_view()),
    path('shelter/<int:pk1>/blog/<int:pk>/edit/', views.UpdateShelterBlogPost.as_view()),
    path('shelter/<int:pk1>/blog/<int:pk>/delete/', views.DestroyAPIView.as_view()),
]