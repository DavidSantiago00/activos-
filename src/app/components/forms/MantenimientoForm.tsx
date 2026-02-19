import { useState } from 'react';
import { Mantenimiento } from '../../types/database';
import { mockActivos, mockUsuarios } from '../../data/mockData';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { X } from 'lucide-react';

interface MantenimientoFormProps {
  mantenimiento?: Mantenimiento;
  onSubmit: (mantenimiento: Partial<Mantenimiento>) => void;
  onCancel: () => void;
}

export function MantenimientoForm({ mantenimiento, onSubmit, onCancel }: MantenimientoFormProps) {
  const [formData, setFormData] = useState({
    fecha: mantenimiento?.fecha || new Date().toISOString().split('T')[0],
    descripcion: mantenimiento?.descripcion || '',
    id_usuario: mantenimiento?.id_usuario?.toString() || '',
    id_activo: mantenimiento?.id_activo?.toString() || '',
    en_mantenimiento: mantenimiento?.en_mantenimiento || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedActivo = mockActivos.find(
      (a) => a.id_activo.toString() === formData.id_activo
    );
    
    const selectedUsuario = mockUsuarios.find(
      (u) => u.id_usuario.toString() === formData.id_usuario
    );

    const mantenimientoData: Partial<Mantenimiento> = {
      ...mantenimiento,
      fecha: formData.fecha,
      descripcion: formData.descripcion,
      id_usuario: parseInt(formData.id_usuario),
      id_activo: parseInt(formData.id_activo),
      en_mantenimiento: formData.en_mantenimiento,
      activo: selectedActivo,
      usuario: selectedUsuario,
    };

    onSubmit(mantenimientoData);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {mantenimiento ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fecha">Fecha de Mantenimiento *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => handleChange('fecha', e.target.value)}
                required
              />
            </div>

            {/* Activo */}
            <div className="space-y-2">
              <Label htmlFor="id_activo">Activo *</Label>
              <Select
                value={formData.id_activo}
                onValueChange={(value) => handleChange('id_activo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar activo" />
                </SelectTrigger>
                <SelectContent>
                  {mockActivos.map((activo) => (
                    <SelectItem key={activo.id_activo} value={activo.id_activo.toString()}>
                      {activo.codigo} - {activo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Usuario Responsable */}
            <div className="space-y-2">
              <Label htmlFor="id_usuario">Usuario Responsable *</Label>
              <Select
                value={formData.id_usuario}
                onValueChange={(value) => handleChange('id_usuario', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar usuario" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsuarios.map((usuario) => (
                    <SelectItem key={usuario.id_usuario} value={usuario.id_usuario.toString()}>
                      {usuario.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Descripción */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descripcion">Descripción del Mantenimiento *</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                required
                placeholder="Describa el mantenimiento realizado o a realizar"
                rows={4}
              />
            </div>

            {/* Estado del Mantenimiento */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="en_mantenimiento">En Mantenimiento Activo</Label>
                  <p className="text-sm text-gray-500">
                    Indica si el activo está actualmente en proceso de mantenimiento
                  </p>
                </div>
                <Switch
                  id="en_mantenimiento"
                  checked={formData.en_mantenimiento}
                  onCheckedChange={(checked) => handleChange('en_mantenimiento', checked)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {mantenimiento ? 'Actualizar' : 'Crear'} Mantenimiento
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
