import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';
import AuthLayout from '../components/AuthLayout';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Completá todos los campos');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!token) {
      setError('El enlace de reset no es válido. Solicitá uno nuevo.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, formData.newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'El enlace expiró o no es válido. Solicitá uno nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------
  // Estado: token inválido o ausente
  // ---------------------------------------------------------------
  if (!token) {
    return (
      <AuthLayout
        eyebrow="Enlace inválido"
        title={
          <>
            Enlace{' '}
            <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">
              caducado
            </em>
          </>
        }
        subtitle="Este enlace ya no es válido. Solicitá uno nuevo para continuar."
        backTo="/login"
        backLabel="Volver al login"
      >
        <div className="text-center">
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-3 bg-gold-gradient px-10 py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow"
          >
            <span>Solicitar nuevo enlace</span>
            <span>→</span>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // ---------------------------------------------------------------
  // Estado: éxito
  // ---------------------------------------------------------------
  if (success) {
    return (
      <AuthLayout
        eyebrow="Hecho"
        title={
          <>
            Contraseña{' '}
            <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">
              actualizada
            </em>
          </>
        }
        subtitle="Tu contraseña fue restablecida con éxito."
        showBackLink={false}
      >
        <div className="text-center space-y-6">
          {/* Punto dorado con glow centrado como marca de éxito */}
          <div className="flex justify-center">
            <span
              className="block w-3 h-3 rounded-full bg-gold shadow-gold-glow-soft"
              aria-hidden="true"
            />
          </div>
          <p className="font-serif italic font-light text-base text-white-dim">
            Redirigiendo al login...
          </p>
        </div>
      </AuthLayout>
    );
  }

  // ---------------------------------------------------------------
  // Estado: formulario
  // ---------------------------------------------------------------
  const expired = error && error.toLowerCase().includes('expir');

  return (
    <AuthLayout
      eyebrow="Nueva contraseña"
      title={
        <>
          Elegí tu{' '}
          <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">
            contraseña
          </em>
        </>
      }
      subtitle="Una contraseña segura para tu cuenta."
      backTo="/login"
      backLabel="Volver al login"
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Banner error (terracota) — con CTA inline si el enlace expiró */}
        {error && (
          <div
            className="px-5 py-4 space-y-2"
            style={{
              borderTop: '1px solid rgba(160, 74, 58, 0.4)',
              borderBottom: '1px solid rgba(160, 74, 58, 0.4)',
              background: 'rgba(160, 74, 58, 0.08)',
            }}
            role="alert"
          >
            <div className="flex items-start gap-3">
              <span
                className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full"
                style={{ background: '#A04A3A' }}
                aria-hidden="true"
              />
              <p className="font-serif font-light text-base text-white leading-relaxed">
                {error}
              </p>
            </div>
            {expired && (
              <div className="pl-6">
                <Link
                  to="/forgot-password"
                  className="font-sans text-[11px] uppercase tracking-eyebrow text-gold hover:text-gold-bright transition-colors duration-300"
                >
                  Solicitar nuevo enlace →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Nueva contraseña */}
        <div>
          <label
            htmlFor="newPassword"
            className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3"
          >
            Nueva contraseña
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            autoComplete="new-password"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 transition-colors duration-300"
          />
        </div>

        {/* Confirmar contraseña */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3"
          >
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repetí tu contraseña"
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
            <span>{loading ? 'Guardando...' : 'Guardar contraseña'}</span>
            {!loading && <span>→</span>}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
