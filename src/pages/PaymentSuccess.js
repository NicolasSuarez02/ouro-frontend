import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAppointmentById } from '../services/api';

const formatDatetime = (isoStr) => {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return (
    d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) +
    ' hs'
  );
};

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('ouro_user') || 'null');

  useEffect(() => {
    if (!appointmentId || !user) { setLoading(false); return; }
    getAppointmentById(appointmentId, user.id)
      .then(setAppointment)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [appointmentId]); // eslint-disable-line

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-16">
        <div className="max-w-md w-full">

          {/* Ícono de éxito */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Pago exitoso!</h1>
            <p className="text-gray-500 mb-6">Tu turno quedó confirmado.</p>

            {loading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              </div>
            ) : appointment ? (
              <div className="text-left space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                  <p className="text-sm text-gray-500">Terapeuta</p>
                  <p className="font-semibold text-gray-900">{appointment.therapistFullName}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                  <p className="text-sm text-gray-500">Fecha y hora</p>
                  <p className="font-semibold text-gray-900 capitalize">{formatDatetime(appointment.startAt)}</p>
                </div>

                {appointment.priceAmountCents != null && (
                  <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                    <p className="text-sm text-gray-500">Monto pagado</p>
                    <p className="font-semibold text-gray-900">
                      {(appointment.priceAmountCents / 100).toLocaleString('es-AR', {
                        style: 'currency',
                        currency: appointment.currency || 'ARS',
                      })}
                    </p>
                  </div>
                )}

                {/* Link de Zoom */}
                {appointment.zoomJoinUrl ? (
                  <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl">
                    <p className="text-sm font-semibold text-primary-700 mb-2">Link de la sesión (Zoom)</p>
                    <a
                      href={appointment.zoomJoinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary-600 font-medium hover:text-primary-800 underline break-all"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.069A1 1 0 0121 8.867v6.266a1 1 0 01-1.447.902L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Unirse a la sesión
                    </a>
                    <p className="text-xs text-primary-500 mt-1">También lo encontrás en "Mis turnos"</p>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                    El link de Zoom estará disponible en "Mis turnos" en unos instantes.
                  </div>
                )}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3">
              <Link
                to="/mis-turnos"
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-mystic-500 to-primary-600 hover:from-mystic-600 hover:to-primary-700 transition-all text-center"
              >
                Ver mis turnos
              </Link>
              <Link
                to="/terapeutas"
                className="w-full py-2.5 rounded-xl font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors text-center text-sm"
              >
                Explorar más terapeutas
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
