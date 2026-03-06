import { useState } from 'react';
import { useActivos } from '../../hooks/useActivos';
import { Activo } from '../../types/database';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Search, Pencil, Trash2, Loader } from 'lucide-react';
import { ActivoForm } from '../forms/ActivoForm';
import { toast } from 'sonner';

export function ActivosTab() {
  const { activos, loading, error, createActivo, updateActivo, deleteActivo } = useActivos();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingActivo, setEditingActivo] = useState<Activo | undefined>();

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

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este activo?')) {
      try {
        await deleteActivo(id);
        toast.success('Activo eliminado exitosamente');
      } catch (err) {
        toast.error('Error al eliminar el activo');
        console.error(err);
      }
    }
  };

  const handleEdit = (activo: Activo) => {
    setEditingActivo(activo);
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
        <Button onClick={() => setShowForm(true)} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Activo
        </Button>
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
                          onClick={() => handleEdit(activo)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(activo.id_activo)}
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

          {filteredActivos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron activos</p>
            </div>
          )}
        </>
      )}

      {/* Form Modals */}
      {showForm && (
        <ActivoForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingActivo && (
        <ActivoForm
          activo={editingActivo}
          onSubmit={handleUpdate}
          onCancel={() => setEditingActivo(undefined)}
        />
      )}
    </div>
  );
}
