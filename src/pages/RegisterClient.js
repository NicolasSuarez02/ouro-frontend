import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '../services/api';

const RegisterClient = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [formData, setFormData] = useState({
    dateOfBirth: '',
    timeOfBirth: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user || !user.id) {
      setError('Información de usuario no disponible');
      return;
    }

    setLoading(true);

    try {
      // Formatear fecha y hora para el backend (requiere HH:mm:ss)
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
      
      // Redirigir al dashboard o página de éxito
      navigate('/success', { state: { user } });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al completar el registro. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/success', { state: { user } });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sesión no válida</h2>
          <p className="text-gray-600 mb-6">
            No se pudo obtener tu información de usuario.
          </p>
          <Link
            to="/register"
            className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Volver a registrarse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">O</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido, {user.fullName}!
          </h1>
          <p className="text-gray-600">
            Completa tu perfil para personalizar tu experiencia
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Datos de nacimiento <span className="text-sm font-normal text-gray-400">(opcional)</span>
            </h2>
            <div className="p-4 bg-mystic-50 border border-mystic-100 rounded-xl text-sm text-mystic-800">
              En Ouro trabajamos con terapias holísticas que incluyen astrología y carta natal. Tu fecha y hora de nacimiento permiten a los terapeutas personalizar mejor la sesión. Podés completarlo ahora o más tarde desde tu perfil.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Fecha de nacimiento */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de nacimiento
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <p className="mt-1 text-xs text-gray-500">
                Nos ayuda a personalizar tu experiencia
              </p>
            </div>

            {/* Hora de nacimiento */}
            <div>
              <label htmlFor="timeOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Hora de nacimiento
              </label>
              <input
                id="timeOfBirth"
                name="timeOfBirth"
                type="time"
                value={formData.timeOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <p className="mt-1 text-xs text-gray-500">
                Para cálculos astrológicos opcionales
              </p>
            </div>

            {/* Información del usuario */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Tu información</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Teléfono:</span>
                  <span className="font-medium text-gray-900">{user.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="text-green-600 font-medium">✓ Verificado</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : 'Completar registro'}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Omitir por ahora
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Puedes agregar o editar esta información más tarde desde tu perfil
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterClient;
