from rest_framework import serializers
from .models import Viagem

class ViagemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Viagem
        fields = ['id', 'origem', 'destino', 'data', 'hora', 'valor', 'lugares_de_autocarros', 'limite_lugares']
