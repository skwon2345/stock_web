from django.db import models


class Stock(models.Model):
    symbol = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=30)
    sector = models.CharField(max_length=30)
    website = models.URLField(max_length=100)
    price = models.FloatField()
    recommendation_key = models.CharField(max_length=30, null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.symbol})"


class Candle(models.Model):
    symbol = models.ForeignKey(Stock, on_delete=models.CASCADE)

    open = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()

    date = models.DateField()

    def __str__(self):
        return f"{str(self.date)} {str(self.symbol)}"
