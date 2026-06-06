import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  getTherapistBySlug,
  getAvailableDays,
  getAvailableSlots,
  bookAppointment,
  getRatingStatus,
  createRating,
} from '../services/api';

// Componente de estrellas reutilizable — paleta OURO (gold filled / gold-faint empty)
// Coherente con MiniEstrellas de Terapeutas.js
const Estrellas = ({ score, max = 5, size = 'md', interactive = false, onSelect }) => {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-7 h-7' };
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = i < score;
        return (
          <svg
            key={i}
            className={`${sizes[size]} ${filled ? 'text-gold' : 'text-gold-faint'} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform duration-300' : ''}`}
            fill={filled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            onClick={() => interactive && onSelect && onSelect(i + 1)}
            aria-hidden="true"
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
  const { slug } = useParams();
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

  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
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
    getTherapistBySlug(slug)
      .then(setTherapist)
      .catch(() => setError('No se pudo cargar el perfil del terapeuta.'))
      .finally(() => setLoading(false));
  }, [slug]);

  // Cargar estado de calificación cuando hay usuario y terapeuta cargados
  useEffect(() => {
    if (currentUser && therapist && !isOwnProfile) {
      getRatingStatus(therapist.id)
        .then(setRatingEstado)
        .catch(() => setRatingEstado(null));
    }
  }, [therapist, currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-seleccionar especialidad si hay exactamente una
  useEffect(() => {
    if (therapist?.specialties?.length === 1) {
      setSelectedSpecialty(therapist.specialties[0].name);
    }
  }, [therapist]);

  // Cargar días disponibles cuando cambia mes, terapeuta o especialidad seleccionada
  useEffect(() => {
    if (!therapist) return;
    setLoadingDays(true);
    setSelectedDate(null);
    setSelectedSlot(null);
    setAvailableSlots([]);
    setBookingSuccess('');
    setBookingError('');
    getAvailableDays(therapist.id, calYear, calMonth, selectedSpecialty)
      .then(setAvailableDays)
      .catch(() => setAvailableDays([]))
      .finally(() => setLoadingDays(false));
  }, [therapist, calYear, calMonth, selectedSpecialty]);

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
      const slots = await getAvailableSlots(therapist.id, dateStr, selectedSpecialty);
      setAvailableSlots(slots);
    } catch {
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBook = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/terapeutas/${slug}` } });
      return;
    }
    if (!selectedSlot) return;
    setBooking(true);
    setBookingError('');
    try {
      const result = await bookAppointment({ timeSlotId: selectedSlot.id, specialtyName: selectedSpecialty });

      // Si hay URL de pago, redirigir a Mercado Pago
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }

      // Sin precio (sesión gratuita): mostrar éxito directo
      setBookingSuccess('¡Turno reservado con éxito!');
      setSelectedSlot(null);
      const [newDays, newSlots] = await Promise.all([
        getAvailableDays(therapist.id, calYear, calMonth, selectedSpecialty),
        getAvailableSlots(therapist.id, selectedDate, selectedSpecialty),
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
      await createRating({
        therapistId: therapist.id,
        score: ratingSeleccionado,
        comment: ratingComentario.trim() || null,
      });
      setRatingExito('¡Gracias por tu calificación!');
      setRatingEstado({ puedeCalificar: false, calificacionExistente: { score: ratingSeleccionado, comment: ratingComentario } });
      // Refrescar el promedio del terapeuta
      getTherapistBySlug(slug).then(setTherapist).catch(() => {});
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

  if (error || !therapist) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
          <div
            className="inline-block px-6 py-4"
            style={{
              borderTop: '1px solid rgba(160, 74, 58, 0.4)',
              borderBottom: '1px solid rgba(160, 74, 58, 0.4)',
              background: 'rgba(160, 74, 58, 0.08)',
            }}
            role="alert"
          >
            <p className="font-serif font-light text-base text-white">
              {error || 'Terapeuta no encontrado.'}
            </p>
          </div>
          <Link
            to="/terapeutas"
            className="group inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold hover:text-gold-bright transition-colors duration-300"
          >
            <span className="transition-transform duration-400 ease-expo-out group-hover:-translate-x-2">←</span>
            <span>Volver a terapeutas</span>
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-container mx-auto px-6 lg:px-10 pt-32 lg:pt-40 pb-24 w-full">

        {/* Breadcrumb */}
        <Link
          to="/terapeutas"
          className="group inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-faint hover:text-gold transition-colors duration-300 mb-12"
        >
          <span className="transition-transform duration-400 ease-expo-out group-hover:-translate-x-2">←</span>
          <span>Volver a terapeutas</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Columna izquierda: perfil ── */}
          <div className="lg:col-span-1">
            <div className="bg-navy-card border border-gold-faint p-8 text-center lg:sticky lg:top-28">
              {/* Avatar */}
              {therapist.photoUrl ? (
                <img
                  src={therapist.photoUrl}
                  alt={therapist.userFullName}
                  className="w-28 h-28 rounded-full object-cover mx-auto border border-gold-faint mb-6"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gold-gradient flex items-center justify-center mx-auto mb-6">
                  <span className="font-serif font-normal text-5xl text-navy">
                    {therapist.userFullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Nombre */}
              <h1 className="font-serif font-light text-2xl text-white mb-3 leading-tight">
                {therapist.userFullName}
              </h1>

              {/* Especialidades como eyebrow */}
              {therapist.specialties?.length > 0 && (
                <p className="font-sans text-[10px] uppercase tracking-eyebrow-wide text-gold-dim">
                  {therapist.specialties.map((s) => s.name).join(' · ')}
                </p>
              )}

              {/* Calificación promedio */}
              {therapist.ratingCount > 0 && (
                <div className="mt-5 flex items-center justify-center gap-2">
                  <Estrellas score={Math.round(therapist.averageRating)} size="sm" />
                  <span className="font-serif font-normal text-base text-white ml-1">
                    {therapist.averageRating?.toFixed(1)}
                  </span>
                  <span className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
                    ({therapist.ratingCount})
                  </span>
                </div>
              )}

              {/* Precio */}
              {therapist.specialties?.length > 0 && (() => {
                const prices = therapist.specialties.map((s) => s.priceAmountCents || 0).filter((p) => p > 0);
                if (prices.length === 0) return null;
                const minPrice = Math.min(...prices);
                const multiPrice = prices.length > 1 && prices.some((p) => p !== prices[0]);
                return (
                  <div className="border-t border-gold-faint mt-6 pt-6">
                    <p className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint mb-1">
                      {multiPrice ? 'Desde' : 'Por sesión'}
                    </p>
                    <p className="font-serif font-normal text-2xl text-white">
                      {(minPrice / 100).toLocaleString('es-AR', {
                        style: 'currency',
                        currency: therapist.priceCurrency || 'ARS',
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* ── Columna derecha: bio + calendario ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Bio */}
            {therapist.bio && (
              <div className="bg-navy-card border border-gold-faint p-8">
                <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold mb-4">
                  Sobre mí
                </p>
                <p className="font-serif font-light text-base text-white-dim leading-relaxed whitespace-pre-line">
                  {therapist.bio}
                </p>
              </div>
            )}

            {/* Sección de calificación */}
            {currentUser && !isOwnProfile && ratingEstado && (
              <div className="bg-navy-card border border-gold-faint p-8">
                <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold mb-6">
                  Calificación
                </p>

                {ratingEstado.calificacionExistente ? (
                  // ───────── Caso A: ya calificó ─────────
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mb-3">
                      Tu calificación
                    </p>
                    <div className="flex items-center gap-2">
                      <Estrellas score={ratingEstado.calificacionExistente.score} size="md" />
                      <span className="font-serif font-normal text-base text-white ml-1">
                        {ratingEstado.calificacionExistente.score}
                      </span>
                      <span className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
                        / 5
                      </span>
                    </div>
                    {ratingEstado.calificacionExistente.comment && (
                      <p className="mt-4 font-serif italic font-light text-base text-white-dim leading-relaxed">
                        &ldquo;{ratingEstado.calificacionExistente.comment}&rdquo;
                      </p>
                    )}
                    {ratingExito && (
                      <div className="mt-5 border border-gold-faint bg-gold-ghost px-5 py-3 flex items-start gap-3" role="status">
                        <span
                          className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-gold shadow-gold-glow-soft"
                          aria-hidden="true"
                        />
                        <p className="font-serif font-light text-base text-white leading-relaxed">
                          {ratingExito}
                        </p>
                      </div>
                    )}
                  </div>
                ) : ratingEstado.puedeCalificar ? (
                  // ───────── Caso B: puede calificar ─────────
                  <div className="space-y-6">
                    <p className="font-serif font-light text-base text-white-dim leading-relaxed">
                      ¿Cómo fue tu{' '}
                      <em className="italic text-white">experiencia</em> con{' '}
                      <span className="text-white">{therapist.userFullName?.split(' ')[0]}</span>?
                    </p>

                    {/* Selector de estrellas interactivo */}
                    <div className="flex items-center flex-wrap gap-2">
                      <div
                        className="flex items-center gap-1"
                        onMouseLeave={() => setRatingHover(0)}
                      >
                        {[1, 2, 3, 4, 5].map((star) => {
                          const activo = star <= (ratingHover || ratingSeleccionado);
                          return (
                            <svg
                              key={star}
                              className={`w-8 h-8 cursor-pointer transition-transform duration-300 hover:scale-110 ${activo ? 'text-gold' : 'text-gold-faint'}`}
                              fill={activo ? 'currentColor' : 'none'}
                              stroke="currentColor"
                              strokeWidth="1.5"
                              viewBox="0 0 24 24"
                              onMouseEnter={() => setRatingHover(star)}
                              onClick={() => setRatingSeleccionado(star)}
                              aria-label={`Calificar con ${star} estrella${star !== 1 ? 's' : ''}`}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                          );
                        })}
                      </div>
                      {ratingSeleccionado > 0 && (
                        <span className="ml-2 font-sans text-[10px] uppercase tracking-eyebrow-wide text-white-dim">
                          {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][ratingSeleccionado]}
                        </span>
                      )}
                    </div>

                    {/* Textarea underline-only */}
                    <div>
                      <label
                        htmlFor="ratingComentario"
                        className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3"
                      >
                        Comentario
                      </label>
                      <textarea
                        id="ratingComentario"
                        value={ratingComentario}
                        onChange={(e) => setRatingComentario(e.target.value)}
                        placeholder="Opcional"
                        rows={2}
                        className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-base text-white placeholder:text-white-faint placeholder:italic py-3 resize-none transition-colors duration-300"
                      />
                    </div>

                    {/* Error */}
                    {ratingError && (
                      <div
                        className="px-5 py-3 flex items-start gap-3"
                        style={{
                          borderTop: '1px solid rgba(160, 74, 58, 0.4)',
                          borderBottom: '1px solid rgba(160, 74, 58, 0.4)',
                          background: 'rgba(160, 74, 58, 0.08)',
                        }}
                        role="alert"
                      >
                        <span
                          className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full"
                          style={{ background: '#A04A3A' }}
                          aria-hidden="true"
                        />
                        <p className="font-serif font-light text-base text-white leading-relaxed">
                          {ratingError}
                        </p>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      onClick={handleEnviarRating}
                      disabled={!ratingSeleccionado || enviandoRating}
                      className="w-full inline-flex items-center justify-center gap-3 bg-gold-gradient py-3.5 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                      <span>{enviandoRating ? 'Enviando...' : 'Enviar calificación'}</span>
                      {!enviandoRating && ratingSeleccionado > 0 && <span>→</span>}
                    </button>
                  </div>
                ) : (
                  // ───────── Caso C: no puede calificar ─────────
                  <p className="font-serif italic font-light text-base text-white-dim leading-relaxed">
                    Vas a poder calificar después de tu primer turno completado.
                  </p>
                )}
              </div>
            )}

            {/* Calendario + reserva
                data-native-cursor: en grids de slots de turnos respetamos
                el cursor nativo del navegador (auto en zonas vacías,
                pointer en clickables, not-allowed en disabled, text en
                inputs). El cursor custom se oculta dentro de este bloque
                y el CSS sobreescribe el `cursor: none` global. */}
            <div className="bg-navy-card border border-gold-faint p-8" data-native-cursor>
              <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold mb-6">
                Reservar turno
              </p>

              {isOwnProfile && (
                <div className="border-l-2 border-gold pl-5 pr-4 py-4 bg-gold-ghost" role="alert">
                  <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold mb-2">
                    Tu perfil
                  </p>
                  <p className="font-serif font-light text-base text-white leading-relaxed">
                    No podés reservar un turno con vos mismo.
                  </p>
                </div>
              )}

              {!isOwnProfile && (<>
              {/* Selector de especialidad (solo si el terapeuta tiene múltiples especialidades) */}
              {therapist.specialties && therapist.specialties.length > 1 && (
                <div className="mb-8">
                  <label className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3">
                    Tipo de sesión
                  </label>
                  <select
                    value={selectedSpecialty || ''}
                    onChange={(e) => setSelectedSpecialty(e.target.value || null)}
                    style={{ colorScheme: 'dark' }}
                    className="w-full bg-navy-soft/40 border border-gold-faint focus:border-gold-dim focus:outline-none font-serif font-light text-base text-white py-3 px-4 transition-colors duration-300 cursor-pointer"
                  >
                    <option value="">— Elegí un tipo de sesión —</option>
                    {therapist.specialties.map((sp) => (
                      <option key={sp.name} value={sp.name}>
                        {sp.name}{sp.priceAmountCents > 0 ? ` — ${(sp.priceAmountCents / 100).toLocaleString('es-AR', { style: 'currency', currency: therapist.priceCurrency || 'ARS', maximumFractionDigits: 0 })}` : ''}
                      </option>
                    ))}
                  </select>
                  {selectedSpecialty && (() => {
                    const sp = therapist.specialties.find(s => s.name === selectedSpecialty);
                    return sp ? (
                      <p className="mt-2 font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
                        Anticipación mínima: {sp.minBookingLeadHours}h
                      </p>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Bloquear calendario si hay múltiples especialidades y no se eligió ninguna */}
              {therapist.specialties && therapist.specialties.length > 1 && !selectedSpecialty ? (
                <div className="py-12 text-center">
                  <svg className="w-10 h-10 mx-auto mb-4 text-gold-dim" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="font-serif italic font-light text-base text-white-faint">
                    Elegí un tipo de sesión para ver la disponibilidad.
                  </p>
                </div>
              ) : (<>

              {/* Navegación de mes */}
              <div className="flex items-center justify-between mb-6">
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

              {/* Encabezados días semana */}
              <div className="grid grid-cols-7 mb-2">
                {DIAS_SEMANA.map((dia) => (
                  <div key={dia} className="text-center font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim py-2">
                    {dia}
                  </div>
                ))}
              </div>

              {/* Grilla del mes */}
              {loadingDays ? (
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 border-2 border-gold-faint border-t-gold rounded-full animate-spin" aria-label="Cargando" />
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

                    // Mapeo de los 7 estados visuales (ver tabla de aprobación en sesión)
                    let cellClasses = 'flex flex-col items-center justify-center h-12 font-serif font-light text-sm transition-all duration-300 ease-expo-out ';
                    let dotColor = '';
                    let outlineStyle = {};

                    if (isSel && hasSlots && !isPast) {
                      // Estados 4 y 7: seleccionado
                      cellClasses += 'bg-gold text-navy';
                      dotColor = 'bg-navy';
                      if (isToday) {
                        // Estado 7: hoy + seleccionado → outline gold-deep offset
                        outlineStyle = { outline: '1px solid #A8842C', outlineOffset: '1px' };
                      }
                    } else if (isPast) {
                      // Estado 1: pasado
                      cellClasses += 'text-white-faint cursor-not-allowed';
                    } else if (hasSlots) {
                      // Estados 3 y 6: con slots, no seleccionado
                      cellClasses += 'bg-gold-ghost text-gold hover:bg-gold-faint cursor-pointer';
                      if (isToday) cellClasses += ' ring-1 ring-gold-dim'; // Estado 6
                      dotColor = 'bg-gold';
                    } else {
                      // Estados 2 y 5: sin slots, futuro
                      cellClasses += 'text-white-faint cursor-not-allowed';
                      if (isToday) cellClasses += ' ring-1 ring-gold-faint'; // Estado 5
                    }

                    return (
                      <button
                        key={dateStr}
                        onClick={() => !isPast && hasSlots && handleDayClick(dateStr)}
                        disabled={isPast || !hasSlots}
                        className={cellClasses}
                        style={outlineStyle}
                        title={hasSlots && !isPast ? 'Hay horarios disponibles' : ''}
                      >
                        <span>{date.getDate()}</span>
                        {dotColor && (
                          <span className={`w-[3px] h-[3px] rounded-full mt-1 ${dotColor}`} aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Leyenda */}
              <div className="flex items-center justify-center gap-6 mt-5">
                <span className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
                  <span className="w-2.5 h-2.5 bg-gold-ghost border border-gold-dim" aria-hidden="true" />
                  Disponible
                </span>
                <span className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
                  <span className="w-2.5 h-2.5 bg-gold" aria-hidden="true" />
                  Seleccionado
                </span>
              </div>

              {/* Slots del día seleccionado */}
              {selectedDate && (
                <div className="mt-8 pt-8 border-t border-gold-faint">
                  <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mb-3">
                    Día seleccionado
                  </p>
                  <p className="font-serif italic font-light text-base text-white mb-5 capitalize">
                    {formatDateLabel(selectedDate)}
                  </p>

                  {loadingSlots ? (
                    <div className="flex justify-center py-6">
                      <div className="w-5 h-5 border-2 border-gold-faint border-t-gold rounded-full animate-spin" aria-label="Cargando horarios" />
                    </div>
                  ) : displayedSlots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {displayedSlots.map((slot) => {
                        const isSel = selectedSlot?.id === slot.id;
                        return (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(isSel ? null : slot)}
                            className={`py-2.5 font-sans text-[11px] font-medium uppercase tracking-eyebrow border transition-all duration-400 ease-expo-out ${
                              isSel
                                ? 'bg-gold border-gold text-navy'
                                : 'bg-transparent border-gold-dim text-gold hover:bg-gold hover:text-navy'
                            }`}
                          >
                            {slot.startTime.slice(0, 5)}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="font-serif italic font-light text-base text-white-faint text-center py-3">
                      No hay horarios disponibles este día.
                    </p>
                  )}
                </div>
              )}

              {!selectedDate && !loadingDays && (
                <p className="font-serif italic font-light text-sm text-white-faint text-center mt-6">
                  Seleccioná un día disponible para ver los horarios.
                </p>
              )}

              {/* Resumen y botón de reserva */}
              <div className="mt-8 pt-8 border-t border-gold-faint">
                {selectedSlot && (
                  <div className="flex items-center gap-3 mb-5 p-4 bg-gold-ghost border border-gold-faint">
                    <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-serif font-light text-base text-white capitalize">
                      {formatDateLabel(selectedDate)} · {selectedSlot.startTime.slice(0, 5)} hs
                    </span>
                  </div>
                )}

                {bookingSuccess && (
                  <div className="mb-5 border border-gold-faint bg-gold-ghost px-5 py-4 space-y-3" role="status">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-gold shadow-gold-glow-soft" aria-hidden="true" />
                      <p className="font-serif font-light text-base text-white leading-relaxed">
                        {bookingSuccess}
                      </p>
                    </div>
                    <Link
                      to="/mis-turnos"
                      className="group ml-6 inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold hover:text-gold-bright transition-colors duration-300"
                    >
                      <span>Ver mis turnos</span>
                      <span className="transition-transform duration-400 ease-expo-out group-hover:translate-x-2">→</span>
                    </Link>
                  </div>
                )}

                {bookingError && (
                  <div
                    className="mb-5 px-5 py-4 flex items-start gap-3"
                    style={{
                      borderTop: '1px solid rgba(160, 74, 58, 0.4)',
                      borderBottom: '1px solid rgba(160, 74, 58, 0.4)',
                      background: 'rgba(160, 74, 58, 0.08)',
                    }}
                    role="alert"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#A04A3A' }} className="flex-shrink-0 mt-0.5" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="font-serif font-light text-base leading-relaxed" style={{ color: '#A04A3A' }}>
                      {bookingError}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleBook}
                  disabled={!selectedSlot || booking}
                  className="w-full inline-flex items-center justify-center gap-3 bg-gold-gradient py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  <span>
                    {booking
                      ? 'Procesando...'
                      : (therapist.priceAmountCents > 0 ? 'Reservar y pagar' : 'Reservar turno')
                    }
                  </span>
                  {!booking && selectedSlot && <span>→</span>}
                </button>

                {!currentUser && (
                  <p className="text-center font-serif italic font-light text-sm text-white-faint mt-4">
                    <Link to="/login" className="text-gold hover:text-gold-bright transition-colors duration-300 underline underline-offset-2">
                      Iniciá sesión
                    </Link>
                    {' '}para reservar
                  </p>
                )}
              </div>
              </>)}
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
