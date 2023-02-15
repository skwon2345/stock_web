from django.contrib import admin
from django.urls import include, path

from . import views

urlpatterns = [
    path("stock/", views.StockList.as_view(), name="stock-l"),
    path(
        "stock/<str:symbol>",
        views.StockRetrieveDestroy.as_view(),
        name="stock-rd",
    ),
    path("candle/", views.CandleList.as_view(), name="candle-l"),
]
