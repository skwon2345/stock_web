from django.contrib import admin
from django.urls import include, path

from . import views

urlpatterns = [
    path("stock/", views.StockListCreate.as_view(), name="stock-lc"),
    path(
        "stock/<str:symbol>",
        views.StockRetrieveUpdateDestroy.as_view(),
        name="stock-rud",
    ),
    path("candle/", views.CandleListCreate.as_view(), name="candle-lc"),
]
