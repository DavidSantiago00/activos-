#!/usr/bin/env python
"""
Script para crear un usuario de prueba en Django.
Ejecutar con: python manage.py shell < create_user.py
"""
from django.contrib.auth.models import User
from activos.models import Usuario

# Crear usuario Django
user, created = User.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'davidsantiagotorresrestrepo@gmail.com',
        'first_name': 'David Santiago',
        'is_staff': True,
        'is_superuser': True,
    }
)

if created:
    user.set_password('icg082010')
    user.save()
    print(f"✅ Usuario Django creado: {user.username}")
else:
    print(f"⚠️ Usuario Django ya existe: {user.username}")
    # Actualizar email si cambió
    if user.email != 'davidsantiagotorresrestrepo@gmail.com':
        user.email = 'davidsantiagotorresrestrepo@gmail.com'
        user.save()
        print(f"✅ Email actualizado: {user.email}")

# Crear usuario en modelo Activos si no existe
usuario, created = Usuario.objects.get_or_create(
    correo='davidsantiagotorresrestrepo@gmail.com',
    defaults={
        'nombre': 'David Santiago Torres',
        'telefono': '+1234567890',
        'contraseña': 'icg082010',
        'rol': 'administrador',
        'estado': 'activo',
    }
)

if created:
    print(f"✅ Usuario Activos creado: {usuario.nombre}")
else:
    print(f"⚠️ Usuario Activos ya existe: {usuario.nombre}")

print("\n✅ Credenciales para login:")
print("📧 Correo: davidsantiagotorresrestrepo@gmail.com")
print("🔐 Contraseña: icg082010")
