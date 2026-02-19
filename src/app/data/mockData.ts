import { Activo, Usuario, Mantenimiento, MovimientoActivo, TipoActivo, Ubicacion } from '../types/database';

export const mockUbicaciones: Ubicacion[] = [
  { ubicacion: 'Oficina Principal', direccion: 'Av. Principal 123', nombre: 'Sede Central' },
  { ubicacion: 'Bodega Norte', direccion: 'Calle 45 #12-34', nombre: 'Almacén 1' },
  { ubicacion: 'Sucursal Este', direccion: 'Carrera 10 #23-45', nombre: 'Sucursal Este' },
];

export const mockTiposActivo: TipoActivo[] = [
  { id_tipo: 1, nombre: 'Equipos de Cómputo' },
  { id_tipo: 2, nombre: 'Mobiliario' },
  { id_tipo: 3, nombre: 'Vehículos' },
  { id_tipo: 4, nombre: 'Maquinaria' },
  { id_tipo: 5, nombre: 'Herramientas' },
];

export const mockUsuarios: Usuario[] = [
  {
    id_usuario: 1,
    nombre: 'Juan Pérez',
    correo: 'juan.perez@empresa.com',
    telefono: '+1234567890',
    id: 'USR001',
  },
  {
    id_usuario: 2,
    nombre: 'María García',
    correo: 'maria.garcia@empresa.com',
    telefono: '+1234567891',
    id: 'USR002',
  },
  {
    id_usuario: 3,
    nombre: 'Carlos Rodríguez',
    correo: 'carlos.rodriguez@empresa.com',
    telefono: '+1234567892',
    id: 'USR003',
  },
];

export const mockActivos: Activo[] = [
  {
    id_activo: 1,
    nombre: 'Laptop Dell XPS 15',
    descripcion: 'Laptop de alto rendimiento para desarrollo',
    codigo: 'LAP-001',
    fecha: '2024-01-15',
    id_ubicacion: 1,
    ubicacion: mockUbicaciones[0],
    tipo_activo: mockTiposActivo[0],
  },
  {
    id_activo: 2,
    nombre: 'Escritorio Ejecutivo',
    descripcion: 'Escritorio de madera con cajones',
    codigo: 'MOB-001',
    fecha: '2023-06-10',
    id_ubicacion: 1,
    ubicacion: mockUbicaciones[0],
    tipo_activo: mockTiposActivo[1],
  },
  {
    id_activo: 3,
    nombre: 'Impresora HP LaserJet',
    descripcion: 'Impresora láser multifunción',
    codigo: 'EQP-001',
    fecha: '2023-11-20',
    id_ubicacion: 2,
    ubicacion: mockUbicaciones[1],
    tipo_activo: mockTiposActivo[0],
  },
  {
    id_activo: 4,
    nombre: 'Vehículo Toyota Hilux',
    descripcion: 'Camioneta para transporte',
    codigo: 'VEH-001',
    fecha: '2022-03-05',
    id_ubicacion: 1,
    ubicacion: mockUbicaciones[0],
    tipo_activo: mockTiposActivo[2],
  },
  {
    id_activo: 5,
    nombre: 'Monitor Samsung 27"',
    descripcion: 'Monitor LED de 27 pulgadas',
    codigo: 'MON-001',
    fecha: '2023-09-12',
    id_ubicacion: 1,
    ubicacion: mockUbicaciones[0],
    tipo_activo: mockTiposActivo[0],
  },
];

export const mockMantenimientos: Mantenimiento[] = [
  {
    id_mantenimiento: 1,
    fecha: '2025-01-15',
    descripcion: 'Mantenimiento preventivo - Limpieza general',
    id_usuario: 1,
    id_activo: 1,
    en_mantenimiento: false,
    activo: mockActivos[0],
    usuario: mockUsuarios[0],
  },
  {
    id_mantenimiento: 2,
    fecha: '2025-02-10',
    descripcion: 'Reparación de toner',
    id_usuario: 2,
    id_activo: 3,
    en_mantenimiento: true,
    activo: mockActivos[2],
    usuario: mockUsuarios[1],
  },
  {
    id_mantenimiento: 3,
    fecha: '2025-01-20',
    descripcion: 'Cambio de aceite y filtros',
    id_usuario: 3,
    id_activo: 4,
    en_mantenimiento: false,
    activo: mockActivos[3],
    usuario: mockUsuarios[2],
  },
];

export const mockMovimientos: MovimientoActivo[] = [
  {
    id_movimiento: 1,
    tipo_de_movimiento: 'Traslado',
    fecha: '2025-02-01',
    id_usuario: 1,
    id_activo: 1,
    descripcion_destino: 'Oficina Principal',
    activo: mockActivos[0],
    usuario: mockUsuarios[0],
  },
  {
    id_movimiento: 2,
    tipo_de_movimiento: 'Asignación',
    fecha: '2025-02-05',
    id_usuario: 2,
    id_activo: 2,
    descripcion_destino: 'Oficina 301',
    activo: mockActivos[1],
    usuario: mockUsuarios[1],
  },
  {
    id_movimiento: 3,
    tipo_de_movimiento: 'Traslado',
    fecha: '2025-02-10',
    id_usuario: 3,
    id_activo: 3,
    descripcion_destino: 'Bodega Norte',
    activo: mockActivos[2],
    usuario: mockUsuarios[2],
  },
];
