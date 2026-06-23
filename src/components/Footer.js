import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Isotipo } from '../assets/logo/ouro-isotipo.svg';

const Footer = () => {
  return (
    <footer className="bg-navy-deep border-t border-gold-faint relative">
      {/* Línea-gradiente decorativa superior */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(198, 167, 94, 0.4), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-container mx-auto px-6 lg:px-10 py-16">
        <div className="flex flex-col items-center gap-8">

          {/* Logo + texto institucional */}
          <div className="flex items-center gap-3 text-gold">
            <Isotipo className="h-10 w-10 text-gold" aria-hidden="true" />
            <span
              className="font-serif text-xl font-normal tracking-brand text-white"
              style={{ paddingRight: '0.45em' }}
            >
              OURO
            </span>
          </div>

          {/* Cita filosófica breve */}
          <p className="font-serif text-base italic text-white-dim text-center max-w-md leading-relaxed">
            El ciclo consciente que integra.
          </p>

          {/* Contacto */}
          <div className="flex flex-col items-center gap-3">
            <a
              href="mailto:ouro.contacto2026@gmail.com"
              className="group relative font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-dim hover:text-gold transition-colors duration-300 py-1"
            >
              ouro.contacto2026@gmail.com
              <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-600 ease-expo-out" />
            </a>
            <a
              href="tel:+5493413021109"
              className="group relative font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-dim hover:text-gold transition-colors duration-300 py-1"
            >
              +54 9 341 302-1109
              <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-600 ease-expo-out" />
            </a>
          </div>

          {/* Links legales */}
          <div className="flex items-center gap-4">
            <Link
              to="/terminos"
              className="font-sans text-[10px] font-medium uppercase tracking-eyebrow text-white-faint hover:text-gold transition-colors duration-300"
            >
              Términos
            </Link>
            <span className="w-1 h-1 rounded-full bg-gold-dim" aria-hidden="true" />
            <Link
              to="/privacidad"
              className="font-sans text-[10px] font-medium uppercase tracking-eyebrow text-white-faint hover:text-gold transition-colors duration-300"
            >
              Privacidad
            </Link>
          </div>
        </div>

        {/* Divisor inferior con línea-gradiente */}
        <div
          className="mt-12 mb-6 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(198, 167, 94, 0.2), transparent)',
          }}
          aria-hidden="true"
        />

        {/* Copyright */}
        <p className="text-center font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
          &copy; {new Date().getFullYear()} OURO &mdash; Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
};

export default Footer;
