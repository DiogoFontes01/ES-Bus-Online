from django.shortcuts import render, get_object_or_404, redirect
import json
from django.conf import settings
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from django.contrib.auth.models import User
from .models import Viagem
import boto3
import os
from .serializers import ViagemSerializer
from django.views.decorators.http import require_http_methods

def index(request):
    return render(request, 'index.html')
        
def home(request):
    return render(request, "home.html")

@csrf_exempt  # Isso desabilita a verificação CSRF para esta view. Use com cuidado.
def validar_bilhete(request):
    if request.method == 'POST':
        
        data = json.loads(request.body)
        ticket_id = data.get('ticket_id')
        viagem_id = data.get('trip_id')
        lugar_id = data.get('seat')
        
        print("ticket_id", ticket_id)
        print("viagem_id", viagem_id)
        print("lugar_id", lugar_id)

        dynamodb = boto3.client('dynamodb', region_name='us-east-1')
        table_name = 'ticket_info'

        new_item = {
            'ticket_id': {'S': str(ticket_id)},
            'trip_id': {'S': str(viagem_id)},
            'seat': {'S': str(lugar_id)},
            'status': {'S': 'Finished'}
        }

        try:
            dynamodb.put_item(TableName=table_name, Item=new_item)
            return JsonResponse({'success': True, 'message': 'Bilhete validado'})
        except Exception as e:
            print(e)
            return JsonResponse({'success': False, 'error': 'Erro ao validar no DynamoDB'})

    return JsonResponse({'success': False, 'error': 'Método inválido'})


def pagamento(request, id_viagem, lugar_id):
    # Aqui, você pode buscar informações adicionais sobre a viagem e o lugar, se necessário
    return render(request, 'pagamento.html', {'id_viagem': id_viagem, 'lugar_id': lugar_id})

@csrf_exempt
def atualizar_lugar(request):
    # Inicialize o cliente do DynamoDB
    dynamodb = boto3.client('dynamodb', region_name='us-east-1')
    table_name = 'ticket_info'

    # Faça uma varredura na tabela para obter todos os ticket_ids
    response = dynamodb.scan(TableName=table_name, ProjectionExpression='ticket_id')

    # Encontre o maior ticket_id
    max_ticket_id = 0
    for item in response.get('Items', []):
        ticket_id = int(item['ticket_id']['S'])
        if ticket_id > max_ticket_id:
            max_ticket_id = ticket_id

    # O próximo ticket_id
    ticket_id = max_ticket_id
    
    if request.method == 'POST':
        data = json.loads(request.body)
        lugar_id = data.get('lugar_id')
        viagem_id = data.get('viagem_id')
        
        # Buscar a viagem e atualizar o lugar
        viagem = get_object_or_404(Viagem, id=viagem_id)
        lugares = viagem.lugares_de_autocarros

        if lugares[int(lugar_id)-1]:  # Subtraindo 1 porque a lista começa em 0
            # Marcar como ocupado
            lugares[int(lugar_id)-1] = False
            viagem.save()

            # Inicializa o cliente do DynamoDB
            dynamodb = boto3.client('dynamodb', region_name='us-east-1')
            table_name = 'ticket_info'

            # Novo item para inserir
            new_item = {
                'ticket_id': {'S': str(ticket_id)},
                'trip_id': {'S': str(viagem_id)},
                'seat': {'S': str(lugar_id)},
                'status': {'S': 'Payed'}
            }

            try:
                # Inserir o item na tabela DynamoDB
                dynamodb.put_item(TableName=table_name, Item=new_item)
                return JsonResponse({'success': True, 'message': 'Pagamento completo e lugar atualizado'})
            except Exception as e:
                print(e)
                return JsonResponse({'success': False, 'error': 'Erro ao atualizar no DynamoDB'})

        else:
            return JsonResponse({'success': False, 'error': 'Lugar já está ocupado'})

    return JsonResponse({'success': False, 'error': 'Método inválido'})


def detalhes_viagem(request, viagem_id):
    print("Viagem seleciona com id", viagem_id)
    viagem = get_object_or_404(Viagem, pk=viagem_id)
    data = {
        'origem': viagem.origem,
        'destino': viagem.destino,
        'data': viagem.data,
        'hora': viagem.hora,
        'valor': viagem.valor,
        'lugares_de_autocarros': viagem.lugares_de_autocarros,
    }
    
    print("esta e a data", data)
    
    return JsonResponse(data)

