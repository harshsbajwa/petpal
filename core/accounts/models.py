from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    # class Role(models.TextChoices):
    #     ADMIN = "ADMIN", 'Admin'
    #     SEEKER = "SEEKER", 'Seeker'
    #     SHELTER = "SHELTER", 'Shelter'
    # role = models.CharField(max_length=50, choices=Role.choices)
    is_seeker= models.BooleanField(default=False)
    is_shelter= models.BooleanField(default=False)

    def __str__(self):
        return self.username

class Seeker(models.Model):
    user = models.OneToOneField(User, related_name="seeker", on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    preferences = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.user.username

class Shelter(models.Model):
    user = models.OneToOneField(User, related_name="shelter", on_delete=models.CASCADE)
    shelter_name = models.CharField(max_length=200, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    mission = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.user.username