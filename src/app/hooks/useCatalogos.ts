import { useEffect, useState } from 'react';
import { API_ENDPOINTS, get } from '../config/api';
import {
  Area,
  PaginatedResponse,
  TipoActivo,
  TipoMantenimiento,
  Ubicacion,
  Usuario,
  Activo,
} from '../types/database';

function parseListResponse<T>(data: PaginatedResponse<T> | T[]): T[] {
  return Array.isArray(data) ? data : data.results;
}

export function useCatalogos() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [activos, setActivos] = useState<Activo[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [tiposActivos, setTiposActivos] = useState<TipoActivo[]>([]);
  const [tiposMantenimiento, setTiposMantenimiento] = useState<TipoMantenimiento[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalogos = async () => {
    try {
      setLoading(true);
      const [usuariosData, activosData, ubicacionesData, tiposActivosData, tiposMantData, areasData] = await Promise.all([
        get<PaginatedResponse<Usuario> | Usuario[]>(API_ENDPOINTS.usuarios),
        get<PaginatedResponse<Activo> | Activo[]>(API_ENDPOINTS.activos),
        get<PaginatedResponse<Ubicacion> | Ubicacion[]>(API_ENDPOINTS.ubicaciones),
        get<PaginatedResponse<TipoActivo> | TipoActivo[]>(API_ENDPOINTS.tipos_activos),
        get<PaginatedResponse<TipoMantenimiento> | TipoMantenimiento[]>(API_ENDPOINTS.tipos_mantenimiento),
        get<PaginatedResponse<Area> | Area[]>(API_ENDPOINTS.areas),
      ]);

      setUsuarios(parseListResponse(usuariosData));
      setActivos(parseListResponse(activosData));
      setUbicaciones(parseListResponse(ubicacionesData));
      setTiposActivos(parseListResponse(tiposActivosData));
      setTiposMantenimiento(parseListResponse(tiposMantData));
      setAreas(parseListResponse(areasData));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando catalogos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogos();
  }, []);

  return {
    usuarios,
    activos,
    ubicaciones,
    tiposActivos,
    tiposMantenimiento,
    areas,
    loading,
    error,
    fetchCatalogos,
  };
}
