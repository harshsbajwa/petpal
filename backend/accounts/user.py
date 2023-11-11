from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    role: str
    def is_shelter(self) -> bool:
        if self.role != 'Shelter':
            return False
        else:
            return True