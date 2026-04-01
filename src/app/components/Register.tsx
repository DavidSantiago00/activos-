import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Lock, Mail, User, Phone, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export function Register({ onSwitchToLogin }: RegisterProps) {
  const { register } = useAuth();
  const rol = "tecnico";
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (!nombre.trim()) {
      setError("El nombre es requerido");
      return;
    }

    if (!correo.trim()) {
      setError("El correo es requerido");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError("Correo inválido");
      return;
    }

    if (!password) {
      setError("La contraseña es requerida");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        nombre,
        correo,
        password,
        telefono,
        rol,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al registrar usuario"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-center">
            Regístrate para acceder al sistema de activos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="nombre"
                  type="text"
                  placeholder="David Santiago Torres"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="correo"
                  type="email"
                  placeholder="tu@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rol">Rol</Label>
              <select
                id="rol"
                value={rol}
                disabled
                className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
              >
                <option value="tecnico">Tecnico</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono (Opcional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="+1234567890"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading
                ? "Registrando..."
                : "Crear Cuenta"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Inicia sesión
                </button>
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
