import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-16">
        <div className="max-w-md w-full">

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pago rechazado</h1>
            <p className="text-gray-500 mb-6">
              No se pudo procesar el pago. Tu turno quedó reservado pero pendiente de pago.
            </p>

            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-8">
              Podés intentarlo de nuevo desde <strong>"Mis turnos"</strong>.
              El horario seguirá reservado por un tiempo limitado.
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

export default PaymentFailure;
