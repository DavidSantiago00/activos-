import { useState } from 'react';
import { Activo } from '../../types/database';
import { mockUbicaciones, mockTiposActivo } from '../../data/mockData';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { X } from 'lucide-react';

interface ActivoFormProps {
  activo?: Activo;
  onSubmit: (activo: Partial<Activo>) => void;
  onCancel: () => void;
}

export function ActivoForm({ activo, onSubmit, onCancel }: ActivoFormProps) {
  const [formData, setFormData] = useState({
    nombre: activo?.nombre || '',
    descripcion: activo?.descripcion || '',
    codigo: activo?.codigo || '',
    fecha: activo?.fecha || new Date().toISOString().split('T')[0],
    id_ubicacion: activo?.id_ubicacion?.toString() || '',
    direccion: activo?.direccion?.toString() || '',
    tipo_activo: activo?.tipo_activo?.id_tipo?.toString() || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedUbicacion = mockUbicaciones.find(
      (u, index) => index.toString() === formData.id_ubicacion
    );
    
    const selectedTipo = mockTiposActivo.find(
      (t) => t.id_tipo.toString() === formData.tipo_activo
    );

    const activoData: Partial<Activo> = {
      ...activo,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      codigo: formData.codigo,
      fecha: formData.fecha,
      id_ubicacion: parseInt(formData.id_ubicacion) || undefined,
      direccion: parseInt(formData.direccion) || undefined,
      ubicacion: selectedUbicacion,
      tipo_activo: selectedTipo,
    };

    onSubmit(activoData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {activo ? 'Editar Activo' : 'Nuevo Activo'}
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
                placeholder="ACT-001"
              />
            </div>

            {/* Fecha */}
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha de Alta *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => handleChange('fecha', e.target.value)}
                required
              />
            </div>

            {/* Nombre */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nombre">Nombre del Activo *</Label>
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
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                placeholder="Descripción detallada del activo"
                rows={3}
              />
            </div>

            {/* Tipo de Activo */}
            <div className="space-y-2">
              <Label htmlFor="tipo_activo">Tipo de Activo *</Label>
              <Select
                value={formData.tipo_activo}
                onValueChange={(value) => handleChange('tipo_activo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {mockTiposActivo.map((tipo) => (
                    <SelectItem key={tipo.id_tipo} value={tipo.id_tipo.toString()}>
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ubicación */}
            <div className="space-y-2">
              <Label htmlFor="id_ubicacion">Ubicación *</Label>
              <Select
                value={formData.id_ubicacion}
                onValueChange={(value) => handleChange('id_ubicacion', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar ubicación" />
                </SelectTrigger>
                <SelectContent>
                  {mockUbicaciones.map((ubicacion, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {ubicacion.ubicacion} - {ubicacion.direccion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dirección (número o referencia) */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="direccion">Dirección/Número</Label>
              <Input
                id="direccion"
                type="number"
                value={formData.direccion}
                onChange={(e) => handleChange('direccion', e.target.value)}
                placeholder="Número de dirección o referencia"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {activo ? 'Actualizar' : 'Crear'} Activo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
