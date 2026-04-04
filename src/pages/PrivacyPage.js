import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPage = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
      <p className="text-sm text-gray-400 mb-8">Última actualización: marzo 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Información que recopilamos</h2>
          <p>
            Al registrarte en Ouro recopilamos: nombre completo, correo electrónico, número de teléfono
            y fecha de nacimiento. Esta información es necesaria para brindar el servicio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Cómo usamos tu información</h2>
          <p>
            Usamos tu información para gestionar tu cuenta, conectarte con terapeutas, enviarte
            confirmaciones de turnos y mejorar la plataforma. No vendemos ni compartimos tus datos
            con terceros sin tu consentimiento, salvo obligación legal.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Confidencialidad de las sesiones</h2>
          <p>
            Las sesiones terapéuticas realizadas a través de Ouro son estrictamente confidenciales.
            No accedemos al contenido de tus sesiones.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Seguridad</h2>
          <p>
            Implementamos medidas técnicas y organizativas para proteger tu información personal
            contra accesos no autorizados, pérdida o divulgación.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Tus derechos</h2>
          <p>
            Tenés derecho a acceder, corregir o eliminar tus datos personales en cualquier momento.
            Para ejercer estos derechos, contactanos desde la sección{' '}
            <Link to="/#contacto" className="text-mystic-600 hover:text-mystic-700 font-medium">
              Contacto
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Cookies</h2>
          <p>
            Usamos almacenamiento local del navegador para mantener tu sesión activa.
            No utilizamos cookies de seguimiento de terceros.
          </p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPage;
