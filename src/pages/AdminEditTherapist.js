import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TherapistForm from '../components/TherapistForm';
import { getTherapistByUserId, updateTherapist } from '../services/api';

const AdminEditTherapist = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [therapistId, setTherapistId] = useState(null);
  const [therapistName, setTherapistName] = useState('');
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getTherapistByUserId(userId)
      .then((therapist) => {
        setTherapistId(therapist.id);
        setTherapistName(therapist.userFullName || '');
        setInitialValues({
          bio: therapist.bio || '',
          photoUrl: therapist.photoUrl || '',
          priceCurrency: therapist.priceCurrency || 'ARS',
          specialties: therapist.specialties || [],
        });
      })
      .catch(() => setLoadError('No se pudo cargar el perfil de este terapeuta.'))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSubmit = async (data) => {
    setApiError('');
    setSuccess(false);
    setSaving(true);
    try {
      await updateTherapist(therapistId, data);
      setSuccess(true);
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Error al guardar los cambios. Intentá nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div
            className="w-8 h-8 border-2 border-gold-faint border-t-gold rounded-full animate-spin"
            aria-label="Cargando"
          />
        </div>
        <Footer />
      </div>
    );
  }

  if (loadError || !initialValues) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <p className="font-serif italic font-light text-lg text-white-dim">
            {loadError || 'Terapeuta no encontrado.'}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 lg:px-10 pt-24 lg:pt-32 pb-24">

        {/* Volver al panel admin */}
        <button
          onClick={() => navigate('/admin')}
          className="group inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-faint hover:text-gold transition-colors duration-300 mb-10"
        >
          <span className="transition-transform duration-400 ease-expo-out group-hover:-translate-x-2">←</span>
          <span>Panel admin</span>
        </button>

        {/* Header de sección — operativo sobrio */}
        <div className="mb-10">
          <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mb-4">
            Editando como admin
          </p>
          <h1
            className="font-serif font-light text-white mb-3"
            style={{ fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
          >
            {therapistName || 'Perfil de terapeuta'}
          </h1>
          <p className="font-serif font-light text-white-dim leading-relaxed" style={{ fontSize: 'clamp(15px, 1.1vw, 17px)' }}>
            Actualizá la información profesional de esta terapeuta.
          </p>
        </div>

        {/* Banner success */}
        {success && (
          <div className="mb-8 border border-gold-faint bg-gold-ghost px-5 py-4 flex items-start gap-3" role="status">
            <span
              className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-gold shadow-gold-glow-soft"
              aria-hidden="true"
            />
            <p className="font-serif font-light text-base text-white leading-relaxed">
              Cambios guardados. Volviendo al panel admin.
            </p>
          </div>
        )}

        {/* Card del form */}
        <div className="bg-navy-card border border-gold-faint p-8">
          <TherapistForm
            key={JSON.stringify(initialValues)}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            saving={saving}
            apiError={apiError}
            submitLabel="Guardar cambios"
          />
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default AdminEditTherapist;
