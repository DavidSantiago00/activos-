/// <reference types="vite/client" />

// API Configuration
// Vite expone las variables de entorno que comienzan con VITE_
const API_URL: string = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Autenticación
  login: `${API_URL}/api/auth/login/`,
  register: `${API_URL}/api/auth/register/`,
  refresh: `${API_URL}/api/auth/refresh/`,

  // Usuarios
  usuarios: `${API_URL}/api/usuarios/`,
  
  // Activos
  activos: `${API_URL}/api/activos/`,
  tipos_activos: `${API_URL}/api/tipos-activos/`,
  
  // Ubicaciones
  ubicaciones: `${API_URL}/api/ubicaciones/`,
  areas: `${API_URL}/api/areas/`,
  
  // Mantenimientos
  mantenimientos: `${API_URL}/api/mantenimientos/`,
  tipos_mantenimiento: `${API_URL}/api/tipos-mantenimiento/`,
  
  // Movimientos
  movimientos: `${API_URL}/api/movimientos/`,
};

export const HEADERS = {
  'Content-Type': 'application/json',
};

/**
 * Obtener headers de autorización con JWT token
 */
export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('access_token');
  const headers: Record<string, string> = { ...HEADERS };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Función helper para hacer fetch con manejo de errores
 */
export async function fetchAPI<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

/**
 * GET request
 */
export async function get<T>(url: string): Promise<T> {
  return fetchAPI<T>(url, { method: 'GET' });
}

/**
 * POST request
 */
export async function post<T>(url: string, data: any): Promise<T> {
  return fetchAPI<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT request
 */
export async function put<T>(url: string, data: any): Promise<T> {
  return fetchAPI<T>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request
 */
export async function deleteRequest<T>(url: string): Promise<T> {
  return fetchAPI<T>(url, { method: 'DELETE' });
}
