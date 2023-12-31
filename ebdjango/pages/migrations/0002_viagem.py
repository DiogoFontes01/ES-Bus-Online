# Generated by Django 4.2.6 on 2023-11-30 17:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Viagem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('origem', models.CharField(max_length=100)),
                ('destino', models.CharField(max_length=100)),
                ('data', models.DateField()),
                ('hora', models.TimeField()),
                ('valor', models.FloatField()),
                ('lugares_disponiveis', models.JSONField(blank=True, null=True)),
                ('pessoas_na_viagem', models.JSONField(blank=True, null=True)),
            ],
        ),
    ]
