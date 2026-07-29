from rest_framework import viewsets
from .models import (
    Usuario, Area, Ubicacion, TipoActivo, Activo,
    TipoMantenimiento, Mantenimiento, MovimientoActivo
)
from .serializers import (
    UsuarioSerializer, AreaSerializer, UbicacionSerializer, TipoActivoSerializer,
    ActivoSerializer, TipoMantenimientoSerializer, MantenimientoSerializer,
    MovimientoActivoSerializer
)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer


class UbicacionViewSet(viewsets.ModelViewSet):
    queryset = Ubicacion.objects.all()
    serializer_class = UbicacionSerializer


class TipoActivoViewSet(viewsets.ModelViewSet):
    queryset = TipoActivo.objects.all()
    serializer_class = TipoActivoSerializer


class ActivoViewSet(viewsets.ModelViewSet):
    queryset = Activo.objects.all()
    serializer_class = ActivoSerializer


class TipoMantenimientoViewSet(viewsets.ModelViewSet):
    queryset = TipoMantenimiento.objects.all()
    serializer_class = TipoMantenimientoSerializer


class MantenimientoViewSet(viewsets.ModelViewSet):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer


class MovimientoActivoViewSet(viewsets.ModelViewSet):
    queryset = MovimientoActivo.objects.all()
    serializer_class = MovimientoActivoSerializer