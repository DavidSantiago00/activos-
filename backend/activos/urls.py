from rest_framework import permissions
from rest_framework.routers import DefaultRouter, APIRootView
from django.urls import path
from .views import (
    UsuarioViewSet, AreaViewSet, UbicacionViewSet, TipoActivoViewSet,
    ActivoViewSet, TipoMantenimientoViewSet, MantenimientoViewSet,
    MovimientoActivoViewSet
)
from .auth import LoginView, RefreshTokenView, RegisterView

class PublicAPIRootView(APIRootView):
    permission_classes = [permissions.AllowAny]


class PublicDefaultRouter(DefaultRouter):
    APIRootView = PublicAPIRootView


router = PublicDefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'areas', AreaViewSet)
router.register(r'ubicaciones', UbicacionViewSet)
router.register(r'tipos-activos', TipoActivoViewSet)
router.register(r'activos', ActivoViewSet)
router.register(r'tipos-mantenimiento', TipoMantenimientoViewSet)
router.register(r'mantenimientos', MantenimientoViewSet)
router.register(r'movimientos', MovimientoActivoViewSet)

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/refresh/', RefreshTokenView.as_view(), name='refresh'),
] + router.urls