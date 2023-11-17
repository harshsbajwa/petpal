#id: Unique identifier for the comment.
#text: The content of the comment.
#user: The user who created the comment.
#shelter: The shelter associated with the comment (nullable for general shelter comments).
#application: The application associated with the comment (nullable for general shelter comments).
#created_at: Timestamp indicating when the comment was created.

from django.db import models
# from django.contrib.auth.models import User
from accounts.models import Shelter, User
from applications.application import Application
# from applications.application import Application #import whatever

class Comment(models.Model):
    text = models.CharField(max_length=200, null=False)
    user = models.ForeignKey(User, related_name='user_comments', null=True, on_delete=models.SET_NULL, blank=True)
    shelter = models.ForeignKey(Shelter, related_name="shelter_comments", null=True, on_delete=models.SET_NULL, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ApplicationComment(models.Model):
    text = models.CharField(max_length=200, null=False)
    user = models.ForeignKey(User, related_name='appliation_user_comments', null=True, on_delete=models.SET_NULL, blank=True)
    application = models.ForeignKey(Application, related_name="application_comments", null=True, on_delete=models.SET_NULL, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)