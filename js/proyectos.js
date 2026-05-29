/* ==========================================
   PROYECTOS.JS — Portafolio CJ_CORE — Cristia Gimenez
   ========================================== */

let isPowerOn = true;

    function togglePower() {
        isPowerOn = !isPowerOn;
        const body = document.body;
        const powerBtn = document.getElementById('btn-power');
        const powerLabel = document.getElementById('label-power');

        if (!isPowerOn) {
            body.classList.add('power-off');
            powerBtn.classList.remove('text-red-500/50');
            powerBtn.classList.add('text-green-500/50');
            powerLabel.innerText = "ENCENDER";
        } else {
            body.classList.remove('power-off');
            powerBtn.classList.add('text-red-500/50');
            powerBtn.classList.remove('text-green-500/50');
            powerLabel.innerText = "APAGAR";
        }
    }

    function triggerReset() {
        if (!isPowerOn) return;
        const resetOverlay = document.getElementById('reset-overlay');
        const progressBar = document.getElementById('reset-progress-bar');
        resetOverlay.classList.add('active');
        setTimeout(() => { progressBar.style.width = '100%'; }, 10);
        setTimeout(() => {
            resetOverlay.classList.remove('active');
            progressBar.style.width = '0%';
            window.location.reload(); 
        }, 2500);
    }

    function toggleTerminal() {
        const term = document.getElementById('terminal-overlay');
        term.classList.toggle('active');
        if (term.classList.contains('active')) {
            const logContent = document.getElementById('log-content');
            const newLine = document.createElement('div');
            newLine.className = "text-cyan-400/70";
            newLine.innerText = "> Ejecutando auditoría de proyectos: " + new Date().toLocaleTimeString();
            logContent.appendChild(newLine);
            term.scrollTop = term.scrollHeight;
        }
    }

    function createBinaryStreams() {
        const container = document.getElementById('background-fx');
        for (let i = 0; i < 15; i++) {
            const stream = document.createElement('div');
            stream.className = 'binary-stream';
            stream.style.left = Math.random() * 100 + '%';
            stream.style.animationDuration = (10 + Math.random() * 20) + 's';
            stream.style.animationDelay = (Math.random() * 5) + 's';
            let text = "";
            for(let j = 0; j < 40; j++) text += Math.round(Math.random()) + "<br>";
            stream.innerHTML = text;
            container.appendChild(stream);
        }
    }

    // Close dropdowns on click outside
    // ELIMINADO: este listener manipulaba directamente #lang-dropdown con clase
    // .active, lógica obsoleta del antiguo sistema de idioma. La lógica de
    // cierre del dropdown ahora vive en js/lang-button.js y usa .is-open en
    // #lang-wrapper.

    window.onload = createBinaryStreams;

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