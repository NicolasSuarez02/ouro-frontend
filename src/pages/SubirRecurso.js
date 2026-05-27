import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { uploadResource } from '../services/api';

// ---------------------------------------------------------------
// Iconos inline — stroke 1.5px.
// Pendiente reemplazar por lucide-react al sumar la dependencia.
// ---------------------------------------------------------------
const AlertCircle = ({ className = '', style }) => (
  <svg className={className} style={style} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const CheckIcon = ({ className = '' }) => (
  <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const UploadIcon = ({ className = '' }) => (
  <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const SubirRecurso = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'BIBLIOTECA',
  });
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('ouro_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const u = JSON.parse(userData);
    if (u.role !== 'THERAPIST' && u.role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    setUser(u);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivo) {
      setError('Seleccioná un archivo');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('title', form.title);
    formData.append('category', form.category);
    if (form.description) {
      formData.append('description', form.description);
    }

    try {
      await uploadResource(formData);
      setExito(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al subir el archivo');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  // ---------------------------------------------------------------
  // Vista éxito
  // ---------------------------------------------------------------
  if (exito) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-6 pt-32 lg:pt-40 pb-24">
          <div className="max-w-md w-full">

            {/* Marca circular sobria */}
            <div className="flex justify-center mb-10">
              <div
                className="w-20 h-20 rounded-full border border-gold-dim flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="block w-3 h-3 rounded-full bg-gold shadow-gold-glow-soft" />
              </div>
            </div>

            {/* Eyebrow + Title + Subtitle */}
            <div className="text-center mb-10">
              <p className="font-sans text-[11px] font-medium uppercase tracking-eyebrow-wide text-gold mb-5">
                Archivo enviado
              </p>
              <h1
                className="font-serif font-light text-white mb-4"
                style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
              >
                Recibido
              </h1>
              <p
                className="font-serif font-light text-white-dim leading-relaxed"
                style={{ fontSize: 'clamp(16px, 1.2vw, 18px)' }}
              >
                Pendiente de aprobación del equipo.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate(form.category === 'BIBLIOTECA' ? '/biblioteca' : '/formaciones')}
                className="flex-1 inline-flex items-center justify-center gap-3 bg-gold-gradient py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow"
              >
                <span>Ver {form.category === 'BIBLIOTECA' ? 'biblioteca' : 'formaciones'}</span>
                <span>→</span>
              </button>
              <button
                onClick={() => {
                  setExito(false);
                  setArchivo(null);
                  setForm({ title: '', description: '', category: 'BIBLIOTECA' });
                }}
                className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 border border-gold-dim hover:bg-gold hover:border-gold hover:text-navy font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-400 ease-expo-out"
              >
                <span>Subir otro</span>
              </button>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ---------------------------------------------------------------
  // Vista normal (form)
  // ---------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 lg:px-10 pt-32 lg:pt-40 pb-24">

        {/* Header de sección */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
            <span className="font-sans text-[11px] font-medium uppercase tracking-eyebrow-wide text-gold">
              Recursos
            </span>
            <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
          </div>
          <h1
            className="font-serif font-light text-white mb-5"
            style={{ fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
          >
            Subir recurso
          </h1>
          <p
            className="font-serif font-light text-white-dim leading-relaxed max-w-md mx-auto"
            style={{ fontSize: 'clamp(16px, 1.2vw, 18px)' }}
          >
            El archivo quedará pendiente de aprobación.
          </p>
        </div>

        {/* Card del form */}
        <form onSubmit={handleSubmit} className="bg-navy-card border border-gold-faint p-8 space-y-10">

          {/* Categoría */}
          <div>
            <label className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-4">
              Categoría
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { value: 'BIBLIOTECA', label: 'Biblioteca de Alejandría' },
                { value: 'FORMACIONES', label: 'Formaciones' },
              ].map((opt) => {
                const active = form.category === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, category: opt.value }))}
                    className={`py-4 px-5 border font-sans text-[11px] font-medium uppercase tracking-eyebrow transition-all duration-400 ease-expo-out ${
                      active
                        ? 'bg-gold border-gold text-navy'
                        : 'bg-transparent border-gold-faint text-white-dim hover:border-gold-dim hover:text-gold'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Título */}
          <div>
            <label
              htmlFor="title"
              className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3"
            >
              Título
            </label>
            <input
              id="title"
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Nombre del recurso"
              className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 transition-colors duration-300"
            />
          </div>

          {/* Descripción */}
          <div>
            <div className="flex items-baseline gap-3 mb-3">
              <label
                htmlFor="description"
                className="font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold"
              >
                Descripción
              </label>
              <span className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
                Opcional
              </span>
            </div>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Breve descripción del contenido"
              rows={3}
              className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 resize-none transition-colors duration-300"
            />
          </div>

          {/* Archivo */}
          <div>
            <label className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3">
              Archivo
            </label>
            <label
              className={`flex flex-col items-center justify-center w-full border border-dashed py-10 px-6 cursor-pointer transition-colors duration-400 ease-expo-out ${
                archivo
                  ? 'border-gold-dim bg-gold-ghost'
                  : 'border-gold-faint hover:border-gold-dim hover:bg-gold-ghost/40'
              }`}
            >
              <input
                type="file"
                className="hidden"
                onChange={(e) => setArchivo(e.target.files[0] || null)}
              />
              {archivo ? (
                <div className="text-center">
                  <CheckIcon className="mx-auto mb-4 text-gold" />
                  <p className="font-serif font-normal text-base text-white break-all">
                    {archivo.name}
                  </p>
                  <p className="font-sans text-[10px] uppercase tracking-suffix text-white-faint mt-2">
                    {(archivo.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <UploadIcon className="mx-auto mb-4 text-gold-dim" />
                  <p className="font-serif font-light text-base text-white-dim">
                    Click para seleccionar un archivo.
                  </p>
                  <p className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint mt-2">
                    Máximo 50 MB
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Banner error */}
          {error && (
            <div
              className="px-5 py-4 flex items-start gap-3"
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

          {/* Botones submit */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3.5 border border-gold-faint hover:border-gold-dim font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-dim hover:text-white transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-3 bg-gold-gradient py-3.5 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <span>{loading ? 'Subiendo...' : 'Subir archivo'}</span>
              {!loading && <span>→</span>}
            </button>
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
};

export default SubirRecurso;
