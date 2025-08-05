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