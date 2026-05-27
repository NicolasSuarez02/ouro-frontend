import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PASOS = [
  {
    titulo: 'Explorar terapeutas',
    desc: 'Encontrá el profesional para tu camino.',
  },
  {
    titulo: 'Agendar tu primera sesión',
    desc: 'Elegí el día y la hora que mejor te convenga.',
  },
  {
    titulo: 'Completar tu perfil',
    desc: 'Personalizá tu experiencia.',
  },
];

const Success = () => {
  const location = useLocation();
  const user = location.state?.user;
  const firstName = user?.fullName?.split(' ')[0] || null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 pt-32 lg:pt-40 pb-24">
        <div className="max-w-2xl w-full">

          {/* Marca circular de status — punto dorado con glow */}
          <div className="flex justify-center mb-10">
            <div
              className="w-20 h-20 rounded-full border border-gold-dim flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="block w-3 h-3 rounded-full bg-gold shadow-gold-glow-soft" />
            </div>
          </div>

          {/* Eyebrow + Title + Subtitle */}
          <div className="text-center mb-12">
            <p className="font-sans text-[11px] font-medium uppercase tracking-eyebrow-wide text-gold mb-5">
              Registro completado
            </p>
            <h1
              className="font-serif font-light text-white mb-4"
              style={{ fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
            >
              {firstName ? (
                <>
                  Bienvenida,{' '}
                  <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">
                    {firstName}
                  </em>
                </>
              ) : (
                'Cuenta creada'
              )}
            </h1>
            <p
              className="font-serif font-light text-white-dim leading-relaxed"
              style={{ fontSize: 'clamp(16px, 1.2vw, 18px)' }}
            >
              Tu cuenta está lista.
            </p>
          </div>

          {/* Próximos pasos */}
          <div className="bg-navy-card border border-gold-faint p-8 mb-10">
            <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold mb-6 text-center">
              Próximos pasos
            </p>
            <ol className="space-y-6">
              {PASOS.map((paso, idx) => (
                <li key={idx} className="flex items-start gap-5">
                  <span
                    className="flex-shrink-0 font-serif italic font-light leading-none bg-gold-gradient bg-clip-text text-transparent"
                    style={{ fontSize: '42px', minWidth: '36px' }}
                    aria-hidden="true"
                  >
                    {idx + 1}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-serif font-light text-lg text-white leading-snug">
                      {paso.titulo}
                    </h3>
                    <p className="font-serif font-light text-sm text-white-dim leading-relaxed mt-1">
                      {paso.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/terapeutas"
              className="flex-1 inline-flex items-center justify-center gap-3 bg-gold-gradient py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow"
            >
              <span>Explorar terapeutas</span>
              <span>→</span>
            </Link>
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 border border-gold-dim hover:bg-gold hover:border-gold hover:text-navy font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-400 ease-expo-out"
            >
              <span>Ir al inicio</span>
            </Link>
          </div>

          {/* Help */}
          <div className="mt-12 pt-8 border-t border-gold-faint text-center">
            <p className="font-serif font-light text-base text-white-dim mb-3">
              ¿Necesitás ayuda?
            </p>
            <Link
              to="/#contacto"
              className="inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold hover:text-gold-bright transition-colors duration-300"
            >
              <span>Escribinos al contacto</span>
              <span>→</span>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Success;
