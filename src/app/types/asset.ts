export type AssetStatus = 'activo' | 'en_mantenimiento' | 'inactivo' | 'dado_de_baja';
export type AssetCategory = 'equipos_computo' | 'mobiliario' | 'vehiculos' | 'maquinaria' | 'herramientas' | 'otros';

export interface Asset {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: AssetCategory;
  fechaCompra: string;
  valorCompra: number;
  valorActual: number;
  ubicacion: string;
  responsable: string;
  estado: AssetStatus;
  numeroSerie?: string;
  marca?: string;
  modelo?: string;
  proveedor?: string;
  garantia?: string;
}
