# Notas técnicas — Cambios CJ_CORE

Resumen de lo que se ha tocado y, sobre todo, **por qué**. Pensado para que lo
entiendas y puedas mantenerlo tú.

---

## 1. Iconos de la página de Nidu → SVG *inline* (no fuente)

**Qué se hizo:** en `nidu.html` y en el destacado de `mis-proyectos.html`, los
iconos de las funciones (agenda, caja, CRM, comisiones, copia de seguridad…) NO
usan la fuente `Material Symbols`, sino **SVG escritos directamente en el HTML**.

**Por qué (importante):** tu fuente de iconos es un *subset* — solo contiene los
~16 glifos que ya usabas (`terminal`, `account_tree`, `hub`, `mail`…). Si añades
un icono nuevo que no está en el subset, **se ve como texto** (p. ej. sale la
palabra "hub" en vez del dibujo) hasta que regeneres la fuente a mano.

Para una página con funciones nuevas eso es frágil. El SVG inline:
- vive dentro del HTML, no depende de ninguna fuente,
- no hay que regenerar nada nunca cuando añadas funciones,
- hereda el color con `currentColor` (por eso se ponen dorados solos),
- es hoy la práctica recomendada frente a las fuentes de iconos.

**Regla para el futuro:** en el "chrome" (cabecera, sidebar, terminal) puedes
seguir usando `material-symbols-outlined` porque esos iconos SÍ están en el
subset. Para CONTENIDO nuevo con iconos que no tengas, usa SVG inline.

---

## 2. Home (`index.html`) — de "muda" a guiada

- Se quitó la pantalla de carga (boot/glitch) que tapaba el contenido. Era mala
  para SEO (Google tardaba en ver el contenido) y para la velocidad. En su lugar
  hay una animación de "encendido" (`body.booted`) que mantiene el efecto pero
  con el contenido ya presente en el HTML desde el primer momento.
- El núcleo central ahora lleva tu **nombre real** en un `<h1>` (antes solo "CJ").
- Se añadieron **3 módulos clicables** (Nidu / Proyectos / Contacto) para que el
  visitante sepa qué hacer.
- **Ubicación dinámica** arriba a la izquierda: detecta la ciudad por IP
  (`startHudGeo` en `js/index.js`). Si la IP falla, usa la zona horaria; si eso
  falla, "España". En local sale "Madrid" (respaldo); en producción saldrá la
  ciudad real de cada visitante.

---

## 3. SEO técnico

- **Datos estructurados (JSON-LD)** en `index.html` (Person, ProfessionalService,
  SoftwareApplication=Nidu, WebSite), en `sobre-mi.html` (ProfilePage) y en
  `nidu.html` (SoftwareApplication con lista de funciones). Esto ayuda a que
  Google entienda quién eres y qué es Nidu.
- `sitemap.xml`: añadida la URL `/nidu`.
- Para que el sitemap surta efecto: súbelo a la raíz y regístralo en
  **Google Search Console**.

---

## 4. Sobre mí (`sobre-mi.html`)

- **Bug corregido:** las coordenadas ponían 40.41° N, 3.70° W (¡Madrid!). Ahora
  son las de **Zaragoza** (41.65° N, 0.88° W).
- Rol unificado a "Diseñador & Desarrollador Web" (antes ponía "Diseño Web &
  Análisis de Datos", incoherente con la home).

---

## 5. Estructura (sin cambios de filosofía)

Se respeta tu separación: cada página con su CSS y su JS. Archivos nuevos:
- `nidu.html`, `css/nidu.css`, `js/nidu.js`
- estilos del destacado en `css/proyectos.css`

Las fuentes siguen siendo **locales** (tu `fonts.css`), sin Google ni terceros.
