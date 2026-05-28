import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../services/api';
import AuthLayout from '../components/AuthLayout';
import useDismissibleError from '../hooks/useDismissibleError';

// ---------------------------------------------------------------
// Iconos inline — stroke 1.5px.
// Pendiente reemplazar por lucide-react al sumar la dependencia.
// ---------------------------------------------------------------
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

const AlertCircle = ({ className = '', style }) => (
  <svg className={className} style={style} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ---------------------------------------------------------------
// Login
// ---------------------------------------------------------------
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('ouro_user')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const [loading, setLoading] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);

  // Error con reglas: mínimo 2s visible, fade-out 400ms, sin auto-hide por timer.
  const { error, errorFadeOut, showError, dismissError, clearError } = useDismissibleError();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    dismissError();
    setRequiresVerification(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRequiresVerification(false);

    if (!formData.email || !formData.password) {
      showError('Completá todos los campos');
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser(formData);
      if (response.success) {
        clearError();
        localStorage.setItem('ouro_token', response.token);
        localStorage.setItem('ouro_user', JSON.stringify(response.user));
        navigate(from, { replace: true });
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.requiresEmailVerification) {
        clearError();
        setRequiresVerification(true);
      } else {
        showError(data?.message || 'Error al iniciar sesión. Revisá tus datos.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Acceder"
      title={
        <>
          Iniciar{' '}
          <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">
            sesión
          </em>
        </>
      }
      subtitle="Bienvenida de vuelta."
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Banner: error genérico (terracota) con fade-out controlado */}
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

        {/* Banner: warning de verificación (dorado discreto, con CTA inline) */}
        {requiresVerification && (
          <div
            className="border-l-2 border-gold pl-5 pr-4 py-4 bg-gold-ghost"
            role="alert"
          >
            <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold mb-2">
              Email sin verificar
            </p>
            <p className="font-serif font-light text-base text-white leading-relaxed">
              Revisá tu bandeja de entrada o{' '}
              <button
                type="button"
                onClick={() =>
                  navigate('/verification-sent', { state: { email: formData.email } })
                }
                className="text-gold hover:text-gold-bright underline underline-offset-2 transition-colors duration-300"
              >
                reenviá el email de verificación
              </button>
              .
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
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 transition-colors duration-300"
          />
        </div>

        {/* Password + Olvidaste contraseña */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label
              htmlFor="password"
              className="font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold"
            >
              Contraseña
            </label>
            <Link
              to="/forgot-password"
              className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint hover:text-gold transition-colors duration-300"
            >
              Olvidaste tu contraseña
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
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

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 bg-gold-gradient py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            <span>{loading ? 'Ingresando...' : 'Iniciar'}</span>
            {!loading && <span>→</span>}
          </button>
        </div>
      </form>

      {/* Footer del card: link a registro */}
      <div className="mt-10 pt-8 border-t border-gold-faint text-center">
        <p className="font-serif font-light text-base text-white-dim">
          ¿No tenés cuenta?{' '}
          <Link
            to="/register"
            className="font-sans text-[11px] uppercase tracking-eyebrow text-gold hover:text-gold-bright transition-colors duration-300 ml-1"
          >
            Registrarse →
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
