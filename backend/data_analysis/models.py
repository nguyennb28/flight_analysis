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
    brand = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Hãng vận chuyển"
    )
    nationality_label = models.CharField(
        max_length=25, blank=True, null=True, verbose_name="Nhãn hiệu quốc tịch"
    )
    flight_number = models.CharField(
        max_length=25, blank=True, null=True, verbose_name="Số chuyến bay"
    )
    flight_date = models.DateField(blank=True, null=True, verbose_name="Ngày bay")
    departure_point = models.TextField(blank=True, null=True, verbose_name="Nơi đi")
    destination_point = models.TextField(blank=True, null=True, verbose_name="Nơi đến")
    flight_path = models.TextField(blank=True, null=True, verbose_name="Đường bay")
    trasit_place = models.TextField(blank=True, null=True, verbose_name="Nơi quá cảnh")
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)


class GeneralInfo(models.Model):
    number_of_guests = models.IntegerField(
        default=0, null=True, verbose_name="Số khách"
    )
    departure_point = models.TextField(blank=True, null=True, verbose_name="Nơi đi")
    place_of_origin = models.TextField(blank=True, null=True, verbose_name="Nơi xuất")
    destination_point = models.TextField(blank=True, null=True, verbose_name="Nơi đến")
    place_of_entry = models.TextField(blank=True, null=True, verbose_name="Nơi nhập")
    flight = models.ForeignKey(
        Flight,
        on_delete=models.CASCADE,
        verbose_name="Chuyến bay",
        related_name="general_infos",
    )
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)


class Member(models.Model):
    SEX_CHOICES = [("F", "Nữ"), ("M", "Nam")]
    name = models.TextField(max_length=100, blank=True, null=True)
    sex = models.CharField(
        max_length=10, choices=SEX_CHOICES, default="M", verbose_name="Giới tính"
    )
    nationality = models.CharField(max_length=10, blank=True, null=True)
    date_of_birth = models.DateField(null=True)
    number_of_document = models.CharField(
        max_length=25, blank=True, null=True, verbose_name="Số giấy tờ"
    )
    type_of_document = models.CharField(
        max_length=10, blank=True, null=True, verbose_name="Loại giấy tờ"
    )
    place_of_issue = models.CharField(
        max_length=10, blank=True, null=True, verbose_name="Nơi cấp"
    )
    expiration_date = models.DateField(null=True)
    flight = models.ForeignKey(
        Flight,
        on_delete=models.CASCADE,
        verbose_name="Chuyến bay",
        related_name="members",
    )
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)


class Passenger(models.Model):
    SEX_CHOICES = [("F", "Nữ"), ("M", "Nam")]
    number_of_seat = models.CharField(
        max_length=10, blank=True, null=True, verbose_name="Số ghế"
    )
    name = models.TextField(
        max_length=50, blank=True, null=True, verbose_name="Họ và tên"
    )
    sex = models.CharField(
        max_length=10, choices=SEX_CHOICES, default="M", verbose_name="Giới tính"
    )
    nationality = models.CharField(max_length=10, blank=True, null=True)
    date_of_birth = models.DateField(null=True)
    type_of_document = models.CharField(
        max_length=10, blank=True, null=True, verbose_name="Loại giấy tờ"
    )
    number_of_document = models.CharField(
        max_length=25, blank=True, null=True, verbose_name="Số giấy tờ"
    )
    place_of_issue = models.CharField(
        max_length=10, blank=True, null=True, verbose_name="Nơi cấp"
    )
    country_of_residence = models.CharField(
        max_length=25, blank=True, null=True, verbose_name="Quốc gia cư trú"
    )
    departure_point = models.CharField(
        max_length=15, blank=True, null=True, verbose_name="Nơi đi"
    )
    destination_point = models.CharField(
        max_length=15, blank=True, null=True, verbose_name="Nơi đến"
    )
    first_airport = models.CharField(
        max_length=25, blank=True, null=True, verbose_name="Cảng hàng không đầu tiên"
    )
    luggage = models.TextField(
        max_length=100, blank=True, null=True, verbose_name="Hành lý"
    )
    expiration_date = models.DateField(null=True)
    flight = models.ForeignKey(
        Flight,
        on_delete=models.CASCADE,
        verbose_name="Chuyến bay",
        related_name="passengers",
    )
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)


class PassengerPNR(models.Model):
    booking_code = models.CharField(
        max_length=25, blank=True, null=True, verbose_name="Mã đặt chỗ"
    )
    booking_date = models.DateTimeField(null=True)
    ticket_info = models.CharField(
        max_length=50, blank=True, null=True, verbose_name="Thông tin vé"
    )
    name = models.TextField(
        max_length=50, blank=True, null=True, verbose_name="Tên hành khách"
    )
    another_name = models.TextField(
        max_length=50, blank=True, null=True, verbose_name="Tên khác"
    )
    flight_itinerary = models.CharField(
        max_length=50, blank=True, null=True, verbose_name="Hành trình bay"
    )
    address = models.CharField(
        max_length=25, blank=True, null=True, verbose_name="Địa chỉ"
    )
    phone_email = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="Phone/Email"
    )
    contact_info = models.TextField(
        max_length=100, blank=True, null=True, verbose_name="Thông tin liên hệ"
    )
    number_of_passengers_sharing_booking_code = models.IntegerField(
        blank=True, null=True, verbose_name="Số lượng hành khách chung mã đặt chỗ"
    )
    booker_code = models.CharField(
        max_length=25, blank=True, null=True, verbose_name="Mã người đặt chỗ"
    )
    number_of_seat = models.CharField(
        max_length=25, blank=True, null=True, verbose_name="Số ghế"
    )
    luggage_info = models.CharField(
        max_length=25, blank=True, null=True, verbose_name="Thông tin hành lý"
    )
    note = models.TextField(
        max_length=100, blank=True, null=True, verbose_name="Ghi chú"
    )
    flight = models.ForeignKey(
        Flight,
        on_delete=models.CASCADE,
        verbose_name="Chuyến bay",
        related_name="passenger_pnrs",
    )
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
