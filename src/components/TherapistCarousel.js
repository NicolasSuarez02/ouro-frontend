import React, { useRef, useState, useCallback, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';

// ---------------------------------------------------------------
// TherapistCarousel — Fase 11
// Carrusel de terapeutas para el home. Identidad OURO: fondo navy,
// cards en navy-elevated con borde fino dorado y esquinas RECTAS,
// foto circular, nombre serif, especialidad en mayúsculas con
// tracking, dorado como acento. Sin librerías externas.
//
// Implementación: scroll-snap horizontal nativo →
//   · desktop: varias cards visibles + flechas finas
//   · mobile: swipe nativo cómodo (una card + "peek" de la siguiente)
//
// Índice inicial ALEATORIO: en el primer layout se posiciona el
// scroll en una card al azar (sin tocar el orden real de los datos),
// para no jerarquizar siempre a los mismos profesionales. Se hace
// una sola vez (didInit) para evitar loops o saltos en cada render.
// ---------------------------------------------------------------

const GAP_PX = 24; // coincide con `gap-6`

const ChevronLeft = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
);

const TherapistCard = ({ t }) => (
  <Link
    to={`/terapeutas/${t.slug}`}
    className="group relative snap-start shrink-0 w-[82%] sm:w-[48%] lg:w-[31.5%] bg-navy-elevated border border-gold-faint px-8 py-10 text-center transition-colors duration-500 ease-expo-out hover:border-gold-dim overflow-hidden"
  >
    {/* Línea superior dorada que se dibuja en hover */}
    <span
      className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-expo-out"
      aria-hidden="true"
    />

    {/* Avatar circular */}
    <div className="flex justify-center mb-6">
      {t.photoUrl ? (
        <img
          src={t.photoUrl}
          alt={t.userFullName}
          className="w-24 h-24 rounded-full object-cover border border-gold-faint"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gold-gradient flex items-center justify-center">
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

    {/* Especialidad */}
    {t.specialty && (
      <p className="font-sans text-[10px] uppercase tracking-eyebrow-wide text-gold-dim mb-6">
        {t.specialty}
      </p>
    )}

    {/* Acción */}
    <span className="inline-flex items-center gap-2 font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold group-hover:text-gold-bright transition-colors duration-300">
      <span>Ver perfil</span>
      <span className="transition-transform duration-400 ease-expo-out group-hover:translate-x-1">→</span>
    </span>
  </Link>
);

const TherapistCarousel = ({ therapists = [] }) => {
  const trackRef = useRef(null);
  const didInit = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const stepWidth = () => {
    const el = trackRef.current;
    const first = el?.children?.[0];
    return first ? first.offsetWidth + GAP_PX : (el?.clientWidth || 0) * 0.85;
  };

  // Recalcula estado de navegación (flechas + indicador activo).
  // React deduplica si el valor no cambia, así que es seguro en onScroll.
  const updateNav = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 4);
    const first = el.children?.[0];
    if (first) {
      const step = first.offsetWidth + GAP_PX;
      if (step > 0) setActiveIndex(Math.round(scrollLeft / step));
    }
  }, []);

  // Posicionamiento inicial aleatorio (una sola vez, antes del paint).
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el || didInit.current || therapists.length === 0) return;
    didInit.current = true;
    const randomIndex = Math.floor(Math.random() * therapists.length);
    const child = el.children?.[randomIndex];
    if (child) el.scrollLeft = child.offsetLeft; // instantáneo, no mueve la página
    updateNav();
  }, [therapists, updateNav]);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * stepWidth(), behavior: 'smooth' });
  };

  const goTo = (index) => {
    const el = trackRef.current;
    const child = el?.children?.[index];
    if (el && child) el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
  };

  if (!therapists || therapists.length === 0) return null;

  return (
    <div className="relative">
      {/* Pista scrolleable (swipe nativo en mobile) */}
      <div
        ref={trackRef}
        onScroll={updateNav}
        className="ouro-carousel flex gap-6 overflow-x-auto snap-x snap-mandatory py-1"
      >
        {therapists.map((t) => (
          <TherapistCard key={t.id} t={t} />
        ))}
      </div>

      {/* Controles sobrios: flecha · indicadores de línea · flecha */}
      <div className="flex items-center justify-center gap-6 mt-10">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={!canPrev}
          aria-label="Terapeuta anterior"
          className="p-3 border border-gold-faint text-gold hover:border-gold-dim hover:text-gold-bright disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-gold-faint disabled:hover:text-gold transition-colors duration-300"
        >
          <ChevronLeft />
        </button>

        {therapists.length > 1 && (
          <div className="flex items-center gap-2">
            {therapists.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir al terapeuta ${i + 1}`}
                aria-current={i === activeIndex ? 'true' : undefined}
                className={`h-px transition-all duration-300 ease-expo-out ${
                  i === activeIndex ? 'w-6 bg-gold' : 'w-3 bg-gold-faint hover:bg-gold-dim'
                }`}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          aria-label="Terapeuta siguiente"
          className="p-3 border border-gold-faint text-gold hover:border-gold-dim hover:text-gold-bright disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-gold-faint disabled:hover:text-gold transition-colors duration-300"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TherapistCarousel;
