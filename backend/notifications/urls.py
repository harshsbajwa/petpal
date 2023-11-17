from django.urls import path
from . import views

urlpatterns = [ 
    path('notifications/', views.NotificationListView.as_view(), name='notifications'),
    path('notifications/read/', views.ReadNotificationListView.as_view(), name='read-notifications'),
    path('notifications/unread/', views.UnreadNotificationListView.as_view(), name='unread-notifications'),
    path('notifications/<int:pk>/', views.UpdateNotificationView.as_view(), name='update-notifications'),
    path('notifications/deletion/<int:pk>/', views.DeleteNotificationView.as_view(), name='delete-notifications'),
]