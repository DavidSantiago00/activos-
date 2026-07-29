import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthUser, LoginCredentials } from "../types/database";
import { API_ENDPOINTS } from "../config/api";

interface AuthContextType {
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface RegisterData {
  nombre: string;
  correo: string;
  password: string;
  telefono?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("access_token");
    
    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: credentials.correo,
          password: credentials.password,
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fallo la autenticación');
      }

      const data = await response.json();
      
      if (data.access_token && data.user) {
        const user: AuthUser = {
          id_usuario: data.user.id_usuario,
          nombre: data.user.nombre,
          correo: data.user.correo,
          telefono: data.user.telefono || '',
          token: data.access_token,
        };
        
        setUser(user);
        setIsAuthenticated(true);
        
        // Store tokens and user
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token || '');
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de autenticación';
      setIsAuthenticated(false);
      throw new Error(errorMessage);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch(API_ENDPOINTS.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.nombre,
          correo: data.correo,
          password: data.password,
          telefono: data.telefono || '',
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrar usuario');
      }

      const responseData = await response.json();
      
      if (responseData.access_token && responseData.user) {
        const user: AuthUser = {
          id_usuario: responseData.user.id_usuario,
          nombre: responseData.user.nombre,
          correo: responseData.user.correo,
          telefono: responseData.user.telefono || '',
          token: responseData.access_token,
        };
        
        setUser(user);
        setIsAuthenticated(true);
        
        // Store tokens and user
        localStorage.setItem("access_token", responseData.access_token);
        localStorage.setItem("refresh_token", responseData.refresh_token || '');
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar usuario';
      setIsAuthenticated(false);
      throw new Error(errorMessage);
    }
  };

  function logout() {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isLoading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider",
    );
  }
  return context;
}