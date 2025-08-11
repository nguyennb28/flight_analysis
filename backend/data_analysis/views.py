from django.shortcuts import render
from .models import User
from .serializers import UserSerializer
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
                {"message": "Không có file nào được gửi lên."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        file_names = [file.name for file in uploaded_files]

        for excel_file in uploaded_files:
            for sheet_name in self.SHEET_NAMES:
                self.bulk_create(excel_file, sheet_name)

        return Response(
            {
                "message": f"Đã nhận thành công {len(uploaded_files)} file: {', '.join(file_names)}"
            },
            status=status.HTTP_201_CREATED,
        )

    def raw_sheet(self, file, sheet_name):
        sheet = None
        first_result = None
        second_result = None

        for elem in self.LABEL_NAMES:
            for detail in elem:
                if sheet_name == elem[detail]:
                    sheet = elem

        if sheet["first_row"]:
            if sheet["first_nrows"]:
                first_result = pd.read_excel(
                    file,
                    sheet_name=sheet["sheet"],
                    skiprows=sheet["first_skiprow"],
                    usecols=sheet["first_row"],
                    nrows=sheet["first_nrows"],
                )
            else:
                first_result = pd.read_excel(
                    file,
                    sheet_name=sheet["sheet"],
                    skiprows=sheet["first_skiprow"],
                    usecols=sheet["first_row"],
                )
        if sheet["second_row"]:
            if sheet["second_nrows"]:
                second_result = pd.read_excel(
                    file,
                    sheet_name=sheet["sheet"],
                    skiprows=sheet["second_skiprow"],
                    usecols=sheet["second_row"],
                    nrows=sheet["second_nrows"],
                )
            else:
                second_result = pd.read_excel(
                    file,
                    sheet_name=sheet["sheet"],
                    skiprows=sheet["second_skiprow"],
                    usecols=sheet["second_row"],
                )
        if first_result is not None:
            print(first_result)

        if second_result is not None:
            print(second_result)

    def bulk_create(self, file, sheet_name):
        sheet = None
        first_result = None
        second_result = None

        for elem in self.LABEL_NAMES:
            for detail in elem:
                if sheet_name == elem[detail]:
                    sheet = elem

        if sheet["first_row"]:
            if sheet["first_nrows"]:
                first_result = pd.read_excel(
                    file,
                    sheet_name=sheet["sheet"],
                    skiprows=sheet["first_skiprow"],
                    usecols=sheet["first_row"],
                    nrows=sheet["first_nrows"],
                    keep_default_na=False,
                )
            else:
                first_result = pd.read_excel(
                    file,
                    sheet_name=sheet["sheet"],
                    skiprows=sheet["first_skiprow"],
                    usecols=sheet["first_row"],
                    keep_default_na=False,
                )
            if first_result is not None:
                match sheet_name:
                    case "Chuyenbay":
                        first_result = first_result.rename(
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
                    case "Thongtinchung":
                        columns_to_drop = ["Through on same flight"]
                        first_result = first_result.drop(columns_to_drop, axis=1)
                        first_result = first_result.rename(
                            columns={
                                "Số khách": "number_of_guests",
                                "Nơi đi": "departure_point",
                                "Nơi xuất cảnh": "place_of_origin",
                                "Nơi đến": "destination_point",
                                "Nơi nhập cảnh": "place_of_entry",
                            }
                        )
                    case "Hanhkhach":
                        first_result = first_result.rename(
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
                    case "PNR":
                        first_result = first_result.rename(
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
        if sheet["second_row"]:
            if sheet["second_nrows"]:
                second_result = pd.read_excel(
                    file,
                    sheet_name=sheet["sheet"],
                    skiprows=sheet["second_skiprow"],
                    usecols=sheet["second_row"],
                    nrows=sheet["second_nrows"],
                    keep_default_na=False,
                )
            else:
                second_result = pd.read_excel(
                    file,
                    sheet_name=sheet["sheet"],
                    skiprows=sheet["second_skiprow"],
                    usecols=sheet["second_row"],
                    keep_default_na=False,
                )
            if second_result is not None:
                match sheet_name:
                    case "Thongtinchung":
                        second_result = second_result.rename(
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
        if first_result is not None:
            print(first_result)

        if second_result is not None:
            print(second_result)
