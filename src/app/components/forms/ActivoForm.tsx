import { useState } from 'react';
import { Activo } from '../../types/database';
import { useCatalogos } from '../../hooks/useCatalogos';
import { API_ENDPOINTS, post } from '../../config/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { X } from 'lucide-react';

interface ActivoFormProps {
  activo?: Activo;
  onSubmit: (activo: Partial<Activo>) => Promise<void> | void;
  onCancel: () => void;
}

export function ActivoForm({ activo, onSubmit, onCancel }: ActivoFormProps) {
  const { ubicaciones, tiposActivos, areas } = useCatalogos();
  const isEditing = Boolean(activo);
  const [ubicacionSearch, setUbicacionSearch] = useState('');
  const [useNewUbicacion, setUseNewUbicacion] = useState(false);
  const [nuevaUbicacionNombre, setNuevaUbicacionNombre] = useState('');
  const [nuevaUbicacionDireccion, setNuevaUbicacionDireccion] = useState('');
  const [nuevaAreaNombre, setNuevaAreaNombre] = useState('');

  const [formData, setFormData] = useState({
    nombre: activo?.nombre || '',
    descripcion: activo?.descripcion || '',
    codigo: activo?.codigo || '',
    estado: activo?.estado || 'activo',
    ubicacion_id: activo?.ubicacion_id?.toString() || activo?.ubicacion?.id_ubicacion?.toString() || '',
    tipo_activo_id: activo?.tipo_activo_id?.toString() || activo?.tipo_activo?.id_tipo?.toString() || '',
  });

  const filteredUbicaciones = ubicaciones.filter((ubicacion) => {
    const query = ubicacionSearch.trim().toLowerCase();
    if (!query) return true;

    return (
      ubicacion.nombre.toLowerCase().includes(query) ||
      ubicacion.direccion.toLowerCase().includes(query)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let ubicacionId = Number(formData.ubicacion_id);

    if (isEditing && useNewUbicacion) {
      const areaIngresada = nuevaAreaNombre.trim();
      if (!nuevaUbicacionNombre.trim() || !areaIngresada) {
        return;
      }

      let currentAreaId = areas.find(
        (area) => area.nombre.trim().toLowerCase() === areaIngresada.toLowerCase()
      )?.id_area;

      if (!currentAreaId) {
        const createdArea = await post<{ id_area: number; nombre: string }>(API_ENDPOINTS.areas, {
          nombre: areaIngresada,
        });
        currentAreaId = createdArea.id_area;
      }

      const createdUbicacion = await post<{ id_ubicacion: number }>(API_ENDPOINTS.ubicaciones, {
        nombre: nuevaUbicacionNombre.trim(),
        direccion: nuevaUbicacionDireccion.trim(),
        area_id: Number(currentAreaId),
      });

      ubicacionId = createdUbicacion.id_ubicacion;
    }

    const activoData: Partial<Activo> = {
      ...activo,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      codigo: formData.codigo,
      estado: formData.estado,
      ubicacion_id: ubicacionId,
      tipo_activo_id: Number(formData.tipo_activo_id),
    };

    await onSubmit(activoData);
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
                value={formData.tipo_activo_id}
                onValueChange={(value) => handleChange('tipo_activo_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposActivos.map((tipo) => (
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
              {!useNewUbicacion || !isEditing ? (
                <>
                  <Select
                    value={formData.ubicacion_id}
                    onValueChange={(value) => handleChange('ubicacion_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2 border-b">
                        <Input
                          value={ubicacionSearch}
                          onChange={(e) => setUbicacionSearch(e.target.value)}
                          onKeyDown={(e) => e.stopPropagation()}
                          placeholder="Buscar ubicación..."
                        />
                      </div>
                      {filteredUbicaciones.map((ubicacion) => (
                        <SelectItem key={ubicacion.id_ubicacion} value={ubicacion.id_ubicacion.toString()}>
                          {ubicacion.nombre} - {ubicacion.direccion}
                        </SelectItem>
                      ))}
                      {filteredUbicaciones.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">No se encontraron ubicaciones</div>
                      )}
                    </SelectContent>
                  </Select>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-sm"
                      onClick={() => setUseNewUbicacion(true)}
                    >
                      Escribir ubicación nueva
                    </Button>
                  )}
                </>
              ) : (
                <div className="space-y-2">
                  <Input
                    value={nuevaUbicacionNombre}
                    onChange={(e) => setNuevaUbicacionNombre(e.target.value)}
                    placeholder="Nombre de la nueva ubicación"
                    required
                  />
                  <Input
                    value={nuevaAreaNombre}
                    onChange={(e) => setNuevaAreaNombre(e.target.value)}
                    placeholder="Área de la ubicación"
                    required
                  />
                  <Input
                    value={nuevaUbicacionDireccion}
                    onChange={(e) => setNuevaUbicacionDireccion(e.target.value)}
                    placeholder="Dirección de la ubicación"
                  />
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-sm"
                    onClick={() => setUseNewUbicacion(false)}
                  >
                    Usar ubicación existente
                  </Button>
                </div>
              )}
            </div>

            {/* Estado */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="estado">Estado *</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => handleChange('estado', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="mantenimiento">En mantenimiento</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
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
