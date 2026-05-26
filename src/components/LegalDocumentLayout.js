import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * LegalDocumentLayout — Chrome compartido para páginas legales
 * (TermsPage, PrivacyPage y futuras como Cookies, etc.).
 *
 * Provee:
 *   - Navbar + main centrado + Footer.
 *   - Header con eyebrow + título + fecha de actualización.
 *   - Container `space-y-12` para separar secciones.
 *
 * Props:
 *   - title:        string — título grande del documento.
 *   - lastUpdated:  string — fecha de última actualización (ej. "marzo 2026").
 *   - children:     ReactNode — típicamente una serie de <LegalSection>.
 *
 * Se exporta también `LegalSection` como named export para uniformar
 * cada sección numerada del documento.
 */

const LegalDocumentLayout = ({ title, lastUpdated, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 lg:px-10 pt-32 lg:pt-40 pb-24">

        {/* Header */}
        <header className="mb-16">
          <p className="font-sans text-[11px] font-medium uppercase tracking-eyebrow-wide text-gold mb-5">
            Documento legal
          </p>
          <h1
            className="font-serif font-light text-white mb-5"
            style={{ fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
          >
            {title}
          </h1>
          {lastUpdated && (
            <p className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
              Última actualización · {lastUpdated}
            </p>
          )}
        </header>

        {/* Divisor con línea-gradiente */}
        <div
          className="h-px mb-16"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(198, 167, 94, 0.4), transparent)',
          }}
          aria-hidden="true"
        />

        {/* Secciones */}
        <div className="space-y-14">
          {children}
        </div>

      </main>

      <Footer />
    </div>
  );
};

/**
 * LegalSection — Una sección numerada del documento legal.
 *
 * Props:
 *   - number:   number | string — número de sección.
 *   - title:    string — título de la sección.
 *   - children: ReactNode — contenido (típicamente <p> con texto + Links inline).
 */
export const LegalSection = ({ number, title, children }) => (
  <section>
    <div className="flex items-baseline gap-5 mb-5">
      <span
        className="font-serif italic font-light leading-none bg-gold-gradient bg-clip-text text-transparent flex-shrink-0"
        style={{ fontSize: '36px', minWidth: '32px' }}
        aria-hidden="true"
      >
        {number}
      </span>
      <h2 className="font-serif font-light text-2xl text-white leading-tight">
        {title}
      </h2>
    </div>
    <div className="pl-[52px] font-serif font-light text-base text-white-dim leading-relaxed space-y-4">
      {children}
    </div>
  </section>
);

export default LegalDocumentLayout;
