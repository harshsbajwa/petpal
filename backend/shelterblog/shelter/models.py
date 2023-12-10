from django.db import models
from django.contrib.auth.models import AbstractUser
from accounts.models import Shelter 
# Create your models here.

class ShelterBlog(models.Model):
    shelter = models.ForeignKey(Shelter, related_name="shelter", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    text = models.CharField(null=False)
