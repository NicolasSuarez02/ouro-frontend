import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  getTherapistById,
  getAvailableDays,
  getAvailableSlots,
  bookAppointment,
  getRatingEstado,
  crearCalificacion,
} from '../services/api';

// Componente de estrellas reutilizable
const Estrellas = ({ score, max = 5, size = 'md', interactive = false, onSelect }) => {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-7 h-7' };
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = i < score;
        return (
          <svg
            key={i}
            className={`${sizes[size]} ${filled ? 'text-amber-400' : 'text-gray-200'} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            fill={filled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            onClick={() => interactive && onSelect && onSelect(i + 1)}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        );
      })}
    </div>
  );
};

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

  // Estado de calificación
  const [ratingEstado, setRatingEstado] = useState(null); // { puedeCalificar, calificacionExistente }
  const [ratingSeleccionado, setRatingSeleccionado] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratingComentario, setRatingComentario] = useState('');
  const [enviandoRating, setEnviandoRating] = useState(false);
  const [ratingExito, setRatingExito] = useState('');
  const [ratingError, setRatingError] = useState('');

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

  // Cargar estado de calificación cuando hay usuario y terapeuta cargados
  useEffect(() => {
    if (currentUser && therapist && !isOwnProfile) {
      getRatingEstado(therapist.id)
        .then(setRatingEstado)
        .catch(() => setRatingEstado(null));
    }
  }, [therapist, currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

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
      const result = await bookAppointment({ timeSlotId: selectedSlot.id });

      // Si hay URL de pago, redirigir a Mercado Pago
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }

      // Sin precio (sesión gratuita): mostrar éxito directo
      setBookingSuccess('¡Turno reservado con éxito!');
      setSelectedSlot(null);
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

  const handleEnviarRating = async () => {
    if (!ratingSeleccionado) return;
    setEnviandoRating(true);
    setRatingError('');
    try {
      await crearCalificacion({
        therapistId: therapist.id,
        score: ratingSeleccionado,
        comment: ratingComentario.trim() || null,
      });
      setRatingExito('¡Gracias por tu calificación!');
      setRatingEstado({ puedeCalificar: false, calificacionExistente: { score: ratingSeleccionado, comment: ratingComentario } });
      // Refrescar el promedio del terapeuta
      getTherapistById(id).then(setTherapist).catch(() => {});
    } catch (err) {
      setRatingError(err.response?.data?.message || 'No se pudo enviar la calificación.');
    } finally {
      setEnviandoRating(false);
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

              {/* Calificación promedio */}
              {therapist.ratingCount > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2">
                    <Estrellas score={Math.round(therapist.averageRating)} size="md" />
                    <span className="text-sm font-semibold text-gray-700">{therapist.averageRating?.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({therapist.ratingCount})</span>
                  </div>
                </div>
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

            {/* Sección de calificación */}
            {currentUser && !isOwnProfile && ratingEstado && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Calificación</h2>

                {ratingEstado.calificacionExistente ? (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Tu calificación:</p>
                    <div className="flex items-center gap-2">
                      <Estrellas score={ratingEstado.calificacionExistente.score} size="md" />
                      <span className="text-sm font-medium text-gray-700">{ratingEstado.calificacionExistente.score}/5</span>
                    </div>
                    {ratingEstado.calificacionExistente.comment && (
                      <p className="mt-2 text-sm text-gray-500 italic">"{ratingEstado.calificacionExistente.comment}"</p>
                    )}
                    {ratingExito && <p className="mt-2 text-sm text-green-600 font-medium">{ratingExito}</p>}
                  </div>
                ) : ratingEstado.puedeCalificar ? (
                  <div>
                    <p className="text-sm text-gray-500 mb-3">¿Cómo fue tu experiencia con {therapist.userFullName?.split(' ')[0]}?</p>

                    {/* Selector de estrellas interactivo */}
                    <div className="flex items-center gap-1 mb-4"
                         onMouseLeave={() => setRatingHover(0)}>
                      {[1, 2, 3, 4, 5].map((star) => {
                        const activo = star <= (ratingHover || ratingSeleccionado);
                        return (
                          <svg
                            key={star}
                            className={`w-8 h-8 cursor-pointer transition-all hover:scale-110 ${activo ? 'text-amber-400' : 'text-gray-200'}`}
                            fill={activo ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            onMouseEnter={() => setRatingHover(star)}
                            onClick={() => setRatingSeleccionado(star)}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                        );
                      })}
                      {ratingSeleccionado > 0 && (
                        <span className="ml-2 text-sm text-gray-500">
                          {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][ratingSeleccionado]}
                        </span>
                      )}
                    </div>

                    <textarea
                      value={ratingComentario}
                      onChange={(e) => setRatingComentario(e.target.value)}
                      placeholder="Comentario opcional..."
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />

                    {ratingError && <p className="mt-2 text-sm text-red-600">{ratingError}</p>}

                    <button
                      onClick={handleEnviarRating}
                      disabled={!ratingSeleccionado || enviandoRating}
                      className={`mt-3 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${ratingSeleccionado && !enviandoRating ? 'bg-gradient-to-r from-mystic-500 to-primary-600 hover:from-mystic-600 hover:to-primary-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                      {enviandoRating ? 'Enviando...' : 'Enviar calificación'}
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">
                    Podrás calificar a este terapeuta una vez que tengas un turno completado con él/ella.
                  </p>
                )}
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
                  {booking
                    ? 'Procesando...'
                    : (therapist.priceAmountCents > 0 ? 'Reservar y pagar' : 'Reservar turno')
                  }
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
