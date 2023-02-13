from django.contrib import admin
from django.urls import include, path

from . import views

urlpatterns = [
    path("company/", views.CompanyList.as_view()),
    path("stock/", views.StockList.as_view()),
    # path("price_history/", views.CompanyList.as_view()),
]
