import React, { useEffect, useRef, useState } from 'react';

/**
 * CustomCursor — Cursor custom OURO (anillo dorado + dot central).
 *
 * Reglas del DS v2 sección 8:
 *   - Solo desktop con mouse (`@media (hover: hover) and (pointer: fine)`).
 *   - Anillo 20px border 1px gold-dim. Dot central 4px gold sólido.
 *   - Hover sobre clickables: anillo se expande a 48px con fondo
 *     rgba(198, 167, 94, 0.08).
 *   - Sobre inputs/textarea/select: el cursor custom se OCULTA y el
 *     navegador muestra `cursor: text` (definido en index.css).
 *   - Sin `mix-blend-mode: difference` (decisión refinada del DS).
 *
 * Implementación:
 *   - matchMedia detecta entorno desktop con mouse. En touch o tablet
 *     el componente no renderiza nada.
 *   - mousemove + document.elementFromPoint para detectar elemento
 *     bajo el cursor en cada movimiento (clasifica entre "input",
 *     "clickable", "normal").
 *   - 2 divs `position: fixed` que siguen al mouse vía inline style.
 */

const INPUT_SELECTORS = 'input, textarea, select, [contenteditable="true"]';
const HOVER_SELECTORS = 'a, button, [role="button"], summary, label[for], [data-cursor-hover]';

const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHover, setIsHover] = useState(false);
  const [hideOnInput, setHideOnInput] = useState(false);
  const rafRef = useRef(null);

  // Detectar si el entorno es desktop con mouse
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setEnabled(mq.matches);
    const handler = (e) => setEnabled(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
    // Safari < 14 fallback
    mq.addListener(handler);
    return () => mq.removeListener(handler);
  }, []);

  // Listeners de mousemove + clasificación del elemento bajo el cursor
  useEffect(() => {
    if (!enabled) return undefined;

    const updateFromEvent = (clientX, clientY) => {
      setPos({ x: clientX, y: clientY });
      const el = document.elementFromPoint(clientX, clientY);
      if (!el) {
        setHideOnInput(false);
        setIsHover(false);
        return;
      }
      const overInput = !!el.closest(INPUT_SELECTORS);
      setHideOnInput(overInput);
      setIsHover(!overInput && !!el.closest(HOVER_SELECTORS));
    };

    const onMove = (e) => {
      const cx = e.clientX;
      const cy = e.clientY;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => updateFromEvent(cx, cy));
    };

    const onLeave = () => {
      setPos({ x: -100, y: -100 });
      setIsHover(false);
      setHideOnInput(false);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled || hideOnInput) return null;

  const ringSize = isHover ? 48 : 20;
  const ringStyle = {
    width: `${ringSize}px`,
    height: `${ringSize}px`,
    left: `${pos.x}px`,
    top: `${pos.y}px`,
    background: isHover ? 'rgba(198, 167, 94, 0.08)' : 'transparent',
  };
  const dotStyle = {
    left: `${pos.x}px`,
    top: `${pos.y}px`,
  };

  return (
    <>
      <div className="ouro-cursor-ring" style={ringStyle} aria-hidden="true" />
      <div className="ouro-cursor-dot" style={dotStyle} aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
