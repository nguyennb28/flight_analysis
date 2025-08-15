from django.shortcuts import render
from .models import User
from .serializers import (
    UserSerializer,
    FlightSerializer,
    GeneralInfoSerializer,
    MemberSerializer,
    PassengerSerializer,
    PassengerPNRSerializer,
)
from django.db.models import Q
from .permissions import (
    IsRoleAdmin,
    IsRoleUser,
    IsBothOfUs,
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from django.db.models import Value, CharField
from django.db.models.functions import Concat
from rest_framework.parsers import MultiPartParser, FormParser
import pandas as pd
from django.db import transaction
from .models import Flight, GeneralInfo, Member, Passenger, PassengerPNR


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy", "list"]:
            permission_classes = [IsRoleAdmin]
        elif self.action in ["retrieve", "me"]:
            permission_classes = [IsBothOfUs]
        else:
            permission_classes = [IsRoleAdmin]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = User.objects.all()
        param = self.request.query_params.get("q")
        if param:
            queryset = queryset.filter(
                Q(username__icontains=param)
                | Q(first_name__icontains=param)
                | Q(last_name__icontains=param)
                | Q(phone__icontains=param)
                | Q(role__icontains=param)
            )
        return queryset

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UploadExcel(APIView):
    parser_classes = (MultiPartParser, FormParser)

    SHEET_NAMES = ["Chuyenbay", "Thongtinchung", "Hanhkhach", "PNR"]
    LABEL_NAMES = [
        {
            "sheet": "Chuyenbay",
            "headers": ["Thông tin chuyến bay"],
            "first_row": [
                "Hãng vận chuyển",
                "Nhãn hiệu quốc tịch",
                "Số chuyến bay",
                "Ngày bay",
                "Nơi đi",
                "Nơi đến",
                "Đường bay",
                "Nơi quá cảnh",
            ],
            "second_row": None,
            "first_skiprow": 2,
            "second_skiprow": None,
            "first_nrows": None,
            "second_nrows": None,
        },
        {
            "sheet": "Thongtinchung",
            "headers": ["Thông tin chung", "Danh sách thành viên tổ bay"],
            "first_row": [
                "Số khách",
                "Nơi đi",
                "Nơi xuất cảnh",
                "Through on same flight",
                "Nơi đến",
                "Nơi nhập cảnh",
                "Through on same flight",
            ],
            "second_row": [
                "Họ và tên",
                "Giới tính",
                "Quốc tịch",
                "Ngày sinh",
                "Số giấy tờ",
                "Loại giấy tờ",
                "Nơi cấp",
                "Ngày hết hạn",
            ],
            "first_skiprow": 2,
            "second_skiprow": 7,
            "first_nrows": 1,
            "second_nrows": None,
        },
        {
            "sheet": "Hanhkhach",
            "headers": ["Danh sách hành khách"],
            "first_row": [
                "Số ghế",
                "Họ và tên",
                "Giới tính",
                "Quốc tịch",
                "Ngày sinh",
                "Loại giấy tờ",
                "Số giấy tờ",
                "Nơi cấp",
                "Quốc gia cư trú",
                "Nơi đi",
                "Nơi đến",
                "Cảng hàng không đầu tiên",
                "Hành lý",
                "Ngày hết hạn",
            ],
            "second_row": None,
            "first_skiprow": 2,
            "second_skiprow": None,
            "first_nrows": None,
            "second_nrows": None,
        },
        {
            "sheet": "PNR",
            "headers": ["Danh sách hành khách PNR"],
            "first_row": [
                "Mã đặt chỗ",
                "Ngày đặt chỗ",
                "Thông tin vé",
                "Tên hành khách",
                "Tên khác",
                "Hành trình bay",
                "Địa chỉ",
                "Điện thoại/Email",
                "Thông tin liên hệ",
                "Số lượng hành khách chung mã đặt chỗ",
                "Mã người đặt chỗ",
                "Số ghế",
                "Thông tin hành lý",
                "Ghi chú",
            ],
            "second_row": None,
            "first_skiprow": 2,
            "second_skiprow": None,
            "first_nrows": None,
            "second_nrows": None,
        },
    ]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        uploaded_files = request.FILES.getlist("files")
        if not uploaded_files:
            return Response(
                {"message": "Vui lòng tải file lên"}, status=status.HTTP_400_BAD_REQUEST
            )
        for elem in uploaded_files:
            flight_id = self.create_flight_from_file(elem)
            if not flight_id:
                return Response(
                    {"message": "Không thể xử lý thông tin chuyến bay"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            sheet_to_process = ["Thongtinchung", "Hanhkhach", "PNR"]
            for sheet_name in sheet_to_process:
                self.process_data_sheet(elem, sheet_name, flight_id)
        return Response(
            {"message": "Xử lý các file thành công"}, status=status.HTTP_201_CREATED
        )

    def create_flight_from_file(self, file):
        config = next(
            (item for item in self.LABEL_NAMES if item["sheet"] == "Chuyenbay"), None
        )
        if not config:
            return None

        raw = pd.read_excel(
            file,
            sheet_name="Chuyenbay",
            skiprows=config["first_skiprow"],
            usecols=config["first_row"],
            keep_default_na=False,
        )
        raw = raw.rename(
            columns={
                "Hãng vận chuyển": "brand",
                "Nhãn hiệu quốc tịch": "nationality_label",
                "Số chuyến bay": "flight_number",
                "Ngày bay": "flight_date",
                "Nơi đi": "departure_point",
                "Nơi đến": "destination_point",
                "Đường bay": "flight_path",
                "Nơi quá cảnh": "trasit_place",
            }
        )
        raw["flight_date"] = pd.to_datetime(
            raw["flight_date"], format="%d/%m/%Y", errors="coerce"
        )

        flight_data = raw.to_dict("records")[0]

        flight = Flight.objects.create(**flight_data)
        return flight.id

    def process_data_sheet(self, file, sheet_name, flight_id):
        config = next(
            (item for item in self.LABEL_NAMES if item["sheet"] == sheet_name), None
        )
        if not config:
            return

        if config.get("first_row"):
            df1 = pd.read_excel(
                file,
                sheet_name=sheet_name,
                skiprows=config.get("first_skiprow"),
                usecols=config.get("first_row"),
                nrows=config.get("first_nrows"),
                keep_default_na=False,
            )

            match sheet_name:
                case "Thongtinchung":
                    columns_to_drop = ["Through on same flight"]
                    df1 = df1.drop(columns_to_drop, axis=1)
                    df1 = df1.rename(
                        columns={
                            "Số khách": "number_of_guests",
                            "Nơi đi": "departure_point",
                            "Nơi xuất cảnh": "place_of_origin",
                            "Nơi đến": "destination_point",
                            "Nơi nhập cảnh": "place_of_entry",
                        }
                    )
                    records = df1.to_dict("records")

                    objects = [
                        GeneralInfo(**rec, flight_id=flight_id) for rec in records
                    ]
                    GeneralInfo.objects.bulk_create(objects)
                case "Hanhkhach":
                    df1 = df1.rename(
                        columns={
                            "Số ghế": "number_of_seat",
                            "Họ và tên": "name",
                            "Giới tính": "sex",
                            "Quốc tịch": "nationality",
                            "Ngày sinh": "date_of_birth",
                            "Loại giấy tờ": "type_of_document",
                            "Số giấy tờ": "number_of_document",
                            "Nơi cấp": "place_of_issue",
                            "Quốc gia cư trú": "country_of_residence",
                            "Nơi đi": "departure_point",
                            "Nơi đến": "destination_point",
                            "Cảng hàng không đầu tiên": "first_airport",
                            "Hành lý": "luggage",
                            "Ngày hết hạn": "expiration_date",
                        }
                    )
                    df1["date_of_birth"] = pd.to_datetime(
                        df1["date_of_birth"], format="%d/%m/%Y", errors="coerce"
                    )
                    df1["expiration_date"] = pd.to_datetime(
                        df1["expiration_date"], format="%d/%m/%Y", errors="coerce"
                    )
                    records = df1.to_dict("records")

                    objects = [Passenger(**rec, flight_id=flight_id) for rec in records]
                    Passenger.objects.bulk_create(objects)
                case "PNR":
                    df1 = df1.rename(
                        columns={
                            "Mã đặt chỗ": "booking_code",
                            "Ngày đặt chỗ": "booking_date",
                            "Thông tin vé": "ticket_info",
                            "Tên hành khách": "name",
                            "Tên khác": "another_name",
                            "Hành trình bay": "flight_itinerary",
                            "Địa chỉ": "address",
                            "Điện thoại/Email": "phone_email",
                            "Thông tin liên hệ": "contact_info",
                            "Số lượng hành khách chung mã đặt chỗ": "number_of_passengers_sharing_booking_code",
                            "Mã người đặt chỗ": "booker_code",
                            "Số ghế": "number_of_seat",
                            "Thông tin hành lý": "luggage_info",
                            "Ghi chú": "note",
                        }
                    )
                    df1["booking_date"] = pd.to_datetime(
                        df1["booking_date"], format="%d/%m/%Y %H:%M", errors="coerce"
                    )
                    # Nat solve
                    df1["booking_date"] = (
                        df1["booking_date"]
                        .astype(object)
                        .where(df1["booking_date"].notna(), None)
                    )
                    records = df1.to_dict("records")

                    objects = [
                        PassengerPNR(**rec, flight_id=flight_id) for rec in records
                    ]
                    PassengerPNR.objects.bulk_create(objects)

        if config.get("second_row"):
            df2 = pd.read_excel(
                file,
                sheet_name=sheet_name,
                skiprows=config.get("second_skiprow"),
                usecols=config.get("second_row"),
                nrows=config.get("second_nrows"),
                keep_default_na=False,
            )
            if sheet_name == "Thongtinchung":
                df2 = df2.rename(
                    columns={
                        "Họ và tên": "name",
                        "Giới tính": "sex",
                        "Quốc tịch": "nationality",
                        "Ngày sinh": "date_of_birth",
                        "Số giấy tờ": "number_of_document",
                        "Loại giấy tờ": "type_of_document",
                        "Nơi cấp": "place_of_issue",
                        "Ngày hết hạn": "expiration_date",
                    }
                )
                df2["date_of_birth"] = pd.to_datetime(
                    df2["date_of_birth"], format="%d/%m/%Y", errors="coerce"
                )
                df2["expiration_date"] = pd.to_datetime(
                    df2["expiration_date"], format="%d/%m/%Y", errors="coerce"
                )
                records = df2.to_dict("records")

                objects = [Member(**rec, flight_id=flight_id) for rec in records]
                Member.objects.bulk_create(objects)


class FlightViewSet(viewsets.ModelViewSet):
    queryset = Flight.objects.all().order_by("-flight_date")
    serializer_class = FlightSerializer
    permission_classes = [IsBothOfUs]

    def get_queryset(self):
        queryset = Flight.objects.all().order_by("-flight_date")
        param = self.request.query_params.get("q")

        if param:
            queryset = queryset.filter(
                Q(brand__icontains=param)
                | Q(nationality_label__icontains=param)
                | Q(flight_number__icontains=param)
                | Q(flight_date__icontains=param)
                | Q(departure_point__icontains=param)
                | Q(destination_point__icontains=param)
                | Q(flight_path__icontains=param)
                | Q(trasit_place__icontains=param)
                | Q(created_at__icontains=param)
            )
        return queryset
