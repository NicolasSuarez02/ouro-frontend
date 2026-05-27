# OURO — Sistema de Diseño Operativo

**Documento complementario al `OURO-DESIGN-SYSTEM.md` (v2.1).**
Este archivo NO reemplaza el DS principal. Lo extiende con reglas específicas
para las vistas autenticadas / operativas del sitio.

Cualquier regla no especificada acá se hereda del DS principal.

---

## 0. Concepto: dos sub-sistemas dentro del mismo DS

OURO tiene dos modos de presentación visual:

- **Editorial** — vistas públicas, narrativas, declarativas. Su trabajo es
  comunicar la propuesta filosófica, transmitir confianza editorial y
  generar deseo de explorar.
- **Operativo** — vistas autenticadas, instrumentales. Su trabajo es
  permitir al usuario gestionar su agenda, su perfil, sus turnos, sus
  archivos. El usuario ya está adentro: la marca ya hizo su trabajo.

**No son dos paletas separadas.** Es el MISMO sistema de diseño: misma
navy, mismo dorado, mismas tipografías Cormorant + Inter, mismos
espaciados base, mismas curvas de easing. Lo que cambia es el **énfasis**
y la **frecuencia de uso** de los recursos.

Una analogía editorial: la portada de una revista (Editorial) usa
tipografía display, oro foil, ornamentos. Sus páginas interiores
(Operativo) usan los mismos tipos y colores, pero contenidos, jerárquicos,
sin ornamentos repetitivos. Los lectores no quieren leer cada artículo
como si fuera una portada.

---

## 1. Cuándo aplica cada uno

### Modo Editorial — vistas declarativas

- `Home.js` — todas las secciones.
- `Login.js`, `Register.js`, `RegisterClient.js`, `ForgotPassword.js`,
  `ResetPassword.js`, `VerificationSent.js`, `VerifyEmail.js`.
- `Terapeutas.js` (listado público).
- `TherapistDetail.js` (vista pública de un terapeuta).
- `Recursos.js` (biblioteca / formaciones — listado público).
- `TermsPage.js`, `PrivacyPage.js`.
- `PaymentSuccess.js`, `PaymentPending.js`, `PaymentFailure.js`,
  `Success.js` — son post-flujo pero declarativas (anuncian un cambio
  de estado importante en la relación con el sistema).

### Modo Operativo — vistas instrumentales

- `Dashboard.js` — panel principal del usuario logueado.
- `ClientAppointments.js` — gestión de turnos del cliente / del
  terapeuta como acompañante.
- `ManageAvailability.js` — calendario de disponibilidad del terapeuta.
- `EditTherapist.js`, `RegisterTherapist.js`, `TherapistForm.js` —
  formularios largos de configuración del perfil profesional.
- `SubirRecurso.js` — upload de archivos.
- `AdminDashboard.js` — panel admin.

### Casos de frontera

- **Banners de feedback dentro de páginas operativas** mantienen las
  variantes semánticas del sistema (gold-ghost success, terracota error,
  warning border-left gold). No se diluyen por estar en contexto
  Operativo — un error es un error.
- **Modales** dentro de vistas Operativas siguen el patrón global
  (bg-navy-deep/80 backdrop + card navy-card con border gold-faint).
  El modal sí puede ser un momento "editorial" puntual dentro de un
  flujo operativo.

---

## 2. Lo que se MANTIENE del DS v2.1 sin cambios

- **Paleta cromática completa.** Mismos tokens navy, gold y sus opacidades.
- **Tipografías.** Serif Cormorant Garamond para emoción/contenido editorial,
  sans Inter para metadatos/labels/UI funcional. La regla de la dualidad
  sigue aplicando.
- **Vocabulario propio del proyecto** (integrar, volver, alquimizar, ciclo,
  retorno, coherencia, tránsito, espiral, memorias). Sigue siendo OURO.
- **Tono editorial general:** voseo argentino, contemplativo, sin
  exclamaciones, sin emojis. Aunque sea operativo, no se vuelve frío
  o burocrático.
