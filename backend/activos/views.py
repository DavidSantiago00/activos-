from datetime import date

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
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

    @staticmethod
    def _current_usuario(request):
        if not request.user or not request.user.is_authenticated:
            return None
        correo = (request.user.email or request.user.username or '').strip().lower()
        if not correo:
            return None
        return Usuario.objects.filter(correo__iexact=correo).first()

    @staticmethod
    def _canonical_rol(request, usuario):
        if request.user and (request.user.is_staff or request.user.is_superuser):
            return 'administrador'
        rol = (getattr(usuario, 'rol', '') or '').strip().lower()
        if rol in ['admin', 'administrador']:
            return 'administrador'
        if rol in ['tecnico', 'técnico', 'usuario', 'user']:
            return 'tecnico'
        return rol

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        old_estado = instance.estado.strip().lower()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        new_estado = serializer.validated_data.get('estado', instance.estado).strip().lower()
        response = super().update(request, *args, **kwargs)

        descripcion = request.data.get('descripcion') or 'Asignado automáticamente por cambio de estado'
        fecha = request.data.get('fecha', None) or getattr(instance, 'fecha_adquisicion', None)

        # Si cambia a mantenimiento, crear registro y asignar técnico
        if old_estado != new_estado and new_estado in ['en mantenimiento', 'mantenimiento']:
            tecnico = Usuario.objects.filter(rol__iexact='tecnico').first()
            if tecnico:
                Mantenimiento.objects.create(
                    activo=instance,
                    usuario=tecnico,
                    descripcion=descripcion,
                    fecha=fecha,
                    costo=0,
                    tipo_mantenimiento=TipoMantenimiento.objects.first()
                )

        # Si cambia a baja, también crear registro de mantenimiento (baja)
        if old_estado != new_estado and new_estado in ['dado de baja', 'baja']:
            tecnico = Usuario.objects.filter(rol__iexact='tecnico').first()
            if tecnico:
                Mantenimiento.objects.create(
                    activo=instance,
                    usuario=tecnico,
                    descripcion=descripcion,
                    fecha=fecha,
                    costo=0,
                    tipo_mantenimiento=TipoMantenimiento.objects.first()
                )
        return response

    @action(detail=True, methods=['post'], url_path='resolver-estado')
    def resolver_estado(self, request, pk=None):
        activo = self.get_object()
        usuario_actual = self._current_usuario(request)
        rol_actual = self._canonical_rol(request, usuario_actual)

        if rol_actual != 'tecnico':
            return Response(
                {'error': 'Solo el tecnico puede cerrar un activo en mantenimiento'},
                status=status.HTTP_403_FORBIDDEN,
            )

        estado_actual = (activo.estado or '').strip().lower()
        if estado_actual not in ['en mantenimiento', 'mantenimiento']:
            return Response(
                {'error': 'El activo no esta en mantenimiento'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        resultado = (request.data.get('resultado') or '').strip().lower()
        comentario = (request.data.get('comentario') or '').strip()

        if resultado in ['arreglado', 'reparado', 'activo']:
            nuevo_estado = 'Activo'
            resultado_normalizado = 'arreglado'
            mensaje_resultado = 'fue arreglado por el tecnico'
        elif resultado in ['baja', 'dar de baja', 'sin arreglo', 'no reparable']:
            nuevo_estado = 'Dado de baja'
            resultado_normalizado = 'baja'
            mensaje_resultado = 'debe darse de baja por no tener arreglo'
        else:
            return Response(
                {'error': 'Resultado invalido. Use arreglado o baja'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        activo.estado = nuevo_estado
        activo.save(update_fields=['estado'])

        tecnico_nombre = getattr(usuario_actual, 'nombre', '') or request.user.get_username()
        notif_marker = (
            f"[NOTIF_ADMIN] activo_id={activo.id_activo};"
            f"resultado={resultado_normalizado};"
            f"tecnico={tecnico_nombre};"
            f"fecha={date.today().isoformat()}"
        )
        notif_mensaje = f"Activo {activo.codigo} - {activo.nombre} {mensaje_resultado}."
        cierre_linea = f"[CIERRE_TECNICO] Resultado: {resultado_normalizado}."
        if comentario:
            cierre_linea = f"{cierre_linea} Comentario: {comentario}"

        mantenimiento = Mantenimiento.objects.filter(activo=activo).order_by('-id_mantenimiento').first()
        if mantenimiento:
            descripcion_actual = (mantenimiento.descripcion or '').strip()
            partes = [p for p in [descripcion_actual, cierre_linea, notif_marker, notif_mensaje] if p]
            mantenimiento.descripcion = "\n".join(partes)
            mantenimiento.save(update_fields=['descripcion'])
        else:
            tipo = TipoMantenimiento.objects.first()
            if not tipo:
                return Response(
                    {'error': 'No hay tipos de mantenimiento configurados'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            tecnico = usuario_actual or Usuario.objects.filter(rol__iexact='tecnico').first()
            if not tecnico:
                return Response(
                    {'error': 'No se encontro tecnico para registrar cierre'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            Mantenimiento.objects.create(
                activo=activo,
                usuario=tecnico,
                descripcion="\n".join([cierre_linea, notif_marker, notif_mensaje]),
                fecha=date.today(),
                costo=0,
                tipo_mantenimiento=tipo,
            )

        return Response(
            {
                'message': 'Estado actualizado y notificacion enviada a administradores',
                'resultado': resultado_normalizado,
                'activo': {
                    'id_activo': activo.id_activo,
                    'codigo': activo.codigo,
                    'nombre': activo.nombre,
                    'estado': activo.estado,
                },
            },
            status=status.HTTP_200_OK,
        )


class TipoMantenimientoViewSet(viewsets.ModelViewSet):
    queryset = TipoMantenimiento.objects.all()
    serializer_class = TipoMantenimientoSerializer


class MantenimientoViewSet(viewsets.ModelViewSet):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer

    @staticmethod
    def _current_usuario(request):
        if not request.user or not request.user.is_authenticated:
            return None
        correo = (request.user.email or request.user.username or '').strip().lower()
        if not correo:
            return None
        return Usuario.objects.filter(correo__iexact=correo).first()

    @staticmethod
    def _canonical_rol(request, usuario):
        if request.user and (request.user.is_staff or request.user.is_superuser):
            return 'administrador'
        rol = (getattr(usuario, 'rol', '') or '').strip().lower()
        if rol in ['admin', 'administrador']:
            return 'administrador'
        if rol in ['tecnico', 'técnico', 'usuario', 'user']:
            return 'tecnico'
        return rol

    @action(detail=True, methods=['post'], url_path='resolver')
    def resolver(self, request, pk=None):
        mantenimiento = self.get_object()
        usuario_actual = self._current_usuario(request)
        rol_actual = self._canonical_rol(request, usuario_actual)

        if rol_actual != 'tecnico':
            return Response(
                {'error': 'Solo el tecnico puede cerrar un mantenimiento'},
                status=status.HTTP_403_FORBIDDEN,
            )

        resultado = (request.data.get('resultado') or '').strip().lower()
        comentario = (request.data.get('comentario') or '').strip()

        if resultado in ['arreglado', 'reparado', 'activo']:
            nuevo_estado_activo = 'Activo'
            resultado_normalizado = 'arreglado'
            mensaje_resultado = 'fue arreglado por el tecnico'
        elif resultado in ['baja', 'dar de baja', 'sin arreglo', 'no reparable']:
            nuevo_estado_activo = 'Dado de baja'
            resultado_normalizado = 'baja'
            mensaje_resultado = 'debe darse de baja por no tener arreglo'
        else:
            return Response(
                {'error': 'Resultado invalido. Use arreglado o baja'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        estado_actual = (mantenimiento.activo.estado or '').strip().lower()
        if estado_actual not in ['en mantenimiento', 'mantenimiento']:
            return Response(
                {'error': 'Solo se puede cerrar mantenimiento para activos en mantenimiento'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        mantenimiento.activo.estado = nuevo_estado_activo
        mantenimiento.activo.save(update_fields=['estado'])

        tecnico_nombre = getattr(usuario_actual, 'nombre', '') or request.user.get_username()
        notif_marker = (
            f"[NOTIF_ADMIN] activo_id={mantenimiento.activo.id_activo};"
            f"resultado={resultado_normalizado};"
            f"tecnico={tecnico_nombre};"
            f"fecha={date.today().isoformat()}"
        )
        notif_mensaje = (
            f"Activo {mantenimiento.activo.codigo} - {mantenimiento.activo.nombre} {mensaje_resultado}."
        )
        cierre_linea = f"[CIERRE_TECNICO] Resultado: {resultado_normalizado}."
        if comentario:
            cierre_linea = f"{cierre_linea} Comentario: {comentario}"

        descripcion_actual = (mantenimiento.descripcion or '').strip()
        partes = [p for p in [descripcion_actual, cierre_linea, notif_marker, notif_mensaje] if p]
        mantenimiento.descripcion = "\n".join(partes)
        mantenimiento.save(update_fields=['descripcion'])

        return Response(
            {
                'message': 'Estado del activo actualizado y notificacion registrada para administradores',
                'resultado': resultado_normalizado,
                'activo': {
                    'id_activo': mantenimiento.activo.id_activo,
                    'codigo': mantenimiento.activo.codigo,
                    'nombre': mantenimiento.activo.nombre,
                    'estado': mantenimiento.activo.estado,
                },
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=['get'], url_path='notificaciones-admin')
    def notificaciones_admin(self, request):
        usuario_actual = self._current_usuario(request)
        rol_actual = self._canonical_rol(request, usuario_actual)

        if rol_actual != 'administrador':
            return Response(
                {'error': 'Solo administradores pueden ver notificaciones'},
                status=status.HTTP_403_FORBIDDEN,
            )

        items = []
        queryset = self.get_queryset().select_related('activo').order_by('-id_mantenimiento')[:100]
        for mant in queryset:
            descripcion = mant.descripcion or ''
            if '[NOTIF_ADMIN]' not in descripcion:
                continue

            marker_line = ''
            message_line = ''
            for line in descripcion.splitlines():
                if line.startswith('[NOTIF_ADMIN]'):
                    marker_line = line
                elif marker_line and not message_line:
                    message_line = line

            resultado = 'arreglado'
            fecha_evento = ''
            tecnico = ''

            if 'resultado=' in marker_line:
                resultado = marker_line.split('resultado=', 1)[1].split(';', 1)[0].strip()
            if 'fecha=' in marker_line:
                fecha_evento = marker_line.split('fecha=', 1)[1].split(';', 1)[0].strip()
            if 'tecnico=' in marker_line:
                tecnico = marker_line.split('tecnico=', 1)[1].split(';', 1)[0].strip()

            items.append(
                {
                    'id': mant.id_mantenimiento,
                    'fecha': fecha_evento or str(mant.fecha),
                    'resultado': resultado,
                    'tecnico': tecnico,
                    'mensaje': message_line or f'Resolucion tecnica registrada para activo {mant.activo.codigo}',
                    'activo': {
                        'id_activo': mant.activo.id_activo,
                        'codigo': mant.activo.codigo,
                        'nombre': mant.activo.nombre,
                        'estado': mant.activo.estado,
                    },
                }
            )

        return Response(items, status=status.HTTP_200_OK)


class MovimientoActivoViewSet(viewsets.ModelViewSet):
    queryset = MovimientoActivo.objects.all()
    serializer_class = MovimientoActivoSerializer