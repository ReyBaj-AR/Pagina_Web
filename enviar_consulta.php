<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = htmlspecialchars(trim($_POST["nombre"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $mensaje = htmlspecialchars(trim($_POST["mensaje"]));

    $destinatario = "javyvarela@gmail.com";
    $asunto = "Consulta desde el sitio web";
    $contenido = "Nombre: $nombre\n";
    $contenido .= "Email: $email\n";
    $contenido .= "Mensaje:\n$mensaje\n";
    $headers = "From: $email\r\nReply-To: $email\r\n";

    if (mail($destinatario, $asunto, $contenido, $headers)) {
        echo "<script>alert('¡Mensaje enviado correctamente!');window.location.href='Index.html';</script>";
    } else {
        echo "<script>alert('Error al enviar el mensaje. Intenta nuevamente.');window.history.back();</script>";
    }
} else {
    header("Location: Index.html");
    exit;
}
?>