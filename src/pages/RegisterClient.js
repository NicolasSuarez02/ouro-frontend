import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '../services/api';
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

const RegisterClient = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [formData, setFormData] = useState({
    dateOfBirth: '',
    timeOfBirth: '',
  });
  const [loading, setLoading] = useState(false);

  // Error con reglas: mínimo 2s visible, fade-out 400ms, sin auto-hide por timer.
  const { error, errorFadeOut, showError, dismissError, clearError } = useDismissibleError();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    dismissError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      showError('Información de usuario no disponible');
      return;
    }

    setLoading(true);

    try {
      const timeWithSeconds = formData.timeOfBirth ? `${formData.timeOfBirth}:00` : '00:00:00';
      const dateTimeOfBirth = formData.dateOfBirth
        ? `${formData.dateOfBirth} ${timeWithSeconds}`
        : null;

      const clientData = {
        userId: user.id,
        dateOfBirth: dateTimeOfBirth,
        timeOfBirth: formData.timeOfBirth ? `${formData.timeOfBirth}:00` : null,
      };

      await createClient(clientData);
      clearError();
      navigate('/success', { state: { user } });
    } catch (err) {
      showError(err.response?.data?.message || 'Error al completar el registro. Intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/success', { state: { user } });
  };

  // ---------------------------------------------------------------
  // Estado: sin usuario en location.state
  // ---------------------------------------------------------------
  if (!user) {
    return (
      <AuthLayout
        eyebrow="No fue posible"
        title={
          <>
            Sesión{' '}
            <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">
              no válida
            </em>
          </>
        }
        subtitle="No pudimos obtener tu información de usuario."
        backTo="/"
        backLabel="Volver al inicio"
      >
        <div className="text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-3 bg-gold-gradient px-10 py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow"
          >
            <span>Volver a registrarse</span>
            <span>→</span>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // ---------------------------------------------------------------
  // Estado: formulario
  // ---------------------------------------------------------------
  return (
    <AuthLayout
      width="lg"
      eyebrow="Casi listo"
      title={
        <>
          Bienvenida,{' '}
          <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">
            {user.fullName?.split(' ')[0] || 'a OURO'}
          </em>
        </>
      }
      subtitle="Completá tu perfil para personalizar tu experiencia."
      showBackLink={false}
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

        {/* Sección: Datos de nacimiento */}
        <div className="space-y-6">
          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold">
                Datos de nacimiento
              </p>
              <p className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
                Opcional
              </p>
            </div>
            <p className="font-serif font-light text-base text-white-dim leading-relaxed">
              Trabajamos con terapias holísticas que incluyen astrología y carta natal. Tu fecha y hora de nacimiento permiten personalizar cada sesión. Podés completarlo ahora o más tarde desde tu perfil.
            </p>
          </div>

          {/* Inputs date + time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3"
              >
                Fecha
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                style={{ colorScheme: 'dark' }}
                className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white py-3 transition-colors duration-300"
              />
            </div>
            <div>
              <label
                htmlFor="timeOfBirth"
                className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3"
              >
                Hora
              </label>
              <input
                id="timeOfBirth"
                name="timeOfBirth"
                type="time"
                value={formData.timeOfBirth}
                onChange={handleChange}
                style={{ colorScheme: 'dark' }}
                className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white py-3 transition-colors duration-300"
              />
            </div>
          </div>
        </div>

        {/* Divisor con línea-gradiente */}
        <div
          className="h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(198, 167, 94, 0.4), transparent)',
          }}
          aria-hidden="true"
        />

        {/* Sección: Tu información */}
        <div className="space-y-5">
          <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold">
            Tu información
          </p>
          <dl className="space-y-4">
            <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-gold-faint">
              <dt className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint flex-shrink-0">
                Email
              </dt>
              <dd className="font-serif font-light text-base text-white text-right break-all">
                {user.email}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-gold-faint">
              <dt className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint flex-shrink-0">
                Teléfono
              </dt>
              <dd className="font-serif font-light text-base text-white text-right">
                {user.phone}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint flex-shrink-0">
                Estado
              </dt>
              <dd className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-gold shadow-gold-glow-soft"
                  aria-hidden="true"
                />
                <span className="font-sans text-[11px] uppercase tracking-eyebrow text-gold">
                  Verificada
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-3 bg-gold-gradient py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            <span>{loading ? 'Guardando...' : 'Completar'}</span>
            {!loading && <span>→</span>}
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 border border-gold-dim hover:bg-gold hover:border-gold hover:text-navy font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-400 ease-expo-out"
          >
            <span>Omitir por ahora</span>
          </button>
        </div>

        <p className="text-center font-serif italic font-light text-sm text-white-faint">
          Podés agregar o editar esta información más tarde desde tu perfil.
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterClient;
