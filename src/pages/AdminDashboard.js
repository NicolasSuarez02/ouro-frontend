import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getPendingTherapists,
  approveTherapist,
  rejectTherapist,
  getPendingResources,
  approveResource,
  rejectResource,
  getAllUsersPaginados,
  adminDeleteUser,
} from '../services/api';

const ROLE_LABELS = { USER: 'Cliente', THERAPIST: 'Terapeuta', ADMIN: 'Admin' };
const ROLE_COLORS = {
  USER: 'bg-blue-100 text-blue-700',
  THERAPIST: 'bg-purple-100 text-purple-700',
  ADMIN: 'bg-red-100 text-red-700',
};
const APPROVAL_COLORS = {
  APPROVED: 'bg-green-100 text-green-700',
  PENDING: 'bg-amber-100 text-amber-700',
  REJECTED: 'bg-red-100 text-red-700',
};
const APPROVAL_LABELS = { APPROVED: 'Aprobado', PENDING: 'Pendiente', REJECTED: 'Rechazado' };

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('terapeutas');
  const [therapists, setTherapists] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionFeedback, setActionFeedback] = useState({});
  const [admin, setAdmin] = useState(null);

  // Estado tab usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosLoading, setUsuariosLoading] = useState(false);
  const [usuariosError, setUsuariosError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // id del usuario a confirmar
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('ouro_user');
    if (!userData) { navigate('/login'); return; }
    const user = JSON.parse(userData);
    if (user.role !== 'ADMIN') { navigate('/login'); return; }
    setAdmin(user);
  }, [navigate]);

  useEffect(() => {
    if (admin) {
      cargarPendientes();
      cargarRecursosPendientes();
    }
  }, [admin]); // eslint-disable-line react-hooks/exhaustive-deps

  const cargarUsuarios = useCallback(async () => {
    if (!admin) return;
    setUsuariosLoading(true);
    setUsuariosError('');
    try {
      const data = await getAllUsersPaginados({ search, role: roleFilter, page, size: 20 });
      setUsuarios(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setUsuariosError(err.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setUsuariosLoading(false);
    }
  }, [admin, search, roleFilter, page]);

  useEffect(() => {
    if (tab === 'usuarios') {
      cargarUsuarios();
    }
  }, [tab, cargarUsuarios]);

  // Reset page when filters change
  useEffect(() => { setPage(0); }, [search, roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleDeleteUser = async (userId) => {
    setDeleteLoading(true);
    try {
      await adminDeleteUser(userId);
      setDeleteConfirm(null);
      cargarUsuarios();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar usuario');
    } finally {
      setDeleteLoading(false);
    }
  };

  const cargarPendientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPendingTherapists();
      setTherapists(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar terapeutas pendientes');
    } finally {
      setLoading(false);
    }
  };

  const cargarRecursosPendientes = async () => {
    try {
      const data = await getPendingResources();
      setRecursos(data);
    } catch (err) {
      // silencioso
    }
  };

  const handleApproveResource = async (resourceId) => {
    setActionFeedback((prev) => ({ ...prev, [`r${resourceId}`]: { loading: true } }));
    try {
      await approveResource(resourceId);
      setActionFeedback((prev) => ({ ...prev, [`r${resourceId}`]: { success: 'Aprobado' } }));
      setRecursos((prev) => prev.filter((r) => r.id !== resourceId));
    } catch (err) {
      setActionFeedback((prev) => ({ ...prev, [`r${resourceId}`]: { error: err.response?.data?.message || 'Error al aprobar' } }));
    }
  };

  const handleRejectResource = async (resourceId) => {
    setActionFeedback((prev) => ({ ...prev, [`r${resourceId}`]: { loading: true } }));
    try {
      await rejectResource(resourceId);
      setActionFeedback((prev) => ({ ...prev, [`r${resourceId}`]: { success: 'Rechazado' } }));
      setRecursos((prev) => prev.filter((r) => r.id !== resourceId));
    } catch (err) {
      setActionFeedback((prev) => ({ ...prev, [`r${resourceId}`]: { error: err.response?.data?.message || 'Error al rechazar' } }));
    }
  };

  const handleApprove = async (therapistId) => {
    setActionFeedback((prev) => ({ ...prev, [therapistId]: { loading: true } }));
    try {
      await approveTherapist(therapistId);
      setActionFeedback((prev) => ({ ...prev, [therapistId]: { success: 'Aprobado' } }));
      setTherapists((prev) => prev.filter((t) => t.id !== therapistId));
    } catch (err) {
      setActionFeedback((prev) => ({ ...prev, [therapistId]: { error: err.response?.data?.message || 'Error al aprobar' } }));
    }
  };

  const handleReject = async (therapistId) => {
    setActionFeedback((prev) => ({ ...prev, [therapistId]: { loading: true } }));
    try {
      await rejectTherapist(therapistId);
      setActionFeedback((prev) => ({ ...prev, [therapistId]: { success: 'Rechazado' } }));
      setTherapists((prev) => prev.filter((t) => t.id !== therapistId));
    } catch (err) {
      setActionFeedback((prev) => ({ ...prev, [therapistId]: { error: err.response?.data?.message || 'Error al rechazar' } }));
    }
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-mystic-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Panel de administración</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">{admin.email}</span>
            <button
              onClick={() => { localStorage.removeItem('ouro_user'); localStorage.removeItem('ouro_token'); navigate('/'); }}
              className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {[
            { key: 'terapeutas', label: 'Terapeutas', badge: therapists.length },
            { key: 'recursos', label: 'Recursos', badge: recursos.length },
            { key: 'usuarios', label: 'Usuarios', badge: 0 },
          ].map(({ key, label, badge }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
              {badge > 0 && (
                <span className="ml-1 bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full">{badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB TERAPEUTAS ── */}
        {tab === 'terapeutas' && (
          <>
            {loading && <div className="text-center py-12 text-gray-500">Cargando...</div>}
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
            {!loading && !error && therapists.length === 0 && (
              <div className="text-center py-12 text-gray-400">No hay terapeutas pendientes de aprobación.</div>
            )}
            <div className="space-y-4">
              {therapists.map((therapist) => {
                const feedback = actionFeedback[therapist.id];
                return (
                  <div key={therapist.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          {therapist.photoUrl ? (
                            <img src={therapist.photoUrl} alt={therapist.userFullName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mystic-400 to-primary-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-lg">{therapist.userFullName?.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                          <div>
                            <h2 className="font-semibold text-gray-900">{therapist.userFullName}</h2>
                            <p className="text-sm text-gray-500">{therapist.userEmail}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
                          {therapist.specialty && <span><span className="font-medium">Especialidad:</span> {therapist.specialty}</span>}
                          {therapist.priceAmountCents != null && (
                            <span><span className="font-medium">Precio:</span> {(therapist.priceAmountCents / 100).toLocaleString('es-AR', { style: 'currency', currency: therapist.priceCurrency || 'ARS' })}</span>
                          )}
                        </div>
                        {therapist.bio && <p className="text-sm text-gray-500 line-clamp-2">{therapist.bio}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {feedback?.loading && <span className="text-sm text-gray-400">Procesando...</span>}
                        {feedback?.success && <span className="text-sm text-green-600 font-medium">{feedback.success}</span>}
                        {feedback?.error && <span className="text-sm text-red-600">{feedback.error}</span>}
                        {!feedback && (
                          <div className="flex gap-2">
                            <button onClick={() => handleApprove(therapist.id)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">Aprobar</button>
                            <button onClick={() => handleReject(therapist.id)} className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-colors">Rechazar</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── TAB RECURSOS ── */}
        {tab === 'recursos' && (
          <>
            {!loading && recursos.length === 0 && (
              <div className="text-center py-12 text-gray-400">No hay recursos pendientes de aprobación.</div>
            )}
            <div className="space-y-4">
              {recursos.map((recurso) => {
                const feedback = actionFeedback[`r${recurso.id}`];
                return (
                  <div key={recurso.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${recurso.category === 'BIBLIOTECA' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {recurso.category === 'BIBLIOTECA' ? 'Biblioteca' : 'Formaciones'}
                          </span>
                        </div>
                        <h2 className="font-semibold text-gray-900">{recurso.title}</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Subido por {recurso.uploadedByName}</p>
                        {recurso.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{recurso.description}</p>}
                        <p className="text-xs text-gray-400 mt-1">{recurso.originalFileName}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {feedback?.loading && <span className="text-sm text-gray-400">Procesando...</span>}
                        {feedback?.success && <span className="text-sm text-green-600 font-medium">{feedback.success}</span>}
                        {feedback?.error && <span className="text-sm text-red-600">{feedback.error}</span>}
                        {!feedback && (
                          <div className="flex gap-2">
                            <button onClick={() => handleApproveResource(recurso.id)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">Aprobar</button>
                            <button onClick={() => handleRejectResource(recurso.id)} className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-colors">Rechazar</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── TAB USUARIOS ── */}
        {tab === 'usuarios' && (
          <div>
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Buscar por nombre o email..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">Buscar</button>
              </form>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">Todos los roles</option>
                <option value="USER">Clientes</option>
                <option value="THERAPIST">Terapeutas</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>

            {usuariosError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{usuariosError}</div>
            )}

            {usuariosLoading ? (
              <div className="text-center py-12 text-gray-500">Cargando usuarios...</div>
            ) : (
              <>
                <p className="text-xs text-gray-400 mb-3">{totalElements} usuario{totalElements !== 1 ? 's' : ''} encontrado{totalElements !== 1 ? 's' : ''}</p>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {usuarios.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">No hay usuarios que coincidan con los filtros.</div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {usuarios.map((user) => (
                        <div key={user.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-mystic-400 to-primary-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-sm">{user.fullName?.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">{user.fullName}</p>
                              <p className="text-xs text-gray-400 truncate">{user.email}</p>
                              {user.therapistApprovalStatus && (
                                <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${APPROVAL_COLORS[user.therapistApprovalStatus] || 'bg-gray-100 text-gray-600'}`}>
                                  {APPROVAL_LABELS[user.therapistApprovalStatus] || user.therapistApprovalStatus}
                                  {user.therapistSpecialty ? ` · ${user.therapistSpecialty}` : ''}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-600'}`}>
                              {ROLE_LABELS[user.role] || user.role}
                            </span>
                            {!user.emailVerified && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">Sin verificar</span>
                            )}
                            {user.role !== 'ADMIN' && (
                              deleteConfirm === user.id ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-500">¿Eliminar?</span>
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    disabled={deleteLoading}
                                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50"
                                  >
                                    {deleteLoading ? '...' : 'Sí'}
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded-md transition-colors"
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirm(user.id)}
                                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Eliminar usuario"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-5">
                    <button
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page === 0}
                      className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-sm text-gray-500 font-medium">{page + 1} de {totalPages}</span>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page === totalPages - 1}
                      className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
