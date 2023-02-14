from datetime import date, datetime

import yfinance as yf
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
                chart = Chart(
                    symbol,
                    "D",
                    "1900-01-01 00:00:00",
                    date.today().strftime("%Y-%m-%d %H:%M:%S"),
                )
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
                    price=chart.data[-1]["Candle"]["Close"],
                    recommendation_key=company_info.info["recommendationKey"],
                )
                # TODO: search for safe save() way - Validation?
                stock.save()

                obj = Stock.objects.get(symbol=symbol)

                chart.set_trend(window=20)

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
                        trend=chart_data["trend"],
                    )
                    candle.save()
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

        queryset = (
            Candle.objects.filter(symbol=symbol)
            .filter(date__gte=from_date)
            .filter(date__lte=to_date)
        )

        serializer = CandleSerializer(queryset, many=True)
        return Response(serializer.data)
