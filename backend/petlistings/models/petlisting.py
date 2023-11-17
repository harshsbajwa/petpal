from django.db import models

from accounts.models import Shelter

# Create your models here.
class PetListing(models.Model):
    class Status(models.TextChoices):
        """An Enum for various listing statuses. Names are Self-Explanatory."""
        AVAILABLE = 'Available'
        DENIED = 'Denied'
        PENDING = 'Pending'
        WITHDRAWN = 'Adopted'

    name=models.CharField(max_length=120)
    #need to double check that image is done properly
    image=models.ImageField(blank=True)    #need to change the upload_to attribute
    about=models.CharField(max_length=200)
    breed=models.CharField(max_length=120)
    age=models.PositiveIntegerField()
    gender=models.CharField(max_length=120)
    size=models.CharField(max_length=120)
    status=models.CharField(max_length=120)
    # shelter=models.OnetoOneField()      NEED TO ADD THIS PART IN.... THIS INCLUDES A SHELTER MODEL, AND THEN EDITING TO MAKE SURE THAT IT IS AUTOMATICALLY SET IN THE SERIALIZER JUST LIKE OWNERS AND STORES
    shelter = models.ForeignKey(Shelter, related_name="shelter", on_delete=models.CASCADE)

    #the application model should have petlistings associated by using a foreign key