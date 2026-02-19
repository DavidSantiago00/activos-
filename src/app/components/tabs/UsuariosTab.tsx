import { useState } from 'react';
import { mockUsuarios } from '../../data/mockData';
import { Usuario } from '../../types/database';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Search, Eye, Pencil, Trash2, Mail, Phone } from 'lucide-react';
import { UsuarioForm } from '../forms/UsuarioForm';
import { toast } from 'sonner';

export function UsuariosTab() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | undefined>();

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (usuarioData: Partial<Usuario>) => {
    const newUsuario: Usuario = {
      id_usuario: usuarios.length + 1,
      nombre: usuarioData.nombre!,
      correo: usuarioData.correo!,
      telefono: usuarioData.telefono,
      id: usuarioData.id!,
      id_descripcion_origen: usuarioData.id_descripcion_origen,
    };
    
    setUsuarios([...usuarios, newUsuario]);
    setShowForm(false);
    toast.success('Usuario creado exitosamente');
  };

  const handleUpdate = (usuarioData: Partial<Usuario>) => {
    if (!editingUsuario) return;

    setUsuarios(
      usuarios.map((usuario) =>
        usuario.id_usuario === editingUsuario.id_usuario
          ? { ...usuario, ...usuarioData, id_usuario: editingUsuario.id_usuario }
          : usuario
      )
    );
    setEditingUsuario(undefined);
    toast.success('Usuario actualizado exitosamente');
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      setUsuarios(usuarios.filter((usuario) => usuario.id_usuario !== id));
      toast.success('Usuario eliminado exitosamente');
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Usuario</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Código</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsuarios.map((usuario) => (
              <TableRow key={usuario.id_usuario}>
                <TableCell>#{usuario.id_usuario}</TableCell>
                <TableCell>
                  <div className="font-medium">{usuario.nombre}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{usuario.correo}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {usuario.telefono ? (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{usuario.telefono}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{usuario.id}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(usuario)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(usuario.id_usuario)}
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

      {filteredUsuarios.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron usuarios</p>
        </div>
      )}

      {/* Form Modals */}
      {showForm && (
        <UsuarioForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingUsuario && (
        <UsuarioForm
          usuario={editingUsuario}
          onSubmit={handleUpdate}
          onCancel={() => setEditingUsuario(undefined)}
        />
      )}
    </div>
  );
}
