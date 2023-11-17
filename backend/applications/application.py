from django.db import models
from accounts.models import Seeker, Shelter
from petlistings.models import PetListing


class Application(models.Model):
    """
    An Application Model for a Pet Application.

    Model Fields:
      - pet_seeker: Foreign Key corresponding to creator of Application.
      - pet_listing: Foreign Key corresponding to the Pet Listing.
      - form: JSON Object containing form data.
      - status: The status of this Application: 'accepted', 'denied', 'pending', 'withdrawn'.
      - created_at: When the Application was created.
      - updated_at: When the Application was last updated.
    """
    class Status(models.TextChoices):
        """An Enum for various Application statuses. Names are Self-Explanatory."""
        ACCEPTED = 'Accepted'
        DENIED = 'Denied'
        PENDING = 'Pending'
        WITHDRAWN = 'Adopted'

    pet_seeker = models.ForeignKey(Seeker, on_delete=models.CASCADE, null=False)
    pet_listing = models.ForeignKey(PetListing, on_delete=models.CASCADE, null=False)
    shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE, null=False) #TODO: PUT NULL=FALSE AFTER CHANGES
    form = models.JSONField(default=dict)
    status = models.CharField(max_length=8, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)