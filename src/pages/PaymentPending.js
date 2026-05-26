import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PaymentStatusLayout from '../components/PaymentStatusLayout';

const PaymentPending = () => {
  const [searchParams] = useSearchParams();
  // appointmentId disponible vía query param — el original lo recibía
  // pero no lo usaba. Lo dejamos disponible por si se necesita después.
  // eslint-disable-next-line no-unused-vars
  const appointmentId = searchParams.get('appointmentId');

  return (
    <PaymentStatusLayout
      variant="pending"
      title="Pago pendiente"
      subtitle="Tu pago está siendo procesado."
      primaryCta={{ to: '/mis-turnos', label: 'Ver mis turnos' }}
      secondaryCta={{ to: '/terapeutas', label: 'Volver a terapeutas' }}
    >
      <div className="border-l-2 border-gold pl-5 pr-4 py-4 bg-gold-ghost" role="status">
        <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold mb-2">
          En espera de confirmación
        </p>
        <p className="font-serif font-light text-base text-white leading-relaxed">
          Tu turno quedó reservado con estado <em className="italic">Pendiente de pago</em>. Una vez acreditado el pago, el turno se confirma automáticamente.
        </p>
      </div>
    </PaymentStatusLayout>
  );
};

export default PaymentPending;
