from django.db import models

class Notification(models.Model):
    message=models.CharField()
    # receiver=models.ForeignKey()   NEED TO FINISH THIS
    #sender?
    link=models.URLField(max_length=200, null=True, blank=True)
    status=models.CharField(max_length=10, default='unread')  #this is either read or unread
    sender=models.ForeignKey()