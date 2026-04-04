import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { uploadResource } from '../services/api';

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
    formData.append('uploadedByUserId', user.id);
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

  if (exito) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 pt-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Archivo enviado</h2>
            <p className="text-gray-500 mb-6">
              Tu archivo está pendiente de aprobación. Una vez aprobado por el equipo de Ouro estará disponible.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate(form.category === 'BIBLIOTECA' ? '/biblioteca' : '/formaciones')}
                className="bg-gradient-to-r from-mystic-500 to-primary-600 text-white px-6 py-2 rounded-full font-medium hover:from-mystic-600 hover:to-primary-700 transition-all"
              >
                Ver {form.category === 'BIBLIOTECA' ? 'Biblioteca' : 'Formaciones'}
              </button>
              <button
                onClick={() => { setExito(false); setArchivo(null); setForm({ title: '', description: '', category: 'BIBLIOTECA' }); }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-medium transition-all"
              >
                Subir otro
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Subir recurso</h1>
        <p className="text-gray-500 mb-8">El archivo quedará pendiente de aprobación antes de ser publicado.</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'BIBLIOTECA', label: 'Biblioteca de Alejandría' },
                { value: 'FORMACIONES', label: 'Formaciones' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, category: opt.value }))}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    form.category === opt.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Nombre del recurso"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Breve descripción del contenido..."
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent resize-none"
            />
          </div>

          {/* Archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Archivo</label>
            <label className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl py-8 cursor-pointer transition-colors ${
              archivo ? 'border-primary-300 bg-primary-50' : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
            }`}>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setArchivo(e.target.files[0] || null)}
              />
              {archivo ? (
                <div className="text-center">
                  <svg className="w-8 h-8 text-primary-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-primary-700">{archivo.name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {(archivo.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-500">Hacé click para seleccionar un archivo</p>
                  <p className="text-xs text-gray-400 mt-1">Máximo 50 MB</p>
                </div>
              )}
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-mystic-500 to-primary-600 hover:from-mystic-600 hover:to-primary-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition-all"
            >
              {loading ? 'Subiendo...' : 'Subir archivo'}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default SubirRecurso;
