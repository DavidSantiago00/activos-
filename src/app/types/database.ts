// Tipos alineados con los modelos/serializers del backend.

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono: string;
  rol: string;
  estado?: string;
  contraseña?: string;
}

export interface Area {
  id_area: number;
  nombre: string;
}

export interface Ubicacion {
  id_ubicacion: number;
  nombre: string;
  direccion: string;
  estado?: string;
  area?: Area;
  area_id?: number;
}

export interface TipoActivo {
  id_tipo: number;
  nombre: string;
  vida_util: number;
}

export interface Activo {
  id_activo: number;
  nombre: string;
  descripcion: string;
  codigo: string;
  estado: string;
  tipo_activo?: TipoActivo;
  tipo_activo_id?: number;
  ubicacion?: Ubicacion;
  ubicacion_id?: number;
}

export interface TipoMantenimiento {
  id_tipo_mantenimiento: number;
  nombre: string;
  descripcion: string;
  periodicidad: number;
  estado: string;
}

export interface Mantenimiento {
  id_mantenimiento: number;
  fecha: string;
  descripcion: string;
  estado: string;
  activo?: Activo;
  usuario?: Usuario;
  tipo_mantenimiento?: TipoMantenimiento;
  activo_id?: number;
  usuario_id?: number;
  tipo_mantenimiento_id?: number;
}

export interface MovimientoActivo {
  id_movimiento: number;
  fecha: string;
  descripcion: string;
  tipo_de_movimiento: string;
  activo?: Activo;
  usuario?: Usuario;
  ubicacion_origen?: Ubicacion;
  ubicacion_destino?: Ubicacion;
  activo_id?: number;
  usuario_id?: number;
  ubicacion_origen_id?: number;
  ubicacion_destino_id?: number;
}

export interface LoginCredentials {
  correo: string;
  password: string;
}

export interface AuthUser {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono?: string;
  rol?: string;
  token?: string;
}
