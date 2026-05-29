/* ==========================================
   CONTACTO.JS — Portafolio CJ_CORE — Cristia Gimenez
   ========================================== */

let powerOn = true;

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

        // Typing Effect simulation
        let typingActive = false;
        function startTypingSimulation(textarea) {
            if (typingActive || textarea.value.length > 0) return;
            typingActive = true;
            
            const prompt = "SOLICITUD_DE_CONTACTO: ";
            let i = 0;
            
            const interval = setInterval(() => {
                if (i < prompt.length) {
                    textarea.value += prompt.charAt(i);
                    i++;
                } else {
                    clearInterval(interval);
                    typingActive = false;
                }
            }, 50);
        }

        // Form Submission
        document.getElementById('transmission-form').addEventListener('submit', (e) => {
            e.preventDefault();
            logTerminal("INICIANDO TRANSMISIÓN DE PAQUETE...", "text-primary-container font-bold uppercase animate-pulse mt-2");
            document.getElementById('terminal-overlay').classList.add('active');
            
            setTimeout(() => {
                logTerminal("TRANSMISIÓN EXITOSA. ACUSE_RECIBO_OK", "text-green-400 font-bold uppercase");
            }, 2000);
        });

        // Progress bar logic
        function updateProgress() {
            const nombre = document.querySelector('input[type="text"]').value.trim();
            const email = document.querySelector('input[type="email"]').value.trim();
            const mensaje = document.querySelector('textarea').value.trim();
            
            let progress = 0;
            if (nombre.length > 0) progress += 33;
            if (email.length > 0 && email.includes('@')) progress += 33;
            if (mensaje.length > 10) progress += 34;
            
            document.getElementById('progress-bar-fill').style.width = progress + '%';
            document.getElementById('progress-text').textContent = progress + '%';
        }
        
        document.querySelector('input[type="text"]').addEventListener('input', updateProgress);
        document.querySelector('input[type="email"]').addEventListener('input', updateProgress);
        document.querySelector('textarea').addEventListener('input', updateProgress);

        window.addEventListener('load', () => {
            initNebula();
            
            // Terminal log animation
            const messages = [
                "> Conexión segura establecida...",
                "> Protocolo P2P activo...",
                "> Esperando transmisión...",
                "> Encriptación AES_256 OK...",
                "> Buffer de datos limpio...",
                "> Sistema en espera...",
                "> Ping: 12ms — enlace estable...",
                "> Autenticación CJ_CORE: OK...",
            ];
            const log = document.getElementById('sys-log');
            let msgIndex = 0;
            
            setInterval(() => {
                if (!log) return;
                const div = document.createElement('div');
                div.textContent = messages[msgIndex % messages.length];
                div.style.opacity = '0';
                div.style.transition = 'opacity 0.5s';
                log.appendChild(div);
                setTimeout(() => div.style.opacity = '1', 50);
                msgIndex++;
                // Keep only last 3 lines
                while (log.children.length > 3) {
                    log.removeChild(log.firstChild);
                }
            }, 2000);
        });

        // Periodic Logs
        setInterval(() => {
            if (!powerOn) return;
            const terminal = document.getElementById('terminal-overlay');
            if (terminal.classList.contains('active')) {
                const logs = [
                    "Ping enlace: 12ms",
                    "Sincronizando...",
                    "Buffer activo.",
                    "Encriptación neural: OK",
                    "Handshake P2P: OK"
                ];
                logTerminal(logs[Math.floor(Math.random() * logs.length)], "text-primary-container/30");
            }
        }, 4000);

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