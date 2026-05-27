import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import AuthLayout from '../components/AuthLayout';
import useDismissibleError from '../hooks/useDismissibleError';

// ---------------------------------------------------------------
// Iconos inline — stroke 1.5px.
// ---------------------------------------------------------------
const AlertCircle = ({ className = '', style }) => (
  <svg className={className} style={style} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const EyeIcon = ({ open }) => open ? (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
) : (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

// ---------------------------------------------------------------
// Register
// ---------------------------------------------------------------
const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('ouro_user')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    timeOfBirth: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Error con reglas: mínimo 2s visible, fade-out 400ms, sin auto-hide por timer.
  const { error, errorFadeOut, showError, dismissError, clearError } = useDismissibleError();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    dismissError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      showError('Todos los campos obligatorios deben completarse');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      showError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
      const response = await registerUser({
        email: formData.email,
        fullName,
        phone: formData.phone,
        password: formData.password,
      });

      if (response.success) {
        // Guardar datos de nacimiento para crear el perfil de cliente tras verificar email
        localStorage.setItem('ouro_pending_client', JSON.stringify({
          dateOfBirth: formData.dateOfBirth ? `${formData.dateOfBirth} 00:00:00` : null,
          timeOfBirth: formData.timeOfBirth ? `${formData.timeOfBirth}:00` : null,
        }));

        clearError();
        setSuccess(true);
        setTimeout(() => {
          navigate('/verification-sent', { state: { email: formData.email } });
        }, 2000);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Error al registrarse. Intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------
  // Estado: éxito
  // ---------------------------------------------------------------
  if (success) {
    return (
      <AuthLayout
        eyebrow="Registrada"
        title={
          <>
            Cuenta{' '}
            <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">
              creada
            </em>
          </>
        }
        subtitle="Te enviamos un email de verificación."
        showBackLink={false}
      >
        <div className="space-y-8 text-center">
          {/* Punto dorado con glow centrado como marca de éxito */}
          <div className="flex justify-center">
            <span
              className="block w-3 h-3 rounded-full bg-gold shadow-gold-glow-soft"
              aria-hidden="true"
            />
          </div>

          {/* Email destacado */}
          <div>
            <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mb-3">
              Enviado a
            </p>
            <p className="font-serif font-light text-xl text-white break-all">
              {formData.email}
            </p>
          </div>

          {/* Redirect */}
          <p className="font-serif italic font-light text-base text-white-dim">
            Redirigiendo...
          </p>
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
      eyebrow="Registro"
      title={
        <>
          Crear{' '}
          <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">
            cuenta
          </em>
        </>
      }
      subtitle="Comenzá tu camino hacia el autoconocimiento."
      backTo="/"
      backLabel="Volver al inicio"
    >
      <form onSubmit={handleSubmit} className="space-y-12">
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

        {/* ───────── Sección 1: Datos personales ───────── */}
        <section className="space-y-8">
          <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold">
            Datos personales
          </p>

          {/* Nombre + Apellido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="firstName"
                className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3"
              >
                Nombre
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 transition-colors duration-300"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3"
              >
                Apellido
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Tu apellido"
                className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 transition-colors duration-300"
              />
            </div>
          </div>

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
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 transition-colors duration-300"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label
              htmlFor="phone"
              className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3"
            >
              Teléfono
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+54 11 1234-5678"
              className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 transition-colors duration-300"
            />
          </div>
        </section>

        {/* Divisor con línea-gradiente */}
        <div
          className="h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(198, 167, 94, 0.4), transparent)',
          }}
          aria-hidden="true"
        />

        {/* ───────── Sección 2: Datos de nacimiento ───────── */}
        <section className="space-y-6">
          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold">
                Datos de nacimiento
              </p>
              <p className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
                Opcional
              </p>
            </div>
            <p className="font-serif font-light text-sm text-white-dim leading-relaxed">
              Trabajamos con terapias holísticas que incluyen astrología. Tu fecha y hora de nacimiento permiten personalizar cada sesión.
            </p>
          </div>

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
        </section>

        {/* Divisor */}
        <div
          className="h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(198, 167, 94, 0.4), transparent)',
          }}
          aria-hidden="true"
        />

        {/* ───────── Sección 3: Contraseña ───────── */}
        <section className="space-y-8">
          <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold">
            Contraseña
          </p>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 pr-10 transition-colors duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-0 bottom-3 text-gold-dim hover:text-gold transition-colors duration-300"
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3"
            >
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repetí tu contraseña"
                className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 pr-10 transition-colors duration-300"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                tabIndex={-1}
                aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-0 bottom-3 text-gold-dim hover:text-gold transition-colors duration-300"
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 bg-gold-gradient py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            <span>{loading ? 'Registrando...' : 'Crear cuenta'}</span>
            {!loading && <span>→</span>}
          </button>
        </div>
      </form>

      {/* Footer del card: link a login */}
      <div className="mt-10 pt-8 border-t border-gold-faint text-center">
        <p className="font-serif font-light text-base text-white-dim">
          ¿Ya tenés cuenta?{' '}
          <Link
            to="/login"
            className="font-sans text-[11px] uppercase tracking-eyebrow text-gold hover:text-gold-bright transition-colors duration-300 ml-1"
          >
            Iniciar sesión →
          </Link>
        </p>
      </div>

      {/* Texto legal (fuera del card pero adentro del AuthLayout) */}
      <p className="mt-8 text-center font-serif font-light text-sm text-white-faint leading-relaxed">
        Al registrarte aceptás nuestros{' '}
        <Link to="/terminos" className="text-gold-dim hover:text-gold transition-colors duration-300 underline underline-offset-2">
          Términos
        </Link>{' '}
        y nuestra{' '}
        <Link to="/privacidad" className="text-gold-dim hover:text-gold transition-colors duration-300 underline underline-offset-2">
          Política de privacidad
        </Link>
        .
      </p>
    </AuthLayout>
  );
};

export default Register;
