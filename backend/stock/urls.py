from django.contrib import admin
from django.urls import include, path

from . import views

urlpatterns = [
    path("stock/", views.StockListCreate.as_view()),
    path("stock/<str:symbol>", views.StockRetrieveUpdateDestroy.as_view()),
    path("candle/", views.CandleListCreate.as_view()),
]
