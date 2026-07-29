from django.contrib import admin
from .models import (
    Usuario, Area, Ubicacion, TipoActivo, Activo,
    TipoMantenimiento, Mantenimiento, MovimientoActivo
)


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('id_usuario', 'nombre', 'correo', 'rol', 'estado')
    search_fields = ('nombre', 'correo')


@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    list_display = ('id_area', 'nombre')
    search_fields = ('nombre',)


@admin.register(Ubicacion)
class UbicacionAdmin(admin.ModelAdmin):
    list_display = ('id_ubicacion', 'nombre', 'direccion', 'area')
    search_fields = ('nombre', 'direccion')


@admin.register(TipoActivo)
class TipoActivoAdmin(admin.ModelAdmin):
    list_display = ('id_tipo', 'nombre', 'vida_util')
    search_fields = ('nombre',)


@admin.register(Activo)
class ActivoAdmin(admin.ModelAdmin):
    list_display = ('id_activo', 'codigo', 'nombre', 'estado', 'tipo_activo', 'ubicacion')
    search_fields = ('nombre', 'codigo')
    list_filter = ('estado', 'tipo_activo', 'ubicacion')


@admin.register(TipoMantenimiento)
class TipoMantenimientoAdmin(admin.ModelAdmin):
    list_display = ('id_tipo_mantenimiento', 'nombre', 'periodicidad', 'estado')
    search_fields = ('nombre',)


@admin.register(Mantenimiento)
class MantenimientoAdmin(admin.ModelAdmin):
    list_display = ('id_mantenimiento', 'fecha', 'activo', 'usuario', 'estado')
    search_fields = ('activo__nombre', 'usuario__nombre')
    list_filter = ('fecha', 'estado', 'tipo_mantenimiento')


@admin.register(MovimientoActivo)
class MovimientoActivoAdmin(admin.ModelAdmin):
    list_display = ('id_movimiento', 'fecha', 'activo', 'usuario', 'tipo_de_movimiento')
    search_fields = ('activo__nombre', 'usuario__nombre')
    list_filter = ('fecha', 'tipo_de_movimiento')
