import React, { useEffect, useState } from 'react';
import { ReactComponent as Isotipo } from '../assets/logo/ouro-isotipo.svg';

/**
 * InitialLoader — Loader inicial de sesión, sobrio.
 *
 * Comportamiento:
 *   - Aparece únicamente en la PRIMERA carga de la sesión del navegador.
 *     Marca `sessionStorage.ouro_loader_seen = '1'` al montarse. Refrescos
 *     y navegaciones internas posteriores ya no lo muestran.
 *   - Tres fases:
 *       'visible'  → loader presente, opacity 1.
 *       'fading'   → loader iniciando fade-out (opacity 0).
 *       'gone'     → loader desmontado del árbol.
 *   - Si `prefers-reduced-motion: reduce`, todo el ciclo se acorta a ~150ms
 *     sin animaciones, para no estorbar.
 *   - No bloquea navegación: `pointer-events: none` durante el fade-out,
 *     y el isotipo / texto son aria-hidden cuando se está yendo.
 *
 * Visual:
 *   - Capa fija sobre todo el viewport, fondo navy-deep.
 *   - Isotipo OURO 80px + palabra "OURO" en serif tracking-brand.
 *   - Fade-in inicial sutil (translateY 8px → 0) en 0.6s.
 *
 * Duraciones por default:
 *   - Visible: 800ms.
 *   - Fade-out: 400ms.
 *   - Total perceptible: ~1.2s en primera visita.
 */

const VISIBLE_MS = 800;
const FADE_MS = 400;
const REDUCED_VISIBLE_MS = 100;
const REDUCED_FADE_MS = 50;

const InitialLoader = () => {
  const [phase, setPhase] = useState(() => {
    if (typeof window === 'undefined') return 'gone';
    try {
      if (window.sessionStorage.getItem('ouro_loader_seen') === '1') return 'gone';
    } catch {
      // sessionStorage puede estar bloqueado (modo private en algunos browsers)
      // — en ese caso no mostramos el loader para no riesgo de bucle.
      return 'gone';
    }
    return 'visible';
  });

  useEffect(() => {
    if (phase !== 'visible') return undefined;

    // Marcar inmediatamente para que cualquier refresh dentro de la
    // misma sesión ya no dispare el loader (aunque el fade aún no
    // haya terminado).
    try {
      window.sessionStorage.setItem('ouro_loader_seen', '1');
    } catch {
      // ignore
    }

    const prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const visibleMs = prefersReduced ? REDUCED_VISIBLE_MS : VISIBLE_MS;
    const fadeMs = prefersReduced ? REDUCED_FADE_MS : FADE_MS;

    const fadeTimer = setTimeout(() => setPhase('fading'), visibleMs);
    const goneTimer = setTimeout(() => setPhase('gone'), visibleMs + fadeMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(goneTimer);
    };
  }, [phase]);

  if (phase === 'gone') return null;

  const fading = phase === 'fading';
  const className = `ouro-initial-loader${fading ? ' is-fading' : ''}`;

  return (
    <div
      className={className}
      aria-hidden={fading ? 'true' : 'false'}
      role="presentation"
    >
      <div className="ouro-initial-loader__inner">
        <Isotipo className="ouro-initial-loader__mark" aria-hidden="true" />
        <span className="ouro-initial-loader__brand">OURO</span>
      </div>
    </div>
  );
};

export default InitialLoader;
