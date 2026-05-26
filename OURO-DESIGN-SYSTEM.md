# OURO — Sistema de Diseño v2

**Documento de referencia visual y narrativa para el frontend de la plataforma.**
Este documento es la fuente única de verdad para decisiones estéticas y de tono. Cualquier componente, vista, sección o texto debe respetar las reglas acá descritas. Las excepciones se documentan en el mismo archivo.

---

## 0. Filosofía de la marca

**OURO no es una plataforma de terapia. Es una propuesta filosófica sobre el tiempo, el trauma y la transformación.**

Este es el principio que debe guiar cada decisión: estética, textual, funcional. Si una decisión apoya la propuesta filosófica, va. Si la diluye, no va.

### El concepto central

> "El tiempo no lineal del alma donde volver sobre una experiencia no es retroceder, sino integrar."
>
> "OURO: el ciclo consciente que integra."

### Conceptos-clave (vocabulario propio del proyecto)

Estos términos deberían aparecer en copys del sitio, headlines, microcopy. NO son intercambiables por sus sinónimos del marketing genérico.

- **Ciclo** (no "proceso")
- **Integrar** (no "superar")
- **Volver** (no "revisar")
- **Alquimizar** lo no resuelto (no "trabajar" lo no resuelto)
- **Resignificar** el trauma
- **Coherencia** entre cuerpo, emoción y mente
- **Retorno** como herramienta de evolución
- **Memorias** (no "recuerdos")
- **Conciencia** (no "consciencia" en sentido cotidiano)
- **Tránsito** (no "etapa")
- **Espiral** (no "progreso lineal")

### El símbolo del ouroboros

Es un símbolo que aparece en múltiples civilizaciones que nunca se conocieron entre sí: Egipto (Mehen), Grecia (Ouroboros, Cleopatra alquímica), Norse (Jörmungandr), India (Shesha), México (Quetzalcóatl), Celtas (nudos infinitos), Andes (Amaru), Hopi (mundos cíclicos). Todas estas culturas pueden ser fuente de inspiración visual y narrativa para el sitio. **Reservorio creativo** del que se puede sacar sin que el sitio se vuelva un mosaico étnico genérico.

Carl Gustav Jung lo identificó como arquetipo del **proceso de individuación**: integrar los opuestos, atravesar las sombras, alcanzar mayor totalidad.

Maria Goeppert-Mayer (Nobel de Física, 1963) describió cómo la materia se organiza en **capas que se completan, sistemas que encuentran estabilidad al cerrarse sobre sí mismos**. Eso conecta el ouroboros con la estructura misma del átomo.

### Tono editorial

- **Voz contemplativa, no entusiasta.** Nada de "¡Comenzá tu viaje hoy!" o "¡Transformá tu vida!". Sí: "Volver es integrar."
- **Frases cortas con peso.** Pausa, respiración entre ideas. No textos largos sin aire.
- **Itálica como recurso de énfasis literario.** Una sola palabra clave por frase en itálica, no más.
- **Cero exclamaciones.** Nunca.
- **Cero emojis.** Nunca.
- **Referencias cultas posibles pero sin pedantería.** Mencionar a Jung está bien si encaja, no para lucirse.
- **Trato:** "vos" (Argentina) o "tú" (mercado más amplio) según definición de Roque. Por ahora, asumir "vos" argentino.
- **Pronombres y género:** lenguaje cuidado pero no forzado en "-e". Usar fórmulas que no requieran marcar género ("quienes buscan", "el camino", "la experiencia") cuando sea posible.

### Personalidad visual (del manual de marca)

- Elegante
- Mística (sin caer en new-age)
- Sobria
- De lujo contemporáneo
- "Poder silencioso, elegancia alquímica, transformación consciente y exclusividad"

### Lo que OURO NO es

