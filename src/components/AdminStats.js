import React, { useState, useEffect } from 'react';
import { getAdminStats } from '../services/api';

const TERRACOTA = '#A04A3A';

const PERIODS = [
  { key: 'WEEK', label: 'Semana' },
  { key: 'MONTH', label: 'Mes' },
  { key: 'YEAR', label: 'Año' },
];

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const parseDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const periodTitle = (period, from, to) => {
  const f = parseDate(from);
  const t = parseDate(to);
  if (period === 'YEAR') return String(f.getFullYear());
  if (period === 'MONTH') return `${MONTHS[f.getMonth()]} ${f.getFullYear()}`;
  const sameMonth = f.getMonth() === t.getMonth();
  return sameMonth
    ? `${f.getDate()} – ${t.getDate()} de ${MONTHS[t.getMonth()]} ${t.getFullYear()}`
    : `${f.getDate()} de ${MONTHS[f.getMonth()]} – ${t.getDate()} de ${MONTHS[t.getMonth()]} ${t.getFullYear()}`;
};

const formatMoney = (cents, currency) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);

const Revenue = ({ revenueCents, className = '' }) => {
  const entries = Object.entries(revenueCents || {});
  if (entries.length === 0) return <span className={className}>—</span>;
  return (
    <span className={className}>
      {entries.map(([cur, cents]) => (
        <span key={cur} className="block">{formatMoney(cents, cur)}</span>
      ))}
    </span>
  );
};

const StatTile = ({ label, children, hint }) => (
  <div className="bg-navy-elevated border border-gold-faint p-5">
    <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mb-2">{label}</p>
    <div className="font-serif font-light text-2xl text-white leading-tight">{children}</div>
    {hint && <p className="font-sans text-[11px] text-white-faint mt-2">{hint}</p>}
  </div>
);

