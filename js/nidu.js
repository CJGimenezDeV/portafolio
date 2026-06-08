/* ==========================================
   NIDU.JS — Página dedicada del SaaS Nidu
   Chrome del sistema (power/reset/terminal) + reveal al hacer scroll.
   Sin dependencias externas.
   ========================================== */

let powerOn = true;

function logTerminal(msg, color = "text-primary-container/50") {
    const content = document.getElementById('terminal-content');
    if (!content) return;
    const div = document.createElement('div');
    div.className = color;
    div.innerHTML = `&gt; ${msg}`;
    content.appendChild(div);
    content.scrollTop = content.scrollHeight;
}

function togglePower() {
    const overlay = document.getElementById('encryption-overlay');
    const btn = document.getElementById('power-btn');
    powerOn = !powerOn;
    if (powerOn) {
        overlay.classList.remove('active');
        btn.querySelector('span:last-child').innerText = 'APAGAR';
        btn.classList.remove('bg-green-600', 'text-white');
        btn.classList.add('text-red-500');
        logTerminal("SISTEMA RESTAURADO: IDENTIDAD CONFIRMADA", "text-blue-400 font-bold uppercase");
    } else {
        overlay.classList.add('active');
        btn.querySelector('span:last-child').innerText = 'ENCENDER';
        btn.classList.add('bg-green-600', 'text-white');
        btn.classList.remove('text-red-500');
    }
}

function resetSystem() {
    if (!powerOn) return;
    const purge = document.getElementById('purge-overlay');
    const bar = document.getElementById('purge-bar');
    const status = document.getElementById('reset-status');
    purge.classList.add('active');
    bar.style.width = '100%';
    const logs = ["DEPURANDO CACHÉ...", "CALIBRANDO NÚCLEO...", "SINCRONIZANDO BUFFER...", "REINICIO COMPLETADO"];
    let i = 0;
    const interval = setInterval(() => { if (i < logs.length) status.innerText = logs[i++]; }, 800);
    setTimeout(() => { clearInterval(interval); window.location.reload(); }, 3000);
}

function toggleTerminal() {
    document.getElementById('terminal-overlay').classList.toggle('active');
}

// Reveal progresivo de secciones al entrar en viewport
function initReveal() {
    const els = document.querySelectorAll('.nidu-reveal');
    if (!('IntersectionObserver' in window)) {
        els.forEach(e => e.classList.add('in'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
    }, { threshold: 0.15 });
    els.forEach(e => io.observe(e));
}

window.addEventListener('DOMContentLoaded', initReveal);

/* ==========================================
   SIDEBAR TÁCTIL — abrir al tocar, fondo oscuro, cerrar al salir.
   Mismo comportamiento que en sobre-mi / mis-proyectos.
   ========================================== */
(function() {
    var sb = document.getElementById('sidebar');
    if (!sb) return;
    var bd = document.createElement('div');
    bd.id = 'sidebar-backdrop';
    document.body.appendChild(bd);

    sb.addEventListener('click', function(e) {
        // No abrir si se toca un enlace o un botón de acción
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
