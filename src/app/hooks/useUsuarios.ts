import { useEffect, useState } from 'react';
import { API_ENDPOINTS, deleteRequest, get, post, put } from '../config/api';
import { PaginatedResponse, Usuario } from '../types/database';

function parseListResponse<T>(data: PaginatedResponse<T> | T[]): T[] {
  return Array.isArray(data) ? data : data.results;
}

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await get<PaginatedResponse<Usuario> | Usuario[]>(API_ENDPOINTS.usuarios);
      setUsuarios(parseListResponse(data));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching usuarios');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const createUsuario = async (usuario: Partial<Usuario>) => {
    try {
      const newUsuario = await post<Usuario>(API_ENDPOINTS.usuarios, usuario);
      setUsuarios((prev) => [...prev, newUsuario]);
      return newUsuario;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating usuario');
      throw err;
    }
  };

  const updateUsuario = async (id: number, usuario: Partial<Usuario>) => {
    try {
      const updated = await put<Usuario>(`${API_ENDPOINTS.usuarios}${id}/`, usuario);
      setUsuarios((prev) => prev.map((u) => (u.id_usuario === id ? updated : u)));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating usuario');
      throw err;
    }
  };

  const deleteUsuario = async (id: number) => {
    try {
      await deleteRequest(`${API_ENDPOINTS.usuarios}${id}/`);
      setUsuarios((prev) => prev.filter((u) => u.id_usuario !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting usuario');
      throw err;
    }
  };

  return {
    usuarios,
    loading,
    error,
    fetchUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
  };
}
