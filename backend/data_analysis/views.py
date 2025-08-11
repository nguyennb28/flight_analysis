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

    def post(self, request, *args, **kwargs):
        uploaded_files = request.FILES.getlist("files")

        if not uploaded_files:
            return Response(
                {"message": "Không có file nào được gửi lên."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Ở bước này, chúng ta chỉ cần xác nhận đã nhận được file.
        # Logic xử lý bằng Pandas sẽ ở bước tiếp theo.
        file_names = [file.name for file in uploaded_files]

        print("Đã nhận được các file:", file_names)  # In ra console để kiểm tra

        for excel_file in uploaded_files:
            self.raw_sheet(excel_file)

        return Response(
            {
                "message": f"Đã nhận thành công {len(uploaded_files)} file: {', '.join(file_names)}"
            },
            status=status.HTTP_201_CREATED,
        )

    def raw_sheet(self, file):
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

        # sheet = None
        first_result = None
        second_result = None

        for sheet_name in SHEET_NAMES:
            for elem in LABEL_NAMES:
                for detail in elem:
                    if sheet_name == elem[detail]:
                        print(elem["sheet"])
                        if elem["first_row"]:
                            if elem["first_nrows"]:
                                first_result = pd.read_excel(
                                    file,
                                    sheet_name=elem["sheet"],
                                    skiprows=elem["first_skiprow"],
                                    usecols=elem["first_row"],
                                    nrows=elem["first_nrows"],
                                )
                            else:
                                first_result = pd.read_excel(
                                    file,
                                    sheet_name=elem["sheet"],
                                    skiprows=elem["first_skiprow"],
                                    usecols=elem["first_row"],
                                )
                        if elem["second_row"]:
                            if elem["second_nrows"]:
                                second_result = pd.read_excel(
                                    file,
                                    sheet_name=elem["sheet"],
                                    skiprows=elem["second_skiprow"],
                                    usecols=elem["second_row"],
                                    nrows=elem["second_nrows"],
                                )
                            else:
                                second_result = pd.read_excel(
                                    file,
                                    sheet_name=elem["sheet"],
                                    skiprows=elem["second_skiprow"],
                                    usecols=elem["second_row"],
                                )
                        if first_result is not None:
                            print(f"First result:\n {first_result}")

                        if second_result is not None:
                            print(f"Second result:\n {second_result}")
