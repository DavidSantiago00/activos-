import { useState } from 'react';
import { MovimientoActivo } from '../../types/database';
import { useCatalogos } from '../../hooks/useCatalogos';
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
  const { activos, usuarios, ubicaciones } = useCatalogos();
  const [searchOrigen, setSearchOrigen] = useState('');
  const [searchDestino, setSearchDestino] = useState('');

  const [formData, setFormData] = useState({
    tipo_de_movimiento: movimiento?.tipo_de_movimiento || '',
    fecha: movimiento?.fecha || new Date().toISOString().split('T')[0],
    usuario_id: movimiento?.usuario_id?.toString() || movimiento?.usuario?.id_usuario?.toString() || '',
    activo_id: movimiento?.activo_id?.toString() || movimiento?.activo?.id_activo?.toString() || '',
    descripcion: movimiento?.descripcion || '',
    ubicacion_origen_id:
      movimiento?.ubicacion_origen_id?.toString() || movimiento?.ubicacion_origen?.id_ubicacion?.toString() || '',
    ubicacion_destino_id:
      movimiento?.ubicacion_destino_id?.toString() || movimiento?.ubicacion_destino?.id_ubicacion?.toString() || '',
  });

  const filteredUbicacionesOrigen = ubicaciones.filter((ubicacion) => {
    const query = searchOrigen.trim().toLowerCase();
    if (!query) return true;

    return (
      ubicacion.nombre.toLowerCase().includes(query) ||
      ubicacion.direccion.toLowerCase().includes(query)
    );
  });

  const filteredUbicacionesDestino = ubicaciones.filter((ubicacion) => {
    const query = searchDestino.trim().toLowerCase();
    if (!query) return true;

    return (
      ubicacion.nombre.toLowerCase().includes(query) ||
      ubicacion.direccion.toLowerCase().includes(query)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const movimientoData: Partial<MovimientoActivo> = {
      ...movimiento,
      tipo_de_movimiento: formData.tipo_de_movimiento,
      fecha: formData.fecha,
      descripcion: formData.descripcion,
      usuario_id: Number(formData.usuario_id),
      activo_id: Number(formData.activo_id),
      ubicacion_origen_id: Number(formData.ubicacion_origen_id),
      ubicacion_destino_id: Number(formData.ubicacion_destino_id),
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

            {/* Ubicación origen */}
            <div className="space-y-2">
              <Label htmlFor="ubicacion_origen_id">Ubicación Origen *</Label>
              <Select
                value={formData.ubicacion_origen_id}
                onValueChange={(value) => handleChange('ubicacion_origen_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar origen" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2 border-b">
                    <Input
                      value={searchOrigen}
                      onChange={(e) => setSearchOrigen(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                      placeholder="Buscar ubicación origen..."
                    />
                  </div>
                  {filteredUbicacionesOrigen.map((ubicacion) => (
                    <SelectItem key={ubicacion.id_ubicacion} value={ubicacion.id_ubicacion.toString()}>
                      {ubicacion.nombre}
                    </SelectItem>
                  ))}
                  {filteredUbicacionesOrigen.length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-500">No se encontraron ubicaciones</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Ubicación destino */}
            <div className="space-y-2">
              <Label htmlFor="ubicacion_destino_id">Ubicación Destino *</Label>
              <Select
                value={formData.ubicacion_destino_id}
                onValueChange={(value) => handleChange('ubicacion_destino_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar destino" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2 border-b">
                    <Input
                      value={searchDestino}
                      onChange={(e) => setSearchDestino(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                      placeholder="Buscar ubicación destino..."
                    />
                  </div>
                  {filteredUbicacionesDestino.map((ubicacion) => (
                    <SelectItem key={ubicacion.id_ubicacion} value={ubicacion.id_ubicacion.toString()}>
                      {ubicacion.nombre}
                    </SelectItem>
                  ))}
                  {filteredUbicacionesDestino.length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-500">No se encontraron ubicaciones</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Descripción */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                required
                placeholder="Describe el motivo o detalle del movimiento"
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