// Barras simples de sesiones por día / mes (sin dependencia de librería de gráficos)
const SessionsChart = ({ series, currency }) => {
  const max = Math.max(1, ...series.map((p) => p.sessions));
  const dense = series.length > 12;
  return (
    <div>
      <div className="flex items-end gap-[3px] h-40" role="img" aria-label="Sesiones por período">
        {series.map((p) => {
          const money = currency && p.revenueCents?.[currency];
          const title = `${p.label}: ${p.sessions} ${p.sessions === 1 ? 'sesión' : 'sesiones'}`
            + (money ? ` · ${formatMoney(money, currency)}` : '');
          return (
            <div key={p.date} className="flex-1 h-full flex flex-col justify-end items-center min-w-0" title={title}>
              {!dense && p.sessions > 0 && (
                <span className="font-sans text-[10px] text-white-dim mb-1">{p.sessions}</span>
              )}
              <div
                className={p.sessions > 0 ? 'w-full bg-gold' : 'w-full bg-gold-faint'}
                style={{ height: p.sessions > 0 ? `${(p.sessions / max) * 100}%` : '2px' }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-[3px] mt-2">
        {series.map((p, i) => (
          <span key={p.date} className="flex-1 min-w-0 text-center font-sans text-[10px] text-white-faint truncate">
            {!dense || i % 5 === 0 || i === series.length - 1 ? p.label : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

const AdminStats = () => {
  const [period, setPeriod] = useState('MONTH');
  const [date, setDate] = useState(null); // null = período actual
  const [therapistId, setTherapistId] = useState(null); // null = global
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    getAdminStats({ period, date, therapistId })
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'No se pudieron cargar las estadísticas.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [period, date, therapistId]);

  const changePeriod = (p) => { setPeriod(p); setDate(null); };

  const selected = data && therapistId
    ? data.therapists.find((t) => t.therapistId === therapistId)
    : null;
  const scope = selected || data?.global;
  const mainCurrency = scope && Object.keys(scope.revenueCents || {})[0];

  return (
    <div>
      {/* Controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex gap-2">
          {PERIODS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => changePeriod(key)}
              className={`px-4 py-2 border font-sans text-[11px] font-medium uppercase tracking-eyebrow transition-colors duration-300 ${
                period === key
                  ? 'bg-gold border-gold text-navy'
                  : 'border-gold-faint text-white-dim hover:border-gold-dim hover:text-gold'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {data && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDate(data.previousDate)}
              className="w-9 h-9 border border-gold-faint text-white-dim hover:text-gold hover:border-gold-dim transition-colors"
              aria-label="Período anterior"
            >←</button>
            <span className="font-serif font-light text-lg text-white min-w-[10rem] text-center first-letter:uppercase">
              {periodTitle(data.period, data.from, data.to)}
            </span>
            <button
              onClick={() => setDate(data.nextDate)}
              disabled={data.isCurrent}
              className="w-9 h-9 border border-gold-faint text-white-dim hover:text-gold hover:border-gold-dim transition-colors disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Período siguiente"
            >→</button>
          </div>
        )}
      </div>

      {error && (
        <div
          className="mb-6 px-5 py-4"
          style={{ borderTop: `1px solid ${TERRACOTA}66`, borderBottom: `1px solid ${TERRACOTA}66`, background: `${TERRACOTA}14` }}
          role="alert"
        >
          <p className="font-serif font-light text-base" style={{ color: TERRACOTA }}>{error}</p>
        </div>
      )}

      {loading && !data && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-gold-faint border-t-gold rounded-full animate-spin" aria-label="Cargando" />
        </div>
      )}

      {data && scope && (
        <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          {/* Encabezado del alcance */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-serif font-light text-xl text-white">
              {selected ? selected.name : 'Global — todas las terapeutas'}
            </h2>
            {selected && (
              <button
                onClick={() => setTherapistId(null)}
                className="font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-faint hover:text-gold transition-colors"
              >
                ← Ver global
              </button>
            )}
          </div>

          {/* Totales */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatTile
              label="Sesiones"
              hint={scope.upcoming > 0 ? `Incluye ${scope.upcoming} próxima${scope.upcoming === 1 ? '' : 's'}` : null}
            >
              {scope.sessions}
            </StatTile>
            <StatTile label="Dinero generado" hint={`${scope.paidSessions} sesiones pagas`}>
              <Revenue revenueCents={scope.revenueCents} />
            </StatTile>
            <StatTile label="Clientes distintos">{scope.uniqueClients}</StatTile>
            <StatTile
              label="Canceladas"
              hint={!selected ? `${data.global.activeTherapists} terapeutas con sesiones` : null}
            >
              {scope.cancelled}
            </StatTile>
          </div>

          {/* Evolución */}
          <div className="bg-navy-card border border-gold-faint p-6 mb-10">
            <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mb-5">
              Sesiones por {data.period === 'YEAR' ? 'mes' : 'día'}
            </p>
            <SessionsChart series={data.series} currency={mainCurrency} />
          </div>

          {/* Por terapeuta */}
          <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mb-3">Por terapeuta</p>
          <div className="border border-gold-faint overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gold-faint">
                  {['Terapeuta', 'Sesiones', 'Dinero', 'Clientes', 'Canceladas'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 font-sans text-[10px] font-medium uppercase tracking-eyebrow text-white-faint ${i > 0 ? 'text-right' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.therapists.map((t) => {
                  const active = t.therapistId === therapistId;
                  return (
                    <tr
                      key={t.therapistId}
                      onClick={() => setTherapistId(active ? null : t.therapistId)}
                      className={`border-b border-gold-faint last:border-b-0 cursor-pointer transition-colors ${
                        active ? 'bg-gold-ghost' : 'hover:bg-gold-ghost'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {t.photoUrl ? (
                            <img src={t.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-gold-faint flex-shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full border border-gold-faint flex-shrink-0" />
                          )}
                          <span className={`font-serif font-light text-base ${active ? 'text-gold' : 'text-white'}`}>{t.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-sans text-sm text-white tabular-nums">{t.sessions}</td>
                      <td className="px-4 py-3 text-right font-sans text-sm text-white tabular-nums whitespace-nowrap">
                        <Revenue revenueCents={t.revenueCents} />
                      </td>
                      <td className="px-4 py-3 text-right font-sans text-sm text-white-dim tabular-nums">{t.uniqueClients}</td>
                      <td className="px-4 py-3 text-right font-sans text-sm text-white-dim tabular-nums">{t.cancelled}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-gold-dim bg-navy-elevated">
                  <td className="px-4 py-3 font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold">Total</td>
                  <td className="px-4 py-3 text-right font-sans text-sm text-gold tabular-nums">{data.global.sessions}</td>
                  <td className="px-4 py-3 text-right font-sans text-sm text-gold tabular-nums whitespace-nowrap">
                    <Revenue revenueCents={data.global.revenueCents} />
                  </td>
                  <td className="px-4 py-3 text-right font-sans text-sm text-gold tabular-nums">{data.global.uniqueClients}</td>
                  <td className="px-4 py-3 text-right font-sans text-sm text-gold tabular-nums">{data.global.cancelled}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="font-sans text-[11px] text-white-faint mt-3">
            Tocá una terapeuta para ver su detalle. Los montos son el precio cobrado de cada sesión, por moneda y sin conversión.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminStats;
