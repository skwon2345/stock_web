from rest_framework.serializers import ModelSerializer

from .models import Candle, Stock


class StockSerializer(ModelSerializer):
    class Meta:
        model = Stock
        fields = "__all__"


class CandleSerializer(ModelSerializer):
    class Meta:
        model = Candle
        fields = "__all__"
