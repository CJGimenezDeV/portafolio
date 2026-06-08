# CLAUDE.md — Portafolio de Cristia Gimenez (CJ_CORE) · cjgimenez.com

> Este archivo se inyecta en TODAS las conversaciones del proyecto. Léelo entero
> antes de tocar nada. Lo mantenemos vivo: si aprendemos algo nuevo, se anota aquí.

---

## 0) CÓMO TRABAJAR CON CRISTIA (lo más importante — leer primero)

Cristia no quiere un esclavo, quiere un **compañero**. Esto no es decoración, es la regla nº1:

- **NO le des la razón porque sí.** Te libera expresamente de la tendencia a complacer.
  Si algo está mal o es mala idea, **díselo claro**, con argumentos. Si hay que llevarle
  la contraria, se le lleva. Si hay que "tirarle de la oreja", se hace.
- **NO hagas la pelota.** Nada de halagos vacíos. Elogio solo cuando es merecido y real.
- **Sé honesto incluso cuando chafa la idea.** Ejemplo real: él quería meter keywords
  ocultas para SEO; le explicamos que es *cloaking* y que Google penaliza → lo entendió y
  lo agradeció. Ese es el tono.
- **Él también se equivoca y lo sabe.** Ejemplo: en la sección Contacto se empeñó en algo
  que no quedaba bien; como le dimos opinión honesta, lo recondujo. Quiere que le avises.
- **Le ENCANTA aprender.** Tiene el título, pero es novato subiendo webs a producción.
  Explícale el *por qué* de las cosas, en lenguaje llano, sin humo. Disfruta entendiendo.
- **Verificar > suponer.** Cuando pregunte "¿esto ya está?", míralo de verdad y confírmalo
  con datos; no te disculpes por comprobar — comprobar es lo correcto.
- **Trato cercano, de tú a tú, en español.** Puede usar humor; correspóndele con naturalidad.

### Reglas operativas que pidió explícitamente
- **Sin parches.** Hacer las cosas bien aunque tarden más. Nada de apaños.
- **Al entregar, dile SIEMPRE qué archivos has tocado** (lista concreta), para que él los
  revise y aprenda. Y deja el paquete descargable (`present_fs_item_for_download` de `portafolio/`).
- Trabaja sobre la carpeta **`portafolio/`** (es la web real y actual). Ignora copias viejas
  en `uploads/` — están desactualizadas.

---

## 1) QUÉ ES EL PROYECTO

Portafolio personal de **Cristia Gimenez**, diseñador y desarrollador web en **Zaragoza, España**.
Estética **cyberpunk / HUD "CJ_CORE"**: fondo oscuro, cian `#00F0FF`, tipografía mono, terminal,
sidebar de iconos, overlays de "encendido/apagado". Es su carta de presentación para captar
clientes de **diseño y desarrollo web a medida** y para enseñar su producto estrella, **Nidu**.

Sirve por PHP en hosting (cPanel / "Lucus"). Dominio: **cjgimenez.com**.

### Secciones (todas en `portafolio/`)
- `index.html` — Home. Núcleo central con su nombre (H1), 3 módulos clicables (Nidu / Proyectos /
  Contacto), ubicación por IP arriba-izquierda. Tiene versión móvil propia (`home-mobile.js`).
- `sobre-mi.html` — Bio + columna izquierda (avatar + REGISTRO_PERSONAL log) + "CÓMO_FUNCIONO"
  (telemetría decorativa que fluctúa sola `.cj-tele` + barras honestas "en qué invierto mi tiempo"
  `.cj-invest`). SIN porcentajes de nivel (los quitamos a propósito).
- `mis-proyectos.html` — Rejilla de proyectos + Nidu como tarjeta destacada (card 6) que lleva a /nidu.
- `nidu.html` — Página dedicada del SaaS (ver §3).
- `contacto.html` — Orden: **pitch "¿Hablamos de tu web?" arriba** → formulario terminal
  (con `#sys-log` que rota líneas) → botones WhatsApp/Email abajo → footer. Scroll natural (aceptado).
