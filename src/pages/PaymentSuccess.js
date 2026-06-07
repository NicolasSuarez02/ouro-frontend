import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PaymentStatusLayout from '../components/PaymentStatusLayout';
import { getAppointmentById } from '../services/api';

const formatDatetime = (isoStr) => {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return (
    d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) +
    ' hs'
  );
};

// ---------------------------------------------------------------
// Icono inline — stroke 1.5px. Pendiente migrar a lucide-react.
// ---------------------------------------------------------------
const VideoIcon = ({ className = '' }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('ouro_user') || 'null');

  useEffect(() => {
    if (!appointmentId || !user) { setLoading(false); return; }
    getAppointmentById(appointmentId, user.id)
      .then(setAppointment)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [appointmentId]); // eslint-disable-line

  return (
    <PaymentStatusLayout
      variant="success"
      title="Pago confirmado"
      subtitle="Tu turno quedó confirmado."
      primaryCta={{ to: '/mis-turnos', label: 'Ver mis turnos' }}
      secondaryCta={{ to: '/terapeutas', label: 'Explorar más terapeutas' }}
    >
      {loading ? (
        <div className="flex justify-center py-6">
          <div
            className="w-6 h-6 border-2 border-gold-faint border-t-gold rounded-full animate-spin"
            aria-label="Cargando"
          />
        </div>
      ) : appointment ? (
        <div className="space-y-5">
          {/* Datos del turno */}
          <div className="bg-navy-card border border-gold-faint p-6 space-y-5">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mb-2">
                Terapeuta
              </p>
              <p className="font-serif font-normal text-base text-white">
                {appointment.therapistFullName}
              </p>
            </div>

            <div
              className="h-px"
              style={{ background: 'linear-gradient(to right, transparent, rgba(198, 167, 94, 0.4), transparent)' }}
              aria-hidden="true"
            />

            <div>
              <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mb-2">
                Fecha y hora
              </p>
              <p className="font-serif font-normal text-base text-white capitalize">
                {formatDatetime(appointment.startAt)}
              </p>
            </div>

            {appointment.priceAmountCents != null && (
              <>
                <div
                  className="h-px"
                  style={{ background: 'linear-gradient(to right, transparent, rgba(198, 167, 94, 0.4), transparent)' }}
                  aria-hidden="true"
                />
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mb-2">
                    Monto pagado
                  </p>
                  <p className="font-serif font-normal text-base text-white">
                    {(appointment.priceAmountCents / 100).toLocaleString('es-AR', {
                      style: 'currency',
                      currency: appointment.currency || 'ARS',
                    })}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Link de Zoom destacado o aviso pendiente */}
          {appointment.zoomJoinUrl ? (
            <div className="bg-gold-ghost border border-gold-faint p-5">
              <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold mb-4">
                Sesión por Zoom
              </p>
              <a
                href={appointment.zoomJoinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-brand-zoom/40 hover:bg-brand-zoom hover:text-white font-sans text-[10px] font-medium uppercase tracking-eyebrow text-brand-zoom transition-all duration-400 ease-expo-out"
              >
                <VideoIcon />
                <span>Unirse a la sesión</span>
              </a>
              <p className="font-serif italic font-light text-sm text-white-dim mt-4">
                También lo encontrás en "Mis turnos".
              </p>
            </div>
          ) : (
            <div className="border-l-2 border-gold pl-5 pr-4 py-4 bg-gold-ghost" role="status">
              <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold mb-2">
                Próximamente
              </p>
              <p className="font-serif font-light text-base text-white leading-relaxed">
                El link de Zoom estará disponible en "Mis turnos" en unos instantes.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </PaymentStatusLayout>
  );
};

export default PaymentSuccess;
