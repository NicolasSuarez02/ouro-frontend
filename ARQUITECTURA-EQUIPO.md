# Arquitectura de secciones de equipo

## Decisión final

Se reemplaza la arquitectura actual (sección "Equipo fundador" con cards + sección "Nuestros terapeutas" con cards + CTA, ambas con CTAs cruzados a /terapeutas) por una arquitectura editorial en dos niveles claramente distintos:

### Nivel 1 — Sección "Origen" / Fundadoras

**Propósito:** presentación editorial de las tres fundadoras (Lucila, Eliza, Celina). NO es catálogo comercial. Es honrar simbólicamente su rol fundacional sin convertirlas en "producto destacado".

**Composición:**
- Eyebrow: "ORIGEN" (en sans uppercase, letter-spacing 0.3em, dorado)
- Título: serif Cormorant Garamond 300, itálica en palabra clave. Texto provisorio: "Las que sostienen el ciclo" (a confirmar copy con el equipo).
- Layout: composición horizontal de las 3 fundadoras en desktop (no grid de 3 cards idénticas). Cada una con:
  - Foto cuadrada con tratamiento duotone navy/gold (filtro CSS, no edición de imagen)
  - Nombre en serif 32px
  - Cita personal corta (2-4 líneas, copy a definir por cada fundadora)
  - Línea ornamental dorada fina separadora
- En mobile: stack vertical, mismo tratamiento
- Sin CTA por persona. UN link sutil al final de la sección entera: "Conocer su práctica →" que lleva a /terapeutas?orden=fundadoras (parámetro de URL para que el listado las muestre primero — coordinar con backend si hace falta, sino solo /terapeutas)

**Tratamiento de fotos fundadoras (duotone CSS):**

```css
.foto-fundadora {
  filter: grayscale(100%) contrast(1.1);
  background: linear-gradient(135deg, #0B1C2D, #C6A75E);
  background-blend-mode: multiply;
  /* Resultado: sombras tiran a navy, luces a dorado */
}
```

(Sintaxis exacta a definir en implementación, puede requerir SVG filters para duotone real)

### Nivel 2 — Sección "El equipo" / Carrusel vertical

**Propósito:** mostrar al equipo profesional completo (incluidas las fundadoras, sin distinción en este contexto) en formato dinámico que invite a explorar.

**Referencia visual:** carrusel vertical de tuterapia.com.ar — columna izquierda fija con título + descripción, columna derecha con stack de 3 cards (centro destacada, arriba y abajo en estado fantasma).

**Composición:**
- Eyebrow: "EL EQUIPO"
- Título: "Nuestras terapeutas" (con "terapeutas" en itálica dorada)
- Columna izquierda fija:
  - Título grande
  - Descripción de 3-5 líneas sobre el equipo
  - Indicador de posición (puntos verticales o número actual/total)
- Columna derecha (carrusel):
  - 3 cards visibles en stack vertical
  - Card central: foco visual, escala 100%, opacidad 100%
  - Cards arriba/abajo: escala 0.85, opacidad 0.4, blur sutil
  - Flechas ↑↓ a la derecha del stack
  - Auto-scroll cada 6 segundos
  - Pausa en hover
  - Pausa total con prefers-reduced-motion
- Cada card de terapeuta:
  - Foto circular o cuadrada con tratamiento B&N + tinte cálido dorado
  - Nombre en serif
  - Especialidad/corriente en sans pequeño uppercase
  - Detalle dorado (línea, punto)
  - Hover: foto vuelve a color natural por 0.6s
- CTA al final de la sección: "Conocer a todo el equipo →" que lleva a /terapeutas

**Tratamiento de fotos del equipo (B&N + tinte):**

```css
.foto-terapeuta {
  filter: grayscale(85%) contrast(1.05) brightness(0.95) sepia(0.15);
  transition: filter 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.foto-terapeuta:hover {
  filter: grayscale(0%) contrast(1) brightness(1) sepia(0);
}
```

(Sintaxis exacta a definir en implementación)

### Nivel 3 — Página /terapeutas (listado completo)

**Propósito:** vista operativa para que el usuario filtre y elija terapeuta.

**Composición:**
- Sin distinción visual entre fundadoras y resto del equipo. Acá todas son terapeutas.
- Si se llega con el parámetro ?orden=fundadoras, las fundadoras aparecen primero (sin badge ni distintivo visual, solo posicional).
- Mismo tratamiento de fotos que en el carrusel (B&N + tinte, hover color).
- Buscador, filtros por especialidad, modalidad, etc.

## Placeholders mientras no haya fotos reales

**Fundadoras:** Siluetas estilizadas o iconos contemplativos sobre fondo navy con tinte dorado. Aplicar el mismo filtro duotone para coherencia. Marcar con eyebrow "Foto pendiente" en chico.

**Terapeutas (en el carrusel):** Las fotos que ya están en el backend (algunas terapeutas ya tienen foto subida). Para las que no tengan, usar avatar circular con inicial serif itálica + gradiente dorado.

## Backend / datos

- Coordinar con Nico:
  - Si las fundadoras tienen flag "fundadora" en el modelo Terapeuta para distinguirlas en queries.
  - Si /terapeutas?orden=fundadoras es soportado por el backend o si hay que ordenar en frontend.
  - Marcar como inactivos los terapeutas de prueba ("MP TEST OURO", "Prueba En Vivo") en el listado público.

## Orden de implementación

1. Primero terminar el rediseño visual de Fase 0+1 (tokens, navbar, footer) sobre la arquitectura ACTUAL (sin tocar Home.js todavía a nivel estructural).
2. Después, en una fase dedicada, refactorizar Home.js según esta arquitectura.