- **Breakpoints, contenedor, espaciado base.** Idénticos.
- **Easing maestro** (`ease-expo-out`). Idéntico.
- **Inputs underline-only** con borde inferior gold-faint / focus gold.
  Sigue siendo el patrón estándar.
- **Variantes semánticas de banner** (success dorado / error terracota /
  warning border-left). Idénticas.
- **Border-radius mínimo o ausente.** El look geométrico es transversal.
- **Reduced motion.** Respeto a `prefers-reduced-motion` siempre.

---

## 3. Lo que se AJUSTA en modo Operativo

### 3.1 Frecuencia del dorado

- El dorado pleno (`var(--gold)`) deja de ser el color por default
  para títulos y eyebrows decorativos. Se reserva para:
  - **Estados clave** (estado del perfil aprobado, próximo turno destacado,
    confirmación de acción).
  - **Acentos puntuales** en ítems que requieren atención del usuario.
  - **Labels de campos** en formularios (sigue siendo gold uppercase 10px).
- Para títulos de sección y eyebrows operativos, preferir `gold-dim` o
  `white-faint` como color base.

### 3.2 Itálicas con gradiente dorado

- Sigue siendo un gesto OURO válido pero **mucho menos frecuente** en
  Operativo.
- Aceptable: saludo personal único en la sesión (ej: "Hola, *firstName*"
  en el Dashboard).
- NO aceptable: itálica gradient en cada título de card / sección de una
  página operativa. Diluye el gesto.

### 3.3 Display titles

- En Editorial: `clamp(40px, 5vw, 72px)` o más para títulos de sección.
- En Operativo: `clamp(28px, 3vw, 40px)` máximo para el título principal
  de página. Las cards interiores tienen títulos chicos (lg/xl, no 2xl).

### 3.4 Botones

| Contexto | Editorial | Operativo |
|---|---|---|
| Acción primaria (CTA principal) | `bg-gold-gradient` + texto navy + sans uppercase | Outline gold (border gold-dim + texto gold + hover fill gold) — el gradiente lleno se reserva para momentos críticos (un solo botón por pantalla, máximo) |
| Acción secundaria | Outline gold | Outline gold o ghost gold (texto gold sin border, hover gold-bright) |
| Acción destructiva / cancelar | Outline ghost con texto white-dim | Ghost terracota o button con border-terracota faint |
| Integraciones externas (MP, Zoom) | Outline gold con icono | Color de la marca externa (ver sección 6) |

**Regla práctica:** en una página operativa típica debería haber
**como máximo 1 botón gradient pleno** (la acción más crítica). El
resto, outline.

### 3.5 Cards

- **Editorial:** cards con línea superior animada en hover (`scaleX 0→1,
  800ms`), translateY -8px, `shadow-card-hover`. Son interactivas y
  expresivas.
- **Operativo:** cards más estáticas. `bg-navy-card + border gold-faint`
  se mantiene, pero **sin línea superior animada** ni elevación en hover.
  Son contenedores informativos, no piezas a hover-explorar.
- **Excepción:** cards que sí son interactivas (ej: tarjeta de turno
  clickeable que lleva a su detalle) pueden conservar el patrón Editorial.

### 3.6 Ornamentos decorativos

- **Editorial:** eyebrows con líneas laterales (`─── EYEBROW ───`),
  divisores línea-gradiente entre secciones, anillos decorativos
  rotando en hero/CTAs, puntos dorados con glow.
- **Operativo:** mínimos.
  - Eyebrows sin líneas laterales — solo texto sans uppercase tracking
    + color (gold para destacados, gold-dim para neutros).
  - Divisores: simple `border-t border-gold-faint` o nada.
  - Sin anillos decorativos rotando.
  - Puntos dorados con glow: solo en estados positivos (perfil aprobado,
    success de acción).

### 3.7 Padding superior de página

- **Editorial:** `pt-32 lg:pt-40` (genera respiro entre navbar y
  contenido — invita a leer).
- **Operativo:** `pt-24 lg:pt-32` (más operativo, el usuario quiere
  llegar al contenido más rápido).

### 3.8 Microcopy

- **Editorial:** más narrativo. Una frase puede ocupar 2 líneas con
  vocabulario propio.
