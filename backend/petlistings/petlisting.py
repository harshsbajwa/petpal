from django.db import models


class ListingStatus(models.TextChoices):
        """An Enum for various Listing statuses. Names are Self-Explanatory."""
        AVAILABLE = 'Available'
        ADOPTED = 'Adopted'
        PENDING = 'Pending'
        WITHDRAWN = 'Withdrawn'


class PetListing(models.Model):
        status: ListingStatus