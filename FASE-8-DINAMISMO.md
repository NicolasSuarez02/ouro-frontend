# Fase 8 — Dinamismo y micro-interacciones

Documento vivo. Registra todo lo que requiera animación, micro-interacción o decoración dinámica y se posponga hasta una pasada unificada al final del rediseño visual. La idea es no contaminar los bloques atómicos de cada componente con detalles de animación que es mejor afinar en bloque cuando ya está todo el sitio en su estética final.

---

## Observaciones registradas por Roque (post Fase 2)

### Home / Cómo empezar — Línea conectora desalineada y estática

- La línea conectora horizontal dorada entre los círculos de los 5 pasos no está centrada verticalmente respecto a los círculos: pasa por encima en vez de cruzarlos por el medio.
- Además es estática. Debería tener animación de "dibujado" de izquierda a derecha al entrar en viewport: `scaleX 0 → 1` con `cubic-bezier(0.16, 1, 0.3, 1)`, duración 1.5s.
- Implementación: ajustar `top: 40px` (centro vertical exacto del círculo 80px) y agregar Intersection Observer + clase `.visible` con `transform-origin: left`.

### Home / Fundadoras — Sin gesto interno en hover

- Las cards solo tienen elevación (`translateY -12px`) y línea superior animada, pero les falta la decoración interna que rotaba 180° en hover según el prototipo original (`founder-decoration`).
- Recuperar ese gesto: agregar un elemento decorativo (ej. un símbolo geométrico chico en una esquina del card, o un ornamento dorado debajo de la inicial) que rote 180° en hover con `transition: transform 0.8s ease-expo-out`.

### Home / Hero — Astral incompleto

- Hoy hay 2 anillos rotando (480s CW + 720s CCW), pero el DS v2 sección 8 especifica 4 anillos a velocidades 480s / 360s / 240s / 180s, con alternancia CW/CCW y respeto a `prefers-reduced-motion`.
- Completar el set de 4 anillos y verificar que las velocidades del DS estén exactas.
- En mobile: tamaño 50vmin, opacidad 0.5, para que no compita con el texto del hero.

---

## Observaciones detectadas durante Fases 0-2

### Global — Falta el Intersection Observer de entradas por scroll

- El DS v2 sección 7 especifica que todos los elementos importantes (cards, títulos, párrafos largos) deben entrar con:
  ```css
  opacity: 0;
  transform: translateY(20-50px);
  transition: opacity 1.2s var(--expo-out), transform 1.2s var(--expo-out);
  ```
- Al cruzar el viewport, agregar `.visible` y hacer `opacity: 1; transform: translateY(0)`.
- No está implementado en ningún componente. Decidir si va como utility CSS + hook React global (`useInView` + estado), o como Provider que envuelva páginas enteras.

### Navbar — Drawer mobile sin slide-in

- El drawer aparece abruptamente cuando se abre `isMenuOpen`. Agregar slide-in desde la derecha con `transform: translateX(100%) → 0` con `transition: transform 0.6s var(--expo-out)`.
- Y agregar fade-in del backdrop con `opacity: 0 → 1`.

### Navbar — Modal logout sin entrada animada

- Igual situación: el modal aparece de golpe. Agregar fade del backdrop + scale-up sutil del card (`scale: 0.96 → 1` + `opacity: 0 → 1` durante 0.4s).

### Botones con flecha — Algunas flechas no se animan por falta de `group` envolvente

- Lugares detectados donde puse `<span className="... group-hover:translate-x-2">→</span>` pero el contenedor no tiene la clase `group`, así que la flecha queda estática:
  - `Home.js` — CTA "Ver todos los terapeutas" (sección Terapeutas, bloque 2.C).
  - `Home.js` — Botón "Iniciar" del CTA grande (bloque 2.E).
- Fix simple: agregar `group` al className del Link/button contenedor. Costo casi cero, lo dejo en este TODO para hacerlo junto con el pase general de Fase 8.

### Hero — Reduced motion no afecta los anillos

- Los dos anillos del hero usan `animate-spin` con `animationDuration` en inline style. La regla global `@media (prefers-reduced-motion: reduce) { animation-duration: 0.01ms !important; }` cubre el caso, pero conviene verificar visualmente y agregar un fallback explícito que pause completamente la rotación (no solo la acelere).

### Loader inicial — No implementado

- Pendiente del DS v2 sección 8: animación 1.6s totales en primera visita (sessionStorage), skip para `prefers-reduced-motion`. Como los SVG son rellenos (no trazados), evaluar alternativa a stroke-draw: clip-path circular que revele el isotipo en barrido angular / mask / fade radial.

### Cursor custom — No implementado

- DS v2 sección 8: anillo 20px border `gold-dim`, dot central 4px gold, expansión a 48px en clickables con fondo `rgba(198, 167, 94, 0.08)`. Solo desktop con mouse (`@media (hover: hover) and (pointer: fine)`). Cursor normal en inputs/textarea.

### Side-rail — No implementado

- DS v2 sección 8: visible ≥1440px (`2xl:`). Progress dot animado con pulse 4s. Label vertical "OURO" en lateral inferior. Oculto en mobile y tablet.

### Ruido fractal de fondo — No implementado

- DS v2 sección 6: capa SVG con `mix-blend-mode: overlay` y opacity 0.07. Verificar performance en mobile y reducir/desactivar si afecta scroll.

### Hovers de cards — Box-shadow del DS

- Las cards de Fase 2 (founders, terapeutas, garantías) usan `shadow-card-hover` (`0 30px 80px rgba(0, 0, 0, 0.4)`). Está correcto pero la duración del shadow es la de la transition genérica del card (`duration-600`). El DS no especifica una duración distinta, así que probablemente esté bien — verificar visualmente cuando se haga el pase.

### Decoración: puntos dorados con glow

- DS v2 sección 6 menciona puntos dorados de 4-8px ocasionales con `box-shadow: 0 0 12px gold` (`shadow-gold-glow-soft` ya está en el tailwind config). Usados como acentos en eyebrows, decoraciones de cards, marcadores de progreso. Aplicar puntualmente al pasar por las secciones.

---

## Cómo se trabaja Fase 8

1. Implementar primero los efectos GLOBALES (Intersection Observer + utility classes, reduced-motion, cursor custom, loader, ruido fractal). Esto cubre el 80% del dinamismo automáticamente.
2. Después pasar componente por componente afinando los gestos específicos (drawer slide-in, hover decorations, líneas que se dibujan, anillos completos).
3. Verificar `prefers-reduced-motion` en cada paso.
4. Test en mobile: que las animaciones no afecten performance del scroll.

---

## Versionado

- **v1 — Mayo 2026:** Documento inicial con observaciones de Roque tras revisión de Home + observaciones detectadas durante Fases 0-2. Se va a expandir durante Fases 3-7.
