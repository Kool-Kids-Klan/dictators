# Generated by Django 3.1.8 on 2021-07-17 19:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dictators_game', '0003_auto_20210716_1918'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email_address',
            field=models.EmailField(max_length=254, unique=True),
        ),
    ]