- **Operativo:** directo, sigue siendo contemplativo, pero más conciso.
  Ej: "Tu cuenta está lista." en lugar de "Tu cuenta está lista para
  ser usada con todo lo que necesitás."

### 3.9 Animaciones

- **Editorial:** animaciones expresivas. Entrada por scroll con
  Intersection Observer, líneas que se dibujan, rotaciones lentas.
- **Operativo:** animaciones funcionales únicamente. Spinners de carga,
  transiciones de estado (form submit, banner de error apareciendo).
  Sin animaciones decorativas.

---

## 4. Ejemplos de aplicación

### 4.1 Botón primario

**Editorial:**
```jsx
<Link className="inline-flex items-center gap-3 bg-gold-gradient px-9 py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow">
  <span>Ver todos los terapeutas</span>
  <span>→</span>
</Link>
```

**Operativo:**
```jsx
<button className="inline-flex items-center gap-3 px-7 py-3 border border-gold-dim hover:bg-gold hover:border-gold hover:text-navy font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-400 ease-expo-out">
  <span>Guardar cambios</span>
  <span>→</span>
</button>
```

### 4.2 Eyebrow de sección

**Editorial:**
```jsx
<div className="flex items-center justify-center gap-4 mb-6">
  <span className="h-px w-8 bg-gold/50" />
  <span className="font-sans text-[11px] font-medium uppercase tracking-eyebrow-wide text-gold">
    Quienes acompañan
  </span>
  <span className="h-px w-8 bg-gold/50" />
</div>
```

**Operativo:**
```jsx
<p className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim mb-6">
  Tus datos
</p>
```

### 4.3 Card

**Editorial (card de terapeuta en listado):**
```jsx
<Link className="group relative bg-navy-card border border-gold-faint px-8 py-10 transition-all duration-600 ease-expo-out hover:-translate-y-2 hover:border-gold-dim hover:shadow-card-hover overflow-hidden text-center">
  <span className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-800 ease-expo-out" />
  {/* ... contenido ... */}
</Link>
```

**Operativo (card de datos en Dashboard):**
```jsx
<section className="bg-navy-card border border-gold-faint p-8">
  {/* ... contenido ... */}
</section>
```

### 4.4 Banner

Las variantes semánticas son IDÉNTICAS en ambos modos. Un error es
terracota, un success es dorado. No se diluye el feedback semántico
por estar en una vista operativa.

### 4.5 Formulario

**Idéntico en ambos modos**: inputs underline-only, label sans uppercase
gold, placeholder serif italic white-faint, focus border gold. La
diferencia está en el submit (operativo: outline gold por default,
gradient solo si es la acción crítica única de la página).

---

## 5. Política sobre integraciones externas

Los flujos que invocan servicios externos (Mercado Pago, Zoom, eventualmente
Google Meet, Calendly, etc.) **respetan la identidad de marca del servicio
externo** en los puntos de acción específicos. Esta es una decisión de
confianza: el usuario reconoce visualmente que va a interactuar con una
herramienta conocida.

### 5.1 Mercado Pago

- **Color de marca:** `#009ee3` (azul corporativo MP).
- **Color hover:** `#0080c0` (azul oscurecido).
- **Aplicación:** botón "Conectar Mercado Pago" / "Reconectar Mercado Pago"
  en Dashboard y cualquier flujo de configuración de pagos.
- **Banner de status** post-callback OAuth: SÍ sigue las variantes
  semánticas OURO (success gold / error terracota). El color de marca
  aplica al botón de acción, no al feedback.
- **Logo de MP** si se muestra: usar el oficial de MP, sin estilizar.

### 5.2 Zoom

- **Color de marca:** `#2D8CFF` (azul Zoom).
- **Aplicación:** botón "Unirse a la sesión" / "Unirse a Zoom" cuando se
  invoca el cliente de Zoom directamente.
- **Alternativa:** si el contexto lo permite, mantener outline gold con
  el icono de Zoom — el icono ya identifica el servicio.

### 5.3 Otros servicios (futuro)

