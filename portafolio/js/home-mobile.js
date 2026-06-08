/* ==========================================
   HOME-MOBILE.JS — Panel interactivo de inicio (móvil)
   Portafolio CJ_CORE — Cristia Gimenez
   Solo actúa sobre #mobile-home (oculto en escritorio).
   ========================================== */
(function () {
    // --- Terminal autoescrita ---
    var typeEl = document.getElementById('mh-type');
    if (typeEl) {
        var phrases = [
            'interfaces con identidad.',
            'front-end a medida.',
            'código limpio y bonito.',
            'tu próxima web.'
        ];
        var p = 0, i = 0, deleting = false;

        function tick() {
            var full = phrases[p];
            if (!deleting) {
                typeEl.textContent = full.slice(0, i + 1);
                i++;
                if (i === full.length) {
                    deleting = true;
                    return setTimeout(tick, 1600);
                }
            } else {
                typeEl.textContent = full.slice(0, i - 1);
                i--;
                if (i === 0) {
                    deleting = false;
                    p = (p + 1) % phrases.length;
                    return setTimeout(tick, 320);
                }
            }
            setTimeout(tick, deleting ? 38 : 68);
        }
        // Arranca pronto (ya no hay boot que esperar)
        setTimeout(tick, 600);
    }

    // --- Reloj en vivo (estado del sistema) ---
    var clockEl = document.getElementById('mh-clock');
    if (clockEl) {
        var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
        var updateClock = function () {
            var d = new Date();
            clockEl.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    // --- Chips: resaltado al tocar/click ---
    var chips = document.querySelectorAll('#mobile-home .mh-chip');
    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            chip.classList.toggle('is-active');
        });
    });
})();
