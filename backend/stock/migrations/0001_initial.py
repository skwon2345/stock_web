# Generated by Django 4.1.6 on 2023-02-14 21:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Stock",
            fields=[
                (
                    "symbol",
                    models.CharField(max_length=10, primary_key=True, serialize=False),
                ),
                ("name", models.CharField(max_length=30)),
                ("sector", models.CharField(max_length=30)),
                ("website", models.URLField(max_length=100)),
                ("price", models.FloatField()),
                (
                    "recommendation_key",
                    models.CharField(blank=True, max_length=30, null=True),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Candle",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("open", models.FloatField()),
                ("high", models.FloatField()),
                ("low", models.FloatField()),
                ("close", models.FloatField()),
                ("date", models.DateField()),
                (
                    "symbol",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="stock.stock"
                    ),
                ),
            ],
        ),
    ]
