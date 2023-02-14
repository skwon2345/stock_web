from datetime import date, datetime, timedelta

import yfinance as yf
from django.forms.models import model_to_dict
from django.http import Http404
from rest_framework import generics
from rest_framework.response import Response

from .serializers import Candle, CandleSerializer, Stock, StockSerializer
from .utils.chart import Chart


class StockRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    # permission_classes = [IsAdminUser]

    def retrieve(self, request, *args, **kwargs):
        symbol = self.kwargs.get("symbol")
        try:
            obj = Stock.objects.get(symbol=symbol)
        except Stock.DoesNotExist:
            try:
                company = yf.Ticker(symbol)
            except:
                raise Http404
            else:
                company_info = company.info
                stock = Stock(
                    symbol=symbol,
                    name=company_info["shortName"],
                    sector=company_info["sector"],
                    website=company_info["website"],
                    price=round(
                        company.history(period="1d").Close.tolist()[0], 2
                    ),
                    recommendation_key=company_info.info["recommendationKey"],
                )
                # TODO: search for safe save() way - Validation?
                stock.save()

                obj = Stock.objects.get(symbol=symbol)
            # TODO: add else: to update latest candle information and stock.price information

        serializer = StockSerializer(obj)
        return Response(serializer.data)


class StockListCreate(generics.ListCreateAPIView):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    # permission_classes = [IsAdminUser]


class CandleListCreate(generics.ListCreateAPIView):
    queryset = Candle.objects.all()
    serializer_class = CandleSerializer
    # permission_classes = [IsAdminUser]

    def list(self, request, *args, **kwargs):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """

        symbol = request.query_params.get("symbol")
        from_date = request.query_params.get("from")
        to_date = request.query_params.get("to")

        queryset = Candle.objects.filter(symbol=symbol)

        if queryset.exists():
            # Update Candles to get latest information
            queryset = queryset.order_by("date")
            latest = model_to_dict(queryset.order_by("date").last())

            self.update_or_create_candles(
                symbol,
                "D",
                latest["date"].strftime("%Y-%m-%d %H:%M:%S"),
                date.today().strftime("%Y-%m-%d %H:%M:%S"),
            )

        else:
            # Create Candles
            self.create_candles(
                symbol,
                "D",
                "1900-01-01 00:00:00",
                date.today().strftime("%Y-%m-%d %H:%M:%S"),
            )

        queryset = (
            Candle.objects.filter(symbol=symbol)
            .filter(date__gte=from_date)
            .filter(date__lte=to_date)
            .order_by("date")
        )

        serializer = CandleSerializer(queryset, many=True)
        return Response(serializer.data)

    def create_candles(
        self,
        symbol: str,
        resolution: str,
        from_date: str,
        to_date: str,
    ) -> None:
        chart = Chart(
            symbol,
            resolution,
            from_date,
            to_date,
        )

        obj = Stock.objects.get(symbol=symbol)

        for chart_data in chart.data:
            candle = Candle(
                symbol=obj,
                open=chart_data["Candle"]["Open"],
                high=chart_data["Candle"]["High"],
                low=chart_data["Candle"]["Low"],
                close=chart_data["Candle"]["Close"],
                date=datetime.strptime(
                    chart_data["Date"], "%Y-%m-%d %H:%M:%S"
                ).date(),
            )
            candle.save()

    def update_or_create_candles(
        self, symbol: str, resolution: str, from_date: str, to_date: str
    ):
        if from_date == to_date:
            from_date = datetime.strptime(from_date, "%Y-%m-%d %H:%M:%S")
            from_date -= timedelta(days=1)
            from_date = from_date.strftime("%Y-%m-%d %H:%M:%S")

        chart = Chart(
            symbol,
            resolution,
            from_date,
            to_date,
        )

        obj = Stock.objects.get(symbol=symbol)

        for chart_data in chart.data:
            candle_dict = {
                "symbol": obj,
                "open": chart_data["Candle"]["Open"],
                "high": chart_data["Candle"]["High"],
                "low": chart_data["Candle"]["Low"],
                "close": chart_data["Candle"]["Close"],
                "date": datetime.strptime(
                    chart_data["Date"], "%Y-%m-%d %H:%M:%S"
                ).date(),
            }

            Candle.objects.update_or_create(
                date=datetime.strptime(
                    chart_data["Date"], "%Y-%m-%d %H:%M:%S"
                ).date(),
                defaults=candle_dict,
            )
