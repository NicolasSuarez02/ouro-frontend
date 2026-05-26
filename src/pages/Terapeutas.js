import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAllTherapists } from '../services/api';

// ---------------------------------------------------------------
// MiniEstrellas — Rating display con estrellas doradas
// ---------------------------------------------------------------
const MiniEstrellas = ({ score, count }) => {
  if (!count) return null;
  const rounded = Math.round(score);
  return (
    <div className="flex items-center justify-center gap-1 mt-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3 h-3 ${s <= rounded ? 'text-gold' : 'text-gold-faint'}`}
          fill={s <= rounded ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
      <span className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint ml-1">
        ({count})
      </span>
    </div>
  );
};

// ---------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------
const PAGE_SIZE = 12;

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-4 mt-16">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Página anterior"
        className="p-3 border border-gold-dim text-gold hover:bg-gold hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gold transition-all duration-400 ease-expo-out"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <span className="font-sans text-[11px] uppercase tracking-eyebrow text-white-dim px-2">
        {page} de {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Página siguiente"
        className="p-3 border border-gold-dim text-gold hover:bg-gold hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gold transition-all duration-400 ease-expo-out"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

// ---------------------------------------------------------------
// Search icon (inline, stroke 1.5px)
// ---------------------------------------------------------------
const SearchIcon = ({ className = '' }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CloseIcon = ({ className = '' }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </svg>
);

// ---------------------------------------------------------------
// Terapeutas — Listado público
// ---------------------------------------------------------------
const Terapeutas = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('');
  const [page, setPage] = useState(1);

  const cargarTerapeutas = () => {
    setLoading(true);
    setError('');
    getAllTherapists()
      .then((data) => setTherapists(data))
      .catch(() => setError('No se pudo cargar la lista de terapeutas.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarTerapeutas();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filtro]);

  const terapeutasFiltrados = therapists.filter((t) =>
    t.specialty?.toLowerCase().includes(filtro.toLowerCase()) ||
    t.userFullName?.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalPages = Math.ceil(terapeutasFiltrados.length / PAGE_SIZE);
  const terapeutasPagina = terapeutasFiltrados.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-container mx-auto px-6 lg:px-10 pt-32 lg:pt-40 pb-24 w-full">
        {/* Header de sección */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
            <span className="font-sans text-[11px] font-medium uppercase tracking-eyebrow-wide text-gold">
              Quienes acompañan
            </span>
            <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
          </div>
          <h1
            className="font-serif font-light text-white mb-6"
            style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
          >
            Nuestros <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">terapeutas</em>
          </h1>
          <p className="font-serif font-light text-white-dim max-w-xl mx-auto leading-relaxed" style={{ fontSize: 'clamp(18px, 1.4vw, 22px)' }}>
            Encontrá el profesional para tu camino de autoconocimiento.
          </p>
        </div>

        {/* Buscador (excepción del DS: caja completa, no underline-only) */}
        <div className="max-w-md mx-auto mb-16">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-dim" />
            <input
              type="text"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Buscar por nombre o especialidad..."
              className="w-full pl-11 pr-11 py-3.5 bg-navy-soft/40 border border-gold-faint focus:border-gold-dim focus:outline-none font-serif font-light text-base text-white placeholder:text-white-faint placeholder:italic transition-colors duration-300"
            />
            {filtro && (
              <button
                onClick={() => setFiltro('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white-faint hover:text-gold transition-colors duration-300"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div
              className="w-8 h-8 border-2 border-gold-faint border-t-gold rounded-full animate-spin"
              aria-label="Cargando"
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16 space-y-6">
            <div
              className="inline-block px-6 py-4"
              style={{
                borderTop: '1px solid rgba(160, 74, 58, 0.4)',
                borderBottom: '1px solid rgba(160, 74, 58, 0.4)',
                background: 'rgba(160, 74, 58, 0.08)',
              }}
              role="alert"
            >
              <p className="font-serif font-light text-base text-white">
                {error}
              </p>
            </div>
            <div>
              <button
                onClick={cargarTerapeutas}
                className="font-sans text-[11px] uppercase tracking-eyebrow text-gold hover:text-gold-bright transition-colors duration-300 underline underline-offset-4"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && terapeutasFiltrados.length === 0 && (
          <div className="text-center py-20 space-y-5">
            <SearchIcon className="mx-auto text-gold-dim" />
            {filtro ? (
              <>
                <p className="font-serif font-light text-lg text-white-dim">
                  Sin resultados para <em className="italic text-white">"{filtro}"</em>
                </p>
                <button
                  onClick={() => setFiltro('')}
                  className="font-sans text-[11px] uppercase tracking-eyebrow text-gold hover:text-gold-bright transition-colors duration-300 underline underline-offset-4"
                >
                  Limpiar búsqueda
                </button>
              </>
            ) : (
              <p className="font-serif font-light text-lg text-white-dim">
                Todavía no hay terapeutas disponibles.
              </p>
            )}
          </div>
        )}

        {/* Grid + contador */}
        {!loading && !error && terapeutasFiltrados.length > 0 && (
          <>
            <p className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint text-center mb-10">
              {terapeutasFiltrados.length} terapeuta{terapeutasFiltrados.length !== 1 ? 's' : ''}
              {filtro ? ` para "${filtro}"` : ''}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
              {terapeutasPagina.map((therapist) => (
                <Link
                  key={therapist.id}
                  to={`/terapeutas/${therapist.slug}`}
                  className="group relative bg-navy-card border border-gold-faint px-8 py-10 transition-all duration-600 ease-expo-out hover:-translate-y-2 hover:border-gold-dim hover:shadow-card-hover overflow-hidden text-center block"
                >
                  {/* Línea superior animada en hover */}
                  <span
                    className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-800 ease-expo-out"
                    aria-hidden="true"
                  />

                  {/* Avatar */}
                  <div className="flex justify-center mb-6">
                    {therapist.photoUrl ? (
                      <img
                        src={therapist.photoUrl}
                        alt={therapist.userFullName}
                        className="w-20 h-20 rounded-full object-cover border border-gold-faint"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gold-gradient flex items-center justify-center">
                        <span className="font-serif font-normal text-3xl text-navy">
                          {therapist.userFullName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Nombre */}
                  <h2 className="font-serif font-light text-2xl text-white mb-3 leading-tight">
                    {therapist.userFullName}
                  </h2>

                  {/* Especialidad como eyebrow */}
                  {therapist.specialty && (
                    <p className="font-sans text-[10px] uppercase tracking-eyebrow-wide text-gold-dim truncate">
                      {therapist.specialty}
                    </p>
                  )}

                  {/* Rating */}
                  <MiniEstrellas score={therapist.averageRating} count={therapist.ratingCount} />

                  {/* Precio */}
                  {therapist.priceAmountCents != null && (
                    <div className="mt-5 pt-5 border-t border-gold-faint">
                      <p className="font-serif font-normal text-xl text-white">
                        {(therapist.priceAmountCents / 100).toLocaleString('es-AR', {
                          style: 'currency',
                          currency: therapist.priceCurrency || 'ARS',
                          maximumFractionDigits: 0,
                        })}
                      </p>
                      <p className="font-sans text-[10px] uppercase tracking-suffix text-white-faint mt-1">
                        Por sesión
                      </p>
                    </div>
                  )}
                </Link>
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Terapeutas;
