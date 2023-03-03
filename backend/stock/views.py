from datetime import date, datetime, timedelta

import yfinance as yf
from django.forms.models import model_to_dict
from django.http import Http404
from rest_framework import generics
from rest_framework.response import Response

from .serializers import Candle, CandleSerializer, Stock, StockSerializer
from .utils.chart import Chart


class StockRetrieveDestroy(generics.RetrieveDestroyAPIView):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    lookup_field = "symbol"
    # permission_classes = [IsAdminUser]

    # def retrieve(self, request, *args, **kwargs):
    #     symbol = self.kwargs.get("symbol")
    #     try:
    #         # TODO: Check if yf contains latest price information
    #         company = yf.Ticker(symbol)
    #     except:
    #         raise Http404
    #     else:
    #         company_info = company.info
    #         stock_dict = {
    #             "symbol": symbol,
    #             "name": company_info["shortName"],
    #             "sector": company_info["sector"],
    #             "website": company_info["website"],
    #             "price": round(
    #                 company.history(period="1d").Close.tolist()[0], 2
    #             ),
    #             "recommendation_key": company_info.info["recommendationKey"],
    #         }

    #         obj, created = Stock.objects.update_or_create(
    #             symbol=symbol, defaults=stock_dict
    #         )

    #         # TODO: add else: to update latest candle information and stock.price information

    #     serializer = self.get_serializer(obj)

    #     return Response(serializer.data)


class StockList(generics.ListAPIView):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    # permission_classes = [IsAdminUser]


class CandleList(generics.RetrieveAPIView):
    serializer_class = CandleSerializer
    # permission_classes = [IsAdminUser]

    def retrieve(self, request, *args, **kwargs):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        # symbol = self.kwargs.get("symbol")
        symbol = self.request.query_params.get("symbol", None)
        from_date = self.request.query_params.get("from", None)
        to_date = self.request.query_params.get("to", None)
        trend = self.request.query_params.get("trend", 0)
        window = self.request.query_params.get("window", 0)

        if not all([symbol, from_date, to_date]):
            raise

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

        serializer = self.get_serializer(queryset, many=True)

        data_list = list(serializer.data)

        data_dict = {"o": [], "h": [], "l": [], "c": [], "v": [], "t": []}

        for data in data_list:
            data_dict["t"].append(
                int(
                    datetime.timestamp(
                        datetime.strptime(data["date"], "%Y-%m-%d")
                    )
                )
            )
            data_dict["o"].append(data["open"])
            data_dict["h"].append(data["high"])
            data_dict["l"].append(data["low"])
            data_dict["c"].append(data["close"])
            data_dict["v"].append(data["volume"])

        chart = Chart(
            symbol,
            "D",
            from_date + " 00:00:00",
            to_date + " 00:00:00",
            data_dict,
        )
        fig = chart.get_chart(bool(int(trend)), int(window))

        return Response(fig.to_dict())

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
            Candle.objects.create(
                symbol=obj,
                open=chart_data["Candle"]["Open"],
                high=chart_data["Candle"]["High"],
                low=chart_data["Candle"]["Low"],
                close=chart_data["Candle"]["Close"],
                volume=chart_data["Candle"]["Volume"],
                date=datetime.strptime(
                    chart_data["Date"], "%Y-%m-%d %H:%M:%S"
                ).date(),
            )

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
                "volume": chart_data["Candle"]["Volume"],
                "date": datetime.strptime(
                    chart_data["Date"], "%Y-%m-%d %H:%M:%S"
                ).date(),
            }

            Candle.objects.update_or_create(
                symbol=obj,
                date=datetime.strptime(
                    chart_data["Date"], "%Y-%m-%d %H:%M:%S"
                ).date(),
                defaults=candle_dict,
            )
