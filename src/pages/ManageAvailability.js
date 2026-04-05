import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  getTherapistByUserId,
  getTherapistAvailability,
  saveTherapistAvailability,
  getTherapistTimeSlots,
  deleteTimeSlot,
} from '../services/api';

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

// ─── Pagination ───────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <span className="text-sm text-gray-500 font-medium">{page} / {totalPages}</span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────
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
    getTherapistTimeSlots(therapist.id, user.id)
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

    // Validate time ranges
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
      await saveTherapistAvailability(therapist.id, { userId: user.id, slots: slotsData });
      setSuccessMsg('Disponibilidad guardada. Los turnos se generaron para los próximos 60 días.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error al guardar la disponibilidad.');
    } finally {
      setSaving(false);
    }
  };

  // Slot cancellation handlers
  const handleCancelSlot = async (slot) => {
    setConfirmSlot(null);
    setCancellingSlot(slot.id);
    setSlotError('');
    try {
      await deleteTimeSlot(slot.id, user.id);
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
      try { await deleteTimeSlot(slot.id, user.id); } catch { /* continuar */ }
    }
    setSlots((prev) => prev.filter((s) => s.startAt.slice(0, 10) !== fecha));
    setSelectedDate(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  const slotsByDate = groupSlotsByDate(slots);
  const calendarCells = getCalendarCells();
  const selectedDaySlots = selectedDate ? (slotsByDate[selectedDate] || []) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <Navbar />

      {/* ── Modal: cancelar turno individual ── */}
      {confirmSlot && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 text-center mb-1">¿Cancelar este turno?</h3>
            <p className="text-sm text-gray-500 text-center mb-5">
              {formatHora(confirmSlot.startAt)} – {formatHora(confirmSlot.endAt)} hs
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmSlot(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Mantener
              </button>
              <button
                onClick={() => handleCancelSlot(confirmSlot)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
              >
                Cancelar turno
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: cancelar día completo ── */}
      {confirmDia && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 text-center mb-1">¿Cancelar el día completo?</h3>
            <p className="text-sm text-gray-500 text-center capitalize mb-1">{formatDayLabel(confirmDia)}</p>
            <p className="text-sm text-red-500 text-center font-medium mb-5">
              {slotsByDate[confirmDia]?.length} turno{slotsByDate[confirmDia]?.length !== 1 ? 's' : ''} disponible{slotsByDate[confirmDia]?.length !== 1 ? 's' : ''}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDia(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Mantener
              </button>
              <button
                onClick={() => handleCancelDia(confirmDia)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
              >
                Cancelar todos
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestionar disponibilidad</h1>
          <p className="mt-1 text-gray-500">Configurá tu horario semanal y cancelá turnos específicos.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => setTab('plantilla')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              tab === 'plantilla' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Horario semanal
          </button>
          <button
            onClick={() => setTab('slots')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              tab === 'slots' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Cancelar turnos
          </button>
        </div>

        {/* ══════════════════════════════════════
            TAB: Horario semanal
        ══════════════════════════════════════ */}
        {tab === 'plantilla' && (
          <>
            <div className="mb-4 p-4 bg-primary-50 border border-primary-100 rounded-xl text-sm text-primary-700">
              Podés agregar múltiples franjas por día, por ejemplo mañana (9–13) y tarde (15–18).
            </div>

            <div className="space-y-3">
              {DIAS.map(({ db, label }) => {
                const franjas = schedule[db];
                return (
                  <div key={db} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
                        {franjas.length > 0 && (
                          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                            {franjas.length} franja{franjas.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => agregarHorario(db)}
                        className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Agregar
                      </button>
                    </div>

                    {franjas.length === 0 ? (
                      <p className="text-xs text-gray-400">Sin horarios — no disponible este día</p>
                    ) : (
                      <div className="space-y-2">
                        {franjas.map((horario, idx) => {
                          const invalid = horario.startTime && horario.endTime && horario.startTime >= horario.endTime;
                          return (
                            <div key={idx} className={`p-3 rounded-xl ${invalid ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="time"
                                  value={horario.startTime}
                                  onChange={(e) => actualizarHorario(db, idx, 'startTime', e.target.value)}
                                  className="flex-none w-[5.5rem] text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                                />
                                <span className="text-gray-300 text-sm flex-none">–</span>
                                <input
                                  type="time"
                                  value={horario.endTime}
                                  onChange={(e) => actualizarHorario(db, idx, 'endTime', e.target.value)}
                                  className="flex-none w-[5.5rem] text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                                />
                                <select
                                  value={horario.slotDurationMinutes}
                                  onChange={(e) => actualizarHorario(db, idx, 'slotDurationMinutes', Number(e.target.value))}
                                  className="flex-1 min-w-0 text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                                >
                                  {DURACIONES.map((d) => (
                                    <option key={d} value={d}>{d} min</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => quitarHorario(db, idx)}
                                  className="flex-none p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                              {invalid && (
                                <p className="text-xs text-red-500 mt-1.5">La hora de inicio debe ser menor a la de fin</p>
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

            <div className="mt-6">
              {successMsg && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {errorMsg}
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-mystic-500 to-primary-600 hover:from-mystic-600 hover:to-primary-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Guardando...
                  </span>
                ) : 'Guardar disponibilidad'}
              </button>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════
            TAB: Cancelar turnos (calendar view)
        ══════════════════════════════════════ */}
        {tab === 'slots' && (
          <div>
            <div className="mb-5 p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
              Estos son tus turnos libres para los próximos 60 días. Los turnos ya reservados por clientes no aparecen aquí.
            </div>

            {slotError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center justify-between">
                <span>{slotError}</span>
                <button onClick={cargarSlots} className="text-sm underline ml-4 flex-shrink-0">Reintentar</button>
              </div>
            )}

            {loadingSlots ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No hay turnos libres próximos</p>
              </div>
            ) : (
              <>
                {/* ── Calendar card ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Month navigation */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <button
                      onClick={prevMonth}
                      disabled={isPrevDisabled}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-base font-semibold text-gray-800">
                      {MESES[calMonth - 1]} {calYear}
                    </span>
                    <button
                      onClick={nextMonth}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-7 px-3 pt-3">
                    {DIAS_SEMANA.map((d) => (
                      <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1 px-3 pb-3">
                    {calendarCells.map((date, i) => {
                      if (!date) return <div key={`e-${i}`} />;
                      const dateStr = toDateStr(date);
                      const isPast = date < todayBase;
                      const slotsOnDay = slotsByDate[dateStr] || [];
                      const hasSlots = slotsOnDay.length > 0;
                      const isSel = selectedDate === dateStr;
                      const isToday = dateStr === toDateStr(todayBase);

                      let cls = 'flex flex-col items-center justify-center rounded-xl transition-all min-h-[3rem] py-1 ';
                      if (isSel) {
                        cls += 'bg-primary-600 text-white shadow-sm cursor-pointer';
                      } else if (!hasSlots || isPast) {
                        cls += 'text-gray-300 cursor-default';
                        if (isToday && !isPast) cls += ' ring-1 ring-gray-200';
                      } else {
                        cls += 'bg-primary-50 text-primary-700 hover:bg-primary-100 cursor-pointer';
                        if (isToday) cls += ' ring-2 ring-primary-300';
                      }

                      return (
                        <button
                          key={dateStr}
                          onClick={() => hasSlots && !isPast && setSelectedDate(isSel ? null : dateStr)}
                          disabled={!hasSlots || isPast}
                          className={cls}
                        >
                          <span className="text-sm font-medium leading-none">{date.getDate()}</span>
                          {hasSlots && !isPast && (
                            <span className={`text-[10px] font-bold mt-0.5 leading-none ${isSel ? 'text-primary-200' : 'text-primary-400'}`}>
                              {slotsOnDay.length}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-5 pb-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-primary-100 border border-primary-300 inline-block" />
                      Con turnos
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-primary-600 inline-block" />
                      Seleccionado
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-primary-400">N</span>
                      <span>= cantidad de turnos</span>
                    </span>
                  </div>
                </div>

                {/* ── Slots del día seleccionado ── */}
                {selectedDate && (
                  <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 capitalize">
                          {formatDayLabel(selectedDate)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {selectedDaySlots.length} turno{selectedDaySlots.length !== 1 ? 's' : ''} disponible{selectedDaySlots.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {selectedDaySlots.length > 0 && (
                        <button
                          onClick={() => setConfirmDia(selectedDate)}
                          className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium transition-colors px-3 py-2 hover:bg-red-50 rounded-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Cancelar día
                        </button>
                      )}
                    </div>

                    {selectedDaySlots.length === 0 ? (
                      <div className="px-5 py-8 text-center text-sm text-gray-400">
                        No quedan turnos disponibles este día
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {selectedDaySlots.map((slot) => {
                          const cancelling = cancellingSlot === slot.id;
                          return (
                            <div key={slot.id} className="flex items-center justify-between px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-800">
                                  {formatHora(slot.startAt)} – {formatHora(slot.endAt)} hs
                                </span>
                              </div>
                              <button
                                onClick={() => setConfirmSlot(slot)}
                                disabled={cancelling}
                                className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-50 px-3 py-2 hover:bg-red-50 rounded-lg"
                              >
                                {cancelling ? 'Cancelando...' : 'Cancelar'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {!selectedDate && (
                  <p className="text-center text-sm text-gray-400 mt-4">
                    Seleccioná un día para ver y cancelar turnos
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full mt-8 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium"
        >
          Volver al dashboard
        </button>
      </div>
    </div>
  );
};

export default ManageAvailability;
