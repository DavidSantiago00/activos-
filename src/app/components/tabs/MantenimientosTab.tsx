import { useState } from 'react';
import { useMantenimientos } from '../../hooks/useMantenimientos';
import { Mantenimiento } from '../../types/database';
import { API_ENDPOINTS, post } from '../../config/api';
import {
  exportMantenimientoIndividualReport,
  exportMantenimientosGroupReport,
} from '../../utils/pdfReports';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Search, Pencil, Loader, Wrench, X, FileText } from 'lucide-react';
import { MantenimientoForm } from '../forms/MantenimientoForm';
import { toast } from 'sonner';

interface MantenimientosTabProps {
  readOnly?: boolean;
  allowCreate?: boolean;
  canResolve?: boolean;
}

export function MantenimientosTab({ readOnly = false, allowCreate = true, canResolve = false }: MantenimientosTabProps) {
  const {
    mantenimientos,
    loading,
    error,
    createMantenimiento,
    updateMantenimiento,
    resolverMantenimiento,
  } = useMantenimientos();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showTipoForm, setShowTipoForm] = useState(false);
  const [tipoNombre, setTipoNombre] = useState('');
  const [tipoDescripcion, setTipoDescripcion] = useState('');
  const [periodicidad, setPeriodicidad] = useState('30');
  const [editingMantenimiento, setEditingMantenimiento] = useState<Mantenimiento | undefined>();

  const filteredMantenimientos = mantenimientos.filter(
    (mant) =>
      mant.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mant.activo?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mant.usuario?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mant.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (mantenimientoData: Partial<Mantenimiento>) => {
    try {
      await createMantenimiento(mantenimientoData);
      setShowForm(false);
      toast.success('Mantenimiento creado exitosamente');
    } catch (err) {
      toast.error('Error al crear mantenimiento');
      console.error(err);
    }
  };

  const handleUpdate = async (mantenimientoData: Partial<Mantenimiento>) => {
    if (!editingMantenimiento) return;

    try {
      await updateMantenimiento(editingMantenimiento.id_mantenimiento, mantenimientoData);
      setEditingMantenimiento(undefined);
      toast.success('Mantenimiento actualizado exitosamente');
    } catch (err) {
      toast.error('Error al actualizar mantenimiento');
      console.error(err);
    }
  };

  const handleEdit = (mantenimiento: Mantenimiento) => {
    setEditingMantenimiento(mantenimiento);
  };

  const handleResolver = async (mantenimiento: Mantenimiento, resultado: 'arreglado' | 'baja') => {
    const comentario = window.prompt(
      resultado === 'arreglado'
        ? 'Comentario tecnico (opcional):'
        : 'Motivo de baja (opcional):'
    ) || '';

    try {
      await resolverMantenimiento(mantenimiento.id_mantenimiento, { resultado, comentario });
      toast.success(
        resultado === 'arreglado'
          ? 'Activo marcado como arreglado'
          : 'Activo marcado para baja'
      );
    } catch (err) {
      toast.error('No se pudo registrar la resolucion del tecnico');
      console.error(err);
    }
  };

  const handleCreateTipo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await post(API_ENDPOINTS.tipos_mantenimiento, {
        nombre: tipoNombre,
        descripcion: tipoDescripcion.trim(),
        periodicidad: Number(periodicidad || '30'),
        estado: 'activo',
      });
      toast.success('Tipo de mantenimiento creado exitosamente');
      setTipoNombre('');
      setTipoDescripcion('');
      setPeriodicidad('30');
      setShowTipoForm(false);
    } catch (err) {
      toast.error('Error al crear tipo de mantenimiento');
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
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
            placeholder="Buscar mantenimientos..."
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
              onClick={() => exportMantenimientosGroupReport(filteredMantenimientos)}
              disabled={loading || filteredMantenimientos.length === 0}
            >
              <FileText className="h-4 w-4 mr-2" />
              Reporte PDF
            </Button>
            <Button variant="outline" onClick={() => setShowTipoForm(true)} disabled={loading}>
              <Wrench className="h-4 w-4 mr-2" />
              Nuevo tipo
            </Button>
            <Button onClick={() => setShowForm(true)} disabled={loading}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Mantenimiento
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Cargando mantenimientos...</span>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMantenimientos.map((mant) => (
                <TableRow key={mant.id_mantenimiento}>
                  <TableCell>#{mant.id_mantenimiento}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{mant.activo?.nombre}</div>
                      <div className="text-sm text-gray-500">{mant.activo?.codigo}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate">{mant.descripcion}</div>
                  </TableCell>
                  <TableCell>{mant.usuario?.nombre}</TableCell>
                  <TableCell>{formatDate(mant.fecha)}</TableCell>
                  <TableCell>
                    <Badge variant={mant.estado.toLowerCase() === 'completado' ? 'default' : 'secondary'}>
                      {mant.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => exportMantenimientoIndividualReport(mant)}
                        title="Generar reporte individual"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      {!readOnly && (
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(mant)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {canResolve && mant.activo?.estado?.toLowerCase() === 'mantenimiento' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResolver(mant, 'arreglado')}
                          >
                            Arreglado
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleResolver(mant, 'baja')}
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
      )}

      {filteredMantenimientos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron mantenimientos</p>
        </div>
      )}

      {/* Form Modals */}
      {allowCreate && showForm && (
        <MantenimientoForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {!readOnly && editingMantenimiento && (
        <MantenimientoForm
          mantenimiento={editingMantenimiento}
          onSubmit={handleUpdate}
          onCancel={() => setEditingMantenimiento(undefined)}
        />
      )}

      {allowCreate && showTipoForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-semibold">Nuevo tipo de mantenimiento</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowTipoForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleCreateTipo} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipo-mant-nombre">Nombre *</Label>
                <Input
                  id="tipo-mant-nombre"
                  value={tipoNombre}
                  onChange={(e) => setTipoNombre(e.target.value)}
                  placeholder="Ej: Preventivo, Correctivo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo-mant-descripcion">Descripción *</Label>
                <Input
                  id="tipo-mant-descripcion"
                  value={tipoDescripcion}
                  onChange={(e) => setTipoDescripcion(e.target.value)}
                  placeholder="Ej: Mantenimiento preventivo de equipos"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo-mant-periodicidad">Periodicidad (días) *</Label>
                <Input
                  id="tipo-mant-periodicidad"
                  type="number"
                  min={1}
                  value={periodicidad}
                  onChange={(e) => setPeriodicidad(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowTipoForm(false)}>Cancelar</Button>
                <Button type="submit">Crear tipo</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
