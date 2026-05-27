import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PaymentStatusLayout from '../components/PaymentStatusLayout';

// ---------------------------------------------------------------
// AlertCircle inline — stroke 1.5px. Pendiente migrar a lucide-react.
// ---------------------------------------------------------------
const AlertCircle = ({ className = '', style }) => (
  <svg className={className} style={style} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  // eslint-disable-next-line no-unused-vars
  const appointmentId = searchParams.get('appointmentId');

  return (
    <PaymentStatusLayout
      variant="failure"
      title="Pago no procesado"
      subtitle="No pudimos procesar el pago. Tu turno quedó reservado pero pendiente."
      primaryCta={{ to: '/mis-turnos', label: 'Ver mis turnos' }}
      secondaryCta={{ to: '/terapeutas', label: 'Volver a terapeutas' }}
    >
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
          Podés intentarlo de nuevo desde <em className="italic">"Mis turnos"</em>. El horario seguirá reservado por un tiempo limitado.
        </p>
      </div>
    </PaymentStatusLayout>
  );
};

export default PaymentFailure;
