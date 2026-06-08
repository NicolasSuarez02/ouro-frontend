import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ---------------------------------------------------------------
// FounderCard — Fase 11.B
// Tarjeta del Equipo Fundador con tratamiento editorial de foto:
//
//   Reposo:  foto rectangular en blanco y negro ocupando la parte
//            superior, difuminándose hacia abajo (scrim a navy) para
//            que se lea el resto de la card (rótulo, nombre, bio, link).
//   Hover:   la foto pasa a color y ocupa toda la card; el rótulo, la
//            bio y el link se desvanecen; el NOMBRE se mantiene, baja
//            apenas y queda legible sobre la foto (text-shadow + scrim
//            inferior). Se conservan los hovers OURO de la card
//            (línea dorada superior, despegue, sombra, borde).
//
// Si todavía no hay foto (o falla la carga), cae con elegancia a la
// inicial gigante dorada (look actual), sin imágenes rotas.
// La foto se busca en public/equipo/<archivo> (prop `photo`).
// ---------------------------------------------------------------
const FounderCard = ({ f }) => {
  const [imgError, setImgError] = useState(false);
  const hasPhoto = Boolean(f.photo) && !imgError;
  const photoSrc = `${process.env.PUBLIC_URL}/equipo/${f.photo}`;

  // ── Fallback: inicial gigante (mientras no haya foto) ──
  if (!hasPhoto) {
    return (
      <article className="group relative bg-gradient-to-b from-navy-soft to-navy border border-gold-faint px-8 pt-9 pb-10 transition-all duration-600 ease-expo-out hover:-translate-y-3 hover:border-gold-dim hover:shadow-card-hover overflow-hidden">
        <span
          className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-800 ease-expo-out"
          aria-hidden="true"
        />
        {/* Carga oculta: si la foto existe activa el modo foto en el próximo render */}
        {f.photo && (
          <img src={photoSrc} alt="" aria-hidden="true" className="hidden" onError={() => setImgError(true)} onLoad={() => setImgError(false)} />
        )}
        <span className="founder-decoration" aria-hidden="true" />
        <div className="text-center mb-6">
          <span
            className="font-serif italic font-light bg-gold-gradient bg-clip-text text-transparent inline-block leading-none"
            style={{ fontSize: 'clamp(120px, 14vw, 180px)' }}
            aria-hidden="true"
          >
            {f.initial}
          </span>
        </div>
        <p className="font-sans text-[10px] uppercase tracking-eyebrow-wide text-gold-dim text-center mb-3">
          {f.role}
        </p>
        <h3 className="font-serif font-light text-3xl text-white text-center mb-4">
          {f.name}
        </h3>
        <p className="font-serif font-light text-base text-white-dim leading-relaxed text-center mb-8">
          {f.desc}
        </p>
        <div className="text-center">
          <Link
            to="/terapeutas"
            className="inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold hover:text-gold-bright transition-colors duration-300"
          >
            <span>Ver terapeutas</span>
            <span className="transition-transform duration-400 ease-expo-out group-hover:translate-x-2">→</span>
          </Link>
        </div>
      </article>
    );
  }

  // ── Modo foto: tratamiento editorial B&N → color ──
  return (
    <article className="group relative h-[440px] sm:h-[460px] overflow-hidden bg-navy border border-gold-faint transition-all duration-600 ease-expo-out hover:-translate-y-3 hover:border-gold-dim hover:shadow-card-hover">
      {/* Línea superior dorada */}
      <span
        className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-800 ease-expo-out z-20"
        aria-hidden="true"
      />

      {/* Foto full-bleed: B&N → color, leve zoom en hover */}
      <img
        src={photoSrc}
        alt={`${f.name}, ${f.role.toLowerCase()} de OURO`}
        onError={() => setImgError(true)}
        className="absolute inset-0 w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-[900ms] ease-expo-out"
      />

      {/* Scrim reposo: foto arriba, navy abajo (para leer el texto) */}
      <div
        className="absolute inset-0 opacity-100 group-hover:opacity-0 transition-opacity duration-700 ease-expo-out"
        style={{ background: 'linear-gradient(to bottom, rgba(11,28,45,0) 0%, rgba(11,28,45,0.10) 38%, rgba(11,28,45,0.92) 70%, #0B1C2D 100%)' }}
        aria-hidden="true"
      />
      {/* Scrim hover: solo base, para que el nombre se distinga sobre la foto */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-expo-out"
        style={{ background: 'linear-gradient(to bottom, rgba(11,28,45,0) 55%, rgba(6,19,32,0.80) 100%)' }}
        aria-hidden="true"
      />

      {/* Contenido inferior */}
      <div className="absolute inset-x-0 bottom-0 px-8 pb-8 text-center z-10">
        <p className="font-sans text-[10px] uppercase tracking-eyebrow-wide text-gold-dim mb-3 transition-opacity duration-300 group-hover:opacity-0">
          {f.role}
        </p>
        <h3 className="font-serif font-light text-3xl text-white mb-4 transition-all duration-500 ease-expo-out group-hover:translate-y-1.5 group-hover:[text-shadow:0_2px_14px_rgba(0,0,0,0.9)]">
          {f.name}
        </h3>
        <div className="transition-opacity duration-300 group-hover:opacity-0">
          <p className="font-serif font-light text-base text-white-dim leading-relaxed mb-8">
            {f.desc}
          </p>
          <Link
            to="/terapeutas"
            className="inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold hover:text-gold-bright transition-colors duration-300"
          >
            <span>Ver terapeutas</span>
            <span className="transition-transform duration-400 ease-expo-out group-hover:translate-x-2">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default FounderCard;
