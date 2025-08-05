from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


# Create your models here.
class User(AbstractUser):
    ROLE_CHOICES = [("admin", "Admin"), ("user", "User")]
    phone = models.CharField(max_length=10, blank=True, null=True)
    role = models.CharField(
        max_length=50, choices=ROLE_CHOICES, default="user", verbose_name="Role"
    )

    def __str__(self):
        return self.get_full_name()
