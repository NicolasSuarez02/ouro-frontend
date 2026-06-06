import React, { useEffect, useState } from 'react';
import { ReactComponent as Isotipo } from '../assets/logo/ouro-isotipo.svg';

/**
 * InitialLoader — Loader inicial OURO, basado en el prototipo
 * ouro-prototipo-v4(1).html.
 *
 * Secuencia (alineada al CSS en index.css):
 *   t=0       Isotipo arranca su stroke-draw (paths con stroke gold,
 *             fill-opacity 0, stroke-dasharray 3000, dashoffset 3000 → 0).
 *   t=1.2s    Comienza fillIn de los paths (fill-opacity 0 → 1, 0.5s).
 *   t=1.7s    Entra word "OURO" (fade + translateY 8 → 0, 0.4s).
 *   t=2.0s    Entra tagline "Renacé en cada ciclo" (fade + translateY).
 *   t=2.6s    Inicia fade-out del loader entero (0.6s).
 *   t=3.2s    Componente desmontado.
 *
 * Reglas:
 *   - sessionStorage `ouro_loader_seen` evita repetir en la misma sesión.
 *   - `?loader=1` en la URL FUERZA mostrar el loader aunque ya esté visto
 *     (modo test).
 *   - prefers-reduced-motion: reduce a 200ms + 50ms fade y anula keyframes.
 *   - pointer-events: none → nunca bloquea navegación.
 *   - Fallback defensivo si sessionStorage está bloqueado: no mostrar
 *     loader (return 'gone' al inicializar).
 */

const VISIBLE_MS = 2600;
const FADE_MS = 600;
const REDUCED_VISIBLE_MS = 200;
const REDUCED_FADE_MS = 50;

const InitialLoader = () => {
  const [phase, setPhase] = useState(() => {
    if (typeof window === 'undefined') return 'gone';

    // Modo test: ?loader=1 fuerza mostrarlo aunque la sesión ya lo haya
    // visto, útil para verificar visual sin tener que limpiar storage.
    let forceLoader = false;
    try {
      const url = new URL(window.location.href);
      forceLoader = url.searchParams.get('loader') === '1';
    } catch {
      /* URL inválida — ignorar */
    }

    try {
      if (!forceLoader && window.sessionStorage.getItem('ouro_loader_seen') === '1') {
        return 'gone';
      }
    } catch {
      // sessionStorage bloqueado (private browsing en algunos browsers).
      return 'gone';
    }
    return 'visible';
  });

  useEffect(() => {
    if (phase !== 'visible') return undefined;

    // Marcar la sesión apenas montamos: cualquier refresh dentro de la
    // misma sesión (sin ?loader=1) ya no dispara el loader.
    try {
      window.sessionStorage.setItem('ouro_loader_seen', '1');
    } catch {
      /* ignore */
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

  return (
    <div
      className={`ouro-initial-loader${fading ? ' is-fading' : ''}`}
      aria-hidden={fading ? 'true' : 'false'}
      role="presentation"
    >
      <div className="ouro-initial-loader__inner">
        <Isotipo className="ouro-initial-loader__mark" aria-hidden="true" />
        <span className="ouro-initial-loader__word">OURO</span>
        <span className="ouro-initial-loader__tagline">Renacé en cada ciclo</span>
      </div>
    </div>
  );
};

export default InitialLoader;
