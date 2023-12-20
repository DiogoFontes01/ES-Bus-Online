from django.db import models 

class MyModel(models.Model):
    my_field = models.JSONField()


# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    
class Viagem(models.Model):
    id = models.AutoField(primary_key=True)
    origem = models.CharField(max_length=100)
    destino = models.CharField(max_length=100)
    data = models.DateField()
    hora = models.TimeField()
    valor = models.FloatField()
    lugares_de_autocarros = models.JSONField(
        default=list,
    )
    limite_lugares = models.PositiveIntegerField(default=10)  # Defina o valor padrão desejado
    

# from pages.models import Viagem

# Viagem.objects.all().delete()

# from datetime import datetime, timedelta
# import random


# origem = "Coimbra"
# destino = "Porto"
# data = datetime.now() + timedelta(days=random.randint(1, 365))
# hora = datetime.now().time()
# valor = round(random.uniform(10, 100), 2)
# lugares_autocarros = [True] * 10  

# Viagem.objects.create(origem=origem, destino=destino, data=data, hora=hora, valor=valor, lugares_de_autocarros=lugares_autocarros)