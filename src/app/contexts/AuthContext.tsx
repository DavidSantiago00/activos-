import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthUser, LoginCredentials } from "../types/database";

interface AuthContextType {
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
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

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    // En producción, esto haría una llamada al backend Django
    // POST /api/auth/login
    // const response = await fetch('http://localhost:8000/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials)
    // });
    // const data = await response.json();

    // Mock login para demostración
    if (
      credentials.correo === "admin@activos.com" &&
      credentials.password === "icg082010"
    ) {
      const mockUser: AuthUser = {
        id_usuario: 1,
        nombre: "Administrador",
        correo: credentials.correo,
        telefono: "+1234567890",
        token: "mock-jwt-token-123456",
      };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } else {
      throw new Error("Credenciales inválidas");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading }}
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