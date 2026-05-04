import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTherapistByUserId, updateTherapist } from '../services/api';
import TherapistForm from '../components/TherapistForm';

const EditTherapist = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [therapistId, setTherapistId] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('ouro_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== 'THERAPIST') {
      navigate('/dashboard');
      return;
    }
    setUser(parsed);

    getTherapistByUserId(parsed.id)
      .then((therapist) => {
        setTherapistId(therapist.id);
        setInitialValues({
          bio: therapist.bio || '',
          specialty: therapist.specialty || '',
          photoUrl: therapist.photoUrl || '',
          precioEnPesos: therapist.priceAmountCents != null
            ? (therapist.priceAmountCents / 100).toString()
            : '',
          priceCurrency: therapist.priceCurrency || 'ARS',
          mpTokenConfigurado: therapist.mpTokenConfigurado || false,
          minBookingLeadHours: therapist.minBookingLeadHours || 1,
        });
      })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSubmit = async (data) => {
    setApiError('');
    setSuccess(false);
    setSaving(true);
    try {
      await updateTherapist(therapistId, data);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Error al guardar los cambios. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user || !initialValues) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-mystic-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">O</span>
            </div>
            <span className="text-3xl font-bold text-gray-800">URO</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Editar perfil</h2>
          <p className="mt-2 text-gray-600">Actualizá tu información profesional</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {success && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              ¡Cambios guardados! Redirigiendo...
            </div>
          )}
          <TherapistForm
            key={JSON.stringify(initialValues)}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            saving={saving}
            apiError={apiError}
            submitLabel="Guardar cambios"
            userId={user?.id}
            mpTokenConfigurado={initialValues.mpTokenConfigurado}
          />
          <div className="mt-6 text-center">
            <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
              ← Volver al dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTherapist;
