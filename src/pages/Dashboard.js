import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getTherapistByUserId, getClientByUserId, getAppointmentsByUser, getAppointmentsByTherapist, getMpConnectUrl } from '../services/api';

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

const CheckIcon = ({ className = '', style }) => (
  <svg className={className} style={style} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CalendarIcon = ({ className = '' }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const CloseIcon = ({ className = '' }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </svg>
);

const VideoIcon = ({ className = '' }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const canJoinMeeting = (startAt) => {
  if (!startAt) return false;
  const start = new Date(startAt);
  const now = new Date();
  const minutesUntilStart = (start - now) / 60000;
  return minutesUntilStart <= 10;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [therapist, setTherapist] = useState(null);
  const [client, setClient] = useState(null);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [loadingTherapist, setLoadingTherapist] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [mpStatus, setMpStatus] = useState(null); // 'success' | 'error' | null
  const [connectingMp, setConnectingMp] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('ouro_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    setUser(parsed);
    setPageLoading(false);

    const params = new URLSearchParams(location.search);
    const mp = params.get('mp');
    if (mp === 'success' || mp === 'error') {
      setMpStatus(mp);
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [navigate, location.search]);

  useEffect(() => {
    if (user?.role === 'THERAPIST') {
      setLoadingTherapist(true);
      getTherapistByUserId(user.id)
        .then((data) => {
          setTherapist(data);
          return getAppointmentsByTherapist(data.id);
        })
        .then((agenda) => setNextAppointment(agenda.proximos?.[0] || null))
        .catch(() => setTherapist(null))
        .finally(() => setLoadingTherapist(false));
    } else if (user?.role === 'USER') {
      getClientByUserId(user.id)
        .then((data) => setClient(data))
        .catch(() => setClient(null));
      getAppointmentsByUser(user.id)
        .then((agenda) => setNextAppointment(agenda.proximos?.[0] || null))
        .catch(() => {});
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('ouro_user');
    navigate('/');
  };

  const handleConnectMp = async () => {
    try {
      setConnectingMp(true);
      const { authUrl } = await getMpConnectUrl();
      window.location.href = authUrl;
    } catch {
      setMpStatus('error');
      setConnectingMp(false);
    }
  };

  // ---------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------
  if (pageLoading) {
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

  const firstName = user.fullName?.split(' ')[0] || 'Usuario';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 lg:px-10 pt-32 lg:pt-40 pb-24">

        {/* Encabezado */}
        <div className="mb-12">
          <p className="font-sans text-[11px] font-medium uppercase tracking-eyebrow-wide text-gold mb-4">
            Mi espacio
          </p>
          <h1
            className="font-serif font-light text-white mb-3"
            style={{ fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
          >
            Hola,{' '}
            <em className="italic font-normal bg-gold-gradient bg-clip-text text-transparent">
              {firstName}
            </em>
          </h1>
          <p className="font-serif font-light text-white-dim leading-relaxed" style={{ fontSize: 'clamp(16px, 1.2vw, 18px)' }}>
            Tu <em className="italic">ciclo</em> en curso.
          </p>
        </div>

        {/* Banner MP success */}
        {mpStatus === 'success' && (
          <div className="mb-8 border border-gold-faint bg-gold-ghost px-5 py-4 flex items-start gap-3" role="status">
            <span
              className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-gold shadow-gold-glow-soft"
              aria-hidden="true"
            />
            <p className="flex-1 font-serif font-light text-base text-white leading-relaxed">
              Mercado Pago conectado. Ya podés recibir pagos.
            </p>
            <button
              onClick={() => setMpStatus(null)}
              aria-label="Cerrar"
              className="text-white-faint hover:text-gold transition-colors duration-300 flex-shrink-0"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        {/* Banner MP error */}
        {mpStatus === 'error' && (
          <div
            className="mb-8 px-5 py-4 flex items-start gap-3"
            style={{
              borderTop: '1px solid rgba(160, 74, 58, 0.4)',
              borderBottom: '1px solid rgba(160, 74, 58, 0.4)',
              background: 'rgba(160, 74, 58, 0.08)',
            }}
            role="alert"
          >
            <AlertCircle className="flex-shrink-0 mt-0.5" style={{ color: '#A04A3A' }} />
            <p className="flex-1 font-serif font-light text-base leading-relaxed" style={{ color: '#A04A3A' }}>
              No pudimos conectar con Mercado Pago. Intentá nuevamente.
            </p>
            <button
              onClick={() => setMpStatus(null)}
              aria-label="Cerrar"
              className="hover:opacity-80 transition-opacity duration-300 flex-shrink-0"
              style={{ color: '#A04A3A' }}
            >
              <CloseIcon />
            </button>
          </div>
        )}

        {/* Card: Tus datos */}
        <section className="bg-navy-card border border-gold-faint p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold">
              Tus datos
            </p>
            <Link
              to="/editar-perfil"
              className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim hover:text-gold transition-colors duration-300"
            >
              Editar →
            </Link>
          </div>
          <dl className="space-y-4">
            <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-gold-faint">
              <dt className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint flex-shrink-0">
                Nombre completo
              </dt>
              <dd className="font-serif font-light text-base text-white text-right">
                {user.fullName}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-gold-faint">
              <dt className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint flex-shrink-0">
                Email
              </dt>
              <dd className="font-serif font-light text-base text-white text-right break-all">
                {user.email}
              </dd>
            </div>
            {user.phone && (
              <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-gold-faint">
                <dt className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint flex-shrink-0">
                  Teléfono
                </dt>
                <dd className="font-serif font-light text-base text-white text-right">
                  {user.phone}
                </dd>
              </div>
            )}
            {client?.dateOfBirth && (
              <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-gold-faint">
                <dt className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint flex-shrink-0">
                  Fecha de nacimiento
                </dt>
                <dd className="font-serif font-light text-base text-white text-right">
                  {new Date(client.dateOfBirth).toLocaleDateString('es-AR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </dd>
              </div>
            )}
            {client?.timeOfBirth && (
              <div className="flex items-baseline justify-between gap-4">
                <dt className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint flex-shrink-0">
                  Hora de nacimiento
                </dt>
                <dd className="font-serif font-light text-base text-white text-right">
                  {client.timeOfBirth.slice(0, 5)} hs
                </dd>
              </div>
            )}
          </dl>
        </section>

        {/* Card: Postulate como terapeuta (solo USER) */}
        {user.role === 'USER' && (
          <section className="bg-navy-card border border-gold-faint p-8 mb-6">
            <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold mb-4">
              Sumate al equipo
            </p>
            <h2 className="font-serif font-light text-2xl text-white mb-3 leading-tight">
              Postulate como terapeuta
            </h2>
            <p className="font-serif font-light text-base text-white-dim leading-relaxed mb-6">
              Sumate al equipo profesional de OURO. Cada perfil es revisado.
            </p>
            <Link
              to="/register-therapist"
              className="group inline-flex items-center gap-3 px-7 py-3 border border-gold-dim hover:bg-gold hover:border-gold hover:text-navy font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-400 ease-expo-out"
            >
              <span>Postular mi perfil</span>
              <span className="transition-transform duration-400 ease-expo-out group-hover:translate-x-2">→</span>
            </Link>
          </section>
        )}

        {/* Card: Mis turnos (USER y THERAPIST) */}
        {(user.role === 'USER' || user.role === 'THERAPIST') && (
          <section className="bg-navy-card border border-gold-faint p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold">
                Mis turnos
              </p>
              <Link
                to="/mis-turnos"
                className="group inline-flex items-center gap-2 font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold hover:text-gold-bright transition-colors duration-300"
              >
                <span>Ver todos</span>
                <span className="transition-transform duration-400 ease-expo-out group-hover:translate-x-2">→</span>
              </Link>
            </div>

            {nextAppointment ? (
              <div className="flex items-start gap-4 p-5 bg-gold-ghost border border-gold-faint">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 text-gold border border-gold-dim">
                  <CalendarIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mb-1">
                    Próximo turno
                  </p>
                  <p className="font-serif font-normal text-base text-white truncate">
                    {user.role === 'THERAPIST' ? nextAppointment.clientFullName : nextAppointment.therapistFullName}
                  </p>
                  <p className="font-serif font-light text-sm text-white-dim mt-1 capitalize">
                    {new Date(nextAppointment.startAt).toLocaleDateString('es-AR', {
                      weekday: 'long', day: 'numeric', month: 'long',
                    })}
                    {' · '}
                    {new Date(nextAppointment.startAt).toLocaleTimeString('es-AR', {
                      hour: '2-digit', minute: '2-digit',
                    })}
                    {' hs'}
                  </p>
                  {canJoinMeeting(nextAppointment.startAt) && (() => {
                    const url = user.role === 'THERAPIST' ? nextAppointment.zoomStartUrl : nextAppointment.zoomJoinUrl;
                    const label = user.role === 'THERAPIST' ? 'Iniciar sesión' : 'Unirse a la sesión';
                    if (!url) return null;
                    return (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 px-4 py-2 border border-gold-dim hover:bg-gold hover:text-navy font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-400 ease-expo-out"
                      >
                        <VideoIcon />
                        <span>{label}</span>
                      </a>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="font-serif italic font-light text-base text-white-dim mb-4">
                  No tenés turnos próximos.
                </p>
                <Link
                  to="/terapeutas"
                  className="inline-flex items-center gap-3 px-6 py-2.5 border border-gold-dim hover:bg-gold hover:border-gold hover:text-navy font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-400 ease-expo-out"
                >
                  <span>Reservar un turno</span>
                  <span>→</span>
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Card: Tu perfil de terapeuta (solo THERAPIST) */}
        {user.role === 'THERAPIST' && (
          <section className="bg-navy-card border border-gold-faint p-8 mb-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold">
                Tu perfil de terapeuta
              </p>
              <div className="flex items-center gap-5">
                <Link
                  to="/manage-availability"
                  className="font-sans text-[10px] font-medium uppercase tracking-eyebrow text-white-faint hover:text-gold transition-colors duration-300"
                >
                  Gestionar horarios
                </Link>
                <Link
                  to="/edit-therapist"
                  className="font-sans text-[10px] font-medium uppercase tracking-eyebrow text-white-faint hover:text-gold transition-colors duration-300"
                >
                  Editar perfil
                </Link>
              </div>
            </div>

            {loadingTherapist && (
              <p className="font-serif italic font-light text-base text-white-dim">
                Cargando perfil...
              </p>
            )}

            {!loadingTherapist && therapist && (
              <div className="space-y-6">
                {/* Foto + nombre + specialty */}
                <div className="flex items-center gap-5">
                  {therapist.photoUrl ? (
                    <img
                      src={therapist.photoUrl}
                      alt={user.fullName}
                      className="w-16 h-16 rounded-full object-cover border border-gold-faint flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                      <span className="font-serif font-normal text-2xl text-navy">
                        {user.fullName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-serif font-light text-xl text-white leading-tight">
                      {user.fullName}
                    </p>
                    {therapist.specialty && (
                      <p className="font-sans text-[10px] uppercase tracking-eyebrow-wide text-gold-dim mt-2">
                        {therapist.specialty}
                      </p>
                    )}
                  </div>
                </div>

                {/* Precio */}
                {therapist.priceAmountCents != null && (
                  <div className="pt-5 border-t border-gold-faint">
                    <p className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint mb-2">
                      Precio por sesión
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="font-serif font-normal text-xl text-white">
                        {(therapist.priceAmountCents / 100).toLocaleString('es-AR', {
                          style: 'currency',
                          currency: therapist.priceCurrency || 'ARS',
                        })}
                      </p>
                      <p className="font-sans text-[10px] uppercase tracking-suffix text-white-faint">
                        Por sesión
                      </p>
                    </div>
                  </div>
                )}

                {/* Bio */}
                {therapist.bio && (
                  <div className="pt-5 border-t border-gold-faint">
                    <p className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint mb-2">
                      Bio
                    </p>
                    <p className="font-serif font-light text-base text-white-dim leading-relaxed whitespace-pre-line">
                      {therapist.bio}
                    </p>
                  </div>
                )}

                {/* Mercado Pago */}
                {therapist.approvalStatus === 'APPROVED' && (
                  therapist.mpTokenConfigurado ? (
                    <div className="pt-5 border-t border-gold-faint">
                      <div className="bg-gold-ghost border border-gold-faint p-5 flex items-start gap-3">
                        <CheckIcon className="flex-shrink-0 mt-0.5 text-gold" />
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold mb-1">
                            Mercado Pago conectado
                          </p>
                          <p className="font-serif font-light text-sm text-white-dim leading-relaxed">
                            Recibís los pagos de tus sesiones directamente en tu cuenta.
                          </p>
                        </div>
                        <button
                          onClick={handleConnectMp}
                          disabled={connectingMp}
                          className="flex-shrink-0 font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold hover:text-gold-bright transition-colors duration-300 underline underline-offset-4 disabled:opacity-50"
                        >
                          {connectingMp ? 'Redirigiendo...' : 'Reconectar'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-5 border-t border-gold-faint">
                      <div className="border-l-2 border-gold pl-5 pr-4 py-4 bg-gold-ghost">
                        <div className="flex items-start gap-3 mb-4">
                          <AlertCircle className="flex-shrink-0 mt-0.5 text-gold" />
                          <div className="flex-1 min-w-0">
                            <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold mb-1">
                              Conectá tu Mercado Pago
                            </p>
                            <p className="font-serif font-light text-sm text-white leading-relaxed">
                              Necesario para recibir pagos de tus clientes.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleConnectMp}
                          disabled={connectingMp}
                          className="inline-flex items-center gap-3 bg-gold-gradient px-6 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span>{connectingMp ? 'Redirigiendo...' : 'Conectar'}</span>
                          {!connectingMp && <span>→</span>}
                        </button>
                      </div>
                    </div>
                  )
                )}

                {/* Estado de aprobación */}
                {therapist.approvalStatus === 'PENDING' && (
                  <div className="pt-5 border-t border-gold-faint">
                    <div className="border-l-2 border-gold pl-5 pr-4 py-4 bg-gold-ghost">
                      <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold mb-2">
                        En aprobación
                      </p>
                      <p className="font-serif font-light text-base text-white leading-relaxed">
                        Tu solicitud está siendo revisada por el equipo.
                      </p>
                    </div>
                  </div>
                )}

                {therapist.approvalStatus === 'APPROVED' && (
                  <div className="pt-5 border-t border-gold-faint flex items-center gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-gold shadow-gold-glow-soft"
                      aria-hidden="true"
                    />
                    <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold">
                      Perfil aprobado
                    </p>
                  </div>
                )}

                {therapist.approvalStatus === 'REJECTED' && (
                  <div className="pt-5 border-t border-gold-faint">
                    <div
                      className="px-5 py-4"
                      style={{
                        borderTop: '1px solid rgba(160, 74, 58, 0.4)',
                        borderBottom: '1px solid rgba(160, 74, 58, 0.4)',
                        background: 'rgba(160, 74, 58, 0.08)',
                      }}
                      role="alert"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <AlertCircle className="flex-shrink-0 mt-0.5" style={{ color: '#A04A3A' }} />
                        <div className="flex-1">
                          <p className="font-sans text-[10px] uppercase tracking-eyebrow mb-1" style={{ color: '#A04A3A' }}>
                            Solicitud rechazada
                          </p>
                          <p className="font-serif font-light text-base leading-relaxed" style={{ color: '#A04A3A' }}>
                            Para más información escribinos a{' '}
                            <a
                              href="mailto:contactoouro@gmail.com"
                              className="underline underline-offset-2 hover:opacity-80 transition-opacity"
                              style={{ color: '#A04A3A' }}
                            >
                              contactoouro@gmail.com
                            </a>
                            .
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!loadingTherapist && !therapist && (
              <p className="font-serif italic font-light text-base text-white-dim">
                No pudimos cargar el perfil.
              </p>
            )}
          </section>
        )}

        {/* Logout */}
        <div className="mt-10 text-center">
          <button
            onClick={handleLogout}
            className="font-sans text-[10px] font-medium uppercase tracking-eyebrow text-white-faint hover:text-gold transition-colors duration-300 underline underline-offset-4"
          >
            Cerrar sesión
          </button>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
