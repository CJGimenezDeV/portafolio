<?php
/* ============================================================
   contacto.php — Procesa el formulario de contacto (CJ_CORE)
   ------------------------------------------------------------
   Recibe los datos por POST, los valida en servidor, comprueba
   el honeypot anti-spam, y envía el correo con PHPMailer (SMTP).
   Responde en JSON para que contacto.js sepa si fue bien o mal.
   ============================================================ */

// --- Respuesta siempre en JSON ---
header('Content-Type: application/json; charset=utf-8');

// --- Solo aceptamos POST ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

// --- Honeypot anti-spam ---
// El campo "website" está oculto por CSS. Un humano nunca lo rellena;
// los bots sí. Si llega con contenido, fingimos éxito y descartamos.
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]); // engañamos al bot
    exit;
}

// --- Recoger y limpiar datos ---
$nombre  = trim($_POST['nombre']  ?? '');
$email   = trim($_POST['email']   ?? '');
$mensaje = trim($_POST['mensaje'] ?? '');

// --- Validación en servidor (nunca fiarse solo del JS) ---
$errores = [];
if ($nombre === '' || mb_strlen($nombre) > 100) {
    $errores[] = 'Nombre no válido';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errores[] = 'Email no válido';
}
if (mb_strlen($mensaje) < 10 || mb_strlen($mensaje) > 5000) {
    $errores[] = 'Mensaje demasiado corto o largo';
}

if ($errores) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => implode('. ', $errores)]);
    exit;
}

// --- Cargar configuración (credenciales SMTP) ---
$config = require __DIR__ . '/config.php';

// --- Cargar PHPMailer ---
require __DIR__ . '/vendor/phpmailer/src/Exception.php';
require __DIR__ . '/vendor/phpmailer/src/PHPMailer.php';
require __DIR__ . '/vendor/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // --- Configuración del servidor SMTP ---
    $mail->isSMTP();
    $mail->Host       = $config['smtp_host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $config['smtp_user'];
    $mail->Password   = $config['smtp_pass'];
    $mail->SMTPSecure = $config['smtp_secure']; // 'ssl' para puerto 465
    $mail->Port       = $config['smtp_port'];
    $mail->CharSet    = 'UTF-8';

    // --- Remitente y destinatario ---
    // From = tu dominio (obligatorio para no caer en spam).
    // Reply-To = el visitante, para que al responder le contestes a él.
    $mail->setFrom($config['mail_from'], $config['mail_from_name']);
    $mail->addAddress($config['mail_to'], $config['mail_to_name']);
    $mail->addReplyTo($email, $nombre);

    // --- Contenido ---
    $mail->isHTML(true);
    $mail->Subject = 'Nuevo mensaje de ' . $nombre . ' — cjgimenez.com';

    $nombreSafe  = htmlspecialchars($nombre,  ENT_QUOTES, 'UTF-8');
    $emailSafe   = htmlspecialchars($email,   ENT_QUOTES, 'UTF-8');
    $mensajeSafe = nl2br(htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8'));

    $mail->Body =
        "<h2>Nuevo mensaje desde el portafolio</h2>" .
        "<p><strong>Nombre:</strong> {$nombreSafe}</p>" .
        "<p><strong>Email:</strong> {$emailSafe}</p>" .
        "<p><strong>Mensaje:</strong><br>{$mensajeSafe}</p>";

    $mail->AltBody =
        "Nuevo mensaje desde el portafolio\n\n" .
        "Nombre: {$nombre}\nEmail: {$email}\n\nMensaje:\n{$mensaje}";

    $mail->send();
    echo json_encode(['ok' => true]);

} catch (Exception $e) {
    http_response_code(500);
    // No exponemos el detalle técnico al usuario (puede revelar config).
    // Lo guardamos en el log del servidor para depurar.
    error_log('Error envío contacto: ' . $mail->ErrorInfo);
    echo json_encode(['ok' => false, 'error' => 'No se pudo enviar el mensaje. Inténtalo más tarde.']);
}
