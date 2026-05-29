/* ==========================================
   CURSOR HUD CYBERPUNK — Lógica
   Detecta puntero fino (no táctil) y monta el cursor.
   ========================================== */

(function () {
    'use strict';

    // Solo si el dispositivo tiene puntero fino (ratón/trackpad).
    // En táctil ni siquiera lo montamos.
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    // Detección extra de dispositivo táctil (incluye DevTools simulando móvil)
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!hasFinePointer || isTouchDevice) return;

    // Crear el elemento del cursor
    const cursor = document.createElement('div');
    cursor.id = 'hud-cursor';
    cursor.innerHTML = `
        <span class="bracket bracket-left">[</span>
        <div class="crosshair">
            <span class="line line-top"></span>
            <span class="line line-bottom"></span>
            <span class="line line-left"></span>
            <span class="line line-right"></span>
            <span class="dot"></span>
        </div>
        <span class="bracket bracket-right">]</span>
    `;
    document.body.appendChild(cursor);

    // Movimiento — usamos transform via requestAnimationFrame para fluidez
    let mouseX = 0, mouseY = 0;
    let rendered = false;

    function onMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!rendered) {
            rendered = true;
            requestAnimationFrame(render);
        }
        // Si estaba inactivo (fuera de la ventana), reactivar
        if (cursor.classList.contains('inactive')) {
            cursor.classList.remove('inactive');
        }
    }

    function render() {
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        rendered = false;
    }

    document.addEventListener('mousemove', onMove, { passive: true });

    // Selector de "clickables" — todo lo que debe activar el estado hover
    const CLICKABLE_SELECTOR = [
        'a',
        'button',
        '[role="button"]',
        'input',
        'textarea',
        'select',
        'label',
        '.cursor-pointer',
        '[data-cursor="hover"]',
        '#sidebar [class*="sidebar-link"]',
        '#sidebar a',
        '#sidebar button',
        'nav a',
        'nav button'
    ].join(',');

    // Detectar hover via delegación de eventos (más eficiente que listeners individuales)
    document.addEventListener('mouseover', function (e) {
        if (e.target.closest(CLICKABLE_SELECTOR)) {
            cursor.classList.add('hover');
        }
    }, { passive: true });

    document.addEventListener('mouseout', function (e) {
        // Si salimos de un clickable y no entramos en otro, quitar hover
        if (e.target.closest(CLICKABLE_SELECTOR)) {
            const related = e.relatedTarget;
            if (!related || !related.closest || !related.closest(CLICKABLE_SELECTOR)) {
                cursor.classList.remove('hover');
            }
        }
    }, { passive: true });

    // Feedback de click
    document.addEventListener('mousedown', function () {
        cursor.classList.add('clicking');
    }, { passive: true });

    document.addEventListener('mouseup', function () {
        cursor.classList.remove('clicking');
    }, { passive: true });

    // Ocultar cuando el ratón sale de la ventana
    document.addEventListener('mouseleave', function () {
        cursor.classList.add('inactive');
    });

    document.addEventListener('mouseenter', function () {
        cursor.classList.remove('inactive');
    });

})();
