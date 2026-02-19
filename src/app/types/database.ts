// Tipos basados en el diagrama de base de datos

export interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono?: string;
  id: string;
  id_descripcion_origen?: number;
}

export interface Activo {
  id_activo: number;
  nombre: string;
  descripcion?: string;
  codigo: string;
  fecha: string;
  id_ubicacion?: number;
  direccion?: number;
  ubicacion?: Ubicacion;
  tipo_activo?: TipoActivo;
}

export interface Ubicacion {
  ubicacion: string;
  direccion?: string;
  nombre?: string;
}

export interface Area {
  id_area: number;
  nombre: string;
}

export interface TipoActivo {
  id_tipo: number;
  nombre: string;
}

export interface Mantenimiento {
  id_mantenimiento: number;
  fecha: string;
  descripcion: string;
  id_usuario: number;
  id_activo: number;
  en_mantenimiento: boolean;
  activo?: Activo;
  usuario?: Usuario;
}

export interface MovimientoActivo {
  id_movimiento: number;
  tipo_de_movimiento: string;
  fecha: string;
  id_usuario: number;
  id_activo: number;
  descripcion_destino?: string;
  activo?: Activo;
  usuario?: Usuario;
}

export interface TipoMovimiento {
  tipo_de_movimiento: string;
  descripcion?: string;
}

export interface DescripcionDestino {
  descripcion_destino: string;
  id_usuario?: number;
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
  token?: string;
}
