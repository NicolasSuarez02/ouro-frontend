import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as Isotipo } from '../assets/logo/ouro-isotipo.svg';
import {
  getPendingTherapists,
  approveTherapist,
  rejectTherapist,
  getPendingResources,
  approveResource,
  rejectResource,
  getAllUsersPaginated,
  adminDeleteUser,
} from '../services/api';

// ---------------------------------------------------------------
// Iconos inline — stroke 1.5px.
// Pendiente reemplazar por lucide-react al sumar la dependencia.
// ---------------------------------------------------------------
const SearchIcon = ({ className = '' }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
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

const TERRACOTA = '#A04A3A';

const ROLE_LABELS = { USER: 'Cliente', THERAPIST: 'Terapeuta', ADMIN: 'Admin' };
const APPROVAL_LABELS = { APPROVED: 'Aprobado', PENDING: 'Pendiente', REJECTED: 'Rechazado' };

// Estilos de badge de rol (OURO Operativo)
const roleBadgeClass = (role) => {
  switch (role) {
    case 'ADMIN':     return 'bg-gold text-navy';
    case 'THERAPIST': return 'bg-gold-ghost border border-gold-faint text-gold';
    default:          return 'border border-gold-faint text-white-dim';
  }
};

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
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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
      const data = await getAllUsersPaginated({ search, role: roleFilter, page, size: 20 });
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

  // Render de feedback de acción (aprobar/rechazar)
  const renderFeedback = (feedback) => {
    if (feedback?.loading) {
      return <span className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">Procesando...</span>;
    }
    if (feedback?.success) {
      return <span className="font-sans text-[10px] uppercase tracking-eyebrow text-gold">{feedback.success}</span>;
    }
    if (feedback?.error) {
      return <span className="font-sans text-[10px] uppercase tracking-eyebrow" style={{ color: TERRACOTA }}>{feedback.error}</span>;
    }
    return null;
  };

  // Botones aprobar / rechazar reutilizables
  const ApproveRejectButtons = ({ onApprove, onReject }) => (
    <div className="flex gap-3">
      <button
        onClick={onApprove}
        className="px-5 py-2 border border-gold-dim hover:bg-gold hover:border-gold hover:text-navy font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-400 ease-expo-out"
      >
        Aprobar
      </button>
      <button
        onClick={onReject}
        className="px-5 py-2 font-sans text-[10px] font-medium uppercase tracking-eyebrow hover:opacity-80 transition-opacity duration-300 underline underline-offset-4"
        style={{ color: TERRACOTA }}
      >
        Rechazar
      </button>
    </div>
  );

  const tabs = [
    { key: 'terapeutas', label: 'Terapeutas', badge: therapists.length },
    { key: 'recursos', label: 'Recursos', badge: recursos.length },
    { key: 'usuarios', label: 'Usuarios', badge: 0 },
  ];

  return (
    <div className="min-h-screen flex flex-col">

      {/* ═══════════════════════════════════════════════
          Header propio del panel admin
          ═══════════════════════════════════════════════ */}
      <header className="border-b border-gold-faint">
        <div className="max-w-container mx-auto px-6 lg:px-10 py-5 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3 text-gold">
            <Isotipo className="h-9 w-9 text-gold" aria-hidden="true" />
            <div>
              <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim leading-none mb-1">
                Panel
              </p>
              <span className="font-serif font-light text-lg text-white leading-none">
                Administración
              </span>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden sm:block font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
              {admin.email}
            </span>
            <Link
              to="/"
              className="font-sans text-[10px] font-medium uppercase tracking-eyebrow text-white-faint hover:text-gold transition-colors duration-300"
            >
              Ver sitio
            </Link>
            <button
              onClick={() => { localStorage.removeItem('ouro_user'); localStorage.removeItem('ouro_token'); navigate('/'); }}
              className="font-sans text-[10px] font-medium uppercase tracking-eyebrow text-white-faint hover:text-gold transition-colors duration-300"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════
          Contenido
          ═══════════════════════════════════════════════ */}
      <main className="flex-1 max-w-container mx-auto w-full px-6 lg:px-10 py-12">

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map(({ key, label, badge }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 border font-sans text-[11px] font-medium uppercase tracking-eyebrow transition-all duration-400 ease-expo-out ${
                  active
                    ? 'bg-gold border-gold text-navy'
                    : 'bg-transparent border-gold-faint text-white-dim hover:border-gold-dim hover:text-gold'
                }`}
              >
                <span>{label}</span>
                {badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 ${active ? 'bg-navy/20 text-navy' : 'bg-gold-ghost text-gold'}`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── TAB TERAPEUTAS ── */}
        {tab === 'terapeutas' && (
          <>
            {loading && (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-gold-faint border-t-gold rounded-full animate-spin" aria-label="Cargando" />
              </div>
            )}
            {error && (
              <div
                className="mb-6 px-5 py-4 flex items-start gap-3"
                style={{ borderTop: `1px solid ${TERRACOTA}66`, borderBottom: `1px solid ${TERRACOTA}66`, background: `${TERRACOTA}14` }}
                role="alert"
              >
                <p className="font-serif font-light text-base leading-relaxed" style={{ color: TERRACOTA }}>{error}</p>
              </div>
            )}
            {!loading && !error && therapists.length === 0 && (
              <div className="text-center py-16">
                <p className="font-serif italic font-light text-lg text-white-dim">
                  No hay terapeutas pendientes de aprobación.
                </p>
              </div>
            )}
            <div className="space-y-4">
              {therapists.map((therapist) => {
                const feedback = actionFeedback[therapist.id];
                return (
                  <div key={therapist.id} className="bg-navy-card border border-gold-faint p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-3">
                          {therapist.photoUrl ? (
                            <img src={therapist.photoUrl} alt={therapist.userFullName} className="w-12 h-12 rounded-full object-cover border border-gold-faint flex-shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                              <span className="font-serif font-normal text-lg text-navy">{therapist.userFullName?.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                          <div className="min-w-0">
                            <h2 className="font-serif font-light text-lg text-white leading-tight">{therapist.userFullName}</h2>
                            <p className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint mt-1 truncate">{therapist.userEmail}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 mb-3">
                          {therapist.specialties?.length > 0 && (
                            <span className="font-serif font-light text-sm text-white-dim">
                              <span className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mr-2">Especialidades</span>
                              {therapist.specialties.map((s) => s.name).join(' · ')}
                            </span>
                          )}
                          {therapist.specialties?.length > 0 && (() => {
                            const prices = therapist.specialties.map((s) => s.priceAmountCents || 0).filter((p) => p > 0);
                            if (!prices.length) return null;
                            const min = Math.min(...prices);
                            const multi = prices.some((p) => p !== prices[0]);
                            return (
                              <span className="font-serif font-light text-sm text-white-dim">
                                <span className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mr-2">{multi ? 'Desde' : 'Precio'}</span>
                                {(min / 100).toLocaleString('es-AR', { style: 'currency', currency: therapist.priceCurrency || 'ARS', maximumFractionDigits: 0 })}
                              </span>
                            );
                          })()}
                        </div>
                        {therapist.bio && <p className="font-serif font-light text-sm text-white-dim leading-relaxed line-clamp-2">{therapist.bio}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {feedback ? renderFeedback(feedback) : (
                          <ApproveRejectButtons
                            onApprove={() => handleApprove(therapist.id)}
                            onReject={() => handleReject(therapist.id)}
                          />
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
              <div className="text-center py-16">
                <p className="font-serif italic font-light text-lg text-white-dim">
                  No hay recursos pendientes de aprobación.
                </p>
              </div>
            )}
            <div className="space-y-4">
              {recursos.map((recurso) => {
                const feedback = actionFeedback[`r${recurso.id}`];
                return (
                  <div key={recurso.id} className="bg-navy-card border border-gold-faint p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-[10px] uppercase tracking-eyebrow-wide text-gold-dim mb-2">
                          {recurso.category === 'BIBLIOTECA' ? 'Biblioteca' : 'Formaciones'}
                        </p>
                        <h2 className="font-serif font-light text-lg text-white leading-tight">{recurso.title}</h2>
                        <p className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint mt-2">
                          Subido por {recurso.uploadedByName}
                        </p>
                        {recurso.description && <p className="font-serif font-light text-sm text-white-dim leading-relaxed line-clamp-2 mt-2">{recurso.description}</p>}
                        <p className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint mt-2 truncate">{recurso.originalFileName}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {feedback ? renderFeedback(feedback) : (
                          <ApproveRejectButtons
                            onApprove={() => handleApproveResource(recurso.id)}
                            onReject={() => handleRejectResource(recurso.id)}
                          />
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
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-3">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-dim" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Buscar por nombre o email..."
                    className="w-full pl-11 pr-3 py-2.5 bg-navy-soft/40 border border-gold-faint focus:border-gold-dim focus:outline-none font-serif font-light text-base text-white placeholder:text-white-faint placeholder:italic transition-colors duration-300"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 border border-gold-dim hover:bg-gold hover:border-gold hover:text-navy font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-400 ease-expo-out"
                >
                  Buscar
                </button>
              </form>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{ colorScheme: 'dark' }}
                className="px-4 py-2.5 bg-navy-soft/40 border border-gold-faint focus:border-gold-dim focus:outline-none font-serif font-light text-base text-white cursor-pointer transition-colors duration-300"
              >
                <option value="">Todos los roles</option>
                <option value="USER">Clientes</option>
                <option value="THERAPIST">Terapeutas</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>

            {usuariosError && (
              <div
                className="mb-6 px-5 py-4"
                style={{ borderTop: `1px solid ${TERRACOTA}66`, borderBottom: `1px solid ${TERRACOTA}66`, background: `${TERRACOTA}14` }}
                role="alert"
              >
                <p className="font-serif font-light text-base leading-relaxed" style={{ color: TERRACOTA }}>{usuariosError}</p>
              </div>
            )}

            {usuariosLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-gold-faint border-t-gold rounded-full animate-spin" aria-label="Cargando" />
              </div>
            ) : (
              <>
                <p className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint mb-4">
                  {totalElements} usuario{totalElements !== 1 ? 's' : ''} encontrado{totalElements !== 1 ? 's' : ''}
                </p>

                <div className="bg-navy-card border border-gold-faint">
                  {usuarios.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="font-serif italic font-light text-base text-white-dim">
                        No hay usuarios que coincidan con los filtros.
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gold-faint">
                      {usuarios.map((user) => (
                        <li key={user.id} className="flex items-center justify-between px-5 py-4 gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                              <span className="font-serif font-normal text-sm text-navy">{user.fullName?.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-serif font-light text-base text-white truncate leading-tight">{user.fullName}</p>
                              <p className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint truncate mt-1">{user.email}</p>
                              {user.therapistApprovalStatus && (
                                <span className="inline-block mt-1.5">
                                  {user.therapistApprovalStatus === 'REJECTED' ? (
                                    <span className="font-sans text-[10px] uppercase tracking-eyebrow px-2 py-0.5" style={{ border: `1px solid ${TERRACOTA}66`, color: TERRACOTA }}>
                                      {APPROVAL_LABELS.REJECTED}
                                                                          </span>
                                  ) : (
                                    <span className={`font-sans text-[10px] uppercase tracking-eyebrow px-2 py-0.5 ${
                                      user.therapistApprovalStatus === 'APPROVED'
                                        ? 'bg-gold-ghost border border-gold-faint text-gold'
                                        : 'border border-gold-dim text-gold-dim'
                                    }`}>
                                      {APPROVAL_LABELS[user.therapistApprovalStatus] || user.therapistApprovalStatus}
                                                                          </span>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`font-sans text-[10px] font-medium uppercase tracking-eyebrow px-2 py-0.5 ${roleBadgeClass(user.role)}`}>
                              {ROLE_LABELS[user.role] || user.role}
                            </span>
                            {!user.emailVerified && (
                              <span className="font-sans text-[10px] uppercase tracking-eyebrow px-2 py-0.5 border border-gold-dim text-gold-dim hidden sm:inline-block">
                                Sin verificar
                              </span>
                            )}
                            {user.role !== 'ADMIN' && (
                              deleteConfirm === user.id ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint hidden sm:inline">¿Eliminar?</span>
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    disabled={deleteLoading}
                                    className="px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-eyebrow disabled:opacity-50 transition-all duration-300"
                                    style={{ background: `${TERRACOTA}26`, border: `1px solid ${TERRACOTA}80`, color: TERRACOTA }}
                                  >
                                    {deleteLoading ? '...' : 'Sí'}
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-2.5 py-1 border border-gold-faint hover:border-gold-dim font-sans text-[10px] font-medium uppercase tracking-eyebrow text-white-dim hover:text-white transition-all duration-300"
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirm(user.id)}
                                  aria-label="Eliminar usuario"
                                  title="Eliminar usuario"
                                  className="p-1.5 text-white-faint hover:text-[#A04A3A] transition-colors duration-300"
                                >
                                  <TrashIcon />
                                </button>
                              )
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page === 0}
                      aria-label="Página anterior"
                      className="p-3 border border-gold-dim text-gold hover:bg-gold hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gold transition-all duration-400 ease-expo-out"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="font-sans text-[11px] uppercase tracking-eyebrow text-white-dim px-2">
                      {page + 1} de {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page === totalPages - 1}
                      aria-label="Página siguiente"
                      className="p-3 border border-gold-dim text-gold hover:bg-gold hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gold transition-all duration-400 ease-expo-out"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
