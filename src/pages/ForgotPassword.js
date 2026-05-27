import React, { useState } from 'react';
import { forgotPassword } from '../services/api';
import AuthLayout from '../components/AuthLayout';
import useDismissibleError from '../hooks/useDismissibleError';

// ---------------------------------------------------------------
// AlertCircle icon — stroke 1.5px.
// ---------------------------------------------------------------
const AlertCircle = ({ className = '', style }) => (
  <svg className={className} style={style} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // Error con reglas: mínimo 2s visible, fade-out 400ms, sin auto-hide por timer.
  const { error, errorFadeOut, showError, dismissError, clearError } = useDismissibleError();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showError('Ingresá tu email');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      clearError();
      setSent(true);
    } catch {
      showError('Error al enviar el email. Intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------
  // Estado: enlace enviado
  // ---------------------------------------------------------------
  if (sent) {
    return (
      <AuthLayout
        eyebrow="Enlace enviado"
        title={
          <>
            Revisá tu{' '}
            <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">
              correo
            </em>
          </>
        }
        subtitle="Te enviamos las instrucciones para restablecer tu contraseña."
        backTo="/login"
        backLabel="Volver al login"
      >
        <div className="space-y-8 text-center">
          {/* Email indicado */}
          <div>
            <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mb-3">
              Enviado a
            </p>
            <p className="font-serif font-light text-xl text-white break-all">
              {email}
            </p>
          </div>

          {/* Divisor con línea-gradiente dorada */}
          <div
            className="h-px"
            style={{
              background:
                'linear-gradient(to right, transparent, rgba(198, 167, 94, 0.4), transparent)',
            }}
            aria-hidden="true"
          />

          {/* Notas */}
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <span
                className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-gold shadow-gold-glow-soft"
                aria-hidden="true"
              />
              <p className="font-serif font-light text-base text-white-dim leading-relaxed">
                El enlace expira en una hora.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span
                className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-gold shadow-gold-glow-soft"
                aria-hidden="true"
              />
              <p className="font-serif font-light text-base text-white-dim leading-relaxed">
                Revisá también tu carpeta de spam.
              </p>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // ---------------------------------------------------------------
  // Estado: formulario
  // ---------------------------------------------------------------
  return (
    <AuthLayout
      eyebrow="Recuperar"
      title={
        <>
          Restablecer{' '}
          <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">
            contraseña
          </em>
        </>
      }
      subtitle="Ingresá tu email y te enviamos un enlace para crear una nueva."
      backTo="/login"
      backLabel="Volver al login"
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Banner error (terracota) con fade-out controlado */}
        {error && (
          <div
            className={`px-5 py-4 flex items-start gap-3 transition-opacity duration-400 ease-expo-out ${errorFadeOut ? 'opacity-0' : 'opacity-100'}`}
            style={{
              borderTop: '1px solid rgba(160, 74, 58, 0.4)',
              borderBottom: '1px solid rgba(160, 74, 58, 0.4)',
              background: 'rgba(160, 74, 58, 0.08)',
            }}
            role="alert"
          >
            <AlertCircle className="flex-shrink-0 mt-0.5" style={{ color: '#A04A3A' }} />
            <p className="font-serif font-light text-base leading-relaxed" style={{ color: '#A04A3A' }}>
              {error}
            </p>
          </div>
        )}

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              dismissError();
            }}
            placeholder="tu@email.com"
            className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 transition-colors duration-300"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 bg-gold-gradient py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            <span>{loading ? 'Enviando...' : 'Enviar enlace'}</span>
            {!loading && <span>→</span>}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
