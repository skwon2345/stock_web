# Generated by Django 4.1.6 on 2023-02-16 09:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("stock", "0003_candle_volume"),
    ]

    operations = [
        migrations.AlterField(
            model_name="candle",
            name="volume",
            field=models.IntegerField(default=0),
        ),
    ]
