import React from 'react';
import { Link } from 'react-router-dom';
import LegalDocumentLayout, { LegalSection } from '../components/LegalDocumentLayout';

const TermsPage = () => (
  <LegalDocumentLayout title="Términos de servicio" lastUpdated="marzo 2026">

    <LegalSection number={1} title="Aceptación de los términos">
      <p>
        Al registrarte y utilizar Ouro, aceptás estos Términos de Servicio en su totalidad.
        Si no estás de acuerdo con alguno de ellos, no debés usar la plataforma.
      </p>
    </LegalSection>

    <LegalSection number={2} title="Descripción del servicio">
      <p>
        Ouro es una plataforma digital que conecta a personas con terapeutas certificados
        para sesiones de acompañamiento terapéutico online. No somos un servicio de emergencias
        ni reemplazamos la atención médica presencial.
      </p>
    </LegalSection>

    <LegalSection number={3} title="Registro y cuenta">
      <p>
        Debés proporcionar información veraz al registrarte. Sos responsable de mantener la
        confidencialidad de tu contraseña y de todas las actividades realizadas bajo tu cuenta.
      </p>
    </LegalSection>

    <LegalSection number={4} title="Uso aceptable">
      <p>
        Te comprometés a usar Ouro únicamente con fines legítimos y a no interferir con el
        funcionamiento de la plataforma ni con la experiencia de otros usuarios.
      </p>
    </LegalSection>

    <LegalSection number={5} title="Modificaciones">
      <p>
        Ouro se reserva el derecho de modificar estos términos en cualquier momento.
        Te notificaremos ante cambios significativos.
      </p>
    </LegalSection>

    <LegalSection number={6} title="Contacto">
      <p>
        Si tenés preguntas sobre estos términos, escribinos desde la sección{' '}
        <Link
          to="/#contacto"
          className="text-gold hover:text-gold-bright transition-colors duration-300 underline underline-offset-2"
        >
          Contacto
        </Link>
        .
      </p>
    </LegalSection>

  </LegalDocumentLayout>
);

export default TermsPage;
