import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updateUser, getClientByUserId, updateClientMe } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [timeOfBirth, setTimeOfBirth] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('ouro_user');
    if (!stored) { navigate('/login'); return; }
    const parsed = JSON.parse(stored);
    setUser(parsed);
    setFullName(parsed.fullName || '');
    setPhone(parsed.phone || '');
    setEmail(parsed.email || '');

    getClientByUserId(parsed.id)
      .then((c) => {
        if (c?.dateOfBirth) {
          const d = new Date(c.dateOfBirth);
          const dd = String(d.getDate()).padStart(2, '0');
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const year = d.getFullYear();
          setDateOfBirth(`${dd}/${mm}/${year}`);
        }
        if (c?.timeOfBirth) {
          setTimeOfBirth(c.timeOfBirth.slice(0, 5));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleDateChange = (e) => {
    let raw = e.target.value.replace(/[^\d]/g, '');
    if (raw.length > 8) raw = raw.slice(0, 8);
    let formatted = raw;
    if (raw.length > 4) formatted = raw.slice(0, 2) + '/' + raw.slice(2, 4) + '/' + raw.slice(4);
    else if (raw.length > 2) formatted = raw.slice(0, 2) + '/' + raw.slice(2);
    setDateOfBirth(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setError('El nombre, teléfono y email son obligatorios.');
      return;
    }

    setSaving(true);
    try {
      const updatedUser = await updateUser(user.id, { fullName: fullName.trim(), phone: phone.trim(), email: email.trim() });

      // Actualizar datos de nacimiento en perfil de cliente
      if (dateOfBirth || timeOfBirth) {
        let birthDate = null;
        if (dateOfBirth) {
          const parts = dateOfBirth.split('/');
          if (parts.length === 3 && parts[2].length === 4) {
            birthDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')} 00:00:00`;
          }
        }
        const birthTime = timeOfBirth ? `${timeOfBirth}:00` : null;
        if (birthDate || birthTime) {
          await updateClientMe({ dateOfBirth: birthDate, timeOfBirth: birthTime });
        }
      }

      // Actualizar localStorage
      const newUserData = { ...user, fullName: updatedUser.fullName, phone: updatedUser.phone, email: updatedUser.email };
      localStorage.setItem('ouro_user', JSON.stringify(newUserData));

      const emailChanged = email.trim() !== user.email;
      if (emailChanged) {
        setSuccess('Datos guardados. Revisá tu nuevo email para re-verificar tu cuenta.');
        localStorage.removeItem('ouro_token');
        localStorage.removeItem('ouro_user');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setSuccess('¡Datos actualizados correctamente!');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Editar mis datos</h2>
            <p className="mt-2 text-gray-600">Actualizá tu información personal</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {success && (
              <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">Si cambiás el email, deberás re-verificar tu cuenta.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+54 11 1234-5678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              {user?.role !== 'THERAPIST' && (
                <div className="p-4 bg-mystic-50 border border-mystic-100 rounded-xl">
                  <p className="text-xs text-mystic-700 mb-3">Fecha y hora de nacimiento — usados por los terapeutas para personalizar las sesiones.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de nacimiento</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={dateOfBirth}
                        onChange={handleDateChange}
                        placeholder="dd/mm/aaaa"
                        maxLength={10}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hora de nacimiento</label>
                      <input
                        type="time"
                        value={timeOfBirth}
                        onChange={(e) => setTimeOfBirth(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-mystic-500 to-primary-600 text-white py-3 rounded-lg hover:from-mystic-600 hover:to-primary-700 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
                ← Volver al dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfile;
