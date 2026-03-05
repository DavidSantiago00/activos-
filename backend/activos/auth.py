from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .serializers import UsuarioSerializer
from .models import Usuario


class RegisterView(APIView):
    """
    Vista de registro para crear nuevos usuarios.
    POST /api/auth/register/
    Body: {
        "nombre": "David Santiago",
        "correo": "email@example.com",
        "password": "password123",
        "telefono": "+1234567890"
    }
    """
    
    permission_classes = []

    def post(self, request):
        nombre = request.data.get('nombre')
        correo = request.data.get('correo')
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
    Body: { "correo": "email@example.com", "password": "password" }
    """
    
    permission_classes = []

    def post(self, request):
        correo = request.data.get('correo')
        password = request.data.get('password')

        if not correo or not password:
            return Response(
                {'error': 'Correo y contraseña requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Buscar usuario por email (Django usa 'username' pero lo mapeamos con correo)
            user = User.objects.get(email=correo)
        except User.DoesNotExist:
            return Response(
                {'error': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
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
        from .models import Usuario
        try:
            usuario = Usuario.objects.get(correo=correo)
            usuario_data = UsuarioSerializer(usuario).data
        except Usuario.DoesNotExist:
            usuario_data = {
                'id_usuario': user.id,
                'nombre': user.first_name or 'Usuario',
                'correo': user.email,
                'telefono': '',
            }

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
