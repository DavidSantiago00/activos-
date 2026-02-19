import { useState } from 'react';
import { Asset, AssetCategory, AssetStatus } from '../types/asset';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { X } from 'lucide-react';

interface AssetFormProps {
  asset?: Asset;
  onSubmit: (asset: Omit<Asset, 'id'>) => void;
  onCancel: () => void;
}

const categoryLabels: Record<AssetCategory, string> = {
  equipos_computo: 'Equipos de Cómputo',
  mobiliario: 'Mobiliario',
  vehiculos: 'Vehículos',
  maquinaria: 'Maquinaria',
  herramientas: 'Herramientas',
  otros: 'Otros',
};

const statusLabels: Record<AssetStatus, string> = {
  activo: 'Activo',
  en_mantenimiento: 'En Mantenimiento',
  inactivo: 'Inactivo',
  dado_de_baja: 'Dado de Baja',
};

export function AssetForm({ asset, onSubmit, onCancel }: AssetFormProps) {
  const [formData, setFormData] = useState<Omit<Asset, 'id'>>({
    codigo: asset?.codigo || '',
    nombre: asset?.nombre || '',
    descripcion: asset?.descripcion || '',
    categoria: asset?.categoria || 'equipos_computo',
    fechaCompra: asset?.fechaCompra || '',
    valorCompra: asset?.valorCompra || 0,
    valorActual: asset?.valorActual || 0,
    ubicacion: asset?.ubicacion || '',
    responsable: asset?.responsable || '',
    estado: asset?.estado || 'activo',
    numeroSerie: asset?.numeroSerie || '',
    marca: asset?.marca || '',
    modelo: asset?.modelo || '',
    proveedor: asset?.proveedor || '',
    garantia: asset?.garantia || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof Omit<Asset, 'id'>, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {asset ? 'Editar Activo Fijo' : 'Nuevo Activo Fijo'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Código */}
            <div className="space-y-2">
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleChange('codigo', e.target.value)}
                required
                placeholder="AF-001"
              />
            </div>

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                required
                placeholder="Laptop Dell XPS 15"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                required
                placeholder="Descripción detallada del activo"
                rows={3}
              />
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría *</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => handleChange('categoria', value as AssetCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => handleChange('estado', value as AssetStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fecha de Compra */}
            <div className="space-y-2">
              <Label htmlFor="fechaCompra">Fecha de Compra *</Label>
              <Input
                id="fechaCompra"
                type="date"
                value={formData.fechaCompra}
                onChange={(e) => handleChange('fechaCompra', e.target.value)}
                required
              />
            </div>

            {/* Valor de Compra */}
            <div className="space-y-2">
              <Label htmlFor="valorCompra">Valor de Compra (USD) *</Label>
              <Input
                id="valorCompra"
                type="number"
                step="0.01"
                value={formData.valorCompra}
                onChange={(e) => handleChange('valorCompra', parseFloat(e.target.value) || 0)}
                required
                placeholder="1500.00"
              />
            </div>

            {/* Valor Actual */}
            <div className="space-y-2">
              <Label htmlFor="valorActual">Valor Actual (USD) *</Label>
              <Input
                id="valorActual"
                type="number"
                step="0.01"
                value={formData.valorActual}
                onChange={(e) => handleChange('valorActual', parseFloat(e.target.value) || 0)}
                required
                placeholder="1200.00"
              />
            </div>

            {/* Ubicación */}
            <div className="space-y-2">
              <Label htmlFor="ubicacion">Ubicación *</Label>
              <Input
                id="ubicacion"
                value={formData.ubicacion}
                onChange={(e) => handleChange('ubicacion', e.target.value)}
                required
                placeholder="Oficina 301"
              />
            </div>

            {/* Responsable */}
            <div className="space-y-2">
              <Label htmlFor="responsable">Responsable *</Label>
              <Input
                id="responsable"
                value={formData.responsable}
                onChange={(e) => handleChange('responsable', e.target.value)}
                required
                placeholder="Juan Pérez"
              />
            </div>

            {/* Marca */}
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                value={formData.marca}
                onChange={(e) => handleChange('marca', e.target.value)}
                placeholder="Dell"
              />
            </div>

            {/* Modelo */}
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                value={formData.modelo}
                onChange={(e) => handleChange('modelo', e.target.value)}
                placeholder="XPS 15 9520"
              />
            </div>

            {/* Número de Serie */}
            <div className="space-y-2">
              <Label htmlFor="numeroSerie">Número de Serie</Label>
              <Input
                id="numeroSerie"
                value={formData.numeroSerie}
                onChange={(e) => handleChange('numeroSerie', e.target.value)}
                placeholder="DL789456123"
              />
            </div>

            {/* Proveedor */}
            <div className="space-y-2">
              <Label htmlFor="proveedor">Proveedor</Label>
              <Input
                id="proveedor"
                value={formData.proveedor}
                onChange={(e) => handleChange('proveedor', e.target.value)}
                placeholder="Dell Direct"
              />
            </div>

            {/* Garantía */}
            <div className="space-y-2">
              <Label htmlFor="garantia">Garantía (hasta)</Label>
              <Input
                id="garantia"
                type="date"
                value={formData.garantia}
                onChange={(e) => handleChange('garantia', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {asset ? 'Actualizar' : 'Crear'} Activo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
