import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Isotipo } from '../assets/logo/ouro-isotipo.svg';

/**
 * AuthLayout — Chrome compartido de todas las páginas de autenticación.
 *
 * Provee:
 *   - Container vertical-centrado con anillos decorativos sutiles de fondo.
 *   - Logo + texto institucional OURO arriba (opcional).
 *   - Header opcional: eyebrow + title + subtitle.
 *   - Slot principal `children` envuelto en card con border dorado faint.
 *   - Link "Volver" abajo (opcional, destino configurable).
 *
 * Props:
 *   - title:        ReactNode — título grande serif. Puede incluir <em> con gradient.
 *   - subtitle:     ReactNode — subtítulo serif white-dim.
 *   - eyebrow:      string    — sans uppercase dorado con líneas laterales.
 *   - width:        "md" | "lg" | "xl" — ancho del container (default "md").
 *   - showLogo:     boolean   — default true.
 *   - showBackLink: boolean   — default true.
 *   - backTo:       string    — destino del back link (default "/").
 *   - backLabel:    string    — texto del back link (default "Volver al inicio").
 *   - bare:         boolean   — si true, omite la card y renderiza children directamente
 *                               (útil para estados de mensaje con su propia composición).
 */

const widthMap = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

const AuthLayout = ({
  title,
  subtitle,
  eyebrow,
  width = 'md',
  showLogo = true,
  showBackLink = true,
  backTo = '/',
  backLabel = 'Volver al inicio',
  bare = false,
  children,
}) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-20 lg:py-24 overflow-hidden">
      {/* Anillos decorativos sutiles centrados */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-gold-faint animate-spin"
        style={{ animationDuration: '480s' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-gold-ghost animate-spin"
        style={{ animationDuration: '720s', animationDirection: 'reverse' }}
        aria-hidden="true"
      />

      <div className={`relative w-full ${widthMap[width] || widthMap.md}`}>
        {/* Logo + texto institucional */}
        {showLogo && (
          <div className="text-center mb-12">
            <Link
              to="/"
              className="group inline-flex items-center gap-3 text-gold"
              aria-label="OURO — Inicio"
            >
              <Isotipo
                className="h-12 w-12 text-gold transition-transform duration-600 ease-expo-out group-hover:rotate-[15deg]"
                aria-hidden="true"
              />
              <span
                className="font-serif text-2xl font-normal tracking-brand text-white"
                style={{ paddingRight: '0.45em' }}
              >
                OURO
              </span>
            </Link>
          </div>
        )}

        {/* Eyebrow + Title + Subtitle */}
        {(eyebrow || title || subtitle) && (
          <div className="text-center mb-10">
            {eyebrow && (
              <div className="flex items-center justify-center gap-4 mb-5">
                <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
                <span className="font-sans text-[11px] font-medium uppercase tracking-eyebrow-wide text-gold">
                  {eyebrow}
                </span>
                <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
              </div>
            )}
            {title && (
              <h1
                className="font-serif font-light text-white mb-3"
                style={{
                  fontSize: 'clamp(36px, 4vw, 56px)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                }}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p
                className="font-serif font-light text-white-dim leading-relaxed max-w-md mx-auto"
                style={{ fontSize: 'clamp(16px, 1.2vw, 18px)' }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Slot principal — card o bare */}
        {bare ? (
          children
        ) : (
          <div className="bg-navy-card border border-gold-faint p-8 lg:p-10">
            {children}
          </div>
        )}

        {/* Back link */}
        {showBackLink && (
          <div className="mt-10 text-center">
            <Link
              to={backTo}
              className="group inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-faint hover:text-gold transition-colors duration-300"
            >
              <span className="transition-transform duration-400 ease-expo-out group-hover:-translate-x-2">
                ←
              </span>
              <span>{backLabel}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
