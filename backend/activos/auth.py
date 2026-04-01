from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import Q
from .serializers import UsuarioSerializer
from .models import Usuario


class RegisterView(APIView):
    """
    Vista de registro para crear nuevos usuarios.
    POST /api/auth/register/
    Body: {
        "nombre": "David Santiago",
        "correo": "davidsantiagotorresrestrepo@gmail.com",
        "password": "icg082010",
        "telefono": "+1234567890",
        "rol": "tecnico"
    }
    """
    
    permission_classes = []

    def post(self, request):
        nombre = request.data.get('nombre')
        correo = (request.data.get('correo') or '').strip().lower()
        password = request.data.get('password')
        telefono = request.data.get('telefono', '')

        # Validar campos requeridos
        if not all([nombre, correo, password]):
            return Response(
                {'error': 'Nombre, correo y contraseña son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validar que el correo no esté registrado
        if User.objects.filter(email=correo).exists():
            return Response(
                {'error': 'El correo ya está registrado'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Usuario.objects.filter(correo=correo).exists():
            return Response(
                {'error': 'El correo ya está registrado'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                # Crear usuario Django
                user = User.objects.create_user(
                    username=correo,  # Usar correo como username
                    email=correo,
                    password=password,
                    first_name=nombre.split()[0],  # Primer nombre
                    last_name=' '.join(nombre.split()[1:]) if len(nombre.split()) > 1 else '',  # Apellidos
                )

                # Crear usuario en modelo Activos
                usuario = Usuario.objects.create(
                    nombre=nombre,
                    correo=correo,
                    telefono=telefono,
                    contraseña=password,
                    rol='tecnico',
                )

            # Generar JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            usuario_data = UsuarioSerializer(usuario).data

            return Response({
                'access_token': access_token,
                'refresh_token': str(refresh),
                'user': usuario_data,
                'message': 'Usuario registrado exitosamente'
            }, status=status.HTTP_201_CREATED)

        except Exception as err:
            return Response(
                {'error': f'Error al registrar usuario: {str(err)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



class LoginView(APIView):
    """
    Vista de login para autenticación con JWT.
    POST /api/auth/login/
    Body: {
        "correo": "email@example.com",
        "password": "password",
        "rol": "tecnico | administrador"
    }
    """
    
    permission_classes = []

    @staticmethod
    def _normalize_rol(rol):
        value = (rol or '').strip().lower()
        if value in ['tecnico', 'tecnico/a', 'técnico']:
            return 'tecnico'
        if value in ['admin', 'administrador']:
            return 'administrador'
        if value in ['usuario', 'user']:
            return 'tecnico'
        return value

    @staticmethod
    def _canonical_rol(user, rol_bd):
        if user.is_staff or user.is_superuser:
            return 'administrador'
        if rol_bd in ['tecnico', 'administrador']:
            return rol_bd
        return 'tecnico'

    def post(self, request):
        correo = (request.data.get('correo') or '').strip().lower()
        password = request.data.get('password')
        rol_solicitado = self._normalize_rol(request.data.get('rol'))

        if not correo or not password:
            return Response(
                {'error': 'Correo y contraseña requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if rol_solicitado and rol_solicitado not in ['tecnico', 'administrador']:
            return Response(
                {'error': 'Rol inválido. Debe ser tecnico o administrador'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Buscar por email o username para soportar usuarios legacy.
            user = User.objects.get(Q(email=correo) | Q(username=correo))
        except User.DoesNotExist:
            # Fallback: usuario legacy existente solo en la tabla Usuario.
            legacy_usuario = Usuario.objects.filter(correo=correo).first()
            if not legacy_usuario:
                return Response(
                    {'error': 'Credenciales inválidas'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            if legacy_usuario.contraseña and legacy_usuario.contraseña != password:
                return Response(
                    {'error': 'Credenciales inválidas'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            if not legacy_usuario.contraseña:
                legacy_usuario.contraseña = password
                legacy_usuario.save(update_fields=['contraseña'])

            # Sincronizar automáticamente al sistema Django auth.
            user = User.objects.create_user(
                username=correo,
                email=correo,
                password=password,
                first_name=legacy_usuario.nombre.split()[0] if legacy_usuario.nombre else '',
                last_name=' '.join(legacy_usuario.nombre.split()[1:]) if legacy_usuario.nombre and len(legacy_usuario.nombre.split()) > 1 else '',
            )

        # Verificar contraseña
        if not user.check_password(password):
            return Response(
                {'error': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Generar JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Obtener datos del usuario desde modelo Activos
        usuario = None
        try:
            usuario = Usuario.objects.get(correo=correo)
            usuario_data = UsuarioSerializer(usuario).data
        except Usuario.DoesNotExist:
            usuario_data = {
                'id_usuario': user.id,
                'nombre': user.first_name or 'Usuario',
                'correo': user.email,
                'telefono': '',
                'rol': 'administrador' if (user.is_staff or user.is_superuser) else 'tecnico',
            }

        rol_usuario = self._normalize_rol(usuario_data.get('rol'))
        rol_canonico = self._canonical_rol(user, rol_usuario)

        if usuario and (usuario.rol or '').strip().lower() != rol_canonico:
            usuario.rol = rol_canonico
            usuario.save(update_fields=['rol'])

        usuario_data['rol'] = rol_canonico

        if rol_solicitado and rol_canonico != rol_solicitado:
            return Response(
                {'error': 'El rol seleccionado no corresponde a este usuario'},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response({
            'access_token': access_token,
            'refresh_token': str(refresh),
            'user': usuario_data
        }, status=status.HTTP_200_OK)


class RefreshTokenView(APIView):
    """
    Vista para refrescar el token de acceso.
    POST /api/auth/refresh/
    Body: { "refresh": "refresh_token" }
    """
    
    permission_classes = []

    def post(self, request):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response(
                {'error': 'Refresh token requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            return Response({
                'access_token': access_token,
            }, status=status.HTTP_200_OK)
        except Exception as err:
            return Response(
                {'error': 'Token inválido o expirado'},
                status=status.HTTP_401_UNAUTHORIZED
            )
