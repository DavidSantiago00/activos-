import { useState } from 'react';
import { Usuario } from '../../types/database';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { X } from 'lucide-react';

interface UsuarioFormProps {
  usuario?: Usuario;
  onSubmit: (usuario: Partial<Usuario>) => void;
  onCancel: () => void;
}

export function UsuarioForm({ usuario, onSubmit, onCancel }: UsuarioFormProps) {
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    correo: usuario?.correo || '',
    telefono: usuario?.telefono || '',
    id: usuario?.id || '',
    id_descripcion_origen: usuario?.id_descripcion_origen?.toString() || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const usuarioData: Partial<Usuario> = {
      ...usuario,
      nombre: formData.nombre,
      correo: formData.correo,
      telefono: formData.telefono || undefined,
      id: formData.id,
      id_descripcion_origen: formData.id_descripcion_origen 
        ? parseInt(formData.id_descripcion_origen) 
        : undefined,
    };

    onSubmit(usuarioData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nombre">Nombre Completo *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                required
                placeholder="Juan Pérez García"
              />
            </div>

            {/* ID / Código de Usuario */}
            <div className="space-y-2">
              <Label htmlFor="id">Código de Usuario *</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => handleChange('id', e.target.value)}
                required
                placeholder="USR001"
              />
            </div>

            {/* Correo */}
            <div className="space-y-2">
              <Label htmlFor="correo">Correo Electrónico *</Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) => handleChange('correo', e.target.value)}
                required
                placeholder="usuario@empresa.com"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                placeholder="+1234567890"
              />
            </div>

            {/* ID Descripción Origen */}
            <div className="space-y-2">
              <Label htmlFor="id_descripcion_origen">ID Descripción Origen</Label>
              <Input
                id="id_descripcion_origen"
                type="number"
                value={formData.id_descripcion_origen}
                onChange={(e) => handleChange('id_descripcion_origen', e.target.value)}
                placeholder="Opcional"
              />
              <p className="text-xs text-gray-500">
                Referencia a la descripción de origen del usuario
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {usuario ? 'Actualizar' : 'Crear'} Usuario
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
