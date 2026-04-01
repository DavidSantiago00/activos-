import { useState } from 'react';
import { useActivos } from '../../hooks/useActivos';
import { useCatalogos } from '../../hooks/useCatalogos';
import { Activo } from '../../types/database';
import { API_ENDPOINTS, post } from '../../config/api';
import { exportActivoIndividualReport, exportActivosGroupReport } from '../../utils/pdfReports';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Plus, Search, Pencil, Loader, Tag, MapPin, X, FileText } from 'lucide-react';
import { ActivoForm } from '../forms/ActivoForm';
import { toast } from 'sonner';

interface ActivosTabProps {
  readOnly?: boolean;
  allowCreate?: boolean;
  canResolve?: boolean;
}

export function ActivosTab({ readOnly = false, allowCreate = true, canResolve = false }: ActivosTabProps) {
  const { activos, loading, error, createActivo, updateActivo, resolverEstadoActivo } = useActivos();
  const { areas, fetchCatalogos } = useCatalogos();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingActivo, setEditingActivo] = useState<Activo | undefined>();
  const [showTipoForm, setShowTipoForm] = useState(false);
  const [showUbicacionForm, setShowUbicacionForm] = useState(false);
  const [tipoNombre, setTipoNombre] = useState('');
  const [ubicacionNombre, setUbicacionNombre] = useState('');
  const [ubicacionDireccion, setUbicacionDireccion] = useState('');
  const [areaNombre, setAreaNombre] = useState('');

  const filteredActivos = activos.filter(
    (activo) =>
      activo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activo.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (activoData: Partial<Activo>) => {
    try {
      await createActivo(activoData);
      setShowForm(false);
      toast.success('Activo creado exitosamente');
    } catch (err) {
      toast.error('Error al crear el activo');
      console.error(err);
    }
  };

  const handleUpdate = async (activoData: Partial<Activo>) => {
    if (!editingActivo) return;

    try {
      await updateActivo(editingActivo.id_activo, activoData);
      setEditingActivo(undefined);
      toast.success('Activo actualizado exitosamente');
    } catch (err) {
      toast.error('Error al actualizar el activo');
      console.error(err);
    }
  };

  const handleEdit = (activo: Activo) => {
    setEditingActivo(activo);
  };

  const handleResolver = async (activo: Activo, resultado: 'arreglado' | 'baja') => {
    const comentario = window.prompt(
      resultado === 'arreglado'
        ? 'Comentario tecnico (opcional):'
        : 'Motivo de baja (opcional):'
    ) || '';

    try {
      await resolverEstadoActivo(activo.id_activo, { resultado, comentario });
      toast.success(
        resultado === 'arreglado'
          ? 'Activo marcado como arreglado'
          : 'Activo marcado para baja'
      );
    } catch (err) {
      toast.error('No se pudo actualizar el estado del activo');
      console.error(err);
    }
  };

  const handleCreateTipo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await post(API_ENDPOINTS.tipos_activos, {
        nombre: tipoNombre,
        vida_util: 5,
      });
      toast.success('Tipo de activo creado exitosamente');
      setTipoNombre('');
      setShowTipoForm(false);
      await fetchCatalogos();
    } catch (err) {
      toast.error('Error al crear tipo de activo');
      console.error(err);
    }
  };

  const handleCreateUbicacion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const areaIngresada = areaNombre.trim();
      if (!areaIngresada) {
        toast.error('El área es obligatoria');
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

      await post(API_ENDPOINTS.ubicaciones, {
        nombre: ubicacionNombre,
        direccion: ubicacionDireccion,
        area_id: Number(currentAreaId),
      });
      toast.success('Ubicación creada exitosamente');
      setUbicacionNombre('');
      setUbicacionDireccion('');
      setAreaNombre('');
      setShowUbicacionForm(false);
      await fetchCatalogos();
    } catch (err) {
      toast.error('Error al crear ubicación');
      console.error(err);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: {error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Asegúrate de que el servidor Django esté ejecutándose en http://localhost:8000
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar activos por nombre, código o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={loading}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportActivosGroupReport(filteredActivos)}
            disabled={loading || filteredActivos.length === 0}
          >
            <FileText className="h-4 w-4 mr-2" />
            Reporte PDF
          </Button>
          {!readOnly && (
            <>
              <Button variant="outline" onClick={() => setShowTipoForm(true)} disabled={loading}>
                <Tag className="h-4 w-4 mr-2" />
                Nuevo tipo
              </Button>
              <Button variant="outline" onClick={() => setShowUbicacionForm(true)} disabled={loading}>
                <MapPin className="h-4 w-4 mr-2" />
                Nueva ubicación
              </Button>
            </>
          )}
          {allowCreate && (
            <Button onClick={() => setShowForm(true)} disabled={loading}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Activo
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Cargando activos...</span>
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivos.map((activo) => (
                  <TableRow key={activo.id_activo}>
                    <TableCell>
                      <Badge variant="outline">{activo.codigo}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{activo.nombre}</div>
                        <div className="text-sm text-gray-500">{activo.descripcion}</div>
                      </div>
                    </TableCell>
                    <TableCell>{activo.tipo_activo?.nombre || 'N/A'}</TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{activo.ubicacion?.nombre || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{activo.ubicacion?.direccion}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={activo.estado === 'activo' ? 'default' : 'secondary'}>
                        {activo.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => exportActivoIndividualReport(activo)}
                          title="Generar reporte individual"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        {!readOnly && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(activo)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {canResolve && ['mantenimiento', 'en mantenimiento'].includes((activo.estado || '').toLowerCase()) && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResolver(activo, 'arreglado')}
                            >
                              Arreglado
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleResolver(activo, 'baja')}
                            >
                              Dar de baja
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredActivos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron activos</p>
            </div>
          )}
        </>
      )}

      {/* Form Modals */}
      {allowCreate && showForm && (
        <ActivoForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {!readOnly && editingActivo && (
        <ActivoForm
          activo={editingActivo}
          onSubmit={handleUpdate}
          onCancel={() => setEditingActivo(undefined)}
        />
      )}

      {!readOnly && showTipoForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-semibold">Nuevo tipo de activo</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowTipoForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleCreateTipo} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipo-nombre">Nombre del Tipo de Activo *</Label>
                <Input
                  id="tipo-nombre"
                  value={tipoNombre}
                  onChange={(e) => setTipoNombre(e.target.value)}
                  placeholder="Ej: Equipos de Cómputo, Mobiliario"
                  required
                />
                <p className="text-sm text-gray-500">Este tipo estará disponible al crear o editar activos.</p>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowTipoForm(false)}>Cancelar</Button>
                <Button type="submit">Crear tipo</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!readOnly && showUbicacionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-semibold">Nueva Ubicación</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowUbicacionForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleCreateUbicacion} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ubicacion-nombre">Nombre de la Ubicación *</Label>
                <Input
                  id="ubicacion-nombre"
                  value={ubicacionNombre}
                  onChange={(e) => setUbicacionNombre(e.target.value)}
                  placeholder="Ej: Oficina 301, Bodega Norte"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ubicacion-area">Área *</Label>
                <Input
                  id="ubicacion-area"
                  value={areaNombre}
                  onChange={(e) => setAreaNombre(e.target.value)}
                  placeholder="Ej: General, Bodega, Oficina"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ubicacion-direccion">Dirección</Label>
                <Input
                  id="ubicacion-direccion"
                  value={ubicacionDireccion}
                  onChange={(e) => setUbicacionDireccion(e.target.value)}
                  placeholder="Ej: Av. Principal 123"
                />
                <p className="text-sm text-gray-500">Esta ubicación estará disponible al crear o editar activos.</p>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowUbicacionForm(false)}>Cancelar</Button>
                <Button type="submit" disabled={!areaNombre.trim()}>Crear ubicación</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
