import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useActivos } from '../hooks/useActivos';
import { useMantenimientos } from '../hooks/useMantenimientos';
import { useMovimientos } from '../hooks/useMovimientos';
import { useUsuarios } from '../hooks/useUsuarios';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Package, 
  Wrench, 
  TrendingUp, 
  Users, 
  LogOut, 
  MapPin,
  Loader,
} from 'lucide-react';
import { ActivosTab } from './tabs/ActivosTab';
import { MantenimientosTab } from './tabs/MantenimientosTab';
import { MovimientosTab } from './tabs/MovimientosTab';
import { UsuariosTab } from './tabs/UsuariosTab';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('activos');
  const { activos, loading: loadingActivos } = useActivos();
  const { mantenimientos, loading: loadingMantenimientos } = useMantenimientos();
  const { movimientos, loading: loadingMovimientos } = useMovimientos();
  const { usuarios, loading: loadingUsuarios } = useUsuarios();

  const loadingStats =
    loadingActivos || loadingMantenimientos || loadingMovimientos || loadingUsuarios;

  const activosCount = activos.length;
  const mantenimientosActivos = mantenimientos.filter(
    (m) => m.estado.toLowerCase() !== 'completado',
  ).length;
  const movimientosRecientes = movimientos.length;
  const usuariosCount = usuarios.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sistema de Activos Fijos</h1>
                <p className="text-sm text-gray-500">Gestión y Control de Activos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.nombre}</p>
                <p className="text-xs text-gray-500">{user?.correo}</p>
              </div>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loadingStats ? <Loader className="h-5 w-5 animate-spin" /> : activosCount}</div>
              <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Mantenimiento</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loadingStats ? <Loader className="h-5 w-5 animate-spin" /> : mantenimientosActivos}</div>
              <p className="text-xs text-muted-foreground">Activos en servicio</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Movimientos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loadingStats ? <Loader className="h-5 w-5 animate-spin" /> : movimientosRecientes}</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loadingStats ? <Loader className="h-5 w-5 animate-spin" /> : usuariosCount}</div>
              <p className="text-xs text-muted-foreground">Usuarios activos</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Datos</CardTitle>
            <CardDescription>
              Administra activos, mantenimientos, movimientos y usuarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="activos">
                  <Package className="h-4 w-4 mr-2" />
                  Activos
                </TabsTrigger>
                <TabsTrigger value="mantenimientos">
                  <Wrench className="h-4 w-4 mr-2" />
                  Mantenimientos
                </TabsTrigger>
                <TabsTrigger value="movimientos">
                  <MapPin className="h-4 w-4 mr-2" />
                  Movimientos
                </TabsTrigger>
                <TabsTrigger value="usuarios">
                  <Users className="h-4 w-4 mr-2" />
                  Usuarios
                </TabsTrigger>
              </TabsList>

              <TabsContent value="activos" className="mt-6">
                <ActivosTab />
              </TabsContent>

              <TabsContent value="mantenimientos" className="mt-6">
                <MantenimientosTab />
              </TabsContent>

              <TabsContent value="movimientos" className="mt-6">
                <MovimientosTab />
              </TabsContent>

              <TabsContent value="usuarios" className="mt-6">
                <UsuariosTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
