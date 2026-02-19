import { useState } from 'react';
import { mockMantenimientos } from '../../data/mockData';
import { Mantenimiento } from '../../types/database';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react';
import { MantenimientoForm } from '../forms/MantenimientoForm';
import { toast } from 'sonner';

export function MantenimientosTab() {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>(mockMantenimientos);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMantenimiento, setEditingMantenimiento] = useState<Mantenimiento | undefined>();

  const filteredMantenimientos = mantenimientos.filter(
    (mant) =>
      mant.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mant.activo?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mant.usuario?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (mantenimientoData: Partial<Mantenimiento>) => {
    const newMantenimiento: Mantenimiento = {
      id_mantenimiento: mantenimientos.length + 1,
      fecha: mantenimientoData.fecha!,
      descripcion: mantenimientoData.descripcion!,
      id_usuario: mantenimientoData.id_usuario!,
      id_activo: mantenimientoData.id_activo!,
      en_mantenimiento: mantenimientoData.en_mantenimiento!,
      activo: mantenimientoData.activo,
      usuario: mantenimientoData.usuario,
    };
    
    setMantenimientos([...mantenimientos, newMantenimiento]);
    setShowForm(false);
    toast.success('Mantenimiento creado exitosamente');
  };

  const handleUpdate = (mantenimientoData: Partial<Mantenimiento>) => {
    if (!editingMantenimiento) return;

    setMantenimientos(
      mantenimientos.map((mant) =>
        mant.id_mantenimiento === editingMantenimiento.id_mantenimiento
          ? { ...mant, ...mantenimientoData, id_mantenimiento: editingMantenimiento.id_mantenimiento }
          : mant
      )
    );
    setEditingMantenimiento(undefined);
    toast.success('Mantenimiento actualizado exitosamente');
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este mantenimiento?')) {
      setMantenimientos(mantenimientos.filter((mant) => mant.id_mantenimiento !== id));
      toast.success('Mantenimiento eliminado exitosamente');
    }
  };

  const handleEdit = (mantenimiento: Mantenimiento) => {
    setEditingMantenimiento(mantenimiento);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

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
          />
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Mantenimiento
        </Button>
      </div>

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
                  <Badge variant={mant.en_mantenimiento ? 'secondary' : 'default'}>
                    {mant.en_mantenimiento ? 'En Proceso' : 'Completado'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(mant)}
                    >
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
