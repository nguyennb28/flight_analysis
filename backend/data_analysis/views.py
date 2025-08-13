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
        uploaded_file = request.FILES.get("files")
        if not uploaded_file:
            return Response(
                {"message": "Vui lòng tải file lên"}, status=status.HTTP_400_BAD_REQUEST
            )

        flight_id = self.create_flight_from_file(uploaded_file)
        if not flight_id:
            return Response(
                {"message": "Không thể xử lý thông tin chuyển bay"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        sheet_to_process = ["Thongtinchung", "Hanhkhach", "PNR"]
        for sheet_name in sheet_to_process:
            self.process_data_sheet(uploaded_file, sheet_name, flight_id)

        return Response({"message": "Xử lý file thành công"})

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
                    records = df1.to_dict("records")
                    objects = [
                        GeneralInfo(**rec, flight_id=flight_id) for rec in records
                    ]
                    GeneralInfo.objects.bulk_create(objects)
                case "Hanhkhach":
                    records = df1.to_dict("records")
                    objects = [Passenger(**rec, flight_id=flight_id) for rec in records]
                    Passenger.objects.bulk_create(objects)
                case "PNR":
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
            )
            if sheet_name == "Thongtinchung":
                records = df2.to_dict("records")
                objects = [Member(**rec, flight_id=flight_id) for rec in records]
                Member.objects.bulk_create(objects)

    # @transaction.atomic
    # def post(self, request, *args, **kwargs):
    #     uploaded_files = request.FILES.getlist("files")

    #     if not uploaded_files:
    #         return Response(
    #             {"message": "Không có file nào được gửi lên."},
    #             status=status.HTTP_400_BAD_REQUEST,
    #         )

    #     file_names = [file.name for file in uploaded_files]

    #     for excel_file in uploaded_files:
    #         for sheet_name in self.SHEET_NAMES:
    #             self.bulk_create(excel_file, sheet_name)

    #     return Response(
    #         {
    #             "message": f"Đã nhận thành công {len(uploaded_files)} file: {', '.join(file_names)}"
    #         },
    #         status=status.HTTP_201_CREATED,
    #     )

    # def raw_sheet(self, file, sheet_name):
    #     sheet = None
    #     first_result = None
    #     second_result = None

    #     for elem in self.LABEL_NAMES:
    #         for detail in elem:
    #             if sheet_name == elem[detail]:
    #                 sheet = elem

    #     if sheet["first_row"]:
    #         if sheet["first_nrows"]:
    #             first_result = pd.read_excel(
    #                 file,
    #                 sheet_name=sheet["sheet"],
    #                 skiprows=sheet["first_skiprow"],
    #                 usecols=sheet["first_row"],
    #                 nrows=sheet["first_nrows"],
    #             )
    #         else:
    #             first_result = pd.read_excel(
    #                 file,
    #                 sheet_name=sheet["sheet"],
    #                 skiprows=sheet["first_skiprow"],
    #                 usecols=sheet["first_row"],
    #             )
    #     if sheet["second_row"]:
    #         if sheet["second_nrows"]:
    #             second_result = pd.read_excel(
    #                 file,
    #                 sheet_name=sheet["sheet"],
    #                 skiprows=sheet["second_skiprow"],
    #                 usecols=sheet["second_row"],
    #                 nrows=sheet["second_nrows"],
    #             )
    #         else:
    #             second_result = pd.read_excel(
    #                 file,
    #                 sheet_name=sheet["sheet"],
    #                 skiprows=sheet["second_skiprow"],
    #                 usecols=sheet["second_row"],
    #             )
    #     if first_result is not None:
    #         print(first_result)

    #     if second_result is not None:
    #         print(second_result)

    # def bulk_create(self, file, sheet_name):
    #     sheet = None
    #     first_result = None
    #     second_result = None
    #     foreign_key = None

    #     for elem in self.LABEL_NAMES:
    #         for detail in elem:
    #             if sheet_name == elem[detail]:
    #                 sheet = elem

    #     if sheet["first_row"]:
    #         if sheet["first_nrows"]:
    #             first_result = pd.read_excel(
    #                 file,
    #                 sheet_name=sheet["sheet"],
    #                 skiprows=sheet["first_skiprow"],
    #                 usecols=sheet["first_row"],
    #                 nrows=sheet["first_nrows"],
    #                 keep_default_na=False,
    #             )
    #         else:
    #             first_result = pd.read_excel(
    #                 file,
    #                 sheet_name=sheet["sheet"],
    #                 skiprows=sheet["first_skiprow"],
    #                 usecols=sheet["first_row"],
    #                 keep_default_na=False,
    #             )
    #         if first_result is not None:
    #             match sheet_name:
    #                 case "Chuyenbay":
    #                     first_result = first_result.rename(
    #                         columns={
    #                             "Hãng vận chuyển": "brand",
    #                             "Nhãn hiệu quốc tịch": "nationality_label",
    #                             "Số chuyến bay": "flight_number",
    #                             "Ngày bay": "flight_date",
    #                             "Nơi đi": "departure_point",
    #                             "Nơi đến": "destination_point",
    #                             "Đường bay": "flight_path",
    #                             "Nơi quá cảnh": "trasit_place",
    #                         }
    #                     )
    #                     objects_to_create = []
    #                     for index, row in first_result.iterrows():
    #                         objects_to_create.append(
    #                             Flight(
    #                                 brand=row["brand"],
    #                                 nationality_label=row["nationality_label"],
    #                                 flight_number=row["flight_number"],
    #                                 departure_point=row["departure_point"],
    #                                 destination_point=row["destination_point"],
    #                                 flight_path=row["flight_path"],
    #                                 trasit_place=row["trasit_place"],
    #                             )
    #                         )
    #                     Flight.objects.bulk_create(objects_to_create)
    #                     foreign_key = Flight.objects.latest("id").id

    #                 case "Thongtinchung":
    #                     columns_to_drop = ["Through on same flight"]
    #                     first_result = first_result.drop(columns_to_drop, axis=1)
    #                     first_result = first_result.rename(
    #                         columns={
    #                             "Số khách": "number_of_guests",
    #                             "Nơi đi": "departure_point",
    #                             "Nơi xuất cảnh": "place_of_origin",
    #                             "Nơi đến": "destination_point",
    #                             "Nơi nhập cảnh": "place_of_entry",
    #                         }
    #                     )
    #                     objects_to_create = []
    #                     for index, row in first_result.iterrows():
    #                         objects_to_create.append(
    #                             GeneralInfo(
    #                                 number_of_guests=row["number_of_guests"],
    #                                 departure_point=row["departure_point"],
    #                                 place_of_origin=row["place_of_origin"],
    #                                 destination_point=row["destination_point"],
    #                                 place_of_entry=row["place_of_entry"],
    #                                 flight_id=foreign_key,
    #                             )
    #                         )
    #                     GeneralInfo.objects.bulk_create(objects_to_create)
    #                 case "Hanhkhach":
    #                     first_result = first_result.rename(
    #                         columns={
    #                             "Số ghế": "number_of_seat",
    #                             "Họ và tên": "name",
    #                             "Giới tính": "sex",
    #                             "Quốc tịch": "nationality",
    #                             "Ngày sinh": "date_of_birth",
    #                             "Loại giấy tờ": "type_of_document",
    #                             "Số giấy tờ": "number_of_document",
    #                             "Nơi cấp": "place_of_issue",
    #                             "Quốc gia cư trú": "country_of_residence",
    #                             "Nơi đi": "departure_point",
    #                             "Nơi đến": "destination_point",
    #                             "Cảng hàng không đầu tiên": "first_airport",
    #                             "Hành lý": "luggage",
    #                             "Ngày hết hạn": "expiration_date",
    #                         }
    #                     )
    #                     objects_to_create = []
    #                     for index, row in first_result.iterrows():
    #                         objects_to_create.append(
    #                             Passenger(
    #                                 number_of_seat=row["number_of_seat"],
    #                                 name=row["name"],
    #                                 sex=row["sex"],
    #                                 nationality=row["nationality"],
    #                                 date_of_birth=row["date_of_birth"],
    #                                 type_of_document=row["type_of_document"],
    #                                 number_of_document=row["number_of_document"],
    #                                 place_of_issue=row["place_of_issue"],
    #                                 country_of_residence=row["country_of_residence"],
    #                                 departure_point=row["departure_point"],
    #                                 destination_point=row["destination_point"],
    #                                 first_airport=row["first_airport"],
    #                                 luggage=row["luggage"],
    #                                 expiration_date=row["expiration_date"],
    #                                 flight_id=foreign_key,
    #                             )
    #                         )
    #                     # Passenger.objects.bulk_create(objects_to_create)
    #                 case "PNR":
    #                     first_result = first_result.rename(
    #                         columns={
    #                             "Mã đặt chỗ": "booking_code",
    #                             "Ngày đặt chỗ": "booking_date",
    #                             "Thông tin vé": "ticket_info",
    #                             "Tên hành khách": "name",
    #                             "Tên khác": "another_name",
    #                             "Hành trình bay": "flight_itinerary",
    #                             "Địa chỉ": "address",
    #                             "Điện thoại/Email": "phone_email",
    #                             "Thông tin liên hệ": "contact_info",
    #                             "Số lượng hành khách chung mã đặt chỗ": "number_of_passengers_sharing_booking_code",
    #                             "Mã người đặt chỗ": "booker_code",
    #                             "Số ghế": "number_of_seat",
    #                             "Thông tin hành lý": "luggage_info",
    #                             "Ghi chú": "note",
    #                         }
    #                     )
    #                     objects_to_create = []
    #                     for index, row in first_result.iterrows():
    #                         objects_to_create.append(
    #                             PassengerPNR(
    #                                 booking_code=row["booking_code"],
    #                                 booking_date=row["booking_date"],
    #                                 ticket_info=row["ticket_info"],
    #                                 name=row["name"],
    #                                 another_name=row["another_name"],
    #                                 flight_itinerary=row["flight_itinerary"],
    #                                 address=row["address"],
    #                                 phone_email=row["phone_email"],
    #                                 contact_info=row["contact_info"],
    #                                 number_of_passengers_sharing_booking_code=row[
    #                                     "number_of_passengers_sharing_booking_code"
    #                                 ],
    #                                 booker_code=row["booker_code"],
    #                                 number_of_seat=row["number_of_seat"],
    #                                 luggage_info=row["luggage_info"],
    #                                 note=row["note"],
    #                                 flight_id=foreign_key,
    #                             )
    #                         )
    #                     # PassengerPNR.objects.bulk_create(PassengerPNR)

    #     if sheet["second_row"]:
    #         if sheet["second_nrows"]:
    #             second_result = pd.read_excel(
    #                 file,
    #                 sheet_name=sheet["sheet"],
    #                 skiprows=sheet["second_skiprow"],
    #                 usecols=sheet["second_row"],
    #                 nrows=sheet["second_nrows"],
    #                 keep_default_na=False,
    #             )
    #         else:
    #             second_result = pd.read_excel(
    #                 file,
    #                 sheet_name=sheet["sheet"],
    #                 skiprows=sheet["second_skiprow"],
    #                 usecols=sheet["second_row"],
    #                 keep_default_na=False,
    #             )
    #         if second_result is not None:
    #             match sheet_name:
    #                 case "Thongtinchung":
    #                     second_result = second_result.rename(
    #                         columns={
    #                             "Họ và tên": "name",
    #                             "Giới tính": "sex",
    #                             "Quốc tịch": "nationality",
    #                             "Ngày sinh": "date_of_birth",
    #                             "Số giấy tờ": "number_of_document",
    #                             "Loại giấy tờ": "type_of_document",
    #                             "Nơi cấp": "place_of_issue",
    #                             "Ngày hết hạn": "expiration_date",
    #                         }
    #                     )
    #                     objects_to_create = []
    #                     for index, row in second_result.iterrows():
    #                         objects_to_create.append(
    #                             Member(
    #                                 name=row["name"],
    #                                 sex=row["sex"],
    #                                 nationality=row["nationality"],
    #                                 date_of_birth=row["date_of_birth"],
    #                                 number_of_document=row["number_of_document"],
    #                                 type_of_document=row["type_of_document"],
    #                                 place_of_issue=row["place_of_issue"],
    #                                 expiration_date=row["expiration_date"],
    #                                 flight_id=foreign_key,
    #                             )
    #                         )
    #                     # Member.objects.bulk_create(objects_to_create)

    #     if first_result is not None:
    #         print(first_result)

    #     if second_result is not None:
    #         print(second_result)
