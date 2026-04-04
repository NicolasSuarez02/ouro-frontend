import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { resendVerification } from '../services/api';

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
      setResendError('Error al reenviar el email. Intenta nuevamente.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Revisa tu correo!
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-2">
            Te hemos enviado un email de verificación a:
          </p>
          <p className="text-xl font-semibold text-primary-500 mb-6">
            {email}
          </p>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Sigue estos pasos:</h3>
            <ol className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                  1
                </span>
                <span>Abre tu bandeja de entrada de correo electrónico</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                  2
                </span>
                <span>Busca el email de Ouro (revisa tu carpeta de spam si no lo ves)</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                  3
                </span>
                <span>Haz clic en el botón "Verificar mi cuenta"</span>
              </li>
            </ol>
          </div>

          {/* Success message */}
          {resendSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              ¡Email reenviado exitosamente! Revisa tu bandeja de entrada.
            </div>
          )}

          {/* Error message */}
          {resendError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {resendError}
            </div>
          )}

          {/* Resend button */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-600 mb-4">¿No recibiste el email?</p>
            <button
              onClick={handleResend}
              disabled={resending}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? 'Reenviando...' : 'Reenviar email de verificación'}
            </button>
          </div>

          {/* Back to home */}
          <div className="mt-8">
            <Link
              to="/"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationSent;
