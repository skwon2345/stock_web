from django.contrib import admin
from django.urls import include, path

from . import views

urlpatterns = [
    path("stock/", views.StockList.as_view(), name="stock-l"),
    path(
        "stock/<str:symbol>",
        views.StockRetrieveUpdateDestroy.as_view(),
        name="stock-rud",
    ),
    path("candle/", views.CandleList.as_view(), name="candle-l"),
]
