import { useState, useRef, useEffect, useCallback } from 'react';

const MIN_VISIBLE_MS = 2000;
const FADE_OUT_MS = 400;

/**
 * Hook para manejar mensajes de error de formulario que respetan estas reglas:
 *
 *   1. NO se auto-ocultan por timer. Solo se descartan cuando el usuario
 *      hace alguna acción (típicamente, tipea en un input).
 *   2. Permanecen visibles al menos MIN_VISIBLE_MS (2s) aunque el usuario
 *      empiece a tipear inmediatamente. Esto previene el bug donde el
 *      banner se borra antes de poder ser leído.
 *   3. Hacen fade-out de FADE_OUT_MS (400ms) al ser descartados.
 *
 * API:
 *   - error            (string)  — mensaje actual. '' cuando no hay error.
 *   - errorFadeOut     (boolean) — true mientras se ejecuta el fade-out.
 *                                  Usar en className del banner: opacity-0 cuando true.
 *   - showError(msg)   — muestra error nuevo. Cancela cualquier fade pendiente
 *                        y reinicia el timer de mínima visibilidad.
 *   - dismissError()   — inicia el descarte respetando el mínimo visible.
 *                        Llamar en handleChange / onChange de inputs.
 *   - clearError()     — limpia inmediatamente (sin fade). Uso raro,
 *                        ej. al iniciar un submit limpio.
 *
 * Uso típico:
 *
 *   const { error, errorFadeOut, showError, dismissError } = useDismissibleError();
 *   const handleChange = (e) => { setFormData(...); dismissError(); };
 *   const handleSubmit = async (e) => {
 *     try { ... } catch (err) { showError(err.message); }
 *   };
 *   return (
 *     <>
 *       {error && (
 *         <div className={`... transition-opacity duration-400 ${errorFadeOut ? 'opacity-0' : 'opacity-100'}`}>
 *           {error}
 *         </div>
 *       )}
 *     </>
 *   );
 */
export default function useDismissibleError() {
  const [error, setError] = useState('');
  const [errorFadeOut, setErrorFadeOut] = useState(false);
  const shownAtRef = useRef(0);
  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const showError = useCallback((msg) => {
    clearTimer();
    setErrorFadeOut(false);
    setError(msg);
    shownAtRef.current = Date.now();
  }, []);

  const clearError = useCallback(() => {
    clearTimer();
    setError('');
    setErrorFadeOut(false);
  }, []);

  const dismissError = useCallback(() => {
    // Si ya hay un fade en cola, no apilar otro.
    if (timerRef.current) return;

    // Leer el error actual via setter functional (sin dependencia en closure).
    setError((current) => {
      if (!current) return current;

      const elapsed = Date.now() - shownAtRef.current;
      const delay = Math.max(0, MIN_VISIBLE_MS - elapsed);

      timerRef.current = setTimeout(() => {
        // Iniciar fade-out
        setErrorFadeOut(true);
        // Después del fade, limpiar state
        timerRef.current = setTimeout(() => {
          setError('');
          setErrorFadeOut(false);
          timerRef.current = null;
        }, FADE_OUT_MS);
      }, delay);

      return current;
    });
  }, []);

  // Cleanup al desmontar
  useEffect(() => clearTimer, []);

  return { error, errorFadeOut, showError, dismissError, clearError };
}
