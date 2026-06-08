import React from 'react';

// ---------------------------------------------------------------
// OuroHeroSymbol — Fase 11.G
// Sello astral/alquímico de OURO para el hero. SVG inline (sin imágenes
// raster ni librerías). Composición por capas, animadas con CSS a
// velocidades distintas para una sensación de "respiración / órbita
// ritual" (clases .ouro-seal__* definidas en index.css, que respetan
// prefers-reduced-motion y simplifican el detalle en mobile):
//
//   · dial exterior      → giro lento horario
//   · órbita + cuerpo     → giro antihorario (un punto orbitando)
//   · geometría sagrada   → micro-giro antihorario (hexagrama)
//   · ouróboros           → giro casi imperceptible horario
//   · ojo central         → fijo, con respiración luminosa
//   · destellos astrales  → parpadeo sutil
//
// Paleta: oro viejo / champagne sobre navy (tokens del DS). Decorativo
// (aria-hidden); el contenedor del hero ya lo marca como tal.
// ---------------------------------------------------------------
const OuroHeroSymbol = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 400 400"
    fill="none"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="ouroCoreGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#E0C780" stopOpacity="0.16" />
        <stop offset="45%" stopColor="#C6A75E" stopOpacity="0.05" />
        <stop offset="100%" stopColor="#C6A75E" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="ouroEyeGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#E0C780" stopOpacity="0.85" />
        <stop offset="55%" stopColor="#C6A75E" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#C6A75E" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Brillo central suave */}
    <circle cx="200" cy="200" r="165" fill="url(#ouroCoreGlow)" />

    {/* 1 · Dial exterior — giro lento horario */}
    <g className="ouro-seal__spin-slow">
      <circle cx="200" cy="200" r="196" stroke="#A8842C" strokeWidth="0.75" opacity="0.25" />
      <circle cx="200" cy="200" r="187" stroke="#C6A75E" strokeWidth="0.5" opacity="0.3" />
      <circle cx="200" cy="200" r="182" stroke="#C6A75E" strokeWidth="3" opacity="0.3" pathLength="360" strokeDasharray="0.6 14.4" />
      <circle cx="200" cy="14" r="2.4" fill="#C6A75E" opacity="0.7" />
      <circle cx="386" cy="200" r="2.4" fill="#C6A75E" opacity="0.7" />
      <circle cx="200" cy="386" r="2.4" fill="#C6A75E" opacity="0.7" />
      <circle cx="14" cy="200" r="2.4" fill="#C6A75E" opacity="0.7" />
    </g>

    {/* 2 · Órbita — giro antihorario, con un cuerpo orbitando */}
    <g className="ouro-seal__spin-rev">
      <circle cx="200" cy="200" r="170" stroke="#C6A75E" strokeWidth="0.5" opacity="0.3" pathLength="360" strokeDasharray="1.2 6" />
      <circle cx="200" cy="30" r="5.5" fill="url(#ouroEyeGlow)" />
      <circle cx="200" cy="30" r="2.2" fill="#E0C780" />
    </g>

    {/* 3 · Geometría sagrada — micro-giro antihorario (detalle) */}
    <g className="ouro-seal__spin-geo ouro-seal__detail" stroke="#C6A75E" fill="none">
      <circle cx="200" cy="200" r="96" strokeWidth="0.5" opacity="0.3" />
      <circle cx="200" cy="200" r="58" strokeWidth="0.4" opacity="0.28" />
      <polygon points="116.9,248 200,104 283.1,248" strokeWidth="0.6" opacity="0.32" />
      <polygon points="116.9,152 200,296 283.1,152" strokeWidth="0.6" opacity="0.32" />
    </g>

    {/* 4 · Ouróboros — giro casi imperceptible horario */}
    <g className="ouro-seal__spin-vslow">
      {/* OUROBOROS SIMBÓLICO (sin cabeza literal): anillo casi completo que
          se cierra sobre sí mismo mediante superposición + nodo de encuentro.

          cuerpo: anillo mayor con una pequeña apertura arriba a la derecha */}
      <path d="M299.3 97.1 A143 143 0 1 1 248.9 65.6" stroke="#C6A75E" strokeWidth="5.5" strokeLinecap="round" opacity="0.92" />
      {/* contorno interior fino (vientre) */}
      <path d="M293.8 102.9 A135 135 0 1 1 246.2 73.1" stroke="#A8842C" strokeWidth="0.75" opacity="0.4" />
      {/* segmentación sutil — escamas abstractas (ritmo de serpiente, sin cabeza) */}
      <path d="M299.3 97.1 A143 143 0 1 1 248.9 65.6" stroke="#0B1C2D" strokeWidth="5.5" opacity="0.38" pathLength="320" strokeDasharray="1.3 9.5" />
      {/* extremo que se superpone sobre el otro (el ciclo se encuentra consigo) */}
      <path d="M295.8 85.9 A149 149 0 0 0 231.0 54.3" stroke="#C6A75E" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
      {/* nodo del encuentro (remate simbólico): halo + rombo + centro */}
      <circle cx="237.6" cy="59.9" r="9" fill="none" stroke="#C6A75E" strokeWidth="0.6" opacity="0.4" />
      <path d="M237.6 52.9 L244.6 59.9 L237.6 66.9 L230.6 59.9 Z" fill="#C6A75E" opacity="0.95" />
      <circle cx="237.6" cy="59.9" r="1.5" fill="#0B1C2D" />
    </g>

    {/* 5 · Ojo central — fijo, con respiración luminosa */}
    <g>
      <circle className="ouro-seal__eye-pulse" cx="200" cy="200" r="30" fill="url(#ouroEyeGlow)" />
      <path d="M168 200 Q 200 177 232 200 Q 200 223 168 200 Z" stroke="#C6A75E" strokeWidth="1.1" fill="none" opacity="0.85" />
      <circle cx="200" cy="200" r="13" stroke="#C6A75E" strokeWidth="1" fill="none" opacity="0.9" />
      <circle cx="200" cy="200" r="5.5" fill="#A8842C" />
      <circle cx="200" cy="200" r="2.2" fill="#E0C780" />
      <path d="M160 200 L150 200 M240 200 L250 200" stroke="#C6A75E" strokeWidth="0.8" opacity="0.55" />
    </g>

    {/* 6 · Destellos astrales — parpadeo (detalle) */}
    <g fill="#E0C780" className="ouro-seal__detail">
      <circle className="ouro-seal__spark" style={{ animationDelay: '0s' }} cx="120" cy="120" r="1.6" />
      <circle className="ouro-seal__spark" style={{ animationDelay: '1.3s' }} cx="290" cy="150" r="1.4" />
      <circle className="ouro-seal__spark" style={{ animationDelay: '2.2s' }} cx="150" cy="285" r="1.5" />
      <circle className="ouro-seal__spark" style={{ animationDelay: '0.7s' }} cx="262" cy="276" r="1.3" />
      <circle className="ouro-seal__spark" style={{ animationDelay: '1.8s' }} cx="112" cy="206" r="1.3" />
    </g>
  </svg>
);

export default OuroHeroSymbol;
