from django.db import models


class Company(models.Model):
    name = models.CharField(max_length=30, primary_key=True)
    sector = models.CharField(max_length=30)
    website = models.URLField(max_length=100)


class Stock(models.Model):
    symbol = models.CharField(max_length=10, primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    price = models.FloatField()
    recommendation_key = models.CharField(max_length=30, null=True)


class PriceHistory(models.Model):
    symbol = models.CharField(max_length=10, primary_key=True)
    candle = models.JSONField()
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
