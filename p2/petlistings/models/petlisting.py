from django.db import models

# Create your models here.
class PetListing(models.Model):
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
    

    #the application model should have petlistings associated by using a foreign key