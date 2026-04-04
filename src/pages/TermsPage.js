import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsPage = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Términos de Servicio</h1>
      <p className="text-sm text-gray-400 mb-8">Última actualización: marzo 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Aceptación de los términos</h2>
          <p>
            Al registrarte y utilizar Ouro, aceptás estos Términos de Servicio en su totalidad.
            Si no estás de acuerdo con alguno de ellos, no debés usar la plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Descripción del servicio</h2>
          <p>
            Ouro es una plataforma digital que conecta a personas con terapeutas certificados
            para sesiones de acompañamiento terapéutico online. No somos un servicio de emergencias
            ni reemplazamos la atención médica presencial.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Registro y cuenta</h2>
          <p>
            Debés proporcionar información veraz al registrarte. Sos responsable de mantener la
            confidencialidad de tu contraseña y de todas las actividades realizadas bajo tu cuenta.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Uso aceptable</h2>
          <p>
            Te comprometés a usar Ouro únicamente con fines legítimos y a no interferir con el
            funcionamiento de la plataforma ni con la experiencia de otros usuarios.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Modificaciones</h2>
          <p>
            Ouro se reserva el derecho de modificar estos términos en cualquier momento.
            Te notificaremos ante cambios significativos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Contacto</h2>
          <p>
            Si tenés preguntas sobre estos términos, escribinos desde la sección{' '}
            <Link to="/#contacto" className="text-mystic-600 hover:text-mystic-700 font-medium">
              Contacto
            </Link>.
          </p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermsPage;
