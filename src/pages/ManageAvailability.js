import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  getTherapistByUserId,
  getTherapistAvailability,
  saveTherapistAvailability,
  getTherapistTimeSlots,
  deleteTimeSlot,
} from '../services/api';

// ---------------------------------------------------------------
// Iconos inline — stroke 1.5px.
// Pendiente reemplazar por lucide-react al sumar la dependencia.
// ---------------------------------------------------------------
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
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </svg>
);

const CalendarIcon = ({ className = '' }) => (
  <svg className={className} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const DIAS = [
  { db: 1, label: 'Lunes' },
  { db: 2, label: 'Martes' },
  { db: 3, label: 'Miércoles' },
  { db: 4, label: 'Jueves' },
  { db: 5, label: 'Viernes' },
  { db: 6, label: 'Sábado' },
  { db: 0, label: 'Domingo' },
];

const DURACIONES = [15, 30, 45, 60];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS_SEMANA = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

const scheduleVacio = () => Object.fromEntries(DIAS.map(({ db }) => [db, []]));

const toDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const groupSlotsByDate = (slots) => {
  const groups = {};
  slots.forEach((slot) => {
    const date = slot.startAt.slice(0, 10);
    if (!groups[date]) groups[date] = [];
    groups[date].push(slot);
  });
  return groups;
};

const formatHora = (isoStr) => {
  const d = new Date(isoStr);
  return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
};

const formatDayLabel = (dateStr) => {
  const [y, m, d] = dateStr.split('-');
  return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
};

// ═══════════════════════════════════════════════════════════════
// ManageAvailability
// ═══════════════════════════════════════════════════════════════
const ManageAvailability = () => {
  const navigate = useNavigate();

  const todayBase = new Date();
  todayBase.setHours(0, 0, 0, 0);

  const [user, setUser] = useState(null);
  const [therapist, setTherapist] = useState(null);
  const [schedule, setSchedule] = useState(scheduleVacio());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [tab, setTab] = useState('plantilla');

  // Slots
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [cancellingSlot, setCancellingSlot] = useState(null);
  const [slotError, setSlotError] = useState('');
  const [confirmSlot, setConfirmSlot] = useState(null);
  const [confirmDia, setConfirmDia] = useState(null);

  // Calendar
  const [calYear, setCalYear] = useState(todayBase.getFullYear());
  const [calMonth, setCalMonth] = useState(todayBase.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('ouro_user');
    if (!userData) { navigate('/login'); return; }
    let parsed;
    try { parsed = JSON.parse(userData); } catch { navigate('/login'); return; }
    if (parsed.role !== 'THERAPIST') { navigate('/dashboard'); return; }
    setUser(parsed);

    getTherapistByUserId(parsed.id)
      .then((t) => {
        setTherapist(t);
        return getTherapistAvailability(t.id);
      })
      .then((availability) => {
        const newSchedule = scheduleVacio();
        availability.forEach(({ dayOfWeek, startTime, endTime, slotDurationMinutes }) => {
          newSchedule[dayOfWeek].push({
            startTime: startTime.slice(0, 5),
            endTime: endTime.slice(0, 5),
            slotDurationMinutes: slotDurationMinutes || 30,
          });
        });
        setSchedule(newSchedule);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const cargarSlots = useCallback(() => {
    if (!therapist || !user) return;
    setLoadingSlots(true);
    setSlotError('');
    getTherapistTimeSlots(therapist.id)
      .then(setSlots)
      .catch((err) => setSlotError(err.response?.data?.message || 'Error al cargar los turnos'))
      .finally(() => setLoadingSlots(false));
  }, [therapist, user]);

  useEffect(() => {
    if (tab === 'slots' && therapist && user) cargarSlots();
  }, [tab, therapist, user, cargarSlots]);

  // Month navigation
  const prevMonth = () => {
    setSelectedDate(null);
    if (calMonth === 1) { setCalYear(y => y - 1); setCalMonth(12); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    setSelectedDate(null);
    if (calMonth === 12) { setCalYear(y => y + 1); setCalMonth(1); }
    else setCalMonth(m => m + 1);
  };

  const isPrevDisabled =
    calYear < todayBase.getFullYear() ||
    (calYear === todayBase.getFullYear() && calMonth <= todayBase.getMonth() + 1);

  const getCalendarCells = () => {
    const firstDay = new Date(calYear, calMonth - 1, 1);
    const lastDay = new Date(calYear, calMonth, 0);
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      cells.push(new Date(calYear, calMonth - 1, d));
    }
    return cells;
  };

  // Plantilla handlers
  const agregarHorario = (dayDb) => {
    setSchedule((prev) => ({
      ...prev,
      [dayDb]: [...prev[dayDb], { startTime: '09:00', endTime: '13:00', slotDurationMinutes: 30 }],
    }));
  };

  const quitarHorario = (dayDb, index) => {
    setSchedule((prev) => ({
      ...prev,
      [dayDb]: prev[dayDb].filter((_, i) => i !== index),
    }));
  };

  const actualizarHorario = (dayDb, index, field, value) => {
    setSchedule((prev) => {
      const updated = [...prev[dayDb]];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [dayDb]: updated };
    });
  };

  const handleSave = async () => {
    if (!therapist) return;

    let hasInvalid = false;
    DIAS.forEach(({ db }) => {
      schedule[db].forEach(({ startTime, endTime }) => {
        if (startTime && endTime && startTime >= endTime) hasInvalid = true;
      });
    });
    if (hasInvalid) {
      setErrorMsg('Revisá los horarios: la hora de inicio debe ser menor a la de fin.');
      return;
    }

    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const slotsData = [];
    DIAS.forEach(({ db }) => {
      schedule[db].forEach(({ startTime, endTime, slotDurationMinutes }) => {
        if (startTime && endTime && startTime < endTime) {
          slotsData.push({ dayOfWeek: db, startTime, endTime, slotDurationMinutes });
        }
      });
    });

    try {
      await saveTherapistAvailability(therapist.id, { slots: slotsData });
      setSuccessMsg('Disponibilidad guardada. Los turnos se generaron para los próximos 60 días.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error al guardar la disponibilidad.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelSlot = async (slot) => {
    setConfirmSlot(null);
    setCancellingSlot(slot.id);
    setSlotError('');
    try {
      await deleteTimeSlot(slot.id);
      setSlots((prev) => prev.filter((s) => s.id !== slot.id));
    } catch (err) {
      setSlotError(err.response?.data?.message || 'No se pudo cancelar el turno.');
    } finally {
      setCancellingSlot(null);
    }
  };

  const handleCancelDia = async (fecha) => {
    setConfirmDia(null);
    const slotsDelDia = slotsByDate[fecha] || [];
    setSlotError('');
    for (const slot of slotsDelDia) {
      try { await deleteTimeSlot(slot.id); } catch { /* continuar */ }
    }
    setSlots((prev) => prev.filter((s) => s.startAt.slice(0, 10) !== fecha));
    setSelectedDate(null);
  };

  // ---------------------------------------------------------------
  // Loading
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
        <Footer />
      </div>
    );
  }

  const slotsByDate = groupSlotsByDate(slots);
  const calendarCells = getCalendarCells();
  const selectedDaySlots = selectedDate ? (slotsByDate[selectedDate] || []) : [];

  // Clase reutilizable para botones de tab
  const tabBtnClass = (active) =>
    `flex-1 py-3 px-4 font-sans text-[11px] font-medium uppercase tracking-eyebrow border transition-all duration-400 ease-expo-out ${
      active
        ? 'bg-gold border-gold text-navy'
        : 'bg-transparent border-gold-faint text-white-dim hover:border-gold-dim hover:text-gold'
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ═══════════════════════════════════════════════
          MODAL — Cancelar turno individual
          ═══════════════════════════════════════════════ */}
      {confirmSlot && (
        <div className="ouro-backdrop fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-deep/80 backdrop-blur-sm">
          <div className="ouro-modal w-full max-w-sm bg-navy-elevated border border-gold-faint p-8 shadow-card-hover">
            <div className="flex items-start gap-3 mb-5">
              <AlertCircle className="flex-shrink-0 mt-0.5" style={{ color: '#A04A3A' }} />
              <p className="font-sans text-[10px] uppercase tracking-eyebrow" style={{ color: '#A04A3A' }}>
                Cancelar turno
              </p>
            </div>
            <h3 className="font-serif font-light text-2xl text-white text-center mb-3">
              Cancelar este turno
            </h3>
            <p className="font-serif italic font-light text-base text-white-dim text-center mb-8">
              {formatHora(confirmSlot.startAt)} – {formatHora(confirmSlot.endAt)} hs
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmSlot(null)}
                className="flex-1 py-3 border border-gold-faint hover:border-gold-dim font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-dim hover:text-white transition-all duration-300"
              >
                Mantener
              </button>
              <button
                onClick={() => handleCancelSlot(confirmSlot)}
                className="flex-1 py-3 font-sans text-[11px] font-semibold uppercase tracking-eyebrow transition-all duration-300"
                style={{
                  background: 'rgba(160, 74, 58, 0.15)',
                  border: '1px solid rgba(160, 74, 58, 0.5)',
                  color: '#A04A3A',
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          MODAL — Cancelar día completo
          ═══════════════════════════════════════════════ */}
      {confirmDia && (
        <div className="ouro-backdrop fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-deep/80 backdrop-blur-sm">
          <div className="ouro-modal w-full max-w-sm bg-navy-elevated border border-gold-faint p-8 shadow-card-hover">
            <div className="flex items-start gap-3 mb-5">
              <AlertCircle className="flex-shrink-0 mt-0.5" style={{ color: '#A04A3A' }} />
              <p className="font-sans text-[10px] uppercase tracking-eyebrow" style={{ color: '#A04A3A' }}>
                Cancelar día completo
              </p>
            </div>
            <h3 className="font-serif font-light text-2xl text-white text-center mb-3 capitalize">
              {formatDayLabel(confirmDia)}
            </h3>
            <p className="font-serif italic font-light text-base text-white-dim text-center mb-8">
              {slotsByDate[confirmDia]?.length} turno{slotsByDate[confirmDia]?.length !== 1 ? 's' : ''} disponible{slotsByDate[confirmDia]?.length !== 1 ? 's' : ''}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDia(null)}
                className="flex-1 py-3 border border-gold-faint hover:border-gold-dim font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-dim hover:text-white transition-all duration-300"
              >
                Mantener
              </button>
              <button
                onClick={() => handleCancelDia(confirmDia)}
                className="flex-1 py-3 font-sans text-[11px] font-semibold uppercase tracking-eyebrow transition-all duration-300"
                style={{
                  background: 'rgba(160, 74, 58, 0.15)',
                  border: '1px solid rgba(160, 74, 58, 0.5)',
                  color: '#A04A3A',
                }}
              >
                Cancelar todos
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 lg:px-10 pt-24 lg:pt-32 pb-24">

        {/* Volver al dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className="group inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-faint hover:text-gold transition-colors duration-300 mb-10"
        >
          <span className="transition-transform duration-400 ease-expo-out group-hover:-translate-x-2">←</span>
          <span>Dashboard</span>
        </button>

        {/* Header */}
        <div className="mb-10">
          <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mb-4">
            Agenda
          </p>
          <h1
            className="font-serif font-light text-white mb-3"
            style={{ fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
          >
            Gestionar disponibilidad
          </h1>
          <p className="font-serif font-light text-white-dim leading-relaxed" style={{ fontSize: 'clamp(15px, 1.1vw, 17px)' }}>
            Configurá tu horario y cancelá turnos puntuales.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setTab('plantilla')}
            className={tabBtnClass(tab === 'plantilla')}
          >
            Horario semanal
          </button>
          <button
            onClick={() => setTab('slots')}
            className={tabBtnClass(tab === 'slots')}
          >
            Cancelar turnos
          </button>
        </div>

        {/* ═══════════════════════════════════════════════
            TAB: Horario semanal (plantilla)
            ═══════════════════════════════════════════════ */}
        {tab === 'plantilla' && (
          <>
            {/* Banner informativo */}
            <div className="mb-6 border-l-2 border-gold pl-5 pr-4 py-4 bg-gold-ghost">
              <p className="font-serif font-light text-base text-white leading-relaxed">
                Podés agregar múltiples franjas por día (ej. mañana 9–13 y tarde 15–18).
              </p>
            </div>

            {/* Lista de días */}
            <div className="space-y-3">
              {DIAS.map(({ db, label }) => {
                const franjas = schedule[db];
                return (
                  <div key={db} className="bg-navy-elevated border border-gold-faint p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="font-serif font-light text-lg text-white">{label}</h3>
                        {franjas.length > 0 && (
                          <span className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim">
                            {franjas.length} franja{franjas.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => agregarHorario(db)}
                        className="inline-flex items-center gap-1.5 font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold hover:text-gold-bright transition-colors duration-300"
                      >
                        <PlusIcon />
                        <span>Agregar</span>
                      </button>
                    </div>

                    {franjas.length === 0 ? (
                      <p className="font-serif italic font-light text-sm text-white-faint">
                        Sin horarios — no disponible este día.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {franjas.map((horario, idx) => {
                          const invalid = horario.startTime && horario.endTime && horario.startTime >= horario.endTime;
                          return (
                            <div
                              key={idx}
                              className="p-3 border bg-navy-soft/30"
                              style={invalid ? {
                                borderColor: 'rgba(160, 74, 58, 0.5)',
                                background: 'rgba(160, 74, 58, 0.06)',
                              } : { borderColor: 'rgba(198, 167, 94, 0.15)' }}
                            >
                              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                <input
                                  type="time"
                                  value={horario.startTime}
                                  onChange={(e) => actualizarHorario(db, idx, 'startTime', e.target.value)}
                                  style={{ colorScheme: 'dark' }}
                                  className="flex-none w-[6rem] bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-base text-white py-1.5 transition-colors duration-300"
                                />
                                <span className="text-gold-dim text-sm flex-none">–</span>
                                <input
                                  type="time"
                                  value={horario.endTime}
                                  onChange={(e) => actualizarHorario(db, idx, 'endTime', e.target.value)}
                                  style={{ colorScheme: 'dark' }}
                                  className="flex-none w-[6rem] bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-base text-white py-1.5 transition-colors duration-300"
                                />
                                <select
                                  value={horario.slotDurationMinutes}
                                  onChange={(e) => actualizarHorario(db, idx, 'slotDurationMinutes', Number(e.target.value))}
                                  style={{ colorScheme: 'dark' }}
                                  className="flex-1 min-w-0 bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-base text-white py-1.5 cursor-pointer transition-colors duration-300"
                                >
                                  {DURACIONES.map((d) => (
                                    <option key={d} value={d}>{d} min</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => quitarHorario(db, idx)}
                                  aria-label="Quitar franja"
                                  className="flex-none p-1.5 text-white-faint hover:text-[#A04A3A] transition-colors duration-300"
                                >
                                  <CloseIcon />
                                </button>
                              </div>
                              {invalid && (
                                <p className="font-serif italic font-light text-sm mt-2" style={{ color: '#A04A3A' }}>
                                  La hora de inicio debe ser menor a la de fin.
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Banners + submit */}
            <div className="mt-8 space-y-4">
              {successMsg && (
                <div className="border border-gold-faint bg-gold-ghost px-5 py-4 flex items-start gap-3" role="status">
                  <span
                    className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-gold shadow-gold-glow-soft"
                    aria-hidden="true"
                  />
                  <p className="font-serif font-light text-base text-white leading-relaxed">
                    {successMsg}
                  </p>
                </div>
              )}
              {errorMsg && (
                <div
                  className="px-5 py-4 flex items-start gap-3"
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
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-3 bg-gold-gradient py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                <span>{saving ? 'Guardando...' : 'Guardar disponibilidad'}</span>
                {!saving && <span>→</span>}
              </button>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════
            TAB: Cancelar turnos (calendario)
            ═══════════════════════════════════════════════ */}
        {tab === 'slots' && (
          // data-native-cursor: este tab es un turnero (calendario + lista
          // de slots). Respetamos el cursor nativo del navegador
          // (auto / pointer / not-allowed) y el cursor custom se oculta
          // dentro de este bloque.
          <div data-native-cursor>
            {/* Banner informativo */}
            <div className="mb-6 border-l-2 border-gold pl-5 pr-4 py-4 bg-gold-ghost">
              <p className="font-serif font-light text-base text-white leading-relaxed">
                Tus turnos libres para los próximos 60 días. Los reservados no aparecen acá.
              </p>
            </div>

            {/* Banner error */}
            {slotError && (
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
                  {slotError}
                </p>
                <button
                  onClick={cargarSlots}
                  className="font-sans text-[11px] uppercase tracking-eyebrow underline underline-offset-4 hover:opacity-80 transition-opacity duration-300 flex-shrink-0"
                  style={{ color: '#A04A3A' }}
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* Loading */}
            {loadingSlots ? (
              <div className="flex justify-center py-16">
                <div
                  className="w-8 h-8 border-2 border-gold-faint border-t-gold rounded-full animate-spin"
                  aria-label="Cargando"
                />
              </div>
            ) : slots.length === 0 ? (
              /* Empty */
              <div className="text-center py-20 space-y-5">
                <CalendarIcon className="mx-auto text-gold-dim" />
                <p className="font-serif italic font-light text-lg text-white-dim">
                  No hay turnos libres.
                </p>
              </div>
            ) : (
              <>
                {/* Calendario */}
                <div className="bg-navy-elevated border border-gold-faint">

                  {/* Navegación de mes */}
                  <div className="flex items-center justify-between p-5 border-b border-gold-faint">
                    <button
                      onClick={prevMonth}
                      disabled={isPrevDisabled}
                      aria-label="Mes anterior"
                      className="p-2 border border-gold-dim text-gold hover:bg-gold hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gold transition-all duration-400 ease-expo-out"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <span className="font-serif font-light text-xl text-white capitalize">
                      {MESES[calMonth - 1]} {calYear}
                    </span>

                    <button
                      onClick={nextMonth}
                      aria-label="Mes siguiente"
                      className="p-2 border border-gold-dim text-gold hover:bg-gold hover:text-navy transition-all duration-400 ease-expo-out"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Encabezados de días */}
                  <div className="grid grid-cols-7 px-3 pt-3">
                    {DIAS_SEMANA.map((d) => (
                      <div key={d} className="text-center font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim py-2">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Grilla del mes */}
                  <div className="grid grid-cols-7 gap-1 px-3 pb-3">
                    {calendarCells.map((date, i) => {
                      if (!date) return <div key={`e-${i}`} />;
                      const dateStr = toDateStr(date);
                      const isPast = date < todayBase;
                      const slotsOnDay = slotsByDate[dateStr] || [];
                      const hasSlots = slotsOnDay.length > 0;
                      const isSel = selectedDate === dateStr;
                      const isToday = dateStr === toDateStr(todayBase);

                      let cellClasses = 'flex flex-col items-center justify-center min-h-[3rem] py-1 font-serif font-light text-sm transition-all duration-300 ease-expo-out ';
                      let countColor = 'text-gold';
                      let outlineStyle = {};

                      if (isSel) {
                        cellClasses += 'bg-gold text-navy cursor-pointer';
                        countColor = 'text-navy';
                        if (isToday) {
                          outlineStyle = { outline: '1px solid #A8842C', outlineOffset: '1px' };
                        }
                      } else if (!hasSlots || isPast) {
                        cellClasses += 'text-white-faint cursor-not-allowed';
                        if (isToday && !isPast) cellClasses += ' ring-1 ring-gold-faint';
                      } else {
                        cellClasses += 'bg-gold-ghost text-gold hover:bg-gold-faint cursor-pointer';
                        if (isToday) cellClasses += ' ring-1 ring-gold-dim';
                      }

                      return (
                        <button
                          key={dateStr}
                          onClick={() => hasSlots && !isPast && setSelectedDate(isSel ? null : dateStr)}
                          disabled={!hasSlots || isPast}
                          className={cellClasses}
                          style={outlineStyle}
                        >
                          <span className="leading-none">{date.getDate()}</span>
                          {hasSlots && !isPast && (
                            <span className={`font-sans text-[10px] font-medium tracking-eyebrow mt-1 leading-none ${countColor}`}>
                              {slotsOnDay.length}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Leyenda */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 pb-5 pt-3 border-t border-gold-faint">
                    <span className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
                      <span className="w-2.5 h-2.5 bg-gold-ghost border border-gold-dim" aria-hidden="true" />
                      Con turnos
                    </span>
                    <span className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
                      <span className="w-2.5 h-2.5 bg-gold" aria-hidden="true" />
                      Seleccionado
                    </span>
                    <span className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
                      <span className="font-sans text-[10px] font-medium text-gold">N</span>
                      <span>= cantidad</span>
                    </span>
                  </div>
                </div>

                {/* Slots del día seleccionado */}
                {selectedDate && (
                  <div className="mt-6 bg-navy-elevated border border-gold-faint">
                    <div className="flex items-center justify-between p-5 border-b border-gold-faint flex-wrap gap-3">
                      <div>
                        <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mb-1">
                          Día seleccionado
                        </p>
                        <p className="font-serif font-normal text-base text-white capitalize">
                          {formatDayLabel(selectedDate)}
                        </p>
                        <p className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint mt-1">
                          {selectedDaySlots.length} turno{selectedDaySlots.length !== 1 ? 's' : ''} disponible{selectedDaySlots.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {selectedDaySlots.length > 0 && (
                        <button
                          onClick={() => setConfirmDia(selectedDate)}
                          className="font-sans text-[10px] font-medium uppercase tracking-eyebrow hover:opacity-80 transition-opacity duration-300 underline underline-offset-4"
                          style={{ color: '#A04A3A' }}
                        >
                          Cancelar día
                        </button>
                      )}
                    </div>

                    {selectedDaySlots.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="font-serif italic font-light text-base text-white-faint">
                          No quedan turnos disponibles este día.
                        </p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-gold-faint">
                        {selectedDaySlots.map((slot) => {
                          const cancelling = cancellingSlot === slot.id;
                          return (
                            <li key={slot.id} className="flex items-center justify-between px-5 py-4">
                              <div className="flex items-center gap-3">
                                <span
                                  className="w-1.5 h-1.5 rounded-full bg-gold shadow-gold-glow-soft flex-shrink-0"
                                  aria-hidden="true"
                                />
                                <span className="font-serif font-normal text-base text-white">
                                  {formatHora(slot.startAt)} – {formatHora(slot.endAt)} hs
                                </span>
                              </div>
                              <button
                                onClick={() => setConfirmSlot(slot)}
                                disabled={cancelling}
                                className="font-sans text-[10px] font-medium uppercase tracking-eyebrow hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 underline underline-offset-4"
                                style={{ color: '#A04A3A' }}
                              >
                                {cancelling ? 'Cancelando...' : 'Cancelar'}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}

                {!selectedDate && (
                  <p className="text-center font-serif italic font-light text-sm text-white-faint mt-6">
                    Seleccioná un día para ver los turnos.
                  </p>
                )}
              </>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default ManageAvailability;
