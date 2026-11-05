import React, { useEffect, useState } from 'react';
import { getMyPaypal, connectPaypal, disconnectPaypal } from '../services/api';

// Conexión de PayPal por email (no hay "Log in with PayPal": el userinfo de PayPal falla).
// PayPal acepta cobrar a un email que no existe, por eso se pide dos veces y se muestra
// bien visible a dónde van a llegar los pagos.
const PayPalConnectPanel = () => {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyPaypal()
      .then((data) => setEmail(data.email || null))
      .catch(() => setEmail(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    const a = input.trim().toLowerCase();
    const b = confirmation.trim().toLowerCase();
    if (!a) { setError('Ingresá el email de tu cuenta de PayPal'); return; }
    if (a !== b) { setError('Los dos emails no coinciden'); return; }
    setSaving(true);
    try {
      await connectPaypal(a, b);
      setEmail(a);
      setEditing(false);
      setInput('');
      setConfirmation('');
    } catch (err) {
      setError(err.response?.data?.message || 'No pudimos guardar tu cuenta de PayPal');
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('¿Desconectar PayPal? Tus clientes ya no van a poder pagarte en dólares.')) return;
    setSaving(true);
    setError('');
    try {
      await disconnectPaypal();
      setEmail(null);
    } catch (err) {
      setError(err.response?.data?.message || 'No pudimos desconectar PayPal');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  const inputClass = 'w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-base text-white placeholder:text-white-faint placeholder:italic py-2 transition-colors duration-300';

  return (
    <div className="pt-5 border-t border-gold-faint">
      <div className={email && !editing ? 'bg-gold-ghost border border-gold-faint p-5' : 'border-l-2 border-gold-dim pl-5 pr-4 py-4 bg-gold-ghost'}>
        {email && !editing ? (
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold mb-1">
                PayPal conectado
              </p>
              <p className="font-serif font-light text-sm text-white-dim leading-relaxed">
                Los pagos en dólares llegan a <span className="text-white break-all">{email}</span>.
                Solo se ofrece PayPal en las especialidades que tengan precio en USD.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <button
                onClick={() => { setEditing(true); setInput(email); setConfirmation(''); }}
                disabled={saving}
                className="font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold hover:opacity-80 transition-opacity duration-300 underline underline-offset-4 disabled:opacity-50"
              >
                Cambiar
              </button>
              <button
                onClick={handleDisconnect}
                disabled={saving}
                className="font-sans text-[10px] font-medium uppercase tracking-eyebrow hover:opacity-80 transition-opacity duration-300 underline underline-offset-4 disabled:opacity-50"
                style={{ color: '#A04A3A' }}
              >
                Desconectar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold mb-1">
                {editing ? 'Cambiar cuenta de PayPal' : 'Cobrá en dólares con PayPal (opcional)'}
              </p>
              <p className="font-serif font-light text-sm text-white leading-relaxed">
                Ingresá el email con el que entrás a PayPal. Revisalo bien: si tiene un error, los pagos no te llegan.
              </p>
            </div>
            <input
              type="email"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Email de PayPal"
              autoComplete="off"
              className={inputClass}
            />
            <input
              type="email"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              onPaste={(e) => e.preventDefault()}
              placeholder="Repetí el email"
              autoComplete="off"
              className={inputClass}
            />
            {error && (
              <p className="font-serif font-light text-sm" style={{ color: '#A04A3A' }} role="alert">{error}</p>
            )}
            <div className="flex items-center gap-5">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-3 bg-gold-gradient px-6 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{saving ? 'Guardando...' : 'Conectar PayPal'}</span>
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => { setEditing(false); setError(''); }}
                  className="font-sans text-[10px] font-medium uppercase tracking-eyebrow text-white-dim hover:text-white transition-colors duration-300"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        )}
        {email && !editing && error && (
          <p className="mt-3 font-serif font-light text-sm" style={{ color: '#A04A3A' }} role="alert">{error}</p>
        )}
      </div>
    </div>
  );
};

export default PayPalConnectPanel;
