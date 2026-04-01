import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Activo, Mantenimiento, MovimientoActivo, Usuario } from '../types/database';

function createBaseDoc(title: string) {
  const doc = new jsPDF();
  const generatedAt = new Date().toLocaleString('es-ES');

  doc.setFontSize(16);
  doc.text('Sistema de Activos Fijos', 14, 16);
  doc.setFontSize(12);
  doc.text(title, 14, 24);
  doc.setFontSize(10);
  doc.text(`Generado: ${generatedAt}`, 14, 30);

  return doc;
}

function saveDoc(doc: jsPDF, fileName: string) {
  doc.save(fileName);
}

export function exportActivosGroupReport(activos: Activo[]) {
  const doc = createBaseDoc('Reporte grupal de activos');

  autoTable(doc, {
    startY: 36,
    head: [['Codigo', 'Nombre', 'Tipo', 'Ubicacion', 'Estado']],
    body: activos.map((activo) => [
      activo.codigo,
      activo.nombre,
      activo.tipo_activo?.nombre || 'N/A',
      `${activo.ubicacion?.nombre || 'N/A'} ${activo.ubicacion?.direccion ? `- ${activo.ubicacion.direccion}` : ''}`,
      activo.estado,
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  saveDoc(doc, `reporte-activos-${new Date().getTime()}.pdf`);
}

export function exportActivoIndividualReport(activo: Activo) {
  const doc = createBaseDoc(`Reporte individual de activo #${activo.id_activo}`);

  autoTable(doc, {
    startY: 36,
    body: [
      ['ID', String(activo.id_activo)],
      ['Codigo', activo.codigo],
      ['Nombre', activo.nombre],
      ['Descripcion', activo.descripcion || 'N/A'],
      ['Estado', activo.estado],
      ['Tipo', activo.tipo_activo?.nombre || 'N/A'],
      ['Ubicacion', activo.ubicacion?.nombre || 'N/A'],
      ['Direccion', activo.ubicacion?.direccion || 'N/A'],
    ],
    theme: 'grid',
    styles: { fontSize: 10 },
  });

  saveDoc(doc, `activo-${activo.codigo || activo.id_activo}.pdf`);
}

export function exportMantenimientosGroupReport(mantenimientos: Mantenimiento[]) {
  const doc = createBaseDoc('Reporte grupal de mantenimientos');

  autoTable(doc, {
    startY: 36,
    head: [['ID', 'Activo', 'Usuario', 'Fecha', 'Estado', 'Descripcion']],
    body: mantenimientos.map((mant) => [
      String(mant.id_mantenimiento),
      mant.activo?.nombre || 'N/A',
      mant.usuario?.nombre || 'N/A',
      mant.fecha,
      mant.estado,
      mant.descripcion,
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [16, 185, 129] },
  });

  saveDoc(doc, `reporte-mantenimientos-${new Date().getTime()}.pdf`);
}

export function exportMantenimientoIndividualReport(mantenimiento: Mantenimiento) {
  const doc = createBaseDoc(`Reporte individual de mantenimiento #${mantenimiento.id_mantenimiento}`);

  autoTable(doc, {
    startY: 36,
    body: [
      ['ID', String(mantenimiento.id_mantenimiento)],
      ['Activo', mantenimiento.activo?.nombre || 'N/A'],
      ['Codigo activo', mantenimiento.activo?.codigo || 'N/A'],
      ['Usuario', mantenimiento.usuario?.nombre || 'N/A'],
      ['Fecha', mantenimiento.fecha],
      ['Estado', mantenimiento.estado],
      ['Descripcion', mantenimiento.descripcion || 'N/A'],
    ],
    theme: 'grid',
    styles: { fontSize: 10 },
  });

  saveDoc(doc, `mantenimiento-${mantenimiento.id_mantenimiento}.pdf`);
}

export function exportMovimientosGroupReport(movimientos: MovimientoActivo[]) {
  const doc = createBaseDoc('Reporte grupal de movimientos');

  autoTable(doc, {
    startY: 36,
    head: [['ID', 'Tipo', 'Activo', 'Origen', 'Destino', 'Usuario', 'Fecha']],
    body: movimientos.map((mov) => [
      String(mov.id_movimiento),
      mov.tipo_de_movimiento,
      mov.activo?.nombre || 'N/A',
      mov.ubicacion_origen?.nombre || 'N/A',
      mov.ubicacion_destino?.nombre || 'N/A',
      mov.usuario?.nombre || 'N/A',
      mov.fecha,
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [245, 158, 11] },
  });

  saveDoc(doc, `reporte-movimientos-${new Date().getTime()}.pdf`);
}

export function exportMovimientoIndividualReport(movimiento: MovimientoActivo) {
  const doc = createBaseDoc(`Reporte individual de movimiento #${movimiento.id_movimiento}`);

  autoTable(doc, {
    startY: 36,
    body: [
      ['ID', String(movimiento.id_movimiento)],
      ['Tipo', movimiento.tipo_de_movimiento],
      ['Activo', movimiento.activo?.nombre || 'N/A'],
      ['Codigo activo', movimiento.activo?.codigo || 'N/A'],
      ['Usuario', movimiento.usuario?.nombre || 'N/A'],
      ['Fecha', movimiento.fecha],
      ['Ubicacion origen', movimiento.ubicacion_origen?.nombre || 'N/A'],
      ['Ubicacion destino', movimiento.ubicacion_destino?.nombre || 'N/A'],
      ['Descripcion', movimiento.descripcion || 'N/A'],
    ],
    theme: 'grid',
    styles: { fontSize: 10 },
  });

  saveDoc(doc, `movimiento-${movimiento.id_movimiento}.pdf`);
}

export function exportUsuariosGroupReport(usuarios: Usuario[]) {
  const doc = createBaseDoc('Reporte grupal de usuarios');

  autoTable(doc, {
    startY: 36,
    head: [['ID', 'Nombre', 'Correo', 'Telefono', 'Rol', 'Estado']],
    body: usuarios.map((usuario) => [
      String(usuario.id_usuario),
      usuario.nombre,
      usuario.correo,
      usuario.telefono || 'N/A',
      usuario.rol || 'N/A',
      usuario.estado || 'activo',
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [99, 102, 241] },
  });

  saveDoc(doc, `reporte-usuarios-${new Date().getTime()}.pdf`);
}

export function exportUsuarioIndividualReport(usuario: Usuario) {
  const doc = createBaseDoc(`Reporte individual de usuario #${usuario.id_usuario}`);

  autoTable(doc, {
    startY: 36,
    body: [
      ['ID', String(usuario.id_usuario)],
      ['Nombre', usuario.nombre],
      ['Correo', usuario.correo],
      ['Telefono', usuario.telefono || 'N/A'],
      ['Rol', usuario.rol || 'N/A'],
      ['Estado', usuario.estado || 'activo'],
    ],
    theme: 'grid',
    styles: { fontSize: 10 },
  });

  saveDoc(doc, `usuario-${usuario.id_usuario}.pdf`);
}
