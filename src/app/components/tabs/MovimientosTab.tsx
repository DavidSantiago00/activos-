import { useState } from 'react';
import { useMovimientos } from '../../hooks/useMovimientos';
import { MovimientoActivo } from '../../types/database';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Search, Pencil, Trash2, Loader } from 'lucide-react';
import { MovimientoForm } from '../forms/MovimientoForm';
import { toast } from 'sonner';

export function MovimientosTab() {
  const {
    movimientos,
    loading,
    error,
    createMovimiento,
    updateMovimiento,
    deleteMovimiento,
  } = useMovimientos();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
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

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este movimiento?')) {
      try {
        await deleteMovimiento(id);
        toast.success('Movimiento eliminado exitosamente');
      } catch (err) {
        toast.error('Error al eliminar movimiento');
        console.error(err);
      }
    }
  };

  const handleEdit = (movimiento: MovimientoActivo) => {
    setEditingMovimiento(movimiento);
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
        <Button onClick={() => setShowForm(true)} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Movimiento
        </Button>
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
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(mov)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(mov.id_movimiento)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
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

      {editingMovimiento && (
        <MovimientoForm
          movimiento={editingMovimiento}
          onSubmit={handleUpdate}
          onCancel={() => setEditingMovimiento(undefined)}
        />
      )}
    </div>
  );
}
