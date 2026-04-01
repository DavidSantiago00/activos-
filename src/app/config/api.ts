/// <reference types="vite/client" />

import type { PaginatedResponse } from '../types/database';

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
  notificaciones_admin: `${API_URL}/api/mantenimientos/notificaciones-admin/`,
  tipos_mantenimiento: `${API_URL}/api/tipos-mantenimiento/`,
  
  // Movimientos
  movimientos: `${API_URL}/api/movimientos/`,
};

export const HEADERS = {
  'Content-Type': 'application/json',
};

function getStoredAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

function getStoredRefreshToken(): string | null {
  return localStorage.getItem('refresh_token');
}

function clearStoredAuth(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}

/**
 * Obtener headers de autorización con JWT token
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getStoredAccessToken();
  const headers: Record<string, string> = { ...HEADERS };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getStoredRefreshToken();

  if (!refreshToken) {
    clearStoredAuth();
    return null;
  }

  const response = await fetch(API_ENDPOINTS.refresh, {
    method: 'POST',
    headers: { ...HEADERS },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    clearStoredAuth();
    return null;
  }

  const responseData = (await response.json()) as {
    access_token?: string;
  };

  const newAccessToken = responseData.access_token;
  if (!newAccessToken) {
    clearStoredAuth();
    return null;
  }

  localStorage.setItem('access_token', newAccessToken);
  return newAccessToken;
}

function buildHeadersWithToken(
  options?: RequestInit,
  accessToken?: string,
): HeadersInit {
  const authHeaders = { ...HEADERS } as Record<string, string>;

  if (accessToken) {
    authHeaders.Authorization = `Bearer ${accessToken}`;
  }

  return {
    ...authHeaders,
    ...options?.headers,
  };
}

/**
 * Función helper para hacer fetch con manejo de errores
 */
export async function fetchAPI<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    let accessToken = getStoredAccessToken();
    let response = await fetch(url, {
      ...options,
      headers: buildHeadersWithToken(options, accessToken || undefined),
    });

    // If the access token expired, refresh it and retry once.
    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        accessToken = newAccessToken;
        response = await fetch(url, {
          ...options,
          headers: buildHeadersWithToken(options, accessToken),
        });
      }
    }

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API error ${response.status}: ${errorBody || response.statusText}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    const text = await response.text();
    return (text ? JSON.parse(text) : {}) as T;
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
 * GET paginado: recorre todas las páginas y concatena resultados.
 */
export async function getAllPages<T>(url: string): Promise<T[]> {
  const allItems: T[] = [];
  let nextUrl: string | null = url;

  while (nextUrl) {
    const data = await get<PaginatedResponse<T> | T[]>(nextUrl);

    if (Array.isArray(data)) {
      allItems.push(...data);
      break;
    }

    allItems.push(...data.results);
    nextUrl = data.next;
  }

  return allItems;
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
