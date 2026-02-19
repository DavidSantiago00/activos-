import { useState } from 'react';
import { MovimientoActivo } from '../../types/database';
import { mockActivos, mockUsuarios } from '../../data/mockData';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { X } from 'lucide-react';

interface MovimientoFormProps {
  movimiento?: MovimientoActivo;
  onSubmit: (movimiento: Partial<MovimientoActivo>) => void;
  onCancel: () => void;
}

const tiposMovimiento = [
  { value: 'Traslado', label: 'Traslado' },
  { value: 'Asignación', label: 'Asignación' },
  { value: 'Baja', label: 'Baja' },
  { value: 'Préstamo', label: 'Préstamo' },
  { value: 'Devolución', label: 'Devolución' },
];

export function MovimientoForm({ movimiento, onSubmit, onCancel }: MovimientoFormProps) {
  const [formData, setFormData] = useState({
    tipo_de_movimiento: movimiento?.tipo_de_movimiento || '',
    fecha: movimiento?.fecha || new Date().toISOString().split('T')[0],
    id_usuario: movimiento?.id_usuario?.toString() || '',
    id_activo: movimiento?.id_activo?.toString() || '',
    descripcion_destino: movimiento?.descripcion_destino || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedActivo = mockActivos.find(
      (a) => a.id_activo.toString() === formData.id_activo
    );
    
    const selectedUsuario = mockUsuarios.find(
      (u) => u.id_usuario.toString() === formData.id_usuario
    );

    const movimientoData: Partial<MovimientoActivo> = {
      ...movimiento,
      tipo_de_movimiento: formData.tipo_de_movimiento,
      fecha: formData.fecha,
      id_usuario: parseInt(formData.id_usuario),
      id_activo: parseInt(formData.id_activo),
      descripcion_destino: formData.descripcion_destino,
      activo: selectedActivo,
      usuario: selectedUsuario,
    };

    onSubmit(movimientoData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {movimiento ? 'Editar Movimiento' : 'Nuevo Movimiento'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipo de Movimiento */}
            <div className="space-y-2">
              <Label htmlFor="tipo_de_movimiento">Tipo de Movimiento *</Label>
              <Select
                value={formData.tipo_de_movimiento}
                onValueChange={(value) => handleChange('tipo_de_movimiento', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposMovimiento.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fecha */}
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha del Movimiento *</Label>
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

            {/* Descripción de Destino */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descripcion_destino">Descripción de Destino *</Label>
              <Textarea
                id="descripcion_destino"
                value={formData.descripcion_destino}
                onChange={(e) => handleChange('descripcion_destino', e.target.value)}
                required
                placeholder="Describa el destino o detalles del movimiento (ubicación, área, etc.)"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {movimiento ? 'Actualizar' : 'Crear'} Movimiento
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
