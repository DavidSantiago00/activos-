import { useEffect, useState } from 'react';
import { API_ENDPOINTS, deleteRequest, get, post, put } from '../config/api';
import { MovimientoActivo, PaginatedResponse } from '../types/database';

function parseListResponse<T>(data: PaginatedResponse<T> | T[]): T[] {
  return Array.isArray(data) ? data : data.results;
}

export function useMovimientos() {
  const [movimientos, setMovimientos] = useState<MovimientoActivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovimientos = async () => {
    try {
      setLoading(true);
      const data = await get<PaginatedResponse<MovimientoActivo> | MovimientoActivo[]>(
        API_ENDPOINTS.movimientos,
      );
      setMovimientos(parseListResponse(data));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching movimientos');
      setMovimientos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const createMovimiento = async (movimiento: Partial<MovimientoActivo>) => {
    try {
      const created = await post<MovimientoActivo>(API_ENDPOINTS.movimientos, movimiento);
      setMovimientos((prev) => [...prev, created]);
      return created;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating movimiento');
      throw err;
    }
  };

  const updateMovimiento = async (id: number, movimiento: Partial<MovimientoActivo>) => {
    try {
      const updated = await put<MovimientoActivo>(`${API_ENDPOINTS.movimientos}${id}/`, movimiento);
      setMovimientos((prev) => prev.map((m) => (m.id_movimiento === id ? updated : m)));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating movimiento');
      throw err;
    }
  };

  const deleteMovimiento = async (id: number) => {
    try {
      await deleteRequest(`${API_ENDPOINTS.movimientos}${id}/`);
      setMovimientos((prev) => prev.filter((m) => m.id_movimiento !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting movimiento');
      throw err;
    }
  };

  return {
    movimientos,
    loading,
    error,
    fetchMovimientos,
    createMovimiento,
    updateMovimiento,
    deleteMovimiento,
  };
}
