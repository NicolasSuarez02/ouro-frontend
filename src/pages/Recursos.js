import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getResources, downloadResource, deleteResource } from '../services/api';

// ---------------------------------------------------------------
// Iconos inline — stroke 1.5px.
// ---------------------------------------------------------------
const DocumentIcon = ({ className = '' }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const TrashIcon = ({ className = '' }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" />
  </svg>
);

const AlertCircle = ({ className = '', style }) => (
  <svg className={className} style={style} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const PlusIcon = ({ className = '' }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CloseIcon = ({ className = '' }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </svg>
);

// ---------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------
const PAGE_SIZE = 9;

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-4 mt-12">
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
// Recursos — Biblioteca / Formaciones
// ---------------------------------------------------------------
const Recursos = ({ category, titulo }) => {
  const navigate = useNavigate();
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [descargando, setDescargando] = useState({});
  const [eliminando, setEliminando] = useState({});
  const [actionError, setActionError] = useState('');
  const [confirmEliminar, setConfirmEliminar] = useState(null);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const userData = localStorage.getItem('ouro_user');
    if (!userData) { navigate('/login'); return; }
    setUser(JSON.parse(userData));
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    cargarRecursos();
  }, [user, category]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setPage(1);
  }, [category]);

  const cargarRecursos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResources(category);
      setRecursos(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los recursos');
    } finally {
      setLoading(false);
    }
  };

  const handleDescargar = async (recurso) => {
    setActionError('');
    setDescargando((prev) => ({ ...prev, [recurso.id]: true }));
    try {
      const response = await downloadResource(recurso.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', recurso.originalFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error al descargar el archivo');
    } finally {
      setDescargando((prev) => ({ ...prev, [recurso.id]: false }));
    }
  };

  const handleEliminar = async (recurso) => {
    setConfirmEliminar(null);
    setActionError('');
    setEliminando((prev) => ({ ...prev, [recurso.id]: true }));
    try {
      await deleteResource(recurso.id);
      setRecursos((prev) => prev.filter((r) => r.id !== recurso.id));
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error al eliminar el recurso');
    } finally {
      setEliminando((prev) => ({ ...prev, [recurso.id]: false }));
    }
  };

  const puedeEliminar = (recurso) => {
    if (!user) return false;
    return user.role === 'ADMIN' || recurso.uploadedByUserId === user.id;
  };

  const esTerapeuta = user?.role === 'THERAPIST' || user?.role === 'ADMIN';

  const totalPages = Math.ceil(recursos.length / PAGE_SIZE);
  const recursosPagina = recursos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-container mx-auto px-6 lg:px-10 pt-32 lg:pt-40 pb-24 w-full">

        {/* ============================================
            Modal confirmación eliminar
            ============================================ */}
        {confirmEliminar && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-deep/80 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-navy-card border border-gold-faint p-8 shadow-card-hover">
              <p className="font-sans text-[10px] uppercase tracking-eyebrow text-center mb-4" style={{ color: '#A04A3A' }}>
                Eliminar
              </p>
              <h3 className="font-serif font-light text-2xl text-white text-center mb-3">
                Eliminar recurso
              </h3>
              <p className="font-serif font-light text-base text-white-dim text-center mb-8 leading-relaxed">
                <em className="italic">&ldquo;{confirmEliminar.title}&rdquo;</em> será eliminado permanentemente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmEliminar(null)}
                  className="flex-1 py-3 border border-gold-faint hover:border-gold-dim font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-dim hover:text-white transition-all duration-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleEliminar(confirmEliminar)}
                  className="flex-1 py-3 font-sans text-[11px] font-semibold uppercase tracking-eyebrow transition-all duration-300"
                  style={{
                    background: 'rgba(160, 74, 58, 0.15)',
                    border: '1px solid rgba(160, 74, 58, 0.5)',
                    color: '#A04A3A',
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================
            Header de sección
            ============================================ */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
            <span className="font-sans text-[11px] font-medium uppercase tracking-eyebrow-wide text-gold">
              {category === 'BIBLIOTECA' ? 'Biblioteca' : 'Formaciones'}
            </span>
            <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
          </div>
          <h1
            className="font-serif font-light text-white mb-6"
            style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
          >
            {titulo}
          </h1>
          <p className="font-serif font-light text-white-dim max-w-xl mx-auto leading-relaxed" style={{ fontSize: 'clamp(18px, 1.4vw, 22px)' }}>
            {category === 'BIBLIOTECA'
              ? 'Artículos, guías y recursos para tu camino.'
              : 'Materiales y programas de formación.'}
          </p>
        </div>

        {/* ============================================
            Barra de acciones: contador + Subir archivo
            ============================================ */}
        <div className="flex items-center justify-between mb-10">
          <p className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
            {!loading && recursos.length > 0 && `${recursos.length} recurso${recursos.length !== 1 ? 's' : ''}`}
          </p>
          {esTerapeuta && (
            <button
              onClick={() => navigate('/subir-recurso')}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold-dim hover:bg-gold hover:border-gold hover:text-navy font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-400 ease-expo-out"
            >
              <PlusIcon />
              <span>Subir archivo</span>
            </button>
          )}
        </div>

        {/* ============================================
            Estados
            ============================================ */}
        {loading && (
          <div className="flex justify-center py-20">
            <div
              className="w-8 h-8 border-2 border-gold-faint border-t-gold rounded-full animate-spin"
              aria-label="Cargando"
            />
          </div>
        )}

        {error && (
          <div
            className="mb-6 px-5 py-4 flex items-start gap-3"
            style={{
              borderTop: '1px solid rgba(160, 74, 58, 0.4)',
              borderBottom: '1px solid rgba(160, 74, 58, 0.4)',
              background: 'rgba(160, 74, 58, 0.08)',
            }}
            role="alert"
          >
            <AlertCircle className="flex-shrink-0 mt-0.5" style={{ color: '#A04A3A' }} />
            <p className="flex-1 font-serif font-light text-base leading-relaxed" style={{ color: '#A04A3A' }}>
              {error}
            </p>
            <button
              onClick={cargarRecursos}
              className="font-sans text-[11px] uppercase tracking-eyebrow underline underline-offset-4 hover:opacity-80 transition-opacity duration-300 flex-shrink-0"
              style={{ color: '#A04A3A' }}
            >
              Reintentar
            </button>
          </div>
        )}

        {actionError && (
          <div
            className="mb-6 px-5 py-4 flex items-start gap-3"
            style={{
              borderTop: '1px solid rgba(160, 74, 58, 0.4)',
              borderBottom: '1px solid rgba(160, 74, 58, 0.4)',
              background: 'rgba(160, 74, 58, 0.08)',
            }}
            role="alert"
          >
            <AlertCircle className="flex-shrink-0 mt-0.5" style={{ color: '#A04A3A' }} />
            <p className="flex-1 font-serif font-light text-base leading-relaxed" style={{ color: '#A04A3A' }}>
              {actionError}
            </p>
            <button
              onClick={() => setActionError('')}
              aria-label="Cerrar"
              className="hover:opacity-80 transition-opacity duration-300 flex-shrink-0"
              style={{ color: '#A04A3A' }}
            >
              <CloseIcon />
            </button>
          </div>
        )}

        {!loading && !error && recursos.length === 0 && (
          <div className="text-center py-20 space-y-5">
            <DocumentIcon className="mx-auto text-gold-dim w-10 h-10" />
            <p className="font-serif italic font-light text-lg text-white-dim">
              Todavía no hay recursos.
            </p>
          </div>
        )}

        {/* ============================================
            Grid de recursos
            ============================================ */}
        {!loading && !error && recursosPagina.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recursosPagina.map((recurso) => (
                <article
                  key={recurso.id}
                  className="group relative bg-navy-card border border-gold-faint p-7 flex flex-col gap-4 transition-all duration-600 ease-expo-out hover:-translate-y-1 hover:border-gold-dim hover:shadow-card-hover overflow-hidden"
                >
                  {/* Línea superior animada en hover */}
                  <span
                    className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-800 ease-expo-out"
                    aria-hidden="true"
                  />

                  {/* Icono + título + autor */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 border border-gold-dim flex items-center justify-center flex-shrink-0 text-gold">
                      <DocumentIcon />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif font-light text-lg text-white leading-snug">
                        {recurso.title}
                      </h3>
                      {recurso.uploadedByName && (
                        <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mt-2 truncate">
                          {recurso.uploadedByName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Descripción */}
                  {recurso.description && (
                    <p className="font-serif font-light text-sm text-white-dim leading-relaxed line-clamp-3">
                      {recurso.description}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
                    <span className="truncate">{recurso.originalFileName}</span>
                    <span className="flex-shrink-0">·</span>
                    <span className="flex-shrink-0">{formatFileSize(recurso.fileSize)}</span>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-stretch gap-2 mt-auto pt-4 border-t border-gold-faint">
                    <button
                      onClick={() => handleDescargar(recurso)}
                      disabled={descargando[recurso.id]}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-gold-gradient py-2.5 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                      <span>{descargando[recurso.id] ? 'Descargando...' : 'Descargar'}</span>
                      {!descargando[recurso.id] && <span>→</span>}
                    </button>
                    {puedeEliminar(recurso) && (
                      <button
                        onClick={() => setConfirmEliminar(recurso)}
                        disabled={eliminando[recurso.id]}
                        aria-label="Eliminar recurso"
                        title="Eliminar"
                        className="px-3 border border-gold-faint hover:border-[#A04A3A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={eliminando[recurso.id] ? {} : undefined}
                      >
                        <TrashIcon className="text-white-faint group-hover:text-[#A04A3A]" />
                      </button>
                    )}
                  </div>
                </article>
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

export default Recursos;
