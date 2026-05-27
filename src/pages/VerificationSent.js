import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { resendVerification } from '../services/api';
import AuthLayout from '../components/AuthLayout';

const PASOS = [
  'Abrí tu bandeja de entrada.',
  'Buscá el email de OURO (revisá también tu carpeta de spam).',
  'Hacé clic en el botón "Verificar mi cuenta".',
];

const VerificationSent = () => {
  const location = useLocation();
  const email = location.state?.email || '';
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');

  const handleResend = async () => {
    if (!email) {
      setResendError('Email no disponible');
      return;
    }

    setResending(true);
    setResendError('');
    setResendSuccess(false);

    try {
      await resendVerification(email);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (error) {
      setResendError('Error al reenviar el email. Intentá nuevamente.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      width="lg"
      eyebrow="Verificación"
      title={
        <>
          Revisá tu{' '}
          <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">
            correo
          </em>
        </>
      }
      subtitle="Te enviamos un email para verificar tu cuenta."
      backTo="/"
      backLabel="Volver al inicio"
    >
      <div className="space-y-10">
        {/* Email indicado */}
        {email && (
          <div className="text-center">
            <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mb-3">
              Enviado a
            </p>
            <p className="font-serif font-light text-xl text-white break-all">
              {email}
            </p>
          </div>
        )}

        {/* Divisor con línea-gradiente */}
        <div
          className="h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(198, 167, 94, 0.4), transparent)',
          }}
          aria-hidden="true"
        />

        {/* Instrucciones */}
        <div>
          <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold mb-6 text-center">
            Próximos pasos
          </p>
          <ol className="space-y-5">
            {PASOS.map((paso, idx) => (
              <li key={idx} className="flex items-start gap-5">
                {/* Número en serif italic + gradient */}
                <span
                  className="flex-shrink-0 font-serif italic font-light leading-none bg-gold-gradient bg-clip-text text-transparent"
                  style={{ fontSize: '42px', minWidth: '36px' }}
                  aria-hidden="true"
                >
                  {idx + 1}
                </span>
                <p className="font-serif font-light text-base text-white-dim leading-relaxed pt-1">
                  {paso}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Banner success (dorado) */}
        {resendSuccess && (
          <div
            className="border border-gold-faint bg-gold-ghost px-5 py-4 flex items-start gap-3"
            role="status"
          >
            <span
              className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-gold shadow-gold-glow-soft"
              aria-hidden="true"
            />
            <p className="font-serif font-light text-base text-white leading-relaxed">
              Email reenviado. Revisá tu bandeja de entrada.
            </p>
          </div>
        )}

        {/* Banner error (terracota) */}
        {resendError && (
          <div
            className="px-5 py-4 flex items-start gap-3"
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
              {resendError}
            </p>
          </div>
        )}

        {/* Reenviar email (acción secundaria → outline gold) */}
        <div className="pt-4 border-t border-gold-faint text-center">
          <p className="font-serif font-light text-base text-white-dim mb-5">
            ¿No recibiste el email?
          </p>
          <button
            onClick={handleResend}
            disabled={resending}
            className="inline-flex items-center gap-3 px-8 py-3 border border-gold-dim hover:bg-gold hover:border-gold hover:text-navy font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-400 ease-expo-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gold disabled:hover:border-gold-dim"
          >
            <span>{resending ? 'Reenviando...' : 'Reenviar email'}</span>
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerificationSent;
