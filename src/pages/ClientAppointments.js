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

const STATUS_CONFIG = {
  RESERVED: { label: 'Reservado', className: 'bg-green-100 text-green-800 border-green-200' },
  PENDING_PAYMENT: { label: 'Pendiente de pago', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  CANCELLED: { label: 'Cancelado', className: 'bg-red-100 text-red-800 border-red-200' },
  COMPLETED: { label: 'Completado', className: 'bg-gray-100 text-gray-600 border-gray-200' },
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

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
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

  useEffect(() => {
    const userData = localStorage.getItem('ouro_user');
    if (!userData) { navigate('/login'); return; }
    let parsed;
    try { parsed = JSON.parse(userData); } catch { navigate('/login'); return; }
    setUser(parsed);

    if (parsed.role === 'THERAPIST') {
      setIsTherapist(true);
      getTherapistByUserId(parsed.id)
        .then((t) => getAppointmentsByTherapist(t.id, parsed.id))
        .then((agenda) => { setProximos(agenda.proximos || []); setPasados(agenda.pasados || []); })
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
      const updated = await cancelAppointment(appointmentId, user.id);
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
      const updated = await completeAppointment(appointmentId, user.id);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  const totalHistorialPages = Math.ceil(pasados.length / PAGE_SIZE);
  const pasadosPagina = pasados.slice((historialPage - 1) * PAGE_SIZE, historialPage * PAGE_SIZE);

  const AppointmentCard = ({ appt, isFutureSection }) => {
    const cfg = STATUS_CONFIG[appt.status] || STATUS_CONFIG.RESERVED;
    const canCancel = isFutureSection && appt.status !== 'CANCELLED';
    const canComplete = isTherapist && isFutureSection && appt.status === 'RESERVED';

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        {/* Inline confirmation */}
        {confirmId === appt.id && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700 font-medium mb-3">¿Confirmás que querés cancelar este turno?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Mantener
              </button>
              <button
                onClick={() => handleCancel(appt.id)}
                className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 capitalize leading-snug">
              {formatDatetime(appt.startAt)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isTherapist ? appt.clientFullName : appt.therapistFullName}
            </p>

            {/* Contacto del cliente (solo vista terapeuta) */}
            {isTherapist && (appt.clientPhone || appt.clientEmail) && (
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {appt.clientPhone && (
                  <span className="text-xs text-gray-400">{appt.clientPhone}</span>
                )}
                {appt.clientEmail && (
                  <span className="text-xs text-gray-400">{appt.clientEmail}</span>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 mt-3">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cfg.className}`}>
                {cfg.label}
              </span>
              {appt.priceAmountCents != null && (
                <span className="text-xs text-gray-400">
                  {(appt.priceAmountCents / 100).toLocaleString('es-AR', {
                    style: 'currency', currency: appt.currency || 'ARS',
                  })}
                </span>
              )}
            </div>
          </div>

          {(canCancel || canComplete) && confirmId !== appt.id && (
            <div className="flex flex-col gap-2 flex-shrink-0">
              {canComplete && (
                <button
                  onClick={() => handleComplete(appt.id)}
                  disabled={completingId === appt.id}
                  className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors disabled:opacity-50 px-2 py-1.5 hover:bg-green-50 rounded-lg"
                >
                  {completingId === appt.id ? 'Guardando...' : 'Completado'}
                </button>
              )}
              {canCancel && (
                <button
                  onClick={() => setConfirmId(appt.id)}
                  disabled={cancellingId === appt.id}
                  className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-50 px-2 py-1.5 hover:bg-red-50 rounded-lg"
                >
                  {cancellingId === appt.id ? 'Cancelando...' : 'Cancelar'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isTherapist ? 'Turnos reservados' : 'Mis turnos'}
            </h1>
            <p className="mt-1 text-gray-500">
              {isTherapist ? 'Clientes que reservaron contigo' : 'Tus reservas con terapeutas'}
            </p>
          </div>
          {!isTherapist && (
            <Link
              to="/terapeutas"
              className="text-sm text-mystic-600 hover:text-mystic-700 font-medium transition-colors flex-shrink-0 mt-1"
            >
              Explorar terapeutas
            </Link>
          )}
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Próximos */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Próximos</h2>
            {proximos.length > 0 && (
              <span className="text-sm text-gray-400">{proximos.length} turno{proximos.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {proximos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
              {isTherapist ? (
                <p>No tenés turnos próximos reservados</p>
              ) : (
                <>
                  <p className="mb-3">No tenés turnos próximos</p>
                  <Link
                    to="/terapeutas"
                    className="inline-block text-sm text-primary-600 hover:underline font-medium"
                  >
                    Reservar un turno
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {proximos.map((a) => <AppointmentCard key={a.id} appt={a} isFutureSection={true} />)}
            </div>
          )}
        </div>

        {/* Historial */}
        {pasados.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-800">Historial</h2>
              <span className="text-sm text-gray-400">{pasados.length} turno{pasados.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-3">
              {pasadosPagina.map((a) => <AppointmentCard key={a.id} appt={a} isFutureSection={false} />)}
            </div>
            <Pagination page={historialPage} totalPages={totalHistorialPages} onChange={setHistorialPage} />
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium"
          >
            Volver al dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientAppointments;