- Google Meet, Calendly, etc.: aplicar la misma lógica. Si el botón es
  una acción que invoca el flujo del servicio externo, usar su color
  de marca. Si es una mención secundaria, mantener el sistema OURO.

### 5.4 Lo que NO va

- NO inventar variantes "OURO + azul MP" mezcladas (ej: gradient
  navy → MP blue). Cada marca se respeta sola.
- NO usar el azul de MP / Zoom para botones que NO van a esos servicios.
  Son colores reservados.

---

## 6. TODO Fase 9 — Refinamiento operativo

Lista priorizada de archivos a refinar cuando se ejecute Fase 9.

### Alta prioridad (alto impacto)

- **`Dashboard.js`** (5.A actual)
  - Botón "Conectar MP" (no conectado): volver a azul MP `#009ee3`.
  - Botón "Reconectar MP" (conectado): a azul MP en versión ghost/link.
  - Itálica gradient en "Hola, *firstName*": mantener como caso especial
    permitido (es saludo personal, no repetición).
  - Itálica en "Tu *ciclo* en curso" (lead): evaluar — quizás removerla
    en operativo, dejar el lead sin itálica.
  - Display title del header: reducir de `clamp(36px, 4vw, 56px)` a
    `clamp(28px, 3vw, 40px)`.
  - Eyebrow "MI ESPACIO": cambiar de gold pleno a gold-dim.

- **`ClientAppointments.js`** (5.B actual)
  - Botón "Unirse a la sesión" en `AppointmentCard`: cambiar de outline
    gold con `VideoIcon` a outline azul Zoom (`#2D8CFF`) con icon de Zoom
    o mantener gold + icono — decidir caso.
  - "El ritmo de tu *tránsito*" (lead cliente): mantener — es el momento
    editorial permitido al inicio de la página.
  - Display title del header: ya está usando `clamp(36px, 4vw, 56px)`,
    revisar si reducir.
  - Cards de turno (`AppointmentCard`): evaluar si necesitan línea
    superior animada en hover. Probablemente no — son informativas.

### Media prioridad (consistencia)

- **`PaymentSuccess.js`** (actualmente Editorial)
  - El botón "Unirse a la sesión" del Zoom block: evaluar cambio a azul
    Zoom. Como esta página ya es post-flujo declarativa, podría quedar
    como caso de excepción Editorial.

- **Cualquier vista pendiente de Fase 5** (5.C ManageAvailability,
  5.D EditTherapist + RegisterTherapist + TherapistForm, 5.E SubirRecurso)
  - **Implementar directamente en Operativo desde el primer Write.**
    NO migrar después. Las directivas de este documento aplican desde
    el Write inicial.

- **`AdminDashboard.js`** (Fase 6)
  - Mismo criterio: implementar Operativo de entrada.

### Baja prioridad / decisión por caso

- Revisar todos los botones gradient gold pleno en vistas operativas
  ya migradas. Para cada uno, decidir si es la acción crítica única
  de la pantalla (mantener) o si conviene degradar a outline (mayoría).
- Revisar todas las itálicas gradient en operativo. Conservar solo
  el saludo personal y similares.

---

## 7. Cómo trabajar Fase 9 cuando llegue

1. **No tocar Editorial.** Estas reglas NO se aplican a Home, Auth,
   listados públicos, legales, pagos. Esas siguen el DS v2.1 puro.
2. **Pasada por vista operativa.** Una por bloque atómico, mismo
   protocolo que el resto del rediseño.
3. **Verificar coherencia transversal.** Una vez refinada cada vista
   operativa, hacer una revisión global para detectar inconsistencias
   (ej: dos botones de MP con tratamientos distintos).
4. **Documentar excepciones.** Si una decisión específica se desvía
   de las reglas de este documento, dejarlo registrado acá con
   justificación.

---

## 8. Versionado

- **v1 — Mayo 2026:** Documento inicial. Decisión arquitectónica
  registrada por Roque tras la verificación visual de Dashboard
  durante Bloque 5.A. Define modos Editorial vs Operativo dentro del
  mismo sistema, lista archivos por modo, establece la política sobre
  integraciones externas (MP, Zoom), prioriza el TODO de Fase 9.
