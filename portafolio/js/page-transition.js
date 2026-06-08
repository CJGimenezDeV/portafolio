/* ==========================================
   TRANSICIONES ENTRE PÁGINAS — Lógica
   - Intercepta clicks en links internos
   - Dispara animación glitch y navega
   - Fade-in al cargar nueva página
   ========================================== */

(function () {
    'use strict';

    const TRANSITION_DURATION = 500;  // Debe coincidir con la animación CSS

    // ------- 1. Crear el overlay y meterlo en el body -------
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'page-transition-overlay';
        overlay.innerHTML = `
            <div class="glitch-layer glitch-r"></div>
            <div class="glitch-layer glitch-c"></div>
            <div class="scanlines"></div>
            <div class="glitch-bar glitch-bar-1"></div>
            <div class="glitch-bar glitch-bar-2"></div>
            <div class="glitch-text">// TRANSMITIENDO //</div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    // ------- 2. Fade-in al cargar la página -------
    // NOTA: el revelado de entrada ahora lo hace el CSS por sí solo
    // (animación 'page-reveal' sobre body, que nace oculto y se revela).
    // Por eso aquí NO añadimos 'page-entering' al cargar: si lo hiciéramos,
    // reiniciaría la animación a mitad y volvería a parpadear.
    // Esta función se mantiene solo para el caso del bfcache (botón atrás),
    // donde la página viene cacheada y SÍ hay que forzar el fade.
    function triggerEntryFade() {
        document.body.classList.add('page-entering');
        setTimeout(() => {
            document.body.classList.remove('page-entering');
        }, 500);
    }

    // ------- 3. Determinar si un link debe activar la transición -------
    function shouldAnimate(link, event) {
        // No animar si el modificador de tecla está activo (ctrl/cmd/shift/alt)
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
            return false;
        }
        // No animar click derecho ni medio
        if (event.button !== 0) {
            return false;
        }
        // Sin href, no se navega
        const href = link.getAttribute('href');
        if (!href) return false;
        // Anchors locales (#algo) no son navegación
        if (href.startsWith('#')) return false;
        // Mailto, tel, javascript: no son navegación de página
        if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;
        // target="_blank" o similar: el navegador abre nueva pestaña, no animamos
        const target = link.getAttribute('target');
        if (target && target !== '_self') return false;
        // Enlace explícitamente sin animación
        if (link.hasAttribute('data-no-transition')) return false;
        // Enlaces a dominio externo
        try {
            const url = new URL(href, window.location.href);
            if (url.origin !== window.location.origin) return false;
            // Si va a la misma URL exacta, no animar
            if (url.href === window.location.href) return false;
        } catch (e) {
            return false;
        }
        return true;
    }

    // ------- 4. Disparar la transición y navegar -------
    function triggerTransition(targetURL, overlay) {
        overlay.classList.add('active');
        // Esperar a que termine la animación y navegar
        setTimeout(() => {
            window.location.href = targetURL;
        }, TRANSITION_DURATION);
    }

    // ------- 5. Wire up -------
    function init() {
        const overlay = createOverlay();
        // El revelado de entrada lo hace el CSS solo (body nace oculto y se revela).
        // No llamamos a triggerEntryFade() aquí para no duplicar la animación.

        // Delegación de eventos en document para capturar TODOS los links,
        // incluyendo los que se añadan dinámicamente al DOM
        // useCapture: true → este listener se ejecuta en fase de captura,
        // ANTES que cualquier listener en fase de burbujeo (los de cada página).
        // Esto permite que stopImmediatePropagation realmente impida que
        // los otros listeners corran, evitando el "efecto rarete" cuando
        // la sidebar intenta cerrarse a la vez que arranca el glitch.
        document.addEventListener('click', function (e) {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');

            // href="#" o href vacío: link "muerto" (página actual), bloquear
            // el salto al top del navegador, NO animar tampoco.
            if (href === '#' || href === '' || href === null) {
                e.preventDefault();
                e.stopImmediatePropagation();
                return;
            }

            if (!shouldAnimate(link, e)) return;

            // preventDefault: bloquea la navegación nativa del navegador.
            // stopImmediatePropagation: bloquea que otros listeners (como el de
            // cerrar sidebar de cada página) se ejecuten — si lo hicieran,
            // su animación de cierre se mezclaría con nuestro glitch.
            e.preventDefault();
            e.stopImmediatePropagation();
            triggerTransition(link.href, overlay);
        }, true);  // ← true = capture phase

        // Si el usuario usa el botón "atrás" del navegador y la página viene
        // de bfcache (back-forward cache), forzar fade-in también
        window.addEventListener('pageshow', function (e) {
            if (e.persisted) {
                overlay.classList.remove('active');
                triggerEntryFade();
            }
        });
    }

    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
