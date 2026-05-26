import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getResources, downloadResource, deleteResource } from '../services/api';

const PAGE_SIZE = 9;

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-8">
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

const Recursos = ({ category, titulo }) => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState({});
  const [deleting, setDeleting] = useState({});
  const [actionError, setActionError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
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

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
  }, [category]);

  const cargarRecursos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResources(category);
      setResources(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los resources');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resource) => {
    setActionError('');
    setDownloading((prev) => ({ ...prev, [resource.id]: true }));
    try {
      const response = await downloadResource(resource.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resource.originalFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error al descargar el archivo');
    } finally {
      setDownloading((prev) => ({ ...prev, [resource.id]: false }));
    }
  };

  const handleDelete = async (resource) => {
    setConfirmDelete(null);
    setActionError('');
    setDeleting((prev) => ({ ...prev, [resource.id]: true }));
    try {
      await deleteResource(resource.id);
      setResources((prev) => prev.filter((r) => r.id !== resource.id));
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error al eliminar el resource');
    } finally {
      setDeleting((prev) => ({ ...prev, [resource.id]: false }));
    }
  };

  const canDelete = (resource) => {
    if (!user) return false;
    return user.role === 'ADMIN' || resource.uploadedByUserId === user.id;
  };

  const esTerapeuta = user?.role === 'THERAPIST' || user?.role === 'ADMIN';

  const totalPages = Math.ceil(resources.length / PAGE_SIZE);
  const resourcesPage = resources.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-mystic-500 to-primary-600 pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{titulo}</h1>
          <p className="text-white/80 text-lg">
            {category === 'BIBLIOTECA'
              ? 'Artículos, guías y resources para tu camino'
              : 'Materiales y programas de formación'}
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* Modal confirmación eliminar */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-center mb-2">¿Eliminar resource?</h3>
              <p className="text-sm text-gray-500 text-center mb-5">
                "{confirmDelete.title}" será eliminado permanentemente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-400">
            {!loading && resources.length > 0 && `${resources.length} resource${resources.length !== 1 ? 's' : ''}`}
          </p>
          {esTerapeuta && (
            <button
              onClick={() => navigate('/subir-resource')}
              className="bg-gradient-to-r from-mystic-500 to-primary-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:from-mystic-600 hover:to-primary-700 transition-all shadow-md flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Subir archivo
            </button>
          )}
        </div>

        {/* Estados */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={cargarRecursos} className="text-sm underline ml-4 flex-shrink-0">Reintentar</button>
          </div>
        )}

        {actionError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center justify-between">
            <span>{actionError}</span>
            <button onClick={() => setActionError('')} className="text-gray-400 hover:text-gray-600 ml-4 flex-shrink-0 p-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {!loading && !error && resources.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No hay resources disponibles todavía</p>
          </div>
        )}

        {/* Grid de resources */}
        {!loading && !error && resourcesPage.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resourcesPage.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3"
                >
                  {/* Icono + título */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 leading-snug">{resource.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{resource.uploadedByName}</p>
                    </div>
                  </div>

                  {/* Descripción */}
                  {resource.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">{resource.description}</p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="truncate">{resource.originalFileName}</span>
                    <span className="flex-shrink-0">·</span>
                    <span className="flex-shrink-0">{formatFileSize(resource.fileSize)}</span>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-50">
                    <button
                      onClick={() => handleDownload(resource)}
                      disabled={downloading[resource.id]}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                    >
                      {downloading[resource.id] ? 'Descargando...' : 'Descargar'}
                    </button>
                    {canDelete(resource) && (
                      <button
                        onClick={() => setConfirmDelete(resource)}
                        disabled={deleting[resource.id]}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Recursos;
