import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser, getClientByUserId, updateClientMe } from '../services/api';
import AuthLayout from '../components/AuthLayout';

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
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border border-gold-faint border-t-gold animate-spin" />
      </div>
    );
  }

  return (
    <AuthLayout
      eyebrow="Mi cuenta"
      title={<>Editar <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">mis datos</em></>}
      subtitle="Actualizá tu información personal"
      backTo="/dashboard"
      backLabel="Volver al dashboard"
    >
      {success && (
        <div className="mb-6 border border-gold-faint bg-gold-ghost px-5 py-4 flex items-start gap-3">
          <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-gold shadow-gold-glow-soft" aria-hidden="true" />
          <p className="font-serif font-light text-base text-white leading-relaxed">{success}</p>
        </div>
      )}
      {error && (
        <div
          className="mb-6 px-5 py-4 flex items-start gap-3"
          style={{ borderTop: '1px solid rgba(160,74,58,0.4)', borderBottom: '1px solid rgba(160,74,58,0.4)' }}
        >
          <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-[#A04A3A]" aria-hidden="true" />
          <p className="font-serif font-light text-base text-white leading-relaxed">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3">
            Nombre completo <span className="text-[#A04A3A]">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Tu nombre completo"
            className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 transition-colors duration-300"
          />
        </div>

        <div>
          <label className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3">
            Email <span className="text-[#A04A3A]">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
            className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 transition-colors duration-300"
          />
          <p className="font-sans text-[10px] text-white-faint mt-2">Si cambiás el email, deberás re-verificar tu cuenta.</p>
        </div>

        <div>
          <label className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3">
            Teléfono <span className="text-[#A04A3A]">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="+54 11 1234-5678"
            className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 transition-colors duration-300"
          />
        </div>

        {user?.role !== 'THERAPIST' && (
          <div className="border-l-2 border-gold pl-5 pr-4 py-4 bg-gold-ghost">
            <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold mb-4">
              Fecha y hora de nacimiento
            </p>
            <p className="font-serif font-light text-sm text-white-dim mb-5 leading-relaxed">
              Usados por los terapeutas para personalizar las sesiones.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3">
                  Fecha
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={dateOfBirth}
                  onChange={handleDateChange}
                  placeholder="dd/mm/aaaa"
                  maxLength={10}
                  className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3">
                  Hora
                </label>
                <input
                  type="time"
                  value={timeOfBirth}
                  onChange={(e) => setTimeOfBirth(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white py-3 transition-colors duration-300 [color-scheme:dark]"
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full inline-flex items-center justify-center gap-3 bg-gold-gradient py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default EditProfile;
