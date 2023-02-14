from django.contrib import admin

from .models import Candle, Stock

admin.site.register(Stock)
admin.site.register(Candle)
