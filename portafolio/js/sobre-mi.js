/* ==========================================
   SOBRE-MI.JS — Portafolio CJ_CORE — Cristia Gimenez
   ========================================== */

let powerOn = true;
    
    // Timer Real-Time Logic
    let days = 365, hours = 4, minutes = 14, seconds = 34;
    function updateTimer() {
        if (!powerOn) return;
        seconds++;
        if (seconds >= 60) { seconds = 0; minutes++; }
        if (minutes >= 60) { minutes = 0; hours++; }
        if (hours >= 24) { hours = 0; days++; }
        const pad = (n) => n.toString().padStart(2, '0');
        const timerEl = document.getElementById('activity-timer');
        if(timerEl) timerEl.textContent = `${days}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    setInterval(updateTimer, 1000);

    // Nebula Background Generator
    function initNebula() {
        const nebula = document.getElementById('nebula-bg');
        if (!nebula) return;
        // Particles
        for (let i = 0; i < 60; i++) {
            const p = document.createElement('div');
            p.className = 'data-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 20 + 's';
            nebula.appendChild(p);
        }
        // Streams
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

    function togglePower() {
        const overlay = document.getElementById('encryption-overlay');
        const btn = document.getElementById('power-btn');
        powerOn = !powerOn;
        if (powerOn) {
            overlay.classList.remove('active');
            btn.querySelector('span:last-child').innerText = 'ENCENDER';
            btn.classList.remove('bg-red-600', 'text-white');
            btn.classList.add('text-red-500');
            logTerminal("SISTEMA RESTAURADO: IDENTIDAD CONFIRMADA", "text-blue-400 font-bold uppercase");
        } else {
            overlay.classList.add('active');
            btn.classList.add('bg-red-600', 'text-white');
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
        
        const logs = ["DEPURANDO CACHÉ...", "CALIBRANDO NÚCLEO...", "ESTABLECIENDO CONEXIÓN...", "REINICIO COMPLETADO"];
        let i = 0;
        const interval = setInterval(() => {
            if(i < logs.length) status.innerText = logs[i++];
        }, 800);

        setTimeout(() => {
            clearInterval(interval);
            window.location.reload();
        }, 3000);
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

    // Progress Bar Initiation
    window.addEventListener('load', () => {
        initNebula();
        setTimeout(() => {
            // Compatibilidad: si quedara alguna barra antigua
            document.querySelectorAll('.skill-bar-fill').forEach(bar => bar.classList.add('active'));
            // Barras honestas "en qué invierto mi tiempo": rellenar a su valor
            document.querySelectorAll('.cj-invest').forEach(bar => bar.classList.add('active'));
            // Telemetría decorativa: fluctúa sola, cada barra a su ritmo
            initTelemetry();
        }, 500);
    });

    // Telemetría: cada barra se mueve a valores aleatorios entre data-min y data-max
    function initTelemetry() {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.querySelectorAll('.cj-tele').forEach(bar => {
            const min = parseInt(bar.dataset.min || '40', 10);
            const max = parseInt(bar.dataset.max || '95', 10);
            const speed = parseInt(bar.dataset.speed || '1800', 10);
            const tick = () => {
                const val = Math.floor(min + Math.random() * (max - min));
                bar.style.width = val + '%';
            };
            tick();
            if (!reduce) setInterval(tick, speed);
        });
    }

// ELIMINADO: listener obsoleto que añadía un segundo handler a los botones
// del dropdown de idioma. Era código del antiguo sistema de idioma y se
// ejecutaba en paralelo con js/lang-button.js, ensuciando el terminal log.
// La lógica del botón de idioma ahora vive ÚNICAMENTE en lang-button.js.

(function() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    // Crear overlay
    const overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    document.body.appendChild(overlay);

    // Al hacer click en el icono de la sidebar, se queda fija
    sidebar.addEventListener('click', function(e) {
        if (!sidebar.classList.contains('locked')) {
            sidebar.classList.add('locked');
            overlay.classList.add('active');
            e.stopPropagation();
        }
    });

    // Al hacer click fuera, se cierra
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('locked');
        overlay.classList.remove('active');
    });

    // Al hacer click en un enlace, navega y cierra
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            sidebar.classList.remove('locked');
            overlay.classList.remove('active');
        });
    });
})();
// Log animado — easter egg rasgos de personalidad
window.addEventListener('load', function() {
    var profileLog = document.getElementById('profile-log');
    if (!profileLog) return;
    var msgs = [
        "> ANALIZANDO_PERFIL_CJ...",
        "> RASGO_DETECTADO: Cabezon al 99.9%",
        "> ADVERTENCIA: Nivel tiquismiquis MAXIMO",
        "> ESTADO: Directo y sin filtros",
        "> PASION_NIVEL: Fuera de escala",
        "> RASGO_DETECTADO: Ojo para los detalles",
        "> CONSTANCIA: Valor fuera de rango",
        "> CURIOSIDAD: Siempre pregunta el porque",
        "> DIAGNOSTICO: Buen tio confirmado",
        "> ADVERTENCIA: Puede ser algo bruto",
        "> ESTADO_GENERAL: Sin filtros activos",
    ];
    var i = 0;
    setInterval(function() {
        var div = document.createElement('div');
        div.textContent = msgs[i % msgs.length];
        div.style.opacity = '0';
        div.style.transition = 'opacity 0.5s';
        profileLog.appendChild(div);
        setTimeout(function() { div.style.opacity = '1'; }, 50);
        i++;
        while (profileLog.children.length > 7) profileLog.removeChild(profileLog.firstChild);
    }, 1600);
});

// Sidebar click behavior
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
