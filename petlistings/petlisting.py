from django.db import models
from django.utils.translation import gettext_lazy as _


class ListingStatus(models.TextChoices):
        """An Enum for various Listing statuses. Names are Self-Explanatory."""
        AVAILABLE = 'AVA', _('Available')
        ADOPTED = 'ADO', _('Adopted')
        PENDING = 'PEN', _('Pending')
        WITHDRAWN = 'WIT', _('Withdrawn')


class PetListing(models.Model):
        status: ListingStatus

