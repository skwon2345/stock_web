from django.contrib import admin

from .models import Company, PriceHistory, Stock

admin.site.register(Company)
admin.site.register(Stock)
admin.site.register(PriceHistory)
