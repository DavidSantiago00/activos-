from rest_framework import serializers
from .models import (
    Usuario, Area, Ubicacion, TipoActivo, Activo,
    TipoMantenimiento, Mantenimiento, MovimientoActivo
)


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id_usuario', 'nombre', 'correo', 'telefono', 'rol']
        extra_kwargs = {'contraseña': {'write_only': True}}


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ['id_area', 'nombre']


class UbicacionSerializer(serializers.ModelSerializer):
    area = AreaSerializer(read_only=True)
    area_id = serializers.PrimaryKeyRelatedField(
        queryset=Area.objects.all(), 
        source='area', 
        write_only=True
    )

    class Meta:
        model = Ubicacion
        fields = ['id_ubicacion', 'nombre', 'direccion', 'area', 'area_id']


class TipoActivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoActivo
        fields = ['id_tipo', 'nombre', 'vida_util']


class ActivoSerializer(serializers.ModelSerializer):
    tipo_activo = TipoActivoSerializer(read_only=True)
    ubicacion = UbicacionSerializer(read_only=True)
    tipo_activo_id = serializers.PrimaryKeyRelatedField(
        queryset=TipoActivo.objects.all(), 
        source='tipo_activo', 
        write_only=True
    )
    ubicacion_id = serializers.PrimaryKeyRelatedField(
        queryset=Ubicacion.objects.all(), 
        source='ubicacion', 
        write_only=True
    )

    class Meta:
        model = Activo
        fields = [
            'id_activo', 'nombre', 'descripcion', 'codigo', 'estado',
            'tipo_activo', 'tipo_activo_id', 'ubicacion', 'ubicacion_id'
        ]


class TipoMantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoMantenimiento
        fields = ['id_tipo_mantenimiento', 'nombre', 'descripcion', 'periodicidad', 'estado']


class MantenimientoSerializer(serializers.ModelSerializer):
    activo = ActivoSerializer(read_only=True)
    usuario = UsuarioSerializer(read_only=True)
    tipo_mantenimiento = TipoMantenimientoSerializer(read_only=True)

    class Meta:
        model = Mantenimiento
        fields = [
            'id_mantenimiento', 'fecha', 'descripcion', 'estado',
            'activo', 'usuario', 'tipo_mantenimiento',
            'activo_id', 'usuario_id', 'tipo_mantenimiento_id'
        ]


class MovimientoActivoSerializer(serializers.ModelSerializer):
    activo = ActivoSerializer(read_only=True)
    usuario = UsuarioSerializer(read_only=True)
    ubicacion_origen = UbicacionSerializer(read_only=True)
    ubicacion_destino = UbicacionSerializer(read_only=True)

    class Meta:
        model = MovimientoActivo
        fields = [
            'id_movimiento', 'fecha', 'descripcion', 'tipo_de_movimiento',
            'activo', 'usuario', 'ubicacion_origen', 'ubicacion_destino',
            'activo_id', 'usuario_id', 'ubicacion_origen_id', 'ubicacion_destino_id'
        ]