- **NO es una clínica:** nada de cyan/turquesa de "salud", ni iconos de cruces médicas, ni lenguaje de "bienestar" genérico.
- **NO es una app de meditación:** nada de degradados rosa/violeta, ilustraciones planas friendly, lenguaje de "namaste".
- **NO es un marketplace:** nada de "más vendido", "rating", "comparar precios". Los terapeutas no son productos.
- **NO es corporativo-tech:** nada de "soluciones", "stack", "transformación digital".
- **NO es juvenil-pop:** nada de stickers, gifs, lenguaje de redes.
- **NO es espiritual-comercial:** nada de cristales, chakras, "energías", aunque se mencionen culturas ancestrales.

---

## 1. Identidad visual: el logo

### Composición

El logo de OURO es un ouroboros: dragón oriental (no occidental, importante distinción) que muerde su propia cola, formando un círculo cerrado. El trazo es continuo, con una ligera doble línea inferior que evita la geometría perfecta y le da hechura caligráfica.

Debajo del isotipo, en serif romana clásica, la palabra **OURO**.

### Versiones existentes

- **`ouro-navy-bg.svg`:** versión pensada para fondo navy. Isotipo en blanco roto, letras OURO en gradiente metálico.
- **`ouro-white-bg.svg`:** versión pensada para fondo blanco. Todo en navy.
- **`ouro-isotipo.svg`:** solo isotipo (sin texto OURO debajo), generado internamente como placeholder a partir de `ouro-navy-bg.svg`. Marcado como pendiente de reemplazo por entrega oficial del diseñador.

### Notas técnicas sobre los SVG (mayo 2026)

- Los SVG están construidos con `<path>` rellenos (`fill`), **no trazados (`stroke`)**. Toda animación que requiera stroke-draw (típicamente loader) necesita un asset adicional o una técnica alternativa (clip-path, mask, fade radial).
- El gradiente metálico de las letras OURO en `ouro-navy-bg.svg` fue **normalizado** a la fórmula oficial de 4 stops (`#A8842C → #C6A75E → #E0C780 → #B8943F`). Edición autorizada por Roque, mayo 2026, para asegurar coherencia con el resto del sistema cromático.
- Los fills hardcoded fueron reemplazados por `currentColor` donde corresponde, para permitir que un mismo SVG cambie de color según el contexto desde CSS.
- El `<rect>` de fondo embebido en `ouro-navy-bg.svg` fue removido para que el logo sea transparente y se pueda montar sobre cualquier fondo navy del sistema sin "step" cromático.

### Versiones a solicitar al diseñador (orden de prioridad)

1. **Isotipo solo (sin texto OURO), SVG transparente con `fill="currentColor"`** — crítico. Para favicon, loader, mobile compacto, decoraciones. Reemplaza al placeholder actual.
2. **Versión trazada del isotipo (path abierto con `stroke`, sin `fill`)** — opcional, solo si se quiere recuperar la animación stroke-draw del loader.
3. **Monocromática dorada** plana (`#C6A75E`) o con gradiente oficial — para sellos puntuales.
4. **Monocromática blanco roto** (`#F2F2F2`) — para sobre dorado o cualquier oscuro.
5. **Monocromática navy oficial** (`#0B1C2D`, no `#081837`) — para fondos claros e impresión.
6. **PNG con transparencia** (1x, 2x, 3x) — para social, WhatsApp, presentaciones.

### Reglas de uso

