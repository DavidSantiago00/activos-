import { useState } from 'react';
import { useMovimientos } from '../../hooks/useMovimientos';
import { useCatalogos } from '../../hooks/useCatalogos';
import { MovimientoActivo } from '../../types/database';
import { API_ENDPOINTS, post } from '../../config/api';
import {
  exportMovimientoIndividualReport,
  exportMovimientosGroupReport,
} from '../../utils/pdfReports';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Search, Pencil, Loader, MapPin, X, FileText } from 'lucide-react';
import { MovimientoForm } from '../forms/MovimientoForm';
import { toast } from 'sonner';

interface MovimientosTabProps {
  readOnly?: boolean;
  allowCreate?: boolean;
}

export function MovimientosTab({ readOnly = false, allowCreate = true }: MovimientosTabProps) {
  const { areas, fetchCatalogos } = useCatalogos();
  const {
    movimientos,
    loading,
    error,
    createMovimiento,
    updateMovimiento,
  } = useMovimientos();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showUbicacionForm, setShowUbicacionForm] = useState(false);
  const [ubicacionNombre, setUbicacionNombre] = useState('');
  const [ubicacionDireccion, setUbicacionDireccion] = useState('');
  const [areaNombre, setAreaNombre] = useState('');
  const [editingMovimiento, setEditingMovimiento] = useState<MovimientoActivo | undefined>();

  const filteredMovimientos = movimientos.filter(
    (mov) =>
      mov.tipo_de_movimiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.activo?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.usuario?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (movimientoData: Partial<MovimientoActivo>) => {
    try {
      await createMovimiento(movimientoData);
      setShowForm(false);
      toast.success('Movimiento registrado exitosamente');
    } catch (err) {
      toast.error('Error al crear movimiento');
      console.error(err);
    }
  };

  const handleUpdate = async (movimientoData: Partial<MovimientoActivo>) => {
    if (!editingMovimiento) return;

    try {
      await updateMovimiento(editingMovimiento.id_movimiento, movimientoData);
      setEditingMovimiento(undefined);
      toast.success('Movimiento actualizado exitosamente');
    } catch (err) {
      toast.error('Error al actualizar movimiento');
      console.error(err);
    }
  };

  const handleEdit = (movimiento: MovimientoActivo) => {
    setEditingMovimiento(movimiento);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getTipoColor = (tipo: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (tipo.toLowerCase()) {
      case 'traslado':
        return 'default';
      case 'asignación':
        return 'secondary';
      case 'baja':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar movimientos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={loading}
          />
        </div>
        {allowCreate && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => exportMovimientosGroupReport(filteredMovimientos)}
              disabled={loading || filteredMovimientos.length === 0}
            >
              <FileText className="h-4 w-4 mr-2" />
              Reporte PDF
            </Button>
            <Button variant="outline" onClick={() => setShowUbicacionForm(true)} disabled={loading}>
              <MapPin className="h-4 w-4 mr-2" />
              Nueva ubicación
            </Button>
            <Button onClick={() => setShowForm(true)} disabled={loading}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Movimiento
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Cargando movimientos...</span>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovimientos.map((mov) => (
                <TableRow key={mov.id_movimiento}>
                  <TableCell>#{mov.id_movimiento}</TableCell>
                  <TableCell>
                    <Badge variant={getTipoColor(mov.tipo_de_movimiento)}>{mov.tipo_de_movimiento}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{mov.activo?.nombre}</div>
                      <div className="text-sm text-gray-500">{mov.activo?.codigo}</div>
                    </div>
                  </TableCell>
                  <TableCell>{mov.ubicacion_origen?.nombre || 'N/A'}</TableCell>
                  <TableCell>{mov.ubicacion_destino?.nombre || 'N/A'}</TableCell>
                  <TableCell>{mov.usuario?.nombre}</TableCell>
                  <TableCell>{formatDate(mov.fecha)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => exportMovimientoIndividualReport(mov)}
                        title="Generar reporte individual"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      {!readOnly && (
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(mov)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {filteredMovimientos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron movimientos</p>
        </div>
      )}

      {/* Form Modals */}
      {showForm && (
        <MovimientoForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {!readOnly && editingMovimiento && (
        <MovimientoForm
          movimiento={editingMovimiento}
          onSubmit={handleUpdate}
          onCancel={() => setEditingMovimiento(undefined)}
        />
      )}

      {allowCreate && showUbicacionForm && (
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
                <Label htmlFor="mov-ubicacion-nombre">Nombre de la Ubicación *</Label>
                <Input
                  id="mov-ubicacion-nombre"
                  value={ubicacionNombre}
                  onChange={(e) => setUbicacionNombre(e.target.value)}
                  placeholder="Ej: Oficina 301, Bodega Norte"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mov-ubicacion-area">Área *</Label>
                <Input
                  id="mov-ubicacion-area"
                  value={areaNombre}
                  onChange={(e) => setAreaNombre(e.target.value)}
                  placeholder="Ej: General, Bodega, Oficina"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mov-ubicacion-direccion">Dirección</Label>
                <Input
                  id="mov-ubicacion-direccion"
                  value={ubicacionDireccion}
                  onChange={(e) => setUbicacionDireccion(e.target.value)}
                  placeholder="Ej: Av. Principal 123"
                />
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
