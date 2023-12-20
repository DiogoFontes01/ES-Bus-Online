"""
URL configuration for ebdjango project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from pages import views
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('api/login', views.login, name='login'),
    path('', views.index, name='index'),  
    path('register/', views.register, name='register'),
    path('api/menu', views.menu, name='menu'),
    path('api/viagem/<int:viagem_id>', views.detalhes_viagem, name='detalhes_viagem'),
    path('pagamento/<str:id_viagem>/<str:lugar_id>/', views.pagamento, name='pagamento'),
    path('atualizar_lugar/', views.atualizar_lugar, name='atualizar_lugar'),
    path('api/tickets/', views.get_tickets, name='get_tickets'),
    path('api/comprar_bilhete/<int:viagem_id>', views.comprar_bilhete, name='comprar_bilhete'),
    path('api/validar_bilhete/', views.validar_bilhete, name='validar_bilhete'),

]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
