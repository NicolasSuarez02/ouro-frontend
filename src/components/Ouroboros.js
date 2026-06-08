import React from 'react';

// ---------------------------------------------------------------
// Ouroboros — Fase 11.F
// Adaptación GEOMÉTRICA y sobria del ouroboros (serpiente que muerde
// su cola, con ojo), inspirada en los grabados alquímicos de
// referencia pero reducida a líneas finas para la decoración del hero.
// Hereda el color de `currentColor` (se tiñe con text-gold) y el
// tamaño/opacidad/giro se controlan por className/style desde el hero.
// ---------------------------------------------------------------
const Ouroboros = ({ className = '', style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 200 200"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Cuerpo: anillo (la serpiente) */}
    <circle cx="100" cy="100" r="72" />
    {/* Banda interior fina — sugiere el grosor del cuerpo (geométrico) */}
    <circle cx="100" cy="100" r="63" strokeWidth="1" opacity="0.45" />
    {/* Cabeza geométrica (triángulo) mordiendo la cola, arriba a la derecha */}
    <path d="M158 58 L185 51 L167 75 Z" fill="currentColor" stroke="none" />
    {/* Ojo */}
    <circle cx="168.5" cy="60.5" r="2.6" fill="#0B1C2D" stroke="none" />
  </svg>
);

export default Ouroboros;
