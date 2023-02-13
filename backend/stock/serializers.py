from rest_framework.serializers import ModelSerializer

from .models import Company, PriceHistory, Stock


class CompanySerializer(ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"


class StockSerializer(ModelSerializer):
    class Meta:
        model = Stock
        fields = "__all__"


class PriceHistorySerializer(ModelSerializer):
    class Meta:
        model = PriceHistory
        fields = "__all__"
