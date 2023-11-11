from datetime import datetime
from django.db import models
from accounts.petseeker import PetSeeker
from petlistings.petlisting import PetListing


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

    pet_seeker = models.ForeignKey(PetSeeker, on_delete=models.CASCADE, null=False)
    pet_listing = models.ForeignKey(PetListing, on_delete=models.CASCADE, null=False)
    form = models.JSONField(default=dict)
    status = models.CharField(choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Setter - Status
    def SetStatus(self, status: Status) -> None:
        """Sets the Status of the Application. Refer to the Status Enum."""
        self.Status = status
        self.save()