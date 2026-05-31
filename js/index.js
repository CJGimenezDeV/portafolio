/* ==========================================
   INDEX.JS — Página de inicio
   Portafolio CJ_CORE — Cristia Gimenez
   ========================================== */

let isPowerOn = true;

        // Nebula Background Initializer
        function initNebula() {
            const nebula = document.getElementById('nebula-bg');
            if (!nebula) return;
            for (let i = 0; i < 60; i++) {
                const p = document.createElement('div');
                p.className = 'data-particle';
                p.style.left = Math.random() * 100 + '%';
                p.style.top = Math.random() * 100 + '%';
                p.style.animationDelay = Math.random() * 20 + 's';
                nebula.appendChild(p);
            }
            for (let i = 0; i < 15; i++) {
                const s = document.createElement('div');
                s.className = 'data-stream-line';
                s.style.left = Math.random() * 100 + '%';
                s.style.height = (Math.random() * 200 + 100) + 'px';
                s.style.animationDuration = (Math.random() * 5 + 8) + 's';
                s.style.animationDelay = (Math.random() * 5) + 's';
                nebula.appendChild(s);
            }
        }

        // Bio Sync Visualizer Logic
        function initBioSync() {
            const container = document.getElementById('bio-sync-container');
            if (!container) return;
            const barCount = 12;
            for (let i = 0; i < barCount; i++) {
                const bar = document.createElement('div');
                bar.className = 'bio-bar flex-grow';
                bar.style.animationDelay = (Math.random() * 2) + 's';
                bar.style.animationDuration = (0.5 + Math.random()) + 's';
                container.appendChild(bar);
            }
        }

        function togglePower() {
            isPowerOn = !isPowerOn;
            const body = document.body;
            const powerBtn = document.getElementById('btn-power');
            const powerLabel = document.getElementById('label-power');

            if (!isPowerOn) {
                body.classList.add('power-off');
                powerBtn.classList.remove('text-red-500');
                powerBtn.classList.add('text-green-500', 'bg-green-500/10');
                powerLabel.innerText = (window.i18n && window.i18n.t('sidebar.power_on')) || "ENCENDER";
                powerLabel.setAttribute('data-i18n', 'sidebar.power_on');
            } else {
                body.classList.remove('power-off');
                powerBtn.classList.add('text-red-500');
                powerBtn.classList.remove('text-green-500', 'bg-green-500/10');
                powerLabel.innerText = (window.i18n && window.i18n.t('sidebar.power_off')) || "APAGAR";
                powerLabel.setAttribute('data-i18n', 'sidebar.power_off');
            }
        }

        function triggerReset() {
            if (!isPowerOn) return;
            const resetOverlay = document.getElementById('reset-overlay');
            const progressBar = document.getElementById('reset-progress-bar');
            const bootSequence = document.getElementById('boot-sequence');
            resetOverlay.classList.add('active');
            setTimeout(() => progressBar.style.width = '100%', 10);
            setTimeout(() => {
                resetOverlay.classList.remove('active');
                progressBar.style.width = '0%';
                bootSequence.style.display = 'flex';
                bootSequence.style.animation = 'none';
                bootSequence.offsetHeight;
                bootSequence.style.animation = 'glitch-fade-out 0.5s ease-in 3.5s forwards';
                setTimeout(() => bootSequence.style.display = 'none', 4500);
            }, 2000);
        }

        function toggleTerminal() {
            document.getElementById('terminal-overlay').classList.toggle('active');
        }

        function logTerminal(msg, color = "text-primary-container/50") {
            const content = document.getElementById('terminal-content');
            if (content) {
                const div = document.createElement('div');
                div.className = color;
                div.innerHTML = `&gt; ${msg}`;
                content.appendChild(div);
                content.scrollTop = content.scrollHeight;
            }
        }

        // Tech Bars: el JS controla cuándo crecen (tras el boot) y luego laten
        function fillTechBars() {
            const bars = document.querySelectorAll('.tech-bar');
            bars.forEach(bar => {
                const lvl = bar.getAttribute('data-level');
                bar.addEventListener('transitionend', function handler() {
                    bar.classList.add('is-pulsing');
                    bar.removeEventListener('transitionend', handler);
                });
                bar.style.width = lvl + '%';
            });
        }

        // Logo CJ typewriter: se dispara DESPUÉS del boot, solo primera vez por sesión
        function playLogoAnim() {
            if (sessionStorage.getItem('cj_logo_seen')) return;
            const logo = document.getElementById('cj-logo');
            if (!logo) return;
            // Forzar opacidad 0 antes de añadir la clase para evitar flash
            logo.querySelectorAll('.cj-letter').forEach(l => l.style.opacity = '0');
            logo.classList.add('is-animating');
            sessionStorage.setItem('cj_logo_seen', '1');
        }

        window.onload = () => {
            initNebula();
            initBioSync();
            setTimeout(() => {
                const boot = document.getElementById('boot-sequence');
                if(boot) boot.style.display = 'none';
                fillTechBars();
                playLogoAnim();
            }, 4500);
        };
/* ==========================================
   SIDEBAR — click para abrir/cerrar (solo escritorio).
   En móvil index usa #mobile-home y no hay #sidebar, así que
   el "if (!sb) return" hace que aquí no pase nada en móvil.
   Movido desde el <script> inline del HTML (sin cambios).
   ========================================== */
(function() {
    var sb = document.getElementById('sidebar');
    if (!sb) return;
    var bd = document.createElement('div');
    bd.id = 'sidebar-backdrop';
    document.body.appendChild(bd);

    sb.addEventListener('click', function(e) {
        if (e.target.closest('a') || e.target.closest('[onclick]')) return;
        if (!sb.classList.contains('open')) {
            sb.classList.add('open');
            bd.classList.add('active');
        }
    });
    bd.addEventListener('click', function() {
        sb.classList.remove('open');
        bd.classList.remove('active');
    });
    sb.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function() {
            sb.classList.remove('open');
            bd.classList.remove('active');
        });
    });
})();
