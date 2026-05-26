# Fase 8 — Dinamismo y micro-interacciones

Documento vivo. Registra todo lo que requiera animación, micro-interacción o decoración dinámica y se posponga hasta una pasada unificada al final del rediseño visual. La idea es no contaminar los bloques atómicos de cada componente con detalles de animación que es mejor afinar en bloque cuando ya está todo el sitio en su estética final.

---

## Observaciones registradas por Roque (post Fase 2)

### Home / Cómo empezar — Línea conectora

- **Posicionamiento: RESUELTO (mayo 2026).** Se cambió `top-10` por `top-[72px]` para centrar verticalmente respecto a los círculos. Cálculo documentado en el código: eyebrow "Paso 01" (~31px) + mitad del círculo de 80px (40px) = ~72px hasta el centro vertical. Si en testing visual aparece 1-2px de offset por metrics de Inter, ajustar a `70px` o `74px`.
- **Pendiente animación de dibujado** de izquierda a derecha al entrar en viewport: `scaleX 0 → 1` con `cubic-bezier(0.16, 1, 0.3, 1)`, duración 1.5s, `transform-origin: left`. Requiere Intersection Observer (ver TODO global más abajo).

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

### Botones con flecha — RESUELTO (mayo 2026)

Revisión exhaustiva tras cerrar 7-LEGALES:

- **Falsos positivos:** las flechas de cards founders (Lucila/Elina/Celina) y de las 4 cards de garantías de "Cómo empezar" **ya funcionaban** — sus `<article>` envolventes tienen `group`. Sacar del listado.
- **Bug real único:** botón "Iniciar" del CTA grande de Home (sección "Volver es integrar"). **Fixed:** se agregó `group` al className del Link.
- **Bonus:** CTA "Ver todos los terapeutas" (sección Terapeutas del Home) que originalmente tenía flecha estática también se animó (group + transition). No era bug, era ausencia.

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

## Observaciones agregadas durante Fase 3 (Auth)

### Icono `AlertCircle` duplicado inline en 5 archivos

- Se introdujo el componente `<AlertCircle>` como `const` local en cada uno de los 5 archivos de auth (Login, Register, RegisterClient, ForgotPassword, ResetPassword) para los banners de error terracota. Es un SVG lucide-like (círculo + signo exclamación, stroke 1.5px, currentColor).
- Cuando se sume `lucide-react` como dependencia (planificado para Fase 6 o cuando se trate iconografía global), reemplazar todos los `<AlertCircle>` locales por `import { AlertCircle } from 'lucide-react'` único.
- Mismo plan aplica a `<EyeIcon>` (mostrar/ocultar contraseña) en Login.js y Register.js, y a `<ChevronDown>`, `<SearchIcon>`, `<MenuIcon>`, `<CloseIcon>` en Navbar.js.
- En general: cada vez que aparece `// Pendiente reemplazar por lucide-react` en un comentario del código, va al pase de iconografía.

### Hook `useDismissibleError` — reglas de visibilidad mínima

- Hook creado en `src/hooks/useDismissibleError.js` para resolver el bug de "flash de error". Implementa: NO auto-hide por timer, mínimo 2s visible, fade-out 400ms.
- Usado en los 5 forms de auth. Pendiente para Fase 8: evaluar si extender el patrón a otros banners de feedback del sitio (success de form de contacto, success de calificación, banners de booking en TherapistDetail).

### Interceptor de 401 — endpoint allowlist

- Después del fix Opción A en `src/services/api.js`, los endpoints de auth están excluidos del redirect destructivo del interceptor 401. Si el backend agrega endpoints de auth nuevos (ej. `/users/oauth-callback`, `/users/2fa-verify`), agregarlos al array `AUTH_ENDPOINTS` para que no rompan el feedback de error en el form correspondiente.

---

## Observaciones agregadas durante Fases 4-7

### Modales sin animación de entrada (3 lugares ahora)

Además del modal de logout del Navbar y el modal de Recursos, sumamos:
- **Modal de eliminar de Recursos.js** — aparece abruptamente al click. Agregar fade del backdrop + scale-up del card.
- **Confirmación inline de cancelación en ClientAppointments AppointmentCard** — el card cambia de contenido sin transición. Agregar fade entre estados o slide vertical sutil.

### AppointmentCard sin línea superior animada en hover

Las cards del sistema OURO típicamente tienen la línea superior dorada que se dibuja en hover (scaleX 0→1, 800ms). En `ClientAppointments.AppointmentCard` no la agregué — quedó solo con border. Considerar agregar para coherencia transversal con el resto del sistema. Decisión: depende de si las cards de turnos deben sentirse "interactivas como un Link" o "informativas estáticas". Probablemente la línea queda bien.

### Banners booking en TherapistDetail sin transición de entrada

Los banners `bookingSuccess` y `bookingError` aparecen/desaparecen abruptamente. Cuando se implemente el patrón global de Intersection Observer + transiciones, considerar aplicar fade-in también a estos banners cuando aparecen post-reserva.

### Patch de iconos inline migración

Acumulado de iconos `AlertCircle`, `EyeIcon`, `VideoIcon`, `DocumentIcon`, `TrashIcon`, `PlusIcon`, `CloseIcon`, `SearchIcon`, `ChevronDown`, `MenuIcon` definidos inline en distintos archivos. Cuando se sume `lucide-react` como dependencia, hacer pasada de reemplazo masivo. Identificable buscando `// Pendiente reemplazar por lucide-react` en comentarios.

### PaymentStatusLayout — circle decorativo estático

El círculo decorativo con punto interno en `PaymentStatusLayout` es estático. Considerar para variant="pending" un punto que pulsa lentamente (4-5s, similar al side-rail) para comunicar el estado de "en proceso" sin caer en spinners genéricos.

### Páginas estáticas (legales) sin entrada animada

`TermsPage` y `PrivacyPage` cargan sin transición. Cuando se haga el pase global del Intersection Observer, considerar que las `<LegalSection>` entren con fade-up secuencial.

---

## Versionado

- **v1 — Mayo 2026:** Documento inicial con observaciones de Roque tras revisión de Home + observaciones detectadas durante Fases 0-2.
- **v1.1 — Mayo 2026:** Agregadas observaciones de Fase 3: iconos inline pendientes de migración a lucide-react, hook useDismissibleError, allowlist del interceptor 401.
- **v1.2 — Mayo 2026:** Resueltos dos ítems del TODO original (flechas con `group-hover` y posicionamiento de línea conectora). Agregadas observaciones de Fases 4-7: modales sin entrada, AppointmentCard sin línea animada, banners booking sin transición, acumulado de iconos inline, PaymentStatusLayout decorativo estático, páginas legales sin entrada animada.
