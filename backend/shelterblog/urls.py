from django.urls import path
from . import views

app_name="shelterblog"
urlpatterns = [ 
    path('shelter/<int:blogid>/blog/', views.ListShelterBlogPost.as_view()),
    path('shelter/<int:blogid>/blog/<int:postid>/', views.RetrieveShelterBlogPost.as_view()),
    path('shelter/<int:blogid>/blog/<int:postid>/edit/', views.UpdateShelterBlogPost.as_view()),
    path('shelter/<int:blogid>/blog/<int:postid>/delete/', views.DestroyAPIView.as_view()),
]