import React, { useState } from 'react';
import { acceptTherapistGuidelines } from '../services/api';

const GUIDELINES = [
  {
    title: 'Respeto y escucha activa',
    paragraphs: [
      'Tratamos a cada miembro con consideración. Valoramos los espacios de palabra y el tiempo del otro, promoviendo un diálogo constructivo y empático en cada interacción.',
      'Las situaciones o diferencias personales nunca justifican ni tiñen el buen trato hacia el otro. La calidez y el respeto profesional son innegociables bajo cualquier circunstancia.',
    ],
  },
  {
    title: 'Fraternidad, cooperación',
    paragraphs: [
      'Construimos comunidad desde la colaboración. Nos apoyamos, compartimos saberes y crecemos juntos, entendiendo que el logro de uno es el impulso de todos, respetando las singularidades.',
      'Comprender al otro incluye también respetar cuando el profesional necesita su propio espacio, siguiendo su ritmo en la participación de la comunidad, desde Ouro se validará el pedido del mismo sin objeción alguna.',
    ],
  },
  {
    title: 'Aceptación de la diversidad',
    paragraphs: [
      'Honramos las distintas miradas, recorridos y formas de ver el mundo. Este es un espacio libre de juicios, abierto a la pluralidad para ampliar la riqueza de los saberes.',
    ],
  },
  {
    title: 'Honorabilidad y ética profesional',
    paragraphs: [
      'Actuamos con transparencia, honestidad y compromiso en cada sesión y vínculo, resguardando la confidencialidad y el valor del trabajo terapéutico, quedando totalmente excluidas las conductas deshonestas, la falta de transparencia en los acuerdos o cualquier acción que comprometa la integridad de la marca Ouro y de las personas que transitan por ella.',
    ],
  },
  {
    title: 'Aprendizaje continuo (base de permanencia)',
    paragraphs: [
      'Mantenemos la curiosidad viva y la mente abierta. Nos nutrimos de nuevas perspectivas e investigaciones para evolucionar en nuestra práctica personal para el bien mayor.',
      'El propio estudio continuo y la actualización constante de saberes son requisitos indispensables y la base fundamental para la permanencia activa como terapeutas en la plataforma.',
    ],
  },
  {
    title: 'Autodisciplina y autosuperación',
    paragraphs: [
      'Cuidamos el espacio y nuestro propio desarrollo con responsabilidad y compromiso personal. Poniendo énfasis en cultivar nuestro mundo interior como base para el servicio a los demás.',
    ],
  },
  {
    title: 'Canalización formal de inquietudes y buena fe',
    paragraphs: [
      'Cualquier diferencia, conflicto o no conformidad debe canalizarse de manera formal a través del formulario correspondiente, evitando vías informales o ruidosas.',
    ],
  },
];

/**
 * Modal bloqueante: un terapeuta aprobado debe aceptar las pautas de convivencia
 * antes de seguir usando su cuenta. No se puede cerrar sin aceptar.
 */
const TherapistGuidelinesModal = ({ onAccepted }) => {
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleAccept = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await acceptTherapistGuidelines();
      onAccepted(updated);
    } catch {
      setError('No pudimos guardar tu aceptación. Intentá nuevamente.');
      setSaving(false);
    }
  };

  return (
    <div
      className="ouro-backdrop fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-deep/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guidelines-title"
    >
      <div className="ouro-modal w-full max-w-2xl max-h-[90vh] flex flex-col bg-navy-elevated border border-gold-faint shadow-card-hover">
        <div className="px-6 sm:px-8 pt-8 pb-5 border-b border-gold-faint">
          <p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold mb-3">
            Antes de comenzar
          </p>
          <h2 id="guidelines-title" className="font-serif font-light text-2xl sm:text-3xl text-white">
            Pautas de convivencia y compromiso en OURO<sup className="text-base">®</sup> 🌿
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
          <ol className="space-y-6">
            {GUIDELINES.map((g, i) => (
              <li key={g.title}>
                <h3 className="font-serif text-lg text-gold mb-2">
                  {i + 1}. {g.title}
                </h3>
                {g.paragraphs.map((p) => (
                  <p key={p} className="font-serif font-light text-base text-white-dim leading-relaxed mb-2">
                    {p}
                  </p>
                ))}
              </li>
            ))}
          </ol>
          <p className="font-serif italic font-light text-base text-white-dim leading-relaxed">
            Todos los términos y condiciones de estas pautas, así como las normas de usabilidad de la
            plataforma, deben ser conocidas y respetadas estrictamente bajo el principio de buena fe.
          </p>
        </div>

        <div className="px-6 sm:px-8 py-6 border-t border-gold-faint space-y-5">
          <div className="flex items-start gap-3">
            <button
              type="button"
              role="checkbox"
              aria-checked={checked}
              onClick={() => setChecked((v) => !v)}
              className={`mt-0.5 w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors duration-300 ${
                checked ? 'bg-gold border-gold' : 'bg-transparent border-gold-faint'
              }`}
            >
              {checked && (
                <svg className="w-2.5 h-2.5 text-navy" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2,6 5,9 10,3" />
                </svg>
              )}
            </button>
            <span
              className="font-serif font-light text-base text-white leading-snug cursor-pointer select-none"
              onClick={() => setChecked((v) => !v)}
            >
              He leído y acepto los términos de los terapeutas de Ouro
            </span>
          </div>

          {error && (
            <p className="font-serif font-light text-sm" style={{ color: '#A04A3A' }} role="alert">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleAccept}
            disabled={!checked || saving}
            className="w-full inline-flex items-center justify-center gap-3 bg-gold-gradient py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {saving ? 'Guardando…' : 'Aceptar y continuar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TherapistGuidelinesModal;
