import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Ingresá tu email');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      setError('Error al enviar el email. Intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Revisá tu correo</h2>
          <p className="text-gray-600 mb-6">
            Si <strong>{email}</strong> está registrado, vas a recibir un enlace para restablecer tu contraseña en los próximos minutos.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            El enlace expira en 1 hora. Revisá también tu carpeta de spam.
          </p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-mystic-500 to-primary-600 text-white px-8 py-3 rounded-lg hover:from-mystic-600 hover:to-primary-700 transition-all font-semibold shadow-md"
          >
            Volver al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-mystic-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">O</span>
            </div>
            <span className="text-3xl font-bold text-gray-800">URO</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Restablecer contraseña</h2>
          <p className="mt-2 text-gray-600">
            Ingresá tu email y te enviaremos un enlace para crear una nueva contraseña.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="tu@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-mystic-500 to-primary-600 text-white py-3 rounded-lg hover:from-mystic-600 hover:to-primary-700 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-mystic-600 hover:text-mystic-700 font-medium text-sm">
              ← Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
