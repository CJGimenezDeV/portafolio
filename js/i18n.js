/* ==========================================
   SISTEMA DE TRADUCCIÓN (i18n)
   Carga JSON, aplica traducciones, persiste preferencia.
   ========================================== */

(function () {
    'use strict';

    const STORAGE_KEY = 'cj_lang';
    const DEFAULT_LANG = 'es';
    const SUPPORTED_LANGS = ['es', 'en'];

    let currentTranslations = {};
    let currentLang = DEFAULT_LANG;

    // ------- Helpers -------

    // Acceder a "index.bio_sync" dentro del JSON anidado
    function getByPath(obj, path) {
        return path.split('.').reduce((acc, key) => {
            return acc && acc[key] !== undefined ? acc[key] : null;
        }, obj);
    }

    // Determinar idioma inicial: localStorage > default
    function getInitialLang() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
        return DEFAULT_LANG;
    }

    // ------- Carga del JSON -------

    async function loadTranslations(lang) {
        try {
            const response = await fetch(`i18n/${lang}.json`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (err) {
            console.error('[i18n] Error cargando traducciones:', err);
            return null;
        }
    }

    // ------- Aplicar traducciones al DOM -------

    function applyTranslations(translations) {
        // Elementos con data-i18n="clave" — reemplazan su textContent
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = getByPath(translations, key);
            if (value !== null) {
                el.innerHTML = value;
            }
        });

        // Elementos con data-i18n-attr="atributo:clave" — reemplazan un atributo concreto
        // Ej: data-i18n-attr="placeholder:contact.name_placeholder"
        document.querySelectorAll('[data-i18n-attr]').forEach(el => {
            const spec = el.getAttribute('data-i18n-attr');
            spec.split(',').forEach(pair => {
                const [attr, key] = pair.trim().split(':');
                const value = getByPath(translations, key);
                if (value !== null && attr) {
                    el.setAttribute(attr, value);
                }
            });
        });

        // Título de la página: <title data-i18n-title="index.page_title">
        const titleEl = document.querySelector('title[data-i18n-title]');
        if (titleEl) {
            const key = titleEl.getAttribute('data-i18n-title');
            const value = getByPath(translations, key);
            if (value !== null) {
                document.title = value;
            }
        }

        // Atributo lang del HTML para SEO/accesibilidad
        document.documentElement.setAttribute('lang', translations._meta?.lang || 'es');
    }

    // ------- Actualizar UI del selector de idioma -------

    function updateLangUI(lang) {
        // Cambiar el código del botón principal: [ ES ] ↔ [ EN ]
        const labelEl = document.querySelector('[data-i18n-langcode]');
        if (labelEl) {
            labelEl.textContent = `[ ${lang.toUpperCase()} ]`;
        }

        // Marcar el indicador del idioma activo en el desplegable
        document.querySelectorAll('[data-lang-indicator]').forEach(el => {
            const itsLang = el.getAttribute('data-lang-indicator');
            if (itsLang === lang) {
                el.classList.add('bg-primary-container');
                el.classList.add('shadow-[0_0_5px_#00F0FF]');
                el.classList.remove('bg-transparent');
            } else {
                el.classList.remove('bg-primary-container');
                el.classList.remove('shadow-[0_0_5px_#00F0FF]');
                el.classList.add('bg-transparent');
            }
        });

        // También el color del texto: activo en cyan, inactivo en gris
        document.querySelectorAll('[data-lang-option]').forEach(el => {
            const itsLang = el.getAttribute('data-lang-option');
            if (itsLang === lang) {
                el.classList.add('text-primary-container');
                el.classList.remove('text-on-surface-variant/60');
            } else {
                el.classList.remove('text-primary-container');
                el.classList.add('text-on-surface-variant/60');
            }
        });
    }

    // ------- Cambiar de idioma -------

    async function setLanguage(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) return;

        const translations = await loadTranslations(lang);
        if (!translations) return;

        currentLang = lang;
        currentTranslations = translations;
        localStorage.setItem(STORAGE_KEY, lang);

        applyTranslations(translations);
        updateLangUI(lang);

        // Emitir evento para que otros scripts (que generen contenido dinámico)
        // puedan reaccionar y traducir sus propios textos
        document.dispatchEvent(new CustomEvent('languagechange', {
            detail: { lang, translations }
        }));
    }

    // Exponer API pública
    window.i18n = {
        setLanguage,
        getCurrentLang: () => currentLang,
        t: (key) => getByPath(currentTranslations, key)
    };

    // ------- Inicialización -------

    function init() {
        const initialLang = getInitialLang();
        setLanguage(initialLang);

        // ------- Dropdown de idioma: comportamiento click (necesario en móvil) -------
        // En desktop el hover de Tailwind ya funciona. En móvil/táctil, hover no existe,
        // así que añadimos click para abrir/cerrar. Compatibles ambos comportamientos.
        const langSelector = document.getElementById('lang-selector');
        if (langSelector) {
            const dropdown = langSelector.parentElement; // contenedor .group
            const menu = langSelector.nextElementSibling; // el div del desplegable

            // Forzar abrir/cerrar manualmente con una clase propia (no depender solo de hover)
            langSelector.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                dropdown.classList.toggle('lang-open');
            }, true);

            // Cerrar al hacer click fuera
            document.addEventListener('click', function (e) {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('lang-open');
                }
            });
        }

        // Enganchar clicks de los botones del desplegable de idioma
        document.querySelectorAll('[data-lang-option]').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                const lang = btn.getAttribute('data-lang-option');
                setLanguage(lang);
                // Cerrar el dropdown tras seleccionar
                if (langSelector) {
                    langSelector.parentElement.classList.remove('lang-open');
                }
            }, true);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
