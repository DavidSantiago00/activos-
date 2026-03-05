# Generated migration file
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id_usuario', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100)),
                ('correo', models.EmailField(max_length=254, unique=True)),
                ('contraseña', models.CharField(max_length=255)),
                ('telefono', models.CharField(max_length=20)),
                ('rol', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'usuario',
            },
        ),
        migrations.CreateModel(
            name='Area',
            fields=[
                ('id_area', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'area',
            },
        ),
        migrations.CreateModel(
            name='Ubicacion',
            fields=[
                ('id_ubicacion', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100)),
                ('direccion', models.CharField(max_length=200)),
                ('area', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='activos.area')),
            ],
            options={
                'db_table': 'ubicacion',
            },
        ),
        migrations.CreateModel(
            name='TipoActivo',
            fields=[
                ('id_tipo', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100)),
                ('vida_util', models.IntegerField()),
            ],
            options={
                'db_table': 'tipo_activo',
            },
        ),
        migrations.CreateModel(
            name='Activo',
            fields=[
                ('id_activo', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100)),
                ('descripcion', models.TextField()),
                ('codigo', models.CharField(max_length=50, unique=True)),
                ('estado', models.CharField(max_length=50)),
                ('tipo_activo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='activos.tipoactivo')),
                ('ubicacion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='activos.ubicacion')),
            ],
            options={
                'db_table': 'activo',
            },
        ),
        migrations.CreateModel(
            name='TipoMantenimiento',
            fields=[
                ('id_tipo_mantenimiento', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100)),
                ('descripcion', models.TextField()),
                ('periodicidad', models.IntegerField()),
                ('estado', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'tipo_mantenimiento',
            },
        ),
        migrations.CreateModel(
            name='Mantenimiento',
            fields=[
                ('id_mantenimiento', models.AutoField(primary_key=True, serialize=False)),
                ('fecha', models.DateField()),
                ('descripcion', models.TextField()),
                ('estado', models.CharField(max_length=50)),
                ('activo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='activos.activo')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='activos.usuario')),
                ('tipo_mantenimiento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='activos.tipomantenimiento')),
            ],
            options={
                'db_table': 'mantenimiento',
            },
        ),
        migrations.CreateModel(
            name='MovimientoActivo',
            fields=[
                ('id_movimiento', models.AutoField(primary_key=True, serialize=False)),
                ('fecha', models.DateField()),
                ('descripcion', models.TextField()),
                ('tipo_de_movimiento', models.CharField(max_length=50)),
                ('activo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='activos.activo')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='activos.usuario')),
                ('ubicacion_origen', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='movimientos_salida', to='activos.ubicacion')),
                ('ubicacion_destino', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='movimientos_entrada', to='activos.ubicacion')),
            ],
            options={
                'db_table': 'movimiento_activo',
            },
        ),
    ]