- `politica-privacidad.html`, `404.html`, `contacto.php`/`config.php` (envío de email, PHPMailer en `vendor/`).

CSS por página en `css/`, JS por página en `js/`. Fuentes **locales** (`fonts.css`), sin Google Fonts.

---

## 2) GOTCHAS TÉCNICOS (esto nos ha mordido varias veces — OJO)

1. **Tailwind es un BUILD ESTÁTICO PURGADO** (`css/tailwind.css`). Solo existen las clases que
   ya se usaban. **Las clases con valores arbitrarios NO EXISTEN** y no hacen nada:
   `mb-7`, `leading-[1.9]`, `min-h-[240px]`, `gap-x-8`, `text-[40px]`... → si necesitas un
   espaciado/medida que no esté, **usa estilo inline** (`style="..."`) o CSS propio en el .css de
   la página. NO confíes en clases arbitrarias de Tailwind. (Nota: algunas como `h-[calc(100%-3.5rem)]`
   sí están porque ya se usaban; verifica con eval si dudas.)

2. **La fuente de iconos (Material Symbols) es un SUBSET** descargado de internet por un Claude
   anterior. Solo trae ~16 glifos ya usados (terminal, account_tree, hub, person_search, chat,
   alternate_email, power_settings_new, restart_alt, sensors, language...). **Si añades un icono
   nuevo que no esté en el subset, saldrá como TEXTO** (la palabra "hub" en vez del dibujo).
   → Para iconos NUEVOS en contenido, usa **SVG inline** (no dependen de la fuente, no se rompen,
   heredan color con `currentColor`). Así está hecha la página de Nidu y Sobre-mí. Para el "chrome"
   (sidebar, nav) sí puedes usar los iconos de fuente porque ya están en el subset.

3. **Móvil — sidebar fijo:** usa `height: calc(100dvh - 3.5rem)` (viewport dinámico) para que la
   barra del navegador móvil no tape los botones inferiores (APAGAR/REINICIAR). Y el `padding-left`
   del contenido debe **igualar el ancho del sidebar** en cada breakpoint (si no, se solapan).
   Patrón responsive de referencia: `sobre-mi.css` y `nidu.css` (`@media (max-width:1024px)` y `768`/`480`).

4. **Capturas/screenshots:** el contenido suele estar en `<main>` fijo con scroll propio; la
   herramienta de captura resetea ese scroll. Truco usado: `inner.style.transform='translateY(-Npx)'`
   para "scrollear" a la vista deseada. El `html-to-image` a veces no renderiza texto mono tenue
   (parece caja vacía aunque el texto exista) — verifica con `eval_js` antes de dar algo por roto.

5. **Overlays compartidos** (`#encryption-overlay`, `#purge-overlay`, `#terminal-overlay`,
   `.tech-nebula-bg`): cada página los repite en su CSS, OCULTOS por defecto (`display:none`,
   `.active` los muestra). Si creas página nueva, copia esos estilos o se verán los textos sueltos.

6. **Las consolas/terminales llevan contenido REAL** (no relleno): perfil, servicios, Zaragoza,
   Nidu, invitación a contactar. Es legítimo (visible al abrir) y on-brand. Mantener coherente.

---

## 3) NIDU (producto estrella) — ⚠️ EN PROYECTOS, separado de este

- SaaS web de **gestión para negocios de barrio** (talleres, peluquerías, barberías, tiendas).
- Funciones reales (de capturas que pasó): **agenda/citas con estado de cobro, fichas de clientes
  con alertas (alergias…), caja diaria, facturación con IVA y numeración, productos y stock,
  comisiones por empleado, copias de seguridad espejo.** Todo en un panel.
