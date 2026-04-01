
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useActivos } from '../hooks/useActivos';
import { useMantenimientos } from '../hooks/useMantenimientos';
import { useMovimientos } from '../hooks/useMovimientos';
import { useUsuarios } from '../hooks/useUsuarios';
import { useNotificacionesAdmin } from '../hooks/useNotificacionesAdmin';
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
  Bell,
} from 'lucide-react';
import { ActivosTab } from './tabs/ActivosTab';
import { MantenimientosTab } from './tabs/MantenimientosTab';
import { MovimientosTab } from './tabs/MovimientosTab';
import { UsuariosTab } from './tabs/UsuariosTab';

export function Dashboard() {
  const { user, logout } = useAuth();
  const isTecnico = (user?.rol || '').toLowerCase() === 'tecnico';
  const [activeTab, setActiveTab] = useState('activos');
  const { activos, loading: loadingActivos } = useActivos();
  const { mantenimientos, loading: loadingMantenimientos } = useMantenimientos();
  const { movimientos, loading: loadingMovimientos } = useMovimientos();
  const { usuarios, loading: loadingUsuarios } = useUsuarios();
  const {
    notificaciones,
    loading: loadingNotificaciones,
  } = useNotificacionesAdmin(!isTecnico);

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
                <p className="text-xs inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 mt-0.5">
                  {isTecnico ? 'Técnico' : (user?.rol || 'Usuario')}
                </p>
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
        <div className={`grid grid-cols-1 ${isTecnico ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-6 mb-8`}>
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

          {!isTecnico && (
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
          )}
        </div>

        {/* Main Tabs */}
        {!isTecnico && (
          <Card className="mb-8 border-amber-200 bg-amber-50/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4" />
                Notificaciones de mantenimiento
              </CardTitle>
              <CardDescription>
                Avisos cuando un tecnico reporta un activo arreglado o para baja.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingNotificaciones ? (
                <div className="text-sm text-gray-500">Cargando notificaciones...</div>
              ) : notificaciones.length === 0 ? (
                <div className="text-sm text-gray-500">No hay notificaciones recientes.</div>
              ) : (
                <div className="space-y-2">
                  {notificaciones.slice(0, 4).map((item) => (
                    <div key={item.id} className="rounded-md border bg-white px-3 py-2 text-sm">
                      <div className="font-medium">{item.mensaje}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Tecnico: {item.tecnico || 'N/A'} | Fecha: {item.fecha}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Gestión de Datos</CardTitle>
            <CardDescription>
              {isTecnico
                ? 'Consulta activos, mantenimientos y movimientos'
                : 'Administra activos, mantenimientos, movimientos y usuarios'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className={`grid w-full ${isTecnico ? 'grid-cols-3' : 'grid-cols-4'}`}>
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
                {!isTecnico && (
                  <TabsTrigger value="usuarios">
                    <Users className="h-4 w-4 mr-2" />
                    Usuarios
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="activos" className="mt-6">
                <ActivosTab
                  readOnly={isTecnico}
                  allowCreate={isTecnico ? true : undefined}
                  canResolve={isTecnico}
                />
              </TabsContent>

              <TabsContent value="mantenimientos" className="mt-6">
                <MantenimientosTab
                  readOnly={isTecnico}
                  allowCreate={isTecnico ? true : undefined}
                  canResolve={isTecnico}
                />
              </TabsContent>

              <TabsContent value="movimientos" className="mt-6">
                <MovimientosTab readOnly={isTecnico} allowCreate={true} />
              </TabsContent>

              {!isTecnico && (
                <TabsContent value="usuarios" className="mt-6">
                  <UsuariosTab />
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
