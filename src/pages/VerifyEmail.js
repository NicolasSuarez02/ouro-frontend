import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail, createClient } from '../services/api';

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

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Verificando tu email...</h2>
          <p className="text-gray-600">Por favor espera un momento</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Email verificado!
          </h2>

          {/* Message */}
          <p className="text-lg text-gray-600 mb-6">
            Tu cuenta ha sido verificada exitosamente.
          </p>

          {/* User info */}
          {user && (
            <div className="bg-primary-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Bienvenido,</p>
              <p className="text-xl font-semibold text-primary-700">{user.fullName}</p>
            </div>
          )}

          {/* Redirect message */}
          <p className="text-sm text-gray-500 mb-6">
            Redirigiendo al registro de cliente...
          </p>

          {/* Manual link */}
          <Link
            to="/register-client"
            state={{ user }}
            className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Continuar →
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Error de verificación
        </h2>

        {/* Error message */}
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/register"
            className="block w-full bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Registrarse nuevamente
          </Link>
          <Link
            to="/"
            className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
