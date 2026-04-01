import { useEffect, useState } from 'react';
import { API_ENDPOINTS, getAllPages } from '../config/api';
import {
  Area,
  TipoActivo,
  TipoMantenimiento,
  Ubicacion,
  Usuario,
  Activo,
} from '../types/database';

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
        getAllPages<Usuario>(API_ENDPOINTS.usuarios),
        getAllPages<Activo>(API_ENDPOINTS.activos),
        getAllPages<Ubicacion>(API_ENDPOINTS.ubicaciones),
        getAllPages<TipoActivo>(API_ENDPOINTS.tipos_activos),
        getAllPages<TipoMantenimiento>(API_ENDPOINTS.tipos_mantenimiento),
        getAllPages<Area>(API_ENDPOINTS.areas),
      ]);

      setUsuarios(usuariosData);
      setActivos(activosData);
      setUbicaciones(ubicacionesData);
      setTiposActivos(tiposActivosData);
      setTiposMantenimiento(tiposMantData);
      setAreas(areasData);
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
