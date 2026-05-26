import React from 'react';
import { Link } from 'react-router-dom';
import LegalDocumentLayout, { LegalSection } from '../components/LegalDocumentLayout';

const PrivacyPage = () => (
  <LegalDocumentLayout title="Política de privacidad" lastUpdated="marzo 2026">

    <LegalSection number={1} title="Información que recopilamos">
      <p>
        Al registrarte en Ouro recopilamos: nombre completo, correo electrónico, número de teléfono
        y fecha de nacimiento. Esta información es necesaria para brindar el servicio.
      </p>
    </LegalSection>

    <LegalSection number={2} title="Cómo usamos tu información">
      <p>
        Usamos tu información para gestionar tu cuenta, conectarte con terapeutas, enviarte
        confirmaciones de turnos y mejorar la plataforma. No vendemos ni compartimos tus datos
        con terceros sin tu consentimiento, salvo obligación legal.
      </p>
    </LegalSection>

    <LegalSection number={3} title="Confidencialidad de las sesiones">
      <p>
        Las sesiones terapéuticas realizadas a través de Ouro son estrictamente confidenciales.
        No accedemos al contenido de tus sesiones.
      </p>
    </LegalSection>

    <LegalSection number={4} title="Seguridad">
      <p>
        Implementamos medidas técnicas y organizativas para proteger tu información personal
        contra accesos no autorizados, pérdida o divulgación.
      </p>
    </LegalSection>

    <LegalSection number={5} title="Tus derechos">
      <p>
        Tenés derecho a acceder, corregir o eliminar tus datos personales en cualquier momento.
        Para ejercer estos derechos, contactanos desde la sección{' '}
        <Link
          to="/#contacto"
          className="text-gold hover:text-gold-bright transition-colors duration-300 underline underline-offset-2"
        >
          Contacto
        </Link>
        .
      </p>
    </LegalSection>

    <LegalSection number={6} title="Cookies">
      <p>
        Usamos almacenamiento local del navegador para mantener tu sesión activa.
        No utilizamos cookies de seguimiento de terceros.
      </p>
    </LegalSection>

  </LegalDocumentLayout>
);

export default PrivacyPage;
