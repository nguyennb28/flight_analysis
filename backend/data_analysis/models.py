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
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.get_full_name()

class Flight(models.Model):
    brand = models.CharField(max_length=100, blank=True, null=True)
    nationality_label = models.CharField(max_length=25, blank=True, null=True)
    flight_number = models.CharField(max_length=25, blank=True, null=True)
    flight_date = models.DateField(blank=True, null=True)
    departure_point = models.TextField(blank=True, null=True)
    destination_point = models.TextField(blank=True, null=True)
    flight_path = models.TextField(blank=True, null=True)
    trasit_place = models.TextField(blank=True, null=True)

# class GeneralInfo(models.Model):
    
