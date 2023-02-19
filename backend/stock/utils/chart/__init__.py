from datetime import datetime
from time import gmtime, mktime

import finnhub
from django.conf import settings


class Chart:
    def __init__(self, symbol, resolution, start_date, end_date):
        # TODO: Try one stock library: yfinance or finnhub?
        self.f = finnhub.Client(api_key=settings.FINNHUB_API_KEY)

        self.symbol = symbol
        self.resolution = resolution

        self.start_date = start_date
        self.end_date = end_date

        self.start_timestamp = self._to_timestamp(self.start_date)
        self.end_timestamp = self._to_timestamp(self.end_date)

        self.uptrend = []
        self.downtrend = []

        self.vertices = []

        self.data = self._process(self.symbol)

        self.f.indices_const()

    def _to_timestamp(self, date: str) -> int:
        return int(
            datetime.timestamp(datetime.strptime(date, "%Y-%m-%d %H:%M:%S"))
        )

    def _format(self, dx):
        cnt = 0
        arr_calc = []
        arr_candle = []
        dataxxx = []
        for i in range(len(dx["c"])):
            arr_calc.append({})
            arr_candle.append(
                {
                    "Open": float(dx.get("o", 0.0)[i]),
                    "High": float(dx.get("h", 0.0)[i]),
                    "Low": float(dx.get("l", 0.0)[i]),
                    "Close": float(dx.get("c", 0.0)[i]),
                    "Volume": float(dx.get("v", 0.0)[i]),
                }
            )
            my_data = {
                "Date": datetime.fromtimestamp(
                    mktime(gmtime(dx.get("t")[i]))
                ).strftime("%Y-%m-%d %H:%M:%S"),
                "Time": dx.get("t")[i],
                "Candle": arr_candle[cnt],
                "i": cnt,
                "calculations": arr_calc[cnt],
            }
            if dx.get("rsi") != None:
                my_data["calculations"]["RSI"] = dx.get("rsi")[i]
            dataxxx.append(my_data)
            cnt = cnt + 1

        return dataxxx

    def _arrange_high_low_list(self, high_list: list, low_list: list) -> list:
        high_i = 0
        low_i = 0
        ret = []
        trend = ""

        while high_i < len(high_list) and low_i < len(low_list):
            cur_high = high_list[high_i]
            cur_low = low_list[low_i]
            if cur_high[0] < cur_low[0]:
                if trend == "":
                    ret.append(cur_high)
                else:
                    if trend == "downtrend":
                        if ret[-1][1] < cur_high[1]:
                            ret[-1] = cur_high
                    else:
                        ret.append(cur_high)
                trend = "downtrend"
                high_i += 1

            elif cur_low[0] < cur_high[0]:
                if trend == "":
                    ret.append(cur_low)
                else:
                    if trend == "uptrend":
                        if ret[-1][1] > cur_low[1]:
                            ret[-1] = cur_low
                    else:
                        ret.append(cur_low)
                trend = "uptrend"
                low_i += 1

            else:
                if trend == "uptrend":
                    if ret[-1][1] > cur_low[1]:
                        ret[-1] = cur_low
                    else:
                        ret.append(cur_high)
                        trend = "downtrend"
                else:
                    if ret[-1][1] < cur_high[1]:
                        ret[-1] = cur_high
                    else:
                        ret.append(cur_low)
                        trend = "uptrend"
                high_i += 1
                low_i += 1

        last_element = -1.0
        if high_i < len(high_list):
            last_element = max(high_list[high_i:], key=lambda x: x[1])
            ret.append(last_element)
        elif low_i < len(low_list):
            last_element = max(low_list[low_i:], key=lambda x: x[1])
            ret.append(last_element)

        return ret

    def _get_trend_list(self, data: list, window: int) -> dict:
        i = 0

        high_list = []
        low_list = []

        while i < len(data):
            if i < window - 1:
                i += 1
                continue
            di = data[i]
            high_point = (di["Date"], di["Candle"]["High"])
            low_point = (di["Date"], di["Candle"]["Low"])

            for j in range(i, i - window, -1):
                dj = data[j]
                if dj["Candle"]["High"] > high_point[1]:
                    high_point = (dj["Date"], dj["Candle"]["High"])
                if dj["Candle"]["Low"] < low_point[1]:
                    low_point = (dj["Date"], dj["Candle"]["Low"])

            if len(high_list) > 0:
                if high_list[-1][1] != high_point[1]:
                    high_list.append(high_point)
            else:
                high_list.append(high_point)

            if len(low_list) > 0:
                if low_list[-1][1] != low_point[1]:
                    low_list.append(low_point)
            else:
                low_list.append(low_point)

            i += window - 1

        trend_list = self._arrange_high_low_list(high_list, low_list)

        return trend_list

    def _set_trend_list(self, trend_list: list) -> None:
        uptrend = []
        downtrend = []

        for i in range(len(trend_list) - 1):
            if trend_list[i][1] > trend_list[i + 1][1]:
                downtrend.append(dict([trend_list[i], trend_list[i + 1]]))
                if i == 0:
                    self.vertices.append(
                        (trend_list[i][0], trend_list[i][1], "uptrend")
                    )
                self.vertices.append(
                    (trend_list[i + 1][0], trend_list[i + 1][1], "downtrend")
                )
            else:
                uptrend.append(dict([trend_list[i], trend_list[i + 1]]))
                uptrend.append(dict([trend_list[i], trend_list[i + 1]]))
                if i == 0:
                    self.vertices.append(
                        (trend_list[i][0], trend_list[i][1], "downtrend")
                    )
                self.vertices.append(
                    (trend_list[i + 1][0], trend_list[i + 1][1], "uptrend")
                )

        self.uptrend = uptrend
        self.downtrend = downtrend

    def set_trend(self, window: int) -> None:
        trend_list = self._get_trend_list(self.data, window)
        self._set_trend_list(trend_list)

        for d in self.data:
            if d.get("trend"):
                del d["trend"]
            for up in self.uptrend:
                uptrend_date_list = list(up.keys())
                if (
                    d["Date"] > uptrend_date_list[0]
                    and d["Date"] <= uptrend_date_list[1]
                ):
                    d["trend"] = "uptrend"
                    break

            if d.get("trend") is None:
                for down in self.downtrend:
                    downtrend_date_list = list(down.keys())
                    if (
                        d["Date"] > downtrend_date_list[0]
                        and d["Date"] <= downtrend_date_list[1]
                    ):
                        d["trend"] = "downtrend"
                        break

            if d.get("trend") is None:
                d["trend"] = "undefined"

    def _calc_fib_retr(self, minimum_diff_ratio: float) -> list:
        def getFibRET(start, end):
            start_price = start[1]
            end_price = end[1]

            diff = start_price - end_price
            return {
                "start": start,
                "end": end,
                "fib": {
                    "-1.618": end_price + (diff * -1.618),
                    "-1.382": end_price + (diff * -1.382),
                    "-1.236": end_price + (diff * -1.236),
                    "-0.886": end_price + (diff * -0.886),
                    "-0.786": end_price + (diff * -0.786),
                    "-0.618": end_price + (diff * -0.618),
                    "-0.5": end_price + (diff * -0.5),
                    "-0.382": end_price + (diff * -0.382),
                    "-0.236": end_price + (diff * -0.236),
                    "0.236": end_price + (diff * 0.236),
                    "0.382": end_price + (diff * 0.382),
                    "0.5": end_price + (diff * 0.5),
                    "0.618": end_price + (diff * 0.618),
                    "0.786": end_price + (diff * 0.786),
                    "0.886": end_price + (diff * 0.886),
                    "1.236": end_price + (diff * 1.236),
                    "1.382": end_price + (diff * 1.382),
                    "1.618": end_price + (diff * 1.618),
                },
            }

        ret = []
        for i in range(len(self.vertices)):
            for j in range(len(self.vertices)):
                if j <= i:
                    continue
                vertex_one = self.vertices[i]
                vertex_two = self.vertices[j]

                if (
                    vertex_one[2] != vertex_two[2]
                    and (
                        abs(vertex_one[1] - vertex_two[1])
                        / max([vertex_one[1], vertex_two[1]])
                    )
                    > minimum_diff_ratio
                ):
                    if (
                        vertex_one[2] == "uptrend"
                        and (vertex_one[1] > vertex_two[1])
                    ) or (
                        vertex_one[2] == "downtrend"
                        and (vertex_one[1] < vertex_two[1])
                    ):
                        ret.append(getFibRET(vertex_one, vertex_two))

        return ret

    def _count_overlapping(
        self, fib_list: list, overlap_ratio: float, show_overlap_only: bool
    ):
        def is_overlapped(p1: float, p2: float) -> bool:
            return (abs(p1 - p2) / max([p1, p2])) < overlap_ratio

        for fib_dict in fib_list:
            fib = fib_dict["fib"]
            count = 0
            new_fib = {}
            for vertex in self.vertices:
                for k, v in fib.items():
                    if is_overlapped(v, vertex[1]):
                        new_fib[k] = v
                        count += 1

            fib_dict["overlap_cnt"] = count
            if show_overlap_only:
                fib_dict["fib"] = new_fib

    def _get_most_overlapped_fib_ret(self, fib_list: list) -> dict:
        self._count_overlapping(
            fib_list=fib_list, overlap_ratio=0.003, show_overlap_only=True
        )

        return max(fib_list, key=lambda x: x["overlap_cnt"])

    def _process(self, symbol: str) -> list:
        # TODO: Check <= 14 or < 14
        if (self.end_timestamp - self.start_timestamp) / 86400 <= 14:
            data = self.f.stock_candles(
                symbol=symbol,
                resolution=self.resolution,
                _from=self.start_timestamp,
                to=self.end_timestamp,
            )
        else:
            data = self.f.technical_indicator(
                symbol=symbol,
                resolution=self.resolution,
                _from=self.start_timestamp,
                to=self.end_timestamp,
                indicator="rsi",
                indicator_fields={"timeperiod": 14},
            )

        data = self._format(data)

        return data
