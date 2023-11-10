#id: Unique identifier for the comment.
#text: The content of the comment.
#user: The user who created the comment.
#shelter: The shelter associated with the comment (nullable for general shelter comments).
#application: The application associated with the comment (nullable for general shelter comments).
#created_at: Timestamp indicating when the comment was created.

from django.db import models
from django.contrib.auth.models import User
#from .applications import Application #import whatever

class Comment(models.Model):
    text = models.CharField(max_length=200, null=False)
    user = models.ForeignKey(User, related_name='usercomments', 
                                null=True, on_delete=models.SET_NULL,
                                blank=True)
    shelter = models.ForeignKey(User, related_name="creatorcomments", null=True, on_delete=models.SET_NULL,
                                blank=True)
    #application = models.ForeignObject(Application, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

