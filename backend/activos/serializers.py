from rest_framework import serializers
from .models import (
    Usuario, Area, Ubicacion, TipoActivo, Activo,
    TipoMantenimiento, Mantenimiento, MovimientoActivo
)


ACTIVO_ESTADO_TO_DB = {
    'activo': 'Activo',
    'mantenimiento': 'En mantenimiento',
    'en mantenimiento': 'En mantenimiento',
    'baja': 'Dado de baja',
    'dado de baja': 'Dado de baja',
}

ACTIVO_ESTADO_FROM_DB = {
    'activo': 'activo',
    'en mantenimiento': 'mantenimiento',
    'dado de baja': 'baja',
}


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id_usuario', 'nombre', 'correo', 'telefono', 'rol', 'contraseña']
        extra_kwargs = {
            'contraseña': {
                'write_only': True,
                'required': False,
                'allow_blank': True,
            }
        }

    def create(self, validated_data):
        if 'contraseña' not in validated_data:
            validated_data['contraseña'] = ''
        return super().create(validated_data)


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
    fecha_adquisicion = serializers.DateField(required=False)
    valor_adquisicion = serializers.DecimalField(max_digits=18, decimal_places=2, required=False)

    class Meta:
        model = Activo
        fields = [
            'id_activo', 'nombre', 'descripcion', 'codigo',
            'fecha_adquisicion', 'valor_adquisicion', 'estado',
            'tipo_activo', 'tipo_activo_id', 'ubicacion', 'ubicacion_id'
        ]

    def validate_estado(self, value):
        normalized_value = value.strip().lower()
        db_value = ACTIVO_ESTADO_TO_DB.get(normalized_value)

        if db_value is None:
            raise serializers.ValidationError(
                'Estado invalido. Use activo, mantenimiento o baja.'
            )

        return db_value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        normalized_value = str(instance.estado).strip().lower()
        data['estado'] = ACTIVO_ESTADO_FROM_DB.get(normalized_value, normalized_value)
        return data


class TipoMantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoMantenimiento
        fields = ['id_tipo_mantenimiento', 'nombre', 'descripcion', 'periodicidad', 'estado']


class MantenimientoSerializer(serializers.ModelSerializer):
    estado = serializers.CharField(required=False, allow_blank=True, write_only=True)
    activo = ActivoSerializer(read_only=True)
    usuario = UsuarioSerializer(read_only=True)
    tipo_mantenimiento = TipoMantenimientoSerializer(read_only=True)
    activo_id = serializers.PrimaryKeyRelatedField(
        queryset=Activo.objects.all(),
        source='activo',
        write_only=True,
    )
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        source='usuario',
        write_only=True,
    )
    tipo_mantenimiento_id = serializers.PrimaryKeyRelatedField(
        queryset=TipoMantenimiento.objects.all(),
        source='tipo_mantenimiento',
        write_only=True,
    )
    costo = serializers.DecimalField(max_digits=18, decimal_places=2, required=False)

    class Meta:
        model = Mantenimiento
        fields = [
            'id_mantenimiento', 'fecha', 'descripcion', 'estado', 'costo',
            'activo', 'usuario', 'tipo_mantenimiento',
            'activo_id', 'usuario_id', 'tipo_mantenimiento_id'
        ]

    def create(self, validated_data):
        # Frontend still sends estado, but SQL table does not have that column.
        validated_data.pop('estado', None)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop('estado', None)
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Keep frontend contract stable.
        data['estado'] = 'completado' if (instance.costo or 0) > 0 else 'pendiente'
        return data


class MovimientoActivoSerializer(serializers.ModelSerializer):
    activo = ActivoSerializer(read_only=True)
    usuario = UsuarioSerializer(read_only=True)
    ubicacion_origen = UbicacionSerializer(read_only=True)
    ubicacion_destino = UbicacionSerializer(read_only=True)
    activo_id = serializers.PrimaryKeyRelatedField(
        queryset=Activo.objects.all(),
        source='activo',
        write_only=True,
    )
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        source='usuario',
        write_only=True,
    )
    ubicacion_origen_id = serializers.PrimaryKeyRelatedField(
        queryset=Ubicacion.objects.all(),
        source='ubicacion_origen',
        write_only=True,
    )
    ubicacion_destino_id = serializers.PrimaryKeyRelatedField(
        queryset=Ubicacion.objects.all(),
        source='ubicacion_destino',
        write_only=True,
    )

    class Meta:
        model = MovimientoActivo
        fields = [
            'id_movimiento', 'fecha', 'descripcion', 'tipo_de_movimiento',
            'activo', 'usuario', 'ubicacion_origen', 'ubicacion_destino',
            'activo_id', 'usuario_id', 'ubicacion_origen_id', 'ubicacion_destino_id'
        ]