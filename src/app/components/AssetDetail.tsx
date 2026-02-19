import { Asset, AssetCategory, AssetStatus } from '../types/asset';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';

interface AssetDetailProps {
  asset: Asset;
  onClose: () => void;
}

const categoryLabels: Record<AssetCategory, string> = {
  equipos_computo: 'Equipos de Cómputo',
  mobiliario: 'Mobiliario',
  vehiculos: 'Vehículos',
  maquinaria: 'Maquinaria',
  herramientas: 'Herramientas',
  otros: 'Otros',
};

const statusConfig: Record<AssetStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  activo: { label: 'Activo', variant: 'default' },
  en_mantenimiento: { label: 'En Mantenimiento', variant: 'secondary' },
  inactivo: { label: 'Inactivo', variant: 'outline' },
  dado_de_baja: { label: 'Dado de Baja', variant: 'destructive' },
};

export function AssetDetail({ asset, onClose }: AssetDetailProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const depreciation = asset.valorCompra - asset.valorActual;
  const depreciationPercent = ((depreciation / asset.valorCompra) * 100).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold">{asset.nombre}</h2>
            <p className="text-sm text-gray-500 mt-1">{asset.codigo}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Estado y Categoría */}
            <div className="flex gap-3">
              <Badge variant={statusConfig[asset.estado].variant} className="px-3 py-1">
                {statusConfig[asset.estado].label}
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                {categoryLabels[asset.categoria]}
              </Badge>
            </div>

            {/* Descripción */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Descripción</h3>
              <p className="text-gray-900">{asset.descripcion}</p>
            </div>

            {/* Información General */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">Información General</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="font-medium">{asset.ubicacion}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Responsable</p>
                  <p className="font-medium">{asset.responsable}</p>
                </div>
              </div>
            </div>

            {/* Información Financiera */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">Información Financiera</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Fecha de Compra</p>
                  <p className="font-medium">{formatDate(asset.fechaCompra)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor de Compra</p>
                  <p className="font-medium text-green-600">{formatCurrency(asset.valorCompra)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor Actual</p>
                  <p className="font-medium text-blue-600">{formatCurrency(asset.valorActual)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Depreciación</p>
                  <p className="font-medium text-red-600">
                    {formatCurrency(depreciation)} ({depreciationPercent}%)
                  </p>
                </div>
              </div>
            </div>

            {/* Detalles Técnicos */}
            {(asset.marca || asset.modelo || asset.numeroSerie || asset.proveedor) && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3">Detalles Técnicos</h3>
                <div className="grid grid-cols-2 gap-4">
                  {asset.marca && (
                    <div>
                      <p className="text-sm text-gray-500">Marca</p>
                      <p className="font-medium">{asset.marca}</p>
                    </div>
                  )}
                  {asset.modelo && (
                    <div>
                      <p className="text-sm text-gray-500">Modelo</p>
                      <p className="font-medium">{asset.modelo}</p>
                    </div>
                  )}
                  {asset.numeroSerie && (
                    <div>
                      <p className="text-sm text-gray-500">Número de Serie</p>
                      <p className="font-medium">{asset.numeroSerie}</p>
                    </div>
                  )}
                  {asset.proveedor && (
                    <div>
                      <p className="text-sm text-gray-500">Proveedor</p>
                      <p className="font-medium">{asset.proveedor}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Garantía */}
            {asset.garantia && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Garantía</h3>
                <p className="font-medium">Válida hasta: {formatDate(asset.garantia)}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end p-6 border-t">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  );
}
