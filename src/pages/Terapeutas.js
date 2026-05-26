import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAllTherapists } from '../services/api';

const MiniStars = ({ score, count }) => {
  if (!count) return null;
  return (
    <div className="flex items-center justify-center gap-1 mt-1.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(score) ? 'text-amber-400' : 'text-gray-200'}`}
             fill={s <= Math.round(score) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
      <span className="text-xs text-gray-400 ml-0.5">({count})</span>
    </div>
  );
};

const PAGE_SIZE = 12;

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-10">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <span className="text-sm text-gray-500 font-medium px-2">{page} de {totalPages}</span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

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

  // Reset to page 1 when filter changes
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        {/* Encabezado */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Nuestros terapeutas</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Encontrá el profesional ideal para tu camino de autoconocimiento y bienestar.
          </p>
        </div>

        {/* Filtro */}
        <div className="max-w-sm mx-auto mb-10">
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Buscar por nombre o especialidad..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm bg-white"
            />
            {filtro && (
              <button
                onClick={() => setFiltro('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={cargarTerapeutas}
              className="text-sm text-mystic-600 hover:text-mystic-700 font-medium underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && terapeutasFiltrados.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <svg className="w-14 h-14 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {filtro ? (
              <>
                <p className="font-medium text-gray-500">Sin resultados para "{filtro}"</p>
                <button onClick={() => setFiltro('')} className="mt-2 text-sm text-primary-600 hover:underline">
                  Limpiar búsqueda
                </button>
              </>
            ) : (
              <p>Todavía no hay terapeutas disponibles.</p>
            )}
          </div>
        )}

        {/* Grid + contador */}
        {!loading && !error && terapeutasFiltrados.length > 0 && (
          <>
            <p className="text-sm text-gray-400 text-center mb-6">
              {terapeutasFiltrados.length} terapeuta{terapeutasFiltrados.length !== 1 ? 's' : ''}
              {filtro ? ` para "${filtro}"` : ''}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {terapeutasPagina.map((therapist) => (
                <Link
                  key={therapist.id}
                  to={`/terapeutas/${therapist.slug || therapist.id}`}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all block"
                >
                  {/* Foto o inicial */}
                  <div className="h-36 sm:h-40 flex items-center justify-center bg-gradient-to-br from-primary-50 to-mystic-50">
                    {therapist.photoUrl ? (
                      <img
                        src={therapist.photoUrl}
                        alt={therapist.userFullName}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-white shadow-md"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-mystic-400 to-primary-500 flex items-center justify-center ring-4 ring-white shadow-md">
                        <span className="text-white font-bold text-3xl">
                          {therapist.userFullName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 text-center">
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base truncate mb-1.5">
                      {therapist.userFullName}
                    </h2>
                    {therapist.specialty && (
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-mystic-100 text-mystic-700 mb-2">
                        {therapist.specialty}
                      </span>
                    )}
                    <MiniStars score={therapist.averageRating} count={therapist.ratingCount} />
                    {therapist.priceAmountCents != null && (
                      <p className="text-sm font-semibold text-primary-600 mt-1">
                        {(therapist.priceAmountCents / 100).toLocaleString('es-AR', {
                          style: 'currency',
                          currency: therapist.priceCurrency || 'ARS',
                          maximumFractionDigits: 0,
                        })}
                        <span className="text-xs font-normal text-gray-400"> / sesión</span>
                      </p>
                    )}
                  </div>
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
