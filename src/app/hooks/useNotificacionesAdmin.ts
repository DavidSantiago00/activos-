import { useEffect, useState } from 'react';
import { API_ENDPOINTS, get } from '../config/api';
import { NotificacionAdmin } from '../types/database';

export function useNotificacionesAdmin(enabled: boolean) {
  const [notificaciones, setNotificaciones] = useState<NotificacionAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotificaciones = async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      const data = await get<NotificacionAdmin[]>(API_ENDPOINTS.notificaciones_admin);
      setNotificaciones(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando notificaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) {
      setNotificaciones([]);
      return;
    }

    fetchNotificaciones();
    const intervalId = window.setInterval(fetchNotificaciones, 20000);
    return () => window.clearInterval(intervalId);
  }, [enabled]);

  return {
    notificaciones,
    loading,
    error,
    fetchNotificaciones,
  };
}
