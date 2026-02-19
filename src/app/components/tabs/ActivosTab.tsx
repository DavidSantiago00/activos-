import { useState } from 'react';
import { mockActivos } from '../../data/mockData';
import { Activo } from '../../types/database';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react';
import { ActivoForm } from '../forms/ActivoForm';
import { toast } from 'sonner';

export function ActivosTab() {
  const [activos, setActivos] = useState<Activo[]>(mockActivos);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingActivo, setEditingActivo] = useState<Activo | undefined>();

  const filteredActivos = activos.filter(
    (activo) =>
      activo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (activoData: Partial<Activo>) => {
    const newActivo: Activo = {
      id_activo: activos.length + 1,
      nombre: activoData.nombre!,
      descripcion: activoData.descripcion,
      codigo: activoData.codigo!,
      fecha: activoData.fecha!,
      id_ubicacion: activoData.id_ubicacion,
      direccion: activoData.direccion,
      ubicacion: activoData.ubicacion,
      tipo_activo: activoData.tipo_activo,
    };
    
    setActivos([...activos, newActivo]);
    setShowForm(false);
    toast.success('Activo creado exitosamente');
  };

  const handleUpdate = (activoData: Partial<Activo>) => {
    if (!editingActivo) return;

    setActivos(
      activos.map((activo) =>
        activo.id_activo === editingActivo.id_activo
          ? { ...activo, ...activoData, id_activo: editingActivo.id_activo }
          : activo
      )
    );
    setEditingActivo(undefined);
    toast.success('Activo actualizado exitosamente');
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este activo?')) {
      setActivos(activos.filter((activo) => activo.id_activo !== id));
      toast.success('Activo eliminado exitosamente');
    }
  };

  const handleEdit = (activo: Activo) => {
    setEditingActivo(activo);
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
            placeholder="Buscar activos por nombre, código o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Activo
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Fecha Alta</TableHead>
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
                    <div className="text-sm">{activo.ubicacion?.ubicacion || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{activo.ubicacion?.direccion}</div>
                  </div>
                </TableCell>
                <TableCell>{formatDate(activo.fecha)}</TableCell>
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
