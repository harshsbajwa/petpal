from django.db import models
from django.contrib.auth.models import User


class PetSeeker(models.Model):
    user: User
    def __init__(self, user: User) -> None:
        self.user = user
