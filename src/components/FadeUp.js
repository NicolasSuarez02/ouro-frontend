import React from 'react';
import useInView from '../hooks/useInView';

/**
 * FadeUp — Wrapper que aplica la utility `.fade-up` + `.is-visible` cuando
 * el elemento entra en viewport. Sirve para entrar secciones / cards con
 * el gesto editorial OURO (opacity 0 + translateY → opacity 1 + translateY 0,
 * 1.2s con ease-expo-out).
 *
 * Props:
 *   - as:        elemento HTML (default "div"). Útil pasar "section" para
 *                envolver secciones del Home sin agregar wrapper extra.
 *   - delay:     ms de retraso de la transición (default 0).
 *   - className: clases adicionales (se concatenan).
 *   - threshold: fracción del elemento que debe estar visible para disparar
 *                (default 0.15, ver useInView).
 *   - children, ...rest: pasados al elemento subyacente (id, etc.).
 *
 * Respeta prefers-reduced-motion (definido en index.css: anula la animación
 * y muestra el contenido inmediatamente).
 */
const FadeUp = ({
  as: Tag = 'div',
  delay = 0,
  className = '',
  threshold = 0.15,
  children,
  ...rest
}) => {
  const [ref, inView] = useInView({ threshold });
  const composedClassName = `fade-up${inView ? ' is-visible' : ''}${className ? ' ' + className : ''}`;
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <Tag ref={ref} className={composedClassName} style={style} {...rest}>
      {children}
    </Tag>
  );
};

export default FadeUp;
