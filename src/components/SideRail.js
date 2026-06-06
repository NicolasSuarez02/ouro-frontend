import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SideRail — Línea lateral editorial OURO.
 *
 * Gesto de marca sutil: una línea dorada vertical con un punto dorado
 * que pulsa lento y un label "OURO" vertical en el lateral inferior.
 *
 * Visibilidad:
 *   - Desktop wide (≥1440px) — media query en index.css.
 *   - Mobile / tablet / desktop < 1440px → no se ve.
 *   - Solo en rutas editoriales (públicas/declarativas).
 *     NO se muestra en vistas autenticadas, admin, ni operativas
 *     (refinamiento separado en Fase 9 si se quiere).
 *
 * No interfiere con clicks (`pointer-events: none`), no anima de más
 * (un solo pulse en el dot, 4s), respeta `prefers-reduced-motion`.
 *
 * Para usar useLocation, el componente debe estar montado DENTRO del
 * <Router>. Ver App.js.
 */

// Rutas editoriales por coincidencia exacta.
const EDITORIAL_PATHS_EXACT = new Set([
  '/',
  '/terapeutas',
  '/biblioteca',
  '/formaciones',
  '/terminos',
  '/privacidad',
]);

// Rutas editoriales por prefijo (TherapistDetail con slug).
const EDITORIAL_PATHS_PREFIX = ['/terapeutas/'];

const isEditorialPath = (pathname) => {
  if (!pathname) return false;
  if (EDITORIAL_PATHS_EXACT.has(pathname)) return true;
  return EDITORIAL_PATHS_PREFIX.some((p) => pathname.startsWith(p));
};

const SideRail = () => {
  const location = useLocation();
  if (!isEditorialPath(location.pathname)) return null;

  return (
    <aside className="ouro-side-rail" aria-hidden="true">
      <span className="ouro-side-rail__dot" />
      <span className="ouro-side-rail__line" />
      <span className="ouro-side-rail__label">OURO</span>
    </aside>
  );
};

export default SideRail;
