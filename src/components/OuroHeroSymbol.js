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
      {/* OUROBOROS — isotipo oficial de OURO (el mismo del loader), SOLO
          CONTORNO (fill: none). Centrado exacto: el centro real del dibujo
          (403.1, 499.5 dentro del viewBox 853) se traslada a (200,200) = el
          ojo, escalado a ~300px. Gira lento con .ouro-seal__spin-vslow. */}
      <g
        transform="translate(17.4 -26.2) scale(0.4529)"
        fill="none"
        stroke="#C6A75E"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.8"
      >
        <path d="M480.97,222.99c-7.87-1.24-15.68-2.96-23.61-3.87-123.8-14.26-233.32,52.71-282.88,164.88-20.74,46.95-19.29,108.49-5.22,157.22,49.22,170.45,259.65,248.97,409.03,151.59,117.46-76.57,152.66-234.82,74.1-352.72-7.7-11.55-18.25-25.48-28.89-34.11-4.26-3.46-10.18-5.04-14.22-7.78-1.28-.87-2.74-1.12-2.3-3.19,7.87-.99,14.13,4.9,21.97,5.03-.44,4.49-3.54,7.46,2.96,9.52,4.42,1.4,9.1-1.33,11.6.36,78.05,90.72,90.79,220.27,31.63,324.77-108.35,191.38-380.61,189.17-493.58,3.24-109.62-180.41,14.69-416.4,223.92-427.9,16.92-.93,53.66.6,69.54,5.44,3.91,1.19,6.04,3.21,5.94,7.55ZM233.6,662.38c-33.5-32.49-58.91-73.49-71.89-118.62l-9.73-43.76c.7,31.48,7.21,61.87,18.24,91.24,55.5,147.75,234.98,221.58,378.11,150.61,51.93-25.75,98.96-70.15,123.63-122.86-9.31,10.91-16.63,23.34-26.05,34.2-106.47,122.87-298.19,119.84-412.32,9.18Z" />
        <path d="M527.48,258c-6.34-.54-12.41-2.2-18.17-4.83-5.28-2.41-10.02-5.81-14.32-9.69-.38-2.14.77-1.58,2.27-1.28,8.86,1.77,16.94,4.56,26.27,3.83,1.78-.14,3.23.29,4.43-1.54-.03-1.93-12.86-3.35-14.98-4-11.79-3.6-19.92-11.15-27.99-20.01-.49-2.38,1.97-1.62,3.27-1.27,8.59,2.36,18.3,9.85,27.72,8.28-10.9-8.79-22.48-15.86-29.82-28.18-2-3.35-5.56-10.2-6.09-13.91-.39-2.8-1.25-11.18,2.43-11.48,4.15-.34,3.79,3.46,5.48,5.57,5.06,6.32,12.11,13.53,18.53,18.47,7.26,5.58,19.75,11.16,24.91,18.09,2.03,2.73,3.2,6.35,5.59,9.41,11.09,14.2,27.38,16.96,43.46,22.54,2.18-1.66-.19-1.75-.76-2.3-8.15-7.75-21.65-19.54-19.23-31.71,6.55,7.4,12.85,15.95,22.54,19.46,1.72.62,4.66,2.19,5.95.04-11.52-7.86-21.06-15.06-26.47-28.51-2.21-5.49-5.53-21.14-1.99-25.98,4.49-6.13,7.7,11.02,8.63,13.34,8.6,21.3,27.95,24.2,42.5,38,12.8,12.14,9.33,26.52,26.66,36.84,10.69,6.36,26.57,5.59,15.52,22.13-2.84,4.26-12.29,14.96-17.32,15.69-2.91.42-.74-5.36-2-8.02-1.88-3.95-14.22-3.26-18.75-4.25-1.94-.42-4.1-1.3-6.01-1.99-7.42-2.65-21.55-12.31-27.46-13.53-4.71-.98-11.32-.81-12.88,4.75-2.21,7.89,14.12,17.35,19.13,21.99s17.03,20.39,22.9,20.01c3.29-.21,6.75-4.5,10.55-3.97,2.75,4.19-4.89,10.91-8.68,11.77-14.23,3.24-20.51-12.7-28.74-21.37s-23.8-19.04-34.77-22.7c-6.34-2.11-13.95-1.7-18.78-7.22,6.83-2.69,15.81-1.76,22.28-5.71,1.52-.93,2.88-2,.73-3.3-1.61-.97-12.35,1.61-15.51,1.61-8.15,0-18.26-3.31-24.5-8.6l22.05-1.94c2.16-1.09,6.16-.94,7.97-2.03,1.65-1-.11-2.52-.52-2.52-5.12,0-11.02.43-16,0ZM584.47,247.02c-3.45.05,2.26,5.4,2.72,6.27,3.23,6.14,2.3,8.74,9.49,12.51,6.07,3.18,10.96,3.14,16.81-.78,2.81-13.02-13.72-11.86-21.74-14.3-1.84-.56-6.88-3.7-7.29-3.7Z" />
        <path d="M568.98,240.99c-11.11-1.51-22.9-8.97-29.97-17.52-1.42-1.71-3.69-4.27-4.02-6.47.89-.84,20.25,9.08,21.96,10.53,3.77,3.19,8.04,9.91,12.04,13.45Z" />
        <path d="M593.45,253.17c3.1,1.86,17.17,1.98,14.08,7.83-3.94,7.45-20.42-.52-14.08-7.83Z" />
      </g>
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
