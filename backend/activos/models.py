from django.db import models


class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)
    contraseña = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20)
    rol = models.CharField(max_length=50)
    estado = models.CharField(max_length=50, default='activo')

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'usuario'


class Area(models.Model):
    id_area = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'area'


class Ubicacion(models.Model):
    id_ubicacion = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200)
    area = models.ForeignKey(Area, on_delete=models.CASCADE)
    estado = models.CharField(max_length=50, default='activo')

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'ubicacion'



class TipoActivo(models.Model):
    id_tipo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    vida_util = models.IntegerField()

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'tipo_activo'


class Activo(models.Model):
    id_activo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    codigo = models.CharField(max_length=50, unique=True)
    estado = models.CharField(max_length=50)
    tipo_activo = models.ForeignKey(TipoActivo, on_delete=models.CASCADE)
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.nombre} ({self.codigo})"

    class Meta:
        db_table = 'activo'



class TipoMantenimiento(models.Model):
    id_tipo_mantenimiento = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    periodicidad = models.IntegerField()
    estado = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'tipo_mantenimiento'


class Mantenimiento(models.Model):
    id_mantenimiento = models.AutoField(primary_key=True)
    fecha = models.DateField()
    descripcion = models.TextField()
    estado = models.CharField(max_length=50)
    activo = models.ForeignKey(Activo, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    tipo_mantenimiento = models.ForeignKey(TipoMantenimiento, on_delete=models.CASCADE)

    def __str__(self):
        return f"Mantenimiento {self.id_mantenimiento} - {self.activo.nombre}"

    class Meta:
        db_table = 'mantenimiento'


class MovimientoActivo(models.Model):
    id_movimiento = models.AutoField(primary_key=True)
    fecha = models.DateField()
    descripcion = models.TextField()
    tipo_de_movimiento = models.CharField(max_length=50)
    activo = models.ForeignKey(Activo, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    ubicacion_origen = models.ForeignKey(Ubicacion, related_name="movimientos_salida", on_delete=models.CASCADE)
    ubicacion_destino = models.ForeignKey(Ubicacion, related_name="movimientos_entrada", on_delete=models.CASCADE)

    def __str__(self):
        return f"Movimiento {self.id_movimiento} - {self.activo.nombre}"

    class Meta:
        db_table = 'movimiento_activo'