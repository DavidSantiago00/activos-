import { useState } from 'react';
import { useUsuarios } from '../../hooks/useUsuarios';
import { Usuario } from '../../types/database';
import { exportUsuarioIndividualReport, exportUsuariosGroupReport } from '../../utils/pdfReports';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Search, Pencil, Trash2, Mail, Phone, Loader, FileText } from 'lucide-react';
import { UsuarioForm } from '../forms/UsuarioForm';
import { toast } from 'sonner';

export function UsuariosTab() {
  const { usuarios, loading, error, createUsuario, updateUsuario, deleteUsuario } = useUsuarios();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | undefined>();

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (usuarioData: Partial<Usuario>) => {
    try {
      await createUsuario(usuarioData);
      setShowForm(false);
      toast.success('Usuario creado exitosamente');
    } catch (err) {
      toast.error('Error al crear usuario');
      console.error(err);
    }
  };

  const handleUpdate = async (usuarioData: Partial<Usuario>) => {
    if (!editingUsuario) return;

    try {
      await updateUsuario(editingUsuario.id_usuario, usuarioData);
      setEditingUsuario(undefined);
      toast.success('Usuario actualizado exitosamente');
    } catch (err) {
      toast.error('Error al actualizar usuario');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await deleteUsuario(id);
        toast.success('Usuario eliminado exitosamente');
      } catch (err) {
        toast.error('Error al eliminar usuario');
        console.error(err);
      }
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
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
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={loading}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportUsuariosGroupReport(filteredUsuarios)}
            disabled={loading || filteredUsuarios.length === 0}
          >
            <FileText className="h-4 w-4 mr-2" />
            Reporte PDF
          </Button>
          <Button onClick={() => setShowForm(true)} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Cargando usuarios...</span>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Usuario</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
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
                    <Badge variant="outline">{usuario.rol}</Badge>
                  </TableCell>
                  <TableCell>{usuario.estado || 'activo'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => exportUsuarioIndividualReport(usuario)}
                        title="Generar reporte individual"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(usuario)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(usuario.id_usuario)}>
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
