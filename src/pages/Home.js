import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { sendContactMessage, getAllTherapists } from '../services/api';

const PASOS = [
  {
    num: 1,
    titulo: 'Registrate',
    desc: 'Creá tu cuenta en minutos y completá tu perfil.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    num: 2,
    titulo: 'Elegí tu especialista',
    desc: 'Explorá los perfiles, especialidades y propuestas de cada terapeuta.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    num: 3,
    titulo: 'Reservá tu turno',
    desc: 'Seleccioná el día y horario que mejor te convenga desde el calendario del terapeuta.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    num: 4,
    titulo: 'Realizá tu pago',
    desc: 'Aboná de forma segura a través de MercadoPago. Tu sesión queda confirmada.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    num: 5,
    titulo: 'Conectate con tu sesión',
    desc: 'Ingresá al videollamada desde cualquier dispositivo. Tu espacio de transformación te espera.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const Home = () => {
  const location = useLocation();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState('');
  const [contactLoading, setContactLoading] = useState(false);

  const [therapists, setTherapists] = useState([]);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [location.state]);

  useEffect(() => {
    getAllTherapists()
      .then((data) => {
        const sorted = [...data].sort((a, b) =>
          a.userFullName.localeCompare(b.userFullName, 'es')
        );
        setTherapists(sorted.slice(0, 6));
      })
      .catch(() => {});
  }, []);

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
    setContactStatus('');
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactStatus('error');
      return;
    }
    setContactLoading(true);
    try {
      await sendContactMessage(contactForm);
      setContactStatus('success');
      setContactForm({ name: '', email: '', message: '' });
    } catch {
      setContactStatus('error');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── 1. INICIO (Hero) ── */}
      <section id="inicio" className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="max-w-container mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

            {/* Columna texto */}
            <div className="relative z-10">
              {/* Eyebrow con líneas laterales */}
              <div className="flex items-center gap-4 mb-10">
                <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
                <span className="font-sans text-[11px] font-medium uppercase tracking-eyebrow-wide text-gold">
                  El ciclo consciente
                </span>
                <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
              </div>

              {/* Título display */}
              {/* Copy original conservado. El DS v2 sugiere tono contemplativo: ver propuesta al cerrar bloque. */}
              <h1
                className="font-serif font-light text-white mb-10 leading-[0.95]"
                style={{ fontSize: 'clamp(56px, 8.5vw, 128px)', letterSpacing: '-0.02em' }}
              >
                Renacé en
                <br />
                <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">
                  cada ciclo
                </em>
              </h1>

              {/* Lead text */}
              <p
                className="font-serif font-light text-white-dim leading-relaxed max-w-xl"
                style={{ fontSize: 'clamp(18px, 1.4vw, 22px)' }}
              >
                Un espacio de encuentro entre quienes buscan y quienes acompañan.
                Ouro nació del símbolo del ouroboros, presente en culturas que nunca
                se conocieron entre sí, como memoria de transformación, retorno y
                autoconocimiento.
              </p>
            </div>

            {/* Columna placeholder de video con anillos decorativos */}
            <div className="relative">
              {/* Anillos concéntricos decorativos (versión simplificada del astral del DS) */}
              <div
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] aspect-square rounded-full border border-gold-faint animate-spin"
                style={{ animationDuration: '480s' }}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] aspect-square rounded-full border border-gold-ghost animate-spin"
                style={{ animationDuration: '720s', animationDirection: 'reverse' }}
                aria-hidden="true"
              />

              {/* Placeholder de video */}
              <div className="relative bg-navy-card border border-gold-faint aspect-video flex items-center justify-center overflow-hidden">
                {/* Marca de esquina superior izquierda — pequeño detalle ornamental */}
                <span
                  className="absolute top-4 left-4 font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim"
                  aria-hidden="true"
                >
                  Próximamente
                </span>

                <div className="text-center px-8">
                  {/* Botón play */}
                  <div className="w-20 h-20 rounded-full border border-gold-dim flex items-center justify-center mx-auto mb-6 transition-all duration-600 ease-expo-out hover:border-gold hover:shadow-gold-glow-soft">
                    <svg className="w-7 h-7 text-gold ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>

                  <p className="font-sans text-[11px] uppercase tracking-eyebrow text-white-dim mb-3">
                    Video inspiracional
                  </p>
                  <p className="font-serif italic text-base text-white-faint">
                    El ouroboros a través de las civilizaciones
                  </p>
                </div>

                {/* Línea-gradiente inferior */}
                <span
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{
                    background:
                      'linear-gradient(to right, transparent, rgba(198, 167, 94, 0.4), transparent)',
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. QUIÉNES SOMOS ── */}
      <section id="quienes-somos" className="relative py-24 lg:py-32">
        <div className="max-w-container mx-auto px-6 lg:px-10">
          {/* Header de sección */}
          <div className="text-center mb-20 lg:mb-24">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
              <span className="font-sans text-[11px] font-medium uppercase tracking-eyebrow-wide text-gold">
                El equipo
              </span>
              <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
            </div>
            <h2
              className="font-serif font-light text-white mb-6"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
            >
              Equipo <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">fundador</em>
            </h2>
            {/* Subtítulo — copy original conservado */}
            <p className="font-serif font-light text-white-dim max-w-xl mx-auto leading-relaxed" style={{ fontSize: 'clamp(18px, 1.4vw, 22px)' }}>
              Cada una con su camino, todas comprometidas con tu proceso.
            </p>
          </div>

          {/* Grilla de fundadoras */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Fundadora 1 — Lucila */}
            <article className="group relative bg-gradient-to-b from-navy-soft to-navy border border-gold-faint px-8 pt-9 pb-10 transition-all duration-600 ease-expo-out hover:-translate-y-3 hover:border-gold-dim hover:shadow-card-hover overflow-hidden">
              {/* Línea superior animada */}
              <span
                className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-800 ease-expo-out"
                aria-hidden="true"
              />
              {/* Inicial gigante */}
              <div className="text-center mb-6">
                <span
                  className="font-serif italic font-light bg-gold-gradient bg-clip-text text-transparent inline-block leading-none"
                  style={{ fontSize: 'clamp(120px, 14vw, 180px)' }}
                  aria-hidden="true"
                >
                  L
                </span>
              </div>
              <p className="font-sans text-[10px] uppercase tracking-eyebrow-wide text-gold-dim text-center mb-3">
                Co-fundadora
              </p>
              <h3 className="font-serif font-light text-3xl text-white text-center mb-4">
                Lucila
              </h3>
              <p className="font-serif font-light text-base text-white-dim leading-relaxed text-center mb-8">
                Acompaña procesos de transformación y autoconocimiento.
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

            {/* Fundadora 2 — Elina */}
            <article className="group relative bg-gradient-to-b from-navy-soft to-navy border border-gold-faint px-8 pt-9 pb-10 transition-all duration-600 ease-expo-out hover:-translate-y-3 hover:border-gold-dim hover:shadow-card-hover overflow-hidden">
              <span
                className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-800 ease-expo-out"
                aria-hidden="true"
              />
              <div className="text-center mb-6">
                <span
                  className="font-serif italic font-light bg-gold-gradient bg-clip-text text-transparent inline-block leading-none"
                  style={{ fontSize: 'clamp(120px, 14vw, 180px)' }}
                  aria-hidden="true"
                >
                  E
                </span>
              </div>
              <p className="font-sans text-[10px] uppercase tracking-eyebrow-wide text-gold-dim text-center mb-3">
                Co-fundadora
              </p>
              <h3 className="font-serif font-light text-3xl text-white text-center mb-4">
                Elina
              </h3>
              <p className="font-serif font-light text-base text-white-dim leading-relaxed text-center mb-8">
                Especialista en bienestar integral. Dedicada a sostener espacios de crecimiento personal.
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

            {/* Fundadora 3 — Celina */}
            <article className="group relative bg-gradient-to-b from-navy-soft to-navy border border-gold-faint px-8 pt-9 pb-10 transition-all duration-600 ease-expo-out hover:-translate-y-3 hover:border-gold-dim hover:shadow-card-hover overflow-hidden">
              <span
                className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-800 ease-expo-out"
                aria-hidden="true"
              />
              <div className="text-center mb-6">
                <span
                  className="font-serif italic font-light bg-gold-gradient bg-clip-text text-transparent inline-block leading-none"
                  style={{ fontSize: 'clamp(120px, 14vw, 180px)' }}
                  aria-hidden="true"
                >
                  C
                </span>
              </div>
              <p className="font-sans text-[10px] uppercase tracking-eyebrow-wide text-gold-dim text-center mb-3">
                Co-fundadora
              </p>
              <h3 className="font-serif font-light text-3xl text-white text-center mb-4">
                Celina
              </h3>
              <p className="font-serif font-light text-base text-white-dim leading-relaxed text-center mb-8">
                Apasionada por el desarrollo humano y el acompañamiento terapéutico en cada tránsito vital.
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
          </div>
        </div>
      </section>

      {/* ── 3. TERAPEUTAS ── */}
      <section id="terapeutas" className="relative py-24 lg:py-32">
        {/* Separador superior con línea-gradiente */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(198, 167, 94, 0.4), transparent)',
          }}
          aria-hidden="true"
        />

        <div className="max-w-container mx-auto px-6 lg:px-10">
          {/* Header de sección */}
          <div className="text-center mb-20 lg:mb-24">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
              <span className="font-sans text-[11px] font-medium uppercase tracking-eyebrow-wide text-gold">
                Quienes acompañan
              </span>
              <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
            </div>
            <h2
              className="font-serif font-light text-white mb-6"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
            >
              Nuestros <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">terapeutas</em>
            </h2>
            <p className="font-serif font-light text-white-dim max-w-xl mx-auto leading-relaxed" style={{ fontSize: 'clamp(18px, 1.4vw, 22px)' }}>
              Especialistas seleccionados, comprometidos con tu camino.
            </p>
          </div>

          {therapists.length > 0 ? (
            <>
              {/* Grilla de cards compactas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {therapists.map((t) => (
                  <Link
                    key={t.id}
                    to={`/terapeutas/${t.slug}`}
                    className="group relative bg-navy-card border border-gold-faint px-8 py-10 transition-all duration-600 ease-expo-out hover:-translate-y-2 hover:border-gold-dim hover:shadow-card-hover overflow-hidden text-center"
                  >
                    {/* Línea superior animada */}
                    <span
                      className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-800 ease-expo-out"
                      aria-hidden="true"
                    />

                    {/* Avatar */}
                    <div className="flex justify-center mb-6">
                      {t.photoUrl ? (
                        <img
                          src={t.photoUrl}
                          alt={t.userFullName}
                          className="w-20 h-20 rounded-full object-cover border border-gold-faint"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gold-gradient flex items-center justify-center">
                          <span className="font-serif font-normal text-3xl text-navy">
                            {t.userFullName?.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Nombre */}
                    <h3 className="font-serif font-light text-2xl text-white mb-3 leading-tight">
                      {t.userFullName}
                    </h3>

                    {/* Especialidad como eyebrow */}
                    {t.specialty && (
                      <p className="font-sans text-[10px] uppercase tracking-eyebrow-wide text-gold-dim truncate">
                        {t.specialty}
                      </p>
                    )}
                  </Link>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center">
                <Link
                  to="/terapeutas"
                  className="group inline-flex items-center gap-3 bg-gold-gradient px-9 py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow"
                >
                  <span>Ver todos los terapeutas</span>
                  <span className="transition-transform duration-400 ease-expo-out group-hover:translate-x-2">→</span>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center">
              <Link
                to="/terapeutas"
                className="inline-flex items-center gap-3 bg-gold-gradient px-9 py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow"
              >
                <span>Explorar terapeutas</span>
                <span>→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. CÓMO EMPEZAR ── */}
      <section id="como-empezar" className="relative py-24 lg:py-32">
        {/* Separador superior con línea-gradiente */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(198, 167, 94, 0.4), transparent)',
          }}
          aria-hidden="true"
        />

        <div className="max-w-container mx-auto px-6 lg:px-10">
          {/* Header de sección */}
          <div className="text-center mb-20 lg:mb-24">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
              <span className="font-sans text-[11px] font-medium uppercase tracking-eyebrow-wide text-gold">
                El camino
              </span>
              <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
            </div>
            <h2
              className="font-serif font-light text-white mb-6"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
            >
              Cómo <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">empezar</em>
            </h2>
            <p className="font-serif font-light text-white-dim max-w-xl mx-auto leading-relaxed" style={{ fontSize: 'clamp(18px, 1.4vw, 22px)' }}>
              Cinco pasos para iniciar tu tránsito.
            </p>
          </div>

          {/* 5 pasos */}
          <div className="relative mb-24 lg:mb-32">
            {/* Línea conectora (desktop) — centrada verticalmente sobre los círculos
                de 80px. Eyebrow "Paso 01" (~31px) + mitad del círculo (40px) = ~72px */}
            <div
              className="hidden lg:block absolute top-[72px] left-[10%] right-[10%] h-px"
              style={{
                background:
                  'linear-gradient(to right, transparent, rgba(198, 167, 94, 0.4), rgba(198, 167, 94, 0.4), transparent)',
              }}
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 relative">
              {PASOS.map((paso) => (
                <div key={paso.num} className="text-center relative">
                  {/* Número como eyebrow */}
                  <p className="font-sans text-[10px] uppercase tracking-eyebrow-wide text-gold-dim mb-4">
                    Paso {String(paso.num).padStart(2, '0')}
                  </p>

                  {/* Círculo con icono */}
                  <div className="relative inline-flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full border border-gold-dim bg-navy-deep">
                    <div className="text-gold">
                      {paso.icon}
                    </div>
                  </div>

                  <h3 className="font-serif font-light text-xl text-white mb-3">
                    {paso.titulo}
                  </h3>
                  <p className="font-serif font-light text-sm text-white-dim leading-relaxed">
                    {paso.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4 garantías */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <article className="group relative bg-navy-card border border-gold-faint p-8 transition-all duration-600 ease-expo-out hover:-translate-y-1 hover:border-gold-dim hover:shadow-card-hover overflow-hidden">
              <span
                className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-800 ease-expo-out"
                aria-hidden="true"
              />
              <div className="w-12 h-12 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-serif font-light text-xl text-white mb-3">Confidencialidad</h3>
              <p className="font-serif font-light text-sm text-white-dim leading-relaxed">
                Tus sesiones son privadas. Cifradas de extremo a extremo.
              </p>
            </article>

            <article className="group relative bg-navy-card border border-gold-faint p-8 transition-all duration-600 ease-expo-out hover:-translate-y-1 hover:border-gold-dim hover:shadow-card-hover overflow-hidden">
              <span
                className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-800 ease-expo-out"
                aria-hidden="true"
              />
              <div className="w-12 h-12 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-serif font-light text-xl text-white mb-3">Terapeutas de confianza</h3>
              <p className="font-serif font-light text-sm text-white-dim leading-relaxed">
                Seleccionados cuidadosamente, acompañados por nuestro equipo en cada tránsito.
              </p>
            </article>

            <article className="group relative bg-navy-card border border-gold-faint p-8 transition-all duration-600 ease-expo-out hover:-translate-y-1 hover:border-gold-dim hover:shadow-card-hover overflow-hidden">
              <span
                className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-800 ease-expo-out"
                aria-hidden="true"
              />
              <div className="w-12 h-12 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif font-light text-xl text-white mb-3">Horarios disponibles</h3>
              <p className="font-serif font-light text-sm text-white-dim leading-relaxed">
                Cada especialista gestiona su agenda. Elegí el horario que mejor te convenga.
              </p>
            </article>

            <article className="group relative bg-navy-card border border-gold-faint p-8 transition-all duration-600 ease-expo-out hover:-translate-y-1 hover:border-gold-dim hover:shadow-card-hover overflow-hidden">
              <span
                className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-800 ease-expo-out"
                aria-hidden="true"
              />
              <div className="w-12 h-12 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="font-serif font-light text-xl text-white mb-3">Desde donde estés</h3>
              <p className="font-serif font-light text-sm text-white-dim leading-relaxed">
                Conectate desde cualquier lugar. Videollamada simple y estable.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── CTA grande (entre Cómo empezar y Contacto) ── */}
      {/* Alternativas de copy de título conservadas como referencia:
            B) "Cada retorno abre un ciclo."
            C) "Integrar lo vivido. Volver al ciclo." */}
      <section className="relative py-32 lg:py-40 bg-navy-deep overflow-hidden">
        {/* Anillos decorativos sutiles, centrados */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-gold-faint animate-spin"
          style={{ animationDuration: '480s' }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] rounded-full border border-gold-ghost animate-spin"
          style={{ animationDuration: '720s', animationDirection: 'reverse' }}
          aria-hidden="true"
        />

        <div className="relative max-w-3xl mx-auto px-6 lg:px-10 text-center">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
            <span className="font-sans text-[11px] font-medium uppercase tracking-eyebrow-wide text-gold">
              El retorno
            </span>
            <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
          </div>

          {/* Título */}
          <h2
            className="font-serif font-light text-white mb-8"
            style={{ fontSize: 'clamp(40px, 6vw, 88px)', lineHeight: 1.05, letterSpacing: '-0.01em' }}
          >
            <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">Volver</em>{' '}
            es integrar.
          </h2>

          {/* Lead */}
          <p
            className="font-serif font-light text-white-dim leading-relaxed mb-12 max-w-xl mx-auto"
            style={{ fontSize: 'clamp(18px, 1.4vw, 22px)' }}
          >
            Para quienes eligen volver sobre lo vivido.
          </p>

          {/* Botón outline dorado */}
          <Link
            to="/login"
            className="group inline-flex items-center gap-3 px-10 py-4 border border-gold-dim hover:bg-gold hover:border-gold hover:text-navy font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-400 ease-expo-out"
          >
            <span>Iniciar</span>
            <span className="transition-transform duration-400 ease-expo-out group-hover:translate-x-2">→</span>
          </Link>
        </div>
      </section>

      {/* ── 5. CONTACTO ── */}
      <section id="contacto" className="relative py-24 lg:py-32">
        {/* Separador superior con línea-gradiente */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(198, 167, 94, 0.4), transparent)',
          }}
          aria-hidden="true"
        />

        <div className="max-w-2xl mx-auto px-6 lg:px-10">
          {/* Header de sección */}
          <div className="text-center mb-16 lg:mb-20">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
              <span className="font-sans text-[11px] font-medium uppercase tracking-eyebrow-wide text-gold">
                Escribinos
              </span>
              <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
            </div>
            <h2
              className="font-serif font-light text-white mb-6"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
            >
              ¿Tenés <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">preguntas</em>?
            </h2>
            <p className="font-serif font-light text-white-dim max-w-md mx-auto leading-relaxed" style={{ fontSize: 'clamp(18px, 1.4vw, 22px)' }}>
              Contanos sobre la plataforma o tu búsqueda.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleContactSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Nombre */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3"
                >
                  Nombre
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  required
                  placeholder="Tu nombre"
                  className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 transition-colors duration-300"
                />
              </div>
              {/* Email */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  required
                  placeholder="tu@email.com"
                  className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 transition-colors duration-300"
                />
              </div>
            </div>

            {/* Mensaje */}
            <div>
              <label
                htmlFor="contact-message"
                className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3"
              >
                Mensaje
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={contactForm.message}
                onChange={handleContactChange}
                required
                rows={5}
                placeholder="Contanos en qué podemos ayudarte..."
                className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 resize-none transition-colors duration-300"
              />
            </div>

            {/* Estado: éxito (dorado, no verde) */}
            {contactStatus === 'success' && (
              <div className="border border-gold-faint bg-gold-ghost px-5 py-4 flex items-start gap-3">
                <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-gold shadow-gold-glow-soft" aria-hidden="true" />
                <p className="font-serif font-light text-base text-white leading-relaxed">
                  Mensaje enviado. Te respondemos a la brevedad.
                </p>
              </div>
            )}

            {/* Estado: error (terracota apagado) */}
            {contactStatus === 'error' && (
              <div
                className="px-5 py-4 flex items-start gap-3"
                style={{
                  borderTop: '1px solid rgba(160, 74, 58, 0.4)',
                  borderBottom: '1px solid rgba(160, 74, 58, 0.4)',
                  background: 'rgba(160, 74, 58, 0.08)',
                }}
              >
                <span
                  className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full"
                  style={{ background: '#A04A3A' }}
                  aria-hidden="true"
                />
                <p className="font-serif font-light text-base text-white leading-relaxed">
                  No pudimos enviar el mensaje. Revisá los campos o escribinos directamente al correo.
                </p>
              </div>
            )}

            {/* Submit */}
            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={contactLoading}
                className="inline-flex items-center gap-3 bg-gold-gradient px-10 py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                <span>{contactLoading ? 'Enviando...' : 'Enviar mensaje'}</span>
                {!contactLoading && <span>→</span>}
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