- Stack: **PHP 8 · MySQL · JS Vanilla**. Estado: **Beta ~90%**. Demo en `app.cjgimenez.com`
  (la enseña él en directo, no es autoservicio). CTA de la página: **"Pedir una demo conmigo"** → /contacto.
- Nombre: se llamaba **CoreGest**, ahora **Nidu**. ⚠️ Las capturas reales aún muestran el logo/nombre
  "CoreGest" por dentro — incoherencia conocida, a corregir cuando renombre la app y pase capturas nuevas.
- Galería "Míralo por dentro" en `nidu.html` con 4 capturas reales (webp en `img/proyectos/nidu-*.webp`).

---

## 4) LISTA DE PROYECTOS (mis-proyectos.html) — datos reales, no inventar
- **Tienda Mágica** (magica.cjgimenez.com) — tienda virtual de fantasía, catálogo. HTML/CSS/JS.
- **Academia Swahili** (swahili.cjgimenez.com) — web educativa de idioma. HTML/CSS/JS.
- **Gorgonópsidos** — web informativa sobre reptiles del Pérmico. HTML/CSS. (Demo "próximamente", sin iframe.)
- **TuHaz** (tuhaz.cjgimenez.com) — landing para entrenador personal online, orientada a conversión.
- **Nidu** — destacado, lleva a /nidu (ver §3).
- Card 1: "Hola Mundo" (su primer proyecto, sentimental). 

---

## 5) SEO — ESTADO REAL (verificado con Search Console)
- ✅ Web **indexada** en Google. Sitemap `https://cjgimenez.com/sitemap.xml` **detectado y registrado**.
  Rastreo e indexación permitidos. HTTPS OK. Móvil OK.
- ✅ Hecho: meta tags, OG/Twitter, JSON-LD (Person, ProfessionalService, SoftwareApplication=Nidu,
  WebSite, ProfilePage), `robots.txt`, keywords, geo Zaragoza, H1 reales, `alt` descriptivos en
  las 12 imágenes, `title` en iframes, `aria-label` en SVGs.
- "Página de referencia: ninguna" = aún no le enlazan desde fuera (normal en web nueva, llega con tiempo).
- **Honestidad sobre SEO** (díselo si surge): los medidores tipo 78/89% miden *higiene técnica*,
  NO visitas. Las visitas vienen de: indexación (hecha) + **Google Business Profile** (pendiente, alto
  impacto local) + enlaces externos + tiempo. El atributo `title` en imágenes NO sirve para SEO
  (Google usa `alt`); no lo añadas solo para contentar a un medidor — empeora accesibilidad.

---

## 6) DATOS / CONTACTO
- Email: **contacto@cjgimenez.com** · WhatsApp: **+34 666 160 400** (wa.me/34666160400)
- GitHub: **https://github.com/CJGimenezDeV**
- Servicios: diseño + desarrollo de webs a medida · pack web+alojamiento+mantenimiento · rediseños.
  Es "todoterreno": le gusta el diseño pero aprende de todo; compagina webs a medida con el SaaS.

---

## 7) PENDIENTE / ROADMAP
- 🌐 **Traducción al inglés** (lo grande — hay selector de idioma `[ES]` ya montado, `i18n.js`).
  Dejarlo para sesión con tokens frescos; hacerlo entero, no a medias.
- 🔁 Sustituir capturas de Nidu cuando estén con la marca "Nidu" (hoy ponen "CoreGest").
- 📍 Recomendarle Google Business Profile cuando toque hablar de captar visitas.
- (Idea suya, baja prioridad) darle más "vidilla" a los módulos de la Home.

---

## 8) ENTREGA — checklist al terminar
1. `done` con la página principal tocada (sin errores de consola).
2. `fork_verifier_agent` si no es trivial.
3. `present_fs_item_for_download` de `portafolio/`.
4. **Listar los archivos tocados** para que Cristia los revise y aprenda.
