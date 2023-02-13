from rest_framework import generics

from .serializers import (
    Company,
    CompanySerializer,
    PriceHistory,
    PriceHistorySerializer,
    Stock,
    StockSerializer,
)


class CompanyList(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    # permission_classes = [IsAdminUser]


class StockList(generics.ListCreateAPIView):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    # permission_classes = [IsAdminUser]


class PriceHistoryList(generics.ListCreateAPIView):
    queryset = PriceHistory.objects.all()
    serializer_class = PriceHistorySerializer
    # permission_classes = [IsAdminUser]
