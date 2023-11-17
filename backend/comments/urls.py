from django.urls import path
from . import views

urlpatterns = [ 
    path('user/comments/shelter/<int:pk>/', views.ShelterCommentsListCreate.as_view()),
    path('user/comments/application/<int:pk>/', views.ApplicationCommentsListCreate.as_view()),
    path('user/comments/shelter/<int:pk>/list/', views.RetreiveShelterComments.as_view()),
    path('user/comments/application/<int:pk>/list/', views.RetreiveApplicationComments.as_view()),

    # retriveview for specific comment that creates a notification
    path('comments/<int:pk>/', views.RetrieveSingleCommentView.as_view(), name='comment-single'),
]