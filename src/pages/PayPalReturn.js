import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PaymentStatusLayout from '../components/PaymentStatusLayout';
import { capturePaypalOrder } from '../services/api';

// PayPal vuelve acá con ?token=<orderId>. Recién ahora se cobra: el backend verifica
// que el horario siga libre, captura y crea el turno. Si se ocupó, no se cobra nada.
const PayPalReturn = ({ cancelled = false }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('token');
  const [state, setState] = useState(cancelled ? 'cancelled' : 'working'); // working | retry | error | cancelled
  const [message, setMessage] = useState('');
  const started = useRef(false);

  const capture = async () => {
    setState('working');
    try {
      const data = await capturePaypalOrder(orderId);
      const id = data.appointment?.id;
      navigate(id ? `/pago/exitoso?appointmentId=${id}` : '/mis-turnos', { replace: true });
    } catch (err) {
      const status = err.response?.status;
      setMessage(err.response?.data?.message || 'No pudimos confirmar el pago.');
      // 503 = PayPal todavía no confirmó: se puede reintentar sin riesgo de cobrar dos veces
      setState(status === 503 || !status ? 'retry' : 'error');
    }
  };

  useEffect(() => {
    if (cancelled || started.current) return;
    started.current = true;
    if (!orderId) {
      setMessage('Falta el identificador del pago de PayPal.');
      setState('error');
      return;
    }
    capture();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (state === 'working') {
    return (
      <PaymentStatusLayout
        variant="pending"
        title="Confirmando tu pago"
        subtitle="Estamos confirmando el pago con PayPal. No cierres esta página."
      >
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-2 border-gold-faint border-t-gold rounded-full animate-spin" aria-label="Cargando" />
        </div>
      </PaymentStatusLayout>
    );
  }

  if (state === 'cancelled') {
    return (
      <PaymentStatusLayout
        variant="failure"
        title="Pago cancelado"
        subtitle="Cancelaste el pago en PayPal. No se te cobró nada y no se reservó ningún turno."
        primaryCta={{ to: '/terapeutas', label: 'Volver a terapeutas' }}
      />
    );
  }

  return (
    <PaymentStatusLayout
      variant={state === 'retry' ? 'pending' : 'failure'}
      title={state === 'retry' ? 'Pago sin confirmar' : 'No se pudo reservar'}
      subtitle={message}
      primaryCta={{ to: '/mis-turnos', label: 'Ver mis turnos' }}
      secondaryCta={{ to: '/terapeutas', label: 'Volver a terapeutas' }}
    >
      {state === 'retry' && (
        <div className="flex justify-center">
          <button
            onClick={capture}
            className="inline-flex items-center gap-3 bg-gold-gradient px-6 py-3 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5"
          >
            Reintentar
          </button>
        </div>
      )}
    </PaymentStatusLayout>
  );
};

export default PayPalReturn;
