import { useState, useEffect } from 'react';
import { Mantenimiento, PaginatedResponse } from '../types/database';
import { API_ENDPOINTS, get, post, put, deleteRequest } from '../config/api';

function parseListResponse<T>(data: PaginatedResponse<T> | T[]): T[] {
  return Array.isArray(data) ? data : data.results;
}

/**
 * Hook para obtener lista de mantenimientos
 */
export function useMantenimientos() {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMantenimientos();
  }, []);

  const fetchMantenimientos = async () => {
    try {
      setLoading(true);
      const data = await get<PaginatedResponse<Mantenimiento> | Mantenimiento[]>(
        API_ENDPOINTS.mantenimientos,
      );
      setMantenimientos(parseListResponse(data));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching mantenimientos');
      setMantenimientos([]);
    } finally {
      setLoading(false);
    }
  };

  const createMantenimiento = async (mantenimiento: Partial<Mantenimiento>) => {
    try {
      const newMantenimiento = await post<Mantenimiento>(
        API_ENDPOINTS.mantenimientos,
        mantenimiento
      );
      setMantenimientos((prev) => [...prev, newMantenimiento]);
      return newMantenimiento;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating mantenimiento');
      throw err;
    }
  };

  const updateMantenimiento = async (
    id: number,
    mantenimiento: Partial<Mantenimiento>
  ) => {
    try {
      const updated = await put<Mantenimiento>(
        `${API_ENDPOINTS.mantenimientos}${id}/`,
        mantenimiento
      );
      setMantenimientos((prev) => prev.map((m) => (m.id_mantenimiento === id ? updated : m)));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating mantenimiento');
      throw err;
    }
  };

  const resolverMantenimiento = async (
    id: number,
    payload: { resultado: 'arreglado' | 'baja'; comentario?: string }
  ) => {
    try {
      const response = await post<{ message: string }>(
        `${API_ENDPOINTS.mantenimientos}${id}/resolver/`,
        payload
      );
      await fetchMantenimientos();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error resolviendo mantenimiento');
      throw err;
    }
  };

  const deleteMantenimiento = async (id: number) => {
    try {
      await deleteRequest(`${API_ENDPOINTS.mantenimientos}${id}/`);
      setMantenimientos((prev) => prev.filter((m) => m.id_mantenimiento !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting mantenimiento');
      throw err;
    }
  };

  return {
    mantenimientos,
    loading,
    error,
    fetchMantenimientos,
    createMantenimiento,
    updateMantenimiento,
    resolverMantenimiento,
    deleteMantenimiento,
  };
}
