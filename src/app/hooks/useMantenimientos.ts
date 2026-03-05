import { useState, useEffect } from 'react';
import { Mantenimiento } from '../types/database';
import { API_ENDPOINTS, get, post, put, deleteRequest } from '../config/api';

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
      const data = await get<any>(API_ENDPOINTS.mantenimientos);
      setMantenimientos(data.results || data);
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
      setMantenimientos([...mantenimientos, newMantenimiento]);
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
      setMantenimientos(
        mantenimientos.map(m => m.id_mantenimiento === id ? updated : m)
      );
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating mantenimiento');
      throw err;
    }
  };

  const deleteMantenimiento = async (id: number) => {
    try {
      await deleteRequest(`${API_ENDPOINTS.mantenimientos}${id}/`);
      setMantenimientos(
        mantenimientos.filter(m => m.id_mantenimiento !== id)
      );
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
    deleteMantenimiento,
  };
}
