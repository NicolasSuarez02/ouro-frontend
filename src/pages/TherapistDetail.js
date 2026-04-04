import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  getTherapistById,
  getAvailableDays,
  getAvailableSlots,
  bookAppointment,
} from '../services/api';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const toDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const TherapistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const todayBase = new Date();
  todayBase.setHours(0, 0, 0, 0);

  const [calYear, setCalYear] = useState(todayBase.getFullYear());
  const [calMonth, setCalMonth] = useState(todayBase.getMonth() + 1); // 1-indexed
  const [availableDays, setAvailableDays] = useState([]);
  const [loadingDays, setLoadingDays] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null); // "yyyy-MM-dd"
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); // { id, startTime, endTime }

  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('ouro_user') || 'null');

  // El terapeuta no puede reservar su propio turno
  const isOwnProfile = currentUser && therapist && therapist.userId === currentUser.id;

  // Filtrar slots pasados si el día seleccionado es hoy
  const now = new Date();
  const displayedSlots = selectedDate === toDateStr(todayBase)
    ? availableSlots.filter(slot => {
        const [h, m] = slot.startTime.split(':').map(Number);
        return h * 60 + m > now.getHours() * 60 + now.getMinutes();
      })
    : availableSlots;

  // Cargar perfil del terapeuta
  useEffect(() => {
    getTherapistById(id)
      .then(setTherapist)
      .catch(() => setError('No se pudo cargar el perfil del terapeuta.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Cargar días disponibles cuando cambia mes o terapeuta
  useEffect(() => {
    if (!id) return;
    setLoadingDays(true);
    setSelectedDate(null);
    setSelectedSlot(null);
    setAvailableSlots([]);
    setBookingSuccess('');
    setBookingError('');
    getAvailableDays(id, calYear, calMonth)
      .then(setAvailableDays)
      .catch(() => setAvailableDays([]))
      .finally(() => setLoadingDays(false));
  }, [id, calYear, calMonth]);

  const handleDayClick = async (dateStr) => {
    if (selectedDate === dateStr) {
      setSelectedDate(null);
      setSelectedSlot(null);
      setAvailableSlots([]);
      return;
    }
    setSelectedDate(dateStr);
    setSelectedSlot(null);
    setBookingError('');
    setBookingSuccess('');
    setLoadingSlots(true);
    try {
      const slots = await getAvailableSlots(id, dateStr);
      setAvailableSlots(slots);
    } catch {
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBook = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/terapeutas/${id}` } });
      return;
    }
    if (!selectedSlot) return;
    setBooking(true);
    setBookingError('');
    try {
      await bookAppointment({ timeSlotId: selectedSlot.id, userId: currentUser.id });
      setBookingSuccess('¡Turno reservado con éxito!');
      setSelectedSlot(null);
      // Refrescar días y slots disponibles
      const [newDays, newSlots] = await Promise.all([
        getAvailableDays(id, calYear, calMonth),
        getAvailableSlots(id, selectedDate),
      ]);
      setAvailableDays(newDays);
      setAvailableSlots(newSlots);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'No se pudo reservar el turno.');
    } finally {
      setBooking(false);
    }
  };

  // Navegación de mes
  const prevMonth = () => {
    if (calMonth === 1) { setCalYear(y => y - 1); setCalMonth(12); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 12) { setCalYear(y => y + 1); setCalMonth(1); }
    else setCalMonth(m => m + 1);
  };

  const isPrevDisabled =
    calYear < todayBase.getFullYear() ||
    (calYear === todayBase.getFullYear() && calMonth <= todayBase.getMonth() + 1);

  // Generar celdas del calendario (semana empieza el Lunes)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !therapist) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-500">
          <p>{error || 'Terapeuta no encontrado.'}</p>
          <Link to="/terapeutas" className="text-sm text-mystic-600 hover:text-mystic-700 font-medium underline">
            Volver a terapeutas
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const calendarCells = getCalendarCells();

  const formatDateLabel = (dateStr) => {
    const [y, m, d] = dateStr.split('-');
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">

        {/* Breadcrumb */}
        <Link
          to="/terapeutas"
          className="inline-flex items-center gap-1 text-sm text-mystic-600 hover:text-mystic-700 mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a terapeutas
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Columna izquierda: perfil ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center lg:sticky lg:top-24">
              {therapist.photoUrl ? (
                <img
                  src={therapist.photoUrl}
                  alt={therapist.userFullName}
                  className="w-28 h-28 rounded-full object-cover mx-auto ring-4 ring-primary-50 shadow-md mb-4"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-mystic-400 to-primary-500 flex items-center justify-center mx-auto ring-4 ring-primary-50 shadow-md mb-4">
                  <span className="text-white font-bold text-4xl">
                    {therapist.userFullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <h1 className="text-xl font-bold text-gray-900 mb-2">{therapist.userFullName}</h1>

              {therapist.specialty && (
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-mystic-100 text-mystic-700">
                  {therapist.specialty}
                </span>
              )}

              {therapist.priceAmountCents != null && (
                <div className="border-t border-gray-100 mt-5 pt-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Precio por sesión</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {(therapist.priceAmountCents / 100).toLocaleString('es-AR', {
                      style: 'currency',
                      currency: therapist.priceCurrency || 'ARS',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Columna derecha: bio + calendario ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Bio */}
            {therapist.bio && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Sobre mí</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{therapist.bio}</p>
              </div>
            )}

            {/* Calendario + reserva */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Reservar turno</h2>

              {isOwnProfile && (
                <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 font-medium">
                  Este es tu perfil. No podés reservar un turno con vos mismo.
                </div>
              )}

              {!isOwnProfile && (<>
              {/* Navegación de mes */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  disabled={isPrevDisabled}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Encabezados días semana */}
              <div className="grid grid-cols-7 mb-1">
                {DIAS_SEMANA.map((dia) => (
                  <div key={dia} className="text-center text-xs font-semibold text-gray-400 py-1">
                    {dia}
                  </div>
                ))}
              </div>

              {/* Grilla del mes */}
              {loadingDays ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {calendarCells.map((date, i) => {
                    if (!date) return <div key={`empty-${i}`} />;

                    const dateStr = toDateStr(date);
                    const isPast = date < todayBase;
                    const hasSlots = availableDays.includes(dateStr);
                    const isToday = dateStr === toDateStr(todayBase);
                    const isSel = selectedDate === dateStr;

                    let cellClass = 'flex flex-col items-center justify-center h-10 rounded-xl text-sm font-medium transition-all ';
                    if (isSel) {
                      cellClass += 'bg-primary-600 text-white shadow-sm';
                    } else if (isPast) {
                      cellClass += 'text-gray-300 cursor-not-allowed';
                    } else if (hasSlots) {
                      cellClass += 'bg-primary-50 text-primary-700 hover:bg-primary-100 cursor-pointer';
                      if (isToday) cellClass += ' ring-2 ring-primary-300';
                    } else {
                      cellClass += 'text-gray-400 cursor-not-allowed';
                      if (isToday) cellClass += ' ring-2 ring-gray-200';
                    }

                    return (
                      <button
                        key={dateStr}
                        onClick={() => !isPast && hasSlots && handleDayClick(dateStr)}
                        disabled={isPast || !hasSlots}
                        className={cellClass}
                        title={hasSlots && !isPast ? 'Hay horarios disponibles' : ''}
                      >
                        <span>{date.getDate()}</span>
                        {hasSlots && !isPast && (
                          <span className={`w-1 h-1 rounded-full mt-0.5 ${isSel ? 'bg-white' : 'bg-primary-400'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Leyenda */}
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-primary-100 border border-primary-300 inline-block" />
                  Disponible
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-primary-600 inline-block" />
                  Seleccionado
                </span>
              </div>

              {/* Slots del día seleccionado */}
              {selectedDate && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-3 capitalize">
                    {formatDateLabel(selectedDate)}
                  </p>

                  {loadingSlots ? (
                    <div className="flex justify-center py-4">
                      <div className="w-5 h-5 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    </div>
                  ) : displayedSlots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {displayedSlots.map((slot) => {
                        const isSel = selectedSlot?.id === slot.id;
                        return (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(isSel ? null : slot)}
                            className={`
                              py-2.5 rounded-lg text-sm font-medium border transition-all
                              ${isSel
                                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400 hover:text-primary-600'
                              }
                            `}
                          >
                            {slot.startTime.slice(0, 5)}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-3">
                      No hay horarios disponibles este día.
                    </p>
                  )}
                </div>
              )}

              {!selectedDate && !loadingDays && (
                <p className="text-sm text-gray-400 text-center mt-5">
                  Seleccioná un día disponible para ver los horarios.
                </p>
              )}

              {/* Resumen y botón de reserva */}
              <div className="mt-5 pt-5 border-t border-gray-100">
                {selectedSlot && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-primary-50 rounded-lg">
                    <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-primary-700 capitalize">
                      {formatDateLabel(selectedDate)} · {selectedSlot.startTime.slice(0, 5)} hs
                    </span>
                  </div>
                )}

                {bookingSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                    <p className="font-medium mb-2">{bookingSuccess}</p>
                    <Link
                      to="/mis-turnos"
                      className="inline-flex items-center gap-1 text-green-700 font-semibold underline hover:text-green-800"
                    >
                      Ver mis turnos →
                    </Link>
                  </div>
                )}

                {bookingError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {bookingError}
                  </div>
                )}

                <button
                  onClick={handleBook}
                  disabled={!selectedSlot || booking}
                  className={`
                    w-full py-3 rounded-xl font-semibold text-white transition-all
                    ${selectedSlot && !booking
                      ? 'bg-gradient-to-r from-mystic-500 to-primary-600 hover:from-mystic-600 hover:to-primary-700 shadow-sm'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {booking ? 'Reservando...' : 'Reservar turno'}
                </button>

                {!currentUser && (
                  <p className="text-xs text-center text-gray-400 mt-2">
                    <Link to="/login" className="text-primary-600 hover:underline">Iniciá sesión</Link> para reservar
                  </p>
                )}
              </div>
              </>)}

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TherapistDetail;
