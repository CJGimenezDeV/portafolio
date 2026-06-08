/* ==========================================
   SELECTOR DE IDIOMA — Lógica del botón
   ==========================================

   Responsabilidades de este archivo (SOLO esto):
   - Abrir/cerrar el dropdown al hacer click en el botón [ ES ]
   - Cerrar al hacer click fuera
   - Cerrar al pulsar Escape (accesibilidad)
   - Cambiar el texto del botón: [ ES ] ↔ [ EN ]
   - Mover el indicador (puntito cyan) al idioma activo
   - Guardar la preferencia en localStorage
   - Cargar la preferencia al recargar la página

   Lo que este archivo NO hace (vendrá en Fase 2):
   - NO traduce textos de la página. Por ahora solo cambia el botón.
   - NO carga JSONs. Eso vendrá luego.

   Mismo comportamiento en desktop y móvil: click/tap para abrir.
   ========================================== */

(function () {
    'use strict';

    const STORAGE_KEY = 'cj_lang';
    const SUPPORTED = ['es', 'en'];
    const DEFAULT_LANG = 'es';

    // -------- Referencias al DOM --------
    const wrapper = document.getElementById('lang-wrapper');
    const button  = document.getElementById('lang-selector');
    const label   = document.getElementById('lang-current-label');
    const options = document.querySelectorAll('[data-lang-option]');

    // Si no existe el botón en esta página, no hacemos nada.
    // Permite que este script se cargue en páginas que aún no tienen el selector.
    if (!wrapper || !button || !label) return;

    // -------- Estado --------

    function getSavedLang() {
        const saved = localStorage.getItem(STORAGE_KEY);
        return SUPPORTED.includes(saved) ? saved : DEFAULT_LANG;
    }

    function setSavedLang(lang) {
        localStorage.setItem(STORAGE_KEY, lang);
    }

    // -------- UI: dropdown abrir/cerrar --------

    function openDropdown() {
        wrapper.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
        wrapper.classList.remove('is-open');
        button.setAttribute('aria-expanded', 'false');
    }

    function toggleDropdown() {
        if (wrapper.classList.contains('is-open')) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }

    // -------- UI: reflejar el idioma actual en el botón y el dropdown --------

    function updateUI(lang) {
        // Texto del botón principal: [ ES ] o [ EN ]
        label.textContent = `[ ${lang.toUpperCase()} ]`;

        // Para cada opción del dropdown, marcar la activa
        options.forEach(opt => {
            const its = opt.getAttribute('data-lang-option');
            const indicator = opt.querySelector('[data-lang-indicator]');

            if (its === lang) {
                // Opción activa: texto cyan, indicador encendido
                opt.classList.add('text-primary-container');
                opt.classList.remove('text-on-surface-variant/60');
                if (indicator) {
                    indicator.classList.add('bg-primary-container', 'shadow-[0_0_5px_#00F0FF]');
                    indicator.classList.remove('bg-transparent');
                }
            } else {
                // Opción inactiva: texto gris, indicador apagado
                opt.classList.remove('text-primary-container');
                opt.classList.add('text-on-surface-variant/60');
                if (indicator) {
                    indicator.classList.remove('bg-primary-container', 'shadow-[0_0_5px_#00F0FF]');
                    indicator.classList.add('bg-transparent');
                }
            }
        });
    }

    // -------- Cambiar de idioma (de momento solo UI, sin traducir texto) --------

    function setLanguage(lang) {
        if (!SUPPORTED.includes(lang)) return;
        setSavedLang(lang);
        updateUI(lang);
        // En Fase 2: aquí dispararemos la carga del JSON y aplicaremos traducciones.
    }

    // -------- Listeners --------

    // Click en el botón principal: abre/cierra
    button.addEventListener('click', function (e) {
        e.stopPropagation();  // Evitar que el listener del documento lo cierre al instante
        toggleDropdown();
    });

    // Click en una opción del dropdown: cambiar idioma y cerrar
    options.forEach(opt => {
        opt.addEventListener('click', function (e) {
            e.stopPropagation();
            const lang = opt.getAttribute('data-lang-option');
            setLanguage(lang);
            closeDropdown();
        });
    });

    // Click en cualquier parte fuera del wrapper: cerrar
    document.addEventListener('click', function (e) {
        if (!wrapper.contains(e.target)) {
            closeDropdown();
        }
    });

    // Tecla Escape: cerrar (accesibilidad)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && wrapper.classList.contains('is-open')) {
            closeDropdown();
        }
    });

    // -------- Inicialización --------

    // Cargar idioma guardado (o default) y reflejarlo en el botón
    updateUI(getSavedLang());

})();
