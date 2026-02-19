import { Asset, AssetCategory, AssetStatus } from '../types/asset';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Pencil, Trash2, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface AssetListProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
  onView: (asset: Asset) => void;
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

export function AssetList({ assets, onEdit, onDelete, onView }: AssetListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (assets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se encontraron activos fijos</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead>Valor Actual</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>{asset.codigo}</TableCell>
              <TableCell>
                <div>
                  <div>{asset.nombre}</div>
                  {asset.marca && (
                    <div className="text-sm text-gray-500">
                      {asset.marca} {asset.modelo}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>{categoryLabels[asset.categoria]}</TableCell>
              <TableCell>{asset.ubicacion}</TableCell>
              <TableCell>{asset.responsable}</TableCell>
              <TableCell>{formatCurrency(asset.valorActual)}</TableCell>
              <TableCell>
                <Badge variant={statusConfig[asset.estado].variant}>
                  {statusConfig[asset.estado].label}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(asset)}
                    title="Ver detalles"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(asset)}
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(asset.id)}
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
