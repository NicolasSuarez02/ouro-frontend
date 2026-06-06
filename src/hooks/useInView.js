import { useEffect, useRef, useState } from 'react';

/**
 * useInView — Hook para detectar si un elemento está intersectando el viewport.
 *
 * Implementado con IntersectionObserver. Devuelve [ref, inView]:
 *   - ref:    React ref para aplicar al elemento a observar.
 *   - inView: boolean, true cuando el elemento entra en viewport.
 *
 * Opciones:
 *   - threshold:  fracción del elemento que debe estar visible (default 0.15).
 *   - rootMargin: márgen del viewport (CSS string, default '0px').
 *   - once:       si true (default), una vez visible no vuelve a false al salir.
 *
 * Fallback: si IntersectionObserver no está disponible (entornos viejos o SSR),
 * devuelve inView = true para no ocultar contenido permanentemente.
 *
 * Uso típico:
 *   const [ref, inView] = useInView();
 *   <section ref={ref} className={`fade-up ${inView ? 'is-visible' : ''}`}>
 *     ...
 *   </section>
 *
 * O envuelto en <FadeUp> para no tener que pasar ref manualmente.
 */
export default function useInView({ threshold = 0.15, rootMargin = '0px', once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // Fallback para entornos sin IntersectionObserver
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}
