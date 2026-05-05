import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getTherapistByUserId, getClientByUserId, getAppointmentsByUser, getMpConnectUrl } from '../services/api';

const badgeConfig = {
  PENDING: {
    label: 'Pendiente de aprobación',
    className: 'bg-amber-100 text-amber-800 border border-amber-200',
  },
  APPROVED: {
    label: 'Aprobado',
    className: 'bg-green-100 text-green-800 border border-green-200',
  },
  REJECTED: {
    label: 'Rechazado',
    className: 'bg-red-100 text-red-800 border border-red-200',
  },
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
        .then((data) => setTherapist(data))
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

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  const firstName = user.fullName?.split(' ')[0] || 'Usuario';
  const badge = therapist ? badgeConfig[therapist.approvalStatus] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Hola, {firstName}
          </h1>
          <p className="mt-1 text-gray-500">Tu espacio personal en Ouro</p>
        </div>

        {/* Banner resultado MP OAuth */}
        {mpStatus === 'success' && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium text-green-800">
              ¡Tu cuenta de Mercado Pago fue conectada exitosamente! Ya podés recibir pagos.
            </p>
            <button onClick={() => setMpStatus(null)} className="ml-auto text-green-500 hover:text-green-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {mpStatus === 'error' && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-sm font-medium text-red-800">
              No se pudo conectar con Mercado Pago. Intentá de nuevo.
            </p>
            <button onClick={() => setMpStatus(null)} className="ml-auto text-red-500 hover:text-red-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Card datos del usuario */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tus datos</h2>
          <dl className="space-y-3">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500 font-medium">Nombre completo</dt>
              <dd className="text-gray-800">{user.fullName}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500 font-medium">Email</dt>
              <dd className="text-gray-800">{user.email}</dd>
            </div>
            {user.phone && (
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500 font-medium">Teléfono</dt>
                <dd className="text-gray-800">{user.phone}</dd>
              </div>
            )}
            {client?.dateOfBirth && (
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500 font-medium">Fecha de nacimiento</dt>
                <dd className="text-gray-800">
                  {new Date(client.dateOfBirth).toLocaleDateString('es-AR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </dd>
              </div>
            )}
            {client?.timeOfBirth && (
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500 font-medium">Hora de nacimiento</dt>
                <dd className="text-gray-800">{client.timeOfBirth.slice(0, 5)} hs</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Card según rol */}
        {user.role === 'USER' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-mystic-400 to-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  ¿Querés ser terapeuta en Ouro?
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Completá tu perfil profesional y comenzá a recibir consultas. Tu solicitud será revisada por nuestro equipo.
                </p>
                <Link
                  to="/register-therapist"
                  className="inline-block bg-gradient-to-r from-mystic-500 to-primary-600 text-white px-5 py-2 rounded-lg hover:from-mystic-600 hover:to-primary-700 transition-all font-medium text-sm shadow-sm"
                >
                  Quiero ser terapeuta
                </Link>
              </div>
            </div>
          </div>
        )}

        {(user.role === 'USER' || user.role === 'THERAPIST') && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Mis turnos</h2>
              <Link
                to="/mis-turnos"
                className="inline-block bg-gradient-to-r from-mystic-500 to-primary-600 text-white px-4 py-1.5 rounded-lg hover:from-mystic-600 hover:to-primary-700 transition-all font-medium text-sm shadow-sm"
              >
                Ver todos
              </Link>
            </div>
            {nextAppointment ? (
              <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl">
                <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium">Próximo turno</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {nextAppointment.therapistFullName}
                  </p>
                  <p className="text-xs text-primary-600 capitalize">
                    {new Date(nextAppointment.startAt).toLocaleDateString('es-AR', {
                      weekday: 'long', day: 'numeric', month: 'long',
                    })} · {new Date(nextAppointment.startAt).toLocaleTimeString('es-AR', {
                      hour: '2-digit', minute: '2-digit',
                    })} hs
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No tenés turnos próximos.{' '}
                <Link to="/terapeutas" className="text-primary-600 hover:underline font-medium">Reservar uno</Link>
              </p>
            )}
          </div>
        )}

        {user.role === 'THERAPIST' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Tu perfil de terapeuta</h2>
              <div className="flex items-center gap-3">
                <Link
                  to="/manage-availability"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Gestionar horarios
                </Link>
                <Link
                  to="/edit-therapist"
                  className="text-sm text-mystic-600 hover:text-mystic-700 font-medium transition-colors"
                >
                  Editar perfil
                </Link>
              </div>
            </div>
            {loadingTherapist && (
              <p className="text-sm text-gray-400">Cargando perfil...</p>
            )}
            {!loadingTherapist && therapist && (
              <div className="space-y-4">
                {/* Foto + nombre */}
                <div className="flex items-center gap-4">
                  {therapist.photoUrl ? (
                    <img
                      src={therapist.photoUrl}
                      alt={user.fullName}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-primary-100 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mystic-400 to-primary-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-2xl">
                        {user.fullName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{user.fullName}</p>
                    {therapist.specialty && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-mystic-100 text-mystic-700">
                        {therapist.specialty}
                      </span>
                    )}
                  </div>
                </div>

                {/* Precio */}
                {therapist.priceAmountCents != null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Precio por sesión</span>
                    <span className="text-gray-800 font-semibold">
                      {(therapist.priceAmountCents / 100).toLocaleString('es-AR', {
                        style: 'currency',
                        currency: therapist.priceCurrency || 'ARS',
                      })}
                    </span>
                  </div>
                )}

                {/* Bio */}
                {therapist.bio && (
                  <div className="text-sm">
                    <span className="text-gray-500 font-medium block mb-1">Bio</span>
                    <p className="text-gray-600 leading-relaxed">{therapist.bio}</p>
                  </div>
                )}

                {/* Mercado Pago */}
                {therapist.approvalStatus === 'APPROVED' && (
                  <div className={`flex items-center justify-between gap-3 p-3 rounded-xl border ${
                    therapist.mpTokenConfigurado
                      ? 'bg-green-50 border-green-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <svg className={`w-5 h-5 flex-shrink-0 ${therapist.mpTokenConfigurado ? 'text-green-500' : 'text-amber-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {therapist.mpTokenConfigurado
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        }
                      </svg>
                      <div>
                        <p className={`text-xs font-semibold ${therapist.mpTokenConfigurado ? 'text-green-800' : 'text-amber-800'}`}>
                          {therapist.mpTokenConfigurado ? 'Mercado Pago conectado' : 'Conectá tu Mercado Pago'}
                        </p>
                        {!therapist.mpTokenConfigurado && (
                          <p className="text-xs text-amber-700 mt-0.5">Necesario para recibir pagos de tus clientes.</p>
                        )}
                      </div>
                    </div>
                    {!therapist.mpTokenConfigurado && (
                      <button
                        onClick={handleConnectMp}
                        disabled={connectingMp}
                        className="flex-shrink-0 bg-[#009ee3] hover:bg-[#0080c0] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                      >
                        {connectingMp ? 'Redirigiendo...' : 'Conectar'}
                      </button>
                    )}
                    {therapist.mpTokenConfigurado && (
                      <button
                        onClick={handleConnectMp}
                        disabled={connectingMp}
                        className="flex-shrink-0 text-xs text-green-700 hover:text-green-900 font-medium underline transition-colors disabled:opacity-60"
                      >
                        {connectingMp ? 'Redirigiendo...' : 'Reconectar'}
                      </button>
                    )}
                  </div>
                )}

                {/* Estado */}
                {badge && (
                  <div className="pt-1 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-medium">Estado:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    {therapist.approvalStatus === 'REJECTED' && (
                      <p className="mt-2 text-xs text-gray-500">
                        Tu solicitud fue rechazada. Para más información contactanos en{' '}
                        <a href="mailto:contactoouro@gmail.com" className="text-primary-600 hover:underline">
                          contactoouro@gmail.com
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
            {!loadingTherapist && !therapist && (
              <p className="text-sm text-gray-400">No se pudo cargar el perfil.</p>
            )}
          </div>
        )}

        {/* Botón logout */}
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors font-medium"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
