from rest_framework import serializers
from .models import User, Flight, GeneralInfo, Member, Passenger, PassengerPNR
import re
from rest_framework.validators import UniqueValidator
from django.contrib.auth import get_user_model


class UserSerializer(serializers.ModelSerializer):

    phone = serializers.CharField(validators=[], max_length=10)
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        # fields = "__all__"
        fields = [
            "id",
            "username",
            "password",
            "first_name",
            "last_name",
            "full_name",
            "role",
            "phone",
        ]

        extra_kwargs = {"password": {"write_only": True}}

    def get_full_name(self, obj):
        return obj.get_full_name()

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        instance = super().update(instance, validated_data)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    # Check phone is valid
    def validate_phone(self, value):
        value = value.strip()
        if not re.fullmatch(r"\d{10}", value):
            raise serializers.ValidationError("Số điện thoại phải gồm đúng 10 chữ số")
        if self.instance and self.instance.phone == value:
            return value
        return value


class GeneralInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneralInfo
        fields = "__all__"


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = "__all__"


class PassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        fields = "__all__"


class PassengerPNRSerializer(serializers.ModelSerializer):
    class Meta:
        model = PassengerPNR
        fields = "__all__"


class FlightSerializer(serializers.ModelSerializer):
    general_infos = GeneralInfoSerializer(many=True, read_only=True)
    members = MemberSerializer(many=True, read_only=True)
    passengers = PassengerSerializer(many=True, read_only=True)
    passenger_pnrs = PassengerPNRSerializer(many=True, read_only=True)

    class Meta:
        model = Flight
        fields = "__all__"