import { useState } from 'react';
import { useMantenimientos } from '../../hooks/useMantenimientos';
import { Mantenimiento } from '../../types/database';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Search, Pencil, Trash2, Loader } from 'lucide-react';
import { MantenimientoForm } from '../forms/MantenimientoForm';
import { toast } from 'sonner';

export function MantenimientosTab() {
  const {
    mantenimientos,
    loading,
    error,
    createMantenimiento,
    updateMantenimiento,
    deleteMantenimiento,
  } = useMantenimientos();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
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

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este mantenimiento?')) {
      try {
        await deleteMantenimiento(id);
        toast.success('Mantenimiento eliminado exitosamente');
      } catch (err) {
        toast.error('Error al eliminar mantenimiento');
        console.error(err);
      }
    }
  };

  const handleEdit = (mantenimiento: Mantenimiento) => {
    setEditingMantenimiento(mantenimiento);
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
        <Button onClick={() => setShowForm(true)} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Mantenimiento
        </Button>
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
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(mant)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(mant.id_mantenimiento)}
                      >
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

      {filteredMantenimientos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron mantenimientos</p>
        </div>
      )}

      {/* Form Modals */}
      {showForm && (
        <MantenimientoForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingMantenimiento && (
        <MantenimientoForm
          mantenimiento={editingMantenimiento}
          onSubmit={handleUpdate}
          onCancel={() => setEditingMantenimiento(undefined)}
        />
      )}
    </div>
  );
}
