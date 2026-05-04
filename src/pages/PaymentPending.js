import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PaymentPending = () => {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-16">
        <div className="max-w-md w-full">

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pago pendiente</h1>
            <p className="text-gray-500 mb-6">
              Tu pago está siendo procesado. Cuando se confirme, recibirás el link de Zoom para tu sesión.
            </p>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 mb-8">
              Tu turno quedó reservado con estado <strong>Pendiente de pago</strong>.
              Una vez acreditado el pago, el turno se confirmará automáticamente.
            </div>

            <div className="flex flex-col gap-3">
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
                Volver a terapeutas
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentPending;
