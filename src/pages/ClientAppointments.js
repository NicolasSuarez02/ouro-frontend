import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  getAppointmentsByUser,
  getAppointmentsByTherapist,
  getTherapistByUserId,
  cancelAppointment,
  completeAppointment,
} from '../services/api';

const PAGE_SIZE = 5;

// ---------------------------------------------------------------
// STATUS_CONFIG — mapeo de estados a estilos OURO
// RESERVED:        gold filled (positivo confirmado)
// PENDING_PAYMENT: gold-dim outline (esperando)
// CANCELLED:       terracota (negativo)
// COMPLETED:       neutral desaturado (archivado)
// ---------------------------------------------------------------
const STATUS_CONFIG = {
  RESERVED: {
    label: 'Reservado',
    style: {
      background: 'rgba(198, 167, 94, 0.06)',
      border: '1px solid rgba(198, 167, 94, 0.15)',
      color: 'var(--gold)',
    },
  },
  CANCELLED: {
    label: 'Cancelado',
    style: {
      background: 'rgba(160, 74, 58, 0.08)',
      border: '1px solid rgba(160, 74, 58, 0.4)',
      color: '#A04A3A',
    },
  },
  COMPLETED: {
    label: 'Completado',
    style: {
      background: 'transparent',
      border: '1px solid rgba(198, 167, 94, 0.15)',
      color: 'rgba(242, 242, 242, 0.7)',
    },
  },
};

const canJoinMeeting = (startAt) => {
  if (!startAt) return false;
  const start = new Date(startAt);
  const now = new Date();
  const minutesUntilStart = (start - now) / 60000;
  return minutesUntilStart <= 10;
};

const formatDatetime = (isoStr) => {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return (
    d.toLocaleDateString('es-AR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }) +
    ' · ' +
    d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) +
    ' hs'
  );
};

