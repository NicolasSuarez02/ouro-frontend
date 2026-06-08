import React from 'react';

// ---------------------------------------------------------------
// ZoomLinkNotice — aviso informativo sobrio (Fase 10.C).
// Aclara que el enlace de Zoom no aparece de inmediato: se genera
// unos minutos antes de la sesión. NO es un error ni una alerta
// grave — usa el tono OURO (borde dorado fino, fondo gold-ghost,
// ícono de reloj gold-dim, texto serif white-dim).
// Se muestra donde el usuario podría preguntarse dónde está el link:
// Mis turnos (próximos), Dashboard (próximo turno), pago exitoso y
// confirmación de reserva.
// ---------------------------------------------------------------
const ClockIcon = ({ className = '' }) => (
  <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3 1.5" />
  </svg>
);

const ZoomLinkNotice = ({ className = '' }) => (
  <div
    className={`flex items-start gap-3 border border-gold-faint bg-gold-ghost px-4 py-3 ${className}`}
    role="note"
  >
    <ClockIcon className="flex-shrink-0 mt-0.5 text-gold-dim" />
    <p className="font-serif font-light text-sm text-white-dim leading-relaxed">
      Unos minutos antes de la sesión vas a ver disponible el enlace de Zoom para ingresar.
    </p>
  </div>
);

export default ZoomLinkNotice;
