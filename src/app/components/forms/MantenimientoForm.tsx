import { useState } from 'react';
import { Mantenimiento } from '../../types/database';
import { useCatalogos } from '../../hooks/useCatalogos';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { X } from 'lucide-react';

interface MantenimientoFormProps {
  mantenimiento?: Mantenimiento;
  onSubmit: (mantenimiento: Partial<Mantenimiento>) => void;
  onCancel: () => void;
}

export function MantenimientoForm({ mantenimiento, onSubmit, onCancel }: MantenimientoFormProps) {
  const { activos, usuarios, tiposMantenimiento } = useCatalogos();

  const [formData, setFormData] = useState({
    fecha: mantenimiento?.fecha || new Date().toISOString().split('T')[0],
    descripcion: mantenimiento?.descripcion || '',
    estado: mantenimiento?.estado || 'pendiente',
    usuario_id: mantenimiento?.usuario_id?.toString() || mantenimiento?.usuario?.id_usuario?.toString() || '',
    activo_id: mantenimiento?.activo_id?.toString() || mantenimiento?.activo?.id_activo?.toString() || '',
    tipo_mantenimiento_id:
      mantenimiento?.tipo_mantenimiento_id?.toString() ||
      mantenimiento?.tipo_mantenimiento?.id_tipo_mantenimiento?.toString() ||
      '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mantenimientoData: Partial<Mantenimiento> = {
      ...mantenimiento,
      fecha: formData.fecha,
      descripcion: formData.descripcion,
      estado: formData.estado,
      usuario_id: Number(formData.usuario_id),
      activo_id: Number(formData.activo_id),
      tipo_mantenimiento_id: Number(formData.tipo_mantenimiento_id),
    };

    onSubmit(mantenimientoData);
  };

  const handleChange = (field: string, value: string) => {
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
                value={formData.activo_id}
                onValueChange={(value) => handleChange('activo_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar activo" />
                </SelectTrigger>
                <SelectContent>
                  {activos.map((activo) => (
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
                value={formData.usuario_id}
                onValueChange={(value) => handleChange('usuario_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar usuario" />
                </SelectTrigger>
                <SelectContent>
                  {usuarios.map((usuario) => (
                    <SelectItem key={usuario.id_usuario} value={usuario.id_usuario.toString()}>
                      {usuario.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Mantenimiento */}
            <div className="space-y-2">
              <Label htmlFor="tipo_mantenimiento_id">Tipo de Mantenimiento *</Label>
              <Select
                value={formData.tipo_mantenimiento_id}
                onValueChange={(value) => handleChange('tipo_mantenimiento_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposMantenimiento.map((tipo) => (
                    <SelectItem
                      key={tipo.id_tipo_mantenimiento}
                      value={tipo.id_tipo_mantenimiento.toString()}
                    >
                      {tipo.nombre}
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
                onValueChange={(value) => handleChange('estado', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_proceso">En proceso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
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