- Mantener proporciones originales — nunca estirar.
- Respetar área de aire alrededor del símbolo: al menos el ancho del isotipo en todos los lados.
- Fondo preferente: navy profundo (#0B1C2D).
- El logo es un artefacto cerrado. Su tipografía propia NO se replica en el resto del sistema.

### Errores comunes a evitar

- Dorados muy amarillos (saturados, brillantes).
- Fondos claros que debiliten el contraste del isotipo blanco.
- Efectos de brillo exagerados, glows artificiales.
- Distorsiones, sombras pesadas, contornos secundarios.

---

## 2. Paleta cromática

### Sistema base (alineado con el manual de marca oficial)

| Token | HEX | Pantone | Uso |
|-------|-----|---------|-----|
| `--navy` | `#0B1C2D` | 2965 C | Fondo principal. Color institucional. |
| `--navy-deep` | `#061320` | — | Fondo más profundo. Footer, loader, modals. |
| `--navy-soft` | `#142940` | — | Fondo elevado. Hovers de cards. |
| `--navy-card` | `#0F2236` | — | Fondo de cards y contenedores. |
| `--gold` | `#C6A75E` | Metálico 872 C | Dorado principal. Logotipo OURO, botones destacados. |
| `--gold-soft` | `#D4B76A` | Metálico 871 C | Líneas de contorno, detalles, subrayados finos. |
| `--gold-bright` | `#E0C780` | — | Dorado luminoso. Highlights en gradientes. |
| `--gold-deep` | `#A8842C` | — | Dorado oscuro. Extremos de gradientes. |
| `--gold-close` | `#B8943F` | — | Dorado de cierre. Cuarto stop del gradiente metálico. |
| `--white` | `#F2F2F2` | Cool Gray 1 C | Texto principal y símbolo. Nunca `#FFFFFF` puro. |

### Sistema de opacidades

| Token | Valor | Uso |
|-------|-------|-----|
| `--white-dim` | `rgba(242, 242, 242, 0.7)` | Texto secundario, leads, descripciones |
| `--white-faint` | `rgba(242, 242, 242, 0.4)` | Placeholders, metadatos sutiles |
| `--white-ghost` | `rgba(242, 242, 242, 0.1)` | Líneas casi imperceptibles |
| `--gold-dim` | `rgba(198, 167, 94, 0.4)` | Bordes de cards, líneas decorativas |
| `--gold-faint` | `rgba(198, 167, 94, 0.15)` | Bordes muy sutiles, divisores |
| `--gold-ghost` | `rgba(198, 167, 94, 0.06)` | Fondos hover en menús, washes mínimos |

### Gradiente metálico oficial

**Importante: esta es la fórmula corregida del manual de marca.** Reemplaza versiones anteriores.

```css
background: linear-gradient(
  135deg,
  #A8842C 0%,
  #C6A75E 40%,
  #E0C780 60%,
  #B8943F 100%
);
```

Notar que el cierre (`#B8943F`) es ligeramente distinto del inicio (`#A8842C`). Eso le da asimetría sutil al gradiente, evita el "loop perfecto" y aporta realismo metálico.

### Reglas de uso cromático

- **Nunca** mezclar tonos cálidos fuera del eje dorado.
- **Nunca** usar rojos, verdes saturados o azules de otra familia para decoración.
- **Sí** usar negro absoluto solo para texto sobre dorado (botones primarios).
- **Sí** usar blancos rotos (#F2F2F2), no puros, para evitar la dureza.
- **Los gradientes dorados siempre con la fórmula corregida.**

### Colores semánticos (estados, a definir cuando lleguemos)

Para errores, success, warnings necesitaremos colores adicionales que armonicen con la paleta:
- **Error:** terracota oscuro tipo `#A04A3A` (rojo apagado, no brillante)
- **Success:** el mismo dorado (no verde clínico)
- **Warning:** ámbar oscuro tipo `#B8843F`

Se afinan cuando se diseñen los formularios con validación.

---

## 3. Tipografía

### Familias

- **Serif (cuerpo de marca):** `'Cormorant Garamond', 'Times New Roman', serif`
  - Para títulos, leads, citas, nombres, descripciones largas.
  - Pesos disponibles: 300, 400, 500, 600 (regular e itálica en todos).
  - Carácter: literario, contemplativo, editorial.

- **Sans (funcional):** `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
  - Para metadatos, navegación, etiquetas, botones, datos técnicos.
  - Pesos disponibles: 300, 400, 500, 600.
  - Carácter: neutro, funcional, legible.

- **Tipografía del logo:** romana clásica con remates marcados (presumiblemente Trajan, Cinzel o similar). **NO se replica en el resto del sistema.** El logo es un artefacto cerrado.

### Regla maestra de la dualidad

- **La serif lleva la emoción.** Todo texto narrativo, evocativo, de marca, va en serif.
- **La sans lleva la información.** Todo texto operativo (navegación, etiquetas, datos, números) va en sans.

### Escala tipográfica

**Display (heroes, títulos grandes):**
```css
font-family: var(--serif);
font-weight: 300;
font-size: clamp(56px, 8.5vw, 128px);
line-height: 0.95;
letter-spacing: -0.02em;
```

**Section titles:**
```css
font-family: var(--serif);
font-weight: 300;
font-size: clamp(40px, 5vw, 72px);
line-height: 1.1;
letter-spacing: -0.01em;
```

**Subsection / card titles:**
```css
font-family: var(--serif);
font-weight: 400;
font-size: 26px–32px;
```

**Lead text (párrafos destacados):**
```css
font-family: var(--serif);
font-weight: 300;
font-size: 18px–22px;
line-height: 1.5;
color: var(--white-dim);
```

**Body text (párrafos generales):**
```css
font-family: var(--serif);
font-weight: 300;
font-size: 16px;
line-height: 1.6;
```

**Eyebrows / etiquetas / navegación:**
```css
font-family: var(--sans);
font-weight: 400-500;
font-size: 10px–11px;
letter-spacing: 0.3em–0.4em;
text-transform: uppercase;
color: var(--gold) o var(--white-dim);
```

**Datos / precios / números:**
```css
font-family: var(--serif);
font-size: 22px;
font-weight: 400;
```
con sufijos en sans pequeños:
```css
font-family: var(--sans);
font-size: 10px;
letter-spacing: 0.2em;
text-transform: uppercase;
```

### Itálicas como recurso de énfasis

Las palabras-clave dentro de títulos van en **itálica con gradiente dorado**. Es uno de los gestos más identificables de OURO:
```css
font-style: italic;
font-weight: 400;
background: linear-gradient(135deg, #A8842C 0%, #C6A75E 40%, #E0C780 60%, #B8943F 100%);
-webkit-background-clip: text;
background-clip: text;
-webkit-text-fill-color: transparent;
```

**Reglas:**
- Máximo una palabra o frase corta por título.
- Las palabras candidatas a itálica son las del vocabulario propio: *integrar*, *volver*, *alquimizar*, *ciclo*, *retorno*, *coherencia*, *tránsito*, *espiral*.

---

## 4. Espaciado y layout

### Contenedor y márgenes

```css
--container: 1200px;
--gutter: clamp(24px, 8vw, 140px);
```

Todas las secciones tienen `max-width: var(--container)` y `padding: 0 var(--gutter)`. El gutter es responsivo: 24px en mobile, hasta 140px en desktop wide.

### Ritmo vertical de secciones

- Padding vertical entre secciones: **100px–140px en desktop**, 60px–80px en mobile.
- Margen entre el header de sección y el contenido: **80px–100px**.
- Margen entre cards o ítems de grilla: **24px–32px**.

### Grillas

- 3 columnas para terapeutas, founders.
- 4 columnas para garantías.
- 5 columnas para steps (proceso).
- En tablet: colapsar a 2 columnas.
- En mobile: 1 columna.

---

## 5. Componentes base

### Botones

**Primario (acción principal):**
- Fondo: gradiente dorado 4-puntos (fórmula oficial corregida)
- Texto: `var(--navy)`, sans, 11px, uppercase, letter-spacing 0.3em, weight 600
- Padding: 18px 36px
- Hover: `translateY(-2px)` + `box-shadow: 0 12px 40px rgba(198, 167, 94, 0.25)`
- Sin bordes redondeados o muy mínimos (2-3px máximo). El look es geométrico, no pill.

**Ghost (acción secundaria):**
- Fondo transparente
- Texto: `var(--white)`, sans, 11px, uppercase, letter-spacing 0.3em
- Sin border, con underline animado en hover
- Flecha `→` que se desplaza 8px a la derecha en hover

**Outline / nav-cta:**
- Border 1px `var(--gold-dim)`
- Texto: `var(--gold)`, sans, 11px, uppercase
- Hover: fondo dorado sólido, texto navy

### Cards

**Founders (verticales grandes):**
- Fondo: gradiente navy-soft → navy
- Border: 1px `var(--gold-faint)` → `var(--gold-dim)` en hover
- Padding: 36px 32px 40px
- Header visual con inicial gigante en serif itálica + gradiente dorado
- Hover: `translateY(-12px)` + box-shadow profundo
- Sin border-radius o muy mínimo

**Terapeutas (compactas):**
- Fondo: `var(--navy-card)`
- Padding: 40px 32px
- Avatar circular 80px con gradiente dorado
- Línea superior animada en hover (`scaleX(0)` → `scaleX(1)`)
- Hover: `translateY(-8px)`

### Inputs y formularios

**Estilo predominante: underline-only.** Sin bordes cerrados.
```css
background: transparent;
border: none;
border-bottom: 1px solid var(--gold-faint);
color: var(--white);
font-family: var(--serif);
font-size: 18px;
padding: 12px 0;
```
- Focus: `border-bottom-color: var(--gold)`
- Label arriba: sans, 10px, uppercase, letter-spacing 0.3em, color `var(--gold)`
- Placeholder: `var(--white-faint)`, itálica

**Excepción: el buscador de terapeutas** usa caja completa con borde y fondo `rgba(20, 41, 64, 0.4)`. Es un caso especial porque es el componente principal de búsqueda.

### Navegación

- Fija arriba, transparente al inicio
- Al scrollear: fondo `rgba(11, 28, 45, 0.88)` con `backdrop-filter: blur(20px)` y borde inferior dorado faint
- Logo + texto institucional a la izquierda
- Links centrados/derecha
- CTA outline a la derecha
- Logo rota 15° en hover (sutil)
- Links con underline animado dorado en hover

### Dropdowns

- Fondo: `rgba(11, 28, 45, 0.96)` con `backdrop-filter: blur(20px)`
- Border 1px `var(--gold-faint)`
- Padding vertical 16px
- Items: 12px 24px, sans, 12px, uppercase, letter-spacing 0.15em
- Hover de item: fondo `var(--gold-ghost)`, color `var(--white)`

---

## 6. Detalles ornamentales (el ADN visual)

Estos son los "tics" que hacen que el sitio se vea como OURO y no como otra cosa. Hay que respetarlos rigurosamente.

### Líneas decorativas

- Líneas horizontales con gradiente: `linear-gradient(to right, transparent, var(--gold-dim), transparent)`. Para separadores entre secciones.
- Líneas verticales sutiles en bordes de cards: `var(--gold-faint)`.
- Underlines animados que crecen del centro o de izquierda a derecha.

### Puntos dorados

- 4-8px de diámetro, color `var(--gold)`, ocasionales con `box-shadow: 0 0 12px var(--gold)` para glow.
- Usados como acentos en eyebrows, decoraciones de cards, marcadores de progreso.

### Eyebrows con líneas laterales

Los `section-eyebrow` siempre tienen líneas a los costados:
```
─── EYEBROW TEXT ───
```
32px de ancho cada línea, 1px alto, `var(--gold)` con opacity 0.5.

### Símbolos geométricos

- Círculos concéntricos con animación de rotación lenta (90s, 120s, 180s, 240s).
- Bordes circulares con puntos en posiciones cardinales.
- Usar el ouroboros del logo (versión isotipo) donde corresponda: loader, decoraciones puntuales, fondo del CTA grande.

### Reservorio simbólico (uso discreto)

Las culturas mencionadas en la narrativa de OURO (Egipto, Grecia, Norse, India, México, Celtas, Andes, Hopi) son **fuente de inspiración para motivos visuales puntuales**, no para reproducir iconografía literal. Ejemplos de uso aceptable:

- Nudos celtas como inspiración para decoraciones de section separators.
- Estructura concéntrica de los círculos hopi/andinos como inspiración para el astral animado del hero.
- Geometría sagrada (proporción áurea, espirales) en composiciones puntuales.

**Lo que NO va:** símbolos étnicos literales descontextualizados, mezcla de imaginarios (un sol azteca al lado de un nudo celta).

### Fondo con ruido fractal

Toda la página tiene una capa de ruido SVG con `mix-blend-mode: overlay` y opacity 0.07. Le da una textura "papel" que evita la frialdad del navy plano. **Mantener en mobile pero verificar performance.**

### Radial gradients ambientales

El body tiene un gradiente radial sutil en 50% 30% (ligeramente más claro arriba) y otro mínimo dorado en 80% 80%. Da profundidad sin pesar.

---

## 7. Animaciones y micro-interacciones

### Curva de easing maestra

```css
cubic-bezier(0.16, 1, 0.3, 1)
```
Es la curva "ease-out-expo" suave. **Usar siempre que sea posible.** Da la sensación característica de "asentarse en su lugar".

### Duraciones de referencia

- **Hovers rápidos (color, opacity):** 0.3s–0.4s
- **Transformaciones (translate, scale):** 0.6s–0.8s
- **Entradas de elementos (fade-up):** 0.9s–1.2s
- **Loader:** 1.6s total (drawStroke 1.2s + fillIn 0.4s a los 1.0s + word 0.4s a los 1.2s)

### Entradas con scroll (Intersection Observer)

Todos los elementos importantes (cards, títulos, párrafos largos) entran con:
```css
opacity: 0;
transform: translateY(20–50px);
transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
```
Al agregarse `.visible` (via Intersection Observer), `opacity: 1; transform: translateY(0)`.

### Hovers de cards

- Elevación: `translateY(-8px)` a `-12px` según importancia
- Border refuerza de `gold-faint` a `gold-dim`
- Box-shadow profundo: `0 30px 80px rgba(0, 0, 0, 0.4)`

### Reducción de movimiento

**Importante:** OURO es una plataforma de terapia. Hay usuarios con ansiedad, vértigo o sensibilidades. Implementar:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
Y para los anillos rotatorios del hero, pausarlos completamente.

---

## 8. Decisiones específicas tomadas

### Cursor custom — REFINAR

- Mantenerlo solo en desktop con mouse.
- Hacerlo más sutil: anillo de 20px (en vez de 24px), border 1px `var(--gold-dim)`.
- Sin `mix-blend-mode: difference`.
- Mantener el dot central de 4px sólido dorado.
- Expansión en hover de elementos clickeables: de 20px a 48px, con fondo `rgba(198, 167, 94, 0.08)`.
- No aplicar en formularios. Usar `cursor: text` en inputs y textareas.

### Loader — REFINAR

- 1.6s totales aproximados.
- Mostrar solo en la primera visita usando `sessionStorage`.
- Para usuarios con `prefers-reduced-motion`: skip total, render directo.
- **Usar el isotipo real del logo (ouroboros con dragón).** Animación a definir cuando se implemente: como los paths del SVG actual son rellenos (no trazados), descartamos la animación stroke-draw original. Alternativas a evaluar en Fase 8: clip-path circular que revela el isotipo en barrido angular (simulando el "trazo" del ouroboros cerrándose), mask radial, o fade-in con escala sutil. La opción de pedir un asset adicional con stroke abierto queda como recurso si ninguna alternativa convence.

### Side-rail (línea lateral) — REFINAR

- Mostrar solo en viewports ≥ 1440px.
- Mantener el progress dot animado pero **reducir pulse** de 2.5s a 4s.
- El label "OURO" vertical en el lateral inferior: mantenerlo.
- En mobile y tablet: no existe.

### Astral animado del hero — REFINAR

- Mantener los 4 anillos con rotaciones alternadas CW/CCW.
- **Reducir las rotaciones por la mitad de velocidad:** 480s, 360s, 240s, 180s.
- Con `prefers-reduced-motion`: pausar las rotaciones, dejar el grafismo estático.
- En mobile: reducir el tamaño a 50vmin y bajar opacidad a 0.5.

### Ruido fractal de fondo — MANTENER

- Mantener tal cual, pero **verificar performance en mobile**. Si afecta scroll, reducir opacidad o quitarlo en mobile.

---

## 9. Mobile-first considerations

### Breakpoints sugeridos

```css
--bp-sm: 640px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1440px;
```

### Reglas mobile

- **Tipografía:** las display reducen mediante `clamp()` que ya está aplicado.
- **Espaciado:** padding vertical de secciones se reduce a 60–80px.
- **Grids:** colapsan a 1 columna en mobile.
- **Nav:** menú hamburguesa con drawer lateral (fondo `navy-deep` con border dorado faint, items en serif).
- **Hover effects:** convertir a tap states. Las cards no se elevan en hover sino que cambian sutilmente al tap.
- **Cursor custom:** desactivado totalmente.
- **Side-rail:** oculta.
- **Astral del hero:** posicionado detrás del texto, opacidad reducida.

---

## 10. Iconografía

- **Librería:** Lucide React (sumar `lucide-react` como dependencia).
- **Estilo:** line icons, 1.5px de stroke, sin fill.
- **Color por defecto:** `var(--gold)`.
- **Tamaños:** 18px (inline), 24px (botones), 32px (cards), 56px (heroes/secciones).
- **Excepción:** el ouroboros / isotipo es SVG custom propio. Es el sello.

---

## 11. Stack técnico

Confirmado tras exploración del repo:

- **React 18.2** + Create React App (`react-scripts 5.0.1`)
- **React Router 6.20** (routing en `App.js`)
- **Tailwind 3.3.6** + PostCSS + autoprefixer
- **Axios 1.6.2** para API
- Sin librería de estado — sesión en `localStorage`
- Sin TypeScript

**Implicaciones:**
- Los tokens de diseño se centralizan en `tailwind.config.js` extendiendo el theme.
- Las tipografías se importan en `public/index.html` con `<link>` a Google Fonts.
- Los efectos globales (cursor, ruido fractal, scroll behavior) van en `src/index.css` o en un Provider de React.
- Los SVG del logo viven en `src/assets/logo/` y se importan como componentes React.

---

## 12. Lista de cosas que faltan diseñar (TODO)

- [ ] Sistema de formularios completo (login, registro, recuperación, verificación email)
- [ ] Estados: loading skeletons, empty states, error states, success states
- [ ] Sistema de validación de inputs (mensajes de error inline)
- [ ] Modales y dialogs
- [ ] Toasts / notificaciones
- [ ] Tooltips
- [ ] Tablas (para panel admin, mis turnos)
- [ ] Calendario / agenda de reservas
- [ ] Flujo de pago con MercadoPago (integración visual)
- [ ] Perfil individual de terapeuta (vista expandida)
- [ ] Panel de admin
- [ ] Vista "mis turnos" del usuario
- [ ] Menú mobile completo
- [ ] Footer mobile
- [ ] Página 404 y otros errores
- [ ] Versiones adicionales del logo (solo isotipo, dorado puro, monocromáticas)

---

## 13. Versionado

- **v1 — Mayo 2026:** Documento inicial. Basado en prototipo HTML aprobado.
- **v2 — Mayo 2026:** Integración de manual de marca oficial + narrativa filosófica del proyecto. Confirmación de paleta cromática con códigos Pantone. Corrección de gradiente metálico (cuarto stop a `#B8943F`). Agregado de filosofía, vocabulario propio, referencias culturales, tono editorial. Incorporación del logo definitivo (ouroboros con dragón) y sus reglas. Identificación del stack técnico real (CRA, no Vite).
- **v2.1 — Mayo 2026:** Análisis técnico de los SVG entregados (`ouro-navy-bg.svg`, `ouro-white-bg.svg`). Normalización del gradiente metálico de las letras OURO del logo a la fórmula oficial de 4 stops (cambio autorizado por Roque). Remoción del `<rect>` de fondo embebido en la versión navy. Reemplazo de fills hardcoded por `currentColor` para reusabilidad. Generación de placeholder `ouro-isotipo.svg` pendiente de reemplazo por entrega oficial. Decisión sobre loader: descartar animación stroke-draw (paths son rellenos), evaluar alternativas en Fase 8. Listado priorizado de versiones del logo a solicitar al diseñador.