@csrf_exempt
@require_http_methods(["POST"])
def comprar_bilhete(request, viagem_id):
    
    data = json.loads(request.body)
    selectedLugar = data.get('selectedLugar')
    # Inicialize o cliente do DynamoDB
    dynamodb = boto3.client('dynamodb', region_name='us-east-1')
    table_name = 'ticket_info'

    # Faça uma varredura na tabela para obter todos os ticket_ids
    response = dynamodb.scan(TableName=table_name, ProjectionExpression='ticket_id')

    # Encontre o maior ticket_id
    max_ticket_id = 0
    for item in response.get('Items', []):
        ticket_id = int(item['ticket_id']['S'])
        if ticket_id > max_ticket_id:
            max_ticket_id = ticket_id

    # O próximo ticket_id
    ticket_id = max_ticket_id + 1

    if request.method == 'POST':
        
        ticket_id += 1

        # Código para iniciar a state machine
        client = boto3.client('stepfunctions', region_name='us-east-1')
        state_machine_arn = 'arn:aws:states:us-east-1:657703406745:stateMachine:ProjectSTM'

        input_data = {
            "ticket_id": str(ticket_id),
            "trip_id": str(viagem_id),
            "seat": selectedLugar,
            "status": "Waiting",
            "counter": 0
        }

        input_str = json.dumps(input_data)
        
        print(input_str)

        client.start_execution(
            stateMachineArn=state_machine_arn,
            input=input_str
        )
        
        # Após a execução da state machine ou a lógica desejada
        selectedLugar = request.POST.get('selectedLugar')

    return JsonResponse({'status': 'success'})

@api_view(['GET', 'POST'])
def login(request):
    if request.method == 'GET':
        return render(request, 'login.html')

    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    print("debug")

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'redirect_url': '/menu'  # URL para redirecionar após o login bem-sucedido
        })
    else:
        return Response({"error": "Usuário ou senha inválidos"}, status=400)

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Nome de usuário e senha são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Nome de usuário já está em uso."}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password)
    user.save()
    return Response({"success": "Usuário criado com sucesso."}, status=status.HTTP_201_CREATED)

def get_tickets(request):
    # Configurações do DynamoDB
    region_name = 'us-east-1'
    table_name = 'ticket_info'
    dynamodb = boto3.client('dynamodb', region_name=region_name)

    try:
        # Fazer a varredura (scan) na tabela
        response = dynamodb.scan(TableName=table_name)
        items = response.get('Items', [])
        
        tickets = []
        for item in items:
            ticket = {k: v.get('S', v.get('N', '')) for k, v in item.items()}
            try:
                
                trip_id = int(ticket.get('trip_id'))
                viagem = Viagem.objects.get(id=trip_id)
                print(viagem.id)
                ticket['viagem'] = {
                    'origem': viagem.origem,
                    'destino': viagem.destino,
                    'data': viagem.data,
                    'hora': viagem.hora,
                    'valor': viagem.valor,
                    'id': viagem.id,
                }
            except Viagem.DoesNotExist:
                ticket['viagem'] = None
            tickets.append(ticket)
            
            print(tickets)

        return JsonResponse({'tickets': tickets})
    except boto3.exceptions.Boto3Error as e:
        # Tratar erro
        return JsonResponse({'tickets': tickets})

@api_view(['GET'])
def menu(request):
    origem = request.GET.get('origem', '')
    destino = request.GET.get('destino', '')
    dia = request.GET.get('dia', '')
    mes = request.GET.get('mes', '')
    ano = request.GET.get('ano', '')

    # Inicializa um dicionário para os filtros
    filtros = {'origem': origem, 'destino': destino}

    # Adiciona cada parte da data ao filtro, se presente
    if dia:
        filtros['data__day'] = int(dia)
    if mes:
        filtros['data__month'] = int(mes)
    if ano:
        filtros['data__year'] = int(ano)

    # Filtra as viagens com os filtros definidos
    viagens = Viagem.objects.filter(**filtros)
    print(origem, destino, dia, mes, ano)
    serializer = ViagemSerializer(viagens, many=True)
    return Response(serializer.data)
