import { useState, useEffect } from 'react';
import { Activo, PaginatedResponse } from '../types/database';
import { API_ENDPOINTS, get, post, put, deleteRequest } from '../config/api';

function parseListResponse<T>(data: PaginatedResponse<T> | T[]): T[] {
  return Array.isArray(data) ? data : data.results;
}

/**
 * Hook para obtener lista de activos
 */
export function useActivos() {
  const [activos, setActivos] = useState<Activo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivos();
  }, []);

  const fetchActivos = async () => {
    try {
      setLoading(true);
      const data = await get<PaginatedResponse<Activo> | Activo[]>(API_ENDPOINTS.activos);
      setActivos(parseListResponse(data));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching activos');
      setActivos([]);
    } finally {
      setLoading(false);
    }
  };

  const createActivo = async (activo: Partial<Activo>) => {
    try {
      const newActivo = await post<Activo>(API_ENDPOINTS.activos, activo);
      setActivos((prev) => [...prev, newActivo]);
      return newActivo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating activo');
      throw err;
    }
  };

  const updateActivo = async (id: number, activo: Partial<Activo>) => {
    try {
      const updated = await put<Activo>(
        `${API_ENDPOINTS.activos}${id}/`,
        activo
      );
      setActivos((prev) => prev.map((a) => (a.id_activo === id ? updated : a)));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating activo');
      throw err;
    }
  };

  const deleteActivo = async (id: number) => {
    try {
      await deleteRequest(`${API_ENDPOINTS.activos}${id}/`);
      setActivos((prev) => prev.filter((a) => a.id_activo !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting activo');
      throw err;
    }
  };

  return {
    activos,
    loading,
    error,
    fetchActivos,
    createActivo,
    updateActivo,
    deleteActivo,
  };
}
