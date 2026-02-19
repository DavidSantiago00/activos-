import { useState } from 'react';
import { mockMovimientos } from '../../data/mockData';
import { MovimientoActivo } from '../../types/database';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react';
import { MovimientoForm } from '../forms/MovimientoForm';
import { toast } from 'sonner';

export function MovimientosTab() {
  const [movimientos, setMovimientos] = useState<MovimientoActivo[]>(mockMovimientos);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMovimiento, setEditingMovimiento] = useState<MovimientoActivo | undefined>();

  const filteredMovimientos = movimientos.filter(
    (mov) =>
      mov.tipo_de_movimiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.activo?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.usuario?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.descripcion_destino?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (movimientoData: Partial<MovimientoActivo>) => {
    const newMovimiento: MovimientoActivo = {
      id_movimiento: movimientos.length + 1,
      tipo_de_movimiento: movimientoData.tipo_de_movimiento!,
      fecha: movimientoData.fecha!,
      id_usuario: movimientoData.id_usuario!,
      id_activo: movimientoData.id_activo!,
      descripcion_destino: movimientoData.descripcion_destino,
      activo: movimientoData.activo,
      usuario: movimientoData.usuario,
    };
    
    setMovimientos([...movimientos, newMovimiento]);
    setShowForm(false);
    toast.success('Movimiento registrado exitosamente');
  };

  const handleUpdate = (movimientoData: Partial<MovimientoActivo>) => {
    if (!editingMovimiento) return;

    setMovimientos(
      movimientos.map((mov) =>
        mov.id_movimiento === editingMovimiento.id_movimiento
          ? { ...mov, ...movimientoData, id_movimiento: editingMovimiento.id_movimiento }
          : mov
      )
    );
    setEditingMovimiento(undefined);
    toast.success('Movimiento actualizado exitosamente');
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este movimiento?')) {
      setMovimientos(movimientos.filter((mov) => mov.id_movimiento !== id));
      toast.success('Movimiento eliminado exitosamente');
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
          />
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Movimiento
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Activo</TableHead>
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
                  <Badge variant={getTipoColor(mov.tipo_de_movimiento)}>
                    {mov.tipo_de_movimiento}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{mov.activo?.nombre}</div>
                    <div className="text-sm text-gray-500">{mov.activo?.codigo}</div>
                  </div>
                </TableCell>
                <TableCell>{mov.descripcion_destino || 'N/A'}</TableCell>
                <TableCell>{mov.usuario?.nombre}</TableCell>
                <TableCell>{formatDate(mov.fecha)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(mov)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(mov.id_movimiento)}
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
