import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail, createClient } from '../services/api';
import AuthLayout from '../components/AuthLayout';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token de verificación no válido');
        return;
      }

      try {
        const response = await verifyEmail(token);

        if (response.success) {
          if (response.token) {
            localStorage.setItem('ouro_token', response.token);
            localStorage.setItem('ouro_user', JSON.stringify(response.user));
          }

          // Crear perfil de cliente con los datos guardados durante el registro
          const pending = localStorage.getItem('ouro_pending_client');
          if (pending) {
            try {
              const clientData = JSON.parse(pending);
              await createClient({ userId: response.user.id, ...clientData });
            } catch (_) {
              // no es crítico si falla
            }
            localStorage.removeItem('ouro_pending_client');
          }

          setStatus('success');
          setMessage(response.message);
          setUser(response.user);

          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(response.message || 'Error al verificar el email');
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Token inválido o expirado');
      }
    };

    verify();
  }, [token, navigate]);

  // ---------------------------------------------------------------
  // Estado: loading
  // ---------------------------------------------------------------
  if (status === 'loading') {
    return (
      <AuthLayout
        eyebrow="Un momento"
        title={
          <>
            Verificando tu{' '}
            <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">
              cuenta
            </em>
          </>
        }
        subtitle="Estamos confirmando tu email."
        showBackLink={false}
      >
        <div className="flex flex-col items-center gap-6 py-4">
          {/* Spinner dorado */}
          <div
            className="w-12 h-12 border-2 border-gold-faint border-t-gold rounded-full animate-spin"
            aria-label="Cargando"
          />
          <p className="font-serif italic font-light text-base text-white-dim">
            Por favor esperá un momento.
          </p>
        </div>
      </AuthLayout>
    );
  }

  // ---------------------------------------------------------------
  // Estado: éxito
  // ---------------------------------------------------------------
  if (status === 'success') {
    return (
      <AuthLayout
        eyebrow="Verificada"
        title={
          <>
            Email{' '}
            <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">
              verificado
            </em>
          </>
        }
        subtitle="Tu cuenta ha sido confirmada."
        showBackLink={false}
      >
        <div className="space-y-8">
          {/* Bienvenida con el nombre */}
          {user && (
            <div className="text-center">
              <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mb-3">
                Bienvenida
              </p>
              <p className="font-serif font-light text-2xl text-white">
                {user.fullName}
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

          {/* Mensaje de redirect + CTA manual */}
          <div className="text-center space-y-6">
            <p className="font-serif italic font-light text-base text-white-dim">
              Redirigiendo al panel...
            </p>
            <Link
              to="/register-client"
              state={{ user }}
              className="inline-flex items-center gap-3 bg-gold-gradient px-10 py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow"
            >
              <span>Continuar ahora</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // ---------------------------------------------------------------
  // Estado: error
  // ---------------------------------------------------------------
  return (
    <AuthLayout
      eyebrow="No fue posible"
      title={
        <>
          Verificación{' '}
          <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">
            fallida
          </em>
        </>
      }
      subtitle="No pudimos confirmar tu email."
      backTo="/"
      backLabel="Volver al inicio"
    >
      <div className="space-y-10">
        {/* Banner error (terracota) */}
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
            {message}
          </p>
        </div>

        {/* Dos CTAs: primario + outline */}
        <div className="flex flex-col gap-4">
          <Link
            to="/register"
            className="w-full inline-flex items-center justify-center gap-3 bg-gold-gradient py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow"
          >
            <span>Registrarme nuevamente</span>
            <span>→</span>
          </Link>
          <Link
            to="/login"
            className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 border border-gold-dim hover:bg-gold hover:border-gold hover:text-navy font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-400 ease-expo-out"
          >
            <span>Ir al login</span>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
