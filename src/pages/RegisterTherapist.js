import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TherapistForm from '../components/TherapistForm';
import { createTherapist, getTherapistByUserId, getUserById } from '../services/api';

const RegisterTherapist = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('ouro_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsed = JSON.parse(userData);

    if (parsed.role === 'THERAPIST') {
      // Ya es terapeuta — verificar si ya tiene perfil
      getTherapistByUserId(parsed.id)
        .then(() => navigate('/dashboard'))
        .catch(() => {
          // No tiene perfil aún, puede continuar con el formulario
          setUser(parsed);
          setLoading(false);
        });
    } else {
      setUser(parsed);
      setLoading(false);
    }
  }, [navigate]);

  const handleSubmit = async (data) => {
    setApiError('');
    setSaving(true);
    try {
      await createTherapist({ userId: user.id, ...data });

      // Re-fetchear el usuario para obtener el rol actualizado del backend
      const updatedUser = await getUserById(user.id);
      localStorage.setItem('ouro_user', JSON.stringify(updatedUser));

      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Error al enviar la solicitud. Intentá nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 lg:px-10 pt-24 lg:pt-32 pb-24">

        {/* Volver al dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className="group inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-faint hover:text-gold transition-colors duration-300 mb-10"
        >
          <span className="transition-transform duration-400 ease-expo-out group-hover:-translate-x-2">←</span>
          <span>Dashboard</span>
        </button>

        {/* Header de sección — operativo sobrio */}
        <div className="mb-10">
          <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mb-4">
            Postulación
          </p>
          <h1
            className="font-serif font-light text-white mb-3"
            style={{ fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
          >
            Postularse como terapeuta
          </h1>
          <p className="font-serif font-light text-white-dim leading-relaxed" style={{ fontSize: 'clamp(15px, 1.1vw, 17px)' }}>
            Completá tu perfil profesional. Cada postulación es revisada por el equipo.
          </p>
        </div>

        {/* Card del form */}
        <div className="bg-navy-card border border-gold-faint p-8">
          <TherapistForm
            onSubmit={handleSubmit}
            saving={saving}
            apiError={apiError}
            submitLabel="Enviar postulación"
            userId={user?.id}
          />
        </div>

        {/* Nota legal */}
        <p className="mt-8 text-center font-serif italic font-light text-sm text-white-faint">
          Te notificaremos por email cuando tu postulación sea revisada.
        </p>

      </main>

      <Footer />
    </div>
  );
};

export default RegisterTherapist;