// ---------------------------------------------------------------
// Iconos inline — stroke 1.5px.
// ---------------------------------------------------------------
const AlertCircle = ({ className = '', style }) => (
  <svg className={className} style={style} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const VideoIcon = ({ className = '' }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

// ---------------------------------------------------------------
// Pagination — patrón OURO consolidado
// ---------------------------------------------------------------
const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
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
// ClientAppointments
// ---------------------------------------------------------------
const ClientAppointments = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [proximos, setProximos] = useState([]);
  const [pasados, setPasados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isTherapist, setIsTherapist] = useState(false);
  const [historialPage, setHistorialPage] = useState(1);
  const [proximosCliente, setProximosCliente] = useState([]);
  const [pasadosCliente, setPasadosCliente] = useState([]);
  const [historialClientePage, setHistorialClientePage] = useState(1);

  useEffect(() => {
    const userData = localStorage.getItem('ouro_user');
    if (!userData) { navigate('/login'); return; }
    let parsed;
    try { parsed = JSON.parse(userData); } catch { navigate('/login'); return; }
    setUser(parsed);

    if (parsed.role === 'THERAPIST') {
      setIsTherapist(true);
      Promise.all([
        getTherapistByUserId(parsed.id).then((t) => getAppointmentsByTherapist(t.id)),
        getAppointmentsByUser(parsed.id),
      ])
        .then(([agendaTerapeuta, agendaCliente]) => {
          setProximos(agendaTerapeuta.proximos || []);
          setPasados(agendaTerapeuta.pasados || []);
          setProximosCliente(agendaCliente.proximos || []);
          setPasadosCliente(agendaCliente.pasados || []);
        })
        .catch(() => setErrorMsg('No se pudieron cargar los turnos.'))
        .finally(() => setLoading(false));
    } else {
      getAppointmentsByUser(parsed.id)
        .then((agenda) => { setProximos(agenda.proximos || []); setPasados(agenda.pasados || []); })
        .catch(() => setErrorMsg('No se pudieron cargar tus turnos.'))
        .finally(() => setLoading(false));
    }
  }, [navigate]);

  const handleCancel = async (appointmentId) => {
    setConfirmId(null);
    setCancellingId(appointmentId);
    setErrorMsg('');
    try {
      const updated = await cancelAppointment(appointmentId);
      const updateList = (list) =>
        list.map((a) => (a.id === appointmentId ? { ...a, status: updated.status } : a));
      setProximos(updateList);
      setPasados(updateList);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'No se pudo cancelar el turno.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleComplete = async (appointmentId) => {
    setCompletingId(appointmentId);
    setErrorMsg('');
    try {
      const updated = await completeAppointment(appointmentId);
      const updateList = (list) =>
        list.map((a) => (a.id === appointmentId ? { ...a, status: updated.status } : a));
      setProximos(updateList);
      setPasados(updateList);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'No se pudo completar el turno.');
    } finally {
      setCompletingId(null);
    }
  };

  // ---------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div
            className="w-8 h-8 border-2 border-gold-faint border-t-gold rounded-full animate-spin"
            aria-label="Cargando"
          />
        </div>
      </div>
    );
  }

  const totalHistorialPages = Math.ceil(pasados.length / PAGE_SIZE);
  const pasadosPagina = pasados.slice((historialPage - 1) * PAGE_SIZE, historialPage * PAGE_SIZE);

  // ---------------------------------------------------------------
  // AppointmentCard — sub-componente
  // ---------------------------------------------------------------
  const AppointmentCard = ({ appt, isFutureSection, forceClientView = false }) => {
    const cfg = STATUS_CONFIG[appt.status] || STATUS_CONFIG.RESERVED;
    const actingAsTherapist = isTherapist && !forceClientView;
    const canCancel = isFutureSection && appt.status !== 'CANCELLED';
    const canComplete = actingAsTherapist && isFutureSection && appt.status === 'RESERVED';
    const isConfirming = confirmId === appt.id;

    return (
      <div className="bg-navy-card border border-gold-faint p-6">
        {/* Confirmación inline (reemplaza contenido del card) */}
        {isConfirming ? (
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="flex-shrink-0 mt-0.5" style={{ color: '#A04A3A' }} />
              <p className="font-serif font-light text-base text-white leading-relaxed">
                Confirmás cancelar este turno.
              </p>
            </div>
            <p className="font-serif italic font-light text-sm text-white-dim leading-relaxed pl-7">
              {formatDatetime(appt.startAt)}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-2.5 border border-gold-faint hover:border-gold-dim font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-dim hover:text-white transition-all duration-300"
              >
                Mantener turno
              </button>
              <button
                onClick={() => handleCancel(appt.id)}
                className="flex-1 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-eyebrow transition-all duration-300"
                style={{
                  background: 'rgba(160, 74, 58, 0.15)',
                  border: '1px solid rgba(160, 74, 58, 0.5)',
                  color: '#A04A3A',
                }}
              >
                Confirmar cancelación
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Fecha + hora */}
              <p className="font-serif font-normal text-lg text-white capitalize leading-snug">
                {formatDatetime(appt.startAt)}
              </p>

              {/* Nombre del otro participante */}
              <p className="font-serif font-light text-base text-white-dim mt-1">
                {actingAsTherapist ? appt.clientFullName : appt.therapistFullName}
              </p>

              {/* Contacto del cliente (solo vista terapeuta) */}
              {actingAsTherapist && (appt.clientPhone || appt.clientEmail) && (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {appt.clientPhone && (
                    <span className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
                      {appt.clientPhone}
                    </span>
                  )}
                  {appt.clientEmail && (
                    <span className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
                      {appt.clientEmail}
                    </span>
                  )}
                </div>
              )}

              {/* Badge + precio */}
              <div className="flex items-center gap-3 mt-4">
                <span
                  className="font-sans text-[10px] font-medium uppercase tracking-eyebrow px-2.5 py-1"
                  style={cfg.style}
                >
                  {cfg.label}
                </span>
                {appt.priceAmountCents != null && (
                  <span className="font-serif font-normal text-sm text-white">
                    {(appt.priceAmountCents / 100).toLocaleString('es-AR', {
                      style: 'currency', currency: appt.currency || 'ARS',
                    })}
                  </span>
                )}
              </div>

              {/* Link de Zoom */}
              {isFutureSection && appt.zoomJoinUrl && canJoinMeeting(appt.startAt) && (
                <a
                  href={appt.zoomJoinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 mt-4 px-4 py-2 border border-gold-dim hover:bg-gold hover:text-navy font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-400 ease-expo-out"
                >
                  <VideoIcon />
                  <span>Unirse a la sesión</span>
                </a>
              )}
            </div>

            {/* Acciones */}
            {(canCancel || canComplete) && (
              <div className="flex flex-col gap-2 flex-shrink-0 items-end">
                {canComplete && (
                  <button
                    onClick={() => handleComplete(appt.id)}
                    disabled={completingId === appt.id}
                    className="font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold hover:text-gold-bright transition-colors duration-300 disabled:opacity-50 underline underline-offset-4"
                  >
                    {completingId === appt.id ? 'Guardando...' : 'Marcar completado'}
                  </button>
                )}
                {canCancel && (
                  <button
                    onClick={() => setConfirmId(appt.id)}
                    disabled={cancellingId === appt.id}
                    className="font-sans text-[10px] font-medium uppercase tracking-eyebrow hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 underline underline-offset-4"
                    style={{ color: '#A04A3A' }}
                  >
                    {cancellingId === appt.id ? 'Cancelando...' : 'Cancelar'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ---------------------------------------------------------------
  // Render principal
  // ---------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 lg:px-10 pt-32 lg:pt-40 pb-24">

        {/* Volver al dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className="group inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-faint hover:text-gold transition-colors duration-300 mb-10"
        >
          <span className="transition-transform duration-400 ease-expo-out group-hover:-translate-x-2">←</span>
          <span>Dashboard</span>
        </button>

        {/* Header */}
        <div className="mb-12 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="font-sans text-[11px] font-medium uppercase tracking-eyebrow-wide text-gold mb-4">
              Turnos
            </p>
            <h1
              className="font-serif font-light text-white"
              style={{ fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
            >
              {isTherapist ? 'Turnos reservados' : 'Mis turnos'}
            </h1>
            <p className="mt-3 font-serif font-light text-white-dim leading-relaxed" style={{ fontSize: 'clamp(16px, 1.2vw, 18px)' }}>
              {isTherapist ? (
                'Quienes reservaron sesiones con vos.'
              ) : (
                <>
                  El ritmo de tu{' '}
                  <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">
                    tránsito
                  </em>
                  .
                </>
              )}
            </p>
          </div>

          {!isTherapist && (
            <Link
              to="/terapeutas"
              className="group inline-flex items-center gap-2 font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold hover:text-gold-bright transition-colors duration-300 flex-shrink-0 mt-12 whitespace-nowrap"
            >
              <span>Explorar terapeutas</span>
              <span className="transition-transform duration-400 ease-expo-out group-hover:translate-x-2">→</span>
            </Link>
          )}
        </div>

        {/* Error general */}
        {errorMsg && (
          <div
            className="mb-8 px-5 py-4 flex items-start gap-3"
            style={{
              borderTop: '1px solid rgba(160, 74, 58, 0.4)',
              borderBottom: '1px solid rgba(160, 74, 58, 0.4)',
              background: 'rgba(160, 74, 58, 0.08)',
            }}
            role="alert"
          >
            <AlertCircle className="flex-shrink-0 mt-0.5" style={{ color: '#A04A3A' }} />
            <p className="font-serif font-light text-base leading-relaxed" style={{ color: '#A04A3A' }}>
              {errorMsg}
            </p>
          </div>
        )}

        {/* Próximos */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif font-light text-2xl text-white">
              Próximos
            </h2>
            {proximos.length > 0 && (
              <span className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
                {proximos.length} turno{proximos.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {proximos.length === 0 ? (
            <div className="bg-navy-card border border-gold-faint p-10 text-center">
              {isTherapist ? (
                <p className="font-serif italic font-light text-base text-white-dim">
                  No tenés turnos próximos reservados.
                </p>
              ) : (
                <>
                  <p className="font-serif italic font-light text-base text-white-dim mb-6">
                    No tenés turnos próximos.
                  </p>
                  <Link
                    to="/terapeutas"
                    className="inline-flex items-center gap-3 px-8 py-3 border border-gold-dim hover:bg-gold hover:border-gold hover:text-navy font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-400 ease-expo-out"
                  >
                    <span>Reservar un turno</span>
                    <span>→</span>
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {proximos.map((a) => <AppointmentCard key={a.id} appt={a} isFutureSection={true} />)}
            </div>
          )}
        </section>

        {/* Historial */}
        {pasados.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif font-light text-2xl text-white">
                Historial
              </h2>
              <span className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
                {pasados.length} turno{pasados.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-4">
              {pasadosPagina.map((a) => <AppointmentCard key={a.id} appt={a} isFutureSection={false} />)}
            </div>
            <Pagination page={historialPage} totalPages={totalHistorialPages} onChange={setHistorialPage} />
          </section>
        )}

        {/* Sección "Mis reservas como cliente" — solo para terapeutas */}
        {isTherapist && (proximosCliente.length > 0 || pasadosCliente.length > 0) && (
          <section className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <div
                className="flex-1 h-px"
                style={{
                  background: 'linear-gradient(to right, transparent, rgba(198, 167, 94, 0.4), rgba(198, 167, 94, 0.4))',
                }}
                aria-hidden="true"
              />
              <p className="font-sans text-[10px] uppercase tracking-eyebrow-wide text-gold-dim whitespace-nowrap">
                Mis reservas como cliente
              </p>
              <div
                className="flex-1 h-px"
                style={{
                  background: 'linear-gradient(to left, transparent, rgba(198, 167, 94, 0.4), rgba(198, 167, 94, 0.4))',
                }}
                aria-hidden="true"
              />
            </div>

            {proximosCliente.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-serif font-light text-xl text-white">
                    Próximas
                  </h3>
                  <span className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
                    {proximosCliente.length} sesión{proximosCliente.length !== 1 ? 'es' : ''}
                  </span>
                </div>
                <div className="space-y-4">
                  {proximosCliente.map((a) => (
                    <AppointmentCard key={`cliente-${a.id}`} appt={a} isFutureSection={true} forceClientView={true} />
                  ))}
                </div>
              </div>
            )}

            {pasadosCliente.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-serif font-light text-xl text-white">
                    Historial
                  </h3>
                  <span className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
                    {pasadosCliente.length} sesión{pasadosCliente.length !== 1 ? 'es' : ''}
                  </span>
                </div>
                <div className="space-y-4">
                  {pasadosCliente
                    .slice((historialClientePage - 1) * PAGE_SIZE, historialClientePage * PAGE_SIZE)
                    .map((a) => <AppointmentCard key={`cliente-hist-${a.id}`} appt={a} isFutureSection={false} forceClientView={true} />)}
                </div>
                <Pagination
                  page={historialClientePage}
                  totalPages={Math.ceil(pasadosCliente.length / PAGE_SIZE)}
                  onChange={setHistorialClientePage}
                />
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  );
};

export default ClientAppointments;
