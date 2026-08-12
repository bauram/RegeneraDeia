# Regenera Deià — clon local (pixel-perfect)

Clon estático del sitio **https://www.regeneradeia.com** (construido con **Framer**),
generado con el pipeline `clone-master` el 2026-08-12.

## Alcance
Sitio completo en su idioma por defecto (inglés): **13 páginas**.

- `index.html` — Home
- `about.html` — About
- `pilars.html` — Pilars
- `fundraising.html` — Fundraising
- `donate.html` — Donate
- `faq.html` — FAQ
- `contact.html` — Contact
- `blog.html` — Blog (índice)
- `privacy-policy.html` — Privacy Policy
- `blog/regenera-deia-kick-off.html`
- `blog/deià-revolving-solidarity-fund.html`
- `blog/growing-community-the-role-of-community-gardens-in-regenera-deià.html`
- `blog/recipes-for-regeneration-reviving-the-taste-of-deià.html`

## Estructura
```
index.html (+ una página por cada página del sitio)
blog/                 páginas de las entradas del blog
css/                  una hoja de estilos completa por página (styles reales de Framer)
images/               imágenes, SVG y vídeos (todo local)
fonts/                fuentes (todo local)
capturas/             capturas de referencia de cada página (excluidas de git)
README.md
.gitignore
```

## Imágenes y assets
**100% locales.** Las 133 imágenes / SVG / vídeos / fuentes se descargaron a `images/`
y `fonts/`; el HTML y el CSS se reescribieron para no depender del CDN de Framer
(`framerusercontent.com`). El sitio renderiza sin ninguna conexión externa.

## Cómo previsualizarlo
```
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Cómo se clonó (Framer)
Framer no sirve el CSS como archivos `.css` enlazados: lo inyecta en el CSSOM en
tiempo de ejecución mediante JavaScript. Por eso, además del HTML renderizado, se
extrajo la hoja de estilos completa de cada página desde el CSSOM (`css/*.css`) y se
enlazó en cada HTML. Los estados iniciales de las animaciones "appear" de Framer
(opacity:0 / translateY) se fijaron a su estado final visible.

## Limitaciones conocidas
- **Copia estática:** se han retirado los scripts de Framer. El layout, estilos,
  tipografías, colores e imágenes son fieles al original en escritorio (1920px).
- **Animaciones ligadas al scroll:** algunos efectos de Framer que cambian de forma
  continua según la posición de scroll (p. ej. el gran titular "We are transforming
  this…" en verde sobre verde de la home, que se aclara al hacer scroll) se muestran
  en su estado estático inicial, ya que dependen del runtime JS de Framer.
- **Metadatos sociales:** las etiquetas `og:image` / `twitter:image` y el índice de
  búsqueda de Framer (`<meta>`) siguen apuntando al CDN original. No afectan al
  renderizado; se conservan tal cual del original.
- Solo versión **desktop** (no responsive tablet/móvil), según el alcance por defecto.

## Origen
- URL clonada: https://www.regeneradeia.com
- Fecha: 2026-08-12
- Generado con el pipeline `clone-master`.


## Animaciones (JS propio, local)
Las animaciones de aparición al hacer scroll (fade + desplazamiento) se reproducen
con `js/animations.js` (IntersectionObserver + red de seguridad), manteniendo el
sitio 100% local. Los elementos animados están marcados con `data-appear`. Si el
JS no cargara, un failsafe muestra todo el contenido igualmente. Respeta
`prefers-reduced-motion`.
