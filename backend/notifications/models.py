from django.db import models
from accounts.models import User
from comments.models import Comment
from applications.application import Application

# Create your models here.
class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notification_recipient')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notification_sender')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    creation_date = models.DateTimeField(auto_now_add=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='comment_notification', null=True, blank=True)
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='application_notification', null=True, blank=True)